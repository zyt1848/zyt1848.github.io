const sudokuArea = document.querySelector('.numbers');

// 全局变量，用于保存数独数据
var gData = [];

createGridCells();
// addValuesToCells();
// getDataFromCells(); 



// 创建网格(grid)和单元格(cell)，设置格子的class
function createGridCells() {
    for (let i=0;i<9;i++) {
        let grid = document.createElement('div');
        grid.className = 'grid';
        for (let j=0;j<9;j++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            grid.appendChild(cell);
        }
        sudokuArea.appendChild(grid);
    }

    let cells = sudokuArea.querySelectorAll('.cell');
    for (let y=0;y<9;y++) {
        for (let x=0;x<9;x++) {
            let gridIndex = Math.floor(y / 3) * 3 + Math.floor(x / 3);
            let cellOffset = (y - Math.floor(y / 3) * 3 ) * 3 + (x - Math.floor(x / 3) * 3);
            let cellIndex = gridIndex * 9 + cellOffset;
            cells[cellIndex].classList.add('index-' + (y * 9 + x))
        }
    }
}

function addValuesToCells(data) {
    let arr = data || [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]
    ];

    arr.forEach((row, y) => {
        row.forEach((val, x) => {
            let index = y * 9 + x;
            let cell = document.querySelector('.index-' + index);
            cell.innerText = val === 0 ? '' : val;
        })
    })

    // arr.forEach((row, y) => {
    //     row.forEach((val, x) => {
    //         // console.log(val, x, y);
    //         let gridIndex = Math.floor(y / 3) * 3 + Math.floor(x / 3);
    //         let cellOffset = (y - Math.floor(y / 3) * 3 ) * 3 + (x - Math.floor(x / 3) * 3);
    //         let cellIndex = gridIndex * 9 + cellOffset;
    //         cells[cellIndex].innerText = val;
    //     });
    // });

    // arr[i][j] == cell[index]
    // 对应关系为：arr块索引 * 9 + offset
}

function getDataFromCells() {
    // 不要用Array()创建数组，可能有坑
    let data = [];
    
    for (let i=0;i<9;i++) {
        let line = [];
        for (let j=0;j<9;j++) {
            let index = i * 9 + j;
            let cell = document.querySelector('.index-' + index);
            // console.log(cell);
            // 如果没有内容，则给一个0
            line.push(parseInt(cell.innerText || '0'));
        }
        data.push(line);
    }
    
    gData = data;
    return data;
}


var solveSudoku = function(board) {
    var map = board.map(i => {
        return i.map(i => {
            return i == 0 ? undefined : Number(i)
        })
    })

    function validValues(x, y) {
        var exist = new Array(10).fill(true)
        var row = Math.floor(x / 3), col = Math.floor(y / 3)
        var minX = row * 3, maxX = minX + 3, minY = col * 3, maxY = minY + 3
        for (let i = minX; i < maxX; i += 1) {
            for (let j = minY; j < maxY; j += 1) {
                if (map[i][j] != undefined) {
                    exist[map[i][j]] = false
                }
            }
        }
        for (let i = 0; i < 9; i += 1) {
            if (map[i][y] != undefined) {
                exist[map[i][y]] = false
            }
            if (map[x][i] != undefined) {
                exist[map[x][i]] = false
            }
        }
        var result = []
        exist.forEach((val, idx) => {
            if (val) {
                result.push(idx)
            }
        })
        return result.slice(1)
    }

    function next(x, y) {
        y += 1
        x += Math.floor(y / 9)
        y %= 9
        return [x, y]
    }

    function fillIn(x, y) {
        if (x >= 9 || y >= 9) {
            return true
        } else if (map[x][y] != undefined) {
            return fillIn(...next(x, y))
        } else {
            let valid = validValues(x, y), len = valid.length
            for (let i = 0; i < len; i += 1) {
                map[x][y] = valid[i]
                let result = fillIn(...next(x, y))
                if (result) {
                    return true
                }
            }
            map[x][y] = undefined
            return false
        }
    }

    fillIn(0, 0)

    for (let i = 0; i < 9; i += 1) {
        for (let j = 0; j < 9; j += 1) {
            // board[i][j] = String(map[i][j])
            board[i][j] = map[i][j]
        }
    }
};

function solveAndShow() {
    let data = getDataFromCells();
    solveSudoku(data);
    addValuesToCells(data);
}