const canvas = document.getElementById('game');
const canvas2 = document.getElementById('preView'); // 右侧图形预览
const overMsg = document.getElementById('overMsg');
const scoreText = document.getElementById('score');
let score = 0;

const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
console.log(ctx);

const w = canvas.clientWidth;
const h = canvas.clientHeight;
const width = w / 10;
const height = h / 10;
const colors = {
    'black': '#000000',
    'white': '#FFFFFF',
    'orange': '#F39C12',
    'wisteria': '#8E44AD',
    'peterRiver': '#3498DB',
    'emerald': '#2ECC71',
    'pampkin': '#D35400',
    'soda': '#7F8FA6',
}
let overFlag = false;

let pos = {
    x: 0,
    y: 0
};

let myShape = null;
let shapeQueue = [];

const oShape = [
    [1,1],
    [1,1],
];
const lineShape = [
    [2,2,2,2]
];
const tShape = [
    [0,3,0],
    [3,3,3],
];
const zShape = [
    [4,4,0],
    [0,4,4]
];
const sShape = [
    [0,5,5],
    [5,5,0]
];
const LShape = [
    [0,0,6],
    [6,6,6]
];
const antiLShape = [
    [7,7,7],
    [0,0,7]
];

const shapes = [oShape, lineShape, tShape, zShape, sShape, LShape, antiLShape];

// let player = {
//     pos: pos,
//     shape: tShape,
// };


// 画背景为黑色
ctx.fillStyle = colors.black;
ctx.fillRect(0,0,w,h);

// 画一个区域
// for (let i=0;i<width;i++) {
//     for (let j=0;j<5;j++) {
//         drawPoint(i, j);
//     }
// }


function drawPoint(x, y, color = null) {
    ctx.fillStyle = color || colors.white;
    const size = 10;
    ctx.fillRect(x * size, y * size, size, size);
}

function drawShape(shape, x, y) {
    shape.forEach((row, indexRow) => {
        row.forEach((col, indexCol) => {
            if (col === 1) {
                drawPoint(x + indexCol, y + indexRow);
            }
        })
    })
}

function makeRandomShape() {
    let randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    let rotateTimes = Math.floor(Math.random() * 4); // 0,1,2,3
    for (let i=0;i<rotateTimes;i++) {
        randomShape = rotate90(randomShape);
    }
    return randomShape;
}

function createShape() {
    pos.x = 5;
    pos.y = 0;
    
    // 从队列中取图形，并给队列添加新图形
    myShape = shapeQueue[0];
    shapeQueue.shift();
    shapeQueue.push(makeRandomShape());
    drawShape2(shapeQueue[0]);

    if (hasShapeClash(myShape, pos.x, pos.y)) {
        overFlag = true;
        console.log('game over');
        overMsg.classList.remove('hide');
        return;
    }
    merge(myShape, pos.x, pos.y);
}


// 创建height行width列的二维数组map，其元素均为0
let map = [];
for (let i=0;i<height;i++) {
    map.push(new Array(width).fill(0));
}

function drawMap() {
    map.forEach((row, idxRow) => {
        row.forEach((col, idxCol) => {
            let color = null;
            // switch (col) {
            //     case 1:
            //         color = colors.emerald;
            //         break;
            //     case 2:
            //         color = colors.orange;
            //         break;
            //     case 3:
            //         color = colors.pampkin;
            //         break;
            //     case 4:
            //         color = colors.peterRiver;
            //         break;
            //     case 5:
            //         color = colors.soda;
            //         break;
            //     case 6:
            //         color = colors.wisteria;
            //         break;
            //     case 7:
            //         color = colors.white;
            //         break;
            //     default:
            //         color = colors.black;
            // }
            if (col < 0 || col >= colors.length) {
                return;
            }
            let colorArr = [];
            for (key in colors) {
                colorArr.push(colors[key]);
            }
            color = colorArr[col];
            drawPoint(idxCol, idxRow, color);
        })
    })
}

// 将图形写入数组map中
function merge(shape, x, y) {
    shape.forEach((row, idxRow) => {
        row.forEach((col, idxCol) => {
            if (col > 0) {
                map[y + idxRow][x + idxCol] = col;
            }
        })
    })
}
function disMerge(shape, x, y) {
    shape.forEach((row, idxRow) => {
        row.forEach((col, idxCol) => {
            if (col > 0) {
                map[y + idxRow][x + idxCol] = 0;
            }
        })
    })
}

function moveDown() {
    let shapeOffsetY = getShapeOffset(myShape)[1];
    if (pos.y === height - shapeOffsetY
        || hasDownShapeClash(myShape, pos.x, pos.y)) {
            // 图形到底
            checkIsALine();
            // console.log('到底了');
            createShape();
            return;
        }
    disMerge(myShape,pos.x, pos.y);
    pos.y++;
    merge(myShape, pos.x, pos.y);
}
function moveLeft() {
    if (pos.x === 0
        || hasNextShapeLeftClash(myShape, pos.x, pos.y)) {
        return;
    }
    disMerge(myShape, pos.x, pos.y);
    pos.x--;
    merge(myShape, pos.x, pos.y);
}
function moveRight() {
    if (pos.x === width - myShape[0].length
        || hasNextShapeRightClash(myShape, pos.x, pos.y)) {
        return;
    }
    disMerge(myShape, pos.x, pos.y);
    pos.x++;
    merge(myShape, pos.x, pos.y);
}

// 返回图形宽和高
function getShapeOffset(shape) {
    let offsetY = 0;
    let offsetX = 0;
    shape.forEach((row, idxRow) => {
        row.forEach((col, idxCol) => {
            if (col > 0 && idxRow > offsetY) {
                offsetY = idxRow;
            }
            if (col > 0 && idxCol > offsetX) {
                offsetX = idxCol;
            }
        });
    });
    return [offsetX + 1, offsetY + 1];
}

// 检测图形是否与map中元素有重合部分，有重合部分返回true，否则返回false
function hasShapeClash(shape, x, y) {
    let isClash = false;
    shape.forEach((row, idxRow) => {
        row.forEach((col, idxCol) => {
            if (map[y + idxRow][x + idxCol] > 0 && col > 0) {
                isClash = true;
            }
        })
    })
    return isClash;
}

function hasDownShapeClash(shape, x, y) {
    disMerge(shape, x, y);
    let nextY = y + 1;
    if (hasShapeClash(shape, x, nextY)) {
        merge(shape, x, y);
        return true;
    }
    merge(shape, x, y);
    return false;
}

// 检查图形向下移动一格后是否有图形底部冲突
// function hasNextShapeBottomClash(shape, x, y) {
//     let isClash = false;
//     let bottomLine = shape[shape.length - 1];
//     const nextBottomY = y + shape.length;
//     bottomLine.forEach((ele, idx) => {
//         if (ele === 1 && map[nextBottomY][x + idx] === 1) {
//             isClash = true;
//         }
//         // console.log('map[%s][%s]: %s, shape: %s', nextBottomY, x + idx, map[nextBottomY][x+idx], ele);
//     })
//     return isClash;
// }
// 检查图形向左移动一格后是否有图形底部冲突
function hasNextShapeLeftClash(shape, x, y) {
    let isClash = false;
    let leftLine = [];
    for (let i=0;i<shape.length;i++) {
        leftLine.push(shape[i][0]);
    }
    // leftLine 是以行向量形式存储的列向量
    const nextLeftX = x - 1;
    leftLine.forEach((ele, idx) => {
        if (ele > 0 && map[y + idx][nextLeftX] > 0) {
            isClash = true;
        }
    })
    return isClash;
}
function hasNextShapeRightClash(shape, x, y) {
    let isClash = false;
    let rightLine = [];
    for (let i=0;i<shape.length;i++) {
        rightLine.push(shape[i][shape[0].length - 1]);
    }
    const nextRightX = x + shape[0].length;

    rightLine.forEach((ele, idx) => {
        if (ele > 0 && map[y + idx][nextRightX] > 0) {
            isClash = true;
        }
        // console.log('map[%s][%s]: %s, shape: %s', y + idx, nextRightX, map[y + idx][nextRightX], ele);
    })
    return isClash;
}

// 检查有无形成一整行，如有则消除这一行，并向下合并
// 这块要大改
function checkIsALine() {
    let i = height - 1;

    while (i>=0) {
        let sum = 0;
        let gtZeroNum = 0;
        for (let j=0;j<width;j++) {
            sum += map[i][j];
            if (map[i][j] > 0) {
                gtZeroNum++;
            }
        }
        if (gtZeroNum === width) {
            let r = map.slice(0,i).concat(map.slice(i+1));
            r.unshift(new Array(width).fill(0));
            map = r;
            // console.log(map);

            score += 10;
            scoreText.innerHTML = score.toString();
            frames = 0;
            continue;
        } else if (sum === 0) {
            break;
        }

        i--;
    }
}

/*
1 2 3
4 5 6

4 1
5 2
6 3

arr[m][n]:

arr[0][0] -> arr[0][1]
arr[1][0] -> arr[0][0]
arr[1][1] -> arr[1][0]

arr[x][y] -> arr[y][m-x-1]
==> arr[x][y] = arr[y][m-1-x]

*/

// 将二维数组顺时针旋转90度，返回旋转后的二维数组
function rotate90(shape) {
    let arr = [];
    // 生成col行 row列的二维数组
    for (let i=0;i<shape[0].length;i++) {
        arr.push(new Array(shape.length).fill(0));
    }
    shape.forEach((row, idxRow) => {
        row.forEach((col, idxCol) => {
            arr[idxCol][shape.length - 1 - idxRow] = col;
        })
    })
    return arr;
}

function rotateMyShape() {
    const rotatedShape = rotate90(myShape);
    disMerge(myShape, pos.x, pos.y);
    if (hasShapeClash(rotatedShape, pos.x, pos.y) 
        || isShapeOutOfRange(rotatedShape, pos.x, pos.y)) {
        // console.log('有旋转冲突');
        merge(myShape, pos.x, pos.y);
        return;
    }
    myShape = rotatedShape;
    merge(myShape, pos.x, pos.y);
}

function isShapeOutOfRange(shape, x, y) {
    let isOut = false;
    shape.forEach((row, idxRow) => {
        row.forEach((col, idxCol) => {
            let x1 = x + idxCol;
            let y1 = y + idxRow;
            if (col > 0
                && (y1 < 0 || y1 >=height
                    || x1 < 0 || x1 >= width)) {
                isOut = true;
            }
        })
    })
    return isOut;
}



// 绘制右侧预览窗口
function initPreView() {
    ctx2.fillStyle = colors.black;
    ctx2.fillRect(0,0,canvas2.clientWidth, canvas2.clientHeight);
}

function drawPoint2(x, y, color = null) {
    ctx2.fillStyle = color || colors.white;
    const size = 10;
    ctx2.fillRect(x * size, y * size, size, size);
}

function drawShape2(shape) {
    initPreView();
    shape.forEach((row, indexRow) => {
        row.forEach((col, indexCol) => {
            // if (col > 0) {
            //     drawPoint2(indexCol, indexRow);
            // }
            let colors1 = [];
            for (key in colors) {
                colors1.push(colors[key]);
            }
            if (col >=0 && col < colors1.length) {
                let color = colors1[col];
                drawPoint2(indexCol, indexRow, color);
            }
        })
    })
}

// start of this game
function start() {
    map.forEach((row, idxRow) => {
        row.forEach((col, idxCol) => {
            map[idxRow][idxCol] = 0;
        })
    })
    overFlag = false;
    score = 0;
    scoreText.innerHTML = '0';
    if (!overMsg.classList.contains('hide')) {
        overMsg.classList.add('hide');
    }

    initPreView();

    // 给形状队列添加一个形状并显示
    shapeQueue.push(makeRandomShape());
    drawShape2(shapeQueue[0]);

    createShape();
    drawMap();

    window.requestAnimationFrame(render);
}

start();


let frames = 0;
const fps = 30;

function render() {
    frames++;
    if (frames >= fps) {
        moveDown();
        drawMap();

        frames = 0;
    }
    
    let raf = window.requestAnimationFrame(render);
    if (overFlag) {
        console.log('AnimationFrame over');
        cancelAnimationFrame(raf);
    }
}
// 调用第一帧
// window.requestAnimationFrame(render);
// window.requestAnimationFrame 默认为每秒60帧


document.addEventListener('keydown', function(e) {
    if (overFlag) {
        if (e.key === ' ' || e.key === 'Enter') {
            start();
        }
        return;
    }

    switch (e.key) {
        case 's':
            moveDown();
            break;
        case 'a':
            moveLeft();
            break;
        case 'd':
            moveRight();
            break;
        case 'w':
            rotateMyShape();
            drawMap();
        default: 

    }

    drawMap();
})

// 改彩色版后，莫名卡顿