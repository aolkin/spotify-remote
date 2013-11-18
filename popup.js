
function processData(data,sender,sendResponse){
    $("#playpause").text(data.playing?"Pause":"Play");
    $("#art").attr("src",data.art);
    $("#title").text(data.title);
    $("#artist").text(data.artist);
    //$("#album").text(data.album);
}

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

$(function(){

    $(".transport-buttons button").click(function(){
	send({action: this.id});
    });

    send({action:"getdata"});
});

chrome.runtime.onMessage.addListener(processData);
