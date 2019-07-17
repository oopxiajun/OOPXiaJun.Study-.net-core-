var bootPATH = bootPath = __CreateJSPath("boot.js");

mini_debugger = true;                                           //

var skin = getCookie("miniuiSkin") || 'cupertino';             //skin cookie   cupertino
var mode = getCookie("miniuiMode") || 'medium';                 //mode cookie     medium     

//miniui
document.write('<script src="' + bootPATH + 'jquery.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + bootPATH + 'miniui/miniui.js" type="text/javascript" ></sc' + 'ript>');
document.write('<link href="' + bootPATH + '../res/fonts/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'miniui/themes/default/miniui.css" rel="stylesheet" type="text/css" />');

//common
document.write('<link href="' + bootPATH + '../res/css/common.css" rel="stylesheet" type="text/css" />');
document.write('<script src="' + bootPATH + '../res/js/common.js" type="text/javascript" ></sc' + 'ript>');

//skin
if (skin && skin != "default") document.write('<link href="' + bootPATH + 'miniui/themes/' + skin + '/skin.css" rel="stylesheet" type="text/css" />');

//mode
if (mode && mode != "default") document.write('<link href="' + bootPATH + 'miniui/themes/default/' + mode + '-mode.css" rel="stylesheet" type="text/css" />');

//icon
document.write('<link href="' + bootPATH + 'miniui/themes/icons.css" rel="stylesheet" type="text/css" />');


////////////////////////////////////////////////////////////////////////////////////////
function getCookie(sName) {
    var aCookie = document.cookie.split("; ");
    var lastMatch = null;
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (sName == aCrumb[0]) {
            lastMatch = aCrumb;
        }
    }
    if (lastMatch) {
        var v = lastMatch[1];
        if (v === undefined) return v;
        return unescape(v);
    }
    return null;
}

function __CreateJSPath(js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}

function fullScreen() {
    var fullarea = document.getElementById('container') || document.documentElement;


    if (fullarea.requestFullscreen) {
        fullarea.requestFullscreen();
    } else if (fullarea.webkitRequestFullScreen) {
        fullarea.webkitRequestFullScreen();
    } else if (fullarea.mozRequestFullScreen) {
        fullarea.mozRequestFullScreen();
    } else if (fullarea.msRequestFullscreen) {
        // IE11
        fullarea.msRequestFullscreen();
    } else if (typeof window.ActiveXObject != "undefined") {

        //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏

        var wscript = new ActiveXObject("WScript.Shell");

        if (wscript != null) {

            wscript.SendKeys("{F11}");

        }

    }
}

function exitFullScreen() {

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (typeof window.ActiveXObject != "undefined") {

        //for IE，这里和fullScreen相同，模拟按下F11键退出全屏

        var wscript = new ActiveXObject("WScript.Shell");

        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}