

function _ghost(x,y) {
	this.x = x;
	this.y = y;
	this.dir = [0,0];
	this.spdMult = 2;
	this.img = spr.ghosts[ghosts.length];
	this.walls = walls.filter((wall) => { return wall.name == "wall"; });


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


	this.changeDir = function () {
		let newDir = this.dir;
		while (JSON.stringify(newDir) == JSON.stringify(this.dir) || JSON.stringify(newDir.map((a) => { return a * -1; })) == JSON.stringify(this.dir)) {
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
		this.dir = newDir;
	};


	this.update = function () {
		if (!this.collision(this.walls)) this.move();
		else this.changeDir();
		this.show();
	};


	this.move = function () {

		// if is aligned with grid
		if ((this.x - settings.blockSize / 2) % 32 == 0 && (this.y - settings.blockSize / 2) % 32 == 0) {
			if (Math.round(Math.random()) == 1) {
				if (this.dir[0] == 0) {  // check right/left
					let direction = Math.round(Math.random) ? 1 : -1;
					if (!this.collision(this.walls, [direction,0])) this.dir = [direction,0];
				} else
				if (this.dir[1] == 0) {  // check up/down
					let direction = Math.round(Math.random) ? 1 : -1;
					if (!this.collision(this.walls, [0,direction])) this.dir = [0,direction];
				}

			}
		}

		this.x += this.dir[0] * this.spdMult;
		this.y += this.dir[1] * this.spdMult;
	};

	
	this.show = function () {
		imageMode(CENTER);
		image(this.img, this.x,this.y, settings.ghostSize,settings.ghostSize);
	};
}
