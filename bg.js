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
