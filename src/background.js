console.log("background.js");

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
function boyomi(text) {
	var delim = "<bouyomi>";
	var speed = -1; // 速度50-200。-1を指定すると本体設定
	var pitch = -1; // ピッチ50-200。-1を指定すると本体設定
	var volume = -1; // ボリューム0-100。-1を指定すると本体設定
	var type = 0; // 声質(0.本体設定/1.女性1/2.女性2/3.男性1/4.男性2/5.中性/6.ロボット/7.機械1/8.機械2)


	// 設定を区切りでつないで送信文字列を作る。
	var sends = "" + speed + delim + pitch + delim + volume + delim + type + delim + text;

	// 棒読みちゃんに送信　ポートは50002です。
	var socket = new WebSocket('ws://localhost:50002/');
	socket.onopen = function() {
		socket.send(sends);
	}
}



function handleMessage(request, sender, sendResponse) {
	if(typeof request.readtext !== 'undefined'){
		boyomi(request.readtext)
	}else if(typeof request.pageAction_show !== 'undefined'){
		ext_pageAction.enable(sender.tab.id);
	}
	sendResponse({response: "Response from background script",tabid:sender.tab.id});
}

