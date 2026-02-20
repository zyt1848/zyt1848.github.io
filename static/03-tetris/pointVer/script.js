const canvas = document.getElementById('game');
const scoreElem = document.getElementById('score');
const gameOverInfo = document.getElementById('gameOverInfo');

const ctx = canvas.getContext('2d');
console.log(ctx);

const w = canvas.clientWidth;
const h = canvas.clientHeight;
const width = w / 10;
const height = h / 10;
const colors = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#FF0000',
}
let overFlag = false;
let score = 0;

// 画背景为黑色
ctx.fillStyle = colors.black;
ctx.fillRect(0,0,w,h);


function drawPoint(x, y, color = null) {
    ctx.fillStyle = color || colors.white;
    const size = 10;
    ctx.fillRect(x * size, y * size, size, size);
}


let pos = {
    x: 0,
    y: 0
};


// 调用第一帧
// window.requestAnimationFrame(render);
// window.requestAnimationFrame 默认为每秒60帧


// 创建height行width列的二维数组map，其元素均为0
let map = [];
for (let i=0;i<height;i++) {
    map.push(new Array(width).fill(0));
}

function drawMap() {
    map.forEach((row, idxRow) => {
        row.forEach((col, idxCol) => {
            if (col === 1) {
                drawPoint(idxCol, idxRow, colors.white);
            } else {
                drawPoint(idxCol, idxRow, colors.black);
            }
        })
    })
}

function createPoint() {
    pos.x = 5;
    pos.y = 0;
    if (map[pos.y][pos.x] === 1) {
        // clearInterval(game);
        overFlag = true;
        console.log('Game Over!');
        gameOverInfo.innerHTML = '游戏结束';
        return;
    }
    map[pos.y][pos.x] = 1;
    console.log('point created');
}

// 检查是否到底，检测是否形成一整行，向下移动一格
function toDown() {
    if (pos.y === height - 1 || map[pos.y + 1][pos.x] === 1) {
        checkIsALine();
        createPoint();
        return;
    }
    map[pos.y][pos.x] = 0;
    pos.y++;
    map[pos.y][pos.x] = 1;
}

function checkIsALine() {
    let i = height - 1;
    let sum = 0;
    while (i>=0) {
        sum = 0;
        for (let j=0;j<width;j++) {
            sum += map[i][j];
        }
        if (sum === width) {
            let r = map.slice(0,i).concat(map.slice(i+1));
            r.unshift(new Array(width).fill(0));
            map = r;
            // console.log(map);

            score += 10;
            scoreElem.innerHTML = score.toString();
            frames = 0;
            continue;
        } else if (sum === 0) {
            break;
        }

        i--;
    }
}

createPoint();

// let game = setInterval(() => {
//     toDown();
//     drawMap();
// }, 50);


let frames = 0;
const fps = 30;

function render() {
    frames++;
    if (frames >= fps) {
        toDown();
        drawMap();

        frames = 0;
    }
    
    let raf = window.requestAnimationFrame(render);
    if (overFlag) {
        cancelAnimationFrame(raf);
    }
}

window.requestAnimationFrame(render);

window.addEventListener('keydown', function(e) {
    // console.log(e);
    if (e.key === 'a') {
        if (pos.x > 0 && map[pos.y][pos.x - 1] === 0) {
            map[pos.y][pos.x] = 0;
            pos.x--;
            map[pos.y][pos.x] = 1;
        }
    } else if (e.key === 'd') {
        if (pos.x < width - 1 && map[pos.y][pos.x + 1] === 0) {
            map[pos.y][pos.x] = 0;
            pos.x++;
            map[pos.y][pos.x] = 1;
        }
    } else if (e.key === 's') {
        if (pos.y < height - 1 && map[pos.y + 1][pos.x] === 0) {
            map[pos.y][pos.x] = 0;
            pos.y++;
            map[pos.y][pos.x] = 1;
        }
    }
    drawMap();
})