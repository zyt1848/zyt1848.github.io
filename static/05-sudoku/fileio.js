var readFile = function(file, isImportData = false) {
    const xhrFile = new XMLHttpRequest;
    filePath = file || 'text.txt';

    xhrFile.open('GET', filePath, false);
    // method 1
    // xhrFile.onload = function() {
    //     const allText = xhrFile.response;
    //     mycallback(allText);
    // }
    // function mycallback(text) {
    //     console.log(text)
    // }

    // method2
    // xhrFile.onreadystatechange = function() {
    //     if (xhrFile.readyState == 4) {
    //         console.log(xhrFile.responseText)
    //     }
    // }

    // method3
    xhrFile.addEventListener('load', function(c) {
        // this.response = c.target.response;
        console.log(this.response)
        // 导入数据到gData中
        if (isImportData) {
            try {
                gData = JSON.parse(this.response);
                
            } catch (error) {
                // console.error(error);
            }
        }
    })

    xhrFile.send();
}


var writeFile = function(content, file) {
    // save text file
    const stringData = content || 'Please input text content';
    const filePath = file || 'output.txt';
    const blob = new Blob([stringData], {
        type: 'text/plain;charset=utf-8'
    });
    const objectURL = URL.createObjectURL(blob);

    const aTag = document.createElement('a');
    aTag.href = objectURL;
    aTag.download = filePath;
    aTag.click();
    // 释放对 URL对象的引用
    URL.revokeObjectURL(objectURL);
}

var writeJsonFile = function(jsonObject, file) {
    // save text file
    const json = jsonObject || [{name:"张三", age:20}];
    const jsonStr = JSON.stringify(json, null, 2);  // 末尾2指定json数据缩进2格
    const stringData = jsonStr || 'Please input json object';
    const filePath = file || 'output.json';
    const blob = new Blob([stringData], {
        type: 'application/json'
    });
    const objectURL = URL.createObjectURL(blob);

    const aTag = document.createElement('a');
    aTag.href = objectURL;
    aTag.download = filePath;
    aTag.click();
    // 释放对 URL对象的引用
    URL.revokeObjectURL(objectURL);
}


function readfromdisk() {
    let loadbtn = document.getElementById('loadfile-btn');
    let fileinput = document.querySelector('input');
    loadbtn.addEventListener('click', function() {
        if (fileinput.files.length === 0) {
            alert('请选择文件');
            return;
        }
        let file = fileinput.files[0];
        let fr = new FileReader();
        fr.readAsText(file);
        fr.onload = function() {
            try {
                gData = JSON.parse(fr.result);
                if (gData.length !== 9) {
                    alert('导入的json文件格式不正确');
                    return;
                }
                addValuesToCells(gData);
            } catch (error) {
                alert('导入的不是json文件');
            }
        }
    })
}
readfromdisk();