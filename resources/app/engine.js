const Scene = require('./Scene/scene');
const ProgramConnector = require('./Connectors/ProgramConnector');
const fs = require('fs')
const Json = require('comment-json');

let config;
try {
	config = Json.parse(fs.readFileSync('config.json').toString());
} catch(err) {
	alert("Error in config.json: " + err.toString());
}

let width = parseInt(config.width);
let height = parseInt(config.height);
let colors = parseInt(config.colors);
let moveDelay = parseInt(config.moveDelay);
let strategies = config.strategies;

let table = [];
if (config.field == 'random') {
	for (let i = 0; i < width; i++) {
		table[i] = [];
		for (let j = 0; j < height; j++) {
			table[i][j] = parseInt(Math.random() * colors);
		}
	}
} else {
	table = config.table;
}


let result = [];
let names = [];
let games = [];
for (let i = 0; i < strategies.length; i++) {
	result[i] = [];
	result[i][i] = 0;
	for (let j = 0; j < strategies.length; j++) {
		if (i == j) continue;
		games[games.length] = [i, j];
	}
}

let getResult = (i, j) => {
	let a = 0;
	let b = 0;
	if (result[i][j] < 0) {
		b++;
	}
	if (result[j][i] < 0) {
		a++;
	}
	if (a == b) return "DRAW";
	if (a < b) return "LOSE";
	if (a > b) return "WIN";
}


let _process = () => {
	if (games.length == 0) {
		let table = document.getElementById('result-table');
		let namesTr = document.createElement('tr');
		let whiteSpaceTd = document.createElement('td');
		namesTr.appendChild(whiteSpaceTd);
		for (let name of names) {
			let td = document.createElement('td');
			td.innerHTML = name;
			namesTr.appendChild(td);
		}
		table.appendChild(namesTr);
		for (let i = 0; i < strategies.length; i++) {
			let tr = document.createElement('tr');
			let nameTd = document.createElement('td');
			nameTd.innerHTML = names[i];
			tr.appendChild(nameTd);
			for (let j = 0; j < strategies.length; j++) {
				let td = document.createElement('td');
				td.innerHTML = getResult(i, j);
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		document.getElementById('game-panel').style.display = 'none';
	} else {
		let i = games[games.length - 1][0];
		let j = games[games.length - 1][1];
		
		let scene = new Scene(width, height, colors, moveDelay, table, strategies[i], strategies[j], (first, second) => {
			console.log(first, second);
			if (first < second) result[i][j] = -1;
			if (first == second) result[i][j] = 0;
			if (first > second) result[i][j] = 1;
			console.log(games);
			games.length--;
			document.getElementById("play-field-panel").removeChild(scene.getField());
			setTimeout(_process, 100);
			delete scene;
		}, (name) => {
			names[i] = name;
		}, (name) => {
			names[j] = name;
		});
		document.getElementById("play-field-panel").appendChild(scene.getField());
	}
}

setTimeout(_process, 100);