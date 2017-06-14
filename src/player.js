
function _player(x=32+settings.blockSize/2, y=32+settings.blockSize/2) {

	this.x = x;
	this.y = y;
	this.dir = [0,0];
	this.curImg = 0;
	this.imgDir = 1;


	this.collisionWall = function (dir=this.dir) {
		let half = Math.round(settings.blockSize / 2);
		for (let count = 0; count < walls.length; count++) {
			let wall = walls[count];
			switch (JSON.stringify(dir)) {
				case "[0,-1]":  // up
					if (
					this.x >= wall.x1 && this.x <= wall.x2 &&
					this.y - half >= wall.y1 && this.y - half <= wall.y2 ) {
						return true;
					}
					break;
				case "[0,1]":  // down
					if (
					this.x >= wall.x1 && this.x <= wall.x2 &&
					this.y + half >= wall.y1 && this.y + half <= wall.y2 ) {
						return true;
					}
					break;
				case "[-1,0]":  // left
					if (
					this.x - half >= wall.x1 && this.x - half <= wall.x2 &&
					this.y >= wall.y1 && this.y <= wall.y2 ) {
						return true;
					}
					break;
				case "[1,0]":  // right
					if (
					this.x + half >= wall.x1 && this.x + half <= wall.x2 &&
					this.y >= wall.y1 && this.y <= wall.y2 ) {
						return true;
					}
					break;
			}
		}
		return false;
	};

	
		//(this.x - settings.blockSize / 2) % 32 == 0 &&
		//(this.y - settings.blockSize / 2) % 32 == 0

	this.update = function () {
		this.changeDir();

		if (!this.collisionWall()) {
			this.move();
		} else this.dir = [0,0];

		this.show();
	};

	this.changeDir = function () {
		if (this.dir[0] * -1 == playerLastKey[1][0] && this.dir[1] * -1 == playerLastKey[1][1]) {
			this.dir = playerLastKey[1];
			return;
		}

		if ( playerLastKey[0] &&
		(this.x - settings.blockSize / 2) % 32 == 0 &&
		(this.y - settings.blockSize / 2) % 32 == 0 &&
		!this.collisionWall(playerLastKey[1]) ) {
			switch (playerLastKey[0]) {
				case "up":
					this.dir = [0,-1];
					break;

				case "down":
					this.dir = [0,1];
					break;

				case "left":
					this.dir = [-1,0];
					break;

				case "right":
					this.dir = [1,0];
					break;
			}
		}
	};

	this.move = function () {
		this.x += this.dir[0] * settings.playerSpdMult;
		this.y += this.dir[1] * settings.playerSpdMult;
	};

	this.show = function () {
		imageMode(CENTER);
		//image(spr.pacman[this.curImg], Math.round(this.x + settings.playerSize / 2), Math.round(this.y + settings.playerSize / 2), settings.playerSize,settings.playerSize);
		image(spr.pacman[this.curImg], this.x,this.y, settings.playerSize,settings.playerSize);
	};

}
