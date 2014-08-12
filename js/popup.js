String.prototype.width = function(font) {
    var o = $('<div>' + this + '</div>')
        .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden'})
        .appendTo($('body')),
    w = o.width();
    o.remove();
    return w;
}

var iterAttrs = [ "title", "artist", "current", "duration" ];

var globals = {
    item: ""
};

function parseTime(text) {
    var parts = text.split(":");
    var minutes = parts[0], seconds = parts[1];
    var time = parseInt(seconds) + (parseInt(minutes) * 60);
}

function setText(el,text) {
    var body_width = $("body").width();
    var text_width = text.width();
    if (text_width > body_width) {
	if (el.children("span").length == 2) {
	    el.children("span").text(text);
	} else {
	    el.empty();
	    for (var i = 0; i < 2; i++) {
		$("<span>").text(text).appendTo(el);
	    }
	    el.removeClass("marquee-active").addClass("marquee-active");
	}
    } else {
	el.removeClass("marquee-active").text(text);
    }
}

function processData(data,sender,sendResponse){
    $("#playpause span")
	.removeClass("glyphicon-" + (data.playing?"play":"pause"))
	.addClass("glyphicon-" + (data.playing?"pause":"play"));
    $("#art").attr("src",data.art);
    for (var i = 0; i < iterAttrs.length; i++) {
	var el = $("#" + iterAttrs[i]);
	if (el.is(".marquee")){
	    el = el.children("span");
	    setText(el,data[iterAttrs[i]]);
	} else {
	    el.text(data[iterAttrs[i]]);
	}
    }
    document.title = data["doc_title"];
    //console.log(data);
    if (data.itemuri && data.itemuri !== globals.item) {
	globals.item = data.itemuri;
	$.getJSON("http://ws.spotify.com/lookup/1/.json?uri="+data.itemuri,
		  function(data,status,xhr){
		      setText($("#album>span"),data.track.album.name);
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

    $(".transport-buttons a").click(function(e){
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
	    width: 260,
	    height: 331,
	    focused: true,
	    type: "panel"
	});
    });

    send({action:"getdata"});

    if (location.search.indexOf("popout") > -1) {
	$("body").addClass("popped-out");
    }
});

chrome.runtime.onMessage.addListener(processData);
