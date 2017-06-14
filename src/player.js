
function _player(
	x=Math.round(settings.canvasWidth / 2),
	y=Math.round(settings.canvasHeight / 2),
	) {

	this.x = x;
	this.y = y;
	this.dir = [0,0];
	this.curImg = 0;
	this.imgDir = 1;

	this.update = function () {
		this.move();
		this.show();
	};

	this.move = function () {
		this.x += this.dir[0];
		this.y += this.dir[1];
	};

	this.show = function () {
		image(spr.pacman[this.curImg], Math.round(this.x - settings.playerSize / 2), Math.round(this.y - settings.playerSize / 2), settings.playerSize,settings.playerSize);
	};
}
