console.log("background.js");

let ext_runtime;
let ext_pageAction

//ChromeとFirefoxでruntime切替
if(typeof browser !== 'undefined'){
	ext_runtime = browser.runtime;
	ext_pageAction = browser.action;
}else{
	ext_runtime = chrome.runtime;
	ext_pageAction = chrome.action;
}
ext_runtime.onMessage.addListener(handleMessage);



//ブラウザからローカルの棒読みちゃん連携プラグインにデータを渡す
function boyomi(talktext) {
	// 50002から55000に変更
	var socket = new WebSocket('ws://localhost:55000/');

	// 読み上げリクエスト
	socket.onopen = function (event) {
		// 読み上げコマンド
		var talkData = {
			command: "talk",
			speed: -1,    // 速度50-200。-1を指定すると本体設定
			pitch: -1,    // ピッチ50-200。-1を指定すると本体設定
			volume: -1,   // ボリューム0-100。-1を指定すると本体設定
			voiceType: 0,  // 声質(0.本体設定/1.女性1/2.女性2/3.男性1/4.男性2/5.中性/6.ロボット/7.機械1/8.機械2)
			text: talktext
		};
		// JSON文字列に変換して送信
		socket.send(JSON.stringify(talkData));
	};
}


function handleMessage(request, sender, sendResponse) {
	if(typeof request.readtext !== 'undefined'){
		boyomi(request.readtext)
	}else if(typeof request.pageAction_show !== 'undefined'){
		ext_pageAction.enable(sender.tab.id);
	}
	sendResponse({response: "Response from background script",tabid:sender.tab.id});
}

