

function _ghost(x,y) {
	this.x = x;
	this.y = y;


	this.update = function () {
		this.move();
		this.show();
	};


	
	this.show = function () {
		noStroke();

	};
}
