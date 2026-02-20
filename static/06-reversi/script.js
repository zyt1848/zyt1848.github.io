'use strict'

const chessboard = document.querySelector('.chessboard');
var gData = [];
var isOver = false; //结束标志
var isBlackFirst = 1; // 0: 白棋先手   1: 黑棋先手
var isAIToPlay = false;

let gSteps = 4; //总步数
let player1 = {
    color: 'white',
    chessNum: 2
}
let player2 = {
    color: 'black',
    chessNum: 2
}

function initData() {
    // 生成8*8的全0数组，注意不要写成new Array(8).fill(new Array(8).fill(0))，那样gData里的数组是同一个对象，即所有列相同
    gData = new Array(8).fill().map(() => new Array(8).fill(0));
    // 1: 白棋  2: 黑棋
    gData[3][3] = 1;
    gData[4][4] = 1;
    gData[3][4] = 2;
    gData[4][3] = 2;
}

function initChessBoard() {
    // 创建棋盘
    chessboard.innerHTML = '';
    for (let i=0;i<64;i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        chessboard.appendChild(cell);
    }
    
    // 初始化棋子
    initData();
    drawChesses();
}

function drawChesses() {
    // console.log(gData)
    const cells = chessboard.querySelectorAll('.cell');
    // 清空棋盘上的棋子
    cells.forEach(cell => cell.innerHTML = '');

    gData.forEach((row, y) => {
        row.forEach((col, x) => {
            // console.log('x, y, val:', x, y, col)
            if (col === 1) {
                let chess = document.createElement('div');
                chess.classList.add('chess');
                chess.classList.add('chess-white1');
                cells[y * 8 + x].append(chess);
            }
            else if (col === 2) {
                let chess = document.createElement('div');
                chess.classList.add('chess');
                chess.classList.add('chess-black1');
                cells[y * 8 + x].append(chess);
            }
        });
    });
}

// 给网格添加点击事件
function addClickCells() {
    const cells = chessboard.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.addEventListener('click', function() {
            let x = index % 8;
            let y = Math.floor(index / 8);
            // 如果该位置为空，根据总步数填入对应棋子，更新下一手是黑还是白棋
            if (gData[y][x] === 0 && !isAIToPlay) {
                let chessCode = (gSteps + isBlackFirst) % 2 === 0 ? 1 : 2;
                // gData[y][x] = chessCode;
                // // 检查并反转棋子
                // checkReverseChess(x, y, chessCode);

                let availablePosList = getRightPositionList(chessCode);
                if (availablePosList.length > 0) {
                    let pos = availablePosList.find(pos => pos.toString() === [x, y].toString());
                    if (pos) {
                        gData[y][x] = chessCode;
                        gSteps++;
                        // 检查并反转棋子
                        checkReverseChess(x, y, chessCode);
                        if (!isOver) {
                            isAIToPlay = true;
                            AIPlayer.take();
                        }
                    }
                } else {
                    let chessColor = chessCode === 1 ? '白' : '黑';
                    alert(`${chessColor}棋, 你没有可以下的位置了, 帮你跳过这一步让对方下`);
                }

                update();
            }
        });
    })
}

function update() {
    drawChesses();
    calculateChessNum();
    
    if (isOver) {
        let msg = '';
        if (player1.chessNum > player2.chessNum) {
            msg = '白棋胜';
        } else if (player1.chessNum < player2.chessNum) {
            msg = '黑棋胜';
        } else {
            msg = '平局'
        }
        setTimeout(() => alert('游戏结束, ' + msg), 100);
    }
    updateWhoToPlay();
}

function checkReverseChess(x, y, chessCode) {
    // 8个方向检查
    const dx = [-1, 0, 1, 1, 1, 0, -1, -1];
    const dy = [-1, -1, -1, 0, 1, 1, 1, 0];
    for (let k = 0; k < 8; k++) {
        let enemyList = [];
        for (let x1 = x + dx[k], y1 = y + dy[k]; x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8; x1 += dx[k], y1 += dy[k]) {
            let chess = gData[y1][x1];
            if (chess === 0) {
                break;
            } else if (chess === chessCode) {
                while (enemyList.length) {
                    let pos = enemyList.pop();
                    gData[pos[1]][pos[0]] = chessCode;

                    // 给反转格子添加背景色，片刻后移除
                    let index = pos[1] * 8 + pos[0];
                    const cells = chessboard.querySelectorAll('.cell');
                    cells[index].classList.add('reverse');
                    setTimeout(() => {
                        cells[index].classList.remove('reverse');
                    },500);
                }
                break;
            } else {
                enemyList.push([x1, y1]);
            }
        }
    }
}

// 判断该位置是否可以放置，即是否能吃掉对方的子
function isRightPosition(x, y, chessCode) {
    // 8个方向检查
    const dx = [-1, 0, 1, 1, 1, 0, -1, -1];
    const dy = [-1, -1, -1, 0, 1, 1, 1, 0];
    for (let k = 0; k < 8; k++) {
        let enemyList = [];
        for (let x1 = x + dx[k], y1 = y + dy[k]; x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8; x1 += dx[k], y1 += dy[k]) {
            let chess = gData[y1][x1];
            if (chess === 0) {
                break;
            } else if (chess === chessCode) {
                if (enemyList.length > 0) {
                    return true;
                } else {
                    break; // 注意这里要跳出循环，即返回false
                }
            } else {
                enemyList.push([x1, y1]);
            }
        }
    }
    return false;
}

function getRightPositionList(chessCode) {
    let posList = [];
    gData.forEach((row, y) => {
        row.forEach((col, x) => {
            if (col === 0) {
                if (isRightPosition(x, y, chessCode)) {
                    posList.push([x, y]);
                }
            }
        });
    });
    return posList;
}

function showHintPositions() {
    let chessCode = [1, 2][(gSteps + isBlackFirst) % 2];
    let availablePosList = getRightPositionList(chessCode);
    const cells = chessboard.querySelectorAll('.cell');
    availablePosList.forEach(pos => {
        let index = pos[1] * 8 + pos[0];
        cells[index].classList.add('hint-color');
        setTimeout(() => {
            cells[index].classList.remove('hint-color');
        }, 2000);
    });
}

// 白棋先手
function updateWhoToPlay() {
    const colorList = ['白', '黑'];
    const chessColor = document.getElementById('chesscolor');
    const index = (gSteps + isBlackFirst) % 2;
    chessColor.innerHTML = colorList[index];
    
    const colorClassList = ['chess-white1', 'chess-black1'];
    const colorDisplayChess = document.querySelector('.who-next .chess');
    colorDisplayChess.className = 'chess';
    colorDisplayChess.classList.add(colorClassList[index]);
}


// 计算黑白棋子数，判断是否游戏结束
function calculateChessNum() {
    let whiteNum = 0;
    let blackNum = 0;
    for (let i=0;i<8;i++) {
        for (let j=0;j<8;j++) {
            if (gData[i][j] === 1) {
                whiteNum++;
            }
            else if (gData[i][j] === 2) {
                blackNum++;
            }
        }
    }

    if (whiteNum + blackNum === 64 || whiteNum === 0 || blackNum === 0) {
        isOver = true;
    }
    player1.chessNum = whiteNum;
    player2.chessNum = blackNum;
    document.getElementById('player1').innerText = whiteNum;
    document.getElementById('player2').innerText = blackNum;
}

// 给按键添加点击事件
function addClickToBtns() {
    const resetBtn = document.querySelector('.reset-btn');
    resetBtn.addEventListener('click', function() {
        resetChessBoard();
        console.log('重置棋盘');
    });

    const changePlayerBtn = document.querySelector('.change-player');
    changePlayerBtn.addEventListener('click', function() {
        resetChessBoard();
        isBlackFirst = isBlackFirst === 0 ? 1 : 0;
        // console.log(isBlackFirst);
        updateWhoToPlay();
    });

    const hintBtn = document.querySelector('.show-hint-btn');
    hintBtn.addEventListener('click', function() {
        showHintPositions();
    });
}

// 重置棋盘
function resetChessBoard() {
    isOver = false;
    isBlackFirst = 1;
    initChessBoard();
    // 添加点击事件，因为初始化棋盘时格子会重新生成
    addClickCells();

    calculateChessNum();
    updateWhoToPlay();
}

function start() {
    resetChessBoard();
    addClickToBtns();
}

start();
