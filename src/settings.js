
let settings = {
	canvasWidth: 640,
	canvasHeight: 640,
	bgColor: 128,

	blockSize: 32,

	playerImgInterval: 75,
	playerSpdMult: 2,
	playerFoodTime: 7500,

	pointSize: 8,
	pointScoreInrc: 10,

	scoreFoodMult: 2,
	scoreTextMoveStopTime: 1000,
	scoreTextMoveStep: 2,
	scoreTextMoveInterval: 50,

	foodScoreInrc: 25,
	foodRespawnTime: 20000,
	foodSize: 24,

	ghostSize: 24,
	ghostTrackChance: 0.5,
	ghostScoreIncr: 100,
	ghostDeadTime: 4000,
	ghostBlinkLen: 1/4,
	ghostBlinkInterval: 100,
	ghostVulnSpdMult: 1,
	ghostWobbleBound: 8,
	ghostWobbleInterval: 30,

	killScoreIncr: 200
};
settings.playerSize = settings.blockSize - 2;
