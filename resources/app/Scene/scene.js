const SFUNC_CLASS = require('../SFUNC/SFUNC.js')
const ProgramConnector = require('../Connectors/ProgramConnector')
const UserConnector = require('../Connectors/UserConnector')
let SFUNC = new SFUNC_CLASS();

module.exports = function(
		width,
		height,
		colors,
		moveDelay,
		fromTable,
		firstEnginePath,
		secondEnginePath,
		onEnd,
		setNameFirst, setNameSecond) {
	let oneCeilSize = 29;
	let drawColors = [
		"#3949AB",
		"#43A047",
		"#607D8B",
		"#FB8C00",
		"#F44336",
		"#9C27B0"
	];

	let Point = function(x, y) {
		this.x = x;
		this.y = y;
	}

	let playField = document.createElement('table');
	playField.id = 'play-field';
	let table = [];
	for (let i = 0; i < width; i++) {
		let tr = document.createElement('tr');
		playField.appendChild(tr);
		table[i] = [];
		for (let j = 0; j < height; j++) {
			let td = document.createElement('td');
			tr.appendChild(td);
			table[i][j] = {
				value: fromTable[i][j],
				innerElem: td
			};
		}
	}

	let reversedTable = () => {
		let _new = [];
		for (let i = 0; i < width; i++) {
			_new[i] = [];
			for (let j = 0; j < height; j++) {
				_new[i][j] = table[width - i - 1][height - j - 1];
			}
		}
		return _new;
	}

	let firstMove = true;

	let getCeils = (x, y) => {
		let visited = [];
		for (let i = 0; i < width; i++) {
			visited[i] = [];
			for (let j = 0; j < height; j++) {
				visited[i][j] = false;
			}
		}
		let dfs = (x, y, match) => {
			visited[x][y] = true;
			for (let delta of [new Point(-1, 0),
								new Point(0, -1),
								new Point(1, 0),
								new Point(0, 1)]) {
				let nx = x + delta.x;
				let ny = y + delta.y;
				if (!SFUNC.inDimension(nx, ny, width, height)) continue;
				if (!visited[nx][ny] && table[nx][ny].value == match) {
					dfs(nx, ny, match);
				}
			}
		}

		// dfs(self.x, self.y, table[self.x][self.y].value);
		dfs(x, y, table[x][y].value);
		let cords = [];
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				if (visited[i][j]) {
					cords[cords.length] = new Point(i, j);
				}
			}
		}
		return cords;
	}

	let deadMoveCounter = 0;
	let isFinished = false;
	let pause = false;
	let moveBuffer = [];
	let finishGame = () => {
		if (!isFinished) {
			isFinished = true;
			firstEngine.kill();
			secondEngine.kill();
			setTimeout(() => {
				onEnd(getCeils(0, 0).length, getCeils(width - 1, height - 1).length);
			}, 1000);
		}
	}


	let tryMove = (color) => {
		let self = undefined;
		let opponent = undefined;
		if (firstMove) {
			self = new Point(0, 0);
			opponent = new Point(width - 1, height - 1);
		} else {
			self = new Point(width - 1, height - 1);
			opponent = new Point(0, 0);
		}
		if (!(0 <= color && color < colors)) return false;
		if (table[opponent.x][opponent.y].value == color) return false;
		if (table[self.x][self.y].value == color) return false;

		let prev = getCeils(self.x, self.y).length;
		for (let ceil of getCeils(self.x, self.y)) {
			table[ceil.x][ceil.y].value = color;
		}
		let next = getCeils(self.x, self.y).length;
		if (next != prev) {
			deadMoveCounter = 0;
		} else {
			deadMoveCounter++;
		}
		if (deadMoveCounter >= 10) {
			// console.log('finally dead');
			finishGame();
		}
		let allElems = new Set();
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				allElems.add(table[i][j].value);
			}
		}
		if (allElems.length == 2) {
			// console.log('finally ended');
			finishGame();
		}

		render();

		firstMove ^= 1;
		return true;
	}
	playField.addEventListener('mousedown', (event) => {
		// console.log(event);
		let y = parseInt((event.pageX - playField.getBoundingClientRect().left) / oneCeilSize);
		let x = parseInt((event.pageY - playField.getBoundingClientRect().top) / oneCeilSize);
		// console.log(table, x, y);
		tryMakeMove(table[x][y].value);
	});

	document.body.addEventListener('keydown', (event) => {
		if (event.code == 'Space') {
			if (pause) {
				pause = false;
				for (let m of moveBuffer) {
					tryMakeMove(m);
				}
				moveBuffer = [];
			} else {
				console.log('freeze');
				pause = true;
			}
		}
	})


	let provideFirstMove = () => {
		// console.log('providing firstMove')
		firstEngine.provideMove(table);
		document.getElementById('first-engine-spinner').style.display = 'inline';
		document.getElementById('second-engine-spinner').style.display = 'none';
	}

	let provideSecondMove = () => {
		secondEngine.provideMove(reversedTable());
		document.getElementById('first-engine-spinner').style.display = 'none';
		document.getElementById('second-engine-spinner').style.display = 'inline';	
	}

	let namesReceived = 0;
	let startGame = () => {
		if (namesReceived == 2) {
			// firstEngine.provideMove(table);
			provideFirstMove();
		}
	}

	let tryMakeMove = (move) => {
		if (pause) {
			moveBuffer[moveBuffer.length] = move;
			return;
		}
		move = parseInt(move);
		if (!(0 <= move && move < colors)) {
			return false;
		}
		if (tryMove(move)) {
			if (firstMove) {
				setTimeout(() => {
					provideFirstMove();
				}, moveDelay)
			} else {
				setTimeout(() => {
					provideSecondMove();
				}, moveDelay)
			}
			return true;
		} else {
			return false;
		}
	}

	let propFirst = ["first", width, height, colors];
	let FirstClass = ProgramConnector;
	if (firstEnginePath == 'User') {
		FirstClass = UserConnector;
	}
	let firstEngine;
	setTimeout(() => {
		firstEngine = new FirstClass(firstEnginePath, propFirst, (name) => {
			document.getElementById('first-engine-name').innerHTML = name;
			namesReceived++;
			setNameFirst(name);
			startGame();
		}, (move) => {
			return tryMakeMove(move);
		});
	}, 100);

	let propSecond = ["second", width, height, colors];
	let SecondClass = ProgramConnector;
	if (secondEnginePath == 'User') {
		SecondClass = UserConnector;
	}
	let secondEngine;
	setTimeout(() => {
		secondEngine = new SecondClass(secondEnginePath, propSecond, (name) => {
			document.getElementById('second-engine-name').innerHTML = name;
			namesReceived++;
			setNameSecond(name);
			startGame();
		}, (move) => {
			return tryMakeMove(move);
		});
	}, 100);

	let render = () => {
		document.getElementById('first-engine-points').innerHTML = getCeils(0, 0).length;
		document.getElementById('second-engine-points').innerHTML = getCeils(width - 1, height - 1).length;

		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				table[i][j].innerElem.style.background = drawColors[table[i][j].value];
				table[i][j].innerElem.style.paddingTop = oneCeilSize + 'px';
				table[i][j].innerElem.style.paddingLeft = oneCeilSize + 'px';
			}
		}
	}

	render();


	this.getField = () => {
		return playField;
	}
}