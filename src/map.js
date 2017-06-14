
const objects = {
	"-": [ "tileEmpty",
		function (x,y) { /* do nothing */ }
	],
	"_": [ "tileImpass",
		function (x,y) { fill(64); rectMode(CENTER); rect(x,y,settings.blockSize,settings.blockSize); }
	],
	"*": [ "point",
		function (x,y) { fill(255,255,0); ellipseMode(CENTER); ellipse(x,y,settings.pointSize); }
	],
	"#": [ "wall",
		function (x,y) { fill(0,0,255); rectMode(CENTER); rect(x,y,settings.blockSize,settings.blockSize); }
	],
	"G": [ "ghost",
		function (x,y) { fill(255); rectMode(CENTER); rect(x,y,24,24); }
	]
};


const Map = {

	show: function (map) {
		noStroke();
		//for (let row = 0; row < settings.canvasHeight / settings.blockSize; row++) {
			//for (let col = 0; col < settings.canvasWidth / settings.blockSize; col++) {
		for (let row = 0; row < mapLayout.length; row++) {
			for (let col = 0; col < mapLayout[0].length; col++) {
				objects[mapLayout[row][col]][1](col * settings.blockSize + settings.blockSize / 2, row * settings.blockSize + settings.blockSize / 2);
			}
		}
	},

};
