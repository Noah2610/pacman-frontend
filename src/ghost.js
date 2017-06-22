

function _ghost(x,y) {
	this.origin = [x,y];
	this.x = x;
	this.y = y;
	this.dir = [0,0];
	this.spdMult = settings.playerSpdMult;
	//this.walls = wallsGhost;
	this.walls = [];
	wallsGhost.forEach((wall) => {
		this.walls.push(wall);
	});
	this.passedDoors = false;

	if (ghosts.length < 4) {
		this.imgs = spr.ghosts[ghosts.length];
	} else {
		this.imgs = spr.ghosts[4];
	}
	this.img = this.imgs[0];
	this.active = true;
	this.visible = true;
	this.blinkInterval;
	this.stopBlinkInterval;



	this.collision = function (arr, dir=this.dir, dist=Math.round(settings.blockSize/2)) {
		for (let count = 0; count < arr.length; count++) {
			let block = arr[count];
			switch (JSON.stringify(dir)) {
				case "[0,-1]":  // up
					if (
					this.x >= block.x1 && this.x <= block.x2 &&
					this.y - dist >= block.y1 && this.y - dist <= block.y2 ) {
						return true;
					}
					break;
				case "[0,1]":  // down
					if (
					this.x >= block.x1 && this.x <= block.x2 &&
					this.y + dist >= block.y1 && this.y + dist <= block.y2 ) {
						return true;
					}
					break;
				case "[-1,0]":  // left
					if (
					this.x - dist >= block.x1 && this.x - dist <= block.x2 &&
					this.y >= block.y1 && this.y <= block.y2 ) {
						return true;
					}
					break;
				case "[1,0]":  // right
					if (
					this.x + dist >= block.x1 && this.x + dist <= block.x2 &&
					this.y >= block.y1 && this.y <= block.y2 ) {
						return true;
					}
					break;
				case "[0,0]":  // no movement
					if (
					this.x >= block.x1 && this.x <= block.x2 &&
					this.y >= block.y1 && this.y <= block.y2 ) {
						return true;
					}
					break;
			}
		}
		return false;
	};


	this.changeDir = function () {
		let newDir = [this.dir[0], this.dir[1]];
		let dirs = [];
		let pathfind = false;
		for (let count = 0; count < 4; count++) {
			switch (count) {
				case 0:  // up
					if ("[0,-1]" != JSON.stringify(this.dir) && "[" + 0 * -1 + "," + -1 * -1 + "]" != JSON.stringify(this.dir) &&
					!this.collision(this.walls, [0,-1]))
						dirs.push([0,-1]);
					break;
				case 1:  // down
					if ("[0,1]" != JSON.stringify(this.dir) && "[" + 0 * -1 + "," + 1 * -1 + "]" != JSON.stringify(this.dir) &&
					!this.collision(this.walls, [0,1]))
						dirs.push([0,1]);
					break;
				case 2:  // left
					if ("[-1,0]" != JSON.stringify(this.dir) && "[" + -1 * -1 + "," + 0 * -1 + "]" != JSON.stringify(this.dir) &&
					!this.collision(this.walls, [-1,0]))
						dirs.push([-1,0]);
					break;
				case 3:  // right
					if ("[1,0]" != JSON.stringify(this.dir) && "[" + 1 * -1 + "," + 0 * -1 + "]" != JSON.stringify(this.dir) &&
					!this.collision(this.walls, [1,0]))
						dirs.push([1,0]);
					break;
			}
		}

		if (dirs.length > 0) {
			// pathfind - try to move towards player
			if (Math.random() <= settings.ghostTrackChance) {
				let pfDirs = [];
				let goodDir = [0,0];

				if (Player.x < this.x) goodDir[0] = -1;
				else if (Player.x > this.x) goodDir[0] = 1;
				if (Player.y < this.y) goodDir[1] = -1;
				else if (Player.y > this.y) goodDir[1] = 1;

				for (let count = 0; count < dirs.length; count++) {
					if (goodDir[0] != 0 && goodDir[0] == dirs[count][0]) pfDirs.push(dirs[count]);
					else if (goodDir[1] != 0 && goodDir[1] == dirs[count][1]) pfDirs.push(dirs[count]);
				}
				if (pfDirs.length > 0) {
					pathfind = true;
					newDir = pfDirs[Math.floor(Math.random() * pfDirs.length)];
				} else {
					if ((this.dir[0] == goodDir[0] || this.dir[1] == goodDir[1]) && !this.collision(this.walls))
						pathfind = true;
				}
			}

			if (!pathfind) {
				newDir = dirs[Math.floor(Math.random() * dirs.length)];
			}
		}
		else newDir = this.dir;

		this.dir = newDir;

		// change sprite
		this.changeSpr();
	};


	this.changeSpr = function () {
		if (!Player.foodActive) {
			switch (JSON.stringify(this.dir)) {
				case "[0,-1]":
					this.img = this.imgs[0];
					break;
				case "[0,1]":
					this.img = this.imgs[1];
					break;
				case "[-1,0]":
					this.img = this.imgs[2];
					break;
				case "[1,0]":
					this.img = this.imgs[3];
					break;
			}
		}
	};


	this.checkDoor = function () {
		if (this.collision(doors, [this.dir[0] * -1, this.dir[1] * -1])) {
			this.passedDoors = true;
			for (let count = 0; count < doors.length; count++) {
				this.walls.push(doors[count]);
			}
		}
	};

	
	this.die = function () {
		// increase player score
		Player.score += settings.killScoreIncr;

		this.active = false;
		this.x = this.origin[0];
		this.y = this.origin[1];
		setTimeout(function (g) {
			g.active = true;
			g.changeSpr();
			g.passedDoors = false;
			g.walls = [];
			for (let count = 0; count < wallsGhost.length; count++) {
				g.walls.push(wallsGhost[count]);
			}
		}, settings.ghostDeadTime, this);
	};


	this.update = function () {
		if (this.active) {
			//if (!this.collision(this.walls)) this.move();
			//else this.changeDir();
			// change to wobble sprite
			if (Player.foodActive) this.img = spr.ghostWobble;
			this.move();
			if (this.visible) this.show();
			if (!this.passedDoors) this.checkDoor();

			// GAME OVER
			if (this.collision([Player], this.dir, 0)) {
				if (Player.foodActive)
					this.die();
				else
					gameOver();
			}
		}
	};


	this.move = function () {

		let applyChangeDir = true;
		// if is aligned with grid
		if ((this.x - settings.blockSize / 2) % settings.blockSize == 0 && (this.y - settings.blockSize / 2) % settings.blockSize == 0) {
			if (Math.round(Math.random()) == 1) {
				applyChangeDir = false;
				this.changeDir();
			}
		}

		if (applyChangeDir && this.collision(this.walls)) {
			this.changeDir();
		}// else {
			this.x += this.dir[0] * this.spdMult;
			this.y += this.dir[1] * this.spdMult;
		//}
		// check offscreen (x)
		if (this.x < 0) this.x = settings.canvasWidth;
		else if (this.x > settings.canvasWidth) this.x = 0;

	};

	
	this.show = function () {
		imageMode(CENTER);
		// move origin point so rotation looks correct
		//image(this.img, this.x,this.y, settings.ghostSize,settings.ghostSize);
		image(this.img, this.x,this.y , settings.ghostSize,settings.ghostSize);
	};


	// start moving
	this.changeDir();
}
