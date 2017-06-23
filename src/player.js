
function _player(x=32+settings.blockSize/2, y=32+settings.blockSize/2) {

	this.x = x;
	this.y = y;
	this.dir = [0,0];
	this.curImg = 0;
	this.imgDir = 1;
	this.score = 0;
	this.rotation = 0;
	this.foodActive = false;
	this.foodTimeout;
	this.killScoreMult = 1;

	// for collision checking with ghosts
	this.x1 = this.x - settings.playerSize / 2;
	this.y1 = this.y - settings.playerSize / 2;
	this.x2 = this.x + settings.playerSize / 2;
	this.y2 = this.y + settings.playerSize / 2;


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


	this.kill = function () {
		// increase score
		let scoreIncr = settings.killScoreIncr * this.killScoreMult;
		this.score += scoreIncr;
		// update score display
		scoreEl.innerHTML = Player.score;
		// increase kill score multiplier
		this.killScoreMult += 1;
		// display score text
		scoreText(scoreIncr, this.x,this.y, [255,128,0], 24, 1, 50, 1500);
	};


	this.update = function () {
		this.changeDir();

		if (!this.collision(walls)) {
			this.move();
		} else this.dir = [0,0];

		// collect point/pellet
		let pntCollide = this.collision(points, [0,0], 0);
		if (pntCollide) {
			for (let row = 0; row < mapLayout.length; row++) {
				for (let col = 0; col < mapLayout[0].length; col++) {
					if (pntCollide[1] == row && pntCollide[0] == col) {
						let pntIncr = settings.pointScoreInrc;
						if (this.foodActive) pntIncr *= settings.scoreFoodMult;
						this.score += pntIncr;
						scoreEl.innerHTML = this.score;
						mapLayout[row][col] = "-";
						Map.mkArrays();
						scoreText(pntIncr, this.x,this.y, [200,255,0], 12, 1, 50, 500);
						// win condition
						if (points.length == 0) win();
					}
				}
			}
		}

		let foodCollide = this.collision(foods, [0,0], 0);
		if (foodCollide) {
			for (let row = 0; row < mapLayout.length; row++) {
				for (let col = 0; col < mapLayout[0].length; col++) {
					if (foodCollide[1] == row && foodCollide[0] == col) {
						let scrIncr = settings.foodScoreInrc;
						if (this.foodActive) scrIncr *= settings.scoreFoodMult;
						this.score += scrIncr;
						scoreEl.innerHTML = this.score;
						mapLayout[row][col] = "-";
						Map.mkArrays();
						scoreText(scrIncr, this.x,this.y);
						// set respawn timer for food
						setTimeout(function (f) {
							mapLayout[f[0]][f[1]] = "F";
							Map.mkArrays();
						}, settings.foodRespawnTime, [row,col]);
						// activate food effect
						clearTimeout(this.foodTimeout);
						this.foodActive = true;
						for (let count = 0; count < ghosts.length; count++) {
							if (ghosts[count].active) ghosts[count].vuln();
						}
						// deactivate food effect
						this.foodTimeout = setTimeout(function (p) {
							p.foodActive = false;
							p.killScoreMult = 1;
						}, settings.playerFoodTime, this);

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
		(this.x - settings.blockSize / 2) % settings.blockSize == 0 &&
		(this.y - settings.blockSize / 2) % settings.blockSize == 0 &&
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
		// for collision checking
		this.x1 = this.x - settings.playerSize / 2;
		this.y1 = this.y - settings.playerSize / 2;
		this.x2 = this.x + settings.playerSize / 2;
		this.y2 = this.y + settings.playerSize / 2;
		// check offscreen (x)
		if (this.x < 0) this.x = settings.canvasWidth;
		else if (this.x > settings.canvasWidth) this.x = 0;
	};

	this.show = function () {
		push();
		imageMode(CENTER);
		// move origin point so rotation looks correct
		translate(this.x, this.y);  // <- these are the position coords for player
		angleMode(DEGREES)

		switch (JSON.stringify(this.dir)) {
			case "[0,-1]":
				this.rotation = 270;
				break;
			case "[0,1]":
				this.rotation = 90;
				break;
			case "[-1,0]":
				this.rotation = 180;
				break;
			case "[1,0]":
				this.rotation = 0;
				break;
		}
		rotate(this.rotation);
		image(spr.pacman[this.curImg], 0,0, settings.playerSize,settings.playerSize);
		pop();
	};

}
