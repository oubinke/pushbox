function $(selector) { // 将原生方法抽象一下
    return document.querySelector(selector);
}

function $$(selector) { // 将原生方法抽象一下
    return document.getElementById(selector);
}

function main() { // 主函数
    initMap(gameData[0]); // 初始化第一关数据
    console.log(gameData[0]);
    var select = $('select');
    var html = '';
    for (var i = 0; i < 15; i++) {
        html += '<option>第' + (i + 1) + '关</option>';
    }

    select.innerHTML = html;

    select.onchange = function (event) { // 选择关卡
        initMap(gameData[parseInt(this.value.substring(1, 3)) - 1])
        $('.level').innerHTML = 'level <span>' + (parseInt(this.value.substring(1, 3))) + '</span>';
        // 取消指定元素的焦点
        this.blur();
    }

    $('button').onclick = function (event) { // 重试
        initMap(gameData[parseInt(select.value.substring(1, 3)) - 1])
    }

    keyEvent();
}

function initMap(data) { // 画图
    var html = '';
    for (var i = 0; i < data.size.height; i++) {
        html += '<tr>';
        for (var j = 0; j < data.size.width; j++) {
            html += '<td id=' + i + '_' + j + '></td>';
        }
        html += '</tr>';
    }
    $('table').innerHTML = html;
    setMapClass(data.map);
}

function setMapClass(data) { // 给每一个格子赋上一个类名
    keys = {
        5: "wall", // 墙
        10: "ground", // 地板
        20: "target", // 目标点
        60: 'man', // 人
        80: "box", // 箱子
    };

    data.forEach(function (e, i) {
        e.forEach(function (e, j) {
            $$(i + '_' + j).className = keys[e];
            $$(i + '_' + j).dataset.class = keys[e];
        });
    });
}

function keyEvent() { // 监控键盘事件
    document.onkeydown = function (event) {
        var cur = $('.man').id.split('_');
        // row和col表示下一位置
        var row = cur[0];
        var col = cur[1];
        var rows = $('table').rows.length
        var cols = $('table').rows[0].cells.length
        var direction;
        switch (event.keyCode) {
            case 37: // 左 
                direction = 'l';
                col--;
                // 如果下一位置为wall，则表示小人不能向下一位置移动了；
                // 如果下一位置为box，则需要判断下下一位置。若下下一位置为wall或者arrive或者box，则小人不能向下一位置移动
                if (col < 0 || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'box' || $$(row + '_' + col).className == 'arrive') {
                    col--;
                    if (col < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'box') {
                        return;
                    }
                    col++;
                }
                break;
            case 38: // 上
                direction = 'u';
                row--;
                if (row < 0 || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'box' || $$(row + '_' + col).className == 'arrive') {
                    row--;
                    if (row < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'box') {
                        return;
                    }
                    row++;
                }
                break;
            case 39: // 右
                direction = 'r';
                col++;
                if (col >= cols || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'box' || $$(row + '_' + col).className == 'arrive') {
                    col++;
                    if (col >= cols || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'box') {
                        return;
                    }
                    col--;
                }
                break;
            case 40: // 下
                direction = 'd';
                row++;
                if (row >= rows || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'box' || $$(row + '_' + col).className == 'arrive') {
                    row++;
                    if (row >= rows || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive' || $$(row + '_' + col).className == 'box') {
                        return;
                    }
                    row--;
                }
                break;
            default:
                break;
        }
        // 根据当前位置，下一位置，方向来移动小人
        move(cur, [row, col], direction);
    }
}

function move(cur, next, direction) { // cur当前点 next下一点 direction代表移动方向
    var row = next[0];
    var col = next[1];
    // 如果当前位置原本为target或者ground，小人移动走后，需要将当前位置还原
    if ($$(cur[0] + '_' + cur[1]).dataset.class == 'target') {
        $$(cur[0] + '_' + cur[1]).className = 'target';
    } else {
        $$(cur[0] + '_' + cur[1]).className = 'ground';
    }
    // 如果下一位置为target或者ground，小人直接移动到下一位置上
    // 如果下一位置为箱子，则需要判断下下位置
    if ($$(next[0] + '_' + next[1]).className == 'ground' || $$(next[0] + '_' + next[1]).className == 'target') {
        $$(next[0] + '_' + next[1]).className = 'man';
    } else {
        switch (direction) {
            case 'u':
                row--;
                break;
            case 'r':
                col++;
                break;
            case 'd':
                row++;
                break;
            case 'l':
                col--;
                break;
        }
        if ($$(row + '_' + col).className == 'ground') {
            $$(row + '_' + col).className = 'box';
            $$(next[0] + '_' + next[1]).className = 'man';
        } else {
            $$(row + '_' + col).className = 'arrive';
            $$(next[0] + '_' + next[1]).className = 'man';
        }
    }
    setTimeout(function () {
        isWin();
    }, 1000)
}

function isWin() { // 是否过关
    if (!$('.box')) {
        if ($('.level span').innerHTML == '15') {
            alert('恭喜你通关全部关卡，这个游戏已经难不倒你了！');
            isWin = function () { };
        } else {
            alert('恭喜你通关了, 再接再励，攻克下一关');
            var level = parseInt($('.level span').innerHTML);
            initMap(gameData[level])
            $('.level').innerHTML = 'level <span>' + (level + 1) + '</span>';
            $('select').value = '第' + (level + 1) + '关';
        }
    }
}
main();