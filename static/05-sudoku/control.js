// 控制光标移动

const charNums = ['0','1','2','3','4','5','6','7','8','9'];
let player = {
    x: 0,
    y: 0
};

buttonsClickEvent();
renderCurrentCell();

addClickToNumbers();

function renderCurrentCell() {
    let index = player.x + player.y * 9;
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('cur-cell'));
    let curCell = document.querySelector('.index-' + index);
    curCell.classList.add('cur-cell');
}

// 给按钮添加点击事件
function buttonsClickEvent() {
    let loadBtn = document.getElementById('load-default-data-btn');
    let clearDataBtn = document.getElementById('clear-cell-btn');
    let getDataBtn = document.getElementById('get-data-btn');
    let solveBtn = document.getElementById('solve-btn');
    let saveBtn = document.getElementById('save-data-btn');

    loadBtn.addEventListener('click', function() {
        addValuesToCells();
    });
    clearDataBtn.addEventListener('click', function() {
        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.innerText = '');
    });

    getDataBtn.addEventListener('click', function() {
        let data = getDataFromCells();
        console.log(data);
    });

    solveBtn.addEventListener('click', function() {
        solveAndShow();
    })

    saveBtn.addEventListener('click', function() {
        let data = getDataFromCells();
        writeJsonFile(data, 'data.json');
    })
}

// 按上下左右移动光标，按0-9填入数字
document.addEventListener('keydown', function(e) {
    if (e.key == 'ArrowLeft') {
        player.x = Math.max(0, player.x - 1);
    } else if (e.key == 'ArrowRight') {
        player.x = Math.min(8, player.x + 1);
    } else if (e.key == 'ArrowUp') {
        player.y = Math.max(0, player.y - 1);
    } else if (e.key == 'ArrowDown') {
        player.y = Math.min(8, player.y + 1);
    } 
    else if (e.key in charNums) {
        let index = player.x + player.y * 9;
        let cell = document.querySelector('.index-' + index);
        cell.innerText = e.key === '0' ? '' : e.key;
    }
    else {
        console.log(e.key);
    }

    renderCurrentCell();
});


// 添加点击事件，点击cell切换到点击单元格
let cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('click', function(e) {
        cell.classList.forEach(classname => {
            // 找到class中的index并赋值给player
            if (classname.substring(0,6) == 'index-') {
                let index = parseInt(classname.substring(6, classname.length));
                player.x = index % 9;
                player.y = Math.floor(index / 9);
            }
        });

        renderCurrentCell();
    });
});

function addClickToNumbers() {
    const numbtns = document.querySelectorAll('.number-input div');
    numbtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let val = btn.innerText;
            let index = player.x + player.y * 9;
            let cell = document.querySelector('.index-' + index);
            cell.innerText = val === '0' ? '' : val;
        })
    })
}
