/* 
* Soundbox Player 
*
* Copyright (c) 2011-2013 Marcus Geelnard
*
* This software is provided 'as-is', without any express or implied
* warranty. In no event will the authors be held liable for any damages
* arising from the use of this software.
*
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
*
* 1. The origin of this software must not be misrepresented; you must not
*    claim that you wrote the original software. If you use this software
*    in a product, an acknowledgment in the product documentation would be
*    appreciated but is not required.
*
* 2. Altered source versions must be plainly marked as such, and must not be
*    misrepresented as being the original software.
*
* 3. This notice may not be removed or altered from any source
*    distribution.
*
*/

var CPlayer = function() {

    //--------------------------------------------------------------------------
    // Private methods
    //--------------------------------------------------------------------------

    // Oscillators
    var osc_sin = function (value) {
        return Math.sin(value * 6.283184);
    };

    var osc_saw = function (value) {
        return 2 * (value % 1) - 1;
    };

    var osc_square = function (value) {
        return (value % 1) < 0.5 ? 1 : -1;
    };

    var osc_tri = function (value) {
        var v2 = (value % 1) * 4;
        if(v2 < 2) return v2 - 1;
        return 3 - v2;
    };

    var getnotefreq = function (n) {
        // 174.61.. / 44100 = 0.003959503758 (F3)
        return 0.003959503758 * Math.pow(2, (n - 128) / 12);
    };

    var createNote = function (instr, n, rowLen) {
        var osc1 = mOscillators[instr.i[0]],
            o1vol = instr.i[1],
            o1xenv = instr.i[3],
            osc2 = mOscillators[instr.i[4]],
            o2vol = instr.i[5],
            o2xenv = instr.i[8],
            noiseVol = instr.i[9],
            attack = instr.i[10] * instr.i[10] * 4,
            sustain = instr.i[11] * instr.i[11] * 4,
            release = instr.i[12] * instr.i[12] * 4,
            releaseInv = 1 / release,
            arp = instr.i[13],
            arpInterval = rowLen * Math.pow(2, 2 - instr.i[14]);

        var noteBuf = new Int32Array(attack + sustain + release);

        // Re-trig oscillators
        var c1 = 0, c2 = 0;

        // Local variables.
        var j, j2, e, t, rsample, o1t, o2t;

        // Generate one note (attack + sustain + release)
        for (j = 0, j2 = 0; j < attack + sustain + release; j++, j2++) {
            if (j2 >= 0) {
                // Switch arpeggio note.
                arp = (arp >> 8) | ((arp & 255) << 4);
                j2 -= arpInterval;

                // Calculate note frequencies for the oscillators
                o1t = getnotefreq(n + (arp & 15) + instr.i[2] - 128);
                o2t = getnotefreq(n + (arp & 15) + instr.i[6] - 128) * (1 + 0.0008 * instr.i[7]);
            }

            // Envelope
            e = 1;
            if (j < attack) {
                e = j / attack;
            } else if (j >= attack + sustain) {
                e -= (j - attack - sustain) * releaseInv;
            }

            // Oscillator 1
            t = o1t;
            if (o1xenv) {
                t *= e * e;
            }
            c1 += t;
            rsample = osc1(c1) * o1vol;

            // Oscillator 2
            t = o2t;
            if (o2xenv) {
                t *= e * e;
            }
            c2 += t;
            rsample += osc2(c2) * o2vol;

            // Noise oscillator
            if (noiseVol) {
                rsample += (2 * Math.random() - 1) * noiseVol;
            }

            // Add to (mono) channel buffer
            noteBuf[j] = (80 * rsample * e) | 0;
        }

        return noteBuf;
    };


    //--------------------------------------------------------------------------
    // Private members
    //--------------------------------------------------------------------------

    // Array of oscillator functions
    var mOscillators = [
        osc_sin,
        osc_square,
        osc_saw,
        osc_tri
    ];

    // Private variables set up by init()
    var mSong, mLastRow, mCurrentCol, mNumWords, mMixBuf;


    //--------------------------------------------------------------------------
    // Initialization
    //--------------------------------------------------------------------------

    this.init = function (song) {
        // Define the song
        mSong = song;

        // Init iteration state variables
        mLastRow = song.endPattern;
        mCurrentCol = 0;

        // Prepare song info
        mNumWords =  song.rowLen * song.patternLen * (mLastRow + 1) * 2;

        // Create work buffer (initially cleared)
        mMixBuf = new Int32Array(mNumWords);
    };


    //--------------------------------------------------------------------------
    // Public methods
    //--------------------------------------------------------------------------

    // Generate audio data for a single track
    this.generate = function () {
        // Local variables
        var i, j, b, p, row, col, n, cp,
            k, t, lfor, e, x, rsample, rowStartSample, f, da;

        // Put performance critical items in local variables
        var chnBuf = new Int32Array(mNumWords),
            instr = mSong.songData[mCurrentCol],
            rowLen = mSong.rowLen,
            patternLen = mSong.patternLen;

        // Clear effect state
        var low = 0, band = 0, high;
        var lsample, filterActive = false;

        // Clear note cache.
        var noteCache = [];

         // Patterns
         for (p = 0; p <= mLastRow; ++p) {
            cp = instr.p[p];

            // Pattern rows
            for (row = 0; row < patternLen; ++row) {
                // Execute effect command.
                var cmdNo = cp ? instr.c[cp - 1].f[row] : 0;
                if (cmdNo) {
                    instr.i[cmdNo - 1] = instr.c[cp - 1].f[row + patternLen] || 0;

                    // Clear the note cache since the instrument has changed.
                    if (cmdNo < 16) {
                        noteCache = [];
                    }
                }

                // Put performance critical instrument properties in local variables
                var oscLFO = mOscillators[instr.i[15]],
                    lfoAmt = instr.i[16] / 512,
                    lfoFreq = Math.pow(2, instr.i[17] - 9) / rowLen,
                    fxLFO = instr.i[18],
                    fxFilter = instr.i[19],
                    fxFreq = instr.i[20] * 43.23529 * 3.141592 / 44100,
                    q = 1 - instr.i[21] / 255,
                    dist = instr.i[22] * 1e-5,
                    drive = instr.i[23] / 32,
                    panAmt = instr.i[24] / 512,
                    panFreq = 6.283184 * Math.pow(2, instr.i[25] - 9) / rowLen,
                    dlyAmt = instr.i[26] / 255,
                    dly = instr.i[27] * rowLen & ~1;  // Must be an even number

                // Calculate start sample number for this row in the pattern
                rowStartSample = (p * patternLen + row) * rowLen;

                // Generate notes for this pattern row
                for (col = 0; col < 4; ++col) {
                    n = cp ? instr.c[cp - 1].n[row + col * patternLen] : 0;
                    if (n) {
                        if (!noteCache[n]) {
                            noteCache[n] = createNote(instr, n, rowLen);
                        }

                        // Copy note from the note cache
                        var noteBuf = noteCache[n];
                        for (j = 0, i = rowStartSample * 2; j < noteBuf.length; j++, i += 2) {
                          chnBuf[i] += noteBuf[j];
                        }
                    }
                }

                // Perform effects for this pattern row
                for (j = 0; j < rowLen; j++) {
                    // Dry mono-sample
                    k = (rowStartSample + j) * 2;
                    rsample = chnBuf[k];

                    // We only do effects if we have some sound input
                    if (rsample || filterActive) {
                        // State variable filter
                        f = fxFreq;
                        if (fxLFO) {
                            f *= oscLFO(lfoFreq * k) * lfoAmt + 0.5;
                        }
                        f = 1.5 * Math.sin(f);
                        low += f * band;
                        high = q * (rsample - band) - low;
                        band += f * high;
                        rsample = fxFilter == 3 ? band : fxFilter == 1 ? high : low;

                        // Distortion
                        if (dist) {
                            rsample *= dist;
                            rsample = rsample < 1 ? rsample > -1 ? osc_sin(rsample*.25) : -1 : 1;
                            rsample /= dist;
                        }

                        // Drive
                        rsample *= drive;

                        // Is the filter active (i.e. still audiable)?
                        filterActive = rsample * rsample > 1e-5;

                        // Panning
                        t = Math.sin(panFreq * k) * panAmt + 0.5;
                        lsample = rsample * (1 - t);
                        rsample *= t;
                    } else {
                        lsample = 0;
                    }

                    // Delay is always done, since it does not need sound input
                    if (k >= dly) {
                        // Left channel = left + right[-p] * t
                        lsample += chnBuf[k-dly+1] * dlyAmt;

                        // Right channel = right + left[-p] * t
                        rsample += chnBuf[k-dly] * dlyAmt;
                    }

                    // Store in stereo channel buffer (needed for the delay effect)
                    chnBuf[k] = lsample | 0;
                    chnBuf[k+1] = rsample | 0;

                    // ...and add to stereo mix buffer
                    mMixBuf[k] += lsample | 0;
                    mMixBuf[k+1] += rsample | 0;
                }
            }
        }

        // Next iteration. Return progress (1.0 == done!).
        mCurrentCol++;
        return mCurrentCol / mSong.numChannels;
    };

    // Create a WAVE formatted Uint8Array from the generated audio data
    this.createWave = function() {
        // Create WAVE header
        var headerLen = 44;
        var l1 = headerLen + mNumWords * 2 - 8;
        var l2 = l1 - 36;
        var wave = new Uint8Array(headerLen + mNumWords * 2);
        wave.set(
            [82,73,70,70,
             l1 & 255,(l1 >> 8) & 255,(l1 >> 16) & 255,(l1 >> 24) & 255,
             87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,
             68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,
             l2 & 255,(l2 >> 8) & 255,(l2 >> 16) & 255,(l2 >> 24) & 255]
        );

        // Append actual wave data
        for (var i = 0, idx = headerLen; i < mNumWords; ++i) {
            // Note: We clamp here
            var y = mMixBuf[i];
            y = y < -32767 ? -32767 : (y > 32767 ? 32767 : y);
            wave[idx++] = y & 255;
            wave[idx++] = (y >> 8) & 255;
        }

        // Return the WAVE formatted typed array
        return wave;
    };

    // Get n samples of wave data at time t [s]. Wave data in range [-2,2].
    this.getData = function(t, n) {
        var i = 2 * Math.floor(t * 44100);
        var d = new Array(n);
        for (var j = 0; j < 2*n; j += 1) {
            var k = i + j;
            d[j] = t > 0 && k < mMixBuf.length ? mMixBuf[k] / 32768 : 0;
        }
        return d;
    };
};

// -- End of soundbox player

// Song data
var song = {
  songData: [
    { // Instrument 0
      i: [
      0, // OSC1_WAVEFORM
      255, // OSC1_VOL
      116, // OSC1_SEMI
      1, // OSC1_XENV
      0, // OSC2_WAVEFORM
      255, // OSC2_VOL
      116, // OSC2_SEMI
      0, // OSC2_DETUNE
      1, // OSC2_XENV
      0, // NOISE_VOL
      4, // ENV_ATTACK
      6, // ENV_SUSTAIN
      35, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      0, // LFO_WAVEFORM
      0, // LFO_AMT
      0, // LFO_FREQ
      0, // LFO_FX_FREQ
      2, // FX_FILTER
      14, // FX_FREQ
      0, // FX_RESONANCE
      0, // FX_DIST
      32, // FX_DRIVE
      0, // FX_PAN_AMT
      0, // FX_PAN_FREQ
      0, // FX_DELAY_AMT
      0 // FX_DELAY_TIME
      ],
      // Patterns
      p: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      // Columns
      c: [
        {n: [135,,,,,,,,135,,,,,,,,135,,,,,,,,135],
         f: []}
      ]
    },
    { // Instrument 1
      i: [
      0, // OSC1_WAVEFORM
      91, // OSC1_VOL
      128, // OSC1_SEMI
      0, // OSC1_XENV
      1, // OSC2_WAVEFORM
      11, // OSC2_VOL
      128, // OSC2_SEMI
      12, // OSC2_DETUNE
      0, // OSC2_XENV
      0, // NOISE_VOL
      0, // ENV_ATTACK
      0, // ENV_SUSTAIN
      40, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      0, // LFO_WAVEFORM
      0, // LFO_AMT
      0, // LFO_FREQ
      0, // LFO_FX_FREQ
      2, // FX_FILTER
      255, // FX_FREQ
      0, // FX_RESONANCE
      0, // FX_DIST
      32, // FX_DRIVE
      83, // FX_PAN_AMT
      3, // FX_PAN_FREQ
      75, // FX_DELAY_AMT
      4 // FX_DELAY_TIME
      ],
      // Patterns
      p: [1,1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1,1,2,2],
      // Columns
      c: [
        {n: [111,,,,111,,,,111,,,,111,,,,111,,,,111,,,,111,,,,111],
         f: []},
        {n: [121,,,,121,,,,121,,,,121,,,,121,,,,121,,,,121,,,,121],
         f: []}
      ]
    },
    { // Instrument 2
      i: [
      0, // OSC1_WAVEFORM
      53, // OSC1_VOL
      128, // OSC1_SEMI
      1, // OSC1_XENV
      0, // OSC2_WAVEFORM
      25, // OSC2_VOL
      130, // OSC2_SEMI
      0, // OSC2_DETUNE
      1, // OSC2_XENV
      139, // NOISE_VOL
      0, // ENV_ATTACK
      7, // ENV_SUSTAIN
      59, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      0, // LFO_WAVEFORM
      60, // LFO_AMT
      4, // LFO_FREQ
      1, // LFO_FX_FREQ
      2, // FX_FILTER
      255, // FX_FREQ
      0, // FX_RESONANCE
      0, // FX_DIST
      19, // FX_DRIVE
      61, // FX_PAN_AMT
      5, // FX_PAN_FREQ
      0, // FX_DELAY_AMT
      6 // FX_DELAY_TIME
      ],
      // Patterns
      p: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      // Columns
      c: [
        {n: [,,,,,,,,147,,,,,,,,,,,,,,,,147],
         f: []}
      ]
    },
    { // Instrument 3
      i: [
      2, // OSC1_WAVEFORM
      100, // OSC1_VOL
      128, // OSC1_SEMI
      0, // OSC1_XENV
      3, // OSC2_WAVEFORM
      201, // OSC2_VOL
      128, // OSC2_SEMI
      0, // OSC2_DETUNE
      0, // OSC2_XENV
      0, // NOISE_VOL
      0, // ENV_ATTACK
      6, // ENV_SUSTAIN
      58, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      0, // LFO_WAVEFORM
      195, // LFO_AMT
      6, // LFO_FREQ
      1, // LFO_FX_FREQ
      2, // FX_FILTER
      92, // FX_FREQ
      35, // FX_RESONANCE
      0, // FX_DIST
      32, // FX_DRIVE
      147, // FX_PAN_AMT
      6, // FX_PAN_FREQ
      13, // FX_DELAY_AMT
      4 // FX_DELAY_TIME
      ],
      // Patterns
      p: [1,2,3,4,1,2,3,4,1,,,,1,,3,,1,2,3,,,,,,,,,,1,2,3,4],
      // Columns
      c: [
        {n: [147,,,,,,,,,,,,154],
         f: []},
        {n: [152,,,,,,,,151,,,,,,,,149,,,,151,,,,147],
         f: []},
        {n: [145,,,,,,,,,,,,152],
         f: []},
        {n: [150,,,,,,,,149,,,,,,,,147,,,,149,,,,145],
         f: []}
      ]
    },
    { // Instrument 4
      i: [
      1, // OSC1_WAVEFORM
      65, // OSC1_VOL
      128, // OSC1_SEMI
      0, // OSC1_XENV
      2, // OSC2_WAVEFORM
      44, // OSC2_VOL
      116, // OSC2_SEMI
      9, // OSC2_DETUNE
      0, // OSC2_XENV
      0, // NOISE_VOL
      0, // ENV_ATTACK
      9, // ENV_SUSTAIN
      34, // ENV_RELEASE
      0, // ARP_CHORD
      0, // ARP_SPEED
      0, // LFO_WAVEFORM
      69, // LFO_AMT
      3, // LFO_FREQ
      1, // LFO_FX_FREQ
      1, // FX_FILTER
      9, // FX_FREQ
      167, // FX_RESONANCE
      0, // FX_DIST
      32, // FX_DRIVE
      77, // FX_PAN_AMT
      6, // FX_PAN_FREQ
      3, // FX_DELAY_AMT
      6 // FX_DELAY_TIME
      ],
      // Patterns
      p: [1,1,2,2,1,1,2,2,1,1,2,2,1,1,2,2],
      // Columns
      c: [
        {n: [139,,140,,142,,147,,139,,140,,142,,147,,139,,140,,142,,147,,139,,140,,142,,147],
         f: [,,,,27,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3]},
        {n: [145,,144,,145,,142,,145,,144,,145,,142,,145,,144,,145,,142,,145,,144,,145,,142],
         f: []}
      ]
    },
  ],
  rowLen: 2363,   // In sample lengths
  patternLen: 32,  // Rows per pattern
  endPattern: 31,  // End pattern
  numChannels: 5  // Number of channels
};


// --- Initialization

var themeAudio;

var player = new CPlayer();
player.init(song);
// Generate music...
var done = false;
setInterval(function () {
  if (done) {
    return;
  }
  done = player.generate() >= 1;
  if (done) {
    var wave = player.createWave();
    themeAudio = document.createElement("audio");
    themeAudio.loop=true;
    themeAudio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
    document.getElementById('loading').style.display = 'none';
    document.getElementById('intro').style.display = 'block';
  }
}, 100);


// pRNG

// 1993 Park-Miller LCG, https://gist.github.com/blixt/f17b47c62508be59987b
function LCG(s) {
  return function() {
    s = Math.imul(16807, s) | 0 % 2147483647;
    return (s & 2147483647) / 2147483648;
  }
}

var seeded = LCG(13312);

var rands = {
  int: function(max) {
    return seeded() * (max || 0xfffffff) | 0;
  },
  range: function(min, max) {
    if (min === max) {
      return min;
    }
    return this.int(max - min) + min;
  },
  of(array) {
  	return array[this.int(array.length)];
  }
};

var rand = {
  int: function(max) {
    return Math.round(Math.random() * max);
  },
  of(array) {
  	return array[this.int(array.length)];
  }
};

// Monsters Model

var shapes = {
	head: [
		{
			h: 62,
			w: 74,
			cx: 37,
			cy: 31,
			rx: 35,
			ry: 30,
			shpath: "M37,51 a 39.81,39.81 0 0 0 34.47,-19.46 c 0,15.84 -15.43,28.69 -34.47,28.69 -19.04,0 -34.48,-12.85 -34.48,-28.69 a 39.74,39.74 0 0 0 34.48,19.46 z",
      anchors: {
        ear: [20, -25]
      }
		},
		{
			h: 60,
			w: 58,
			cx: 29,
			cy: 30,
			rx: 28,
			ry: 29,
			shpath: "m 28.215001,49.78733 c 19.18,0 27.16,-19.82 27.16,-19.82 0,15.66 -12.16,28.35 -27.16,28.35 -15,0 -27.1200004,-12.69 -27.1200004,-28.35 0,0 7.82,19.82 27.1200004,19.82 z",
      anchors: {
        ear: [15, -25]
      }
		},
		{
			h: 57,
			w: 83,
			path: "M81.26,26.49c4.36,13.72,2.56,29.92-39.91,29.92S-1.19,40.62,1.43,26.49C4.37,10.69,26,.5,41.35.5S76.05,10.12,81.26,26.49Z",
			shpath: "m 80.65,26.5 c 4.51,13.89 2.56,29.38 -39.32,29.38 -41.88,0 -42,-15.11 -39.3,-29.38 0,0 3,20 39.3,20 36.5,0 39.32,-20 39.32,-20 z",
      anchors: {
        ear: [25, -25]
      }
		},
		{
			h: 54,
			w: 60,
			cx: 30,
			cy: 27,
			rx: 30,
			ry: 26,
			shpath: "m 30.4,44.88 a 32.68,32.68 0 0 0 29.38,-17.1 c 0,14 -13.15,25.32 -29.38,25.32 -16.23,0 -29.38,-11.34 -29.38,-25.32 a 32.75,32.75 0 0 0 29.38,17.1 z",
      anchors: {
        ear: [21, -21]
      }
		},
	],
	eye: [
		{
			h: 22,
			w: 20,
			path: "M.69.5,18.92,16.07S14.69,24.9,5.79,20.62,1.32,4.11,4,3.3",
			f: "white",
			p2: "M8.35,7.54S6,11.43,7.47,13.71s6.26-2.07,6.26-2.07",
			anchor: [10, 10]
		},
		{
			h: 20,
			w: 10,
			cx: 5,
			cy: 10,
			rx: 4,
			ry: 9,
			rotate: -10,
			c2: {
				cx: 4,
				cy: 5,
				rx: 2,
				ry: 2,
				f: 'white'
			},
			shpath: "M 5.5,14.8 C 8.8,14.6 9.2,9.5 9.2,9.5 9.6,14.7 8.3,18.5 5.8,18.6 3.4,18.8 1.6,15.3 1.3,10.2 c 0,0 0.9,5 4.3,4.7 z"
		},
		{
			h: 22,
			w: 20,
			path: "M2.38,18.63c2.82,1.47,7.75.89,9.68-2.87S9.69-.44,4.8.56-.67,17,2.38,18.63Z",
			c2: {
				cx: 6,
				cy: 5,
				rx: 2,
				ry: 3,
				f: 'white'
			},
			shpath: "m 2.6,18.3 c 2.5,1.3 7.3,0.8 9,-2.7 a 8.7,8.7 0 0 0 0.1,-4.9 c 0,0 0.1,4.2 -5.3,5.4 a 4.4,4.4 0 0 1 -5.5,-3.6 c 0,2.8 0.6,5.2 1.6,5.8 z"
		},
		{
			h: 12,
			w: 12,
			cx: 6,
			cy: 6,
			rx: 5,
			ry: 5,
			c2: {
				cx: 6,
				cy: 4,
				rx: 2,
				ry: 2,
				f: 'white'
			}
		}
	],
	body: [
		{
			h: 45,
			w: 54,
			cx: 27,
			cy: 23,
			rx: 26,
			ry: 22,
			anchor: [26, 30],
			shpath: "m 26.9,36 c 20,0 25.9,-13.1 25.9,-13.1 0,11.1 -11.6,21.3 -25.9,21.3 -14.3,0 -25.9,-10.2 -25.9,-21.3 0,0 5.9,13.1 25.9,13.1 z"
		},
		{
			h: 47,
			w: 52,
			path: "M51.06,20.36c0,14.33-11.32,25.94-25.28,25.94S.5,34.69.5,20.36,11.82.5,25.78.5,51.06,6,51.06,20.36Z",
			anchor: [26, 30],
			shpath: "m 50.54,20.5 c 0,14 -11.06,25.36 -24.76,25.36 -13.7,0 -24.76,-11.36 -24.76,-25.36 0,0 6.83,17.06 24.76,17.06 17.93,0 24.76,-17.06 24.76,-17.06 z"
		},
		{
			h: 51,
			w: 47,
			path: "M46,23.73C48.43,36,47.42,50.47,23.5,50.47S-.45,36.36,1,23.73C2.68,9.61,14.85.5,23.5.5S43,9.1,46,23.73Z",
			anchor: [24, 24],
			shpath: "m 45.48,23.5 c 2.52,12.26 1.35,26.2 -22,26.2 -23.35,0 -23.47,-13.62 -22,-26.2 0,0 1.25,17 22,17 20.75,0 22,-17 22,-17 z"
		}
	],
	mouth: [
    {
      none: true
    },
		{
			h: 8,
			w: 46,
			path: "M.5.8S3.85,6.11,13.25,4.39c3.62-.67,7.79,3.12,9.93,3.12,3.37,0,6-3.57,10.07-3.28,6.88.49,10.5-.46,12.22-3.73",
			anchor: [22, 4],
			line: true
		},
		{
			h: 7,
			w: 44,
			path: "M.5.5S7.61,5.66,21.88,5.66,43.3.52,43.3.52",
			line: true
		},
		{ // TODO: Add polyline fangs
			h: 11,
			w: 35,
			path: "M.5,10.12a57.31,57.31,0,0,1,34,0",
			line: true
		},
		{
			h: 5,
			w: 34,
			path: "M.5.5q8,7.41,16,0c5.47,5,11,4.87,16.63,0",
			line: true
		}
	],
	arm: [
    {
      none: true
    },
		{
			h: 25,
			w: 28,
			path: "M22.81.5S-2.46,10.22.79,20.28s23.36-.88,26.42-5.87",
			anchor: [21, 21],
			shpath: "m 26,10.5 c -11,14.5 -24.5,9.6 -24.5,9.6 3.4,10 23.3,-1.7 25.7,-6.5"
		},
		{
			h: 19,
			w: 22,
			path: "M21.06.5C13,5.3.26,2.66.5,10s20.56,8.35,20.56,8.35",
			anchor: [20, 15],
			shpath: "m 21,11 v 6.7 c 0,0 -19.8,-1.1 -20,-7.7 0,0 17.7,9.35 20,1 z"
		},
		{
			h: 19,
			w: 18,
			path: "M13.38.5S-2.17,5.62.9,12.79s16.49,4.76,16.49,4.76",
			anchor: [13, 16],
			shpath: "m 1.3,12.4 c 0,0 10.2,7 14.8,-0.16 l 1.15,4.82 c 0,0 -13.4,2.27 -16,-4.6 z"
		}
	],
	ear: [
    {
      none: true
    },
		{
			h: 20,
			w: 25,
			path: "M3.62,19.15S-4.44,6.63,5.35,1.34c7.32-4,14.52,7.51,19,5.92",
			anchor: [9, 9],
			shpath: "m 4.1,18.8 19.2,-11 a 8.59,8.59 0 0 1 -4.1,-1.61 l -16.6,9.7 a 20.49,20.49 0 0 0 1.54,2.91 z"
		},
		{
			h: 37,
			w: 37,
			path: "M36.09,29.6C31.23,15.79,10.69-6,2.22,2.36c-8.64,8.55,17.67,32.09,25.26,33.78",
			anchor: [28, 30],
			shpath: "m 35.70637,29.950083 a 27.34,27.34 0 0 0 -2.19,-5 c -2.1,-3.91 -8.87,-8.66 -13,-5.39 -4.13,3.27 -2.8,10.42 1.42,13.2 4.89,3.22 6.11,3.11 6.11,3.11 z"
		}
	],
	feet: [
    {
      none: true
    },
		{
			h: 34,
			w: 34,
			path: "M8.49,29.84c8.45,4.14,14.86,5,20.51.24s4.51-10,1-20.94C26.91-.35,13.8-2.15,5.62,4.38S-.46,25.45,8.49,29.84Z",
			anchor: [16, 16],
			shpath: "m 8.589476,29.806167 c 7.73,3.81 14.46,5.29 20.06,0.49 3.75,-3.21 4.39,-6.3 3.42,-11.47 0,0 -0.8,8 -14.55,7.27 -12.74,-0.64 -16,-6.05 -16,-6.05 0.99,4.13 3.11,7.8 7.07,9.76 z"
		},
		/*{ Not matching very well
			h: 25,
			w: 32,
			path: "M.65.5S-1.82,20.12,13,23.75s17.69-12.5,17.69-12.5",
			anchor: [16, 19]
		},*/
		{
			h: 26,
			w: 22,
			cx: 11,
			cy: 13,
			rx: 9,
			ry: 12,
			rotate: 20,
			shpath: "m 12,18 c 5.9,-1.3 8.2,-5.2 8.2,-5.2 0.4,3 -3.6,7 -5.7,8.7 -3.6,2.9 -9.4,1 -11.8,-4.7 3,1.6 6,2 9,1 z"
		},
	]
};

const skeletons = [  
  {
  	arm: [20, 0],
  	body: [0, 0],
  	feet: [20, 20],
  	ear: [25, -60],
  	head: [0, -40],
  	eye: [15, -40],
  	mouth: [0, -20]
  },
  {
    arm: [20, 0],
    feet: [20, 20],
    ear: [15, -40],
    head: [0, 0],
    eye: [15, 0],
    mouth: [0, 15]
  }
];

const eyeColors = [
	'da575d', '007976', '000000', '222222'
]

function randomColorf(colors) {
	return '#' + rands.of(colors);
}

function randomPastel(){
  return "hsla(" + ~~(rands.int(360)) + ",70%,70%,1)"
}

function darker(hex, percent){
  if (hex.indexOf('hsla') == 0) {
    var hue = hex.substring(hex.indexOf("(") + 1, hex.indexOf(","))
    return "hsla(" + hue + ",70%,60%,1)"
  }
    hex = hex.substr(1);
    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);
   	r = Math.floor(r - (256 - r) * percent / 100);
   	g = Math.floor(g - (256 - g) * percent / 100);
   	b = Math.floor(b - (256 - b) * percent / 100);
   	if (r < 0) r = 0;
   	if (g < 0) g = 0;
   	if (b < 0) b = 0;
    return '#' + hexa(r) + hexa(g) + hexa(b);
}

function hexa(n) {
	return pad(n.toString(16));
}

function pad(h) {
	return h < 10 ? '0' + h : h;
}

const vow = 'aeiou';
const con = 'bcdfgjklmnprstx';

function randomName() {
	const syl = rands.range(2, 4);
	let name = '';
	for (let i = 0; i < syl; i++) {
		name += rSyl();
	}
	return name.charAt(0).toUpperCase() + name.substring(1); 
}

function rSyl() {
	return rands.of(con) + rands.of(vow) + ((rands.int(100) > 50) ? rands.of(con) : '');
}

let anatomySeq = 0;
function randomAnatomy() {
	return {
		id: anatomySeq++,
		name: randomName(),
		type: rands.of(skeletons),
		bps: {
			arm: randi(shapes.arm),
			body: randi(shapes.body),
			feet: randi(shapes.feet),
			ear: randi(shapes.ear),
			head: randi(shapes.head),
			eye: randi(shapes.eye),
			mouth: randi(shapes.mouth)
		},
		colors: {
			default: randomPastel(),
			eye: randomColorf(eyeColors)
		}

	}
}

function randi(array) {
	return rands.int(array.length);
}

const defs = [];
for (let i = 0; i < 151; i++) {
	defs.push(randomAnatomy());
}

// Worlds model

const locColors = ['Red', 'Blue', 'Yellow', 'Green', 'Cyan', 'Magenta', 'Saffron', 'Obsidian', 'Viridian'];
const locTypes = ['Pond', 'Forest', 'Lake', 'Town', 'Cave', 'City', 'Shrine', 'Temple', 'Tower', 'Lagoon', 'Mountain'];
let roadCount = 1;
function locName() {
	switch (rands.int(3)) {
		case 0: return rands.of(locColors) + ' ' + rands.of(locTypes);
		case 1: return rands.of(locTypes) + ' of ' + randomName();
		case 2: return 'Road ' + roadCount++;
	}
	return rands.of(locTypes)
}

const locs = [];
for (let x = 0; x < 10; x++) {
	locs[x] = []
	for (let y = 0; y < 10; y++) {
		locs[x][y] = { name: locName(), m: [] };
	}
}

function scatterDef(def) {
	const x = rands.range(0, 9);
	const y = rands.range(0, 9);
	locs[x][y].m.push(def);
}

defs.forEach(def => scatterDef(def));

for (let i = 0; i < 100; i++) {
	scatterDef(defs[rands.range(0, defs.length - 1)]);
}


// UI setup

function setupUI() {
	const buttonsContainer = document.getElementById('buttons');
	function addButton(label, cb) {
		var button = document.createElement("button");
		button.innerHTML = label;
		buttonsContainer.appendChild(button);
		button.addEventListener("click", cb);
	}

	addButton('Backpack', () => backpack());
	addButton('North', () => move(0, -1));
	addButton('South', () => move(0, 1));
	addButton('West', () => move(-1, 0));
	addButton('East', () => move(1, 0));
	addButton('Catch', () => catchit());
}

function move(dx, dy) {
	if (model.p < 1) {
		message('Not enough energy points');
		return;
	}
	showingBackpack = false;
	disable(true);
	message('Walking...');
	document.getElementById("container").innerHTML = '';
	setTimeout(() => {
		model.x += dx + 10;
		model.y += dy + 10;
		model.x = Math.abs(model.x) % 10;
		model.y = Math.abs(model.y) % 10;
		model.p--;
		save();
		land();
		disable(false);
	}, 1000);
}

let currentMonster;

function catchit() {
	if (showingBackpack) {
		backpack();
	}
	if (!currentMonster) {
		message('Nothing to catch!');
		return;
	}
	if (model.p < 5) {
		message('Not enough energy!');
		return;
	}
	if (model.m[currentMonster.id]) {
		message('You already have it.');
		return;
	}
	model.m[currentMonster.id] = true;
	model.p -= 5;
	message('You catch the ' + currentMonster.name);
	currentMonster = false;
	save();
	update();
	backpack();
}


// Display

function createPath(fillColor, pathCommands) {
	return '<path fill="'+fillColor+'" stroke="#222222" stroke-width="1" d="'+pathCommands+'"/>';
}

function pPath(fillColor, pathCommands) {
	return '<path fill="'+fillColor+'" d="'+pathCommands+'"/>';
}

function sPath(pathCommands) {
	return '<path fill="none" stroke="#222222" stroke-width="1" d="'+pathCommands+'"/>';
}

function createCircle(fillColor, bp) {
	return '<ellipse fill="'+fillColor+'" stroke="#222222" stroke-width="1" cx="'+bp.cx+'" cy="'+bp.cy+'" rx="'+bp.rx+'" ry="'+bp.ry+'"/>';
}

function createElement(bodyPartKey, bodyParts, colors, x, y, flip, container) {
	if (!Array.isArray(bodyParts)) {
		bodyParts = [bodyParts];
	}
	const b = bodyParts[0];
  if (b.none) {
    return;
  }
	const baseTransform = b.transform; 
	const flipTransform = flip ? 'scale(-1,1)' : false;
	const rotateTransform = b.rotate ? 'rotate(' + (flip ? -b.rotate : b.rotate) + ')' : false;
	let transform = '';
	if (rotateTransform || flipTransform) {
		transform = ' transform="' + (rotateTransform ? rotateTransform : '') + ' ' + (flipTransform ? flipTransform : '') + '" ';
	}
	if (!b.anchor) {
		b.anchor = [b.w / 2, b.h / 2];
	}
	const xAnchor = flip ? b.w - b.anchor[0] : b.anchor[0];
	var svgContent = '<svg width = "'+b.w+'" height = "'+b.h+'" style = "position: absolute; left: ' + (x - xAnchor ) + '; top: ' + ( y - b.anchor[1]) + '"' + transform + '>';
	const color = colors[bodyPartKey] || colors.default;
	bodyParts.forEach((bodyPart, i) => {
		if (bodyPart.path) {
			if (bodyPart.line) {
				svgContent += sPath(bodyPart.path);
			} else {
				svgContent += createPath(bodyPart.f || color, bodyPart.path);
			}
		} else {
			svgContent += createCircle(bodyPart.f || color, bodyPart);
		}
		if (bodyPart.shpath)
			svgContent += pPath(darker(color, 20), bodyPart.shpath);
		if (bodyPart.p2)
			svgContent += createPath(bodyPart.f2 || color, bodyPart.p2);
		if (bodyPart.c2)
			svgContent += createCircle(bodyPart.c2.f || color, bodyPart.c2);
	});
	svgContent += '</svg>';
	container.innerHTML += svgContent;
}


const locRefs = {
  ear: 'head'
}

function showMonster(anatomy, x, y, container, scale) {
	Object.keys(anatomy.type).forEach(bodyPart => {
		let xvar = anatomy.type[bodyPart][0];
		let yvar = anatomy.type[bodyPart][1]; 
    if (locRefs[bodyPart]) {
      const anchorBP = shapes[locRefs[bodyPart]][anatomy.bps[locRefs[bodyPart]]];
      xvar = anatomy.type[locRefs[bodyPart]][0] + anchorBP.anchors[bodyPart][0];
      yvar = anatomy.type[locRefs[bodyPart]][1] + anchorBP.anchors[bodyPart][1];
    }
		createElement(bodyPart, shapes[bodyPart][anatomy.bps[bodyPart]], anatomy.colors, x - xvar, y + yvar, false, container);
		if (xvar) {
			createElement(bodyPart, shapes[bodyPart][anatomy.bps[bodyPart]], anatomy.colors, x + xvar, y + yvar, true, container);
		}
	});
}

function update () {
	var status = locs[model.x][model.y].name + '<br>Energy: ' + model.p;
	document.getElementById("location").innerHTML = status;
	if (!showingBackpack) {
		document.getElementById("container").innerHTML = '';
		if (currentMonster) {
			showMonster(currentMonster, 0, 100, document.getElementById("container"), 1);
		}
	}
}

function message(m) {
	document.getElementById("message").innerHTML = m;
}

let showingBackpack = false;
function backpack() {
	showingBackpack = !showingBackpack;
	if (showingBackpack) {
		document.getElementById("container").innerHTML = '';
		count = 0;
		Object.keys(model.m).forEach(key => {
			if (!defs[key]) return;
			var div = document.createElement("div");
			div.style.position = 'relative';
			div.style.display = 'inline-block';
			div.style.width = '120px';
			div.style.height = '180px';
      div.style.border = '1px solid #333';
      div.style.borderRadius = '10px';
      div.style.margin = '5px';
      div.style.verticalAlign = 'top';
			showMonster(defs[key], 60, 140, div, 1);
			var label = document.createElement("p");
			label.style.textAlign = 'center';
			label.innerHTML = '#'+defs[key].id+' - '+defs[key].name;
			div.appendChild(label);
			document.getElementById("container").appendChild(div);
			count++;
		});
		var label = document.createElement("p");
		label.innerHTML = Math.round((count/151)*100)+"% of monsters captured.";
		document.getElementById("container").appendChild(label);
	} else {
		update();
	}
}

function disable(disable) {
	var buttons = document.getElementsByTagName('button');
	for (var i = 0; i < buttons.length; i++) {
	    buttons[i].disabled = disable ? "disabled" : "";
	}

}

// Restore Game
let model;
function restoreGame() {
	model = localStorage.getItem("bpmSave");
	if (model) {
		try {
			model = JSON.parse(model);
		} catch (e) {}
	}

	if (!model) {
		model = { x: 5, y: 5, p: 40, m: {}, lastGrant: +new Date() };
	}
}

function save() {
	localStorage.setItem("bpmSave", JSON.stringify(model));
}

// In game functions

function recoverMP() {
	if (model.p >= 40) return;
	const time = +new Date();
	const timeDiff = time - model.lastGrant;
	const bonus = Math.floor(timeDiff / 20000);
	if (bonus > 0) {
		model.p += bonus;
		if (model.p > 40) {
			model.p = 40;
		}
		model.lastGrant = time;
		save();
		update();
	}
}

function land() {
	currentMonster = getMonsterAtLocation();
	if (currentMonster) {
		message('There\'s a ' + currentMonster.name + ' here!');
	} else {
		message('Nothing here.');
	}
	update();
}

function getMonsterAtLocation() {
	return rand.of(locs[model.x][model.y].m);
}

function init() {
	restoreGame();
	setupUI();
}

function start() {
	setInterval(() => recoverMP(), 1000);
	document.getElementById('intro').style.display = 'none';
	document.getElementById('game').style.display = 'block';
  themeAudio.play();
	land();
}

window.init = init;
window.start = start;