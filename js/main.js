// There may be redundant code with JS already having a method, but I wish to make it all myself!
// Thank you <3

// Also note that this was made following a tutorial! Anything past the following date was made
// without the tutorial:
// Tutorial referring to: https://www.youtube.com/watch?v=Ffi-eKJWwuE
// All code was translated from their implementation to JS by me!

// Creates canvas & makes drawing start from bottom left corner
canvas = document.getElementById("mainCanvas");
context = canvas.getContext("2d");
context.translate(0, 0);
context.translate(0, canvas.height);
context.scale(1, -1);

let a = { 
	x: 10,
	y: 10
};
let b = {
	x: 110,
	y: 130
};
let c = {
	x: 150,
	y: 30
};

function drawPoint(ax, ay, color = "black") {
	context.fillStyle=color;
	context.fillRect(ax, ay, 5, 5);
}

function drawLine(ax, ay, bx, by) {
    let yStep = (by - ay) / (bx - ax);
    let y = 0;
    for (let x = ax; x <= bx; x++) {
        drawPoint(x*5, Math.ceil(y));
        y = y + yStep;
    }
}

function fragment(alpha, beta, gamma) {
	alpha *= 255
	beta *= 255
	gamma *= 255
	return `rgba(${alpha}, ${beta}, ${gamma}, 1`;
}

// Takes in a.x and a.y (from -1 to 1) and converts to our screen size of 1000x1000
function screen(a) {
	return {
		.x = (a.x + 1) / 2 * canvas.width
		.y = (a.y + 1) / 2 * canvas.height
	}
}

function drawTriangle(ax, ay, bx, by, cx, cy) {
	drawLine(ax, ay, bx, by);
	drawLine(bx, by, cx, cy);
	drawLine(cx, cy, ax, ay);
}

function signedTriangleArea(ax, ay, bx, by, cx, cy) {
	return 0.5 * ((bx - ax) * (cy - ay) - (cx - ax) * (by - ay));
}

// Probably will remove later, but let me be happy
function drawRainbowFilledTriangle(ax, ay, bx, by, cx, cy) {
	let xMin = Math.min(ax, bx, cx);
	let yMin = Math.min(ay, by, cy);
	let xMax = Math.max(ax, bx, cx);
	let yMax = Math.max(ay, by, cy);
	let totalArea = signedTriangleArea(ax, ay, bx, by, cx, cy);

	for (let x = xMin; x <= xMax; x++) {
		for (let y = yMin; y <= yMax; y++) {
			let alpha = signedTriangleArea(x, y, bx, by, cx, cy) / totalArea;
			let beta = signedTriangleArea(x, y, cx, cy, ax, ay) / totalArea;
			let gamma = signedTriangleArea(x, y, ax, ay, bx, by) / totalArea;
			if (alpha < 0 || beta < 0 || gamma < 0) {
				continue;
			}
			let r = Math.abs(Math.round(alpha * 255));
			let g = Math.abs(Math.round(beta * 255));
			let b = Math.abs(Math.round(gamma * 255));
			drawPoint(x, y, `rgba(${r}, ${g}, ${b}, 1)`)
		}
	}
}

// Normal Triangle
function Rasterize(a, b, c) {
	let ax = a.x
	let bx = b.x
	let cx = c.x
	let ay = a.y
	let by = b.y
	let cy = c.y
	let xMin = Math.min(ax, bx, cx);
	let yMin = Math.min(ay, by, cy);
	let xMax = Math.max(ax, bx, cx);
	let yMax = Math.max(ay, by, cy);
	let totalArea = signedTriangleArea(ax, ay, bx, by, cx, cy);

	for (let x = xMin; x <= xMax; x++) {
		for (let y = yMin; y <= yMax; y++) {
			let alpha = signedTriangleArea(x, y, bx, by, cx, cy) / totalArea;
			let beta = signedTriangleArea(x, y, cx, cy, ax, ay) / totalArea;
			let gamma = signedTriangleArea(x, y, ax, ay, bx, by) / totalArea;
			if (alpha < 0 || beta < 0 || gamma < 0) {
				continue;
			}
			let color = fragment(alpha, beta, gamma)
			drawPoint(x, y, color)
		}
	}
}
