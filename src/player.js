
function _player(x=32+settings.blockSize/2, y=32+settings.blockSize/2) {

	this.x = x;
	this.y = y;
	this.dir = [0,0];
	this.curImg = 0;
	this.imgDir = 1;
	this.score = 0;


	this.collision = function (arr, dir=this.dir, dist=Math.round(settings.blockSize/2)) {
		for (let count = 0; count < arr.length; count++) {
			let block = arr[count];
			switch (JSON.stringify(dir)) {
				case "[0,-1]":  // up
					if (
					this.x >= block.x1 && this.x <= block.x2 &&
					this.y - dist >= block.y1 && this.y - dist <= block.y2 ) {
						return block.id;
					}
					break;
				case "[0,1]":  // down
					if (
					this.x >= block.x1 && this.x <= block.x2 &&
					this.y + dist >= block.y1 && this.y + dist <= block.y2 ) {
						return block.id;
					}
					break;
				case "[-1,0]":  // left
					if (
					this.x - dist >= block.x1 && this.x - dist <= block.x2 &&
					this.y >= block.y1 && this.y <= block.y2 ) {
						return block.id;
					}
					break;
				case "[1,0]":  // right
					if (
					this.x + dist >= block.x1 && this.x + dist <= block.x2 &&
					this.y >= block.y1 && this.y <= block.y2 ) {
						return block.id;
					}
					break;
				case "[0,0]":  // no movement
					if (
					this.x >= block.x1 && this.x <= block.x2 &&
					this.y >= block.y1 && this.y <= block.y2 ) {
						return block.id;
					}
					break;
			}
		}
		return false;
	};


	this.update = function () {
		this.changeDir();

		if (!this.collision(walls)) {
			this.move();
		} else this.dir = [0,0];

		let pntCollide = this.collision(points, [0,0], 0);
		if (pntCollide) {
			for (let row = 0; row < mapLayout.length; row++) {
				for (let col = 0; col < mapLayout[0].length; col++) {
					if (pntCollide[1] == row && pntCollide[0] == col) {
						this.score++;
						scoreEl.innerHTML = "Score: " + this.score;
						mapLayout[row][col] = "-";
						Map.mkArrays();
					}
				}
			}
		}

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
		!this.collision(walls, playerLastKey[1]) ) {
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
