// ==UserScript==
// @id             Nimbus
// @name           Nimbus
// @version        1.0
// @namespace      nimishjha.com
// @author         Nimish Jha
// @description    Swiss Army Knife for browsing
// @include        *
// @include        file:///*
// @run-at         document-end
// @grant		none
// ==/UserScript==

//
//	Nimbus
//	Copyright (C) 2008-2017 Nimish Jha
//
//	This program is free software: you can redistribute it and/or modify
//	it under the terms of the GNU General Public License as published by
//	the Free Software Foundation, either version 3 of the License, or
//	(at your option) any later version.
//
//	This program is distributed in the hope that it will be useful,
//	but WITHOUT ANY WARRANTY; without even the implied warranty of
//	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//	GNU General Public License for more details.
//
//	You should have received a copy of the GNU General Public License
//	along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

var Nimbus = {
	logString: "",
	messageTimeout: null
};

var KEYCODES = {
	ZERO: 48,
	ONE: 49,
	TWO: 50,
	THREE: 51,
	FOUR: 52,
	FIVE: 53,
	SIX: 54,
	SEVEN: 55,
	EIGHT: 56,
	NINE: 57,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	NUMPAD0: 96,
	NUMPAD1: 97,
	NUMPAD2: 98,
	NUMPAD3: 99,
	NUMPAD4: 100,
	NUMPAD5: 101,
	NUMPAD6: 102,
	NUMPAD7: 103,
	NUMPAD8: 104,
	NUMPAD9: 105,
	NUMPAD_MULTIPLY: 106,
	NUMPAD_ADD: 107,
	NUMPAD_SUBTRACT: 109,
	NUMPAD_DECIMAL_POINT: 110,
	NUMPAD_DIVIDE: 111,
	FORWARD_SLASH: 191,
	TILDE: 192,
	SPACE: 32,
	UPARROW: 38,
	DOWNARROW: 40,
	LEFTARROW: 37,
	RIGHTARROW: 39,
	ENTER: 13,
	ESCAPE: 27,
	SQUARE_BRACKET_OPEN: 219,
	SQUARE_BRACKET_CLOSE: 221
};

function get(s)
{
	if(s.indexOf("#") === 0)
	{
		return document.getElementById(s.substr(1, s.length));
	}
	else if(s.indexOf(".") === 0)
	{
		return document.getElementsByClassName(s.substr(1, s.length));
	}
	else
	{
		var elems = document.getElementsByTagName(s);
		if(elems.length)
			return elems;
		else
			return 0;
	}
}

function isArray(o)
{
	return Object.prototype.toString.call(o) === '[object Array]';
}

function del(c)
{
	if(c.toString() === '[object HTMLElement]')
	{
		c.parentNode.removeChild(c);
		return 1;
	}
	var todel = [];
	if(Object.prototype.toString.call(c) === '[object Array]')
	{
		for(var i = 0, ii = c.length; i < ii; i++)
		{
			del(c[i]);
		}
	}
	else
	{
		var f = get(c);
		if(f && f.length)
		{
			for(var j = 0, jj = f.length; j < jj; j++)
			{
				todel.push(f[j]);
			}
			for(j = todel.length - 1; j > -1; j--)
			{
				todel[j].parentNode.removeChild(todel[j]);
			}
			return jj;
		}
		else if(f)
		{
			if(f.parentNode)
			{
				f.parentNode.removeChild(f);
				return 1;
			}
		}
	}
}

function listProperties(o)
{
	var s = "";
	for(var prop in o)
		if(o.hasOwnProperty(prop))
			s += prop + ": " + o[prop] + ", ";
	s = s.substring(0, s.length-2);
	return s;
}

function selectRandom(arr)
{
	if(!arr || !arr.length)
		return;
	var n = Math.floor(Math.random() * arr.length);
	return arr[n];
}

function getStyles(e)
{
	var styles, bgImage, bgColor, s, w;
	styles = getComputedStyle(e, null);
	if(styles)
	{
		bgColor = styles.getPropertyValue("background-color");
		bgImage = styles.getPropertyValue("background-image");
		elemWidth = styles.getPropertyValue("width");
		if(bgColor !== "transparent")
		{
			s = document.createElement("x");
			s.textContent = bgColor;
			if(bgImage !== "none")
				s.textContent += " " + bgImage;
			e.appendChild(s);
			e.className += " hl";
		}
/*		if(elemWidth.indexOf("px") !== -1)
		{
			w = parseInt(elemWidth, 10);
			var w2 = w * 2;
			e.style.width = w2 + "px";
			s = document.createElement("x");
			s.textContent = w + " -> " + w2;
			e.appendChild(s);
		}*/
	}
	insertStyle("x {background:#000;color:#FF0;}", "temp", true);
}

function highlightElementsWithInlineWidthOrHeight()
{
	var e = document.querySelectorAll("div, aside, article, section, table, tr, td");
	var i = e.length;
	var s;
	while(i--)
	{
		if(s = e[i].getAttribute("style"))
		{
			if(s.indexOf("width") !== -1)
				e[i].className += " hl";
			else if(s.indexOf("height") !== -1)
				e[i].className += " hl2";
		}
	}
	insertStyleHighlight();
}

function highlightElementsWithCssRule()
{
	var styles, prop, val, cssRule, e, i, s;
	prop = prompt("Highlight elements where CSS Property");
	val = prompt("has the value");
	e = document.getElementsByTagName("*");
	i = e.length;
	while(i--)
	{
		styles = getComputedStyle(e[i], null);
		if(styles)
		{
			s = styles.getPropertyValue(prop);
			if(val && val === s)
			{
				e[i].className += " hl";
			}
		}
		else
		{
			ylog("Styles is " + styles);
		}
	}
	insertStyleHighlight();
}

function markTableRowsAndColumns()
{
	var tr = get("tr"), td, i, ii, j, jj;
	for(i = 0, ii = tr.length; i < ii; i++)
	{
		tr[i].className = "row" + i;
		td = tr[i].getElementsByTagName("td");
		for(j = 0, jj = td.length; j < jj; j++)
		{
			td[j].className = "col" + j;
		}
		td = tr[i].getElementsByTagName("th");
		for(j = 0, jj = td.length; j < jj; j++)
		{
			td[j].className = "col" + j;
		}
	}
	insertStyle("table, tr, td { box-shadow: inset 1px 1px #444, inset -1px -1px #444 !important; }", "style_showtables");
}

//
//	checks if a given string contains any of an array of strings
//	much better than using s.indexOf('a') || s.indexOf('b')...
//
function containsAnyOfTheStrings(s, arrStrings)
{
	var i = arrStrings.length;
	var found = false;
	while(i--)
	{
		if(s.indexOf(arrStrings[i]) !== -1)
		{
			found = true;
			break;
		}
	}
	return found;
}

function isInArray(item, arr)
{
	var i = arr.length;
	var found = false;
	while(i--)
	{
		if(item === arr[i])
		{
			found = true;
			break;
		}
	}
	return found;
}

function hasClass(ele,cls)
{
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls)
{
	if(!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele, cls)
{
	if(!ele) return;
	var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	ele.className = ele.className.replace(reg, ' ');
	if(removeWhitespace(ele.className) === '') ele.removeAttribute("class");
}

function toggleClass(element, sClass)
{
	if(element.className && element.className.indexOf(sClass) !== -1) element.classList.remove(sClass);
	else element.classList.add(sClass);
}

function cycleClass(elem, arrClasses)
{
	var i, ii, found = false;
	for(i = 0, ii = arrClasses.length; i < ii; i++)
	{
		if(hasClass(elem, arrClasses[i]))
		{
			if(i < ii-1)
			{
				removeClass(elem, arrClasses[i])
				addClass(elem, arrClasses[i+1]);
			}
			else
			{
				removeClass(elem, arrClasses[i])
				addClass(elem, arrClasses[0]);
			}
			found = true;
			break;
		}
	}
	if(!found)
	{
		addClass(elem, arrClasses[0]);
	}
}

function getIframes()
{
	var f = get("iframe");
	s = '';
	for (i = 0, ii = f.length; i < ii; i++)
		s += f[i].contentDocument.body.innerHTML;
	i = f.length;
	while (i--)
		f[i].parentNode.removeChild(f[i]);
	db.innerHTML += s;
}

function getDebugData()
{
	var e, i;
	e = get("pre");
	if(!e)
		return;
	i = e.length;
	while(i--)
	{
		if(e[i].innerHTML.indexOf("cache-&gt;") >= 0)
		{
			document.body.insertBefore(e[i], document.body.firstChild);
		}
	}
}

function createUUID()
{
	return 'nimbus-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function (c)
	{
		var r, v, c;
		r = Math.random() * 16 | 0;
		v = (c === 'x') ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}

function printArray(arr)
{
	var s = "";
	for(var i = 0, ii = arr.length; i < ii; i++)
	{
		if(i === ii-1)
			s = s + arr[i];
		else
			s = s + arr[i] + ", ";
	}
	return s;
}

function createElement(args)
{
	if(!args)
		return false;

	var elemClass = args.strClass || undefined;
	var elemId = args.strId || undefined;
	var elemInnerHtml = args.strInnerHtml || undefined;
	var elemTagName = args.strTagName || undefined;
	var elem;

	if(elemTagName)
		elem = document.createElement(elemTagName);
	else
		elem = document.createElement("div");

	if(elem)
	{
		if(elemId)
			elem.id = elemId;
		if(elemClass)
			elem.className = elemClass;
		if(elemInnerHtml && elemInnerHtml.length)
			elem.innerHTML = elemInnerHtml;
	}

	return elem;
}

function showResource(str, uuid)
{
	var resourceLink, resourceLinkWrapper, resourceDelete, strSanitized = str;
	if(str.indexOf("?") !== -1)
	 	strSanitized = str.substr(0, str.indexOf("?"));
	resourceLink = document.createElement("a");
	resourceLink.textContent = strSanitized;
	resourceLink.href = str;
	resourceLinkWrapper = createElement({ strTagName: "h6", strClass: "xlog", strId: "link" + uuid });
	resourceDelete = createElement({ strTagName: "span", strInnerHtml: "[Delete]" });
	resourceDelete.setAttribute("data-delete", uuid);
	document.body.addEventListener('mouseup', deleteResource, false);
	resourceLinkWrapper.appendChild(resourceDelete);
	resourceLinkWrapper.appendChild(resourceLink);
	document.body.insertBefore(resourceLinkWrapper, document.body.firstChild);
}

function deleteResource(evt)
{
	if(!(evt.target.parentNode.tagName.toLowerCase() === "h6" && evt.target.tagName.toLowerCase() === "span"))
		return;
	evt.stopPropagation();
	evt.preventDefault();
	var idToDelete = evt.target.getAttribute("data-delete");
	xlog("idToDelete: " + idToDelete);
	del("#" + idToDelete);
	del("#link" + idToDelete);
}

function showResources()
{
	if(get(".xlog").length)
	{
		del(".xlog");
		del("#style_show_resources");
		return;
	}
	var e, f, g, i, count, uuid;
	e = get("script");
	i = e.length;
	count = 0;
	while(i--)
	{
		if(e[i].src)
		{
			uuid = createUUID();
			e[i].id = uuid;
			showResource(e[i].src, uuid);
			count++;
		}
	}
	ylog(count + " scripts", "h3", true);
	e = get("link");
	i = e.length;
	count = 0;
	while(i--)
	{
		if( (e[i].href && e[i].href.indexOf("css") !== -1) || ( e[i].type && e[i].type === "text/css" ) )
		{
			uuid = createUUID();
			e[i].id = uuid;
			showResource(e[i].href, uuid);
			count++;
		}
	}
	ylog(count + " styles", "h3", true);
	var s = '.xlog { background: #000; color: #FFF; margin: 0; padding: 5px 10px; z-index: 2000000000; font: 12px verdana; text-align: left; }' +
	'.xlog a { text-decoration: none; letter-spacing: 0; font: 12px verdana; text-transform: none; color: #09F; }' +
	'.xlog a:visited { color: #059; }' +
	'.xlog a:hover { color: #FFF; } h3.xlog:nth-of-type(1) {margin-top: 50px;}';
	insertStyle(s, "style_show_resources", true);
	window.scrollTo(0, 0);
}

function makeDocumentClickable()
{
	var db = document.body;
	if(get("#view-document-structure"))
	{
		del("#view-document-structure");
		db.removeEventListener('mouseup', clickHandler, false);
		removeClass(db, "debug");
	}
	else
	{
		db.addEventListener('mouseup', clickHandler, false);
		db.className += " debug";
		var s = 'header, footer, article, aside, section, div { border: 2px solid #666; margin: 5px; padding: 5px; }' +
		'header:hover, footer:hover, article:hover, aside:hover, section:hover, div:hover { border-color: #F00; }' +
		'body>header, body>footer, body>article, body>aside, body>section, body>div { border-width: 10px 10px 10px 20px; }';
		insertStyle(s, "view-document-structure", true);
	}
}

function showDocumentStructure()
{
	if(get("#view-document-structure"))
	{
		del("#view-document-structure");
	}
	else
	{
		var s = 'header, footer, article, aside, section, div, blockquote, canvas { box-shadow: inset 1px 1px #09F, inset -1px -1px #09F; }' +
		'form, input, button, label { box-shadow: inset 1px 1px #F90, inset -1px -1px #F90; background: rgba(255, 150, 0, 0.2); }' +
		'table, tr, td { box-shadow: inset 1px 1px #00F, inset -1px -1px #00F; }' +
		'ul, ol, li, span { box-shadow: inset 1px 1px #080, inset -1px -1px #080; }' +
		'h1, h2, h3, h4, h5, h6, p { box-shadow: inset 1px 1px #F0F, inset -1px -1px #F0F; }' +
		'a, a * { background: rgba(180, 255, 0, 0.25); }' +
		'img { background: #800; padding: 2px; box-sizing: border-box; }';
		insertStyle(s, "view-document-structure", true);
	}
}

function showDocumentStructure2()
{
	if(get("#view-document-structure"))
	{
		del("#view-document-structure");
	}
	else
	{
		insertStyle("div { background: linear-gradient(135deg, black, white); } h1, h2, h3, h4, h5, h6 { background: #F00; } p { background: #09F; } ol, ul { background: #00F; } table { background: #080; }", "view-document-structure", true);
	}
}

function showDocumentStructureWithNames()
{
	if(hasClass(document.body, "showdivs"))
	{
		del("x");
		del("#showDivs");
		removeClass(document.body, "showdivs");
		return;
	}
	var tag, j, e, i, divid;
	tag = ['table', 'tr', 'td', 'div', 'ul', 'aside', 'header', 'footer', 'article', 'section'];
	for (j = 0, jj = tag.length; j < jj; j++)
	{
		e = get(tag[j]);
		for (i = e.length - 1; i >= 0; i--)
		{
			divid = "";
			if(e[i].hasAttribute("id")) divid += "#" + e[i].id;
			if(e[i].hasAttribute("class")) divid += " ." + e[i].className;
			if(e[i].firstChild !== null) e[i].insertBefore(createElementWithText("x", divid), e[i].firstChild);
			else e[i].appendChild(createElementWithText("x", divid));
		}
	}
	document.body.className += " showdivs";
	var s = 'body { padding: 100px; }' +
	'div, aside, section, header, footer, aside, ul, ol { box-shadow: inset 2px 2px #000, inset -2px -2px #000; min-height: 30px; padding: 0 10px 10px 10px; margin-top: 10px; }' +
	'div::after { content: " "; display: block; clear: both; }' +
	'x { color: #FC0; background: #000; font: 12px Verdana; padding: 5px 10px; letter-spacing: 0; display: block; margin : 0 -10px 10px -10px; }';
	insertStyle(s, 'showDivs', true);
}

function highlightSelectionOrText()
{
	showMessage("Highlight selection or text", "messagebig");
	if(window.getSelection().toString().length)
	{
		selection = window.getSelection().toString();
		s = selection.toString();
	}
	else
	{
		s = prompt("Text to highlight");
	}
	if(s && s.length)
	{
		var ss = escapeForRegExp(s);
		var tempHTML = document.body.innerHTML;
		//tempHTML = tempHTML.replace(/\n/g, " ");
		//tempHTML = tempHTML.replace(/\r/g, " ");
		//tempHTML = tempHTML.replace(/\s+/g, " ");

		//var r = new RegExp("\\b" + ss + "\\b", "gi");
		var r = new RegExp(ss, "gi");
		tempHTML = tempHTML.replace(r, "<samp>" + s + "</samp>");

		//var r = new RegExp("(>[^<>]*)" + ss + "([^<>]*<)", "gi");
		//tempHTML = tempHTML.replace(r, "$1<samp>" + s + "</samp>$2");

		document.body.innerHTML = tempHTML;
	}
}

function deleteUselessIframes()
{
	var e = get("iframe"), i, iframereplacement, iframelink, domains = ["facebook", "twitter", "linkedin"];
	for (i = e.length - 1; i >= 0; i--)
	{
		if( !e[i].src )
			continue;
		for(j = domains.length-1; j >= 0; j--)
		{
			if(e[i].src.indexOf(domains[j]) > 0 && location.hostname.indexOf(domains[j]) === -1)
			{
				e[i].parentNode.removeChild(e[i]);
			}
		}
	}
}

function deleteUselessScripts()
{
	var e, i, ii, domains = ["google.com", "googletagmanager.com"];
	e = get("script");
	i = e.length;
	while(i--)
	{
		if(e[i].hasAttribute("src"))
		{
			if(containsAnyOfTheStrings(e[i].src, domains) && !(containsAnyOfTheStrings(location.hostname, domains)))
			{
				log2("Deleting " + e[i].src);
				e[i].parentNode.removeChild(e[i]);
			}
		}
	}
	insertStyle(".xlog { background: #181818; color: #AAA; font: 24px swis721 cn bt; margin: 0 0 1px 0; }", "style_log2", true);
}

function getBestImageSrc()
{
	var e = get("img");
	var i = e.length;
	while(i--)
	{
		if(e[i].currentSrc)
			e[i].src = e[i].currentSrc;
		if(e[i].hasAttribute("srcset"))
			e[i].removeAttribute("srcset");
	}
}

function deleteNonContentImages()
{
	deleteImagesBySrcContaining("transparent.");
	deleteImagesBySrcContaining("pixel.");
	deleteImagesBySrcContaining("spacer.");
	deleteImagesBySrcContaining("nbb.org");
	deleteImagesBySrcContaining("qm.gif");
	deleteImagesBySrcContaining("avatar");
	deleteImagesBySrcContaining("doubleclick");
	deleteImagesBySrcContaining("bookmarking");
	deleteImagesBySrcContaining("adbrite");
	deleteImagesBySrcContaining("blogger.com");
	deleteImagesBySrcContaining("style_images");
	deleteImagesBySrcContaining("smilies");
	deleteImagesBySrcContaining("smiley");
	deleteImagesBySrcContaining("badges");
	deleteImagesBySrcContaining("adriver");
	deleteImagesBySrcContaining("/ads/");
	deleteImagesBySrcContaining("/delivery/");
	deleteImagesBySrcContaining("profile_images");
	deleteImagesBySrcContaining("reputation_");
	deleteImagesBySrcContaining("statusicons");
	deleteImagesBySrcContaining("mt-static");
	deleteImagesBySrcContaining("feed.");
	deleteImagesBySrcContaining("twitter.");
	deleteImagesBySrcContaining("bluesaint");
	deleteImagesBySrcContaining("board/images");
}

function cleanupBlogs()
{
	deleteElementsContainingText("div", "Join Date:");
	deleteElementsContainingText("div", "Joined:");
	deleteElementsContainingText("div", "Location:");
	deleteElementsContainingText("div", "Posts:");
	deleteElementsContainingText("div", "Thanks:");
	deleteElementsContainingText("div", "Thanked");
	deleteElementsContainingText("table", "Users Say Thank You to");
	deleteElementsContainingText("table", "View Public Profile");
	del(["#share", "#comments_posting"]);
}

function showMessage(s, msgClass, persist)
{
	clearTimeout(Nimbus.messageTimeout);
	var e;
	msgClass = msgClass || "";
	var strStyle = 'message { display: block; background: #111; font: 12px Verdcode, Verdana; color: #555; padding: 0 1em; height: 30px; line-height: 30px; position: fixed; bottom: 0; left: 0; width: 100%; z-index: 2000000000; text-align: left; }' +
	'message.messagebig { font: 32px "Swis721 cn bt"; color: #FFF; height: 60px; line-height: 60px; font-weight: 500; }' +
	'message.messageerror { color: #FFF; background: #A00; }';

	if(!get("message"))
	{
		e = document.createElement("message");
		e.className = msgClass;
		document.body.insertBefore(e, document.body.firstChild);
		if(!get("#style_message"))
		{
			insertStyle(strStyle, "style_message", true);
		}
	}
	else
	{
		e = get("message")[0];
		e.className = msgClass;
	}
	e.textContent = s;
	if(!persist)
		Nimbus.messageTimeout = setTimeout(deleteMessage, 2000);
}

function deleteMessage()
{
	del("message");
	del(".xalert");
	del("#style_message");
}

function openDialog(s)
{
	var dialog, dialogInput, s = s || "";
	if(!get("#xxdialog"))
	{
		dialog = createElement({ strId: "xxdialog" });
		dialogInput = createElement({ strTagName: "textarea", strId: "xxdialoginput" });
		dialog.appendChild(dialogInput);
		document.body.insertBefore(dialog, document.body.firstChild);
		s = '#xxdialog { position: absolute; margin: auto; z-index: 10000; height: 400px; top: 0; left: 0px; bottom: 0px; right: 0; background: #111; color: #FFF; border: 10px solid #000; display: block; text-transform: none; width: 800px; }' +
		'#xxdialoginput { font: 32px "swis721 cn bt", verdana; background: #000; color: #FFF; padding: 0; border: 0; width: 100%; height: 100%; }';
		insertStyle(s, "style-xxdialog", true);
		dialogInput.focus();
		dialogInput.addEventListener("keydown", handleDialogInput, false);
	}
}

function closeDialog()
{
	del("#xxdialog");
	del("#style-xxdialog");
}

function handleDialogInput(e)
{
	e.stopPropagation();
	var keyCode = e.keyCode;
	var c = String.fromCharCode(keyCode).toLowerCase();
	switch(keyCode)
	{
		case KEYCODES.ESCAPE: closeDialog(); break;
		default: showMessage(c, "messagebig"); break;
	}
}

function removeNonAlpha(s)
{
	return s.replace(/[^A-Za-z]/g, '');
}

function changePage(direction)
{
	var links, i, s, found = false;
	links = get("a");
	i = links.length;
	var matchStrings = [];
	if(direction === "prev") matchStrings = ["prev", "previous"];
	else if(direction === "next") matchStrings = ["next", "nextpage"];
	while(i--)
	{
		if(s = links[i].textContent)
		{
			s = removeNonAlpha(s).toLowerCase();
			if(containsAnyOfTheStrings(s, matchStrings))
			{
				found = true;
				links[i].click();
				return;
			}
		}
	}
	if(!found)
		pager(true);
}

function pager(prev)
{
	var pageString, curPage, links, i, ii;
	if(document.body.innerHTML.match(/Page [0-9]+ of [0-9]+/))
	{
		pageString = document.body.innerHTML.match(/Page [0-9]+ of [0-9]+/)
		curPage = parseInt(pageString[0].match(/[0-9]+/)[0], 10);
		links = get("a");
		if(prev)
			--curPage;
		else
			++curPage;
		for(i = 0, ii = links.length; i < ii; i++)
		{
			if(links[i].textContent && links[i].textContent === (curPage).toString())
			{
				links[i].className += " hl";
				links[i].focus();
				break;
			}
		}
	}
	else
	{
		highlightPagination();
	}
}

function highlightPagination()
{
	var s, e, i, ii;
	e = get("a");
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].textContent && e[i].textContent.length)
		{
			s = removeWhitespace(e[i].textContent);
			if(parseInt(s, 10) && s.match(/[^0-9]+/) === null)
			{
				e[i].focus();
				e[i].className = "hl";
				break;
			}
		}
	}
}

function openManager()
{
	if(location.href.indexOf("/stage/") > 0 )
	{
		var loc = location.href.split('/');
		var managerloc = "http://" + loc[2] + '/' + loc[3] + '/' + loc[4] + '/manager.php';
		location.href = managerloc;
	}
	else
	{
		location.href = "http://" + location.hostname + "/manager.php";
	}
}

// http://stackoverflow.com/questions/2952667/find-all-css-rules-that-apply-to-an-element
// http://stackoverflow.com/a/22638396
function css(elem)
{
	var sheets = document.styleSheets, rulesArray = [];
	elem.matches = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector || elem.oMatchesSelector;
	for(var i in sheets)
	{
		var rules = sheets[i].cssRules;
		for(var r in rules)
		{
			if(elem.matches(rules[r].selectorText))
			{
				rulesArray.push(rules[r].cssText);
			}
		}
	}
	return rulesArray;
}

function doStackOverflow()
{
	var sites = ["stackexchange", "stackoverflow", "superuser", "serverfault"], found = false;
	if(containsAnyOfTheStrings(location.hostname, sites))
		found = true;
	// we only want to run this code on the individual question pages
	if(found && location.href.match(/questions\/[0-9]+/) !== null)
	{
		getContent();
		del(["#sidebar", ".signup-prompt", ".post-menu", ".user-gravatar32", "form"]);
		deleteElementsContainingText("h2", "Not the answer");
		cleanupGeneral();
		highlightCode(true);
		forAll("td", function f(x) {
			if(x.textContent && x.textContent.indexOf("up vote") !== -1)
				x.setAttribute("style", "width: 200px");
		});
		var observer = new MutationObserver(function(mutations)
		{
			mutations.forEach(function(mutation)
			{
				if(mutation.addedNodes.length)
				{
					ylog("Deleting styles and scripts");
					del("link");
					del("script");
				}
			});
		})
		observer.observe(document.getElementsByTagName("head")[0], { childList: true });
	}
}

function clickThanks()
{
	var e = get("a");
	var i = e.length;
	while(i--)
	{
		if(e[i].href && e[i].href.indexOf("post_thanks_add") > 0)
		{
			e[i].click();
			showMessage("clicked thanks", "messagebig");
		}
	}
}

function highlightElementsBySelector()
{
	var s = prompt("Enter selector for elements to highlight");
	if(!(s && s.length))
		return;
	var e = document.querySelectorAll(s);
	if(e.length)
	{
		var i = e.length;
		while(i--)
		{
			addClass(e[i], "hl");
		}
		showMessage("Highlighted " + e.length + " elements", "messagebig");
	}
	else
	{
		showMessage("No elements found for selector " + s, "messagebig messageerror");
	}
	insertStyleHighlight();
}

function unhighlightElement(elem)
{
	removeClass(elem, "hl");
}

function unhighlightAllHighlightedElements()
{
	forAll(".hl", unhighlightElement);
}

function getIdAndClass(e)
{
	var s = "";
	if(e.id)
		s += "#" + e.id + " ";
	if(e.className)
		s += "." + e.className;
	return s;
}

function highlightElementsWithAttribute(s)
{
	showMessage("Highlighting elements with attribute \"" + s + '"', "messagebig");
	ylog("Highlighting elements with attribute " + s, "h2");
	var e = get("*");
	if(e.length)
	{
		var i = e.length;
		while(i--)
		{
			if(e[i].hasAttribute("style"))
			{
				addClass(e[i], "hl");
				ylog(getIdAndClass(e[i]) + ": " + e[i].style.cssText);
			}
		}
	}
	insertStyle(".hl { box-shadow: inset 2px 2px #F00, inset -2px -2px #F00; }", "style_hewa", true);
}

function highlightElementsWithSetWidths()
{
	showMessage("Finding divs with pixel widths...", "messagebig");
	var e = get("div");
	var i = e.length, s, w, j, cssRules;
	while(i--)
	{
		cssRules = css(e[i]);
		j = cssRules.length;
		while(j--)
		{
			if( (cssRules[j].match(/width:[^;]*px/) !== null))
			{
				e[i].className += " hl";
				e[i].innerHTML = "<x>#" + e[i].id + " ." + e[i].className + " " + getComputedStyle(e[i], null).getPropertyValue("width") + "</x>" + e[i].innerHTML;
				ylog(cssRules[j]);
			}
		}
	}
	insertStyle("x { background: #000; color: #FFF; padding: 2px 4px; display: block; font: 12px verdana;  } .xlog { clear: both; } .hl { box-shadow: inset 2px 2px #F00, inset -2px -2px #F00; }", "style_hewsw", true);
}

function wrapNodeInTag()
{
	var s = prompt("Enter tag to wrap selected node in");
	if(s && s.length)
		highlightNode(s);
}

function highlightNode(tag)
{
	var t;
	if(tag && tag.length)
		t = tag;
	else
		t = "mark";
	var selection = window.getSelection();
	if(!selection)
		return;
	var node = selection.anchorNode;
	if(node.tagName === undefined)
		node = node.parentNode;
	if(node && node.parentNode)
		node.innerHTML = "<" + t + ">" + node.innerHTML + "</" + t + ">";
}

function makeHeadingFromSelection(tagname)
{
	var selection = window.getSelection(),
		newNode;
	if(!selection) return;
	var node = selection.anchorNode;
	if(node.tagName === undefined) node = node.parentNode;
	if(node && node.parentNode && node.parentNode.tagName !== "body")
	{
		newNode = document.createElement(tagname);
		newNode.innerHTML = node.innerHTML;
		node.parentNode.replaceChild(newNode, node);
	}
	else
	{
		xlog("Could not make heading");
	}
}

function annotate()
{
	var selection = window.getSelection();
	if(!selection) return;
	var node = selection.anchorNode;
	if(node.tagName === undefined) node = node.parentNode;
	if(node && node.parentNode)
	{
		var d = document.createElement("ruby");
		d.textContent = prompt("______________________________________________ Annotate ___________________________________________________________________");
		if(d.textContent.length) node.parentNode.insertBefore(d, node);
	}
}

function getImages(slideshow)
{
	if(get("#style_nimbus_gallery"))
	{
		del("#style_nimbus_gallery");
		del("#nimbus_gallery");
		return;
	}
	deleteSmallImages();
	var f = get("img"), db = document.body, i, ii, j, jj, e = [], w, h;
	var tempNode = document.createElement("slideshow");
	tempNode.id = "nimbus_gallery";
	if(f && f.length)
	{
		//mark duplicates by removing the src
		for(i = 0; i < f.length; i++)
		{
			for(j = i+1; j < f.length; j++)
			{
				if(f[j].src === f[i].src)
				{
					f[j].removeAttribute("src");
				}
			}
		}
		for(i = 0, ii = f.length; i < ii; i++)
		{
			if(f[i].hasAttribute("src")) // if it's not a duplicate
			{
				f[i].removeAttribute("width");
				f[i].removeAttribute("height");
				w = f[i].clientWidth;
				h = f[i].clientHeight;
				if(w && h && (w > window.innerWidth || h > window.innerHeight))
				{
					if((w/h) > (16/9))
						f[i].className = "wide ratio" + w + "x" + h;
					else
						f[i].className = "tall ratio" + w + "x" + h;
				}
				//if(f[i].parentNode && f[i].parentNode.tagName && f[i].parentNode.tagName.toLowerCase() === "a")
				//	tempNode.appendChild(f[i].parentNode.cloneNode(true));
				//else
				tempNode.appendChild(f[i].cloneNode(true));
			}
		}

		if(!slideshow)
		{
			del("img");
			cleanupHead();
			//del("style");
			insertStyle("img { display: block; float: left; height: 300px; }", "style_gallery", true);
		}

		db.insertBefore(tempNode, db.firstChild);

	}
	else if(f)
	{
		db.innerHTML = f.innerHTML;
	}
	else
	{
		showMessage("No images found", "messagebig");
	}
	if(slideshow)
		buildSlideshow();
}

function buildSlideshow()
{
	var e, gallery, images, s;
	if(!(gallery = get("#nimbus_gallery")))
		return;
	images = gallery.getElementsByTagName("img");

	if(gallery && images)
	{
		s = 'body { margin: 0; padding: 0; }' +
		'#nimbus_gallery { width: 100%; height: 100vh; background: #000; color: #999; position: absolute; top: 0; left: 0; z-index: 2000000000; }' +
		'#nimbus_gallery img { display: none; }' +
		'#nimbus_gallery img.currentImage { margin: auto; position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: block; }' +
		'#nimbus_gallery img.currentImage.tall { height: 100%; width: auto; }' +
		'#nimbus_gallery img.currentImage.wide { width: 100%; height: auto; }' +
		'#nimbus_gallery a { color: #000; }';
		insertStyle(s, 'style_nimbus_gallery', true);
		addClass(images[0], "currentImage");
		window.scrollTo(0, 0);
	}
}

function changeGalleryImage(direction)
{
	var gallery, e, i, ii;
	if(!get("#style_nimbus_gallery"))
	{
		return;
	}
	if(!(gallery = get("#nimbus_gallery")))
		return;
	e = gallery.getElementsByTagName("img");
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(hasClass(e[i], "currentImage"))
		{
			removeClass(e[i], "currentImage");
			if(direction === "prev")
			{
				if(i === 0)
					addClass(e[ii-1], "currentImage");
				else
					addClass(e[i-1], "currentImage");
				break;
			}
			else if(direction === "next")
			{
				if(i === ii-1)
					addClass(e[0], "currentImage");
				else
					addClass(e[i+1], "currentImage");
				break;
			}
		}
	}
}

function deleteIframes()
{
	var numIframes = get("iframe").length;
	if(numIframes !== undefined)
	{
		del("iframe");
		showMessage(numIframes + " iframes deleted", "messagebig");
	}
	else
	{
		showMessage("No iframes found", "messagebig");
	}
	deleteElementsContainingText("rp", "iframe:");
}

function deleteImages()
{
	del("svg");
	if(get("img").length) del("img");
	else del("rt");
}

function deleteImagesSmallerThan(x, y)
{
	var f = document.getElementsByTagName('img');
	var i = f.length;
	while(i--)
	{
		if(f[i].clientWidth < x || f[i].clientHeight < y)
		{
			var altText = document.createTextNode("");
			f[i].parentNode.replaceChild(altText, f[i]);
		}
	}
}

function deleteSmallImages()
{
	var f = document.getElementsByTagName('img');
	var dimensions = [20, 50, 100, 200, 300, 400];
	for (var i = f.length - 1; i >= 0; i--)
	{
		if(!(f[i].clientWidth && f[i].clientHeight))
			continue;
		for(j = 0, jj = dimensions.length; j < jj; j++)
		{
			if(f[i].clientWidth < dimensions[j] || f[i].clientHeight < dimensions[j])
			{
				deleteImagesSmallerThan(dimensions[j], dimensions[j]);
				return;
			}
		}
	}
}

function replaceSpans()
{
	var e = get("span");
	var i = e.length;
	while(i--)
	{
		e[i].parentNode.replaceChild(document.createTextNode(e[i].textContent), e[i]);
	}
}

function replaceCommentsWithPres()
{
	var s = db.innerHTML;
	s = s.replace(/<!--/g, '<pre>');
	s = s.replace(/-->/g, '</pre>');
	db.innerHTML = s;
}

function replaceImagesWithTextLinks()
{
	var e, imageLink, imageReplacement, i;
	if(get("rt"))
	{
		e = get("rt");
		i = e.length;
		while(i--)
		{
			imageLink = document.createElement("img");
			imageLink.src = e[i].getElementsByTagName("a")[0].href;
			e[i].parentNode.replaceChild(imageLink, e[i]);
		}
		del('#style_replace_images');
		return;
	}
	else if(get("img"))
	{
		e = get("img");
		for(i = 0; i < e.length; i++)
		{
			if(e[i].src)
			{
				imageLink = document.createElement("a");
				imageLink.href = imageLink.textContent = e[i].src;
				imageReplacement = document.createElement("rt");
				imageReplacement.appendChild(imageLink);
				if(e[i].parentNode.tagName.toLowerCase() === "a")
					e[i].parentNode.parentNode.replaceChild(imageReplacement, e[i].parentNode);
				else
					e[i].parentNode.insertBefore(imageReplacement, e[i]);
			}
		}
		del("img");
		var s = 'rt { margin: 10px 0; padding: 20px; display: block; background: #181818; font: 12px verdana; }' +
		'rt a { color: #FFF; }' +
		'rt:before { content: ""; display: block; width: 10px; height: 15px; border: 2px solid #AAA; float: left; margin: -3px 20px 0 0; }';
		insertStyle(s, "style_replace_images");
	}
}

function replaceFlash()
{
	var objects, s, index1, flashlink, flashlinkcontainer, i;
	objects = document.getElementsByTagName("object");
	for (i = objects.length - 1; i >= 0; i--)
	{
		s = objects[i].innerHTML;
		s = s.replace(/\n/g, " ");
		s = s.replace(/\r/g, " ");
		s = s.replace(/\s+/g, " ");
		index1 = s.indexOf("http");
		if(index1 >= 0)
		{
			s = s.substr(index1);
		}
		else if(objects[i].getAttribute("data"))
		{
			s = objects[i].getAttribute("data").toString();
		}
		else
		{
			s = "";
		}
		if(s.length)
		{
			s = s.match(/[^>]+/g)[0];
			if(s.length)
			{
				s = s.replace(/&amp;/g, "&");
				flashlink = document.createElement("a");
				flashlinkcontainer = document.createElement("h6");
				flashlink.href = s;
				flashlink.textContent = "[video]";
				flashlinkcontainer.appendChild(flashlink);
				objects[i].parentNode.replaceChild(flashlinkcontainer, objects[i]);
			}
		}
	}
	objects = document.getElementsByTagName("embed");
	for (i = objects.length - 1; i >= 0; i--)
	{
		s = objects[i].src;
		if(s && s.length)
		{
			s = s.replace(/&amp;/g, "&");
			flashlink = document.createElement("a");
			flashlinkcontainer = document.createElement("h6");
			flashlink.href = s;
			flashlink.textContent = "[video]";
			flashlinkcontainer.appendChild(flashlink);
			objects[i].parentNode.replaceChild(flashlinkcontainer, objects[i]);
		}
	}
}

function replaceAudio()
{
	var e, i, f, g;
	e = get("source"), i = e.length;
	while(i--)
	{
		if(e[i].src)
		{
			f = document.createElement("a");
			f.href = f.textContent = e[i].src;
			g = document.createElement("h2");
			g.appendChild(f);
			e[i].parentNode.replaceChild(g, e[i]);
		}
	}
	replaceElement("audio", "div");
}

function addLinksToLargerImages()
{
	if(get("rt"))
		return;
	var links = document.getElementsByTagName("a");
	var link, linkLower;
	var i = links.length;
	while(i--)
	{
		link = links[i].href;
		if(containsAnyOfTheStrings(link.toLowerCase(), [".png", ".jpg", ".jpeg", ".gif"]))
		{
			var largeImage = document.createElement("rt");
			var imageLink = document.createElement("a");
			imageLink.href = imageLink.textContent = link;
			largeImage.appendChild(imageLink);
			links[i].parentNode.insertBefore(largeImage, links[i]);
		}
	}
}

function cleanupGeneral()
{
	var t0 = performance.now();
	var t1 = new Date();
	cleanupHead();
	get("body")[0].removeAttribute("style");
	replaceFlash();
	replaceIframes();
	deleteNonContentImages();
	addLinksToLargerImages();
	replaceWrongHeading();
	del(["link", "style", "iframe", "script", "input", "select", "textarea", "button", "x", "canvas", "label", "svg", "video", "audio", "applet"]);
	//replaceFontTags();
	replaceElement("center", "div");
	setDocTitle();
	removeAttributes();
	replaceAudio();
	//removeEventListeners();
	appendInfo();
	getBestImageSrc();
	document.body.className = "pad100";
	insertStyleNegative();
	var t1 = performance.now();
	xlog(Math.floor((t1 - t0) * 1000) + " microseconds: cleanupGeneral");
}

function cleanupGeneral_light()
{
	var t1 = new Date();
	deleteEmptyHeadings();
	cleanupHead();
	replaceFlash();
	replaceIframes();
	delTag(["link", "style", "iframe", "script", "input", "select", "textarea", "button", "noscript"]);
	//replaceFontTags();
	replaceElement("center", "div");
	setDocTitle();
	del("x");
	removeAttributes_fast();
	appendInfo();
	document.body.className = "pad100 xShowImages";
	var t2 = new Date();
	xlog(t2-t1 + " ms: cleanupGeneral_light");
}

function replaceIframes()
{
	var e = get("iframe"), i, iframereplacement, iframelink, s, segments;
	i = e.length;
	while(i--)
	{
		iframereplacement = document.createElement("rp");
		iframelink = document.createElement("a");
		s = e[i].src;
		if(containsAnyOfTheStrings(s, ["facebook", "twitter"]))
		{
			e[i].parentNode.removeChild(e[i]);
			continue;
		}
		iframelink.href = s;
		if(e[i].src.indexOf("youtube") !== -1)
		{
			s = s.replace(/\/embed\//, '/watch?v=');
			segments = s.split('?');
			iframelink.href = segments[0] + '?' + segments[1];
			if(s.indexOf(".") > 0)
				s = s.match(/:\/\/(.[^\/]+)/)[1];
			iframelink.textContent = iframelink.href;
		}
		else
		{
			iframelink.textContent = "iframe: " + iframelink.href;
		}
		iframereplacement.appendChild(iframelink);
		e[i].parentNode.replaceChild(iframereplacement, e[i]);
	}
}

function handleMouseUp(e)
{
	var db = document.body;
	e.stopPropagation();
	var targ;
	if(!e) e = window.event;
	if(e.target) targ = e.target;
	if(e.shiftKey)
	{
		if(targ.tagName.toLowerCase() === "a")
		{
			var str = targ.href;
			db.innerHTML += '<iframe src="' + str + '" width="100%" height="100px" />';
			return false;
		}
	}
}

function count(s)
{
	s = s.toString();
	var e, t = s.substr(1, s.length - 1);
	if(s.indexOf("#") === 0) e = document.getElementById(t);
	else if(s.indexOf(".") === 0) e = document.getElementsByClassName(t);
	else if(document.getElementsByTagName(s).length) e = document.getElementsByTagName(s);
	if(e.length)
		return e.length;
	else
		return 0;
}

function replaceElement(e1, e2)
{
	if(!(e1 && e2))
	{
		e1 = prompt("Element to replace (querySelectorAll)");
		e2 = prompt("Replacement (tagName)");
	}
	var replacement, e, toreplace, i, ii;
	//e = get(e1);
	e = document.querySelectorAll(e1);
	if(e.length)
	{
		toreplace = [];
		for (i = 0, ii = e.length; i < ii; i++)
		{
			toreplace.push(e[i]);
		}
		for (i = toreplace.length - 1; i >= 0; i--)
		{
			replacement = document.createElement(e2);
			replacement.innerHTML = toreplace[i].innerHTML;
			toreplace[i].parentNode.replaceChild(replacement, toreplace[i]);
		}
	}
	else if(e && e.parentNode)
	{
		replacement = document.createElement(e2);
		replacement.innerHTML = e.innerHTML;
		e.parentNode.replaceChild(replacement, e);
	}
}

function delTag(c)
{
	for (var i = 0, ii = c.length; i < ii; i++)
	{
		var f = document.getElementsByTagName(c[i]);
		if(f.length)
		{
			for (var j = f.length - 1; j >= 0; j--)
			{
				f[j].parentNode.removeChild(f[j]);
			}
		}
	}
}

function cleanupHead()
{
	if(!get("head"))
		return;
	var tempTitle = document.title;
	document.getElementsByTagName('head')[0].innerHTML = '';
	document.title = tempTitle;
}

function forceReloadCss()
{
	showMessage("Force-reloading CSS", "messagebig");
	var i, styleLinks, styleSheet;
	styleLinks = document.getElementsByTagName('link');
	for (i = 0; i < styleLinks.length; i++) {
		styleSheet = styleLinks[i];
		if (styleSheet.rel.toLowerCase().indexOf('stylesheet') >= 0 && styleSheet.href) {
			var h = styleSheet.href.replace(/(&|%5C?)forceReload=\d+/, '');
			styleSheet.href = h + (h.indexOf('?') >= 0 ? '&' : '?') + 'forceReload=' + (new Date().valueOf());
		}
	}
}

function insertStyle(str, identifier, important)
{
	if(identifier !== undefined && identifier.length)
	{
		identifier_hash = "#" + identifier;
		if(get(identifier_hash))
		{
			del(identifier_hash);
			return;
		}
	}
	if(important)
	{
		str = str.replace(/;/g, " !important;");
	}
	var head = get("head")[0], style = document.createElement("style"), rules = document.createTextNode(str);
	style.type = "text/css";
	if(style.styleSheet)
	{
		style.styleSheet.cssText = rules.nodeValue;
	}
	else
	{
		style.appendChild(rules);
	}
	if(identifier && identifier.length)
	{
		style.id = identifier;
	}
	head.appendChild(style);
}

function insertStyleHighlight()
{
	var s = '.hl { box-shadow: inset 2px 2px #F00, inset -2px -2px #F00; padding: 2px; }' +
		'.hl2 { box-shadow: inset 2px 2px #00F, inset -2px -2px #00F; }' +
		'.hl::after, .hl2::after { content: " "; display: block; clear: both; }';
	insertStyle(s, undefined, true);
}

function insertStyleFonts()
{
	var s = 'a, p, li, td, div, input, select, textarea { font: bold 15px arial; }' +
	'h1 { font: 40px "swis721 cn bt"; }' +
	'h2 { font: 32px "swis721 cn bt"; }' +
	'h3 { font: 28px "swis721 cn bt"; }' +
	'h4 { font: 24px "swis721 cn bt"; }' +
	'h5 { font: 18px "swis721 cn bt"; }' +
	'h6 { font: 16px "swis721 cn bt"; }' +
	'span, b, em, strong, i { font: inherit; }' +
	'body { background: #FFF; color: #000; }' +
	'p, li { line-height: 150%; }' +
	'p { margin: 0; padding: 5px 0; }' +
	'pre, code { font: 12px verdcode; }';
	insertStyle(s, 'style_fonts', true);
}

function insertStyleShowClass()
{
	var s = '* { display: block; padding: 5px; border: 1px solid #111; }' +
	'*::before { content: attr(class); color: #FF0; }' +
	'head { display: none; }';
	insertStyle(s, "style_showClass", true);
}

function insertStyleGrey()
{
	var s = 'body { background: #203040; color: #ABC; font: 24px "swis721 cn bt"; }' +
	'h1, h2, h3, h4, h5, h6 { background: #123; padding: 0.35em 10px; font-weight: normal; }' +
	'body.pad100 { padding: 100px; }' +
	'body.xwrap { width: 1000px; margin: 0 auto; }' +
	'mark { background: #049; color: #7CF; padding: 4px 2px; }' +
	'p { line-height: 135%; text-align: justify; }' +
	'blockquote { margin: 0 0 0 40px; padding: 10px 20px; border-left: 10px solid #123; }' +
	'a { text-decoration: none; color: #09F; }' +
	'em, i, strong, b { font-style: normal; font-weight: normal; color: #FFF; }' +
	'code { background: #012; color: #ABC; }' +
	'pre { background: #012; color: #ABC; padding: 20px; }' +
	'pre q1 { color: #57F; background: #024; }' +
	'pre q2 { color: #C7F; background: #214; }' +
	'pre c1 { font-style: normal; color: #F90; background: #331500; }' +
	'pre c2 { color: #F00; background: #400; }' +
	'pre b1 { color: #0F0; }' +
	'pre b2 { color: #FFF; }' +
	'pre b3 { color: #F90; }' +
	'pre xk { color: #29F; }' +
	'pre xh { color: #57F; }' +
	'pre xv { color: #F47; }';
	insertStyle(s, "style_Grey", true);
}

function insertStyleNegative(important)
{
	var s = 'html { background: #181818; }' +
	'html body { margin: 0; }' +
	'html body, html body[class] { color: #888; background: #242424; font-weight: normal; }' +
	'body.pad100 { padding: 100px 100px; }' +
	'body.pad100 table { width: 100%; }' +
	'body.pad100 td, body.pad100 th { padding: 3px 10px; }' +
	'body.pad100 image { display: block; }' +
	'nav { background: #111; }' +
	'body.xdark { background: #111; }' +
	'body.xblack { background: #000; }' +
	'body.xwrap { width: 800px; margin: 0 auto; padding: 100px 100px; }' +
	'html h1, html h2, html h3, html h4, html h5, html h6, html h1[class], html h2[class], html h3[class], html h4[class], html h5[class], html h6[class] { color: #AAA; padding: 10px 20px; line-height: 160%; margin: 2px 0; background: #141414; border: 0; }' +
	'html h1, html h1[class], div[class] h1 { font: 40px "Swis721 Cn BT", Calibri, sans-serif; color: #FFF; }' +
	'html h2, html h2[class], div[class] h2 { font: 28px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }' +
	'html h3, html h3[class], div[class] h3 { font: 24px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }' +
	'html h4, html h4[class], div[class] h4 { font: 20px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }' +
	'html h5, html h5[class], div[class] h5 { font: 16px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }' +
	'html h6, html h6[class], div[class] h6 { font: 14px Verdana, sans-serif; color: #999; }' +
	'html h5, html h6 { padding: 0.5em 10px; }' +
	'dl { border-left: 20px solid #111; }' +
	'dt { color: inherit; padding: 0.5em 10px; line-height: 160%; margin: 2px 0; background: #111; border: 0; border-left: 20px solid #0C0C0C; color: #AAA; }' +
	'dd { color: inherit; padding: 0.25em 10px; line-height: 160%; margin: 2px 0; background: #141414; border: 0; border-left: 20px solid #0C0C0C; }' +
	'button, select, textarea, html input, html input[class] { border: 0; padding: 5px 10px; background: #242424; box-shadow: inset 0 0 5px #000; color: #999; line-height: 150%; -moz-appearance: none; border-radius: 0; }' +
	'html input[type="checkbox"] { width: 24px; height: 24px; background: #242424; }' +
	'button, html input[type="submit"], html input[type="button"] { box-shadow: none; background: #111; }' +
	'button:hover, button:focus, html input[type="submit"]:hover, input[type="submit"]:focus, html input[type="button"]:hover, html input[type="button"]:focus { background: #000; color: #FFF; }' +
	'input div { color: #999; }' +
	'select:focus, textarea:focus, input:focus { color: #999; outline: 0; background: #0C0C0C; }' +
	'textarea:focus *, input:focus * { color: #999; }' +

	'html a, html a:link { color: #09F; text-decoration: none; text-shadow: none; font: inherit; }' +
	'html a:visited { color: #36A; text-decoration: none; }' +
	'html a:hover, html a:focus, html a:hover *, html a:focus * { color: #FFF; text-decoration: none; outline: 0; }' +
	'html a:active { color: #FFF; outline: none; }' +
	'html .pagination a:link { font: bold 30px "swis721 cn bt"; border: 0; background: #111; padding: 10px; }' +

	'main, article, section, header, footer, hgroup, nav, ins, small, big, aside, details, font, article, form, fieldset, label, span, span[class], blockquote, div, div[class], ul, ol, li, a, i, b, strong, dl { color: inherit; background: transparent none; line-height: inherit; font-family: inherit; font-size: inherit; font-weight: inherit; text-decoration: inherit; }' +
	'ul { list-style: none; margin: 0; padding: 10px 0 10px 20px; }' +
	'li { font-size: 14px; list-style-image: none; background-image: none; line-height: 150%; }' +
	'tbody, thead, th, tr, td, table { background: #202020; color: inherit; font: 14px verdana; }' +
	'body.pad100 ul li { border-left: 5px solid #0C0C0C; padding: 0 0 0 10px; margin: 0 0 2px 0; }' +
	'cite, u, em, i, b, strong { font-weight: normal; font-style: normal; text-decoration: none; color: #CCC; font-size: inherit; }' +
	'a u, a em, a i, a b, a strong { color: inherit; }' +
	'small { font-size: 80%; }' +
	'input, input *, button, button *, div, td, p { font-size: 14px; font-family: Verdana, sans-serif; line-height: 150%; }' +
	'p { margin: 0; padding: 5px 0; font-style: normal; font-weight: normal; line-height: 150%; color: inherit; background: inherit; border: 0; }' +
	'blockquote { margin: 0 0 0 20px; padding: 10px 0 10px 20px; border-style: solid; border-width: 10px 0 0 10px; border-color: #0C0C0C; }' +
	'blockquote blockquote { margin: 0 0 0 20px; padding: 0 0 0 20px; border-width: 0 0 0 10px; }' +

	'code { background: #0C0C0C; font-family: Verdcode, Consolas, sans-serif; padding: 1px 2px; }' +
	'pre { background: #0C0C0C; border-style: solid; border-width: 0 0 0 10px; border-color: #444; padding: 10px 20px; font: 14px Verdcode; }' +
	'pre, code { color: #999; }' +
	'pre p { margin: 0; padding: 0; font: 14px Verdcode, Consolas, sans-serif; }' +

	'pre q1 { color: #57F; background: #024; }' +
	'pre q2 { color: #C7F; background: #214; }' +
	'pre c1 { font-style: normal; color: #F90; background: #331500; }' +
	'pre c2 { color: #F00; background: #400; }' +
	'pre b1 { color: #0F0; }' +
	'pre b2 { color: #FFF; }' +
	'pre b3 { color: #F90; }' +
	'pre xk { color: #29F; }' +
	'pre xh { color: #57F; }' +
	'pre xv { color: #F47; }' +

	'img { display: block; max-width: 100vh; }' +
	'a img { border: none; }' +
	'button img, input img { display: none; }' +
	'table { border-collapse: collapse; background: #141414; border: 0; }' +
	'td { vertical-align: top; border-width: 0px; }' +
	'caption, th { background: #111; border-color: #111; text-align: left; }' +
	'th, tr, tbody { border: 0; }' +
	'fieldset { border: 1px solid #111; margin: 0 0 1px 0; }' +
	'span, ul, ol, li, div { border: 0; }' +
	'hr { height: 2px; background: #111; border-style: solid; border-color: #000; border-width: 0; margin: 20px 0; }' +
	'legend { background: #181818; }' +
	'textarea, textarea div { font-family: Verdcode, Consolas, sans-serif; }' +
	'samp, mark, hl, kbd { background: #331500; color: #F90; padding: 2px 0; }' +
	'container { border: 2px solid #F00; margin: 10px; display: block; padding: 10px; }' +
	'samp a:link, mark a:link, a:link samp, a:link mark { background: #331500; color: #F90; }' +
	'samp a:visited, mark a:visited, a:visited samp, a:visited mark { color: #e68a00; }' +
	'mark a:hover, a:hover mark, samp a:hover, a:hover samp { background-color: #4d2000; color: #FFF; }' +
	'samp, mark mark { font: 24px "Swis721 Cn BT", Calibri, sans-serif; }' +
	'figure { border: 0; background: #181818; padding: 20px; }' +
	'figcaption { background: #181818; color: #888; }' +
	'ruby { margin: 10px 0; background: #000; color: #AAA; padding: 20px 40px; display: block; }' +
	'rp { margin: 10px 0; background: #181818; color: #888; padding: 40px; display: block; font: 24px "Swis721 Cn BT", Calibri, sans-serif; border-top: 50px solid #000; border-bottom: 50px solid #000; }' +
	'rt { margin: 10px 0; padding: 20px; display: block; background: #181818; }' +
	'rt:before { content: ""; display: block; width: 10px; height: 15px; border: 2px solid #AAA; float: left; margin: -3px 20px 0 0; }' +
	'body.xDontShowLinks a, body.xDontShowLinks a *, body.xDontShowLinks a:link { color: inherit; text-decoration: none; }' +
	'body.xDontShowLinks a:visited *, body.xDontShowLinks a:visited { color: inherit; text-decoration: none; }' +
	'body.xDontShowLinks a:hover *, body.xDontShowLinks a:focus *, body.xDontShowLinks a:hover, body.xDontShowLinks a:focus { color: #FFF; text-decoration: none; }' +
	'.hl { box-shadow: inset 2px 2px #F00, inset -2px -2px #F00; }' +
	'.hl2 { box-shadow: inset 2px 2px #00F, inset -2px -2px #00F; }' +
	'.hl::after, .hl2::after { content: " "; display: block; clear: both; }';

	if(important)
		insertStyle(s, "style_negative_v2", true);
	else
		insertStyle(s, "style_negative_v2");
}

function insertStyleWhite()
{
	var s = 'body, input, select, textarea { background: #FFF; color: #000; }' +
	'input, select, textarea { font: 12px verdana; }';
	insertStyle(s, "style_white", true);
}

function toggleShowClasses()
{
	del("script");
	del("link");
	var s = 'body { background: #333; color: #888; }' +
	'div::before, span::before, p::before { content:attr(class); color:#FF0; padding:0px; background:#000; }' +
	'div::after, span::after, p::after { content:attr(id); color:#0FF; padding:0px; background:#000;}' +
	'select, textarea, input { background: #444; border: 1px solid red; }' +
	'button { background: #222; color: #AAA; }';
	insertStyle(s, "style_debug", true);
}

function removeEventListeners()
{
	var db = document.body;
	var tempbody = db.cloneNode(true);
	db = tempbody;
	var elems = document.getElementsByTagName("*");
	var i = elems.length;
	while (i--)
	{
		if(elems[i].hasAttribute("onmousedown")) elems[i].removeAttribute("onmousedown");
		if(elems[i].hasAttribute("onmouseup")) elems[i].removeAttribute("onmouseup");
		if(elems[i].hasAttribute("onmouseover")) elems[i].removeAttribute("onmouseover");
		if(elems[i].hasAttribute("onclick")) elems[i].removeAttribute("onclick");
	}
}

function chooseDocumentHeading()
{
	var candidateTags = ['h1', 'h2', 'h3'], s = '', i, ii, j, jj, found = false;
	for(i = 0, ii = candidateTags.length; i < ii; i++)
	{
		e = document.getElementsByTagName(candidateTags[i]);
		for(j = 0, jj = e.length; j < jj; j++)
		{
			if(e[j].textContent && e[j].textContent.indexOf("iframe:") === -1 && normalizeString(e[j].textContent).length > 3)
			{
				s = e[j].textContent;
				found = true;
				break;
			}
		}
		if(found)
			break;
	}
	if(s.length < 3)
	{
		if(document.title)
			s = document.title;
		else
			s = window.location.hostname;
	}
	if(document.body.textContent.match(/Page [0-9]+ of [0-9]+/))
	{
		if(!s.match(/Page [0-9]+/i))
		{
			s = s + " - " + document.body.textContent.match(/Page [0-9]+ of [0-9]+/)[0];
		}
	}
	return s;
}

function replaceDiacritics(s)
{
	var s;
	var diacritics =[
		/[\300-\306]/g, /[\340-\346]/g,  // A, a
		/[\310-\313]/g, /[\350-\353]/g,  // E, e
		/[\314-\317]/g, /[\354-\357]/g,  // I, i
		/[\322-\330]/g, /[\362-\370]/g,  // O, o
		/[\331-\334]/g, /[\371-\374]/g,  // U, u
		/[\321]/g, /[\361]/g, // N, n
		/[\307]/g, /[\347]/g, // C, c
	];
	var chars = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
	for (var i = 0; i < diacritics.length; i++)
		s = s.replace(diacritics[i],chars[i]);
	return s;
}

function sanitizeTitle(str)
{
	if(str === undefined || str === null)
		return;
	s = str.toString();
	s = replaceDiacritics(s);

	s = s.replace(/&/g, " and ");
	s = s.replace(/\u00df/g, 'SS');
	s = s.replace(/\u0142/g, "'l");
	s = s.replace(/\u2018/g, "'");
	s = s.replace(/\u2019/g, "'");
	s = s.replace(/[:|\?]/g, " - ");
	s = s.replace(/[\/]/g, "-");
	s = s.replace(/[^\+\.\(\)0-9A-Za-z_!@\[\]\-\(\)'",]/g, " ");
	s = s.replace(/\s+/g, " ");

	return s;
}

function setDocTitle(s)
{
	if(s)
		xlog("setDocTitle(" + s + ")", "h6");
	var i, labels, longestlabel, h;
	deleteEmptyElements("h1");
	deleteEmptyElements("h2");
	deleteEmptyElements("h3");

	if(!s)
		s = sanitizeTitle(chooseDocumentHeading());
	else
		s = sanitizeTitle(s);

	if(s.indexOf("Thread - ") !== -1)
		s = s.substr(s.indexOf("Thread - ") + 9);

	if(!(get("h1") && get("h1")[0].innerHTML === s))
	{
		h = document.createElement('h1');
		h.appendChild(document.createTextNode(s));
		document.body.insertBefore(h, document.body.firstChild);
	}
	// Append domain name to title for easy searching
	if(location.hostname.length > 0)
	{
		var hn = location.hostname.replace(/www\./, '');
		hn = hn.replace(/\.com/, '');
		hn = hn.replace(/\.org/, '');
		hn = hn.replace(/\.net/, '');
		hn = hn.replace(/developer\./, '');
		hn = hn.replace(/\.wordpress/, '');
		hn = hn.replace(/\.blogspot/, '');
		labels = hn.split(".");
		i = labels.length;
		longestlabel = '';
		while (i--)
		{
			if(longestlabel.length < labels[i].length) longestlabel = labels[i];
		}
		if(!(s.indexOf(longestlabel) > 0))
			s += " [" + longestlabel + "]";
	}
	document.title = s;
}

function setDocTitleFromSelection()
{
	var selection = window.getSelection();
	if(selection.toString().length) s = selection;
	else s = prompt("Document title");
	setDocTitle(s);
}

function delClassContaining(s)
{
	if(s.length <= 0) return;
	var e = document.getElementsByTagName('div');
	var i = e.length;
	while(i--)
	{
		if(e[i].className && e[i].className.indexOf(s) >= 0)
		{
			//e[i].innerHTML = '';
			e[i].innerHTML = "<h2><mark>deleted: ." + e[i].className + "</mark></h2>";
		}
		else if(e[i].id && e[i].id.indexOf(s) >= 0)
		{
			//e[i].innerHTML = '';
			e[i].innerHTML = "<h2><mark>deleted: #" + e[i].id + "</mark></h2>";
		}
	}
}

function zeroPad(n)
{
	n += '';
	if(n.length < 2) n = '0' + n;
	return n;
}

function appendInfo()
{
	var url, saveTime, h, a, s;
	if(window.location.href.indexOf("file:///") >= 0) return;
	if(document.getElementsByTagName("h4").length)
	{
		var hh = document.getElementsByTagName("h4");
		if(hh[hh.length - 1].textContent.indexOf("URL:") === 0) return;
	}

	h = document.createElement("h4");
	a = document.createElement("a");
	s = window.location.toString().split("/");
	a.href = a.textContent = s[0] + "//" + s[2];
	a.textContent = "Domain: " + a.textContent;
	h.appendChild(a);
	document.body.appendChild(h);

	saveTime = getTimestamp();
	h = document.createElement("h4");
	h.appendChild(document.createTextNode("URL: "));
	a = document.createElement("a");
	url = window.location.href;
	if(url.indexOf("?utm_source") > 0)
	{
		url = url.substr(0, url.indexOf("?utm_source"));
	}
	a.textContent = a.href = url;
	h.appendChild(a);
	h.appendChild(document.createTextNode(" | "));
	h.appendChild(document.createTextNode(saveTime));
	document.body.appendChild(h);
}

function replaceFontTags()
{
	var f = document.getElementsByTagName("font"),
		replacements = [],
		h;
	for (var i = 0, ii = f.length; i < ii; i++)
	{
		if(f[i].getAttribute("size"))
		{
			var hl = f[i].getAttribute("size");
			if(hl.indexOf("+") >= 0)
			{
				hl = hl[1];
			}
			switch (hl)
			{
				case '7': h = document.createElement("h1"); break;
				case '6': h = document.createElement("h2"); break;
				case '5': h = document.createElement("h3"); break;
				case '4': h = document.createElement("h4"); break;
				case '3': h = document.createElement("h5"); break;
				case '2': h = document.createElement("p"); break;
				case '1': h = document.createElement("p"); break;
				default: h = document.createElement("p");
			}
			h.innerHTML = f[i].innerHTML;
			replacements.push(h);
		}
		else
		{
			h = document.createElement("p");
			h.innerHTML = f[i].innerHTML;
			replacements.push(h);
		}
	}
	for (i = f.length - 1; i >= 0; i--)
	{
		f[i].parentNode.replaceChild(replacements[i], f[i]);
	}
}

function removeStyleFromHighlightedElements()
{
	forAll(".hl", function (x){
		removeAttribute("style");
	});
}

function removeAttributes()
{
	var t1 = new Date();
	var x = document.getElementsByTagName('*');
	document.body.removeAttribute("background");
	for (var i = 0; i < x.length; i++)
	{
		if(x[i].attributes)
		{
			var attrs = x[i].attributes;
			for (var j = attrs.length - 1; j >= 0; j--)
			{
				switch(attrs[j].name)
				{
					case "href":
					case "src":
					case "srcset":
					case "name":
					case "colspan":
					case "rowspan":
						break;
					case "id":
						if(x[i].tagName.toLowerCase() === 'a' || x[i].tagName.toLowerCase() === 'li')
							break;
						else
							x[i].removeAttribute("id");
						break;
					default:
						x[i].removeAttribute(attrs[j].name);
						break;
				}
			}
		}
	}
	var t2 = new Date();
	xlog((t2-t1) + "ms: removeAttributes");
}

function removeAttributesOf(selector, attribute)
{
	var x = document.querySelectorAll(selector);
	for (var i = 0; i < x.length; i++)
	{
		x[i].removeAttribute(attribute);
	}
}

function removeAttributes_fast()
{
	var t1 = new Date();
	var temp, a, i, attribute, old_att;
	document.body.removeAttribute("background");
	document.body.innerHTML = document.body.innerHTML.replace(/(<[^ai][a-z0-9]*) [^>]+/gi, '$1');
	var t2 = new Date();
	xlog((t2-t1) + "ms: removeAttributes_fast");
}

function forAll(selector, callback)
{
	var e = get(selector);
	var i = e.length;
	while (i--)
		callback(e[i]);
}

function delNewlines()
{
	var paragraphs = document.getElementsByTagName("p");
	var i = paragraphs.length;
	while (i--)
	{
		var s = paragraphs[i].textContent.replace(/\s/g, '');
		if(s.length === 0 && !paragraphs[i].getElementsByTagName("img").length)
		{
			paragraphs[i].parentNode.removeChild(paragraphs[i]);
		}
	}
}

function trim(str1)
{
	return str1.replace(/^\s+/, '').replace(/\s+$/, '');
}

function ltrim(str1)
{
	return str1.replace(/^\s+/, '');
}

function normalizeWhitespace(s)
{
	s = s.replace(/\s+/g, " ");
}

function cleanupHeadings()
{
	var headings = ["h1", "h2", "h3", "h4", "h5", "h6"];
	var i = headings.length;
	while (i--)
	{
		var h = get(headings[i]);
		var j = h.length;
		while (j--)
		{
			var s = h[j].innerHTML;
			s = s.replace(/<[^as\/][a-z0-9]*>/g, " ");
			s = s.replace(/<\/[^as][a-z0-9]*>/g, " ");
			h[j].innerHTML = s.trim();
			if(trim(h[j].textContent).length === 0)
			{
				h[j].parentNode.removeChild(h[j]);
			}
		}
	}
}

function addParagraphs()
{
	var divs = get("div");
	var i = divs.length;
	while (i--)
	{
		if(divs[i].getElementsByTagName("div").length) continue;
		var s = divs[i].innerHTML;
		s = s.replace(/&nbsp;/g, ' ');
		s = s.replace(/\s+/g, '');
		if(s.length)
		{
			if(! (s[0] === '<' && s[1].toLowerCase() === "p")) divs[i].innerHTML = '<p>' + divs[i].innerHTML + '</p>';
		}
		else
		{
			divs[i].parentNode.removeChild(divs[i]);
		}
	}
}

function makeHeadings()
{
	var e, i, j, tags, s, len;
	e = get("p");
	i = e.length;
	while(i--)
	{
		s = e[i].textContent;
		s = s.replace(/\s*/g, '');
		len = s.length;
		if(len === 0)
		{
			if(!e[i].getElementsByTagName("img").length)
			{
				e[i].className = "deleteme";
				continue;
			}
		}
		else if( s.match(/[IVX\.]+/g) && s.match(/[IVX\.]+/g)[0] === s )
		{
			e[i].className = "parah2";
			continue;
		}
		else if( len < 120 && s[len-1].match(/[0-9A-Za-z]/) )
		{
			if( !(e[i+1] && e[i+1].length < 120) )
			{
				e[i].className = "parah3";
			}
		}
		// If the original page has headings as bold e, fix those
		tags = ["b", "strong", "em"];
		for (j = tags.length - 1; j >= 0; j--)
		{
			if(e[i].getElementsByTagName(tags[j]).length === 1)
			{
				if(e[i].getElementsByTagName(tags[j])[0].textContent && removeWhitespace(e[i].getElementsByTagName(tags[j])[0].textContent) === s)
				{
					e[i].className = "parah2";
				}
			}
		}
	}
	// Highlight users
	e = get("a");
	i = e.length;
	while(i--)
	{
		if(e[i].href && ( e[i].href.indexOf("profile") >= 0 || e[i].href.indexOf("member") >= 0 || e[i].href.indexOf("user") >= 0 ) )
		{
			e[i].className = "highlightthis";
		}
	}
	replaceElement(".parah2", "h2");
	replaceElement(".parah3", "h3");
	del(".deleteme");
	e = get(".highlightthis");
	i = e.length;
	while(i--)
	{
		wrapElement(e[i], "cite");
	}
}

// deletes elements that are either empty, or contain only links
function deleteNonContentElements()
{
	var e, f, g, i, j, k, kk, tags = ["ul", "ol"];
	for(k = 0, kk = tags.length; k < kk; ++k)
	{
		e = get(tags[k]);
		i = e.length;
		while (i--)
		{
			if(removeWhitespace(e[i].textContent).length === 0 && e[i].getElementsByTagName("img").length === 0)
			{
				e[i].parentNode.removeChild(e[i]);
				break;
			}
			f = e[i].getElementsByTagName("a");
			j = f.length;
			while (j--)
			{
				// if a list contains only links, it's likely not content
				if(f[j].textContent.length && f[j].getElementsByTagName("a").length === 1)
				{
					g = f[j].getElementsByTagName("a")[0];
					if(removeWhitespace(f[j].textContent).length === removeWhitespace(g.textContent).length)
					{
						e[i].parentNode.removeChild(e[i]);
						break;
					}
				}
			}
		}
	}
}

function removeWhitespace(s)
{
	return s.replace(/\s/g, '');
}

function normalizeString(s) // normalize string
{
	return removeWhitespace(s.toLowerCase());
}

function logout()
{
	// special case for Gmail
	if(location.hostname === "mail.google.com" && get("#gb_71"))
	{
		get("#gb_71").click();
		return;
	}
	var e, i, ii, newlink, found = false, s;
	e = get("a");
	i = e.length;
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].href)
		{
			s = normalizeString(e[i].href);
			if( (s.indexOf("logout") >= 0 && s.indexOf("logout_gear") === -1) || s.indexOf("signout") >= 0)
			{
				found = true;
/*				showMessage("Logging out...", "big");
				var tempLink = document.createElement("a");
				tempLink.href = tempLink.textContent = e[i].href;
				document.body.appendChild(tempLink);
				tempLink.click();*/
				showMessage(e[i].href, "messagebig");
				e[i].className += " hl";
				e[i].click();
				break;
			}
		}
		if(e[i].textContent)
		{
			s = normalizeString(e[i].textContent);
			if(s.indexOf("logout") >= 0 || s.indexOf("signout") >= 0)
			{
				found = true;
				showMessage(e[i].href, "messagebig");
				e[i].className += " hl";
				e[i].click();
				break;
			}
		}
	}
	if(!found)
	{
		e = document.querySelectorAll("input", "button");
		for(i = 0, ii = e.length; i < ii; i++)
		{
			if(e[i].value)
			{
				s = normalizeString(e[i].value);
				if(s.indexOf("logout") >= 0 || s.indexOf("signout") >= 0)
				{
					found = true;
					showMessage("Logging out...", "messagebig");
					e[i].className += " hl";
					e[i].click();
					break;
				}
			}
			else if(e[i].textContent)
			{
				s = normalizeString(e[i].textContent);
				if(s.indexOf("logout") >= 0 || s.indexOf("signout") >= 0)
				{
					found = true;
					showMessage("Logging out...", "messagebig");
					e[i].className += " hl";
					e[i].click();
					break;
				}
			}
		}

	}
	if(!found)
	{
		showMessage("Logout link not found", "messagebig");
	}
}

function showPrintLink()
{
	var e, i, newlink, found = false;
	e = get("a");
	i = e.length;
	while(i--)
	{
		if(e[i].href && removeWhitespace(e[i].href).toLowerCase().indexOf("print") >= 0)
		{
			found = true;
			newlink = document.createElement("a");
			newlink.href = e[i].href;
			newlink.textContent = 'Print';
			document.body.insertBefore(createElementWithChild("h2", newlink), document.body.firstChild);
			newlink.focus();
			break;
		}
	}
	if(!found)
	{
		showMessage("Print link not found");
	}
}

function clickHandler(e)
{
	e.stopPropagation();
	var targ;
	var ctrlOrMeta = "ctrlKey";
	if(navigator.userAgent.indexOf("Macintosh") !== -1)
		ctrlOrMeta = "metaKey";
	if(!e) e = window.event;
	if(e.target)
	{
		targ = e.target;
	}
	var tn = targ.tagName.toLowerCase();
	// Get clicked element
	if(e[ctrlOrMeta] && e.shiftKey)
	{
		document.body.innerHTML = targ.innerHTML;
		document.body.removeEventListener('mouseup', clickHandler, false);
		removeClass(document.body, "debug");
	}
	// delete clicked element
	else if(e[ctrlOrMeta] && !e.shiftKey)
	{
		if(targ.tagName.toLowerCase() === 'body') return;
		if(tn === "li" || tn === "p")
		{
			targ = targ.parentNode;
		}
		var x = document.createTextNode("");
		targ.parentNode.replaceChild(x, targ);
		return false;
	}
	// append clicked element to a div
	else if(e.shiftKey)
	{
		if(!document.getElementById("newbody"))
		{
			var newbody = document.createElement("div");
			newbody.id = "newbody";
			document.body.appendChild(newbody);
		}
		if(targ.tagName.toLowerCase() === 'body') return;
		document.getElementById("newbody").appendChild(targ);
	}
}

function parseCode(s)
{
	var t = "";
	var cur, prev, next;
	for(var i = 0, ii = s.length; i < ii;  i++)
	{
		cur = s[i];
		prev = (i > 0) ? s[i-1] : null;
		next = (i < ii-1) ? s[i+1] : null;
		switch(cur)
		{
			// double quote strings
			case '"':
				t += '<q1>"';
				i++;
				while(s[i] && s[i]!== '"')
				{
					t += s[i];
					i++;
				}
				t += '"</q1>';
				break;
			// single quote strings
			case "'":
				t += "<q2>'";
				i++;
				while(s[i] && s[i]!== "'")
				{
					t += s[i];
					i++;
				}
				t += "'</q2>";
				break;
			// comments
			case '/':
				if(prev && prev === ":") // is a URL, don't highlight
				{
					t += cur;
				}
				else if(next === '/') // single-line comment
				{
					t += "<c1>/";
					i++;
					while(s[i] && s[i].match(/[\r\n]/) === null)
					{
						t += s[i];
						i++;
					}
					t += '</c1>\r\n';
				}
				else if(next === '*') // block comment
				{
					t += '<c2>' + cur;
					i++;
					while(s[i] && !(s[i] === '*' && s[i+1] === '/'))
					{
						t += s[i];
						i++;
					}
					t += '*/</c2>';
					i++;
				}
				else
				{
					t += cur;
				}
				break;
			// PHP variables
			case '$':
				phpVarRegex = new RegExp('[a-z0-9_\-]', 'i');
				if(next && next.match(phpVarRegex) !== null)
				{
					t += '<xv>' + cur;
					i++;
					if(s[i] && s[i].match(phpVarRegex) !== null)
					{
						while(s[i] && s[i].match(phpVarRegex) !== null)
						{
							t += s[i];
							i++;
						}
						i--;
					}
					else
					{
						t += cur;
					}
					t += '</xv>';
				}
				else
				{
					t += cur;
				}
				break;
			// brackets
			case '{':
			case '}':
				t += '<b1>' + cur + '</b1>';
				break;
			case '(':
			case ')':
				t += '<b2>' + cur + '</b2>';
				break;
			case '[':
			case ']':
				t += '<b3>' + cur + '</b3>';
				break;
			// no highlighting
			default:
				t += cur;
				break;
		}
	}
	return t;
}

function highlightCode(highlightKeywords)
{
	var t1 = new Date();
	fixPres();
	restorePres();

	var tagpre = get("pre");
	var i = tagpre.length;
	while (i--)
	{
		// delete the <pre>s that only contain line numbers
		if(tagpre[i].textContent && tagpre[i].textContent.match(/[a-z]/) === null)
		{
			tagpre[i].parentNode.removeChild(tagpre[i]);
			continue;
		}

		var s = tagpre[i].innerHTML, r;
		s = s.replace(/<span[^>]*>/g, "");
		s = s.replace(/<\/span>/g, "");

		s = parseCode(s);

		// Everything between angle brackets
		s = s.replace(/(&lt;\/?[^&\r\n]+&gt;)/g, '<xh>$1</xh>');
		// php opening and closing tags
		s = s.replace(/(&lt;\?php)/g, '<b1>$1</b1>');
		s = s.replace(/(\?&gt;)/g, '<b1>$1</b1>');

		if(highlightKeywords === true)
		{
			var keyword = [
				"abstract", "addEventListener", "appendChild", "object", "prototype", "break", "byte", "case", "catch", "char", "class", "const", "continue",
				"debugger", "default", "delete", "do", "document", "documentElement", "double",
				"else", "enum", "export", "extends", "false", "final", "finally", "firstChild", "float", "for", "function",
				"getElementsByClassName", "getElementsByID", "getElementsByTagName", "goto", "if", "implements", "import", "in", "insertBefore",
				"long", "NaN", "native", "new", "null", "onclick", "onload", "onmouseover", "package", "private", "protected", "public", "querySelector", "querySelectorAll", "return",
				"src", "static", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "type", "typeof", "undefined",
				"var", "void", "volatile", "while", "with", "window", "script", "javascript", "document", "createElement", "createTextNode", "getElementsByTagName"
			];
			var j = keyword.length;
			while (j--)
			{
				r = new RegExp("\\b" + keyword[j] + "\\b", "g");
				s = s.replace(r, "<xk>" + keyword[j] + "</xk>");
			}
		}

		tagpre[i].innerHTML = s;
	}
	// un-highlight elements in comments
	forAll("c1", htmlToText);
	forAll("c2", htmlToText);
	var t2 = new Date();
	xlog(t2 - t1 + "ms: highlightCode");
}

function htmlToText(e)
{
	e.innerHTML = e.textContent;
}

function delClassOrIdContaining(classes, beginningOnly)
{
	var todel = [];
	var x = document.getElementsByTagName("div"), i, j;
	i = x.length;
	while (i--)
	{
		for (j = 0; j < classes.length; j++)
		{
			if(beginningOnly)
			{
				if(x[i].className && x[i].className.toLowerCase().indexOf(classes[j]) === 0)
				{
					todel.push(x[i]);
					xlog(x[i].className);
					break;
				}
				else if(x[i].id && x[i].id.toString().toLowerCase().indexOf(classes[j]) === 0)
				{
					todel.push(x[i]);
					xlog(x[i].id);
					break;
				}
			}
			else
			{
				if(x[i].className && x[i].className.toLowerCase().indexOf(classes[j]) >= 0)
				{
					todel.push(x[i]);
					xlog(x[i].className);
					break;
				}
				else if(x[i].id && x[i].id.toString().toLowerCase().indexOf(classes[j]) >= 0)
				{
					todel.push(x[i]);
					xlog(x[i].id);
					break;
				}
			}
		}
	}
	i = todel.length;
	while(i--)
		todel[i].className += ' hl';
}

function getElementsWithClass(strClass)
{
	var s = "", found = 0, f;
	if(!strClass || strClass.length === 0)
		return;
	if(strClass.indexOf(".") !== 0)
		strClass = "." + strClass;
	f = get(strClass);
	tempNode = document.createElement("div");
	tempNode.id = "replacerDiv";
	if(f && f.length)
	{
		for(i = 0; i < f.length; i++)
			tempNode.appendChild(f[i].cloneNode(true));
		document.body.innerHTML = tempNode.innerHTML;
	}
	else if(f)
	{
		document.body.innerHTML = "";
		document.body.appendChild(f.cloneNode(true), document.body.firstChild);
	}
	else
	{
		showMessage(strClass + " not found", "messagebig");
	}
}

function getElementsContainingText()
{
	var s, t, i, ii;
	s = prompt("Get Elements");
	if(s !== "img")
		t = prompt("Containing text");
	if(!s.length)
		return;
	var e = document.querySelectorAll(s);
	if(t && t.length)
	{
		for(i = 0, ii = e.length; i < ii; i++)
		{
			if(e[i].textContent && e[i].textContent.indexOf(t) !== -1 /*&& e[i].getElementsByTagName(s).length === 0*/)
				e[i].className += " toget";
		}
	}
	else
	{
		for(i = 0, ii = e.length; i < ii; i++)
		{
			e[i].className += " toget";
		}

	}
	if(get(".toget").length)
		getElementsWithClass("toget");
	else
		showMessage("Not found", "messagebig");
}

function deleteNonContentDivs()
{
	if(get(".hl").length)
	{
		del(".hl");
		cleanupGeneral();
		document.body.className = "pad100 xwrap";
		return;
	}
	var sClass = "toget", e, f, i, j, tag;

	replaceElement("article", "div");
	deleteNonContentElements();
	deleteNonContentImages();
	deleteEmptyElements("p");
	deleteEmptyElements("div");

	// tags which are used to mark content divs
	// if a div contains any of these tags, we want to retain it
	tag = ["p", "img", "h1", "h2", "pre", "ol", "cite"];
	j = tag.length;
	while(j--)
	{
		e = get(tag[j]);
		for(i = 0, ii = e.length; i < ii; i++)
		{
			if(e[i].parentNode)
				e[i].parentNode.className = sClass;
		}
	}
	// if the <body> has a .toget class, it will be appended to the existing <body>
	document.body.className = '';

	// marked elements that are children of other marked divs need to be unmarked, or we'll have duplication
/*	e = get("." + sClass);
	for(i = 0; i < e.length; i++)
	{
		f = e[i].getElementsByClassName(sClass);
		j = f.length;
		while(j--)
		{
			f[j].className = '';
		}
		e = get("." + sClass);
	}
	getElementsWithClass(sClass);
	del(["link", "style", "script", "form", "fieldset", "input", "select", "textarea"]);
*/
	e = get("div");
	i = e.length;
	while(i--)
	{
		if(e[i].className.indexOf(sClass) === -1 && !e[i].getElementsByClassName(sClass).length)
			e[i].className = "hl";
	}
	//cleanupGeneral();
	//showTextToHTMLRatio();
}

function getContentByParagraphCount()
{
	if(get(".hl").length)
	{
		getElementsWithClass("hl");
		cleanupGeneral();
		document.body.className = "pad100";
		return;
	}
	//del(["link", "style"]);
	//insertStyleNegative();
	//document.body.className = "pad100 xwrap";
	insertStyleHighlight();
	var e, f, i, np, lastnp;
	e = document.querySelectorAll("div, article, main, section");
	i = e.length;
	lastnp = 0;
	while(i--)
	{
		np = e[i].getElementsByTagName("p").length;
		e[i].setAttribute("data-pcount", np);
		if(np > lastnp)
			lastnp = np;
	}
	showMessage("Highest paragraph count is " + lastnp);
	if(lastnp === 0)
	{
		xlog("No <p>s found", "h3", true);
		return;
	}
	//e = document.querySelectorAll("div, article, main, section");
	i = e.length;
	while(i--)
	{
		np = parseInt(e[i].getAttribute("data-pcount"), 10);
		if(np === lastnp)
		{
			e[i].className = "hl";
			break;
		}
	}
	e = document.querySelectorAll("h1, h2");
	i = e.length;
	while(i--)
	{
		e[i].className = "hl";
	}
	e = document.querySelectorAll(".hl h1, .hl h2");
	i = e.length;
	while(i--)
		e[i].className = "";
}

function deleteSpecificEmptyElements()
{
	deleteEmptyElements("a");
	deleteEmptyElements("p");
	deleteEmptyElements("tr");
	deleteEmptyElements("li");
	deleteEmptyElements("div");
	deleteEmptyElements("figure");
	deleteEmptyHeadings();
}

function deleteEmptyElements(tag)
{
	var e = document.getElementsByTagName(tag);
	var i = e.length;
	while(i--)
	{
		if( e[i].textContent )
		{
			if( removeWhitespace(e[i].textContent).length === 0 && !e[i].getElementsByTagName("img").length )
				e[i].parentNode.removeChild(e[i]);
		}
		else
		{
			if( !e[i].getElementsByTagName("img").length)
				e[i].parentNode.removeChild(e[i]);
		}
	}
}

function deleteEmptyHeadings()
{
	var e, i, j, tags = ["h1", "h2", "h3", "h4", "h5", "h6"];
	for (j = tags.length - 1; j >= 0; j--)
	{
		e = document.getElementsByTagName(tags[j]);
		i = e.length;
		while (i--)
		{
			if(e[i].textContent)
			{
				if(removeWhitespace(e[i].textContent).length === 0)
					e[i].parentNode.removeChild(e[i]);
			}
			else
			{
				e[i].parentNode.removeChild(e[i]);
			}
		}
	}
}

function escapeForRegExp(str)
{
	var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g");
	return str.replace(specials, "\\$&");
}

function getSelectionHTML()
{
	if(window.getSelection)
	{
		var userSelection = window.getSelection();
		if(userSelection.getRangeAt)
		{
			var range = userSelection.getRangeAt(0);
		}
		else
		{
			range = document.createRange();
			range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
			range.setEnd(userSelection.focusNode, userSelection.focusOffset);
		}
		// And the HTML:
		var clonedSelection = range.cloneContents();
		var div = document.createElement('div');
		div.appendChild(clonedSelection);
		return div.innerHTML;
	}
	else if(document.selection)
	{
		// Explorer selection, return the HTML
		userSelection = document.selection.createRange();
		return userSelection.htmlText;
	}
	else
	{
		return '';
	}
}

function removeLineBreaks(s)
{
	s = s.replace(/\r\n/g, " ");
	s = s.replace(/\r/g, " ");
	s = s.replace(/\n/g, " ");
	s = s.replace(/\s+/g, " ");
	return s;
}

function highlightSelection()
{
	var selection, selectionBegin, selectionEnd, node, nodeHTML, i, j, k, index1, index2, index3, index4;
	var textBeforeSelection, textOfSelection, textAfterSelection, words;
	if(!window.getSelection().toString().length) return;
	selection = window.getSelection();
	node = selection.anchorNode;
	while (node.nodeType != 1 && node.parentNode)
		node = node.parentNode;
	if(node.tagName === undefined)
	{
		ylog("Couldn't get anchorNode", "h1");
		return;
	}
	if(!node) return;
	selection = removeLineBreaks(selection.toString());
	nodeHTML = node.innerHTML;
	nodeHTML = removeLineBreaks(nodeHTML);
	if(selection.length)
	{
		// Simplest case - it's all plain text
		if( ( index1 = nodeHTML.indexOf(selection) ) >= 0 )
		{
			index2 = index1 + selection.length;
			// expand to word boundaries
			while(nodeHTML[index1].match(/[^ <>]/) && index1 > 0)
				index1--;
			while(nodeHTML[index2] && nodeHTML[index2].match(/[^ <>]/) && index2 < nodeHTML.length )
				index2++;
			if(nodeHTML.length - index2 < 10)
				index2 = nodeHTML.length;
			if(index1 > 0)
				textBeforeSelection = nodeHTML.substr(0, index1);
			else
				textBeforeSelection = "";
			textOfSelection = nodeHTML.substr(index1, index2 - index1);
			textAfterSelection = nodeHTML.substr(index2);

			xlog("before: " + textBeforeSelection);
			xlog("of: " + textOfSelection);
			xlog("after: " + textAfterSelection);

			nodeHTML = textBeforeSelection + "<mark>" + textOfSelection + "</mark>" + textAfterSelection;
			node.innerHTML = nodeHTML;
			return;
		}
		else
		// we have HTML in the selection
		{
			xlog("HTML in selection");
			selectionBegin = selection;
			while(nodeHTML.indexOf(selectionBegin) < 0 && selectionBegin.length > 0 )
			{
				selectionBegin = selectionBegin.substr(0, selectionBegin.length-1);
			}
			j = selection.length-1;
			selectionEnd = selection.substr(-1*j);
			while(nodeHTML.indexOf(selectionEnd) < 0 && selectionEnd.length > 0 )
			{
				j--;
				selectionEnd = selectionEnd.substr(-1*j);
			}
			xlog("begin: " + selectionBegin);
			xlog("end: " + selectionEnd);
			index3 = nodeHTML.indexOf(selectionBegin);
			index4 = nodeHTML.indexOf(selectionEnd) + selectionEnd.length;
			if(index3 && index3 >= 0 && index4 && index4 >= 0)
			{
				while(nodeHTML[index3].match(/[^<> ]/) && index3 > 0)
				{
					xlog(nodeHTML.substr(index3));
					index3--;
				}
				while(nodeHTML[index4] && nodeHTML[index4].match(/[^<> ]/) && index4 < nodeHTML.length )
				{
					xlog(nodeHTML.substr(index4));
					index4++;
				}
				index3++;
				index4--;
				if(nodeHTML.length - index4 < 10)
					index4 = nodeHTML.length;
				if(index3 > 0)
					textBeforeSelection = nodeHTML.substr(0, index3);
				else
					textBeforeSelection = "";
				textOfSelection = nodeHTML.substr(index3, index4 - index3);
				textAfterSelection = nodeHTML.substr(index4);

				xlog("before: " + textBeforeSelection);
				xlog("of: " + textOfSelection);
				xlog("after: " + textAfterSelection);

				nodeHTML = textBeforeSelection + "<mark>" + textOfSelection + "</mark>" + textAfterSelection;
				node.innerHTML = nodeHTML;
				return;
			}
		}
	}
}

function fixHeadings()
{
	fixParagraphs();
	makeHeadings();
	cleanupHeadings();
}

function fixPres()
{
	replaceElement('font', 'span');
	var e, i, ii, s, temp;
	e = get("code");
	i = e.length;
	while(i--)
	{
		if(e[i].innerHTML.toLowerCase().indexOf("<br>") !== -1)
		{
			temp = document.createElement("pre");
			temp.innerHTML = e[i].innerHTML;
			e[i].parentNode.replaceChild(temp, e[i]);
		}
	}
	e = get("pre");
	i = e.length;
	while(i--)
	{
		// Remove any HTML code within the PREs
		s = e[i].innerHTML;
		s = s.replace(/&nbsp;/g, " ");
		s = s.replace(/<\/div>/g, "\r\n");
		s = s.replace(/<\/p>/g, "\r\n");
		//s = s.replace(/<br[^>]*>/g, "\r\n");
		s = s.replace(/<br>/g, "\r\n");
		s = s.replace(/<br\/>/g, "\r\n");
		s = s.replace(/<br \/>/g, "\r\n");
		s = s.replace(/<[^<>]+>/g, "");
		// Calculate spaces per tab
		 if(s.match("\n  [^ ]")) {
			s = s.replace(/  /g, "GYZYtab");
		} else if(s.match("\n   [^ ]")) {
			s = s.replace(/   /g, "GYZYtab");
		} else if(s.match("\n    [^ ]")) {
			s = s.replace(/    /g, "GYZYtab");
		} else {
			s = s.replace(/    /g, "GYZYtab");
		}
		s = s.replace(/\t/g, "GYZYtab");
		s = s.replace(/\r\n/g, "GYZYnl");
		s = s.replace(/\n/g, "GYZYnl");
		e[i].innerHTML = s;
	}
}

function restorePres()
{
	var e, i, ii;
	e = get("pre");
	for( i = 0, ii = e.length; i < ii; i++ )
	{
		e[i].innerHTML = e[i].innerHTML.replace(/GYZYtab/g, "\t");
		e[i].innerHTML = e[i].innerHTML.replace(/GYZYnl/g, "\n");
		e[i].innerHTML = e[i].innerHTML.replace(/\n+/g, "\n");
	}
}

function fixParagraphs()
{
	fixPres();
	addParagraphs();
	var s = document.body.innerHTML;
	s = s.replace(/\s*<br>\s*/g, "<br>");
	s = s.replace(/<br>([a-z])/g, " $1");
	s = s.replace(/\s*<p>\s*/g, "<p>");
	s = s.replace(/\s*<\/p>\s*/g, "</p>");
	s = s.replace(/([a-z\-0-9])<\/p>\s*<p>([A-Za-z])/g, "$1 $2");
	s = s.replace(/<br>/g, "</p><p>");
	s = s.replace(/&nbsp;/g, " ");
	s = s.replace(/\s+/g, " ");
	//s = s.replace(/<p>\s*<\/p>/g, "");
	//s = s.replace(/<\/p>\s*<p>/g, "</p>\r\n<p>");
	s = s.replace(/<p/g, "\r\n<p");
	s = s.replace(/<div/g, "\r\n<div");
	document.body.innerHTML = s;
	restorePres();
	deleteEmptyElements("p");
	cleanupHeadings();
}

function deleteSignatures()
{
	var e, i, j, tag = ["div", "td"];
	j = tag.length;
	while(j--)
	{
		e = get(tag[j]), i = e.length;
		while(i--)
		{
			if(e[i].innerHTML.indexOf("________") >= 0 && !e[i].getElementsByTagName(tag[j]).length)
			{
				e[i].innerHTML = e[i].innerHTML.substr(0, e[i].innerHTML.indexOf("________")-1);
			}
		}
	}
}

function deleteElementsContainingText(selector, str)
{
	var t1 = new Date();
	var elems, textContained;

	if(!(selector && str))
	{
		elems = prompt("Delete elements containing text");
		if(elems !== "img")
			textContained = prompt("Containing text");
		else
			textContained = "";
		if(elems.length)
		{
			var arr = [textContained];
			deleteElementsContainingText(elems, arr);
		}
		return;
	}

	var e = get(selector);
	xlog("deleteElementsContainingText(" + selector + ", \"" + str + "\")");
	if(!e)
		return;
	if(e.length)
	{
		var i = e.length;
		xlog("Deleting " + i + ' ' + selector + ' elements');
		while (i--)
		{
			if(e[i].querySelector(selector))
			{
				continue;
			}
			if(str)
			{
				if(e[i].textContent.indexOf(str) >= 0)
					e[i].parentNode.removeChild(e[i]);
			}
			else
			{
				e[i].parentNode.removeChild(e[i]);
			}
		}
	}
	else if(e.parentNode)
	{
		e.parentNode.removeChild(e);
	}
	var t2 = new Date();
	xlog(t2 - t1 + "ms: deleteElementsContainingText(" + selector + ', "' + str + '")');
}

function highlightSpecificNodesContaining()
{
	showMessage("Highlight specific nodes containing text", "messagebig");
	var s = prompt("Find text");
	if(!(s && s.length))
		return;
	var tagNames = ["p", "h1", "h2", "h3", "td", "li"];
	for(var i = 0, ii = tagNames.length; i < ii; i++)
	{
		highlightNodesContaining(tagNames[i], s);
	}
}

function highlightNodesContaining(selector, str)
{
	if(!arguments.length)
	{
		selector = prompt("highlightNodesContaining\nEnter selector");
		if(!selector.length) return;
		str = prompt("Containing text");
		if(!str.length) return;
	}
	var e = document.querySelectorAll(selector);
	var i = e.length;
	while (i--)
	{
		if(e[i].querySelectorAll(selector).length)
			continue;
		if(e[i].textContent.indexOf(str) !== -1)
		{
			e[i].className += " hl";
			e[i].innerHTML = "<mark>" + e[i].innerHTML + "</mark>";
		}
		if(selector.toLowerCase() === "a")
		{
			if(e[i].href && e[i].href.indexOf(str) >= 0)
			{
				e[i].className += " hl";
				e[i].innerHTML = "<mark>" + e[i].innerHTML + "</mark>";
			}
		}
	}
}

function highlightLinksWithHrefContaining(str)
{
	var wrapper;
	if(!arguments.length)
	{
		str = prompt("Containing text");
		if( !str.length ) return;
	}
	var e = document.getElementsByTagName("a");
	var i = e.length;
	while (i--)
	{
		if(e[i].href.indexOf(str) >= 0)
		{
			e[i].innerHTML = "<mark>" + e[i].innerHTML + "</mark>";
		}
	}
}

function getLinksWithHrefContaining(str)
{
	if(!arguments.length)
	{
		str = prompt("Containing text");
		if( !str.length ) return;
	}
	highlightLinksWithHrefContaining(str);
	var newLink, newLinkWrapper;
	var e = document.getElementsByTagName("a"), i, ii;
	var container = document.createElement("div");
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].href.indexOf(str) >= 0 || (e[i].title && e[i].title.indexOf(str) >= 0))
		{
			// ylog(e[i], "h6", true);
			newLink = document.createElement("a");
			newLink.href = newLink.textContent = e[i].href;
			newLinkWrapper = document.createElement("h6");
			newLinkWrapper.appendChild(newLink);
			container.appendChild(newLinkWrapper);
		}
	}
	document.body.insertBefore(container, document.body.firstChild);
}

function xlog(str, logTag)
{
	var tag;
	if(logTag && logTag.length)
		tag = logTag;
	else
		tag = "h6";
	Nimbus.logString += '<' + tag + ' class="xlog">' + str + '</' + tag + '>\r\n';
}

function ylog(str, elem, prepend)
{
	if(elem) var d = document.createElement(elem);
	else d = document.createElement("h6");
	d.className = "xlog";
	d.innerHTML = str;
	if(prepend)
		document.body.insertBefore(d, document.body.firstChild);
	else
		document.body.appendChild(d);
}

function log2(str)
{
	var d = document.createElement("h2");
	d.className = "xlog";
	d.innerHTML = str;
	document.body.appendChild(d);
}

function insertElem(elem, str, classname)
{
	var d = document.createElement(elem);
	d.innerHTML = str;
	if(classname)
	{
		d.className = classname;
	}
	document.body.insertBefore(d, document.body.firstChild);
}

function getPager(div)
{
	var e = document.getElementsByTagName("td");
	var elen = e.length;
	for (var j = 0; j < elen; j++)
	{
		if(e[j] && e[j].textContent && removeWhitespace(e[j].textContent).indexOf("Page") === 0)
		{
			if(e[j].parentNode)
			{
				var node = e[j].parentNode;
				while (node.tagName !== "TABLE")
					node = node.parentNode;
				var h = document.createElement("h1");
				h.appendChild(document.createTextNode("pager"));
				div.appendChild(h);
				div.appendChild(node);
				return;
			}
		}
	}
}

function getContentDivs(classes)
{
	var toget = [];
	var x = document.getElementsByTagName("div"), i, j;
	i = x.length;
	while (i--)
	{
		for (j = 0; j < classes.length; j++)
		{
			//xlog("testing for classes containing " + classes[j]);
			if(x[i].className && x[i].className.toLowerCase().indexOf(classes[j]) >= 0)
			{
				x[i].className += " hl";
				xlog('Getting: ' + x[i].className);
				break;
			}
			else if(x[i].id && x[i].id.toLowerCase().indexOf(classes[j]) >= 0)
			{
				x[i].className += " hl";
				xlog('Getting: ' + x[i].id);
				break;
			}
		}
	}
}

function getContent(str)
{
	s = str || "#content";
	del(["aside", "footer"]);
	if(get(s))
		document.body.innerHTML = get(s).innerHTML;
	else
		ylog(s + " not found", "h3", true);
}

function deleteImagesBySrcContaining(str)
{
	var elems = document.getElementsByTagName("img");
	var i = elems.length;
	while (i--)
	{
		if(elems[i].src.indexOf(str) >= 0)
		{
			xlog("Deleting image with src " + elems[i].src);
			elems[i].parentNode.removeChild(elems[i]);
		}
	}
}

function create(selector, html)
{
	var tag = '', idname = '', classname = '';
	if(selector.indexOf("#"))
	{
		tag = selector.split("#")[0];
		idname = selector.split("#")[1];
	}
	else if(selector.indexOf("."))
	{
		tag = selector.split(".")[0];
		classname = selector.split(".")[1];
	}
	else
	{
		tag = selector;
	}
	var e = document.createElement(tag);
	if(idname.length) e.id = idname;
	else if(classname.length) e.className = classname;
	if(html.length) e.innerHTML = html;
	return e;
}

function removeEmptyIframes()
{
	var iframes = document.getElementsByTagName("iframe");
	var i = iframes.length;
	while (i--)
	{
		if(iframes[i].contentDocument.body && iframes[i].contentDocument.body.textContent.length === 0)
			iframes[i].parentNode.removeChild(iframes[i]);
	}
}

function cleanupWikipedia()
{
	cleanupHead();
	document.title = document.getElementsByTagName("h1")[0].textContent;
	document.getElementsByTagName("h1")[0].textContent = document.title;
	del([
		"iframe",
		"script",
		"object",
		"embed",
		"link",
		"#siteNotice",
		"#contentSub",
		"#jump-to-nav",
		"#catlinks",
		"#toctitle",
		"#section_SpokenWikipedia",
		"#footer",
		"#column-one",
		".noprint",
		".rellink",
		".editsection",
		".metadata",
		".internal",
		".dablink",
		".messagebox",
		"#mw-articlefeedback",
		"form",
		"#mw-navigation",
		".mw-editsection"
	]);
	document.body.className = "pad100";
}

function insertLink(linktext, linkhref)
{
	var e = document.createElement("a");
	e.href = linkhref;
	e.innerHTML = "<h6>" + linktext + "</h6>";
	document.body.appendChild(e);
}

function getKeys(obj)
{
	var keys = [], key;
	for (key in obj)
	{
		if(obj.hasOwnProperty && obj.hasOwnProperty(key))
		{
			keys.push(key);
		}
	}
	return keys;
}

function getAttributes(targ)
{
	var d = document, divText = document.createElement('div');
	if(targ.tagName)
		divText.innerHTML = "\r\n<b>" + targ.tagName.toLowerCase() + "</b>";
	if(targ.attributes)
	{
		var ta = targ.attributes;
		var str = ' ';
		for (var i = 0; i < ta.length; i++)
		{
			if(ta[i])
			{
				str += "<em>" + ta[i].name + "</em> ";
				if(removeWhitespace(ta[i].value) != "hovered")
				{
					str += '=\"' + ta[i].value + '\" ';
					str = str.replace(/hovered/g, '');
				}
				else
				{
					/*str = '';*/
				}
			}
		}
		divText.innerHTML += str;
		str = '';
		var k = getKeys(targ);
		for (i = 0; i < k.length; i++)
		{
			if(k[i] !== 'addEventListener') str += k[i] + ' ';
		}
		var events = document.createElement('em');
		events.appendChild(document.createTextNode(str));
		divText.appendChild(events);
		var analyzerdiv = document.getElementById("analyzer");
		analyzerdiv.appendChild(divText);
	}
}

function analyze_removeOldHover()
{
	var elem = document.getElementsByClassName('hovered');
	for (var i = 0; i < elem.length; i++)
		removeClass(elem[i], 'hovered');
}

function analyze_mouseoverHandler(e)
{
	var b = document.getElementById("analyzer");
	b.innerHTML = '';
	b.appendChild(document.createTextNode(''));
	e.stopPropagation();
	var targ;
	// if(!e) e = window.event;
	if(e.target)
	{
		targ = e.target;
		analyze_removeOldHover();
		targ.className += ' hovered';
		while (targ)
		{
			getAttributes(targ);
			targ = targ.parentNode;
		}
	}
	else
	{
		ylog("couldn't get e.target");
	}
}

function cleanupUnicode()
{
	var s = document.body.innerHTML;
	s = s.replace(/\u00e2\u20ac\u0022/g, '"');
	s = s.replace(/\u00e2\u20ac\u2122/g, "'");
	s = s.replace(/\u00e2\u20ac\u00a6/g, "...");
	s = s.replace(/\u00e2\u20ac\u201d/g, "&mdash;");
	s = s.replace(/\u00e2\u20ac\u009d/g, '"');
	s = s.replace(/\u00e2\u20ac\u0153/g, '"');
	s = s.replace(/\u00e2\u20ac\u00a6/g, '"');
	s = s.replace(/\u00e2\u20ac\u02dc/g, "'");

	s = s.replace(/\u00c2/g, " ");
	s = s.replace(/\u00c4\u00fa/g, '"');
	s = s.replace(/\u00c4\u00f9/g, '"');
	s = s.replace(/\u00c4\u00f4/g, "'");
	s = s.replace(/\u00e2\u20ac/g, '"');
	s = s.replace(/\u00c3\u00a9/g, "&eacute;");
	s = s.replace(/\ufffd/g, "&mdash;");
	s = s.replace(/\u00cb\u0153/g, "'");
	s = s.replace(/\u0142/g, "'l");

	s = s.replace(/\s+/g, " ");
	document.body.innerHTML = s;
}

function analyze(onTop)
{
	if(!get("#analyzer"))
	{
		var b = document.createElement("div");
		b.id = "analyzer";
		if(onTop)
			b.className = "onTop";
		document.body.insertBefore(b, document.body.firstChild);
		document.body.addEventListener('mouseover', analyze_mouseoverHandler, false);
		document.body.addEventListener('click', analyze_clickHandler, false);
		document.body.className += ' analyzer';

		var s = 'body.analyzer { padding-bottom: 300px; }' +
		'#analyzer { padding: 5px 10px; position:fixed; left:0; bottom: 0; width: 50%; min-width: 500px; height: 200px; overflow: hidden; background:#000; color:#aaa; text-align:left; z-index: 2000000000; font:12px verdana; letter-spacing: 0; }' +
		'#analyzer.onTop { bottom: auto; top: 0; }' +
		'#analyzer b { color:#09f; }' +
		'#analyzer em { font-style:normal; color:#F80; }' +
		'.hovered { background: rgba(0, 0, 0, 0.5); color: #FFF; }' +
		'div#analyzer { box-shadow: none; min-height: 200px; margin: 0; }' +
		'#analyzer div { box-shadow: none; margin: 0; padding: 0; }';

		insertStyle(s, "analyzer-style", true);
	}
	else
	{
		document.body.removeEventListener('mouseover', analyze_mouseoverHandler, false);
		document.body.removeEventListener('click', analyze_clickHandler, false);
		del('#analyzer');
		del('#analyzer-style');
		removeClass(document.body, "analyzer");
		analyze_removeOldHover();
	}
}

function analyze_clickHandler(e)
{
	e.stopPropagation();
	var targ;
	if(!e)
		e = window.event;
	if(e.target)
		targ = e.target;
	if(e.shiftKey && get("#analyzer"))
		prompt("", get("#analyzer").textContent);
}

function wrapElement(obj, tag)
{
	var wrapper = document.createElement(tag);
	wrapper.appendChild(obj.cloneNode(true));
	if(obj.parentNode  && obj.parentNode.tagName.toLowerCase() !== tag)
		obj.parentNode.replaceChild(wrapper, obj);
}

function replaceWrongHeading()
{
	var heading1, heading2, heading1link, temp;
	if(get("h1"))
	{
		heading1 = get("h1")[0];
		heading1link = heading1.getElementsByTagName("a")[0];
		if(heading1link)
		{
			if((heading1link.href === "http://" + location.hostname + "/") || (heading1link.href === "https://" + location.hostname + "/"))
			{
				temp = document.createElement("h3");
				temp.innerHTML = heading1.innerHTML;
				heading1.parentNode.replaceChild(temp, heading1);
			}
		}
		// blogs will often have the blog title as the first h1, which is useless
		if(get("h1").length > 1)
		{
			heading1 = get("h1")[0];
			heading2 = get("h1")[1];
			if(heading1.textContent && heading2.textContent)
			{
				if(trim(normalizeString(heading2.textContent)).length > trim(normalizeString(heading1.textContent)).length)
				{
					temp = document.createElement("h3");
					temp.innerHTML = heading1.innerHTML;
					heading1.parentNode.replaceChild(temp, heading1);
				}
			}
		}
	}
}

function focusFormElement()
{
	var inputs, len, i, ii, found, e = [];
	inputs = get("input");
	len = inputs.length;
	if(len === 1)
	{
		inputs[0].focus();
		return;
	}
	for (i = 0; i < len; i++)
	{
		if(inputs[i].name && inputs[i].name === "q")
		{
			inputs[i].focus();
			return;
		}
		if(inputs[i].type)
		{
			if(!isInArray(inputs[i].type, ["hidden", "submit", "reset", "button", "radio", "checkbox", "image"]))
				e.push(inputs[i]);
		}
		else
		{
			e.push(inputs[i]);
		}
	}
	found = false;
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(/*e[i] === document.activeElement || */e[i].className.indexOf("focused") !== -1)
		{
			removeClass(e[i], "focused");
			found = true;
			if(i < ii-1)
			{
				e[i+1].focus();
				e[i+1].className += " focused";
				showMessage(e[i].name);
			}
			else
			{
				e[0].focus();
				e[0].className += " focused";
				showMessage(e[i].name);
			}
			break;
		}
	}
	if(!found)
	{
		e[0].focus();
		e[0].className += " focused";
		showMessage("did not find active field, focusing " + inputs[i].name);
	}
}

function focusButton()
{
	var inputs, len, i, ii, found, inputfields = [];
	inputs = get("input");
	len = inputs.length;
	if(len === 1)
	{
		inputs[0].focus();
		inputs[0].clear();
		return;
	}
	for (i = 0; i < len; i++)
	{
		if(inputs[i].type && (inputs[i].type === "button" || inputs[i].type === "submit"))
		{
			inputfields.push(inputs[i]);
		}
	}
	found = false;
	for(i = 0, ii = inputfields.length; i < ii; i++)
	{
		if(inputfields[i] === document.activeElement)
		{
			found = true;
			if(i < ii-1)
				inputfields[i+1].focus();
			else
				inputfields[0].focus();
			break;
		}
	}
	if(!found)
		inputfields[0].focus();
}

function highlightText(s)
{
	if(!s)
	{
		s = prompt("Text to highlight");
	}
	var ss = "\\b" + escapeForRegExp(s) + "\\b";
	var tempHTML = document.body.innerHTML;
	var r = new RegExp("(>[^<>]*)" + ss + "([^<>]*<)", "gi");
	tempHTML = tempHTML.replace(r, "$1<samp>" + s + "</samp>$2");
	document.body.innerHTML = tempHTML;
}

function showLog(prepend)
{
	var logDiv;
	if(Nimbus.logString.length > 0)
	{
		logDiv = document.createElement("log");
		logDiv.innerHTML = Nimbus.logString;
		if(prepend === true)
			document.body.insertBefore(logDiv, document.body.firstChild);
		else
			document.body.appendChild(logDiv);
		Nimbus.logString = "";
	}
	else
	{
		ylog("No logs");
	}
}

function highlightLinksInPres()
{
	fixPres();
	restorePres();
	var e = get("pre"), i, ii;
	for ( i = 0, ii = e.length; i < ii; i++ )
	{
		if( e[i].textContent.match(/http[s]*:\/\/[^\s\r\n]+/g) )
		{
			e[i].innerHTML = e[i].innerHTML.replace(/(http[s]*:\/\/[^\s\r\n]+)/g, '<a href="' + "$1" + '">' + "$1" + '</a>');
		}
	}
}

function fillForms()
{
	var i, e;
	//
	//	Inputs
	//
	e = get("input");
	i = e.length;
	while(i--)
	{
		if(e[i].hasAttribute("type"))
		{
			inputType = e[i].type;
			if(inputType !== "button" && inputType !== "submit" && inputType !== "image" && inputType !== "hidden" && inputType !== "checkbox" && inputType !== "radio")
			{
				inputName = e[i].getAttribute("name");
				if(inputName)
				{
					if(inputName === "companyname") e[i].value = "";
					else if(inputName.indexOf("first") >= 0) e[i].value = "John";
					else if(inputName.indexOf("last") >= 0) e[i].value = "Doe";
					else if(inputName.indexOf("name") >= 0) e[i].value = "John Doe";
					else if(inputName.indexOf("email") >= 0) e[i].value = "test@test.com";
					else if(inputName.indexOf("phone") >= 0) e[i].value = "(00) 0000 0000";
					else if(inputName.indexOf("mobile") >= 0) e[i].value = "0400222333";
					else if(inputName.indexOf("date") >= 0) e[i].value = "23/08/1991";
					else if(inputName.indexOf("suburb") >= 0) e[i].value = "Melbourne";
					else if(inputName.indexOf("postcode") >= 0) e[i].value = "3000";
					else if(inputName.indexOf("state") >= 0) e[i].value = "VIC";
					else if(inputType === "number") e[i].value = 42;
					else if(inputType === "text") e[i].value = e[i].name.replace(/_/g, ' ');
					else if(inputType === "checkbox") e[i].checked = true;
					else if(inputType === "radio") e[i].checked = true;
					else if(inputType !== 'file') e[i].value = inputName.replace(/_/g, ' ');
				}
			}
		}
	}

	//
	//	Textareas
	//
	e = get("textarea");
	i = e.length;
	while(i--)
	{
		e[i].value = "Line 1\r\nLine 2";
	}

	//
	//	Selects
	//
	e = get("select");
	i = e.length;
	while(i--)
	{
		var f = e[i].getElementsByTagName("option");
		for(var j = 0, jj = f.length; j < jj; j++)
		{
			f[j].removeAttribute("selected");
		}
		f[j-1].setAttribute("selected", "selected");
	}

	//
	//	Focus submit button
	//
	e = document.getElementsByTagName("input");
	i = e.length;
	while(i--)
	{
		if(e[i].getAttribute("type") === "submit")
		{
			e[i].focus();
			break;
		}
	}
}

function createElementWithChild(tag, obj)
{
	var e = document.createElement(tag);
	e.appendChild(obj);
	return e;
}

function createElementWithText(tag, str)
{
	var e = document.createElement(tag);
	if(e) e.textContent = str;
	return e;
}

function appendIframes()
{
	var e = get("iframe"), i, s = '';
	for(i = 0, ii = e.length; i < ii; i++)
		s += e[i].contentDocument.getElementsByTagName("body")[0].innerHTML;
	document.body.innerHTML += s;
}

function showTextToHTMLRatio()
{
	var e, i, t, h;
	e = get("div");
	i = e.length;
	while(i--)
	{
		t = e[i].textContent;
		h = e[i].innerHTML;
		if(t && h)
		{
			e[i].innerHTML = "<mark>" + t.length/h.length + "</mark>" + e[i].innerHTML;
		}
	}
}

function fixForums()
{
	var t1 = new Date();
	var e, i;
	if(!document.body)
		return;
	e = get("div");
	i = e.length;
	while(i--)
	{
		if(e[i].className && e[i].className.toLowerCase().indexOf("quote") !== -1)
		{
			e[i].innerHTML = '<blockquote>' + e[i].innerHTML + '</blockquote>';
		}
	}

	// highlight usernames
/*	e = get("a");
	i = e.length;
	while(i--)
	{
		if(e[i].href.indexOf("/u/") !== -1)
			e[i].className += " hl";
		else if(e[i].className && e[i].className.indexOf("author") !== -1)
			e[i].className += " hl";
		else if(e[i].href.indexOf("/profile") !== -1)
			e[i].className += " hl";
	}*/

	var t2 = new Date();
	xlog(t2-t1 +"ms: fixForums");
}

function removeAccesskeys()
{
	var e = get("a");
	var i = e.length;
	while(i--)
	{
		if(e[i].hasAttribute("accesskey"))
			e[i].removeAttribute("accesskey");
	}
}

function showPassword()
{
	var e, i, s;
	e = get("input");
	i = e.length;
	while(i--)
	{
		if(e[i].type && e[i].type === "password" && !hasClass(e[i], "showPassword"))
		{
			e[i].addEventListener("keyup", echoPassword, false);
			e[i].className += " showPassword";
		}
	}
}

function echoPassword(e)
{
	var e;
	e = e.target;
	showMessage(e.value, "none", true);
}

function getTimestamp()
{
	var d = new Date();
	return d.getFullYear() + "/" + zeroPad(d.getMonth() + 1) + "/" + zeroPad(d.getDate()) + " " + zeroPad(d.getHours()) + ":" + zeroPad(d.getMinutes()) + ":" + zeroPad(d.getSeconds());
}

function inject()
{
	//deleteUselessScripts();
	//deleteUselessIframes();
	document.addEventListener("keydown", handleKeyDown, false);
	showPassword();
	removeAccesskeys();
	insertStyleHighlight();
	xlog("Referrer: " + document.referrer);
	var pageLoadTime = getTimestamp();
	xlog("Page loaded at " + pageLoadTime);
	doStackOverflow();
}

function initialize()
{
	var load = true;
	if(location.hostname)
	{
		switch (location.hostname)
		{
			case "maps.google.com.au":
			case "maps.google.com":
				load = false;
				break;
			case "www.imdb.com":
				replaceElement(".head", "h2");
				break;
			case "en.wikipedia.org":
			case "secure.wikimedia.org":
				cleanupWikipedia();
				break;
			case "www.google.com":
			case "www.google.com.au":
				if(location.href.indexOf("analytics") > 0)
					break;
				highlightNodesContaining("cite", "developer.mozilla.org");
				highlightLinksWithHrefContaining("developer.mozilla.org");
				break;
			default:
				load = true;
				break;
		}
	}
	if(load)
	{
		setTimeout(inject, 200);
	}
	else
	{
		ylog("not injected");
	}
}

//
//
//	Keyboard shortcuts
//
//
function handleKeyDown(e)
{
	var ctrlOrMeta = "ctrlKey";
	if(navigator.userAgent.indexOf("Macintosh") !== -1)
		ctrlOrMeta = "metaKey";
	if(!(e.altKey || e.shiftKey || e[ctrlOrMeta]))
	{
		return;
	}
	var db = document.body;
	var s;
	var k = e.keyCode;
	if(!k)
	{
		xlog("couldn't get key");
		return;
	}
	//
	//	Alt
	//
	if(e.altKey && !e.shiftKey && !e[ctrlOrMeta])
	{
		switch (k)
		{
			case KEYCODES.TILDE: highlightSelection(); break;
			case KEYCODES.NUMPAD1: fillForms(); break;
			case KEYCODES.NUMPAD2: getLinksWithHrefContaining(); break;
			case KEYCODES.NUMPAD3: clickThanks(); break;
			case KEYCODES.NUMPAD4: forceReloadCss(); break;
			case KEYCODES.NUMPAD_SUBTRACT: openManager(); break;
			case KEYCODES.F1: makeHeadingFromSelection("h1"); break;
			case KEYCODES.F2: makeHeadingFromSelection("h2"); break;
			case KEYCODES.F3: makeHeadingFromSelection("h3"); break;
			case KEYCODES.ZERO: setDocTitleFromSelection(); break;
			case KEYCODES.ONE: cleanupGeneral(); break;
			case KEYCODES.TWO: deleteImages(); break;
			case KEYCODES.THREE: toggleClass(document.body, "xwrap"); break;
			case KEYCODES.FOUR: deleteSmallImages(); break;
			case KEYCODES.FIVE: getImages(); break;
			case KEYCODES.SIX: deleteIframes(); break;
			case KEYCODES.SEVEN: replaceCommentsWithPres(); break;
			case KEYCODES.EIGHT: makeDocumentClickable(); break;
			case KEYCODES.NINE: toggleShowClasses(); break;
			case KEYCODES.I: deleteSignatures(); break;
			case KEYCODES.P: fixParagraphs(); break;
			case KEYCODES.A: cycleClass(document.body, ["xDontShowLinks", "xHE", "irrelevantString"]); break;
			case KEYCODES.C: getContentByParagraphCount(); break;
			case KEYCODES.D: deleteSpecificEmptyElements(); break;
			case KEYCODES.G: deleteElementsContainingText(); break;
			case KEYCODES.X: toggleClass(document.body, "xShowImages"); break;
			case KEYCODES.Y: highlightNodesContaining(); break;
			case KEYCODES.O: highlightSelectionOrText(); break;
			case KEYCODES.K: getIframes(); break;
			case KEYCODES.L: showLog(); break;
			case KEYCODES.Q: fixHeadings(); break;
			case KEYCODES.R: highlightNode(); break;
			case KEYCODES.U: del("ul"); del("dl"); break;
			case KEYCODES.W: cleanupGeneral_light(); break;
			case KEYCODES.Z: cleanupUnicode(); break;
			case KEYCODES.F12: highlightCode(); break;
			case KEYCODES.FORWARD_SLASH: showPassword(); focusFormElement(); break;
		}
	}
	//
	//	Alt-Shift
	//
	else if(e.altKey && e.shiftKey && !e[ctrlOrMeta])
	{
		e.preventDefault();
		switch (k)
		{
			case KEYCODES.ONE: showResources(); break;
			case KEYCODES.TWO: replaceImagesWithTextLinks(); break;
			case KEYCODES.FIVE: getImages(true); break;
			case KEYCODES.E: replaceElement(); break;
			case KEYCODES.G: getElementsContainingText(); break;
			case KEYCODES.F12: highlightCode(true); break;
			case KEYCODES.A: annotate(); break;
			case KEYCODES.C: deleteNonContentDivs(); break;
			case KEYCODES.D: del("log"); break;
			case KEYCODES.P: highlightLinksInPres(); break;
			case KEYCODES.R: highlightNode("blockquote"); break;
			case KEYCODES.K: showPrintLink(); break;
			case KEYCODES.L: logout(); break;
			case KEYCODES.W: removeAttributes(); break;
			case KEYCODES.FORWARD_SLASH: focusButton(); break;
		}
	}
	//
	//	Ctrl-Alt or Meta-Alt
	//
	else if(e.altKey && e[ctrlOrMeta] && !e.shiftKey)
	{
		var shouldPreventDefault = true;
		switch (k)
		{
			case KEYCODES.SQUARE_BRACKET_OPEN: changeGalleryImage("prev"); break;
			case KEYCODES.SQUARE_BRACKET_CLOSE: changeGalleryImage("next"); break;
			case KEYCODES.LEFTARROW: changePage("prev"); break;
			case KEYCODES.RIGHTARROW: changePage("next"); break;
			case KEYCODES.ONE: insertStyleNegative(true); break;
			case KEYCODES.TWO: insertStyleWhite(); break;
			case KEYCODES.THREE: insertStyleFonts(); break;
			case KEYCODES.FOUR: insertStyleGrey(); break;
			case KEYCODES.FIVE: insertStyleShowClass(); break;
			case KEYCODES.E: replaceElement(); break;
			case KEYCODES.F: del(["object", "embed", "video"]); break;
			case KEYCODES.G: highlightElementsWithInlineWidthOrHeight(); break;
			case KEYCODES.H: highlightElementsBySelector(); break;
			case KEYCODES.L: highlightElementsWithCssRule(); break;
			case KEYCODES.V: showDocumentStructure(); break;
			case KEYCODES.B: showDocumentStructureWithNames(); break;
			case KEYCODES.N: showDocumentStructure2(); break;
			case KEYCODES.M: openDialog("Test dialog"); break;
			case KEYCODES.O: highlightSpecificNodesContaining(); break;
			case KEYCODES.R: wrapNodeInTag(); break;
			case KEYCODES.S: highlightElementsWithAttribute("style"); break;
			case KEYCODES.T: markTableRowsAndColumns(); break;
			case KEYCODES.W: highlightElementsWithSetWidths(); break;
			case KEYCODES.Y: highlightElementsWithCssRule(); break;
			case KEYCODES.F12: analyze(); break;
			default: shouldPreventDefault = false; break;
		}
		if(shouldPreventDefault)
			e.preventDefault();
	}
	//
	//	Ctrl-Alt-Shift
	//
	else if(e.altKey && e[ctrlOrMeta] && e.shiftKey)
	{
		e.preventDefault();
		switch(k)
		{
			case KEYCODES.H: unhighlightAllHighlightedElements(); break;
			case KEYCODES.S: removeStyleFromHighlightedElements(); break;
			case KEYCODES.F12: analyze(true); break;
		}
	}
	window.focus();
}

//
//	Program entry point
//
initialize();
