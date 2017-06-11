const spawn = require('child_process').spawn;

let a = spawn('C:/Programs/Python-3/python.exe C:/Users/Jatana/CeilBattler/Connectors/Sample/sample_player.py')
let b = spawn('C:/Programs/Python-3/python.exe C:/Users/Jatana/CeilBattler/Connectors/Sample/sample_player.py')

console.log(a.stdin.writable)
console.log(b.stdin.writable)