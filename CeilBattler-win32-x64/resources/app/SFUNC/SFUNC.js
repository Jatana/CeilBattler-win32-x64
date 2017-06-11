module.exports = function() {
	this.inDimension = (x, y, width, height) => {
		return 0 <= x && x < width && 0 <= y && y < height;
	}
}