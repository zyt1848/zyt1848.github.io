const canvas = document.getElementById('game');

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

let pos = {
    x: 0,
    y: 0
};

let myShape = null;

const oShape = [
    [1,1],
    [1,1],
];
const lineShape = [
    [1,1,1,1]
];
const tShape = [
    [0,1,0],
    [1,1,1],
];
const zShape = [
    [1,1,0],
    [0,1,1]
];
const sShape = [
    [0,1,1],
    [1,1,0]
];
const LShape = [
    [0,0,1],
    [1,1,1]
];
const antiLShape = [
    [1,1,1],
    [0,0,1]
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

function createShape() {
    pos.x = 5;
    pos.y = 0;
    let randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    let rotateTimes = Math.floor(Math.random() * 4); // 0,1,2,3
    for (let i=0;i<rotateTimes;i++) {
        randomShape = rotate90(randomShape);
    }
    myShape = randomShape;
    if (hasShapeClash(myShape, pos.x, pos.y)) {
        overFlag = true;
        console.log('game over');
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
            if (col === 1) {
                drawPoint(idxCol, idxRow, colors.white);
            } else {
                drawPoint(idxCol, idxRow, colors.black);
            }
        })
    })
}

// 将图形写入数组map中
function merge(shape, x, y) {
    shape.forEach((row, idxRow) => {
        row.forEach((col, idxCol) => {
            if (col === 1) {
                map[y + idxRow][x + idxCol] = 1;
            }
        })
    })
}
function disMerge(shape, x, y) {
    shape.forEach((row, idxRow) => {
        row.forEach((col, idxCol) => {
            if (col === 1) {
                map[y + idxRow][x + idxCol] = 0;
            }
        })
    })
}

// createShape();
// merge(tShape, pos.x, pos.y);
// map[height - 1][5] = 1;
// drawMap();


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
            if (col === 1 && idxRow > offsetY) {
                offsetY = idxRow;
            }
            if (col === 1 && idxCol > offsetX) {
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
            if (map[y + idxRow][x + idxCol] === 1 && col === 1) {
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
        if (ele === 1 && map[y + idx][nextLeftX] === 1) {
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
        if (ele === 1 && map[y + idx][nextRightX] === 1) {
            isClash = true;
        }
        // console.log('map[%s][%s]: %s, shape: %s', y + idx, nextRightX, map[y + idx][nextRightX], ele);
    })
    return isClash;
}

// 检查有无形成一整行，如有则消除这一行，并向下合并
function checkIsALine() {
    let i = height - 1;

    while (i>=0) {
        let sum = 0;
        for (let j=0;j<width;j++) {
            sum += map[i][j];
        }
        if (sum === width) {
            let r = map.slice(0,i).concat(map.slice(i+1));
            r.unshift(new Array(width).fill(0));
            map = r;
            // console.log(map);

            // score += 10;
            // scoreElem.innerHTML = score.toString();
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
            if (col === 1 
                && (y1 < 0 || y1 >=height
                    || x1 < 0 || x1 >= width)) {
                isOut = true;
            }
        })
    })
    return isOut;
}



// start of this game
createShape();
drawMap();
// console.log(map);
// moveDown();
// drawMap();

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

window.requestAnimationFrame(render);

document.addEventListener('keydown', function(e) {
    if (overFlag) {
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
