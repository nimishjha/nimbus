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
//	Copyright (C) 2008-2019 Nimish Jha
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

"use strict";

const Nimbus = {
	logString: "",
	messageTimeout: null
};

const KEYCODES = {
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
	TAB: 9,
	ENTER: 13,
	ESCAPE: 27,
	SQUARE_BRACKET_OPEN: 219,
	SQUARE_BRACKET_CLOSE: 221
};

function get(s)
{
	if(s.indexOf("#") === 0 && !~s.indexOf(" ") && !~s.indexOf("."))
		return document.querySelector(s);
	const nodes = document.querySelectorAll(s);
	if(nodes.length)
		return Array.from(nodes);
	return false;
}

function getOne(s)
{
	return document.querySelector(s);
}

function isArray(o)
{
	return Object.prototype.toString.call(o) === '[object Array]';
}

function del(arg)
{
	if(!arg)
		return;
	let i, ii;
	if(arg.nodeType)
		arg.parentNode.removeChild(arg);
	else if(arg.length)
		if(typeof arg === "string")
			del(get(arg));
		else
			for(i = 0, ii = arg.length; i < ii; i++)
				del(arg[i]);
}

function parseObject(o, indentLevel, parent)
{
	if(typeof indentLevel === "undefined")
		indentLevel = 0;
	let i;
	let s = "", type;
	let indentString = "<dd>";
	let indentStringParent = "<dd>";
	let indentStringClose = "";
	let indentStringParentClose = "";
	for(i = 0; i < indentLevel; i++)
	{
		indentString += "<blockquote>";
		indentStringClose += "</blockquote>";
	}
	for(i = 0; i < (indentLevel-1); i++)
	{
		indentStringParent += "<blockquote>";
		indentStringParentClose += "</blockquote>";
	}
	indentStringClose += "</dd>";
	indentStringParentClose += "</dd>";
	if(parent)
		s = indentStringParent + "<h2>" + parent + "</h2>" + indentStringParentClose;

	for(const prop in o)
	{
		if(o.hasOwnProperty(prop))
		{
			type = Object.prototype.toString.call(o[prop]);
			switch(type)
			{
				case "[object Object]":
					if(indentLevel < 2)
						s += parseObject(o[prop], indentLevel + 1, prop);
					else
						s += indentString + "<em>[object Object],</em><i>too many levels</i>" + indentStringClose;
					break;
				case "[object Array]":
					s += indentString + "<em>" + prop + "</em><i>" + "[" + printArray(o[prop]) + "]</i>" + indentStringClose;
					break;
				default:
					s += indentString + "<em>" + prop + "</em><i>" + o[prop] + "</i>" + indentStringClose;
					break;
			}
		}
	}
	return s;
}

function selectRandom(arr)
{
	if(!(arr && arr.length)) return;
	return arr[Math.floor(Math.random() * arr.length)];
}

function getSelectorsWithLightBackgrounds()
{
	const e = Array.prototype.slice.call(document.getElementsByTagName("*"));
	let i = e.length;
	let count = 0;
	let str = "";
	for (i = 0, count = 0; i < e.length, count < 4000; i++, count++)
	{
		if(!e[i]) continue;
		count++;
		const s = getComputedStyle(e[i]);
		const bgColor = s.getPropertyValue("background-color");
		if (bgColor.match(/2[0-9][0-9]/))
		{
			str += e[i].tagName;
			if(e[i].id) str += "#" + e[i].id;
			if(e[i].className) str += "." + e[i].className;
			str += ": " + bgColor + "\r\n";
		}
	}
	console.log(str);
}

function getStyles(e)
{
	let bgImage, bgColor, s;
	const styles = getComputedStyle(e, null);
	if(styles)
	{
		bgColor = styles.getPropertyValue("background-color");
		bgImage = styles.getPropertyValue("background-image");
		if(bgColor !== "transparent")
		{
			s = createElement("x", { textContent: bgColor });
			if(bgImage !== "none")
				s.textContent += " " + bgImage;
			e.appendChild(s);
			e.classList.add("hl");
		}
	}
	insertStyle("x { background: #000; color: #FF0; }", "styleGetStyles", true);
}

function highlightWithinPreformattedBlocks(str)
{
	const reg = new RegExp('([^\n]*' + str + '[^\n]+)', 'gi');
	const pres = get("pre");
	let i = pres.length;
	while(i--)
		pres[i].innerHTML = pres[i].innerHTML.replace(reg, "<mark>$1</mark>");
}

function highlightElementsWithInlineWidthOrHeight()
{
	const e = get("div, aside, article, section, table, tr, td");
	let i = e.length;
	let s;
	while(i--)
	{
		s = e[i].getAttribute("style");
		if(s)
		{
			if(s.indexOf("width") !== -1) e[i].classList.add("hl");
			else if(s.indexOf("height") !== -1) e[i].classList.add("hl2");
		}
	}
	insertStyleHighlight();
}

function highlightElementsWithCssRule()
{
	let styles, i, s;
	const prop = prompt("Highlight elements where CSS Property");
	const val = prompt("has the value");
	const e = document.getElementsByTagName("*");
	i = e.length;
	while(i--)
	{
		styles = getComputedStyle(e[i], null);
		if(styles)
		{
			s = styles.getPropertyValue(prop);
			if(val && val === s) e[i].classList.add("hl");
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
	if(get("#styleShowTables"))
	{
		del("#styleShowTables");
		return;
	}
	const tr = get("tr");
	let td, i, ii, j, jj;
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
	insertStyle("table, tr, td { box-shadow: inset 1px 1px #444, inset -1px -1px #444; }", "styleShowTables", true);
}

//
//	checks if a given string contains any of an array of strings
//	much better than using s.indexOf('a') || s.indexOf('b')...
//
function containsAnyOfTheStrings(s, arrStrings)
{
	if(!s || typeof s !== "string")
		return false;
	let i = arrStrings.length;
	while(i--)
		if(~s.indexOf(arrStrings[i]))
			return true;
	return false;
}

function toggleClass(element, className)
{
	const classList = element.classList;
	if(classList.contains(className))
		classList.remove(className);
	else
		classList.add(className);
}

function cycleClass(elem, arrClasses)
{
	let i, ii, found = false;
	for(i = 0, ii = arrClasses.length; i < ii; i++)
	{
		if(elem.classList.contains(arrClasses[i]))
		{
			if(i < ii-1)
			{
				elem.classList.remove(arrClasses[i]);
				elem.classList.add(arrClasses[i + 1]);
			}
			else
			{
				elem.classList.remove(arrClasses[i]);
				elem.classList.add(arrClasses[0]);
			}
			found = true;
			break;
		}
	}
	if(!found)
	{
		elem.classList.add(arrClasses[0]);
	}
}

function createUUID()
{
	return 'nimbus-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function (c)
	{
		const r = Math.random() * 16 | 0;
		const v = (c === 'x') ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}

function printArray(arr)
{
	let s = "";
	let i, ii;
	for(i = 0, ii = arr.length; i < ii; i++)
	{
		if(i === ii-1)
			s += arr[i];
		else
			s += arr[i] + ", ";
	}
	return s;
}

function createElement(tag, props)
{
	const elem = document.createElement(tag);
	if(props && typeof props === "object")
	{
		const keys = Object.keys(props);
		let i = keys.length;
		const settableProperties = ["id", "className", "textContent", "innerHTML", "value"];
		while(i--)
		{
			const key = keys[i];
			if(settableProperties.includes(key))
				elem[key] = props[key];
			else
				elem.setAttribute(key, props[key]);
		}
		return elem;
	}
	return elem;
}

function showResource(str, uuid)
{
	let strSanitized = str;
	if(str.indexOf("?") !== -1)
		strSanitized = str.substr(0, str.indexOf("?"));
	const resourceLink = createElement("a", { textContent: strSanitized, href: str });
	const resourceLinkWrapper = createElement("h6", { className: "xlog", id: "link" + uuid });
	const resourceDelete = createElement("span", { innerHTML: "[Delete]" });
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
	const idToDelete = evt.target.getAttribute("data-delete");
	del("#" + idToDelete);
	del("#link" + idToDelete);
}

function showResources()
{
	if(get(".xlog").length)
	{
		del(".xlog");
		del("#styleShowResources");
		return;
	}
	let count, uuid;
	let e = get("script");
	let i = e.length;
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
		if( e[i].href && e[i].href.indexOf("css") !== -1 || e[i].type && e[i].type === "text/css" )
		{
			uuid = createUUID();
			e[i].id = uuid;
			showResource(e[i].href, uuid);
			count++;
		}
	}
	ylog(count + " styles", "h3", true);
	const s = '.xlog { background: #000; color: #FFF; margin: 0; padding: 5px 10px; z-index: 2000000000; font: 12px verdana; text-align: left; }' +
	'.xlog a { text-decoration: none; letter-spacing: 0; font: 12px verdana; text-transform: none; color: #09F; }' +
	'.xlog a:visited { color: #059; }' +
	'.xlog a:hover { color: #FFF; } h3.xlog:nth-of-type(1) {margin-top: 50px;}';
	insertStyle(s, "styleShowResources", true);
	window.scrollTo(0, 0);
}

function toggleBlockEditMode()
{
	const db = document.body;
	if(get("#styleToggleBlockEditMode"))
	{
		del("#styleToggleBlockEditMode");
		db.removeEventListener('mouseup', handleBlockEditClick, false);
		db.classList.remove("debug");
		showMessage("Block edit mode off", "messagebig");
	}
	else
	{
		db.addEventListener('mouseup', handleBlockEditClick, false);
		db.classList.add("debug");
		const s = 'html body.debug header, html body.debug footer, html body.debug article, html body.debug aside, html body.debug section, html body.debug div { border: 2px solid #666; margin: 5px; padding: 5px; }' +
			'html body.debug header:hover, html body.debug footer:hover, html body.debug article:hover, html body.debug aside:hover, html body.debug section:hover, html body.debug div:hover { border-color: #F00; } ' +
			'html body.debug>header, html body.debug>footer, html body.debug>article, html body.debug>aside, html body.debug>section, html body.debug>div { border-width: 10px 10px 10px 20px; }';
		insertStyle(s, "styleToggleBlockEditMode", true);
		showMessage("Block edit mode on", "messagebig");
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
		const s = 'header, footer, article, aside, section, div, blockquote, canvas { box-shadow: inset 1px 1px #09F, inset -1px -1px #09F; }' +
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
	if(document.body.classList.contains("showdivs"))
	{
		del("x");
		del("#showDivs");
		document.body.classList.remove("showdivs");
		return;
	}
	const tags = ['table', 'tr', 'td', 'div', 'ul', 'aside', 'header', 'footer', 'article', 'section'];
	for (let j = 0, jj = tags.length; j < jj; j++)
	{
		const e = get(tags[j]);
		let i = e.length;
		while(i--)
		{
			let idsAndClasses = "";
			if(e[i].hasAttribute("id")) idsAndClasses += "#" + e[i].id;
			if(e[i].hasAttribute("class")) idsAndClasses += " ." + e[i].className;
			if(e[i].firstChild !== null) e[i].insertBefore(createElement("x", { textContent: idsAndClasses }), e[i].firstChild);
			else e[i].appendChild(createElement("x", { textContent: idsAndClasses }));
		}
	}
	document.body.classList.add("showdivs");
	const s = 'body { padding: 100px; }' +
	'div, aside, section, header, footer, aside, ul, ol { box-shadow: inset 2px 2px #000, inset -2px -2px #000; min-height: 30px; padding: 0 10px 10px 10px; margin-top: 10px; }' +
	'div::after { content: " "; display: block; clear: both; }' +
	'x { color: #FC0; background: #000; font: 12px Verdana; padding: 5px 10px; letter-spacing: 0; display: block; margin : 0 -10px 10px -10px; }';
	insertStyle(s, 'showDivs', true);
}

function highlightSelectionOrText()
{
	showMessage("Highlight selection or text", "messagebig");
	let s, i, ii;
	let node, nodes, regex;
	let links, linkHrefs;

	if(window.getSelection().toString().length)
		s = window.getSelection().toString();
	else
		s = prompt("Text to highlight");

	// if(s && s.length)
	// {
	// 	let ss = escapeForRegExp(s);
	// 	let tempHTML = document.body.innerHTML;
	// 	let r = new RegExp(ss, "gi");
	// 	tempHTML = tempHTML.replace(r, "<samp>" + s + "</samp>");
	// 	document.body.innerHTML = tempHTML;
	// }

	if (s && s.length)
	{
		linkHrefs = [];
		links = get("a");
		for(i = 0, ii = links.length; i < ii; i++)
			linkHrefs.push(links[i].href);

		regex = new RegExp(escapeForRegExp(s), "gi");
		nodes = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, blockquote, td");
		for (i = 0, ii = nodes.length; i < ii; i++)
		{
			node = nodes[i];
			if (~node.innerHTML.indexOf(s))
				node.innerHTML = node.innerHTML.replace(regex, "<mark>" + s + "</mark>");
			else if(~node.textContent.indexOf(s))
				node.innerHTML = "<mark>" + node.innerHTML + "</mark>";
		}

		links = get("a");
		for(i = 0, ii = links.length; i < ii; i++)
			links[i].href = linkHrefs[i];
	}
}

function highlightTextAcrossTags(searchString)
{
	var searchRegEx = new RegExp(escapeForRegExp(searchString), "gi");
	var nodes = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, blockquote, td");
	for(let i = 0, ii = nodes.length; i < ii; i++)
	{
		var node = nodes[i];
		if(~node.innerHTML.indexOf(searchString))
		{
			node.innerHTML = node.innerHTML.replace(searchRegEx, "<mark>" + searchString + "</mark>");
			if(node.innerHTML.match(searchRegEx).length === node.textContent.match(searchRegEx).length)
				continue;
		}
		let index1 = node.textContent.indexOf(searchString);
		if(index1 === -1)
			continue;
		let index2 = index1 + searchString.length;
		const childNodes = node.childNodes;
		let childNodeEnd = 0;
		const splitMatches = [];
		for(let j = 0, jj = childNodes.length; j < jj; j++)
		{
			const childNode = childNodes[j];
			const childNodeStart = childNodeEnd;
			childNodeEnd += childNode.textContent.length;
			let partialSearchString;
			let isMatch = false;
			if(index1 >= childNodeStart && index1 < childNodeEnd)
			{
				isMatch = true;
				partialSearchString = childNode.textContent.substring(index1 - childNodeStart, (index1 - childNodeStart) + searchString.length);
			}
			else if(index1 < childNodeStart && index2 > childNodeEnd)
			{
				isMatch = true;
				partialSearchString = childNode.textContent;
			}
			else if(index2 > childNodeStart && index2 <= childNodeEnd)
			{
				isMatch = true;
				partialSearchString = childNode.textContent.substring(0, index2 - childNodeStart);
			}
			if(isMatch)
			{
				if(childNode.nodeType === 1)
					childNode.innerHTML = "<mark>" + childNode.innerHTML + "</mark>";
				else
					splitMatches.push(partialSearchString);
			}
		}
		highlightAllMatchesInNode(node, splitMatches);
	}
}

function highlightAllMatchesInNode(node, splitMatches)
{
	let nodeHTML = node.innerHTML;
	let i = splitMatches.length;
	while(i--)
		nodeHTML = nodeHTML.replace(new RegExp(splitMatches[i]), "<mark>" + splitMatches[i] + "</mark>");
	node.innerHTML = nodeHTML;
}

function deleteUselessIframes()
{
	const domainsRequiringIframes = ["google.com", "jsperf.com", "measurethat"];
	const safeIframes = ["google.com"];
	if(containsAnyOfTheStrings(location.hostname, domainsRequiringIframes))
	{
		return;
	}
	const iframes = Array.prototype.slice.call(document.getElementsByTagName("iframe"));
	let i = iframes.length;
	while(i--)
	{
		if(containsAnyOfTheStrings(iframes[i].src, safeIframes))
		{
			ylog("Not deleting iframe " + iframes[i].src);
			continue;
		}
		else
		{
			ylog("Deleting iframe " + iframes[i].src);
			iframes[i].parentNode.removeChild(iframes[i]);
		}
	}
}

function deleteUselessScripts()
{
	const domains = ["google.com", "googletagmanager.com"];
	const e = get("script");
	let i = e.length;
	while(i--)
	{
		const elem = e[i];
		if(elem.hasAttribute("src"))
		{
			if(containsAnyOfTheStrings(elem.src, domains) && !(containsAnyOfTheStrings(location.hostname, domains)))
			{
				log2("Deleting " + elem.src);
				elem.parentNode.removeChild(elem);
			}
		}
	}
}

function getBestImageSrc()
{
	const e = get("img");
	let i = e.length;
	while(i--)
	{
		if(e[i].currentSrc)
			e[i].src = e[i].currentSrc;
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
	let e;
	msgClass = msgClass || "";
	const strStyle = 'message { display: block; background: #111; font: 12px Verdcode, Verdana; color: #555; padding: 0 1em; height: 30px; line-height: 30px; position: fixed; bottom: 0; left: 0; width: 100%; z-index: 2000000000; text-align: left; }' +
	'message.messagebig { font: 32px "Swis721 cn bt"; color: #FFF; height: 60px; line-height: 60px; font-weight: 500; }' +
	'message.messageerror { color: #FFF; background: #A00; }';

	if(!get("message"))
	{
		e = createElement("message", { className: msgClass });
		document.body.insertBefore(e, document.body.firstChild);
		if(!getOne("#styleMessage"))
		{
			insertStyle(strStyle, "styleMessage", true);
		}
	}
	else
	{
		e = getOne("message");
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
	del("#styleMessage");
}

function parseCommand(s)
{
	let args = [];
	let arg = '';
	for(let i = 0, ii = s.length; i < ii; i++)
	{
		switch(s[i])
		{
			case '"':
				i++;
				while(s[i] !== '"')
					arg += s[i++];
				break;
			case ' ':
				args.push(arg);
				arg = '';
				break;
			default:
				arg += s[i];
		}
	}
	args.push(arg);
	return args;
}

function runCommand(s)
{
	if(typeof s === "undefined" || !s.length)
		return;
	const commandSegments = parseCommand(s);
	if (!commandSegments.length)
		return;
	const funcName = commandSegments[0];
	const availableFunctions = {
		addLinksToLargerImages: addLinksToLargerImages,
		addParagraphs: addParagraphs,
		annotate: annotate,
		appendInfo: appendInfo,
		buildSlideshow: buildSlideshow,
		chooseDocumentHeading: chooseDocumentHeading,
		cleanupBlogs: cleanupBlogs,
		cleanupGeneral: cleanupGeneral,
		cleanupGeneral_light: cleanupGeneral_light,
		cleanupHead: cleanupHead,
		cleanupHeadings: cleanupHeadings,
		cleanupUnicode: cleanupUnicode,
		cleanupWikipedia: cleanupWikipedia,
		createPagerFromSelect: createPagerFromSelect,
		createTagsByClassName: createTagsByClassName,
		del: del,
		delClassContaining: delClassContaining,
		deleteElementsContainingText: deleteElementsContainingText,
		deleteEmptyElements: deleteEmptyElements,
		deleteEmptyHeadings: deleteEmptyHeadings,
		deleteIframes: deleteIframes,
		deleteImages: deleteImages,
		deleteImagesBySrcContaining: deleteImagesBySrcContaining,
		deleteImagesSmallerThan: deleteImagesSmallerThan,
		deleteNonContentDivs: deleteNonContentDivs,
		deleteNonContentElements: deleteNonContentElements,
		deleteNonContentImages: deleteNonContentImages,
		deletePlainSpanTags: deletePlainSpanTags,
		deleteSmallImages: deleteSmallImages,
		deleteSpecificEmptyElements: deleteSpecificEmptyElements,
		deleteUselessIframes: deleteUselessIframes,
		deleteUselessScripts: deleteUselessScripts,
		delNewlines: delNewlines,
		delRange: delRange,
		fillForms: fillForms,
		fixHeadings: fixHeadings,
		fixParagraphs: fixParagraphs,
		fixPres: fixPres,
		focusButton: focusButton,
		focusFormElement: focusFormElement,
		forAll: forAll,
		forceReloadCss: forceReloadCss,
		formatEbook: formatEbook,
		getAllClasses: getAllClasses,
		getAllCssRulesMatching: getAllCssRulesMatching,
		getBestImageSrc: getBestImageSrc,
		getContentById: getContentById,
		getContentByParagraphCount: getContentByParagraphCount,
		getElementsContainingText: getElementsContainingText,
		getElementsWithClass: getElementsWithClass,
		getImages: getImages,
		getLargeImages: getLargeImages,
		getLinksWithHrefContaining: getLinksWithHrefContaining,
		getPagerLinks: getPagerLinks,
		getSelectorsWithLightBackgrounds: getSelectorsWithLightBackgrounds,
		handleBlockEditClick: handleBlockEditClick,
		hasClassesContaining: hasClassesContaining,
		highlightAllTableCellsInRow: highlightAllTableCellsInRow,
		highlightCode: highlightCode,
		highlightElementsBySelector: highlightElementsBySelector,
		highlightElementsWithAttribute: highlightElementsWithAttribute,
		highlightElementsWithCssRule: highlightElementsWithCssRule,
		highlightElementsWithInlineWidthOrHeight: highlightElementsWithInlineWidthOrHeight,
		highlightElementsWithSetWidths: highlightElementsWithSetWidths,
		highlightLinksInPres: highlightLinksInPres,
		highlightLinksWithHrefContaining: highlightLinksWithHrefContaining,
		highlightNode: highlightNode,
		highlightNodesContaining: highlightNodesContaining,
		highlightSelection: highlightSelection,
		highlightSelectionOrText: highlightSelectionOrText,
		highlightSpecificNodesContaining: highlightSpecificNodesContaining,
		highlightText: highlightText,
		highlightTextAcrossTags: highlightTextAcrossTags,
		highlightWithinPreformattedBlocks: highlightWithinPreformattedBlocks,
		insertStyle: insertStyle,
		insertStyleFonts: insertStyleFonts,
		insertStyleGrey: insertStyleGrey,
		insertStyleHighlight: insertStyleHighlight,
		insertStyleNegative: insertStyleNegative,
		toggleStyleShowClass: toggleStyleShowClass,
		insertStyleWhite: insertStyleWhite,
		makeHeadingFromSelection: makeHeadingFromSelection,
		makeHeadings: makeHeadings,
		makeHeadingsByTextLength: makeHeadingsByTextLength,
		markDivDepth: markDivDepth,
		markTableRowsAndColumns: markTableRowsAndColumns,
		numberDivs: numberDivs,
		observeAddedNodes: observeAddedNodes,
		parseCode: parseCode,
		removeAccesskeys: removeAccesskeys,
		removeAttributes: removeAttributes,
		removeAttributesOf: removeAttributesOf,
		removeAttributes_regex: removeAttributes_regex,
		removeClassFromAll: removeClassFromAll,
		removeEventListeners: removeEventListeners,
		replaceAudio: replaceAudio,
		replaceCommentsWithPres: replaceCommentsWithPres,
		replaceDiacritics: replaceDiacritics,
		replaceElementsBySelector: replaceElementsBySelector,
		replaceFontTags: replaceFontTags,
		replaceIframes: replaceIframes,
		replaceImagesWithTextLinks: replaceImagesWithTextLinks,
		replaceSpans: replaceSpans,
		restorePres: restorePres,
		retrieve: retrieve,
		revealEmptyLinks: revealEmptyLinks,
		revealLinkHrefs: revealLinkHrefs,
		sanitizeTitle: sanitizeTitle,
		setDocTitle: setDocTitle,
		setDocTitleFromSelection: setDocTitleFromSelection,
		showDocumentStructure2: showDocumentStructure2,
		showDocumentStructure: showDocumentStructure,
		showDocumentStructureWithNames: showDocumentStructureWithNames,
		showPrintLink: showPrintLink,
		showResources: showResources,
		showTextToHTMLRatio: showTextToHTMLRatio,
		toggleBlockEditMode: toggleBlockEditMode,
		toggleShowClasses: toggleShowClasses,
		unhighlightAll: unhighlightAll,
		wrapNodeInTag: wrapNodeInTag,
		xlog: xlog,
		ylog: ylog,
	};
	if(availableFunctions[funcName])
	{
		const args = [];
		let n;
		let i, ii;
		for (i = 1, ii = commandSegments.length; i < ii; i++)
		{
			n = parseInt(commandSegments[i], 10);
			if (isNaN(n))
				args.push(commandSegments[i]);
			else args.push(n);
		}
		showMessage(funcName + "(" + printArray(args) + ")", "messagebig");
		availableFunctions[funcName].apply(this, args);
	}
}

function openDialog(inputHandler)
{
	if(!get("#xxdialog"))
	{
		del("#style-xxdialog");
		const dialog = createElement("div", { id: "xxdialog" });
		const dialogInput = createElement("textarea", { id: "xxdialoginput" });
		dialog.appendChild(dialogInput);
		document.body.insertBefore(dialog, document.body.firstChild);
		const s = '#xxdialog { position: fixed; margin: auto; z-index: 10000; height: 60px; top: 0; left: 0px; bottom: 0px; right: 0; background: #111; color: #FFF; border: 10px solid #000; display: block; text-transform: none; width: 800px; }' +
		'#xxdialoginput { font: 32px "swis721 cn bt"; line-height: 60px; verdana; background: #000; color: #FFF; padding: 0; border: 0; width: 100%; height: 100%; overflow: hidden; }';
		insertStyle(s, "style-xxdialog", true);
		dialogInput.focus();
		if(inputHandler)
			dialogInput.addEventListener("keydown", inputHandler, false);
		else
			dialogInput.addEventListener("keydown", defaultDialogInputHandler, false);
	}
}

function closeDialog()
{
	const command = get("#xxdialoginput").value;
	del("#xxdialog");
	del("#style-xxdialog");
	return command;
}

function defaultDialogInputHandler(evt)
{
	evt.stopPropagation();
	switch(evt.keyCode)
	{
		case KEYCODES.ESCAPE: closeDialog(); break;
	}
}

function handleCommandInput(evt)
{
	evt.stopPropagation();
	switch(evt.keyCode)
	{
		case KEYCODES.ESCAPE: closeDialog(); break;
		case KEYCODES.ENTER: runCommand(closeDialog()); break;
	}
}

function removeNonAlpha(s)
{
	return s.replace(/[^A-Za-z]/g, '');
}

function changePage(direction)
{
	let found = false;
	const links = get("a");
	let i = links.length;
	let matchStrings = [];
	if(direction === "prev") matchStrings = ["prev", "previous"];
	else if(direction === "next") matchStrings = ["next", "nextpage"];
	while(i--)
	{
		let s = links[i].textContent;
		if(s)
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
	let pageString, curPage, links, i, ii;
	if(document.body.innerHTML.match(/Page [0-9]+ of [0-9]+/))
	{
		pageString = document.body.innerHTML.match(/Page [0-9]+ of [0-9]+/);
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
				links[i].classList.add("hl");
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
	let i, ii;
	const e = get("a");
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].textContent && e[i].textContent.length)
		{
			const s = removeWhitespace(e[i].textContent);
			if(parseInt(s, 10) && s.match(/[^0-9]+/) === null)
			{
				e[i].focus();
				e[i].className = "hl";
				break;
			}
		}
	}
}

function css(elem)
{
	const sheets = document.styleSheets;
	const rulesArray = [];
	let i = sheets.length;
	while(i--)
	{
		const rules = sheets[i].cssRules;
		let j = rules.length;
		while(j--)
			if(elem.matches(rules[j].selectorText))
				rulesArray.push(rules[j].cssText);
	}
	return rulesArray;
}

function getAllCssRulesMatching(s)
{
	const sheets = document.styleSheets;
	let i = sheets.length;
	const regex = new RegExp(s);
	while(i--)
	{
		const rules = sheets[i].cssRules;
		let j = rules.length;
		while(j--)
			if(~rules[j].cssText.indexOf(s))
				ylog(rules[j].cssText.replace(regex, "<mark>" + s + "</mark>"));
	}
}

function getContentById(id)
{
	const toGet = getOne(id);
	if(toGet)
		document.body.innerHTML = toGet.innerHTML;
}

function doStackOverflow()
{
	const sites = ["stackexchange", "stackoverflow", "superuser", "serverfault"];
	let found = false;
	if(containsAnyOfTheStrings(location.hostname, sites))
		found = true;
	// we only want to run this code on the individual question pages
	if(found && location.href.match(/questions\/[0-9]+/) !== null)
	{
		del(["#sidebar", ".signup-prompt", ".post-menu", ".user-gravatar32", "form"]);
		deleteElementsContainingText("h2", "Not the answer");
		getContentById("#content");
		cleanupGeneral();
		highlightCode(true);
		forAll("td", function f(x) {
			if(x.textContent && x.textContent.indexOf("up vote") !== -1)
				x.setAttribute("style", "width: 200px");
		});
		const observer = new MutationObserver(function(mutations)
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
		});
		observer.observe(getOne("head"), { childList: true });
	}
}

function highlightElementsBySelector()
{
	const s = prompt("Enter selector for elements to highlight");
	if(!(s && s.length)) return;
	const e = get(s);
	if(e.length)
	{
		let i = e.length;
		while(i--) e[i].classList.add("hl");
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
	elem.classList.remove("hl");
}

function unhighlightAll()
{
	const e = get(".hl");
	let i = e.length;
	while (i--)
		e[i].classList.remove("hl");
}

function getIdAndClass(e)
{
	let s = "";
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
	const e = get("*");
	if(e.length)
	{
		let i = e.length;
		while(i--)
		{
			if(e[i].hasAttribute("style"))
			{
				e[i].classList.add("hl");
				ylog(getIdAndClass(e[i]) + ": " + e[i].style.cssText);
			}
		}
	}
	insertStyleHighlight();
}

function highlightElementsWithSetWidths()
{
	showMessage("Finding divs with pixel widths...", "messagebig");
	const e = get("div");
	let i = e.length, j, cssRules;
	while(i--)
	{
		cssRules = css(e[i]);
		j = cssRules.length;
		while(j--)
		{
			if( (cssRules[j].match(/width:[^;]*px/) !== null))
			{
				e[i].classList.add("hl");
				e[i].innerHTML = "<x>#" + e[i].id + " ." + e[i].className + " " + getComputedStyle(e[i], null).getPropertyValue("width") + "</x>" + e[i].innerHTML;
				ylog(cssRules[j]);
			}
		}
	}
	insertStyle("x { background: #000; color: #FFF; padding: 2px 4px; display: block; font: 12px verdana;  } .xlog { clear: both; }", "styleHighlightElementsWithSetWidths", true);
	insertStyleHighlight();
}

function wrapNodeInTag()
{
	const s = prompt("Enter tag to wrap selected node's innerHTML in");
	if(s && s.length)
		highlightNode(s);
}

function highlightNode(tag)
{
	const t = tag? tag : "mark";
	const selection = window.getSelection();
	if(!selection)
		return;
	let node = selection.anchorNode;
	if(node.tagName === undefined)
		node = node.parentNode;
	if(node && node.parentNode)
		node.innerHTML = "<" + t + ">" + node.innerHTML + "</" + t + ">";
}

function makeHeadingFromSelection(tagname)
{
	const selection = window.getSelection();
	if(!selection) return;
	let node = selection.anchorNode;
	if(node.tagName === undefined)
		node = node.parentNode;
	if(node && node.parentNode && node.parentNode.tagName !== "body")
		node.parentNode.replaceChild(createElement(tagname, { innerHTML: node.innerHTML }), node);
	else
		xlog("Could not make heading");
}

function annotate()
{
	const selection = window.getSelection();
	if(!selection) return;
	let node = selection.anchorNode;
	if(node.tagName === undefined) node = node.parentNode;
	if(node && node.parentNode)
	{
		const d = createElement("ruby");
		d.textContent = prompt("______________________________________________ Annotate ___________________________________________________________________");
		if(d.textContent.length) node.parentNode.insertBefore(d, node);
	}
}

function getImages(slideshow)
{
	if(get("#styleNimbusGallery"))
	{
		del("#styleNimbusGallery");
		del("#nimbusGallery");
		return;
	}
	const f = get("img");
	const db = document.body;
	let i, ii, j, w, h;
	const galleryElement = createElement("slideshow", { id: "nimbusGallery" });
	if(f && f.length)
	{
		//mark duplicates by removing the src
		for(i = 0; i < f.length; i++)
		{
			for(j = i+1; j < f.length; j++)
				if(f[j].src === f[i].src)
					f[j].removeAttribute("src");
		}
		for(i = 0, ii = f.length; i < ii; i++)
		{
			if(f[i].hasAttribute("src")) // if it's not a duplicate
			{
				f[i].removeAttribute("width");
				f[i].removeAttribute("height");
				w = f[i].naturalWidth;
				h = f[i].naturalHeight;
				if(w && h && (w > window.innerWidth || h > window.innerHeight))
				{
					if((w/h) > (16/9))
						f[i].className = "wide ratio" + w + "x" + h;
					else
						f[i].className = "tall ratio" + w + "x" + h;
				}
				//if(f[i].parentNode && f[i].parentNode.tagName && f[i].parentNode.tagName.toLowerCase() === "a")
				//	galleryElement.appendChild(f[i].parentNode.cloneNode(true));
				//else
				galleryElement.appendChild(f[i].cloneNode(true));
			}
		}
		if(!slideshow)
		{
			del("img");
			cleanupHead();
			insertStyle("img { display: block; float: left; max-height: 300px; }", "styleGallery", true);
		}
		db.insertBefore(galleryElement, db.firstChild);
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
	const gallery = get("#nimbusGallery");
	const images = gallery.querySelectorAll("img");
	if(!(gallery && images))
		return;
	const s = 'body { margin: 0; padding: 0; }' +
	'#nimbusGallery { width: 100%; height: 100vh; background: #000; color: #999; position: absolute; top: 0; left: 0; z-index: 2000000000; }' +
	'#nimbusGallery img { position: absolute; top: -1000em; left: -1000em; }' +
	'#nimbusGallery img.currentImage { margin: auto; position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: block; }' +
	'#nimbusGallery img.currentImage.tall { height: 100%; width: auto; }' +
	'#nimbusGallery img.currentImage.wide { width: 100%; height: auto; }' +
	'#nimbusGallery a { color: #000; }';
	insertStyle(s, 'styleNimbusGallery', true);
	images[0].classList.add("currentImage");
	window.scrollTo(0, 0);
}

function changeGalleryImage(direction)
{
	if(!get("#styleNimbusGallery"))
		return;
	const gallery = get("#nimbusGallery");
	if(!gallery)
		return;
	const e = gallery.getElementsByTagName("img");
	let i, ii;
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].classList.contains("currentImage"))
		{
			e[i].classList.remove("currentImage");
			if(direction === "prev")
			{
				if(i === 0) e[ii - 1].classList.add("currentImage");
				else e[i - 1].classList.add("currentImage");
				break;
			}
			else if(direction === "next")
			{
				if(i === ii-1) e[0].classList.add("currentImage");
				else e[i + 1].classList.add("currentImage");
				break;
			}
		}
	}
}

function deleteIframes()
{
	const numIframes = get("iframe").length;
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
	const images = get("img");
	if(images && images.length)
	{
		del("img");
		showMessage("Deleted " + images.length + " images", "messagebig");
	}
	else del("rt");
}

function deleteImagesSmallerThan(x, y)
{
	const images = document.getElementsByTagName('img');
	let i = images.length;
	while(i--)
	{
		if(images[i].naturalWidth < x || images[i].naturalHeight < y)
			del(images[i]);
	}
}

function deleteSmallImages()
{
	const images = get("img");
	const dimensions = [100, 200, 300, 400];
	let index = 0;
	let indexElement = get("#imagedimensionindex");
	if (indexElement)
	{
		index = indexElement.textContent || 0;
		index++;
		if (index > dimensions.length - 1) return;
	}
	else
	{
		index = 0;
	}
	del("#imagedimensionindex");
	indexElement = createElement("h6", { textContent: index, id: "imagedimensionindex" });
	document.body.appendChild(indexElement);
	const dimension = dimensions[index];
	showMessage("Deleting images smaller than " + dimension + " pixels", "messagebig");
	let i = images.length;
	while(i--)
		if (images[i].naturalWidth < dimension || images[i].naturalHeight < dimension)
			del(images[i]);
}

function deletePlainSpanTags()
{
	let s = document.body.innerHTML;
	s = s.replace(/<span>/g, "").replace(/<\/span>/g, "");
	document.body.innerHTML = s;
}

function replaceSpans()
{
	const e = get("span");
	let i = e.length;
	while(i--)
		e[i].parentNode.replaceChild(document.createTextNode(e[i].textContent), e[i]);
}

function replaceCommentsWithPres()
{
	let s = document.body.innerHTML;
	s = s.replace(/<!--/g, '<pre>');
	s = s.replace(/-->/g, '</pre>');
	document.body.innerHTML = s;
}

function replaceImagesWithTextLinks()
{
	let e, imageLink, imageReplacement, i;
	if(get("rt"))
	{
		e = get("rt");
		i = e.length;
		while(i--)
		{
			imageLink = createElement("img", { src: e[i].querySelector("a").href });
			e[i].parentNode.replaceChild(imageLink, e[i]);
		}
		del('#styleReplaceImages');
		return;
	}
	else if(get("img"))
	{
		e = get("img");
		for(i = 0; i < e.length; i++)
		{
			if(e[i].src)
			{
				imageLink = createElement("a", { href: e[i].src, textContent: e[i].src });
				imageReplacement = createElementWithChild("rt", imageLink);
				if(e[i].parentNode.tagName.toLowerCase() === "a")
					e[i].parentNode.parentNode.replaceChild(imageReplacement, e[i].parentNode);
				else
					e[i].parentNode.insertBefore(imageReplacement, e[i]);
			}
		}
		del("img");
		const s = 'rt { margin: 10px 0; padding: 20px; display: block; background: #181818; font: 12px verdana; }' +
		'rt a { color: #FFF; }' +
		'rt:before { content: ""; display: block; width: 10px; height: 15px; border: 2px solid #AAA; float: left; margin: -3px 20px 0 0; }';
		insertStyle(s, "styleReplaceImages");
	}
}

function replaceAudio()
{
	let e, i, f, g;
	e = get("source"), i = e.length;
	while(i--)
	{
		if(e[i].src)
		{
			f = createElement("a", { href: e[i].src, textContent: e[i].src });
			g = createElementWithChild("h2", f);
			e[i].parentNode.replaceChild(g, e[i]);
		}
	}
	replaceElementsBySelector("audio", "div");
}

function getLargeImages()
{
	const links = get("a");
	let i = links.length;
	while(i--)
	{
		const linkHref = links[i].href;
		if(containsAnyOfTheStrings(linkHref.toLowerCase(), [".png", ".jpg", ".gif", ".jpeg", ".jpe"]))
		{
			links[i].parentNode.replaceChild(createElement("img", { src: linkHref }), links[i]);
		}
	}
}

function addLinksToLargerImages()
{
	if(get("rt"))
		return;
	const links = get("a");
	let link;
	let i = links.length;
	while(i--)
	{
		link = links[i].href;
		if(containsAnyOfTheStrings(link.toLowerCase(), [".png", ".jpg", ".jpeg", ".gif"]))
			links[i].parentNode.insertBefore(createElementWithChild("rt", createElement("a", { href: link, textContent: link})), links[i]);
	}
}

function cleanupGeneral()
{
	const t1 = performance.now();
	cleanupHead();
	getOne("body").removeAttribute("style");
	replaceIframes();
	deleteNonContentImages();
	addLinksToLargerImages();
	replaceIncorrectHeading();
	del(["link", "style", "iframe", "script", "input", "select", "textarea", "button", "x", "canvas", "label", "svg", "video", "audio", "applet"]);
	deleteElementsContainingText("h6", "Deleting iframe");
	replaceElementsBySelector("center", "div");
	setDocTitle();
	removeAttributes();
	deletePlainSpanTags();
	replaceAudio();
	appendInfo();
	getBestImageSrc();
	document.body.className = "pad100 xwrap";
	insertStyleNegative();
	const t2 = performance.now();
	xlog(Math.round(t2 - t1) + " ms: cleanupGeneral");
}

function cleanupGeneral_light()
{
	const t1 = performance.now();
	deleteEmptyHeadings();
	cleanupHead();
	replaceIframes();
	del(["link", "style", "iframe", "script", "input", "select", "textarea", "button", "noscript"]);
	//replaceFontTags();
	replaceElementsBySelector("center", "div");
	setDocTitle();
	del("x");
	removeAttributes_regex();
	appendInfo();
	document.body.className = "pad100 xShowImages";
	const t2 = performance.now();
	xlog(Math.round(t2 - t1) + " ms: cleanupGeneral_light");
}

function replaceIframes()
{
	const e = get("iframe");
	let i = e.length;
	while(i--)
	{
		const iframereplacement = document.createElement("rp");
		const iframelink = document.createElement("a");
		const s = e[i].src;
		if(containsAnyOfTheStrings(s, ["facebook", "twitter"]))
		{
			e[i].parentNode.removeChild(e[i]);
			continue;
		}
		iframelink.href = s;
		if(e[i].src.indexOf("youtube") !== -1)
		{
			let s = s.replace(/\/embed\//, '/watch?v=');
			const segments = s.split('?');
			iframelink.href = segments[0] + '?' + segments[1];
			if(s.indexOf(".") > 0)
				s = s.match(/:\/\/(.[^/]+)/)[1];
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

function replaceElementsBySelector(selector, tagName)
{
	if(!(selector && tagName))
	{
		selector = prompt("Element to replace (querySelectorAll)");
		tagName = prompt("Tag to replace with");
	}
	const e = get(selector);
	let i, ii;
	if(e.length)
	{
		const toreplace = [];
		for (i = 0, ii = e.length; i < ii; i++)
			toreplace.push(e[i]);
		for (i = toreplace.length - 1; i >= 0; i--)
			toreplace[i].parentNode.replaceChild(createElement(tagName, { innerHTML: toreplace[i].innerHTML }), toreplace[i]);
	}
	else if(e && e.parentNode)
	{
		e.parentNode.replaceChild(createElement(tagName, { innerHTML: e.innerHTML }), e);
	}
}

function cleanupHead()
{
	const h = getOne("head");
	if(!h)
		return;
	const tempTitle = document.title;
	h.innerHTML = '';
	document.title = tempTitle;
}

function forceReloadCss()
{
	showMessage("Force-reloading CSS", "messagebig");
	const styleLinks = document.getElementsByTagName('link');
	for (let i = 0; i < styleLinks.length; i++)
	{
		const styleSheet = styleLinks[i];
		if (styleSheet.rel.toLowerCase().indexOf('stylesheet') >= 0 && styleSheet.href)
		{
			const h = styleSheet.href.replace(/(&|%5C?)forceReload=\d+/, '');
			styleSheet.href = h + (h.indexOf('?') >= 0 ? '&' : '?') + 'forceReload=' + new Date().valueOf();
		}
	}
}

function insertStyle(str, identifier, important)
{
	if(identifier && identifier.length && get("#" + identifier))
		del("#" + identifier);
	if(important)
		str = str.replace(/;/g, " !important;");
	const head = getOne("head");
	const style = document.createElement("style");
	const rules = document.createTextNode(str);
	style.type = "text/css";
	if(style.styleSheet)
		style.styleSheet.cssText = rules.nodeValue;
	else
		style.appendChild(rules);
	if(identifier && identifier.length)
		style.id = identifier;
	head.appendChild(style);
}

function insertStyleHighlight()
{
	del("#styleHighlight");
	const s = '.hl, .focused { box-shadow: inset 2px 2px #F00, inset -2px -2px #F00; padding: 2px; }' +
		'.hl2 { box-shadow: inset 2px 2px #00F, inset -2px -2px #00F; }' +
		'.hl::after, .hl2::after { content: " "; display: block; clear: both; }';
	// let s = '.hl { filter: brightness(1.7); }';
	insertStyle(s, "styleHighlight", true);
}

function insertStyleFonts()
{
	del("#styleFonts");
	const s = 'a, p, li, td, div, input, select, textarea { font: bold 15px arial; }' +
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
	insertStyle(s, 'styleFonts', true);
}

function toggleStyleShowClass()
{
	if(get("#styleShowClass"))
	{
		del("#styleShowClass");
		return;
	}
	const s = '* { display: block; padding: 5px; border: 1px solid #111; }' +
	'*::before { content: attr(class); color: #FF0; }' +
	'head { display: none; }';
	insertStyle(s, "styleShowClass", true);
}

function insertStyleGrey()
{
	del("#styleGrey");
	const s = 'body { background: #203040; color: #ABC; font: 24px "swis721 cn bt"; }' +
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
	insertStyle(s, "styleGrey", true);
}

function insertStyleNegative(important)
{
	const s = 'html { background: #181818; }' +
	'html body { margin: 0; }' +
	'html body, html body[class] { color: #888; background: #242424; font-weight: normal; }' +
	'body.pad100 { padding: 100px 100px; }' +
	'body.pad100 table { width: 100%; }' +
	'body.pad100 td, body.pad100 th { padding: 3px 10px; }' +
	'body.pad100 image { display: block; }' +
	'nav { background: #111; }' +
	'body.xdark { background: #111; }' +
	'body.xblack { background: #000; }' +
	'body.xwrap { width: 1400px; margin: 0 auto; padding: 100px 300px; }' +
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
	'tbody, thead, th, tr, td, table { background: #202020; color: inherit; font: 22px "Swis721 Cn BT"; }' +
	'body.pad100 ul li { border-left: 5px solid #0C0C0C; padding: 0 0 0 10px; margin: 0 0 2px 0; }' +
	'cite, u, em, i, b, strong { font-weight: normal; font-style: normal; text-decoration: none; color: #CCC; font-size: inherit; }' +
	'a u, a em, a i, a b, a strong { color: inherit; }' +
	'small { font-size: 80%; }' +
	'input, input *, button, button *, div, td, p { font-size: 22px; font-family: "Swis721 Cn BT", sans-serif; line-height: 150%; }' +
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
		insertStyle(s, "styleNegative", true);
	else
		insertStyle(s, "styleNegative");
}

function insertStyleWhite()
{
	const s = 'body, input, select, textarea { background: #FFF; color: #000; }' +
	'input, select, textarea { font: 12px verdana; }';
	insertStyle(s, "styleWhite", true);
}

function toggleShowClasses()
{
	if(get("#styleShowClasses"))
	{
		del("#styleShowClasses");
		return;
	}
	const s = 'body { background: #333; color: #888; }' +
	'div::before, span::before, p::before { content:attr(class); color:#FF0; padding:0px 5px; background:#000; margin: 0 10px 0 0; }' +
	'div::after, span::after, p::after { content:attr(id); color:#0FF; padding:0px 5px; background:#000; margin: 0 10px 0 0; }' +
	'select, textarea, input { background: #444; border: 1px solid red; }' +
	'button { background: #222; color: #AAA; }';
	insertStyle(s, "styleShowClasses", true);
}

function removeEventListeners()
{
	let db = document.body;
	const tempbody = db.cloneNode(true);
	db = tempbody;
	const elems = document.getElementsByTagName("*");
	let i = elems.length;
	while (i--)
	{
		elems[i].removeAttribute("onmousedown");
		elems[i].removeAttribute("onmouseup");
		elems[i].removeAttribute("onmouseover");
		elems[i].removeAttribute("onclick");
	}
}

function chooseDocumentHeading()
{
	let e, s = '', i, ii, j, jj;
	let found = false;
	const candidateTags = ['h1', 'h2', 'h3'];
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
	const diacritics =[
		/[\300-\306]/g, /[\340-\346]/g,	// A, a
		/[\310-\313]/g, /[\350-\353]/g,	// E, e
		/[\314-\317]/g, /[\354-\357]/g,	// I, i
		/[\322-\330]/g, /[\362-\370]/g,	// O, o
		/[\331-\334]/g, /[\371-\374]/g,	// U, u
		/[\321]/g, /[\361]/g,		// N,
		/[\307]/g, /[\347]/g,		// C, c
	];
	const chars = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
	let i;
	for (i = 0; i < diacritics.length; i++)
		s = s.replace(diacritics[i],chars[i]);
	return s;
}

function sanitizeTitle(str)
{
	if(str === undefined || str === null)
		return;
	let s;
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
	let i, labels, longestlabel, h;
	deleteEmptyElements("h1");
	deleteEmptyElements("h2");
	deleteEmptyElements("h3");

	if(!s)
		s = sanitizeTitle(chooseDocumentHeading());
	else
		s = sanitizeTitle(s);

	if(s.indexOf("Thread - ") !== -1)
		s = s.substr(s.indexOf("Thread - ") + 9);

	if(!(getOne("h1") && getOne("h1").innerHTML === s))
	{
		h = createElement("h1", { textContent: s });
		document.body.insertBefore(h, document.body.firstChild);
	}
	// Append domain name to title for easy searching
	if(location.hostname.length > 0)
	{
		let hn = location.hostname.replace(/www\./, '');
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
	const selection = window.getSelection();
	let s;
	if(selection.toString().length) s = selection;
	else s = prompt("Document title");
	setDocTitle(s);
}

function zeroPad(n)
{
	n += '';
	if(n.length < 2) n = '0' + n;
	return n;
}

function appendInfo()
{
	let url, h, a;
	if(window.location.href.indexOf("file:///") >= 0) return;
	if(document.getElementsByTagName("h4").length)
	{
		const hh = document.getElementsByTagName("h4");
		if(hh[hh.length - 1].textContent.indexOf("URL:") === 0) return;
	}

	h = document.createElement("h4");
	a = document.createElement("a");
	const s = window.location.toString().split("/");
	a.href = a.textContent = s[0] + "//" + s[2];
	a.textContent = "Domain: " + a.textContent;
	h.appendChild(a);
	document.body.appendChild(h);

	const saveTime = getTimestamp();
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
	const f = document.getElementsByTagName("font");
	const replacements = [];
	let h;
	for (let i = 0, ii = f.length; i < ii; i++)
	{
		if(f[i].getAttribute("size"))
		{
			let hl = f[i].getAttribute("size");
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
				default: h = document.createElement("p"); break;
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
	for (let i = f.length - 1; i >= 0; i--)
	{
		f[i].parentNode.replaceChild(replacements[i], f[i]);
	}
}

function removeAttributes()
{
	const t1 = performance.now();
	const x = document.getElementsByTagName('*');
	document.body.removeAttribute("background");
	for (let i = 0; i < x.length; i++)
	{
		if(x[i].attributes)
		{
			const attrs = x[i].attributes;
			for (let j = attrs.length - 1; j >= 0; j--)
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
	const t2 = performance.now();
	xlog(t2 - t1 + "ms: removeAttributes");
}

function removeAttributesOf(selector, attribute)
{
	const e = get(selector);
	var i = e.length;
	while(i--)
		e[i].removeAttribute(attribute);
}

function removeAttributes_regex()
{
	const t1 = performance.now();
	document.body.removeAttribute("background");
	document.body.innerHTML = document.body.innerHTML.replace(/(<[^ai][a-z0-9]*) [^>]+/gi, '$1');
	const t2 = performance.now();
	xlog((t2-t1) + "ms: removeAttributes_regex");
}

function forAll(selector, callback)
{
	const e = get(selector);
	let i = e.length;
	while (i--)
		callback(e[i]);
}

function delNewlines()
{
	const paragraphs = document.getElementsByTagName("p");
	let i = paragraphs.length;
	while (i--)
	{
		const s = paragraphs[i].textContent.replace(/\s/g, '');
		if(s.length === 0 && !paragraphs[i].getElementsByTagName("img").length)
		{
			paragraphs[i].parentNode.removeChild(paragraphs[i]);
		}
	}
}

function trim(s)
{
	return s.replace(/^\s+/, '').replace(/\s+$/, '');
}

function ltrim(str1)
{
	return str1.replace(/^\s+/, '');
}

function normalizeWhitespace(s)
{
	return(s.replace(/\s+/g, " "));
}

function cleanupHeadings()
{
	const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];
	let i = headings.length;
	while (i--)
	{
		const h = get(headings[i]);
		let j = h.length;
		while (j--)
		{
			let s = h[j].innerHTML;
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
	const divs = get("div");
	let i = divs.length;
	while (i--)
	{
		if(divs[i].getElementsByTagName("div").length) continue;
		let s = divs[i].innerHTML;
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
	let e, i, j, tags, s, len;
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
				if(e[i].querySelector(tags[j]).textContent && removeWhitespace(e[i].querySelector(tags[j]).textContent) === s)
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
	replaceElementsBySelector(".parah2", "h2");
	replaceElementsBySelector(".parah3", "h3");
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
	const tags = ["ul", "ol"];
	let i, j, k, kk;
	for(k = 0, kk = tags.length; k < kk; ++k)
	{
		const e = get(tags[k]);
		i = e.length;
		while (i--)
		{
			if(removeWhitespace(e[i].textContent).length === 0 && e[i].getElementsByTagName("img").length === 0)
			{
				e[i].parentNode.removeChild(e[i]);
				break;
			}
			const f = e[i].querySelector("a");
			j = f.length;
			while (j--)
			{
				// if a list contains only links, it's likely not content
				if(f[j].textContent.length && f[j].getElementsByTagName("a").length === 1)
				{
					const g = f[j].querySelector("a");
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
	switch (location.hostname)
	{
		case 'mail.google.com':
		case 'accounts.google.com':
			location.href = 'https://accounts.google.com/Logout';
			return;
	}
	let e, i, ii, found = false, s;
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
				showMessage(e[i].href, "messagebig");
				e[i].classList.add("hl");
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
				e[i].classList.add("hl");
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
					e[i].classList.add("hl");
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
					e[i].classList.add("hl");
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
	let i, found = false;
	const e = get("a");
	i = e.length;
	while(i--)
	{
		if(e[i].href && removeWhitespace(e[i].href).toLowerCase().indexOf("print") >= 0)
		{
			found = true;
			const printLink = createElement("a", { href: e[i].href, textContent: "Print" });
			document.body.insertBefore(createElementWithChild("h2", printLink), document.body.firstChild);
			printLink.focus();
			break;
		}
	}
	if(!found)
	{
		showMessage("Print link not found", "messagebig");
	}
}

function handleBlockEditClick(e)
{
	e.stopPropagation();
	let targ;
	let ctrlOrMeta = "ctrlKey";
	if(navigator.userAgent.indexOf("Macintosh") !== -1)
		ctrlOrMeta = "metaKey";
	if(!e) e = window.event;
	if(e.target)
	{
		targ = e.target;
	}
	const tn = targ.tagName.toLowerCase();
	// Get clicked element
	if(e[ctrlOrMeta] && e.shiftKey)
	{
		document.body.innerHTML = targ.innerHTML;
		toggleBlockEditMode();
		return;
	}
	// delete clicked element
	else if(e[ctrlOrMeta] && !e.shiftKey)
	{
		if(targ.tagName.toLowerCase() === 'body') return;
		if(tn === "li" || tn === "p")
		{
			targ = targ.parentNode;
		}
		targ.parentNode.replaceChild(document.createTextNode(""), targ);
		return false;
	}
	// append clicked element to a div
	else if(e.shiftKey)
	{
		if(!document.getElementById("newbody"))
		{
			const newbody = document.createElement("div");
			newbody.id = "newbody";
			document.body.appendChild(newbody);
		}
		if(targ.tagName.toLowerCase() === 'body')
			return;
		document.getElementById("newbody").appendChild(targ);
	}
	return true;
}

function parseCode(s)
{
	let t = "";
	let cur, prev, next;
	let phpVarRegex;
	let i, ii;
	for(i = 0, ii = s.length; i < ii; i++)
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
	const t1 = performance.now();
	fixPres();
	restorePres();

	const preBlocks = get("pre");
	let i = preBlocks.length;
	while (i--)
	{
		// delete the <pre>s that only contain line numbers
		if(preBlocks[i].textContent && preBlocks[i].textContent.match(/[a-z]/) === null)
		{
			preBlocks[i].parentNode.removeChild(preBlocks[i]);
			continue;
		}

		let s = preBlocks[i].innerHTML, r;
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
			const keywords = [
				"abstract", "addEventListener", "appendChild", "object", "prototype", "break", "byte", "case", "catch", "char", "class", "const", "continue",
				"debugger", "default", "delete", "do", "document", "documentElement", "double",
				"else", "enum", "export", "extends", "false", "final", "finally", "firstChild", "float", "for", "function",
				"getElementsByClassName", "getElementsByID", "getElementsByTagName", "goto", "if", "implements", "import", "in", "insertBefore",
				"long", "NaN", "native", "new", "null", "onclick", "onload", "onmouseover", "package", "private", "protected", "public", "querySelector", "querySelectorAll", "return",
				"src", "static", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "type", "typeof", "undefined",
				"let", "void", "volatile", "while", "with", "window", "script", "javascript", "document", "createElement", "createTextNode", "getElementsByTagName"
			];
			let j = keywords.length;
			while (j--)
			{
				r = new RegExp("\\b" + keywords[j] + "\\b", "g");
				s = s.replace(r, "<xk>" + keywords[j] + "</xk>");
			}
		}
		preBlocks[i].innerHTML = s;
	}
	// un-highlight elements in comments
	forAll("c1", htmlToText);
	forAll("c2", htmlToText);
	const t2 = performance.now();
	xlog(t2 - t1 + "ms: highlightCode");
}

function htmlToText(elem)
{
	elem.innerHTML = elem.textContent;
}

function delClassContaining(classes)
{
	const todel = [];
	const x = get("div");
	let i = x.length;
	while (i--)
		if(x[i].className && x[i].className.length && containsAnyOfTheStrings(x[i].className, classes))
			todel.push(x[i]);
	i = todel.length;
	while(i--)
		del(todel[i]);
}

function getElementsWithClass(strClass)
{
	if(!strClass || strClass.length === 0)
		return;
	if(strClass.indexOf(".") !== 0)
		strClass = "." + strClass;
	const e = get(strClass);
	const tempNode = createElement("div", { id: "replacerDiv" });
	let i;
	if(e && e.length)
	{
		for(i = 0; i < e.length; i++)
			tempNode.appendChild(e[i].cloneNode(true));
		document.body.innerHTML = tempNode.innerHTML;
	}
	else if(e)
	{
		document.body.innerHTML = "";
		document.body.appendChild(e.cloneNode(true), document.body.firstChild);
	}
	else
	{
		showMessage(strClass + " not found", "messagebig");
	}
}

function getElementsContainingText()
{
	const selector = prompt("Get elements containing text by selector: ");
	let text;
	if(selector !== "img")
	{
		text = prompt("And containing text");
	}
	if(!selector.length)
		return;
	let i, ii;
	const t1 = performance.now();
	const e = get(selector);
	const tempNode = document.createElement("div");
	if(text && text.length)
	{
		for(i = 0, ii = e.length; i < ii; i++)
			if(e[i].textContent && e[i].textContent.indexOf(text) !== -1 && !e[i].querySelector(selector))
				tempNode.appendChild(e[i]);
	}
	else
	{
		if(e.length)
			for(i = 0, ii = e.length; i < ii; i++)
				tempNode.appendChild(e[i]);
		else
			tempNode.appendChild(e);
	}
	if(tempNode.innerHTML.length)
		document.body.innerHTML = tempNode.innerHTML;
	else
		showMessage("Not found", "messagebig");
	const t2 = performance.now();
	xlog((t2 - t1) + "ms: getElementsContainingText");
}

function retrieve(selector)
{
	let i, ii;
	const e = get(selector);
	const tempNode = document.createElement("div");
	if(e.length)
	{
		for(i = 0, ii = e.length; i < ii; i++)
			tempNode.appendChild(e[i]);
	}
	else
	{
		tempNode.appendChild(e);
	}
	if(tempNode.innerHTML.length)
		document.body.innerHTML = tempNode.innerHTML;
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
	const sClass = "toget";

	replaceElementsBySelector("article", "div");
	deleteNonContentElements();
	deleteNonContentImages();
	deleteEmptyElements("p");
	deleteEmptyElements("div");

	// tags which are used to mark content divs
	// if a div contains any of these tags, we want to retain it
	const tags = ["p", "img", "h1", "h2", "pre", "ol", "cite"];
	let j = tags.length;
	let i, ii;
	while(j--)
	{
		const e = get(tags[j]);
		for(i = 0, ii = e.length; i < ii; i++)
		{
			if(e[i].parentNode)
				e[i].parentNode.className = sClass;
		}
	}
	// if the <body> has a .toget class, it will be appended to the existing <body>
	document.body.classList.remove("toget");
	const e = get("div");
	i = e.length;
	while(i--)
	{
		if(e[i].className.indexOf(sClass) === -1 && !e[i].getElementsByClassName(sClass).length)
			e[i].className = "hl";
	}
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
	insertStyleHighlight();
	let numParas;
	let e = document.querySelectorAll("div, article, main, section");
	let i = e.length;
	let highestNumParas = 0;
	while(i--)
	{
		numParas = e[i].getElementsByTagName("p").length;
		e[i].setAttribute("data-pcount", numParas);
		if(numParas > highestNumParas)
			highestNumParas = numParas;
	}
	if(highestNumParas === 0)
	{
		showMessage("No paragraphs found", "h2", true);
		return;
	}
	else
		showMessage("Highest paragraph count is " + highestNumParas);
	i = e.length;
	while(i--)
	{
		numParas = parseInt(e[i].getAttribute("data-pcount"), 10);
		if(numParas === highestNumParas)
		{
			e[i].className = "hl";
			break;
		}
	}
	e = get("h1, h2, h3, h4, h5, h6");
	i = e.length;
	while(i--)
	{
		e[i].className = "hl";
	}
	e = get(".hl h1, .hl h2");
	i = e.length;
	while(i--)
		e[i].className = "";
}

function deleteSpecificEmptyElements()
{
	deleteEmptyElements("p");
	deleteEmptyElements("tr");
	deleteEmptyElements("li");
	deleteEmptyElements("div");
	deleteEmptyElements("figure");
	deleteEmptyHeadings();
}

function deleteEmptyElements(tag)
{
	const e = get(tag);
	let i = e.length;
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
	const tags = ["h1", "h2", "h3", "h4", "h5", "h6"];
	let i, j;
	for (j = tags.length - 1; j >= 0; j--)
	{
		const e = document.getElementsByTagName(tags[j]);
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
	const specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g");
	return str.replace(specials, "\\$&");
}

function getSelectionHTML()
{
	let range;
	let userSelection;
	if(window.getSelection)
	{
		userSelection = window.getSelection();
		if(userSelection.getRangeAt)
		{
			range = userSelection.getRangeAt(0);
		}
		else
		{
			range = document.createRange();
			range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
			range.setEnd(userSelection.focusNode, userSelection.focusOffset);
		}
		// And the HTML:
		const clonedSelection = range.cloneContents();
		const div = document.createElement('div');
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
	let selection, selectionBegin, selectionEnd, node, nodeHTML, j, index1, index2, index3, index4;
	let textBeforeSelection, textOfSelection, textAfterSelection;
	if(!window.getSelection().toString().length) return;
	selection = window.getSelection();
	node = selection.anchorNode;
	while (node.nodeType !== 1 && node.parentNode)
		node = node.parentNode;
	if(node.tagName === undefined)
	{
		showMessage("Couldn't get anchorNode", "messagebig");
		return;
	}
	if(!node) return;
	selection = removeLineBreaks(selection.toString());
	nodeHTML = node.innerHTML;
	nodeHTML = removeLineBreaks(nodeHTML);
	if(selection.length)
	{
		// Simplest case - it's all plain text
		index1 = nodeHTML.indexOf(selection);
		if(index1 !== -1)
		{
			index2 = index1 + selection.length;
			// expand to word boundaries
			while(nodeHTML[index1].match(/[^ <>]/) && index1 > 0)
				index1--;
			if(index1 > 0) index1++;
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
			xlog("HTML in selection", "h3");
			selectionBegin = selection;
			while(nodeHTML.indexOf(selectionBegin) === -1 && selectionBegin.length > 0 )
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
	replaceElementsBySelector('font', 'span');
	let e, i, s, temp;
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
			s = s.replace(/ {2}/g, "GYZYtab");
		} else if(s.match("\n   [^ ]")) {
			s = s.replace(/ {3}/g, "GYZYtab");
		} else if(s.match("\n    [^ ]")) {
			s = s.replace(/ {4}/g, "GYZYtab");
		} else {
			s = s.replace(/ {4}/g, "GYZYtab");
		}
		s = s.replace(/\t/g, "GYZYtab");
		s = s.replace(/\r\n/g, "GYZYnl");
		s = s.replace(/\n/g, "GYZYnl");
		e[i].innerHTML = s;
	}
}

function restorePres()
{
	const e = get("pre");
	let i, ii;
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
	let s = document.body.innerHTML;
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
	const tags = ["div", "td"];
	let j = tags.length;
	while(j--)
	{
		const e = get(tags[j]);
		let i = e.length;
		while(i--)
		{
			if(e[i].innerHTML.indexOf("________") >= 0 && !e[i].getElementsByTagName(tags[j]).length)
			{
				e[i].innerHTML = e[i].innerHTML.substr(0, e[i].innerHTML.indexOf("________")-1);
			}
		}
	}
}

function deleteElementsContainingText(selector, str)
{
	let sel, text;
	if (! (selector && str))
	{
		sel = prompt("Delete elements containing text");
		text = prompt("Containing text");
		if (sel.length)
		{
			if(text.length)
			{
				if (sel === "img") deleteImagesBySrcContaining(text);
				else deleteElementsContainingText(sel, text);
			}
			else
			{
				del(sel);
			}
		}
		return;
	}
	const e = get(selector);
	if (!e) return;
	if (e.length)
	{
		let i = e.length;
		while (i--)
		{
			if (e[i].querySelector(selector)) continue;
			if (e[i].textContent.indexOf(str) >= 0)
				e[i].parentNode.removeChild(e[i]);
		}
	}
	else if (e.parentNode)
	{
		e.parentNode.removeChild(e);
	}
}

function highlightSpecificNodesContaining()
{
	showMessage("Highlight specific nodes containing text", "messagebig");
	const s = prompt("Find text");
	if(!(s && s.length))
		return;
	const tagNames = ["p", "h1", "h2", "h3", "tr", "li"];
	let i, ii;
	for(i = 0, ii = tagNames.length; i < ii; i++)
		highlightNodesContaining(tagNames[i], s);
}

function highlightAllTableCellsInRow(tr)
{
	const e = tr.querySelectorAll("td");
	let i = e.length;
	while(i--)
		e[i].innerHTML = "<mark>" + e[i].innerHTML + "</mark>";
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
	const e = document.querySelectorAll(selector);
	let i = e.length;
	while (i--)
	{
		if(e[i].querySelectorAll(selector).length)
			continue;
		if(e[i].textContent.indexOf(str) !== -1)
		{
			e[i].classList.add("hl");
			if(e[i].tagName.toLowerCase() === "tr")
				highlightAllTableCellsInRow(e[i]);
			else
				e[i].innerHTML = "<mark>" + e[i].innerHTML + "</mark>";
		}
		if(selector.toLowerCase() === "a")
		{
			if(e[i].href && e[i].href.indexOf(str) >= 0)
			{
				e[i].classList.add("hl");
				e[i].innerHTML = "<mark>" + e[i].innerHTML + "</mark>";
			}
		}
	}
}

function highlightLinksWithHrefContaining(str)
{
	if(!arguments.length)
	{
		str = prompt("Containing text");
		if( !str.length ) return;
	}
	const e = document.getElementsByTagName("a");
	let i = e.length;
	while (i--)
		if(e[i].href.indexOf(str) >= 0)
			e[i].innerHTML = "<mark>" + e[i].innerHTML + "</mark>";
}

function getLinksWithHrefContaining(str)
{
	if(!arguments.length)
	{
		str = prompt("Containing text");
		if( !str.length ) return;
	}
	highlightLinksWithHrefContaining(str);
	let newLink, newLinkWrapper;
	const e = get("a");
	let i, ii;
	const container = document.createElement("div");
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].href.indexOf(str) >= 0 || (e[i].title && e[i].title.indexOf(str) >= 0))
		{
			newLink = createElement("a", { href: e[i].href, textContent: e[i].href});
			newLinkWrapper = createElementWithChild("h6", newLink);
			container.appendChild(newLinkWrapper);
		}
	}
	document.body.insertBefore(container, document.body.firstChild);
}

function xlog(str, logTag)
{
	let tag;
	if(logTag && logTag.length)
		tag = logTag;
	else
		tag = "h6";
	Nimbus.logString += '<' + tag + ' class="xlog">' + str + '</' + tag + '>\r\n';
}

function ylog(str, tag, prepend)
{
	const tagName = tag || "h6";
	const logElement = createElement(tagName, { className: "xlog", innerHTML: str });
	if(prepend)
		document.body.insertBefore(logElement, document.body.firstChild);
	else
		document.body.appendChild(logElement);
}

function log2(str)
{
	document.body.appendChild(createElement("h2", { className: "xlog", innerHTML: str }));
}

function deleteImagesBySrcContaining(str)
{
	const elems = document.getElementsByTagName("img");
	let i = elems.length;
	while (i--)
	{
		if(elems[i].src.indexOf(str) >= 0)
		{
			xlog("Deleting image with src " + elems[i].src);
			elems[i].parentNode.removeChild(elems[i]);
		}
	}
}

function cleanupWikipedia()
{
	cleanupHead();
	const firstHeading = getOne("h1");
	document.title = firstHeading.textContent;
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

function getKeys(obj)
{
	const keys = [];
	let key;
	for(key in obj)
		if(obj.hasOwnProperty && obj.hasOwnProperty(key))
			keys.push(key);
	return keys;
}

function getAttributes(targ)
{
	const divText = document.createElement('div');
	if(targ.tagName)
		divText.innerHTML = "\r\n<b>" + targ.tagName.toLowerCase() + "</b>";
	if(targ.attributes)
	{
		const ta = targ.attributes;
		let str = ' ';
		for (let i = 0; i < ta.length; i++)
		{
			if(ta[i])
			{
				str += "<em>" + ta[i].name + "</em> ";
				if(removeWhitespace(ta[i].value) != "hovered")
				{
					str += '="' + ta[i].value + '" ';
					str = str.replace(/hovered/g, '');
				}
			}
		}
		divText.innerHTML += str;
		str = '';
		const k = getKeys(targ);
		for (let i = 0; i < k.length; i++)
			if(k[i] !== 'addEventListener') str += k[i] + ' ';
		const events = document.createElement('em');
		events.appendChild(document.createTextNode(str));
		divText.appendChild(events);
		const analyzerdiv = document.getElementById("analyzer");
		analyzerdiv.appendChild(divText);
	}
}

function removeClassFromAll(className)
{
	const e = document.querySelectorAll("." + className);
	let i = e.length;
	while(i--)
		e[i].classList.remove(className);
}

function analyze_mouseoverHandler(e)
{
	const b = document.getElementById("analyzer");
	b.innerHTML = '';
	b.appendChild(document.createTextNode(''));
	e.stopPropagation();
	let targ;
	// if(!e) e = window.event;
	if(e.target)
	{
		targ = e.target;
		removeClassFromAll("hovered");
		targ.classList.add("hovered");
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
	let s = document.body.innerHTML;
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
		const b = document.createElement("div");
		b.id = "analyzer";
		if(onTop)
			b.className = "onTop";
		document.body.insertBefore(b, document.body.firstChild);
		document.body.addEventListener('mouseover', analyze_mouseoverHandler, false);
		document.body.addEventListener('click', analyze_clickHandler, false);
		document.body.classList.add("analyzer");

		const s = 'body.analyzer { padding-bottom: 300px; }' +
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
		document.body.classList.remove("analyzer");
		removeClassFromAll("hovered");
	}
}

function analyze_clickHandler(e)
{
	e.stopPropagation();
	if(e.shiftKey && get("#analyzer"))
		prompt("", get("#analyzer").textContent);
}

function wrapElement(node, tag)
{
	let s = node.outerHTML;
	s = "<" + tag + ">" + s + "</" + tag + ">";
	node.outerHTML = s;
}

function isCurrentDomainLink(s)
{
	const urlSegments = s.split("/");
	if(urlSegments[2] === location.hostname)
	{
		if(urlSegments.length === 3)
			return true;
		if(urlSegments.length === 4 && urlSegments[urlSegments.length - 1].length === 0)
			return true;
	}
	return false;
}

function replaceIncorrectHeading()
{
	let heading1, heading1link, temp;
	if(get("h1"))
	{
		heading1 = getOne("h1");
		heading1link = heading1.querySelector("a");
		if(heading1link)
		{
			if(isCurrentDomainLink(heading1link.href))
			{
				temp = createElement("h3", { innerHTML: heading1.innerHTML });
				heading1.parentNode.replaceChild(temp, heading1);
			}
		}
	}
}

function focusField(elem)
{
	if(!elem)
		return;
	removeClassFromAll("focused");
	elem.focus();
	elem.classList.add("focused");
	showMessage(elem.name || elem.id || elem.className, "messagebig");
}

function focusFormElement()
{
	let len, i, ii, found;
	let inputs = get("input");
	const e = [];
	len = inputs.length;
	if(len === 1)
	{
		focusField(inputs[0]);
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
			if(["hidden", "submit", "reset", "button", "radio", "checkbox", "image"].indexOf(inputs[i].type) === -1)
				e.push(inputs[i]);
		}
		else
			e.push(inputs[i]);
	}
	inputs = get("textarea");
	len = inputs.length;
	for (i = 0; i < len; i++)
		e.push(inputs[i]);
	found = false;
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].classList.contains("focused"))
		{
			found = true;
			if(i < ii-1)
				focusField(e[i + 1]);
			else
				focusField(e[0]);
			break;
		}
	}
	if(!found)
		focusField(e[0]);
	console.log("document.activeElement is " + document.activeElement.name);
}

function focusButton()
{
	let len, i, ii, found;
	const inputFields = [];
	const inputs = get("input");
	len = inputs.length;
	if(len === 1)
	{
		focusField(inputs[0]);
		return;
	}
	for (i = 0; i < len; i++)
	{
		if(inputs[i].type && (inputs[i].type === "button" || inputs[i].type === "submit"))
			inputFields.push(inputs[i]);
	}
	const buttons = get("button");
	len = buttons.length;
	for (i = 0; i < len; i++)
		inputFields.push(buttons[i]);
	found = false;
	for(i = 0, ii = inputFields.length; i < ii; i++)
	{
		if(inputFields[i].classList.contains("focused"))
		{
			found = true;
			if(i < ii-1)
				focusField(inputFields[i+1]);
			else
				focusField(inputFields[0]);
			break;
		}
	}
	if(!found)
		focusField(inputFields[0]);
}

function highlightText(s)
{
	if(!s)
		s = prompt("Text to highlight");
	const ss = "\\b" + escapeForRegExp(s) + "\\b";
	let tempHTML = document.body.innerHTML;
	const r = new RegExp("(>[^<>]*)" + ss + "([^<>]*<)", "gi");
	tempHTML = tempHTML.replace(r, "$1<samp>" + s + "</samp>$2");
	document.body.innerHTML = tempHTML;
}

function showLog(prepend)
{
	let logDiv;
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
		ylog("No logs");
}

function highlightLinksInPres()
{
	fixPres();
	restorePres();
	const e = get("pre");
	let i, ii;
	for ( i = 0, ii = e.length; i < ii; i++ )
		if( e[i].textContent.match(/http[s]*:\/\/[^\s\r\n]+/g) )
			e[i].innerHTML = e[i].innerHTML.replace(/(http[s]*:\/\/[^\s\r\n]+)/g, '<a href="' + "$1" + '">' + "$1" + '</a>');
}

function fillForms()
{
	let i, j, jj, e, f, inputType, inputName;
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
		f = e[i].getElementsByTagName("option");
		for(j = 0, jj = f.length; j < jj; j++)
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

function createElementWithChild(tag, childElement)
{
	const e = document.createElement(tag);
	e.appendChild(childElement);
	return e;
}

function showTextToHTMLRatio()
{
	let text, html;
	const e = get("div");
	let i = e.length;
	while(i--)
	{
		text = e[i].textContent;
		html= e[i].innerHTML;
		if(text && html)
			e[i].innerHTML = "<mark>" + Math.floor(text.length / html.length) + "</mark>" + e[i].innerHTML;
	}
}

function removeAccesskeys()
{
	const e = get("a");
	let i = e.length;
	while(i--)
		e[i].removeAttribute("accesskey");
}

function showPassword()
{
	const e = get("input");
	let i = e.length;
	while(i--)
	{
		if(e[i].type && e[i].type === "password" && !e[i].classList.contains("showPassword"))
		{
			e[i].addEventListener("keyup", echoPassword, false);
			e[i].classList.add("showPassword");
		}
	}
}

function echoPassword(e)
{
	showMessage(e.target.value, "none", true);
}

function getTimestamp()
{
	const d = new Date();
	return d.getFullYear() + "/" + zeroPad(d.getMonth() + 1) + "/" + zeroPad(d.getDate()) + " " + zeroPad(d.getHours()) + ":" + zeroPad(d.getMinutes()) + ":" + zeroPad(d.getSeconds());
}

function hasClassesContaining(element, arrStr)
{
	const classes = element.className;
	let i = arrStr.length;
	while(i--)
		if(~classes.indexOf(arrStr[i]))
			return true;
	return false;
}

function replaceSingleElement(e, tag)
{
	e.parentNode.replaceChild(createElement(tag, { innerHTML: e.innerHTML }), e);
}

function createTagsByClassName()
{
	let element, e = document.querySelectorAll("div, p");
	let i = e.length;
	while (i--)
	{
		element = e[i];
		if (hasClassesContaining(element, ["cn", "ct", "heading", "chapternumber", "chaptertitle"])) replaceSingleElement(element, "h2");
		else if (hasClassesContaining(element, ["h1"])) replaceSingleElement(element, "h1");
		else if (hasClassesContaining(element, ["h2"])) replaceSingleElement(element, "h2");
		else if (hasClassesContaining(element, ["block", "quote", "extract"])) replaceSingleElement(element, "blockquote");
	}
	e = get("span");
	i = e.length;
	while (i--)
	{
		element = e[i];
		if (hasClassesContaining(element, ["bold"])) replaceSingleElement(element, "b");
		else if (hasClassesContaining(element, ["italic"])) replaceSingleElement(element, "b");
	}
}

function makeHeadingsByTextLength()
{
	let e = get("div, p");
	let i = e.length, ii;
	const classes = {};
	let headingClasses = [];
	let strClass;
	while(i--)
	{
		strClass = e[i].className.replace(/\s+/, "");
		if(strClass.length && !classes[strClass])
		{
			classes[strClass] = null;
		}
	}
	let className;
	let selector;
	let averageTextLength;
	for(className in classes)
	{
		selector = "." + className;
		if(selector.length < 2) continue;
		e = get(selector);
		i = e.length;
		let textLength = 0;
		while(i--)
		{
			if(e[i].textContent.length)
				textLength += e[i].textContent.length;
		}
		averageTextLength = Math.floor(textLength / e.length);
		if(averageTextLength < 80 && averageTextLength > 2 && e.length > 4)
		{
			headingClasses.push({
				className: className,
				averageTextLength: averageTextLength
			});
		}
	}
	console.table(headingClasses);
	headingClasses = headingClasses.sort(function(a, b){
		if(a.averageTextLength > b.averageTextLength) return 1;
		else if(a.averageTextLength < b.averageTextLength) return -1;
		else return 0;
	});
	// headingClasses = headingClasses.slice(0, 6);
	// let headingLevel = 1;
	for(i = 0, ii = headingClasses.length; i < ii; i++)
	{
		// replaceElementsBySelector("." + headingClasses[i].className, "h" + headingLevel++);
		replaceElementsBySelector("." + headingClasses[i].className, "h3");
	}
}

function formatEbook()
{
	createTagsByClassName();
	makeHeadingsByTextLength();
}

function showMutations(mutations)
{
	let i, ii, j, jj, mutation;
	for(i = 0, ii = mutations.length; i < ii; i++)
	{
		mutation = mutations[i];
		console.log(mutation);
		if (mutation.addedNodes.length)
		{
			for(j = 0, jj = mutation.addedNodes.length; j < jj; j++)
			{
				console.log(mutation.addedNodes[j].outerHTML);
			}
		}
	}
}

function observeAddedNodes()
{
	const observer = new MutationObserver(showMutations);
	observer.observe(getOne("body"),{ childList: true });
	showMessage("Observing added nodes", "messagebig");
}

function insertTab(evt)
{
	const targ = evt.target;
	evt.preventDefault();
	evt.stopPropagation();
	const iStart = targ.selectionStart;
	const iEnd = targ.selectionEnd;
	targ.value = targ.value.substr(0, iStart) + '\t' + targ.value.substr(iEnd, this.value.length);
	targ.setSelectionRange(iStart + 1, iEnd + 1);
}

function handleJSConsoleInput(evt)
{
	const inputText = getOne("#userInput").value;
	if (!inputText) return;
	const ctrlOrMeta = ~navigator.userAgent.indexOf("Macintosh") ? "metaKey" : "ctrlKey";
	if (evt.keyCode === 13 && evt[ctrlOrMeta])
	{
		eval(inputText);
	}
	else if (evt.keyCode === 9)
	{
		insertTab(evt);
		return false;
	}
}

function handleCSSConsoleInput(evt)
{
	const inputText = getOne("#userInput").value;
	if (!inputText) return;
	const ctrlOrMeta = ~navigator.userAgent.indexOf("Macintosh") ? "metaKey" : "ctrlKey";
	if (evt.keyCode === 13 && evt[ctrlOrMeta])
	{
		insertStyle(inputText, "userStyle", true);
	}
	else if (evt.keyCode === 9)
	{
		insertTab(evt);
		return false;
	}
}

function toggleConsole(inputHandler)
{
	if (get("#userInputWrapper"))
	{
		del("#userInputWrapper");
		del("#styleUserInputWrapper");
		return;
	}
	const style = '#userInputWrapper { position: fixed; bottom: 0; left: 0; right: 0; height: 30vh; z-index: 1000000000; }' +
		'#userInput { background: #000; color: #FFF; font: bold 18px Consolas, monospace; width: 100%; height: 100%; padding: 10px; }';
	insertStyle(style, "styleUserInputWrapper", true);
	const inputTextareaWrapper = createElement("div", { id: "userInputWrapper" });
	const inputTextarea = createElement("textarea", { id: "userInput" });
	if(inputHandler)
		inputTextarea.addEventListener("keydown", inputHandler);
	inputTextareaWrapper.appendChild(inputTextarea);
	document.body.appendChild(inputTextareaWrapper);
	inputTextarea.focus();
}

function markDivDepth()
{
	const divs = get("div");
	let i = divs.length;
	let node, level;
	while(i--)
	{
		node= divs[i];
		level = 0;
		while(node.parentNode)
		{
			node = node.parentNode;
			level++;
		}
		divs[i].className = "level" + level;
	}
	showDocumentStructureWithNames();
}

function numberDivs()
{
	const e = get("section, div");
	let i = e.length;
	while(i--)
		e[i].id = "i" + i;
	showDocumentStructureWithNames();
}

function delRange(m, n)
{
	if(m >= n)
		return;
	for(let i = m; i < n; i++)
		del("#i" + i);
}

function isEntirelyNumeric(s)
{
	s = removeWhitespace(s);
	if(!s.length)
		return false;
	if(!s.replace(/[0-9]+/g, "").length)
		return true;
	return false;
}

function getPagerLinks()
{
	const e = get("a");
	let i, ii;
	const pagerWrapper = createElement("h1", { textContent: "Pages: " });
	let count = 0;
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(isEntirelyNumeric(e[i].textContent))
		{
			count++;
			pagerWrapper.appendChild(createElement("a", { href: e[i].href, textContent: e[i].textContent || "[no text]" }));
			pagerWrapper.appendChild(document.createTextNode(" "));
		}
	}
	if(count)
	{
		document.body.appendChild(pagerWrapper);
		pagerWrapper.querySelector("a").focus();
	}
	else
		showMessage("No pager links found", "messagebig");
	createPagerFromSelect();
}

function createPagerFromSelect()
{
	const selects = get("select");
	let j = selects.length;
	let i, ii;
	while (j--)
	{
		const select = selects[j];
		for (i = 0, ii = select.length; i < ii; i++)
		{
			const pagerWrapper = createElement("h1");
			pagerWrapper.appendChild(createElement("a", { href: select[i].value, textContent: select[i].textContent || i + 1 }));
			document.body.appendChild(pagerWrapper);
		}
	}
	document.body.appendChild(createElement("hr"));
}

function getAllClasses(selector)
{
	let sel = "*";
	if(selector && selector.length)
		sel = selector;
	const e = document.getElementsByTagName(sel);
	let i = e.length;
	const classes = {};
	let s = "";
	let j;
	while(i--)
	{
		j = e[i].classList.length;
		while(j--)
		{
			classes[e[i].classList[j]] = true;
		}
	}
	let prop;
	for(prop in classes)
		s += prop + "\r\n";
	console.log(s);
}

function revealLinkHrefs()
{
	const e = get("a");
	let i = e.length;
	while(i--)
		e[i].textContent = e[i].getAttribute("href");
}

function humanizeUrl(s)
{
	const matches = s.match(/[0-9A-Za-z_\-\+]+/g);
	if(!matches)
		return s;
	let i = matches.length;
	let longestMatch = matches[i - 1];
	while(i--)
		if(matches[i].length > longestMatch.length)
			longestMatch = matches[i];
	return longestMatch;
}

function revealEmptyLinks()
{
	const e = get("a");
	let i = e.length;
	while(i--)
		if(!e[i].textContent.length && e[i].href.length)
			e[i].textContent = humanizeUrl(e[i].href);
}

function inject()
{
	deleteUselessIframes();
	document.body.classList.add("nimbusDark");
	document.addEventListener("keydown", handleKeyDown, false);
	showPassword();
	removeAccesskeys();
	insertStyleHighlight();
	xlog("Referrer: " + document.referrer);
	xlog("Page loaded at " + getTimestamp());
	doStackOverflow();
}

function main()
{
	let load = true;
	if(location.hostname)
	{
		switch (location.hostname)
		{
			case "maps.google.com.au":
			case "maps.google.com":
				load = false;
				break;
			case "en.wikipedia.org":
			case "secure.wikimedia.org":
				cleanupWikipedia();
				break;
		}
	}
	if(load)
		setTimeout(inject, 200);
	else
		showMessage("Not injected", "messagebig");
}

//
//
//	Keyboard shortcuts
//
//
function handleKeyDown(e)
{
	let shouldPreventDefault = true;
	let ctrlOrMeta = "ctrlKey";
	if(navigator.userAgent.indexOf("Macintosh") !== -1)
		ctrlOrMeta = "metaKey";
	if(!(e.altKey || e.shiftKey || e[ctrlOrMeta]))
	{
		return;
	}
	const db = document.body;
	const k = e.keyCode;
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
			case KEYCODES.NUMPAD4: forceReloadCss(); break;
			case KEYCODES.F1: makeHeadingFromSelection("h1"); break;
			case KEYCODES.F2: makeHeadingFromSelection("h2"); break;
			case KEYCODES.F3: makeHeadingFromSelection("h3"); break;
			case KEYCODES.ZERO: setDocTitleFromSelection(); break;
			case KEYCODES.ONE: cleanupGeneral(); break;
			case KEYCODES.TWO: deleteImages(); break;
			case KEYCODES.THREE: toggleClass(db, "xwrap"); break;
			case KEYCODES.FOUR: deleteSmallImages(); break;
			case KEYCODES.FIVE: getImages(); break;
			case KEYCODES.SIX: deleteIframes(); break;
			case KEYCODES.SEVEN: replaceCommentsWithPres(); break;
			case KEYCODES.EIGHT: toggleBlockEditMode(); break;
			case KEYCODES.NINE: toggleShowClasses(); break;
			case KEYCODES.I: toggleConsole(handleCSSConsoleInput); break;
			case KEYCODES.P: fixParagraphs(); break;
			case KEYCODES.A: cycleClass(db, ["xDontShowLinks", "xHE", ""]); break;
			case KEYCODES.C: getContentByParagraphCount(); break;
			case KEYCODES.D: deleteSpecificEmptyElements(); break;
			case KEYCODES.G: deleteElementsContainingText(); break;
			case KEYCODES.K: toggleConsole(handleJSConsoleInput); break;
			case KEYCODES.X: toggleClass(db, "xShowImages"); break;
			case KEYCODES.Y: highlightNodesContaining(); break;
			case KEYCODES.N: numberDivs(); break;
			case KEYCODES.O: highlightSelectionOrText(); break;
			case KEYCODES.L: showLog(); break;
			case KEYCODES.Q: fixHeadings(); break;
			case KEYCODES.R: highlightNode(); break;
			case KEYCODES.U: del("ul"); del("dl"); break;
			case KEYCODES.W: cleanupGeneral_light(); break;
			case KEYCODES.Z: cleanupUnicode(); break;
			case KEYCODES.F12: highlightCode(); break;
			case KEYCODES.FORWARD_SLASH: showPassword(); focusFormElement(); break;
			default: shouldPreventDefault = false;
		}
		if(shouldPreventDefault)
			e.preventDefault();
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
			case KEYCODES.E: replaceElementsBySelector(); break;
			case KEYCODES.G: getElementsContainingText(); break;
			case KEYCODES.F12: highlightCode(true); break;
			case KEYCODES.A: annotate(); break;
			case KEYCODES.C: deleteNonContentDivs(); break;
			case KEYCODES.D: del("log"); break;
			case KEYCODES.P: getPagerLinks(); break;
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
		shouldPreventDefault = true;
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
			case KEYCODES.FIVE: toggleStyleShowClass(); break;
			case KEYCODES.E: replaceElementsBySelector(); break;
			case KEYCODES.F: del(["object", "embed", "video"]); break;
			case KEYCODES.G: highlightElementsWithInlineWidthOrHeight(); break;
			case KEYCODES.H: highlightElementsBySelector(); break;
			case KEYCODES.L: highlightElementsWithCssRule(); break;
			case KEYCODES.V: showDocumentStructure(); break;
			case KEYCODES.B: showDocumentStructureWithNames(); break;
			case KEYCODES.N: showDocumentStructure2(); break;
			case KEYCODES.M: openDialog(handleCommandInput); break;
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
			case KEYCODES.F: formatEbook(); break;
			case KEYCODES.H: unhighlightAll(); break;
			case KEYCODES.S: forceReloadCss(); break;
			case KEYCODES.F12: analyze(true); break;
		}
	}
	window.focus();
}

main();
