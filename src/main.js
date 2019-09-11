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

var container = document.getElementById("container");

function createPath(fillColor, pathCommands) {
	return '<path fill="'+fillColor+'" stroke="#222222" stroke-width="2" d="'+pathCommands+'"/>';
}

function createCircle(fillColor, bp) {
	return '<ellipse fill="'+fillColor+'" stroke="#222222" stroke-width="2" cx="'+bp.cx+'" cy="'+bp.cy+'" rx="'+bp.rx+'" ry="'+bp.ry+'"/>';
}


function createElement(bodyPartKey, bodyParts, colors, x, y, flip) {
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

const skeleton1 = {
	arm: [20, 0],
	body: [0, 0],
	feet: [20, 20],
	ear: [25, -60],
	head: [0, -40],
	eye: [15, -40],
	mouth: [0, -20]
}

const testAnatomy = {
	type: skeleton1,
	arm: 2,
	body: 0,
	feet: 2,
	ear: 1,
	head: 3,
	eye: 3,
	mouth: 3
}

function buildMonster(anatomy, x, y) {
	Object.keys(anatomy.type).forEach(bodyPart => {
		const xvar = anatomy.type[bodyPart][0];
		const yvar = anatomy.type[bodyPart][1];
		createElement(bodyPart, shapes[bodyPart][anatomy.bps[bodyPart]], anatomy.colors, x - xvar, y + yvar);
		if (xvar) {
			createElement(bodyPart, shapes[bodyPart][anatomy.bps[bodyPart]], anatomy.colors, x + xvar, y + yvar, true);
		}
	});
}

const bodyColors = [
	'bdacc5', '524a4a', 'a44a8b', '5ab4cd', 'de5239', 'eede10', 'f6deb4', '41b4ee', '7383d5', '62d5b4', 'ffeecd' 
]

const eyeColors = [
	'da171d', '007976', '000000', '222222'
]

function randomColor() {
	return '#' + ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
}


function randomColorf(colors) {
	return '#' + colors[Math.round(Math.random()*(colors.length - 1))];
}

function randomAnatomy() {
	return {
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
	return Math.round(Math.random() * (array.length - 1));
}

buildMonster(randomAnatomy(), 230, 100);

/*

createElement(arms[1], '#4a90d6', 210, 100);
createElement(arms[0], '#4a90d6', 245, 100, true);
createElement(bodies[0], '#4a90d6', 230, 100);
createElement(feet[0], '#4a90d6', 210, 120);
createElement(feet[0], '#4a90d6', 245, 120, true);
createElement(ears[0], '#4a90d6', 200, 40);
createElement(ears[0], '#4a90d6', 260, 40, true);
createElement(heads[0], '#4a90d6', 230, 60);
createElement(eyes[0], '#FFFFFF', 210, 60);
createElement(eyes[0], '#FFFFFF', 250, 60, true);
createElement(mouths[0], '#4a90d6', 230, 80);
*/

