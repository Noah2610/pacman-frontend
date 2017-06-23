
const tableEl = document.querySelector("table#table");
const scoreEl = document.querySelector("#score");
const highscoreEl = document.querySelector("#highscore");

const sprPath = "./resource/sprites/";
const soundPath = "./resource/sounds/";
let Player;
let playerImgInterval;
let playerLastKey = [false,[0,0]];

let spr = {};
let sounds = {};
let gameRunning = false;

let mapLayout = defMap;
//let mapLayout = map;
let walls = [];
let wallsGhost = [];
let doors = [];
let points = [];
let ghosts = [];
let foods = [];


function preload() {
	// load sprites
	spr.pacman = [
		loadImage(sprPath + "pacman-0.png", function(){}, function () { console.error("pacman-0 image not loaded"); }),
		loadImage(sprPath + "pacman-1.png", function(){}, function () { console.error("pacman-1 image not loaded"); }),
		loadImage(sprPath + "pacman-2.png", function(){}, function () { console.error("pacman-2 image not loaded"); })
	];
	spr.ghosts = [
		[
			loadImage(sprPath + "ghost-up-01.png", function(){}, function () { console.error("ghost-up-01 image not loaded"); }),
			loadImage(sprPath + "ghost-down-01.png", function(){}, function () { console.error("ghost-down-01 image not loaded"); }),
			loadImage(sprPath + "ghost-left-01.png", function(){}, function () { console.error("ghost-left-01 image not loaded"); }),
			loadImage(sprPath + "ghost-right-01.png", function(){}, function () { console.error("ghost-right-01 image not loaded"); })
		],
		[
			loadImage(sprPath + "ghost-up-02.png", function(){}, function () { console.error("ghost-up-02 image not loaded"); }),
			loadImage(sprPath + "ghost-down-02.png", function(){}, function () { console.error("ghost-down-02 image not loaded"); }),
			loadImage(sprPath + "ghost-left-02.png", function(){}, function () { console.error("ghost-left-02 image not loaded"); }),
			loadImage(sprPath + "ghost-right-02.png", function(){}, function () { console.error("ghost-right-02 image not loaded"); })
		],
		[
			loadImage(sprPath + "ghost-up-03.png", function(){}, function () { console.error("ghost-up-03 image not loaded"); }),
			loadImage(sprPath + "ghost-down-03.png", function(){}, function () { console.error("ghost-down-03 image not loaded"); }),
			loadImage(sprPath + "ghost-left-03.png", function(){}, function () { console.error("ghost-left-03 image not loaded"); }),
			loadImage(sprPath + "ghost-right-03.png", function(){}, function () { console.error("ghost-right-03 image not loaded"); })
		],
		[
			loadImage(sprPath + "ghost-up-04.png", function(){}, function () { console.error("ghost-up-04 image not loaded"); }),
			loadImage(sprPath + "ghost-down-04.png", function(){}, function () { console.error("ghost-down-04 image not loaded"); }),
			loadImage(sprPath + "ghost-left-04.png", function(){}, function () { console.error("ghost-left-04 image not loaded"); }),
			loadImage(sprPath + "ghost-right-04.png", function(){}, function () { console.error("ghost-right-04 image not loaded"); })
		],
		[
			loadImage(sprPath + "ghost-up-n.png", function(){}, function () { console.error("ghost-up-n image not loaded"); }),
			loadImage(sprPath + "ghost-down-n.png", function(){}, function () { console.error("ghost-down-n image not loaded"); }),
			loadImage(sprPath + "ghost-left-n.png", function(){}, function () { console.error("ghost-left-n image not loaded"); }),
			loadImage(sprPath + "ghost-right-n.png", function(){}, function () { console.error("ghost-right-n image not loaded"); })
		],
	];
	spr.ghostWobble = loadImage(sprPath + "ghostWobble.png", function(){}, function () { console.error("ghostWobble image not loaded"); });
	spr.food = loadImage(sprPath + "food.png", function(){}, function () { console.error("food image not loaded"); });
	// load sounds
	sounds.pacman = loadSound(soundPath + "pacman-waka-edited.mp3",
		function (audio) { audio.setVolume(0.25); audio.loop(0, 1); },
		function () { console.error("pacman-waka sound not loaded"); }
	);
	//sounds.pacman.playMode("sustain");
}


function setup() {
	// display highscore if it exists (local storage)
	let hiScore = localStorage.getItem("highscore");
	if (hiScore) {
		highscoreEl.innerHTML = hiScore;
	}
	// display total games won if it exists (local storage)
	if (localStorage.getItem("gamesWon")) mkGamesWonEl();

	Player = new _player();  // create player
	// get all walls and emptyTiles into one array
	Map.mkArrays();

	playerImgInterval = setInterval(function () {
		if (Player.curImg <= 0) Player.imgDir = 1;
		if (Player.curImg >= 2) Player.imgDir = -1;
		Player.curImg += Player.imgDir;
	}, settings.playerImgInterval);

	// initialize canvas
	createCanvas(settings.canvasWidth, settings.canvasHeight);
	background(settings.bgColor);
	gameRunning = true;
}


function mkGamesWonEl() {
	let gamesWon = localStorage.getItem("gamesWon");
	let trEl = document.createElement("tr");
	let tdTitleEl = document.createElement("td");
	let tdNumEl = document.createElement("td");
	tdTitleEl.innerHTML = "Total Games Won: ";
	tdNumEl.innerHTML = gamesWon;
	tdNumEl.id = "gamesWon";
	tdNumEl.className = "bold";
	table.appendChild(trEl);
	trEl.appendChild(tdTitleEl);
	trEl.appendChild(tdNumEl);
}


function gameOver() {
	clearInterval(playerImgInterval);
	sounds.pacman.stop();
	gameRunning = false;

	textAlign(CENTER,CENTER);
	textSize(64);
	strokeWeight(6);
	stroke(0);
	fill(255,0,0);

	// local storage, highscore
	let highscore = false;
	let hiScore = localStorage.getItem("highscore");
	if (!hiScore || hiScore < Player.score) {
		localStorage.setItem("highscore", Player.score);
		highscore = true;
	}

	text("Game Over\nFinal Score: " + Player.score, settings.canvasWidth / 2, settings.canvasHeight / 2);

	if (highscore) {
		fill(0,255,0);
		text("\n\n\nNew Highscore!", settings.canvasWidth / 2, settings.canvasHeight / 2);
		// update highscore element
		highscoreEl.innerHTML = Player.score;
	}

}

function win() {
	clearInterval(playerImgInterval);
	sounds.pacman.stop();
	ghosts = [];
	gameRunning = false;

	textAlign(CENTER,CENTER);
	textSize(64);
	strokeWeight(6);
	stroke(0);
	fill(0,255,0);

	// local storage, highscore
	let highscore = false;
	let hiScore = localStorage.getItem("highscore");
	if (!hiScore || hiScore < Player.score) {
		localStorage.setItem("highscore", Player.score);
		highscore = true;
	}
	// local storage, total games won
	let gamesWon = parseInt(localStorage.getItem("gamesWon"));
	if (!gamesWon) {
		localStorage.setItem("gamesWon", 1);
		mkGamesWonEl();
	} else {
		gamesWon++;
		localStorage.setItem("gamesWon", gamesWon);
		// update total games won element
		document.querySelector("#gamesWon").innerHTML = gamesWon;
	}

	text("You Win!\nFinal Score: " + Player.score, settings.canvasWidth / 2, settings.canvasHeight / 2);

	if (highscore) {
		fill(0,255,0);
		text("\n\n\nNew Highscore!", settings.canvasWidth / 2, settings.canvasHeight / 2);
		// update highscore element
		highscoreEl.innerHTML = Player.score;
	}
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
	if (gameRunning) {
		background(settings.bgColor);

		Map.show();

		for (let count = 0; count < ghosts.length; count++) {
			ghosts[count].update();
		}

		// call player update function last due to rotation
		Player.update();
	}
}
