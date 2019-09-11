
function explosionSound(size, x, y, isShoot, volBoost = 0.6)
{
	var dist = distance(camera.x, camera.y, x, y);
	var factor = Math.min(Math.max(500.0 / (dist * 10.0), 0.005), 1.0);
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
		zzfx(Math.min(factor * size * 2.0, 1.0),0,rrg(freq, freq + 100.0), rrg(1, size * 0.1) * size * l * 2.0,0,0,8,0,0); // ZzFX 15338
	}
	 // ZzFX 15338
}

var ntable = 
[
	0,
	-9,
	-2,
	+3,
	+9,
	+13,
	+10,
	+15,
	+6,
	-1,
	-7,
	-21,
	-15,
	-16,
	-4,
	-3,
	+1,
	-14,
	-12,
	-10,
	+6
]

var spaceSong = 
[	
	// Lead 0 // Lead 1 // Lead 2	// Drum 3
	1 		, 4			, 5			, 1		,
	0		, 2			, 0			, 0		,
	0		, 3			, 0			, 2		,
	0		, 4			, 0			, 0		,
	0		, 5			, 0			, 1		,
	0		, 4			, 0			, 0		,
	0		, 3			, 0			, 2		,
	0		, 2			, 0			, 2		,
	1 		, 6			, 7			, 1		,
	0		, 2			, 0			, 0		,
	0		, 3			, 0			, 2		,
	0		, 6			, 0			, 0		,
	0		, 7			, 0			, 1		,
	0		, 6			, 0			, 0		,
	0		, 3			, 0			, 2		,
	0		, 2			, 0			, 2		,
]

var desertPlanetSong = 
[	
	// Lead 0 // Lead 1 // Lead 2	// Drum 3
	13		, 19		, 20		, 7		,
	13		, 19		, 0			, 0		,
	17		, 15		, 10		, 1		,
	0		, 0			, 0			, 0		,
	18		, 15		, 10		, 0		,
	18		, 0			, 10		, 0		,
	17		, 1			, 20		, 0		,
	0		, 0			, 0			, 0		,
]

var terraPlanetSong = 
[
	// Lead 0 // Lead 1 // Lead 2	// Drum 3
	16		, 4			, 0			, 0		,
	15		, 0			, 0			, 0		,
	20		, 5			, 0			, 0		,
	16		, 0			, 0			, 0		,
	15		, 0			, 0			, 0		,
	20		, 5			, 0			, 0		,
	19		, 4			, 0			, 0		,
	9		, 0			, 0			, 0		,
]

var rockyPlanetSong = 
[	
	// Lead 0 // Lead 1 // Lead 2	// Drum 3
	1 		, 0			, 0			, 1		,
	10		, 0			, 0			, 1		,
	15		, 0			, 0			, 7		,
	16		, 0			, 0			, 0		,
	1		, 0			, 0			, 1		,
	10		, 0			, 0			, 1		,
	15		, 0			, 0			, 7		,
	16		, 0			, 0			, 0		,
	15		, 0			, 0			, 1		,
	10		, 0			, 0			, 1		,
	1		, 0			, 0			, 7		,
	10		, 0			, 0			, 0		,
]

var combatSong = 
[
	0		, 11		, 0			, 11		,
	0		, 11		, 0			, 0		,
	0		, 0			, 0			, 7		,
	0		, 0			, 0			, 0		,
	0		, 0			, 0			, 11		,
	0		, 11		, 0			, 0		,
	0		, 12		, 0			, 7		,
	0		, 13		, 0			, 0		,
	0		, 11		, 1			, 11		,
	0		, 11		, 15		, 0		,
	0		, 0			, 14		, 7		,
	0		, 0			, 1			, 0		,
	0		, 0			, 0			, 11		,
	0		, 11		, 0			, 0		,
	0		, 12		, 1			, 7		,
	0		, 13		, 15		, 0		,
]

var musicTimer = 2.0;
var musicTempo = 1.0 / 4.0;
var musicPtr = 0;
var musicVol = 0.10;
var song = combatSong;
var selectSong = 0;
var muteMusic = false;

function music(dt)
{	
	if(!muteMusic)
	{

		musicVol = 0.07;
		if(selectSong == 0)
		{
			song = spaceSong;
		}
		else if(selectSong == 1)
		{
			song = rockyPlanetSong;
		}
		else if(selectSong == 2)
		{
			song = combatSong;
			musicVol = 0.11;
		}
		else if(selectSong == 3)
		{
			song = desertPlanetSong;
		}
		else if(selectSong == 4)
		{
			song = terraPlanetSong;
		}

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
				if(note != 0)
				{
					var freq = 440.0 * Math.pow(1.05946, ntable[note]);
					zzfx(musicVol,0,freq,length,0,0,noise,0.0,0);
				}
			}		
		}
	}
}
