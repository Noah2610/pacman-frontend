
let tmp = 0;

const scoreEl = document.querySelector("#playerScore");

const sprPath = "./resource/sprites/";
const soundPath = "./resource/sounds/";
let Player;
let playerImgInterval;
let playerLastKey = [false,[0,0]];

let spr = {};
let sounds = {};

let mapLayout = defMap;
let walls = [];
let points = [];
let ghosts = [];


function preload() {
	// load sprites
	spr.pacman = [
		loadImage(sprPath + "pacman-0.png", function(){}, function () { console.error("pacman-0 image not loaded"); }),
		loadImage(sprPath + "pacman-1.png", function(){}, function () { console.error("pacman-1 image not loaded"); }),
		loadImage(sprPath + "pacman-2.png", function(){}, function () { console.error("pacman-2 image not loaded"); })
	];
	spr.ghosts = [
		loadImage(sprPath + "ghost-01.png", function(){}, function () { console.error("ghost-01 image not loaded"); }),
		loadImage(sprPath + "ghost-02.png", function(){}, function () { console.error("ghost-02 image not loaded"); }),
		loadImage(sprPath + "ghost-03.png", function(){}, function () { console.error("ghost-03 image not loaded"); }),
		loadImage(sprPath + "ghost-04.png", function(){}, function () { console.error("ghost-04 image not loaded"); })
	];
	// load sounds
	sounds.pacman = loadSound(soundPath + "pacman-waka-edited.mp3",
		function (audio) { audio.loop(0, 1); },
		function () { console.error("pacman-waka sound not loaded"); }
	);
	//sounds.pacman.playMode("sustain");
}

function setup() {
	// get all walls and emptyTiles into one array
	Map.mkArrays();
	//for (let row = 0; row < mapLayout.length; row++) {
		//for (let col = 0; col < mapLayout[0].length; col++) {
			//// impassable objects
			//if (objects[mapLayout[row][col]][0] == "wall" || objects[mapLayout[row][col]][0] == "tileImpass") {
				//let x = col * settings.blockSize;
				//let y = row * settings.blockSize;
				//walls.push({
					//x1: x, y1: y,
					//x2: x + settings.blockSize, y2: y + settings.blockSize
				//});
			//} else
			//// points
			//if (objects[mapLayout[row][col]][0] == "point") {
				//let x = col * settings.pointSize;
				//let y = row * settings.pointSize;
				//points.push({
					//x1: x, y1: y,
					//x2: x + settings.pointSize, y2: y + settings.pointSize
				//});
			//}
		//}
	//}

	Player = new _player();
	playerImgInterval = setInterval(function () {
		if (Player.curImg <= 0) Player.imgDir = 1;
		if (Player.curImg >= 2) Player.imgDir = -1;
		Player.curImg += Player.imgDir;
	}, settings.playerImgInterval);

	// initialize canvas
	createCanvas(settings.canvasWidth, settings.canvasHeight);
	background(settings.bgColor);
}



function keyPressed() {
	if (keyCode === UP_ARROW) {
		playerLastKey = [ "up", [0,-1] ];
	} else
	if (keyCode === DOWN_ARROW) {
		playerLastKey = [ "down", [0,1] ];
	} else
	if (keyCode === LEFT_ARROW) {
		playerLastKey = [ "left", [-1,0] ];
	} else
	if (keyCode === RIGHT_ARROW) {
		playerLastKey = [ "right", [1,0] ];
	}
}



function draw() {
	background(settings.bgColor);

	Map.show();

	Player.update();

	//for (let count = 0; count < ghosts.length; count++) {
		//ghosts[count].update();
	//}
}
