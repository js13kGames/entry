import CPlayer from './audio/player-small';

import song from './audio/song';
import sndSplode1 from './audio/sndSplode1';
import sndSplode2 from './audio/sndSplode2';
import sndSplode3 from './audio/sndSplode3';
import sndShield from './audio/sndShield';

export default function Audio(state) {

  let ctx = new AudioContext(),
      audioMaster = ctx.createGain();

  audioMaster.connect(ctx.destination);

  const sounds = {};

  const addSound = (name, buffer) => {
    sounds[name] = buffer;
  };

  const data = [
    { name: 'song', data: song },
    { name: 'sndSplode1', data: sndSplode1 },
    { name: 'sndSplode2', data: sndSplode2 },
    { name: 'sndSplode3', data: sndSplode3 },
    { name: 'sndShield', data: sndShield }
  ];

  this.generate = () => {

    data.forEach(o => {
      let generator = new CPlayer();
      generator.init(o.data);
      function step() {
        if (generator.generate() === 1) {
          let wave = generator.createWave().buffer;
          ctx.decodeAudioData(wave, buffer => {
            addSound(o.name, buffer);
          });
        } else {      
          setTimeout(step, 0);
        }
      }
      step();
    });

    return new Promise(resolve => {
      function check() {
        if (Object.keys(sounds).length === data.length) {
          resolve();
          return;
        }
        setTimeout(check, 100);
      }
      check();
    });
  };



  this.playSound = (name, playbackRate = 1, pan = 0, volume = .5, loop = false) => {
    const buffer = sounds[name];

    if (!buffer) {
      return null;
    }

    let source = ctx.createBufferSource(),
        gainNode = ctx.createGain(),
        panNode = ctx.createStereoPanner();

    source.buffer = buffer;
    source.connect(panNode);
    panNode.connect(gainNode);
    gainNode.connect(audioMaster);

    source.playbackRate.value = playbackRate;
    source.loop = loop;
    gainNode.gain.value = volume;
    panNode.pan.value = pan;
    source.start();
    return {
      volume: gainNode,
      sound: source
    };
  };

}
