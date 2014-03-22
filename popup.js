
var iterAttrs = [ "title", "artist", "current", "duration" ];

var globals = {
    item: ""
};

function processData(data,sender,sendResponse){
    $("#playpause").text(data.playing?"Pause":"Play");
    $("#art").attr("src",data.art);
    for (var i = 0; i < iterAttrs.length; i++) {
	$(document.getElementById(iterAttrs[i])).text(data[iterAttrs[i]]);
    }
    console.log(data);
    if (data.itemuri && data.itemuri !== globals.item) {
	globals.item = data.itemuri;
	$.getJSON("http://ws.spotify.com/lookup/1/.json?uri="+data.itemuri,
		  function(data,status,xhr){
		      $("#album").text(data.track.album.name);
		  });
    }
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

    $("#focus").click(function(){
	chrome.tabs.query({url: "https://play.spotify.com/*"},
			  function(tabs) {
			      chrome.tabs.update(tabs[0].id,
						 {selected:true});
			      chrome.windows.update(tabs[0].windowId,
						    {focused:true});
			  });
    });

    $("#popout").click(function(){
	chrome.windows.create({
	    url: "popup.html?popout",
	    width: 220,
	    height: 384,
	    focused: true,
	    type: "panel"
	});
    });

    send({action:"getdata"});

    if (location.search.indexOf("popout") > -1) {
	$("#popout").hide();
    }
});

chrome.runtime.onMessage.addListener(processData);
