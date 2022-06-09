
start_button = document.getElementById('mainButton')

const pages = {
    "main": 1,
    "card": 2,
    "game": 3,
    "about": 4,
    "end_card": 5
}

window.option = 0//题目
window.fractionNumber = 0 // 分數

var active_page = pages.main;

var drawing_index = -1
var drawing_history = []

function toggle_round_card(onlyOpen = false) {
    clearInterval(window.roundTimer)//清除卡片倒計時
    clearInterval(window.languageCarTimer) //清除語言頁面倒計時

    let desired_drawing_txt = document.getElementById('desired_drawing')
    let inner_desired_drawing_txt = document.getElementById('inner_desired_drawing')
    let prediction_label = document.getElementById('prediction');

    let card = document.getElementById('round-card')


    if (active_page != pages.card && active_page != pages.about && active_page || onlyOpen) {// 顯示卡片

        if (drawing_history.length > 20) {
            drawing_history.splice(0, 1);
        }

        drawing_index = Math.floor(Math.random() * Object.keys(labels).length)
        var i = 0
        while (i < drawing_history.length) {
            if (drawing_index == drawing_history[i]) {
                drawing_index = Math.floor(Math.random() * Object.keys(labels).length)
                i = -1
            }
            i++
        }
        drawing_history.push(drawing_index)

        desired_drawing_txt.textContent = `第${window.option + 1}題：${labels[drawing_index]}`;
        card.className = 'cover visible';

        // 题目累加
        window.option++
        if (window.option > 6) {//六題後到結束頁面
            game = document.getElementById('game-canvas')
            end_card = document.getElementById('end-card')
            main = document.getElementById('main')
            main = document.getElementById('main')
            game.style.display = 'none'//隱藏遊戲
            card.className = 'cover invisible'//隱藏卡片
            main.style.display = 'none'  //隱藏開始頁面
            active_page = pages.end_card;
            end_card.style.display = 'block'//顯示結束頁面
            stop_drawing() //遊戲結束計時
            clearInterval(window.roundTimer)//清空卡片倒計時
            window.option = 0//清空題目
            prediction_label.style.zIndex = 0 //猜測樣式降級
            drawing_history = []//清空歷史繪畫

            // 結束頁面倒計時
            window.endCarNum = 10
            $('#endButton').text(`再來！（${window.endCarNum}）`)
            window.endCarTimer = setInterval(() => {
                window.endCarNum -= 1
                $('#endButton').text(`再來！（${window.endCarNum}）`)
                if (window.endCarNum <= 0) {
                    again()
                }
            }, 1000)

        } else {
            // 卡片頁面倒計時
            window.roundNum = 5
            $('#start-btn').text(`開始（${window.roundNum}）`)
            window.roundTimer = setInterval(() => {
                window.roundNum -= 1
                $('#start-btn').text(`開始（${window.roundNum}）`)
                if (window.roundNum <= 0) {
                    toggle_game_canvas()
                }
            }, 1000)
        }

        setTimeout(function () {
            inner_desired_drawing_txt.textContent = 'Draw: ' + labels[drawing_index];

            init()
            stop_drawing() //遊戲結束計時
        }, 250)

        active_page = pages.card;
    }
    else {// 關閉卡片
        card.className = 'cover invisible'
        prediction_label.style.zIndex = -10//繪畫中才顯示猜測內容
    }
}

function toggle_game_canvas() {
    if (active_page != pages.game) {
        let game = document.getElementById('game-canvas')// 進入遊戲
        game.style.display = 'flex'
        toggle_round_card() // 關閉卡片
        active_page = pages.game;
        start_drawing() // 遊戲開始計時
    } else { // 關閉遊戲
        game = document.getElementById('game-canvas')
        game.style.display = 'none'
        stop_drawing() //遊戲結束計時
        active_page = pages.main;
    }

}

function toggle_about() {
    if (active_page != pages.about) { //顯示咨詢
        let about = document.getElementById('about')
        about.className = 'cover about visible';
        active_page = pages.about;
        return
    }
    if (active_page == pages.about) { //關閉咨詢
        let about = document.getElementById('about')
        about.className = 'cover about invisible';
        active_page = pages.main;
    }
}

function enter_main() {//回車進入遊戲 清除繪畫歷史
    toggle_game_canvas()
    drawing_history = []
}

// 重新開始遊戲
function again() {
    var end_card = document.getElementById('end-card')
    var main = document.getElementById('main')
    var fraction = document.getElementById('fraction');
    var prediction = document.getElementById('prediction');
    chinese = document.getElementById('introduction_chinese')
    english = document.getElementById('introduction_english')
    portuguese = document.getElementById('introduction_portuguese')
    pin_code = document.getElementById('pin_code')
    active_page = pages.main;//設置當前頁面
    main.style.display = 'block'
    end_card.style.display = 'none'
    clearInterval(window.endCarTimer) //清除結束頁面倒計時
    window.fractionNumber = 0 //重置得分
    fraction.textContent = window.fractionNumber
    prediction.style.zIndex = -10

    chinese.style.display = 'none'
    english.style.display = 'none'
    portuguese.style.display = 'none'
    clearInterval(window.languageCarTimer) //清除語言頁面倒計時

    pin_code.style.display = 'none'
}

// 選擇語言
function language_game(number) {
    chinese = document.getElementById('introduction_chinese')
    english = document.getElementById('introduction_english')
    portuguese = document.getElementById('introduction_portuguese')
    switch (parseInt(number)) {
        case 1:
            chinese.style.display = 'block'
            english.style.display = 'none'
            portuguese.style.display = 'none'
            break;
        case 2:
            chinese.style.display = 'none'
            english.style.display = 'block'
            portuguese.style.display = 'none'
            break;
        case 3:
            chinese.style.display = 'none'
            english.style.display = 'none'
            portuguese.style.display = 'block'
            break;
    }

    // 語言頁面倒計時
    window.languageCarNum = 60
    $('.introduction_start').text(`開始（${window.languageCarNum}）`)
    window.languageCarTimer = setInterval(() => {
        window.languageCarNum -= 1
        $('.introduction_start').text(`開始（${window.languageCarNum}）`)
        if (window.languageCarNum <= 0) {
            again()
        }
    }, 1000)
}


function language_start() {
    pin_code = document.getElementById('pin_code')
    pin_code.style.display = 'block'
    clearInterval(window.languageCarTimer) //清除語言頁面倒計時
}