
var data = {
    doc: null,
    checker: null,
    els: {},
    parent: function(attr) {
	return d.els[attr] && d.els[attr].parentElement;
    }
};
var d = data;

function updatePoller(justReturnData) {
    d.doc = document.getElementById("app-player").contentDocument;
    if (d.doc) {
	var newData = {};
	d.els.art = (d.parent("art") && d.els.art) ||
	    d.doc.querySelector(".sp-image-img");
	d.els.title = (d.parent("title") && d.els.title) ||
	    d.doc.querySelector("#track-name a");
	d.els.artist = (d.parent("artist") && d.els.artist) ||
	    d.doc.querySelector("#track-artist a");
	d.els.playpause = (d.parent("playpause") && d.els.playpause) ||
	    d.doc.querySelector("#play-pause");
	if (d.els.art && d.els.title && d.els.artist) {
	    newData.title = d.els.title.innerText;
	    newData.art = d.els.art.style.backgroundImage.slice(4,-1);
	    newData.album = d.els.art.parentElement.parentElement.dataset.tooltip;
	    newData.artist = d.els.artist.innerText;
	    newData.playing = d.els.playpause.className == "playing";
	    if (justReturnData) {
		return newData;
	    } else {
		chrome.runtime.sendMessage(newData,function(res){ });
	    }
	} else {
	    return false;
	}
    }
}

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if (request.action == "playpause") {
	d.els.playpause.click();
    }
    if (request.action == "next") {
	d.doc.getElementById("next").click();
    }
    if (request.action == "prev") {
	d.doc.getElementById("previous").click();
    }
    sendResponse(updatePoller(true));
});

data.checker = setInterval(updatePoller,1000);
