var letters = {
	'A': [
		[1, 1, 1],
		[1, , 1],
		[1, , 1],
		[1, 1, 1],
		[1, , 1]
	],
	'B': [
		[1, 1],
		[1, , 1],
		[1, 1, 1],
		[1, , 1],
		[1, 1]
	],
	'C': [
		[1, 1, 1],
		[1],
		[1],
		[1],
		[1, 1, 1]
	],
	'D': [
		[1, 1],
		[1, , 1],
		[1, , 1],
		[1, , 1],
		[1, 1]
	],
	'E': [
		[1, 1, 1],
		[1],
		[1, 1, 1],
		[1],
		[1, 1, 1]
	],
	'F': [
		[1, 1, 1],
		[1],
		[1, 1],
		[1],
		[1]
	],
	'G': [
		[, 1, 1],
		[1],
		[1, , 1, 1],
		[1, , , 1],
		[, 1, 1]
	],
	'H': [
		[1, , 1],
		[1, , 1],
		[1, 1, 1],
		[1, , 1],
		[1, , 1]
	],
	'I': [
		[1, 1, 1],
		[, 1],
		[, 1],
		[, 1],
		[1, 1, 1]
	],
	'J': [
		[1, 1, 1],
		[, , 1],
		[, , 1],
		[1, , 1],
		[1, 1, 1]
	],
	'K': [
		[1, , , 1],
		[1, , 1],
		[1, 1],
		[1, , 1],
		[1, , , 1]
	],
	'L': [
		[1],
		[1],
		[1],
		[1],
		[1, 1, 1]
	],
	'M': [
		[1, 1, 1, 1, 1],
		[1, , 1, , 1],
		[1, , 1, , 1],
		[1, , , , 1],
		[1, , , , 1]
	],
	'N': [
		[1, , , 1],
		[1, 1, , 1],
		[1, , 1, 1],
		[1, , , 1],
		[1, , , 1]
	],
	'O': [
		[1, 1, 1],
		[1, , 1],
		[1, , 1],
		[1, , 1],
		[1, 1, 1]
	],
	'P': [
		[1, 1, 1],
		[1, , 1],
		[1, 1, 1],
		[1],
		[1]
	],
	'Q': [
		[0, 1, 1],
		[1, , , 1],
		[1, , , 1],
		[1, , 1, 1],
		[1, 1, 1, 1]
	],
	'R': [
		[1, 1, 1],
		[1, , 1],
		[1, , 1],
		[1, 1],
		[1, , 1]
	],
	'S': [
		[1, 1, 1],
		[1],
		[1, 1, 1],
		[, , 1],
		[1, 1, 1]
	],
	'T': [
		[1, 1, 1],
		[, 1],
		[, 1],
		[, 1],
		[, 1]
	],
	'U': [
		[1, , 1],
		[1, , 1],
		[1, , 1],
		[1, , 1],
		[1, 1, 1]
	],
	'V': [
		[1, , , , 1],
		[1, , , , 1],
		[, 1, , 1],
		[, 1, , 1],
		[, , 1]
	],
	'W': [
		[1, , , , 1],
		[1, , , , 1],
		[1, , , , 1],
		[1, , 1, , 1],
		[1, 1, 1, 1, 1]
	],
	'X': [
		[1, , , , 1],
		[, 1, , 1],
		[, , 1],
		[, 1, , 1],
		[1, , , , 1]
	],
	'Y': [
		[1, , 1],
		[1, , 1],
		[, 1],
		[, 1],
		[, 1]
	],
	'Z': [
		[1, 1, 1, 1, 1],
		[, , , 1],
		[, , 1],
		[, 1],
		[1, 1, 1, 1, 1]
	],
	'0': [
		[1, 1, 1],
		[1, , 1],
		[1, , 1],
		[1, , 1],
		[1, 1, 1]
	],
	'1': [
		[, 1],
		[, 1],
		[, 1],
		[, 1],
		[, 1]
	],
	'2': [
		[1,1,1],
		[0,0,1],
		[1,1,1],
		[1,0,0],
		[1,1,1]
	],
	'3':[
		[1,1,1],
		[0,0,1],
		[1,1,1],
		[0,0,1],
		[1,1,1]
	],
	'4':[
		[1,0,1],
		[1,0,1],
		[1,1,1],
		[0,0,1],
		[0,0,1]
	],
	'5':[
		[1,1,1],
		[1,0,0],
		[1,1,1],
		[0,0,1],
		[1,1,1]
	],
	'6':[
		[1,1,1],
		[1,0,0],
		[1,1,1],
		[1,0,1],
		[1,1,1]
	],
	'7':[
		[1,1,1],
		[0,0,1],
		[0,0,1],
		[0,0,1],
		[0,0,1]
	],
	'8':[
		[1,1,1],
		[1,0,1],
		[1,1,1],
		[1,0,1],
		[1,1,1]
	],
	'9':[
		[1,1,1],
		[1,0,1],
		[1,1,1],
		[0,0,1],
		[1,1,1]
	],
	':':[
		[,,],
		[,1,],
		[,,],
		[,1,],
		[,,]
	],
	'/':[
		[0,0,1],
		[0,1,0],
		[0,1,0],
		[0,1,0],
		[1,0,0]
	],
	' ': [
		[, ,],
		[, ,],
		[, ,],
		[, ,],
		[, ,]
	]
};

function getNeededText(str)
{
	var needed = [];
	string = str.toUpperCase();
	for (var i = 0; i < string.length; i++) 
	{
		var letter = letters[string.charAt(i)];
		if (letter) 
		{
			needed.push(letter);
		}
	}


	return needed;
}

function getTextSize(string, size)
{
	var needed = getNeededText(string);
	var x = 0;

	for(let i = 0; i < needed.length; i++)
	{
		x += needed[0].length * size;
	}

	return x;
}

function drawText(string, x, y, size, color)
{
	var needed = getNeededText(string);
	ctx.fillStyle = color;

	var xoff = 0;

	for(let i = 0; i < needed.length; i++)
	{
		var char = needed[i];
		var yoff = 0;
		var addx = 0;

		for(let j = 0; j < char.length; j++)
		{
			var row = char[j];
			for(let subx = 0; subx < row.length; subx++)
			{
				if(row[subx])
				{
					ctx.fillRect(subx * size + xoff + x, yoff + y, size, size);
				}
			}

			addx = Math.max(addx, row.length * size);
			yoff += size;
		}

		xoff += size + addx;
	}

	return xoff;
}