module.exports = function(engine_path, playerProperties, nameCb, moveCb) {
	nameCb('User');

	this.provideMove = (field) => {}

	this.kill = () => {}

	this.changeState = (_state) => {
		state = _state;
	}
}