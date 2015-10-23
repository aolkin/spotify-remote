
var data = {
    doc: null,
    checker: null,
    els: {},
    parent: function(attr) {
	return d.els[attr] && d.els[attr].parentElement &&
	    d.els[attr].parentElement.parentElement &&
	    d.els[attr].parentElement.parentElement.parentElement &&
	    d.els[attr].parentElement.parentElement.parentElement.parentElement
	    && d.els[attr].parentElement.parentElement.parentElement
	    .parentElement.parentElement;
    },
    getEl: function(attr,selector) {
	d.els[attr] = (d.doc.contains(d.els[attr]) && d.els[attr]) ||
	    d.doc.querySelector(selector);
	return d.els[attr] || {};
    }
};
var d = data;

function updatePoller(justReturnData) {
    d.doc = document.getElementById("app-player").contentDocument;
    if (d.doc) {
	var newData = {};
	d.els.art = (d.doc.contains(d.els.art) &&
		     (data.parent("art").id != "suggestions") &&
		     d.els.art) ||
	    d.doc.querySelector(".sp-image-img");
	d.getEl("playpause","#play-pause");
	newData.title = d.getEl("title","#track-name a").innerText;
	newData.artist = d.getEl("artist","#track-artist a").innerText;
	newData.current = d.getEl("current","#track-current").innerHTML;
	newData.duration = d.getEl("duration","#track-length").innerHTML;
	newData.doc_title = document.title;
	if (d.els.art && d.els.title && d.els.artist && d.els.current && d.els.duration) {
	    newData.playing = d.els.playpause.classList.contains("playing");
	    newData.art = d.els.art.style.backgroundImage.slice(5,-2);
	    newData.itemuri = d.els.art.parentElement.parentElement.dataset.itemuri;
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

data.checker = setInterval(updatePoller,500);
