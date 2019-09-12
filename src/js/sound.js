
function explosionSound(size, x, y, isShoot, volBoost = 0.6)
{
	var dist = distance(camera.x, camera.y, x, y);
	var factor = Math.min(Math.max(700.0 / (dist * 10.0), 0.005), 1.0);
	var l = 0.05 + size * 1.7;
	//var freq = Math.min(100 / (Math.pow(size, 2.6) * 460.0), 500.0);
	freq = rrg(150 - size * 0.14, 280 - size * 0.14);

	if(!isShoot)
	{
		l = 0.1 + size * 0.67;

		
	}

	//freq /= Math.max(dist / 6200.0, 1.0);

	
	factor *= volBoost;

	zzfx(Math.min(factor * 4.0, 1.0),0,rrg(freq - size * 200.0, freq * 2.0), l,-5.0,0,8,0,.81);
	if(isShoot)
	{
		zzfx(Math.min(factor * size * 2.0, 1.0),0,rrg(freq, freq + 100.0), rrg(1, size * 0.1) * size * l * 4.0,0,0,8,0,0); // ZzFX 15338
	}
	 // ZzFX 15338
}

var spaceSong = 
[	

	-9 		, -9			, 13		, -9	,
			, -2			, 			, 		,
			, -3			, 			, -2	,
			, -9			, 			, 		,
			, -10			, 			, -9	,
			, -9			, 			, 		,
			, -3			, 			, -2	,
			, -2			, 			, -2	,
	-9		, -10			, 15		, -9	,
			, -2			, 			, 		,
			, -3			, 			, -2	,
			, -10			, 			, 		,
			, -15			, 			, -9	,
			, -10			, 			, 		,
			, -3			, 			, -2	,
			, -2			, 			, -2	,
]
//var arpeggio = 0;
/*
for(var i = 0; i < 16; i++)
{
	var base = Math.floor(noise.perlin2(i * 0.25, 5.0) * 12.0);
	for(var j = 0; j < 8; j++)
	{
		// Base plays
		if(rrg(0, 1000) >= 500)
		{
			spaceSong[(i * 8 + j) * 4 + 0] = base;
		}

		if(noise.perlin2(i * 0.25 + j * 0.5, 5.0) >= 0.4)
		{
			spaceSong[(i * 8 + j) * 4 + 1] = base - 4;
			spaceSong[(i * 8 + j) * 4 + 2] = base + 4;
		}
		else if(noise.perlin2(i * 0.25 + j * 0.5, 1.0) >= 0.2)
		{
			// Disonant
			spaceSong[(i * 8 + j) * 4 + 1] = base - 3;
			spaceSong[(i * 8 + j) * 4 + 2] = base + 3;
		}
		else 
		{
			// Arpeggio
			spaceSong[(i * 8 + j) * 4 + 1] = base + arpeggio;
			spaceSong[(i * 8 + j) * 4 + 2] = base - arpeggio;

			arpeggio += rrg(-4, 4);
		}

		if(j % 2 == 0)
		{
			spaceSong[(i * 8 + j) * 4 + 3] = rrg(-16, -2);
		}
	}
	
}
*/

var desertPlanetSong = 
[	
	-16		, -10		, -6			, -3,
	-16		, -10		, 			, 		,
	-14		, -3		, -7		, -9	,
			, 			, 			, 		,
	-12		, -3		, -7		, 		,
	-12		, 			, -7		, 		,
	-14		, -9		, -6			, 		,
			, 			, 			, 		,
]

// Mal
var terraPlanetSong = 
[
	1		, -1		, 			, 		,
	-3		, 			, 			, 		,
	-6		, -16		, 			, 		,
	1		, 			, 			, 		,
	-3		, 			, 			, 		,
	-6		, -16		, 			, 		,
	-10		, -1		, 			, 		,
	-1		, 			, 			, 		,
]

var rockyPlanetSong = 
[	
	-9 		, 			, 			, -9		,
	-7		, 			, 			, -9		,
	-3		, 			, 			, -3		,
	1		, 			, 			, 		,
	-9		, 			, 			, -9		,
	-7		, 			, 			, -9		,
	-3		, 			, 			, -3		,
	1		, 			, 			, 		,
	-3		, 			, 			, -9		,
	-7		, 			, 			, -9		,
	-9		, 			, 			, -3		,
	-7		, 			, 			, 		,
]

var combatSong = 
[
			, -21		, 			, -21	,
			, -21		, 			, 		,
			, 			, 			, -3	,
			, 			, 			, 		,
			, 			, 			, -21	,
			, -21		, 			, 		,
			, -15		, 			, -3	,
			, -16		, 			, 		,
			, -21		, -9		, -21	,
			, -21		, -3		, 		,
			, 			, -4		, -3	,
			, 			, -9		, 		,
			, 			, 			, -21	,
			, -21		, 			, 		,
			, -15		, -9		, -3	,
			, -16		, -3		, 		,
]

var musicTimer = 2.0;
var musicTempo = 1.0 / 4.0;
var musicPtr = 0;
var musicVol = 0.10;
var song = spaceSong;
var muteMusic = false;

function music(dt)
{	
	if(muteMusic)
	{
		return;
	}

	musicVol = 0.07;
	musicTimer -= dt;

	if(musicTimer <= 0.0)
	{
		musicPtr++;
		musicTimer = musicTempo;

		if(musicPtr * 4 > song.length - 1)
		{
			musicPtr = 0;
		}
		
		for(var i = 0; i < 4; i++)
		{
			var noise = i == 3 ? 3.0 : 0.0;
			var length = i == 3 ? musicTempo / 2.0 : musicTempo * 1.3;
			var note = song[musicPtr * 4 + i];
			if(note != undefined)
			{
				var freq = 440.0 * Math.pow(1.05946, note);
				zzfx(musicVol,0,freq,length,0,0,noise,0.0,0);
			}
		}		
	}
}
