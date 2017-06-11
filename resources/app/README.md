CeilBattler Windows binary
================
 * [Run](#run)
 * [Configure](#configure)
 * [ConnectionProtocol](#connectionprotocol)
 
### Run
 * to run execute CeilBattler.exe
 * to pause press <kbd>space</kdb>
### Configure
 * you can see and change configurations in `config.json`
### ConnectionProtocol
 * Connection realized via I/O streams
 * Protocol:
 1. Your strategy print to stdout it's <kbd>name</kbd> in one line
 2. Next you strategy need to read from stdin <kbd>each</kbd> <kbd>width</kbd> <kbd>height</kbd> <kbd>colors</kbd>
 * <kbd>each</kbd> is a 'first' or 'second' determines your strategy goes 'first' or 'second'
 * <kbd>width</kbd> is a field width
 * <kbd>height</kbd> is a field height
 * <kbd>colors</kbd> is a count of colors used in field
 3. Sometimes your strategy gets <kbd>play</kbd> and then field.
 4. For each <kbd>play</kbd> and field your strategy need to print to stdout your <kbd>move</kbd>
 * <kbd>move</kbd> is a integer in [0, colors)
 * you can see examples for C++ and Python in `sample_player.cpp` and `sample_player.py`


write your questions and bugs to issues