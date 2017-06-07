const spawn = require('child_process').spawn;
let uniq_id = 0;
module.exports = function(engine_path, playerProperties, nameCb, moveCb) {
	let args = engine_path.split(' ');
	console.log(args[0], args.slice(1, args.length));
	let process = spawn(args[0], args.slice(1, args.length));
	let state = 'WAITING_NAME';
	let is_running = true;
	let cur = uniq_id++;
	let pushBuff = '';
	let canWrite = true;
	let push = (s) => {
		pushBuff += s;
		if (canWrite && process.stdin.writable && pushBuff.length) {
			process.stdin.write(pushBuff);
			pushBuff = '';
		}
	}

	process.stdout.on('data', (data) => {
		data = data + '';
		console.log(data);
		if (state == 'WAITING_NAME') {
			for (let prop of playerProperties) {
				push(prop + ' ');
			}
			push('\n');
			state = 'NONE';
			nameCb(data);
		} else if (state == 'WAITING_MOVE') {
			if (moveCb(data)) {
				state = 'NONE';
			}
		}
	});


	process.on('exit', () => {
		is_running = false;
	})

	this.provideMove = (field) => {
		if (!is_running) return false;
		if (!process.stdin.writable) return false;

		push('play\n');
		for (let i = 0; i < field.length; i++) {
			for (let j = 0; j < field[i].length; j++) {
				push(field[i][j].value + ' ');
			}
			push('\n');
		}
		this.changeState('WAITING_MOVE');
	}

	this.kill = () => {
		process.stdin.write('exit\n');
		state = 'NONE';
		setTimeout(() => {
			process.kill();	
		}, 100);
	}

	this.changeState = (_state) => {
		state = _state;
	}
}