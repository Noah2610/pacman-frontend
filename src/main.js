

const sprPath = "./resource/sprites/";
const soundPath = "./resource/sounds/";
let Player;
let playerImgInterval;
let spr = {};
let sounds = {};

let mapLayout = defMap;

function preload() {
	// load sprites
	spr.pacman = [
		loadImage(sprPath + "pacman-0.png", function(){}, function () { console.error("pacman-0 image not loaded"); }),
		loadImage(sprPath + "pacman-1.png", function(){}, function () { console.error("pacman-1 image not loaded"); }),
		loadImage(sprPath + "pacman-2.png", function(){}, function () { console.error("pacman-2 image not loaded"); })
	];
	// load sounds
	sounds.pacman = loadSound(soundPath + "pacman-waka-edited.mp3",
		function (audio) { audio.loop(0, 1); },
		function () { console.error("pacman-waka sound not loaded"); }
	);
	//sounds.pacman.playMode("sustain");
}

function setup() {
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



function draw() {
	background(settings.bgColor);

	Map.show(mapLayout);

	Player.update();
}
