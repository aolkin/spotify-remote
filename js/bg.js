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
		pinned: false
	    });
	} else {
	    chrome.tabs.sendMessage(tabs[0].id, message, callback);
	}
    });
}

chrome.commands.onCommand.addListener(function(command){
    if (command == "show") {
	chrome.tabs.query({url: "https://play.spotify.com/*"},
			  function(tabs) {
			      if (tabs.length) {
				  chrome.tabs.update(tabs[0].id,
						     {selected:true});
				  chrome.windows.update(tabs[0].windowId,
							{focused:true});
			      }
			  });
    } else {
	send({action: command});
    }
});
