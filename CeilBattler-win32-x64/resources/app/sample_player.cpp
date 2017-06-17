#include <iostream>
#include <vector>

using namespace std;


string each;
int width, height, colors;
vector<vector<int>> field;

// table already reversed
pair<int, int> get_self() {
	return make_pair(0, 0);
}

int main() {
	cout << "Sample Player" << endl;
	cin >> each >> width >> height >> colors;
	string cmd;
	field.resize(width, vector<int>(height));
	while (cin >> cmd) {
		if (cmd == "close") return 0;
		if (cmd == "play") {
			for (int i = 0; i < width; i++) {
				for (int j = 0; j < height; j++) {
					cin >> field[i][j];
				}
			}

			for (int i = 0; i < colors; i++) {
				if ((i != field[0][0])
					&& (i != field[width - 1][height - 1])) {
					cout << i << endl;
					break;
				}
			}
		}
	}
}