'use strict'

class AISolution {
    constructor(chessCode) {
        this._chesscode = chessCode;
    }
    // getter方法  还有setter
    get chesscode() {
        return this._chesscode;
    }

    set chesscode(c) {
        this._chesscode = c;
    }

    // 获取该位置可以反转对方棋子的个数
    getReverseNum(x, y, chessCode) {
        // 8个方向检查
        const dx = [-1, 0, 1, 1, 1, 0, -1, -1];
        const dy = [-1, -1, -1, 0, 1, 1, 1, 0];
        let reverseNum = 0;
        for (let k = 0; k < 8; k++) {
            let enemyList = [];
            for (let x1 = x + dx[k], y1 = y + dy[k]; x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8; x1 += dx[k], y1 += dy[k]) {
                let chess = gData[y1][x1];
                if (chess === 0) {
                    break;
                } else if (chess === chessCode) {
                    if (enemyList.length > 0) {
                        reverseNum += enemyList.length;
                    }
                    break;
                } else {
                    enemyList.push([x1, y1]);
                }
            }
        }

        return reverseNum;
    }

    greedyChoice(posList) {
        // 贪心算法，选择反转最多的位置下子
        let maxReverseIndex = 0;
        let maxNum = 0;
        posList.forEach((pos, index) => {
            let [x, y] = pos;
            let num = this.getReverseNum(x, y, this._chesscode);
            if (num > maxNum) {
                maxNum = num;
                maxReverseIndex = index;
            }
        });
        return posList[maxReverseIndex];
    }

    takeChess() {
        let availablePosList = getRightPositionList(this._chesscode);
        if (availablePosList.length > 0) {
            let goodPos = this.greedyChoice(availablePosList);

            let [x, y] = goodPos;
            gData[y][x] = this._chesscode;
            gSteps++;
            // 检查并反转棋子
            checkReverseChess(x, y, this._chesscode);
        }
        else {
            if (isOver) {
                return;
            }
            alert("人机无处可以落子了，你请继续");
            gSteps++;
        }

        isAIToPlay = false;
        update();
    }

    take() {
        setTimeout(() => {
            this.takeChess();
        }, 800);
    }
}

let AIPlayer = new AISolution(1);  //1：白色
