// 網絡地址
const HOST = "http://127.0.0.1:3000"; //指定服務端口
let pinInput = ""; // pin碼值
let local_user = {};// pin對象
const scoresData = [];
// window.fractionNumber = 0； // 遊戲得分

const items = [
    "數據科學",
    "謎",
    "機器都識學習",
    "你畫我猜",
    "5G的速度",
    "姿勢捕捉",
    "聲音中的喜怒哀樂",
];

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

            //顯示總分
            $('#totalScore').text(`${window.fractionNumber}`)
            createScore(); // 建立分數
            $("#showPinLabel").text(pinInput); // 顯示pin碼

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
            inner_desired_drawing_txt.textContent = '畫出: ' + labels[drawing_index];

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
    window.location.reload();//重新加載會有閃爍現象
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

const setDisabled = (elementId, bool = false) => {
    if (elementId) {
        if (bool) {
            $(`#${elementId}`).prop("disable", true);
        } else {
            $(`#${elementId}`).prop("disable", false);
        }
    }
};

function language_start() {
    pin_code = document.getElementById('pin_code')
    pin_code.style.display = 'block'
    clearInterval(window.languageCarTimer) //清除語言頁面倒計時
}

let pinKeyboardIsOpen = false;// 鍵盤開關

const pinChange = (inputValue, isReset = false) => {
    if (isReset === true) {
        pinInput = "";
    } else pinInput + inputValue;
};

const setKeyboardOpen = (bool = false) => { // 控制鍵盤
    if (bool) {
        pinKeyboardIsOpen = true;
        $("#pinKeyboard").removeClass("hidden");
    } else {
        pinKeyboardIsOpen = false;
        $("#pinKeyboard").addClass("hidden");
    }
};

$("#pinInput").focus(() => { //pin嗎輸入事件
    if (!pinKeyboardIsOpen) {
        setKeyboardOpen(true);
    }
});

$("#pinStartBtn").click(() => {//pin開始
    userStart();
});

$("#startDirectlyBtn").click(() => {//pin新身份開始
    newStart();
});

for (let index = 1; index <= 12; index++) { // 給小鍵盤所有按鈕賦值
    if (index === 10) {
        $(`#pinKeyboard button:nth-child(${index})`).click(() => {//重置事件
            $("#pinInput").val((pinInput = ""));
        });
    }
    if (index === 11) {
        $(`#pinKeyboard button:nth-child(${index})`).click(() => {//零數字事件
            $("#pinInput").val((pinInput += "0"));
        });
    }
    if (index === 12) {
        $(`#pinKeyboard button:nth-child(${index})`).click(() => {//鍵盤關閉事件
            if (pinKeyboardIsOpen) {
                setKeyboardOpen();
            }
        });
    }
    if (index !== 10 && index !== 11 && index !== 12) {
        $(`#pinKeyboard button:nth-child(${index})`).click(() => {//1-9數字事件
            $("#pinInput").val((pinInput += index));
        });
    }
}

const userStart = async () => {//pin開始事件

    // 獲取用戶
    try {
        const data = await fetch(`${HOST}/api/user/get?pin=${pinInput}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        console.log(data)
        if (!data || !data?.id) {
            console.log('data error ')
            $.toast({
                heading: "Error",
                text: "找不到該用戶",
                showHideTransition: "fade",
                icon: "error",
            });
        } else {
            toggle_round_card() // 找到用戶 進入遊戲
        }
    } catch (error) {
        console.log('catch error ')
        $.toast({
            heading: "Error",
            text: error.message,
            showHideTransition: "fade",
            icon: "error",
        });
        console.error(error.message);
    }
};

const newStart = async () => {//pin新身份開始  建立用戶

    try {
        const user = await fetch(`${HOST}/api/user/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());

        if (user.error) {
            console.log('user error ')
            throw new Error(user.error);
        } else {
            local_user = user;
            if (local_user) {
                pinInput = local_user.pin;
                console.log('user pin', pinInput)
            }
            toggle_round_card() // 進入遊戲
        }

    } catch (error) {
        console.log('catch error ')
        // 顯示在 toast
        $.toast({
            heading: "Error",
            text: error.message,
            showHideTransition: "fade",
            icon: "error",
        });
    }
};

// 建立用戶分數
const createScore = async () => {

    try {
        console.log('遊戲所得分數：', window.fractionNumber || 0)
        const body = {
            score: window.fractionNumber,
            pin: pinInput,
            itemName: "你畫我猜",
        };

        const result = await fetch(`${HOST}/api/score/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then((res) => res.json());
        console.log('創建的成績結果', result)

        getAllScores(); // 獲得所有分數
    } catch (error) {
        console.error("發生錯誤:", error);
    }
};

const getAllScores = async () => {
    try {
        const data = await fetch(
            `${HOST}/api/user/all_scores?pin=${pinInput}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((res) => res.json());
        console.log('成績數據', data)
        if (data.error) {
            throw new Error(data.error);
        } else {
            data.forEach((item) => {
                scoresData.push({
                    id: item.id,
                    itemName: item.itemName,
                    score: item.score,
                });
            });

            // 基于准备好的dom，初始化echarts实例
            $("#eChartsMain").ready(() => {
                const myChart = echarts.init(
                    document.getElementById("eChartsMain")
                );

                // 指定图表的配置项和数据
                const option = {
                    title: {
                        text: "遊戲得分圖",
                    },
                    radar: {
                        indicator: items.map((item) => {
                            return {
                                name: item,
                                max: 600,
                            };
                        }),
                    },
                    series: [
                        {
                            // name: "得分",
                            type: "radar",
                            data: [
                                {
                                    value: items.map((item) => {
                                        const scores = scoresData.filter((s) => {
                                            return s.itemName === item;
                                        });
                                        const score = _.maxBy(scores, "score");

                                        return score?.score || 0;
                                    }),
                                    name: "各項遊戲得分得分",
                                },
                            ],
                        },
                    ],
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            });
        }
    } catch (error) {
        console.error("發生錯誤:", error);
        // 顯示在 toast
        // toast.error(error.message);
    }
};


