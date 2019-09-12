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
  	return array[this.int(array.length - 1)];
  }
};

var rand = {
  int: function(max) {
    return Math.round(Math.random() * max);
  },
  of(array) {
  	return array[this.int(array.length - 1)];
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
			ry: 30
		},
		{
			h: 60,
			w: 58,
			cx: 29,
			cy: 30,
			rx: 28,
			ry: 29
		},
		{
			h: 57,
			w: 83,
			path: "M81.26,26.49c4.36,13.72,2.56,29.92-39.91,29.92S-1.19,40.62,1.43,26.49C4.37,10.69,26,.5,41.35.5S76.05,10.12,81.26,26.49Z"
		},
		{
			h: 54,
			w: 60,
			cx: 30,
			cy: 27,
			rx: 30,
			ry: 26
		},
	],
	eye: [
		{
			h: 22,
			w: 20,
			path: "M.69.5,18.92,16.07S14.69,24.9,5.79,20.62,1.32,4.11,4,3.3",
			p2: "M8.35,7.54S6,11.43,7.47,13.71s6.26-2.07,6.26-2.07",
			f2: "black",
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
			}
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
			}
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
			anchor: [26, 30]
		},
		{
			h: 47,
			w: 52,
			path: "M51.06,20.36c0,14.33-11.32,25.94-25.28,25.94S.5,34.69.5,20.36,11.82.5,25.78.5,51.06,6,51.06,20.36Z",
			anchor: [26, 30]
		},
		{
			h: 51,
			w: 47,
			path: "M46,23.73C48.43,36,47.42,50.47,23.5,50.47S-.45,36.36,1,23.73C2.68,9.61,14.85.5,23.5.5S43,9.1,46,23.73Z",
			anchor: [24, 24]
		}
	],
	mouth: [
		{
			h: 8,
			w: 46,
			path: "M.5.8S3.85,6.11,13.25,4.39c3.62-.67,7.79,3.12,9.93,3.12,3.37,0,6-3.57,10.07-3.28,6.88.49,10.5-.46,12.22-3.73",
			anchor: [22, 4]
		},
		{
			h: 7,
			w: 44,
			path: "M.5.5S7.61,5.66,21.88,5.66,43.3.52,43.3.52",
		},
		{ // TODO: Add polyline fangs
			h: 11,
			w: 35,
			path: "M.5,10.12a57.31,57.31,0,0,1,34,0",
		},
		{ // TODO: Add polyline fangs
			h: 5,
			w: 34,
			path: "M.5.5q8,7.41,16,0c5.47,5,11,4.87,16.63,0",
		}
	],
	arm: [
		{
			h: 25,
			w: 28,
			path: "M22.81.5S-2.46,10.22.79,20.28s23.36-.88,26.42-5.87",
			anchor: [21, 21]
		},
		{
			h: 19,
			w: 22,
			path: "M21.06.5C13,5.3.26,2.66.5,10s20.56,8.35,20.56,8.35",
			anchor: [20, 15]
		},
		{
			h: 19,
			w: 18,
			path: "M13.38.5S-2.17,5.62.9,12.79s16.49,4.76,16.49,4.76",
			anchor: [13, 16]
		}
	],
	ear: [
		{
			h: 20,
			w: 25,
			path: "M3.62,19.15S-4.44,6.63,5.35,1.34c7.32-4,14.52,7.51,19,5.92",
			anchor: [13, 6]
		},
		{
			h: 37,
			w: 37,
			path: "M36.09,29.6C31.23,15.79,10.69-6,2.22,2.36c-8.64,8.55,17.67,32.09,25.26,33.78",
			anchor: [28, 7]
		}
	],
	feet: [
		{
			h: 34,
			w: 34,
			path: "M8.49,29.84c8.45,4.14,14.86,5,20.51.24s4.51-10,1-20.94C26.91-.35,13.8-2.15,5.62,4.38S-.46,25.45,8.49,29.84Z",
			anchor: [16, 16]
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
			rotate: 20
		},
	]
};

const skeleton1 = {
	arm: [20, 0],
	body: [0, 0],
	feet: [20, 20],
	ear: [25, -60],
	head: [0, -40],
	eye: [15, -40],
	mouth: [0, -20]
}

const bodyColors = [
	'bdacc5', '524a4a', 'a44a8b', '5ab4cd', 'de5239', 'eede10', 'f6deb4', '41b4ee', '7383d5', '62d5b4', 'ffeecd' 
]

const eyeColors = [
	'da171d', '007976', '000000', '222222'
]

function randomColorf(colors) {
	return '#' + rands.of(colors);
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
		type: skeleton1,
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
			default: randomColorf(bodyColors),
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
addButton('Buy', () => buy());

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
}


// Display

function createPath(fillColor, pathCommands) {
	return '<path fill="'+fillColor+'" stroke="#222222" stroke-width="2" d="'+pathCommands+'"/>';
}

function createCircle(fillColor, bp) {
	return '<ellipse fill="'+fillColor+'" stroke="#222222" stroke-width="2" cx="'+bp.cx+'" cy="'+bp.cy+'" rx="'+bp.rx+'" ry="'+bp.ry+'"/>';
}

function createElement(bodyPartKey, bodyParts, colors, x, y, flip, container) {
	if (!Array.isArray(bodyParts)) {
		bodyParts = [bodyParts];
	}
	const b = bodyParts[0];
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
			svgContent += createPath(bodyPart.f || color, bodyPart.path);
		} else {
			svgContent += createCircle(bodyPart.f || color, bodyPart);
		}
		if (bodyPart.p2)
			svgContent += createPath(bodyPart.f2 || color, bodyPart.p2);
		if (bodyPart.c2)
			svgContent += createCircle(bodyPart.c2.f || color, bodyPart.c2);
	});
	svgContent += '</svg>';
	container.innerHTML += svgContent;
}

function showMonster(anatomy, x, y, container, scale) {
	Object.keys(anatomy.type).forEach(bodyPart => {
		const xvar = anatomy.type[bodyPart][0];
		const yvar = anatomy.type[bodyPart][1];
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
			showMonster(currentMonster, 100, 100, document.getElementById("container"), 1);
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
		Object.keys(model.m).forEach(key => {
			if (!defs[key]) return;
			var div = document.createElement("div");
			div.style.position = 'relative';
			div.style.display = 'inline-block';
			div.style.width = '100px';
			div.style.height = '150px';
			showMonster(defs[key], 50, 110, div, 1);
			var label = document.createElement("p");
			label.style.textAlign = 'center';
			label.innerHTML = defs[key].name;
			div.appendChild(label);
			document.getElementById("container").appendChild(div);
		});
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

let model = localStorage.getItem("bpmSave");
if (model) {
	try {
		model = JSON.parse(model);
	} catch (e) {}
}

if (!model) {
	model = { x: 5, y: 5, p: 40, m: {}, lastGrant: +new Date() };
}

function save() {
	localStorage.setItem("bpmSave", JSON.stringify(model));
}

// In game functions

function recoverMP() {
	if (model.p >= 40) return;
	const time = +new Date();
	const timeDiff = time - model.lastGrant;
	console.log(timeDiff);
	const bonus = Math.floor(timeDiff / 20000);
	if (bonus > 0) {
		model.p += bonus;
		model.p %= 40;
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

setInterval(() => recoverMP(), 1000);

// Start game
land();
