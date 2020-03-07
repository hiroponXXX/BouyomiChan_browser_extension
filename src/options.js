if(typeof browser !== 'undefined'){
	ext_runtime = browser.runtime;
	ext_storage = browser.storage.local
}else{
	ext_runtime = chrome.runtime;
	ext_storage = chrome.storage.sync
}

function save_option() {
  ext_storage.set({
    speak_on_activate:   document.querySelector("#speak_on_activate").checked
  });
}


function restoreOptions() {
	ext_storage.get(["speak_on_activate"], function(result) {
		document.querySelector("#speak_on_activate").checked = result.speak_on_activate !== undefined ? result.speak_on_activate : true;
	})
}
document.addEventListener("DOMContentLoaded", restoreOptions);

document.querySelector(".option_input").addEventListener("change", save_option);
