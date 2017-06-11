import sys

def fprint(*args):
	print(*args)
	sys.stdout.flush()

fprint('python')

each, width, height, colors = input().split()
width = int(width)
height = int(height)
colors = int(colors)
table = [[None] * height for i in range(width)]


while True:
	cmd = input().strip()
	if cmd == 'exit': exit()
	if cmd == 'play':
		for i in range(width):
			table[i] = list(map(int, input().split()))

		for i in range(colors - 1, -1, -1):
			if i != table[0][0] and i != table[-1][-1]:
				fprint(i)
				break

