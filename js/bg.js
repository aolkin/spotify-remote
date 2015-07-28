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


function send(message,callback) {
    if (!callback) {
	callback = processData;
    }
    chrome.tabs.query({url: "https://play.spotify.com/*"}, function(tabs) {
	if (tabs.length < 1) {
	    chrome.tabs.create({
		url: "https://play.spotify.com/",
		pinned: true
	    });
	} else {
	    chrome.tabs.sendMessage(tabs[0].id, message, callback);
	}
    });
}

chrome.commands.onCommand.addListener(function(command){
    console.log(command);
    send({action: command});
});
