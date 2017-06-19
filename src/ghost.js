

function _ghost(x,y) {
	this.x = x;
	this.y = y;
	this.dir = [0,0];
	this.spdMult = 2;

	if (ghosts.length < 4) {
		this.img = spr.ghosts[ghosts.length];
	} else {
		this.img = spr.ghosts[4];
	}



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
		let newDir = this.dir;

		while (JSON.stringify(newDir) == JSON.stringify(this.dir) && JSON.stringify([newDir[0] * -1, newDir[1] * -1]) == JSON.stringify(this.dir)) {

			// try to move towards player / pathfind
			let pathfind = false;
			if (Math.random() <= settings.ghostTrackChance) {
				pathfind = true;
				// randomly go left/right or up/down first
				if (Math.round(Math.random()) == 0) {  // left/right
					if (Player.x < this.x) {  // go left
						newDir = [-1,0];
					} else if (Player.x > this.x) {  // go right
						newDir = [1,0];
					} else pathfind = false;
				} else {  // up/down
					if (Player.y < this.y) {  // go up
						newDir = [0,-1];
					} else if (Player.y > this.y) {  // go down
						newDir = [0,1];
					} else pathfind = false;
				}
				if (pathfind && JSON.stringify([newDir[0] * -1, newDir[1] * -1]) == JSON.stringify(this.dir) || this.collision(wallsGhost, newDir)) {
					pathfind = false;
				}
			}

			if (!pathfind) {
				let axis = Math.round(Math.random()) ? "x" : "y";
				let direction = Math.round(Math.random());
				if (direction == 0) direction = -1;
				switch (axis) {
					case "x":
						newDir = [direction,0];
						break;
					case "y":
						newDir = [0,direction];
						break;
				}
			}
		}
		this.dir = newDir;
	};


	this.update = function () {
		//if (!this.collision(wallsGhost)) this.move();
		//else this.changeDir();
		this.move();
		this.show();

		// GAME OVER
		if (this.collision([Player], this.dir, 0))
			gameOver();
	};


	this.move = function () {

		// if is aligned with grid
		if ((this.x - settings.blockSize / 2) % settings.blockSize == 0 && (this.y - settings.blockSize / 2) % settings.blockSize == 0) {

			// try to move towards player / pathfind
			let newDir = this.dir;
			let pathfind = false;
			if (Math.random() <= settings.ghostTrackChance) {
				pathfind = true;
				// randomly go left/right or up/down first
				if (Math.round(Math.random()) == 0) {  // left/right
					if (Player.x < this.x) {  // go left
						newDir = [-1,0];
					} else if (Player.x > this.x) {  // go right
						newDir = [1,0];
					} else pathfind = false;
				} else {  // up/down
					if (Player.y < this.y) {  // go up
						newDir = [0,-1];
					} else if (Player.y > this.y) {  // go down
						newDir = [0,1];
					} else pathfind = false;
				}
				if (pathfind && JSON.stringify([newDir[0] * -1, newDir[1] * -1]) == JSON.stringify(this.dir) || this.collision(wallsGhost, newDir)) {
					pathfind = false;
				}
				else this.dir = newDir;
			}

			if (!pathfind) {
				if (Math.round(Math.random()) == 1) {
					if (this.dir[0] == 0) {  // check right/left
						let direction = Math.round(Math.random()) ? 1 : -1;
						if (!this.collision(wallsGhost, [direction,0])) {
							this.dir = [direction,0];
						}
					} else
					if (this.dir[1] == 0) {  // check up/down
						let direction = Math.round(Math.random()) ? 1 : -1;
						if (!this.collision(wallsGhost, [0,direction])) {
							this.dir = [0,direction];
						}
					}
				}
			}
		}

		if (!this.collision(wallsGhost)) {
			this.x += this.dir[0] * this.spdMult;
			this.y += this.dir[1] * this.spdMult;
		} else this.changeDir();
		// check offscreen (x)
		if (this.x < 0) this.x = settings.canvasWidth;
		else if (this.x > settings.canvasWidth) this.x = 0;
	};

	
	this.show = function () {
		imageMode(CENTER);
		image(this.img, this.x,this.y, settings.ghostSize,settings.ghostSize);
	};


	// start moving
	this.changeDir();
}
