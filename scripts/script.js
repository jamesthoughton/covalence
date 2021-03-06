"use strict";
var parent = document.getElementById("content"),
	currentDir = "",
	currentJSON = {},
    treeJSON = {},
    root = [];
$.ajaxSetup({
    async: false
});
var cards = [];
var temp = document.createElement("div");
temp.className = "card";
temp.id = "root-music";
var tempInner = document.createElement("div");
tempInner.className = "card-icon";
tempInner.style.backgroundImage = "url('icons/headphones.svg')";
temp.appendChild(tempInner);
temp.innerHTML = temp.innerHTML + "Music";
var asdf = readConfig();
console.log(asdf);
temp.onclick = function() {
    goDown(asdf[0]);
}
cards.push(temp);
root.push(temp);
parent.appendChild(temp);

temp = document.createElement("div");
temp.className = "card";
temp.id = "root-photos";
tempInner = document.createElement("div");
tempInner.className = "card-icon";
tempInner.style.backgroundImage = "url('icons/camera.svg')";
temp.appendChild(tempInner);
temp.innerHTML = temp.innerHTML + "Photos"
temp.onclick = function() {
    goDown(readConfig()[1]);
}
cards.push(temp);
root.push(temp)
parent.appendChild(temp);


function goHome() {
    currentDir = "";
    updateDivs();
}
function goDown(dir) {
	currentDir += dir;
    updateDivs();
}

function goUp() {
	if(currentDir == "") {
		return;
	}
	for(var i = currentDir.length - 1; i > 0; i--) {
		if(currentDir.substring(i, i + 1) == "/") {
			currentDir = currentDir.substring(0, i);
			break;
		}
	}
    updateDivs();
}
function updateDivs() {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    if(currentDir == "") {
        parent.appendChild(root[0]);
        parent.appendChild(root[1]);
    } else {
        console.log(currentDir);
        getJSON();
        cards = []
        var arr = currentJSON["files"],
            uri = "",
            hasDir = false,
            loc = [];
        for(var i = 0; i < arr.length; i++) {
                loc = arr[i].split("/");
                for(var t = 0; t < loc.length; t++) { //Parse for local directory from full path
                    if(hasDir) {
                        for(var k = t; k < loc.length; k++) {
                            uri += loc[k] + "/";
                        }
                        break;
                    }
                    if(loc[t] == "covalence") {
                        hasDir = true;
                    }
                }
                uri = uri.substring(0, uri.length - 1);
                var temp = document.createElement("div");
                temp.className = "card";
                var tempInner = document.createElement("div");
                temp.appendChild(tempInner);
                temp.style.backgroundImage = "url(" + arr[i]['image'] + ")";
                if(uri.includes(".png") || uri.includes(".jpg") || uri.includes(".svg") || uri.includes(".gif")) {
                    tempInner.className = "card-icon";
                    tempInner.style.backgroundImage = "url('" + uri+ "')";
                    console.log(uri);
                    temp.dank = uri;
                    temp.onclick = function() {expandImg(temp.dank)};
                    temp.innerHTML = temp.innerHTML + uri.substring(7, uri.length - 4);
                } else {
                    tempInner.className = "card-play";
                    tempInner.style.backgroundImage = "url('icons/music.svg')";
                    tempInner.style.backgroundSize = "50%";
                    temp.dank = uri;
                    temp.onclick = function() {playSong(temp.dank)};
                    temp.innerHTML = temp.innerHTML + uri.substring(6, uri.length - 4);
                }
                cards.push(temp);
                parent.appendChild(temp);
                uri = "";
                hasDir = false;
        }
    }
}
function getJSON() {
	$.getJSON(currentDir + "/metadata.json", function(json) {
		currentJSON = json;
	});
	//getAsText(currentDir + "/metadata.json");
}
function readConfig() {
	var r = [];
    jQuery.ajax({
        url: "covalence.conf", 
        success: function(data) {
		    var temp = data.split("\n");
            for(var i = 0; i < temp.length; i++) {
                if(temp[i] != "Music" && temp[i] != "Photos" && temp[i] != "") {
                   if(i > r.length) {
                        r.push(temp[i]);      
                    }
                }
            }
        },
        async: false
	});
    console.log(r);
    return r;
}

function expandImg(uri) {
    var gallery = document.getElementById("image-view-wrapper");
    var galleryWrap = document.getElementById("image-view");
    if(gallery.childNodes.length != 0) {
        gallery.removeChild(gallery.firstChild);
    }
    galleryWrap.style.opacity = "1";
    galleryWrap.style.visibility = "visible";
    galleryWrap.style.backgroundImage = "url('" + uri + "')";
}

function playSong(uri) {
    var barWrap = document.getElementById("player-wrapper"),
        bar = document.getElementById("player"),
        player = document.createElement("audio");
    player.id = "player-bar";
    console.log(uri);
    player.src = uri;
    player.controls = true;
    player.autoplay = "autoplay";
    if(bar.childNodes.length != 0) {
        bar.removeChild(bar.childNodes[0]);
    }
    bar.appendChild(player);
}


var Module = class {
    constructor(url) {
        var temp = document.createElement("div");
        temp.className = "card";
        var tempInner = document.createElement("div");
        tempInner.className = "card-icon";
        tempInner.style.backgroundImage = "url('" + url + "')";
        temp.appendChild(tempInner);
        temp.innerHTML = temp.innerHTML + url;
        temp.onclick = goDown(currentJSON);
        cards.push(temp);
        parent.appendChild(temp);

    }
}
