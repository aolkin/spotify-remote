function processData(data,sender,sendResponse){
    var tooltip = data.title + " by " + data.artist;
    chrome.browserAction.getTitle({},function(title){
	if (title !== data.tooltip) {
	    chrome.browserAction.setTitle({
		title: tooltip
	    });
	}
    });
}

chrome.runtime.onMessage.addListener(processData);


chrome.app.runtime.onLaunched.addListener(function(){
	chrome.app.window.create("popup.html", {
	    "outerBounds": {
		width: 260,
		height: 331
	    },
	    type: "panel",
	    alwaysOnTop: true
	});
    });
