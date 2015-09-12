// ==UserScript==
// @id             Nimbus
// @name           Nimbus
// @version        1.0
// @namespace      nimishjha.com
// @author         Nimish Jha
// @description    Swiss Army Knife for browsing
// @include        *
// @run-at         document-end
// ==/UserScript==

var debug = true;
var logString = "";
initialize();

function get(s)
{
	s = s.toString();
	var t = s.substr(1, s.length - 1);
	if(s.indexOf("#") === 0) return document.getElementById(t);
	else if(s.indexOf(".") === 0) return document.getElementsByClassName(t);
	else if(document.getElementsByTagName(s).length) return document.getElementsByTagName(s);
	else return 0;
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

function hasClass(ele,cls)
{
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
 
function addClass(ele,cls)
{
	if(!this.hasClass(ele,cls)) ele.className += " "+cls;
}
 
function removeClass(ele, cls)
{
	if(!ele)
		return;
	var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	ele.className = ele.className.replace(reg, ' ');
	if(removeWhitespace(ele.className) === '') ele.removeAttribute("class");
}


function getDebugData()
{
	var e, i;
	e = get("pre");
	i = e.length;
	while(i--)
		if(e[i].innerHTML.indexOf("cache-&gt;") >= 0)
			document.body.insertBefore(e[i], document.body.firstChild);
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
	ylog(s);
}

function prependMessage(str)
{
	f = document.createElement("a");
	f.textContent = f.href = str;
	g = document.createElement("h6");
	g.className = "xlog";
	g.appendChild(f);
	document.body.insertBefore(g, document.body.firstChild);
}

function showResources()
{
	if(get(".xlog").length)
	{
		del(".xlog");
		del("#style_show_resources");
		return;
	}
	var e, f, g, i, count;
	e = get("script");
	i = e.length;
	count = 0;
	while(i--)
	{
		if(e[i].src)
		{
			prependMessage(e[i].src);
			count++;
		}
	}
	ylog(count + " scripts", "h3", true);
	e = get("link");
	i = e.length;
	count = 0;
	while(i--)
	{
		if(e[i].href && e[i].href.indexOf("css") !== -1)
		{
			prependMessage(e[i].href);
			count++;
		}
	}
	ylog(count + " styles", "h3", true);
	insertStyle(".xlog{ background: #000 !important; color: #FFF !important; margin: 0 !important; padding: 5px 10px !important; } .xlog a{text-decoration: none !important; letter-spacing: 0 !important; font: 12px verdana !important; text-transform: none !important; color: #09F !important; } .xlog a:visited { color: #059 !important; } .xlog a:hover { color: #FFF !important; }", "style_show_resources");
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
		insertStyle("header, footer, article, aside, section, div, blockquote { box-shadow: inset 1px 1px #09F, inset -1px -1px #09F !important; } form, input, button, label { box-shadow: inset 1px 1px #F90, inset -1px -1px #F90 !important; background: rgba(255, 150, 0, 0.5) !important; } table, tr, td { box-shadow: inset 1px 1px #00F, inset -1px -1px #00F !important; } ul, ol { box-shadow: inset 1px 1px #0F0, inset -1px -1px #0F0 !important; } h1, h2, h3, h4, h5, h6, p { box-shadow: inset 1px 1px #F0F, inset -1px -1px #F0F !important; } a, a * { background: rgba(180, 255, 0, 0.5) !important; }", "view-document-structure");
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
		insertStyle("header, footer, article, aside, section, div, blockquote { box-shadow: inset 1px 1px #09F, inset -1px -1px #09F !important; } form, input, button, label { box-shadow: inset 1px 1px #F90, inset -1px -1px #F90 !important; background: rgba(255, 150, 0, 0.5) !important; } table, tr, td { box-shadow: inset 1px 1px #00F, inset -1px -1px #00F !important; } ul, ol { box-shadow: inset 1px 1px #0F0, inset -1px -1px #0F0 !important; } h1, h2, h3, h4, h5, h6, p { box-shadow: inset 1px 1px #F0F, inset -1px -1px #F0F !important; } a, a * { background: rgba(180, 255, 0, 0.5) !important; } ", "view-document-structure");
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
		insertStyle("div { background: linear-gradient(135deg, black, white) !important; } h1, h2, h3, h4, h5, h6 { background: #F00 !important; } p { background: #09F !important; } ol, ul { background: #00F !important; } table { background: #080 !important; }", "view-document-structure");
	}
}

function showDocumentStructureWithNames()
{
	if(document.body.className.indexOf("showdivs") != -1)
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
			if(e[i].firstChild != null) e[i].insertBefore(createElementWithText("x", divid), e[i].firstChild);
			else e[i].appendChild(createElementWithText("x", divid));
		}
	}
	document.body.className += " showdivs";
	insertStyle('div, aside, section { box-shadow: inset 2px 2px #000, inset -2px -2px #000 !important; padding: 30px 10px 10px 10px !important; } x {color: #FF0 !important; background: #000 !important; font: 12px verdana !important; padding: 2px 4px !important; letter-spacing: 0 !important; display: block !important; margin: -30px -10px 0 -10px !important; }', 'showDivs');
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

function deleteNonContentImages()
{
	deleteImagesBySrcContaining("qm.gif");
	deleteImagesBySrcContaining("avatar");
	deleteImagesBySrcContaining("spacer");
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
	//deleteElementsContainingText("p", "Like or Dislike");
	//deleteElementsContainingText("p", "Hot debate. What do you think");
	del(["#share", "#comments_posting"]);
}

function showMessage(s)
{
	var e;
	if(!get(".xmessage").length)
	{
		e = document.createElement("h2");
		e.className = "xmessage";
		document.body.insertBefore(e, document.body.firstChild);
		insertStyle('.xmessage { position: fixed; z-index: 10000; left: 0px !important; bottom: 0px !important; background: #111 !important; color: #666 !important; margin: 0px !important; padding: 0 !important; height: 20px !important; font: 12px verdana !important; line-height: 20px !important; display: block !important; width: 100% !important; text-transform: none !important; }');
	}
	else
		e = get(".xmessage")[0];
	e.textContent = s;
	//setTimeout(deleteMessage, 5000);
}

function deleteMessage()
{
	del(".xmessage");
	del(".xalert");
}

function showDialog(s)
{
	var e;
	if(!get("#xdialog"))
	{
		e = document.createElement("input");
		e.id = "xdialog";
		document.body.insertBefore(e, document.body.firstChild);
		insertStyle('#xdialog { position: absolute; margin: auto; z-index: 10000; height: 400px !important; top: 0 !important; left: 0px !important; bottom: 0px !important; right: 0 !important; background: #111 !important; color: #FFF !important; padding: 0 !important; font: 32px "swis721 cn bt", verdana !important; line-height: 70px !important; padding: 0 20px !important; display: block !important; text-transform: none !important; width: 800px !important; }', "xdialog");
		e.focus();
		e.addEventListener("keydown", guiHandler, false);
	}
	else
		e = get("#xdialog");
}

function guiHandler(e)
{
	e.stopPropagation();
	var k = e.keyCode;
	showMessage(String.fromCharCode(k));
}

function handleKeyDown(e)
{
	if(!(e.altKey || e.shiftKey || e.ctrlKey))
	{
		return;
	}
	var db = document.body;
	var s, i, j, ii, k;
	k = e.keyCode;
	if(!k)
	{
		xlog("couldn't get key");
		return;
	}
	// Alt
	if(e.altKey && !e.shiftKey && !e.ctrlKey)
	{
		switch (k)
		{
		case 97:
			// Numpad 1
			fillForms();
			break;
		case 98:
			// Numpad 2
			//showMessage("getLinksWithHrefContaining");
			getLinksWithHrefContaining();
			break;
		case 109:
			// Numpad -
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
			break;
		case 48:
			//0
			var selection = window.getSelection();
			if(selection.toString().length) s = selection;
			else s = prompt("Document title");
			setDocTitle(s);
			break;
		case 112:
			//F1
			makeHeadingFromSelection("h1");
			break;
		case 113:
			//F2
			makeHeadingFromSelection("h2");
			break;
		case 114:
			//F3
			makeHeadingFromSelection("h3");
			break;
		case 49:
			//1
			cleanupGeneral();
			break;
		case 50:
			//2
			del("svg");
			if(get("img").length)
				del("img");
			else
				del("rt");
			break;
		case 51:
			//3
			if(db.className && db.className.indexOf("xwrap") >= 0)
				removeClass(db, "xwrap");
			else
				db.className += " xwrap";
			break;
		case 52:
			//4
			deleteSmallImages();
			break;
		case 53:
			//5
			deleteSmallImages();
			getImages();
			insertStyle('img{ max-height: 200px; width: auto; display: inline-block; }')
			break;
		case 54:
			//6
			del(["iframe"]);
			deleteElementsContainingText("h2", "iframe:");
			deleteElementsContainingText("div", "Advertisement");
			break;
		case 55: //7
		case 96: //Numpad 0
			s = db.innerHTML;
			s = s.replace(/<!--/g, '<pre>');
			s = s.replace(/-->/g, '</pre>');
			db.innerHTML = s;
			insertStyleNegative();
			getDebugData();
			break;
		case 99: //Numpad 3
			clickThanks();
			break;
		case 56:
			//8
			makeDocumentClickable();
			break;
		case 57:
			//9
			ylog("unbound", "h2", true);
			break;
		case 73:
			// i
			deleteSignatures();
			break;
		case 80:
			//p
			fixParagraphs();
			break;
		case 65:
			//a
			//forAll("a", addLinkTitles);
			if(db.className.indexOf("xDontShowLinks") >= 0)
			{
				removeClass(db, "xDontShowLinks");
				db.className += " xHideEverything";
			}
			else if(db.className.indexOf("xHideEverything") >= 0)
			{
				removeClass(db, "xHideEverything");
			}
			else
			{
				db.className += " xDontShowLinks";
			}
			break;
		case 67:
			//c
			getContent();
			setDocTitle();
			appendInfo();
			break;
		case 71:
			//g
			var elems = prompt("Delete elements containing text");
			var textContained = prompt("Containing text");
			var arr = [textContained];
			deleteElementsContainingText(elems, arr);
			break;
		case 88:
			//x
			if(db.className.indexOf("xShowImages") >= 0) removeClass(db, "xShowImages");
			else db.className += " xShowImages";
			break;
		case 89:
			//y
			highlightNodesContaining();
			break;
		case 192:
			//`
			highlightSelection();
			break;
		case 74:
			//j
			//db.innerHTML = db.innerHTML.replace(/\n/g, ' ');db.innerHTML = db.innerHTML.replace(/\s+/g, ' ');
			var sh = getSelectionHTML();
			sh = escapeForRegExp(sh);
			db.innerHTML = db.innerHTML.replace(new RegExp(sh, "g"), "<mark>" + sh + "</mark>");
			break;
		case 79:
			//o
			if(window.getSelection().toString().length)
			{
				selection = window.getSelection().toString();
				s = selection.toString();
			}
			else
			{
				s = prompt("Text to highlight");
			}
			if(s.length)
			{
				var ss = escapeForRegExp(s);
				var tempHTML = db.innerHTML;
				//tempHTML = tempHTML.replace(/\n/g, " ");
				//tempHTML = tempHTML.replace(/\r/g, " ");
				//tempHTML = tempHTML.replace(/\s+/g, " ");

				//var r = new RegExp("\\b" + ss + "\\b", "gi");
				var r = new RegExp(ss, "gi");
				tempHTML = tempHTML.replace(r, "<samp>" + s + "</samp>");
				
				//var r = new RegExp("(>[^<>]*)" + ss + "([^<>]*<)", "gi");
				//tempHTML = tempHTML.replace(r, "$1<samp>" + s + "</samp>$2");

				db.innerHTML = tempHTML;
			}
			break;
		case 75:
			//k
			var f = get("iframe");
			s = '';
			for (i = 0, ii = f.length; i < ii; i++)
			s += f[i].contentDocument.body.innerHTML;
			i = f.length;
			while (i--)
			f[i].parentNode.removeChild(f[i]);
			db.innerHTML += s;
			break;
		case 76:
			// l
			showLog();
			break;
		case 81:
			//q
			fixHeadings();
			break;
		case 82:
			//r
			highlightParagraph();
			break;
		case 85:
			//u
			del("ul");
			del("dl");
			break;
		case 87:
			//w
			var d;
			deleteEmptyHeadings();
			cleanupHead();
			del(["#side", "#sidebar", "#respond", "#send", "#comments_posting", ".rating"]);
			cleanupGeneral_light();
			break;
		case 90:
			//z
			cleanupUnicode();
			document.body.innerHTML = document.body.innerHTML.replace(/http:/g, "https:");
			ylog("All links are now HTTPS", "h3", true);
			break;
		case 123:
			//F12
			highlightCode();
			break;
		case 191:
			// /
			xlog("highlightForm");
			highlightForm();
			break;
		}
	}
	// Alt-Shift
	else if(e.altKey && e.shiftKey && !e.ctrlKey)
	{
		switch (k)
		{
		case 49:
			//1
			showResources();
			break;
		case 50:
			//2
			replaceImagesWithTextLinks();
			break;
		case 87:
			//w
			WikipediaGetLargeImages();
			break;
		case 123:
			//F12
			highlightCode(true);
			break;
		case 65:
			//a
			annotate();
			break;
		case 67:
			//c
			deleteNonContentDivs();
			break;
		case 68:
			// d
			del("log");
			break;
		case 80:
			// p
			highlightLinksInPres();
			break;
		case 82:
			//r
			highlightParagraph("blockquote");
			break;
		case 75:
			// k
			showPrintLink();
			break;
		case 76:
			// l
			logout();
			break;
		case 87:
			// w
			removeAttributes();
			break;
		case 191:
			// /
			highlightButton();
			break;
		}
	}
	// Ctrl-Alt
	else if(e.altKey && e.ctrlKey && !e.shiftKey)
	{
		var s;
		switch (k)
		{
		case 70:
			//F
			del(["object", "embed", "video"]);
			break;
		case 72:
			//H
			highlightElement();
			break;
		case 73:
			//I
			appendIframes();
			break;
		case 77:
			//M
			showAlert("This is an alert");
			break;
		case 49:
			//1 - insert 'negative' style
			insertStyleNegative();
			break;
		case 80:
			//p
			deleteEmptyElements("*");
			break;
		case 82:
			//r
			s = prompt("Tag");
			highlightParagraph(s);
			break;
		case 84:
			//T - insert timestamp
			var d = new Date();
			s = zeroPad(d.getDate()) + "-" + zeroPad(d.getMonth()+1) + "-" + zeroPad(d.getFullYear());
			prompt("Date", s);
			break;
		case 86:
			//V
			showDocumentStructure();
			break;
		case 66:
			//B
			showDocumentStructureWithNames();
			break;
		case 78:
			//N
			showDocumentStructure2();
			break;
		case 123:
			//F12
			analyze();
			break;
		}
	}
	else
	{
		switch (k)
		{
		case 113: // F2
			//ylog("F2");
			//window.close();
			break;
		default:
			break;
		}
	}
	window.focus();
}

function doFlickr()
{
	getLinksWithHrefContaining("_o_d.");
	var e = document.getElementsByTagName("a")[0];
	e.href = e.textContent = e.href.replace(/https/, "http");
	e.innerHTML = '<h2>' + e.textContent + '<h2>';
	e.setAttribute('style', 'position: absolute');
	if(e.href.indexOf('_o_d.') > 0 && location.href.indexOf("nimishjha") < 0)
		location.href = e.href;
	replaceElement(".photo-title", "h1");
}

function doYoutube()
{
	del("object");
	del("embed");
	del(".comments");
	var e = get("video")[0];
	var s = e.src;
	e.src = '';
	e.pause();
}

function doGfycat()
{
	var e = get("#mp4source");
	var s = e.src;
	e.src = '';
	e = get("#webmsource");
	e.src = '';
	del('video');
	location.href = s;
}

function doBolt()
{
	var e, i;
	//deleteImagesBySrcContaining("bluesaint");
	//deleteImagesBySrcContaining("icons/");
	//deleteElementsContainingText("li", "The Following");
	if(get("#searchform"))
	{
		e = get("input");
		i = e.length;
		while(i--)
		{
			if(e[i].value && e[i].value === "1")
				e[i].checked = true;
		}
		get("#keyword").focus();
	}
	del("iframe");
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
			ylog("clicked thanks", "h5", true);
		}
	}
}

function highlightElement()
{
	if(get(".hl").length > 0)
	{
		forAll(".hl", function(x){
			removeClass(x, "hl");
		});
		return;
	}
	var s = prompt("Enter element to highlight");
	if(!s.length)
		return;
	var e = get(s);
	if(e.length)
	{
		var i = e.length;
		while(i--)
		{
			e[i].className += " hl";
		}
	}
	insertStyle(".hl { box-shadow: inset 10px 10px #F00, inset -10px -10px #F00 !important; }")
}

function highlightParagraph(tag)
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
	if(node.tagName == undefined)
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
	if(node.tagName == undefined) node = node.parentNode;
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
	if(node.tagName == undefined) node = node.parentNode;
	if(node && node.parentNode)
	{
		var d = document.createElement("ruby");
		d.textContent = prompt("_________________________________________________________________________________________________________");
		if(d.textContent.length) node.parentNode.insertBefore(d, node);
	}
}

function getImages()
{
	var f = get("img"), db = document.body, i, ii, j, jj, e = [];
	var tempNode = document.createElement("div");
	if(f && f.length)
	{
		for(i = 0; i < f.length; i++)
		{
			for(j = i+1; j < f.length; j++)
				if(f[j].src === f[i].src)
					f[j].removeAttribute("src");
		}
		for(i = 0, ii = f.length; i < ii; i++)
		{
			if(f[i].hasAttribute("src"))
			{
				f[i].removeAttribute("width");
				f[i].removeAttribute("height");
				if(f[i].parentNode && f[i].parentNode.tagName && f[i].parentNode.tagName === "A")
					tempNode.appendChild(f[i].parentNode.cloneNode(true));
				else
					tempNode.appendChild(f[i].cloneNode(true));
			}
		}
		del("img");
		db.insertBefore(tempNode, db.firstChild);
		var head = document.getElementsByTagName('head')[0];
		var tempTitle = document.title;
		head.innerHTML = '';
		document.title = tempTitle;
	}
	else if(f)
	{
		db.innerHTML = f.innerHTML;
	}
	else
	{
		ylog("No images found", "h1", true);
	}
}

function deleteImagesSmallerThan(x, y)
{
	var f = document.getElementsByTagName('img');
	for (var i = f.length - 1; i >= 0; i--)
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
	for (var i = f.length - 1; i >= 0; i--)
	{
		if(f[i].clientWidth < 40 || f[i].clientHeight < 40)
		{
			deleteImagesSmallerThan(40, 40);
			return;
		}
		if(f[i].clientWidth < 120 || f[i].clientHeight < 120)
		{
			deleteImagesSmallerThan(120, 120);
			return;
		}
	}
}

function replaceImagesWithTextLinks()
{
	var e = get("img");
	for(var i = 0; i < e.length; i++)
	{
		if(e[i].src)
		{
			var f = document.createElement("a");
			f.href = f.textContent = e[i].src;
			var g = document.createElement("rt");
			g.appendChild(f);
			e[i].parentNode.insertBefore(g, e[i]);
		}
	}
	del("img");
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

function cleanupGeneral()
{
	var t1 = new Date();
	cleanupHead();
	replaceFlash();
	replaceIframes();
	deleteNonContentImages();
	replaceWrongHeading();
	del(["link", "style", "iframe", "script", "input", "select", "textarea", "button", "x", "canvas", "label", "svg", "video", "audio"]);
	replaceFontTags();
	replaceElement("center", "div");
	setDocTitle();
	removeAttributes();
	replaceAudio();
	//removeEventListeners();
	appendInfo();
	document.body.className = "pad100";
	var t2 = new Date();
	xlog(t2-t1 + " ms: cleanupGeneral");
}

function cleanupGeneral_light()
{
	replaceFlash();
	replaceIframes();
	delTag(["link", "style", "iframe", "script", "input", "select", "textarea", "button", "noscript"]);
	replaceFontTags();
	replaceElement("center", "div");
	setDocTitle();
	del("x");
	removeAttributes_fast();
	appendInfo();
	document.body.className = "pad100 xShowImages";
}

function replaceIframes()
{
	var e = get("iframe"), i, iframereplacement, iframelink, s, segments;
	var i = e.length;
	while(i--)	
	{
		if(e[i].src.indexOf("youtube") !== -1)
		{
			iframereplacement = document.createElement("rp");
			iframelink = document.createElement("a");
			s = e[i].src;
			s = s.replace(/\/embed\//, '/watch?v=');
			segments = s.split('?');
			iframelink.href = segments[0] + '?' + segments[1];
			if(s.indexOf(".") > 0)
				s = s.match(/:\/\/(.[^/]+)/)[1];
			iframelink.textContent = iframelink.href;
			iframereplacement.appendChild(iframelink);
			e[i].parentNode.replaceChild(iframereplacement, e[i]);
		}
		else
		{
			e[i].parentNode.removeChild(e[i]);
		}
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
		if(targ.tagName == "A")
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

function isArray(o)
{
	return Object.prototype.toString.call(o) === '[object Array]';
}

function del(c)
{
	var todel = [];
	if(isArray(c))
	{
		for (var i = 0, ii = c.length; i < ii; i++)
		{
			del(c[i]);
		}
	}
	else
	{
		var f = get(c);
		if(f && f.length)
		{
			for (var j = 0, jj = f.length; j < jj; j++)
			todel.push(f[j]);
			for (j = todel.length - 1; j > -1; j--)
			{
				todel[j].parentNode.removeChild(todel[j]);
			}
		}
		else if(f)
		{
			if(f.parentNode) f.parentNode.removeChild(f);
		}
	}
}

function replaceElement(e1, e2)
{
	var replacement, e, toreplace, i, ii;
	e = get(e1);
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

function insertStyle(str, identifier)
{
	var head = get("head")[0], style = document.createElement("style"), rules = document.createTextNode(str);
	style.type = "text/css";
	if(style.styleSheet)
		style.styleSheet.cssText = rules.nodeValue;
	else
		style.appendChild(rules);
	if(identifier && identifier.length)
		style.id = identifier;
	head.appendChild(style);
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
	var candidateTags = ['h1', 'h2'], s = '', i, ii, j, jj, found = false;
	for(i = 0, ii = candidateTags.length; i < ii; i++)
	{
		e = document.getElementsByTagName(candidateTags[i]);
		for(j = 0, jj = e.length; j < jj; j++)
		{
			if(e[j].textContent && e[j].textContent.indexOf("iframe:") === -1)
			{
				s = e[j].textContent;
				found = true;
				break;
			}
		}
		if(found)
			break;
	}
	if(!s.length)
	{
		if(document.title)
			s = document.title;
		else
			s = window.location.hostname;
	}
	if(document.body.textContent.match(/Page [0-9]+ of [0-9]+/))
		if(!s.match(/Page [0-9]+/i))
			s = s + " - " + document.body.textContent.match(/Page [0-9]+ of [0-9]+/)[0];
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

function sanitizeTitle(s)
{
	s = s.toString();
	s = replaceDiacritics(s);
	
	s = s.replace(/&/g, " and ");
	
	s = s.replace(/\u2019/g, "'");
	s = s.replace(/\u2018/g, "'");
	s = s.replace(/\u201C/g, '"');
	s = s.replace(/\u201D/g, '"');
	s = s.replace(/\u00ec/g, 'i');

	s = s.replace(/\u00e0/g, 'a');
	s = s.replace(/\u00e1/g, 'a');
	s = s.replace(/\u00e2/g, 'a');
	s = s.replace(/\u00e4/g, 'a');

	s = s.replace(/\u00c0/g, 'A');
	s = s.replace(/\u00c1/g, 'A');
	s = s.replace(/\u00c2/g, 'A');
	s = s.replace(/\u00c4/g, 'A');

	s = s.replace(/\u00e8/g, 'e');
	s = s.replace(/\u00e9/g, 'e');
	s = s.replace(/\u00ea/g, 'e');

	s = s.replace(/\u00c8/g, 'E');
	s = s.replace(/\u00c9/g, 'E');
	s = s.replace(/\u00ca/g, 'E');

	s = s.replace(/\u00f2/g, 'o');
	s = s.replace(/\u00f3/g, 'o');
	s = s.replace(/\u00f4/g, 'o');
	s = s.replace(/\u00f6/g, 'o');

	s = s.replace(/\u00d2/g, 'O');
	s = s.replace(/\u00d3/g, 'O');
	s = s.replace(/\u00d4/g, 'O');
	s = s.replace(/\u00d6/g, 'O');

	s = s.replace(/\u00f9/g, 'u');
	s = s.replace(/\u00fa/g, 'u');
	s = s.replace(/\u00fb/g, 'u');
	s = s.replace(/\u00fc/g, 'u');

	s = s.replace(/\u00d9/g, 'U');
	s = s.replace(/\u00da/g, 'U');
	s = s.replace(/\u00db/g, 'U');
	s = s.replace(/\u00dc/g, 'U');

	s = s.replace(/\u00df/g, 'SS');

	s = s.replace(/[:|\?]/g, " - ");
	s = s.replace(/[^0-9A-Za-z_!@\[\]\-\(\)'",]/g, " ");
	s = s.replace(/\s+/g, " ");
	return s;
}

function setDocTitle(s)
{
	var i, labels, longestlabel, h;
	deleteEmptyElements("h1");
	deleteEmptyElements("h2");
	deleteEmptyElements("h3");

	if(s == null)
		s = sanitizeTitle(chooseDocumentHeading());
	else
		s = sanitizeTitle(s);
	
	if(s.indexOf("Thread - ") !== -1)
		s = s.substr(s.indexOf("Thread - ") + 9);
	
	if(!(document.getElementsByTagName("h1").length && document.getElementsByTagName("h1")[0].textContent === s))
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
	var url;
	if(window.location.href.indexOf("file:///") >= 0) return;
	if(document.getElementsByTagName("h4").length)
	{
		var hh = document.getElementsByTagName("h4");
		if(hh[hh.length - 1].textContent.indexOf("URL:") === 0) return;
	}
	var d = new Date();
	var saveTime = d.getFullYear() + "/" + zeroPad(d.getMonth() + 1) + "/" + zeroPad(d.getDate()) + " " + zeroPad(d.getHours()) + ":" + zeroPad(d.getMinutes()) + ":" + zeroPad(d.getSeconds());
	var h = document.createElement("h4");
	h.appendChild(document.createTextNode("URL: "));
	var a = document.createElement("a");
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
			case '7':
				h = document.createElement("h1");
				break;
			case '6':
				h = document.createElement("h2");
				break;
			case '5':
				h = document.createElement("h3");
				break;
			case '4':
				h = document.createElement("h4");
				break;
			case '3':
				h = document.createElement("h5");
				break;
			case '2':
				h = document.createElement("p");
				break;
			case '1':
				h = document.createElement("p");
				break;
			default:
				h = document.createElement("p");
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

function removeAttributes()
{
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
}

function removeAttributes_fast()
{
	var temp, a, i, attnode, old_att;
	document.body.removeAttribute("background");
	document.body.innerHTML = document.body.innerHTML.replace(/(<[^ai][a-z0-9]*) [^>]+/gi, '$1');
	
	a = get("a");
	i = a.length;
	while (i--)
	{
		temp = a[i].href ? a[i].href : null;
		while (a[i].attributes.length > 0)
		{
			attnode = a[i].attributes[0];
			old_att = a[i].removeAttributeNode(attnode);
		}
		a[i].href = temp;
	}
	a = get("img");
	i = a.length;
	while (i--) {
		var temp = a[i].src ? a[i].src : null;
		while (a[i].attributes.length > 0) {
			var attnode = a[i].attributes[0];
			var old_att = a[i].removeAttributeNode(attnode);
		}
		a[i].src = temp;
	}
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

function deleteNonContentLists()
{
	var e = get("ul"), f, g;
	var i = e.length, j;
	while (i--)
	{
		if(removeWhitespace(e[i].textContent).length === 0 && e[i].getElementsByTagName("img").length === 0)
		{
			e[i].parentNode.removeChild(e[i]);
			break;
		}
		f = e[i].getElementsByTagName("li");
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

function removeWhitespace(s)
{
	return s.replace(/\s/g, '');
}

function ns(s) // normalize string
{
	return removeWhitespace(s.toLowerCase());
}

function logout()
{
	var e, i, ii, newlink, found = false, s;
	e = get("a");
	i = e.length; 
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].href)
		{
			s = ns(e[i].href);
			if( (s.indexOf("logout") >= 0 && s.indexOf("logout_gear") === -1) || s.indexOf("signout") >= 0)
			{
				found = true;
				ylog("Logging out...", "h1", true);
				if(e[i].href)
				{
					var tempLink = document.createElement("a");
					tempLink.href = tempLink.textContent = e[i].href; 
					document.body.insertBefore(tempLink, document.body.firstChild);
					tempLink.click();
				}
				else
				{
					e[i].click();
				}
				break;
			}
		}
		if(!found && e[i].textContent)
		{
			s = ns(e[i].textContent);
			if(s.indexOf("logout") >= 0 || s.indexOf("signout") >= 0)
			{
				found = true;
				ylog("Logging out...", "h1", true);
				e[i].click();
				break;
			}
		}
	}
	if(!found)
	{
		e = get("input");
		for(i = 0, ii = e.length; i < ii; i++)
		{
			if(e[i].value)
			{
				s = ns(e[i].value);
				if(s.indexOf("logout") >= 0 || s.indexOf("signout") >= 0)
				{
					found = true;
					ylog("Logging out...", "h1", true);
					e[i].click();
					break;
				}
			}
		}
		
	}
	if(!found)
		ylog("Logout link not found", "h1", true);
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
	if(!e) e = window.event;
	if(e.target)
	{
		targ = e.target;
	}
	var tn = targ.tagName.toLowerCase();
	// Get clicked element
	if(e.ctrlKey && e.shiftKey)
	{
		document.body.innerHTML = targ.innerHTML;
		document.body.removeEventListener('mouseup', clickHandler, false);
		removeClass(document.body, "debug");
	}
	// delete clicked element
	else if(e.ctrlKey && !e.shiftKey)
	{
		if(targ.tagName == 'BODY') return;
		if(tn == "li" || tn == "p")
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
		if(targ.tagName == 'BODY') return;
		document.getElementById("newbody").appendChild(targ);
	}
}

function highlightCode(highlightKeywords)
{
	var tagpre = get("pre");
	var i = tagpre.length;
	while (i--)
	{
		var s = tagpre[i].innerHTML,
			r;
		s = s.replace(/<span[^>]*>/g, "");
		s = s.replace(/<\/span>/g, "");
		s = s.replace(/\(/g, '<em>(</em>');
		s = s.replace(/\)/g, '<em>)</em>');
		s = s.replace(/{/g, '<u>{</u>');
		s = s.replace(/}/g, '<u>}</u>');
		s = s.replace(/\[/g, '<i>[</i>');
		s = s.replace(/\]/g, '<i>]</i>');
		// Everything between angle brackets
		s = s.replace(/(&lt;\/?[^&\r\n]+&gt;)/g, '<em>$1</em>');
		// C-style block comments
		s = s.replace(/\/\*(.+)\*\//g, '<dfn>/*$1*/</dfn>');
		// PHP comments
		//s = s.replace(/[^: ]#([A-Za-z ]+)/g, '<dfn>#$1</dfn>');

		if(highlightKeywords == true)
		{
			var keyword = ["abstract", "applet", "object", "param", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "script", "javascript", "document", "createElement", "createTextNode", "getElementsByTagName"];
			var j = keyword.length;
			while (j--)
			{
				r = new RegExp("\\b" + keyword[j] + "\\b", "g");
				s = s.replace(r, "<em>" + keyword[j] + "</em>");
			}
		}
		
		tagpre[i].innerHTML = s;
	}
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
//			if(!x[i].getElementsByTagName("p").length || x[i].getElementsByTagName("p").length < 5)
//			{
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
//			}
		}
	}
	i = todel.length;
	while(i--)
		todel[i].className += ' hl';
}

function deleteNonContentDivs_old(classes)
{
	if(get(".hl").length)
	{
		del(".hl");
		return;
	}
	deleteNonContentLists();
	deleteNonContentImages();
	var x = document.getElementsByTagName("div");
	var i = x.length;
	while (i--)
	{
		var weight = 0;
		weight += x[i].getElementsByTagName("p").length;
		weight += x[i].getElementsByTagName("blockquote").length;
		weight += x[i].getElementsByTagName("pre").length;
		weight += x[i].getElementsByTagName("img").length;
		weight += x[i].getElementsByTagName("cite").length;
		weight += x[i].getElementsByTagName("h1").length;
		weight += x[i].getElementsByTagName("h2").length;
		weight += x[i].getElementsByTagName("h3").length;
		weight += x[i].getElementsByTagName("h4").length;
		weight += x[i].getElementsByTagName("h5").length;
		weight += x[i].getElementsByTagName("h6").length;
		if(!weight)
		{
			//x[i].innerHTML = '<h2><mark>' + "deleting: " + ((x[i].id ? "#" + x[i].id : "") + (x[i].className? "." + x[i].className : "")).toString() + '</mark></h2>' + x[i].innerHTML;
			x[i].className += " hl";
			//x[i].parentNode.removeChild(x[i]);
		}
	}
	//delClassOrIdContaining(["ad", "social", "related"], true);
	var c = ["_ad", "ad-", "ad_", "adsense", "advert", "archive", "banner", "bread", "categories", "controls", "extra", "footer", "inline", "inset", "latest", "leader", "links", "login", "menu", "meta", "popular", "popup", "promo", "rail", "rate", "rating", "recent", "related", "respond", "search", "seealso", "send", "share", "side", "sidebar", "signup", "similar", "social", "sponsor", "tags", "tool", "util", "whitepapers", "widget", "nav", "left", "right"];
	delClassOrIdContaining(c);
}

function getElements(str)
{
	var s = "", found = 0, f;
	f = get(str);
	tempNode = document.createElement("div");
	tempNode.id = "replacerDiv";
	if (f && f.length)
	{
		for (i = 0; i < f.length; i++)
			tempNode.appendChild(f[i].cloneNode(true));
		document.body.innerHTML = "";
		document.body.appendChild(tempNode.cloneNode(true), document.body.firstChild);
	}
	else if (f)
	{
		document.body.innerHTML = "";
		document.body.appendChild(f.cloneNode(true), document.body.firstChild);
	}
	else
	{
		alert("Not found");
	}
}

function deleteNonContentDivs()
{
	replaceElement("article", "div");

	deleteNonContentLists();
	deleteNonContentImages();
	deleteEmptyParagraphs();
	deleteEmptyElements("*");

	var e = get("p");
	if(e == 0)
	{
		ylog("No paragraphs found", "h3", true);
	}
	for(var i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].parentNode)
			addClass(e[i].parentNode, "toget");
	}
	// hls that are children of other hls need to have their hl class removed
	e = get(".toget");
	for(var i = 0, ii = e.length; i < ii; i++)
	{
		var f = e[i].getElementsByClassName("toget");
		for(var j = 0, jj = f.length; j < jj; j++)
		{
			removeClass(f[j], "toget");
		}
		e = get(".toget");
		ii = e.length;
	}
	getElements(".toget");
	del(["link", "style", "script"]);
	document.body.className = "pad100";
}

function formatContent()
{
	var db = document.body;
	replaceElement("strong", "b");
	replaceElement("dt", "h6");
	if(get(".date").length)
	{
		replaceElement(".date", "h6");
	}
	else
	{
		replaceElement(".author", "h6");
	}
	replaceElement(".cmtinfo", "h6");
	replaceElement(".commentmetadata", "h6");
	replaceElement(".metadata", "h6");
	//Make headings of numbered lists
	db.innerHTML = db.innerHTML.replace(/<p>([0-9]+)\./gi, "<h6>$1</h6><p>");
}

function deleteEmptyParagraphs()
{
	var p = document.getElementsByTagName("p");
	var i = p.length;
	while (i--)
	{
		if( p[i].textContent )
		{
			if( removeWhitespace(p[i].textContent).length === 0 && !p[i].getElementsByTagName("img").length )
				p[i].parentNode.removeChild(p[i]);
		}
		else
		{
			if( !p[i].getElementsByTagName("img").length)
				p[i].parentNode.removeChild(p[i]);
		}
	}
	p = document.getElementsByTagName("ul");
	i = p.length;
	while (i--)
	if(p[i].textContent && removeWhitespace(p[i].textContent).length === 0 && !p[i].getElementsByTagName("img").length) p[i].parentNode.removeChild(p[i]);
}

function deleteEmptyElements(tag)
{
	var t1 = new Date();
	var e = document.getElementsByTagName(tag);
	var i = e.length;
	while (i--)
	{
		if(!e[i].getElementsByTagName("img").length)
		{
			if(e[i].textContent && removeWhitespace(e[i].textContent).length === 0)
			{
				e[i].parentNode.removeChild(e[i]);
			}
			else
			{
				e[i].parentNode.removeChild(e[i]);
			}
		}
	}
	var t2 = new Date();
	ylog(t2-t1 + " ms: deleteEmptyElements");
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
				if(removeWhitespace(e[i].textContent).length == 0) e[i].parentNode.removeChild(e[i]);
			}
			else
			{
				e[i].parentNode.removeChild(e[i]);
			}
		}
	}
}

function deleteEmptyDivs()
{
	var p = document.getElementsByTagName("div");
	var i = p.length;
	while (i--)
	{
		if(p[i].textContent && removeWhitespace(p[i].textContent).length === 0 && !p[i].getElementsByTagName("img").length)
		{
			p[i].parentNode.removeChild(p[i]);
		}
		else
		{
			p[i].innerHTML = p[i].innerHTML.replace(/\s+/g, " ");
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
		if(e[i].innerHTML.toLowerCase().indexOf("<br>") >= 0)
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
		e[i].innerHTML = e[i].innerHTML.replace(/([^:]\/\/[^\n]+)/g, "<dfn>$1</dfn>");
		e[i].innerHTML = e[i].innerHTML.replace(/^(\/\/[^\n]+)/g, "<dfn>$1</dfn>");
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
	s = s.replace(/([a-z\-0-9])<\/p>\s*<p>([a-z])/g, "$1 $2");
	s = s.replace(/<br>/g, "</p><p>");
	s = s.replace(/&nbsp;/g, " ");
	s = s.replace(/\s+/g, " ");
	//s = s.replace(/<p>\s*<\/p>/g, "");
	//s = s.replace(/<\/p>\s*<p>/g, "</p>\r\n<p>");
	s = s.replace(/<p/g, "\r\n<p");
	s = s.replace(/<div/g, "\r\n<div");
	document.body.innerHTML = s;
	restorePres();
	deleteEmptyParagraphs();
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
			if(e[i].innerHTML.indexOf("________") >= 0 && !e[i].getElementsByTagName(tag[j]).length)
				e[i].innerHTML = e[i].innerHTML.substr(0, e[i].innerHTML.indexOf("________")-1);
	}
}

function deleteElementsContainingText(tag, str)
{
	var e = document.getElementsByTagName(tag);
	var i = e.length;
	while (i--)
	{
		if(e[i].getElementsByTagName(tag).length) continue;
		if(e[i].textContent.indexOf(str) >= 0) e[i].parentNode.removeChild(e[i]);
	}
}

function highlightNodesContaining(tag, str)
{
	if(!arguments.length)
	{
		tag = prompt("highlightNodesContaining\ntagName");
		if(!tag.length) return;
		str = prompt("Containing text");
		if(! (tag.length && str.length)) return;
	}
	var e = document.getElementsByTagName(tag);
	var i = e.length;
	while (i--)
	{
		if(e[i].getElementsByTagName(tag).length) continue;
		if(e[i].textContent.indexOf(str) >= 0)
		{
			e[i].innerHTML = "<mark>" + e[i].innerHTML + "</mark>";
			e[i].className += " hl";
		}
		if(tag.toLowerCase() === "a")
		{
			if(e[i].href && e[i].href.indexOf(str) >= 0)
			{
				e[i].innerHTML = "<samp>" + e[i].innerHTML + "</samp>";
				e[i].className += " hl";
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
	highlightLinksWithHrefContaining(str);
	var wrapper;
	if(!arguments.length)
	{
		str = prompt("Containing text");
		if( !str.length ) return;
	}
	var e = document.getElementsByTagName("a"), i, ii;
	var containerDiv = document.createElement("div");
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].href.indexOf(str) >= 0 || (e[i].title && e[i].title.indexOf(str) >= 0))
		{
			var newLink = document.createElement("a");
			newLink.href = newLink.textContent = e[i].href;
			var newLinkWrapper = document.createElement("div");
			newLinkWrapper.appendChild(newLink);
			containerDiv.appendChild(newLinkWrapper);
		}
	}
	document.body.insertBefore(containerDiv, document.body.firstChild);
}

function xlog(str, logTag)
{
	var tag;
	if(logTag && logTag.length)
		tag = logTag;
	else
		tag = "h6";
	logString += "<" + tag + ">" + str + "</" + tag + ">\r\n";
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
	var x = document.getElementsByTagName("div"), i, j, wrapper;
	i = x.length;
	wrapper = document.createElement("div");
	while (i--)
	{
		x[i].className += " hl";
		for (j = 0; j < classes.length; j++)
		{
			xlog(classes[j]);
			if(x[i].className && x[i].className.toLowerCase().indexOf(classes[j]) >= 0)
			{
				x[i].className = '';
				xlog('Getting: ' + x[i].className);
				break;
			}
			else if(x[i].id && x[i].id.toLowerCase().indexOf(classes[j]) >= 0)
			{
				x[i].className = '';
				xlog('Getting: ' + x[i].id);
				break;
			}
		}
	}
}

function getContent()
{
	if(get("#content"))
		document.body.innerHTML = get("#content").innerHTML;
	else
		getContentDivs(['content']);
}

function deleteImagesBySrcContaining(str)
{
	var elems = document.getElementsByTagName("img"), i = elems.length;
	while (i--)
	if(elems[i].src.indexOf(str) >= 0)
	{
		xlog("Deleting image with src containing " + elems[i].src);
		elems[i].parentNode.removeChild(elems[i]);
	}
}

function create(selector, html)
{
	var tag = '', idname = '', classname = '';
	if(selector.indexOf("#"))
	{
		tag = selector.split("#")[0];
		classname = selector.split("#")[1];
	}
	else if(selector.indexOf("."))
	{
		tag = selector.split(".")[0];
		idname = selector.split(".")[1];
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

function addLinkTitles(x)
{
	x.setAttribute("title", x.href);
}

function removeEmptyIframes()
{
	var iframes = document.getElementsByTagName("iframe");
	var i = iframes.length;
	while (i--)
	{
		if(iframes[i].contentDocument.body && iframes[i].contentDocument.body.textContent.length === 0) iframes[i].parentNode.removeChild(iframes[i]);
	}
}

function cleanupWikipedia()
{
	cleanupHead();
	document.title = document.getElementsByTagName("h1")[0].textContent;
	document.getElementsByTagName("h1")[0].textContent = document.title;
	del(["iframe", "script", "object", "embed", "link", "#siteNotice", "#contentSub", "#jump-to-nav", "#catlinks", "#toctitle", "#section_SpokenWikipedia", "#footer", "#column-one", ".noprint", ".rellink", ".editsection", ".metadata", ".internal", ".dablink", ".messagebox", "#mw-articlefeedback", "form", "#mw-navigation", ".mw-editsection"]);
	document.body.className = "pad100";
}

function insertLink(linktext, linkhref)
{
	var e = document.createElement("a");
	e.href = linkhref;
	e.innerHTML = "<h6>" + linktext + "</h6>";
	document.body.appendChild(e);
}

function WikipediaGetLargeImages()
{
	var i, ii, e, e2, request, fragment, largeImage, d;
	e = get("img");
	for( i = 0, ii = e.length; i < ii; i++ )
	{
		if( e[i].parentNode && e[i].parentNode.tagName.toLowerCase() === "a")
		{
			//request = new XMLHttpRequest();
			//																		
			request = GM_xmlhttpRequest({
				method: "GET",
				url: e[i].parentNode.href,
				onload: function(res) {
					//GM_log(res.responseText);
					var d = document.createElement("div");
					d.innerHTML = res.responseText;
					d.id = "tempDiv";
					document.body.appendChild(d);
					if(document.getElementById("file"))
					{
						if( document.getElementById("file").getElementsByTagName("img") )
						{
							var newSrc = document.getElementById("file").getElementsByTagName("img")[0].src;
							if(newSrc)
							{
								insertLink(newSrc, newSrc);
								var newImage = document.createElement("img");
								newImage.src = newSrc;
								document.body.appendChild(newImage);
							}
						}
					}
					del("#tempDiv");
				},
				onerror: function(res) {
					ylog(res);
				}
			});
			//																		
		}
	}
}

function getKeys(obj)
{
	var keys = [], key;
	for (key in obj)
		if(obj.hasOwnProperty && obj.hasOwnProperty(key))
			keys.push(key);
	return keys;
}

function getAttributes(targ)
{
	var d = document, div2 = document.createElement('div');
	if(targ.tagName) div2.innerHTML = "<b>" + targ.tagName.toLowerCase() + "</b>";
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
		div2.innerHTML += str;
		str = '';
		var k = getKeys(targ);
		for (i = 0; i < k.length; i++) if(k[i] !== 'addEventListener') str += k[i] + ' ';
		var events = document.createElement('em');
		events.appendChild(document.createTextNode(str));
		div2.appendChild(events);
		var analyzerdiv = document.getElementById("analyzer");
		analyzerdiv.appendChild(div2);
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
	if(!e) e = window.event;
	if(e.target)
	{
		targ = e.target;
	}
	analyze_removeOldHover();
	targ.className += ' hovered';
	while (targ)
	{
		getAttributes(targ);
		targ = targ.parentNode;
	}
}

function cleanupUnicode()
{
	var s = document.body.innerHTML;
	s = s.replace(/\u00e2\u20ac\u2122/g, "'");
	s = s.replace(/\u00e2\u20ac\u00a6/g, "...");
	s = s.replace(/\u00e2\u20ac\u201d/g, "&mdash;");
	s = s.replace(/\u00e2\u20ac\u009d/g, "\"");
	s = s.replace(/\u00e2\u20ac\u0153/g, "\"");
	s = s.replace(/\u00e2\u20ac\u00a6/g, "\"");
	s = s.replace(/\u00c2/g, " ");
	s = s.replace(/\u00c4\u00fa/g, "\"");
	s = s.replace(/\u00c4\u00f9/g, "\"");
	s = s.replace(/\u00c4\u00f4/g, "'");
	s = s.replace(/\u00e2\u20ac/g, "\"");
	s = s.replace(/\u00c3\u00a9/g, "&eacute;");
	s = s.replace(/\ufffd/g, "&mdash;");
	s = s.replace(/\u00cb\u0153/g, "'");
	
	s = s.replace(/\s+/g, " ");
	document.body.innerHTML = s;
}

function analyze()
{
	if(!get("#analyzer"))
	{
		var b = document.createElement("div");
		b.id = "analyzer";
		document.body.insertBefore(b, document.body.firstChild);
		document.body.addEventListener('mouseover', analyze_mouseoverHandler, false);
		document.body.addEventListener('click', analyze_clickHandler, false);
		document.body.className += ' analyzer';
		insertStyle('body.analyzer {padding-bottom: 300px !important; } #analyzer { padding: 5px 10px !important; position:fixed!important; left:0; bottom: 0; width: 50% !important; min-width: 500px !important; height: 200px!important; overflow: hidden !important; background:#000 !important; color:#aaa !important; text-align:left !important; z-index:100000 !important; font:11px verdana !important; letter-spacing: 0 !important; } #analyzer b { color:#09f !important; } #analyzer div { padding:0;} #analyzer em { font-style:normal; color:#F80 !important; } .hovered { background: rgba(0, 0, 0, 0.5) !important; color: #FFF !important; } div#analyzer, #analyzer div { box-shadow: none !important; min-height: 0 !important; margin: 0 !important; }', "analyzer-style");
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
	if(!e) e = window.event;
	if(e.target)
	{
		targ = e.target;
	}
	if(e.shiftKey)
	{
		if(get("#analyzer"))
		{
			prompt("", get("#analyzer").textContent);
		}
	}
}

function highlightPagination()
{
	var elems, i, c;
	elems = document.getElementsByTagName('div');
	for (i = elems.length - 1; i >= 0; i--)
	{
		c = elems[i].className;
		if(c && c.length)
		{
			if(c.indexOf("page") >= 0 || c.indexOf("pagin") >= 0)
			{
				wrapElement(elems[i], "h1");
			}
		}
	}
}

function wrapElement(obj, tag)
{
	var wrapper = document.createElement(tag);
	wrapper.appendChild(obj.cloneNode(true));
	if( obj.parentNode  && obj.parentNode.tagName.toLowerCase() !== tag ) obj.parentNode.replaceChild(wrapper, obj);
}

function replaceWrongHeading()
{
	var heading1, heading1link, temp;
	if(get("h1"))
	{
		heading1 = get("h1")[0];
		if(heading1link = heading1.getElementsByTagName("a")[0])
		{
			if(heading1link.href === "http://" + location.hostname + "/") 
			{
				temp = document.createElement("h6");
				temp.innerHTML = heading1.innerHTML;
				heading1.parentNode.replaceChild(temp, heading1);
			}
		}
	}
}

function highlightForm()
{
	var inputs, len, i, ii, found, e = [];
	inputs = get("input");
	len = inputs.length;
	// ylog("number of input fields: " + len, "h1", true);
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
			if(inputs[i].type !== "hidden" && inputs[i].type !== "submit" && inputs[i].type !== "reset" && inputs[i].type !== "button" && inputs[i].type !== "radio" && inputs[i].type !== "checkbox" && inputs[i].type !== "image")
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
		if(/*e[i] == document.activeElement || */e[i].className.indexOf("focused") !== -1)
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

function highlightButton()
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
		if(inputs[i].type && (inputs[i].type == "button" || inputs[i].type == "submit"))
			inputfields.push(inputs[i]);
	found = false;
	for(i = 0, ii = inputfields.length; i < ii; i++)
	{
		if(inputfields[i] == document.activeElement)
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
	ylog(ss);
	var tempHTML = document.body.innerHTML;
	var r = new RegExp("(>[^<>]*)" + ss + "([^<>]*<)", "gi");
	tempHTML = tempHTML.replace(r, "$1<samp>" + s + "</samp>$2");
	document.body.innerHTML = tempHTML;
}

function showLog(prepend)
{
	var logDiv;
	if(logString.length > 0)
	{
		logDiv = document.createElement("log");
		logDiv.innerHTML = logString;
		if(prepend == true)
			document.body.insertBefore(logDiv, document.body.firstChild);
		else
			document.body.appendChild(logDiv);
		logString = "";
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
	/* Inputs */
	e = get("input");
	i = e.length;
	while(i--)
	{
		if(e[i].hasAttribute("type"))
		{
			inputType = e[i].type;
			if(inputType !== "button" && inputType !== "submit" && inputType !== "image" && inputType !== "hidden" && inputType !== "checkbox" && inputType !== "radio")
			{
				if(inputName = e[i].getAttribute("name"))
				{
					if(inputName === "companyname")
						e[i].value = "";
					else if(inputName.indexOf("first") >= 0)
						e[i].value = "John";
					else if(inputName.indexOf("last") >= 0)
						e[i].value = "Doe";
					else if(inputName.indexOf("name") >= 0)
						e[i].value = "John Doe";
					else if(inputName.indexOf("email") >= 0)
						e[i].value = "test@test.com";
					else if(inputName.indexOf("phone") >= 0)
						e[i].value = "(00) 0000 0000";
					else if(inputName.indexOf("mobile") >= 0)
						e[i].value = "0400222333";
					else if(inputName.indexOf("date") >= 0)
						e[i].value = "23/08/1991";
					else if(inputName.indexOf("suburb") >= 0)
						e[i].value = "Docklands";
					else if(inputName.indexOf("postcode") >= 0)
						e[i].value = "3008";
					else if(inputName.indexOf("state") >= 0)
						e[i].value = "VIC";
					else if(inputType == "number")
						e[i].value = 42;
					else if(inputType == "text")
						e[i].value = e[i].name.replace(/_/g, ' ');
					else if(inputType == "checkbox")
						e[i].checked = true;
					else if(inputType == "radio")
						e[i].checked = true;
					else if(inputType != 'file')
						e[i].value = inputName.replace(/_/g, ' ');
				}
			}
		}
	}
	/* Textareas */
	e = get("textarea");
	i = e.length;
	while(i--)
	{
		e[i].value = "Line 1\r\nLine 2"
	}
	e = document.getElementsByTagName("input");
	i = e.length;
	while(i--)
	{
		if(e[i].getAttribute("type") == "submit")
		{
			e[i].focus();
			break;
		}
	}
	/* Selects */
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
	if(e)
		e.textContent = str;
	return e;
}

function showSpecialLinks()
{
	var e, i, count = 0, links = [], newlink;
	e = get("a");
	i = e.length;
	while(i--)
	{
		if(e[i].href.indexOf("rapidshare.com") >= 0)
		{
			count++;
			newlink = document.createElement("a");
			newlink.href = newlink.textContent = e[i].href;
			links.push(newlink);
		}
	}
	if(count > 0)
		ylog(count + " Rapidshare links on this page", "samp", true);
	i = links.length;
	while(i--)
		document.body.insertBefore(createElementWithChild("h6", links[i]), document.body.firstChild);
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
			if(t.length/h.length < 0.4)
				e[i].className = "todelete";
		}
	}
}

function fixForums()
{
	if(!document.body)
		return;
	if(document.body.innerHTML.indexOf("bb-quote") !== -1)
		replaceElement(".bb-quote", "blockquote");
	if(document.body.innerHTML.indexOf("quote_container") !== -1)
		replaceElement(".quote_container", "blockquote");
	if(document.body.innerHTML.indexOf("quote-container") !== -1)
		replaceElement(".quote-container", "blockquote");
	if(document.body.innerHTML.indexOf("quotecontent") !== -1)
		replaceElement(".quotecontent", "blockquote");
	del(".signature");
}

function inject()
{
	//del("iframe");
	document.addEventListener("keydown", handleKeyDown, false);
	document.addEventListener("mouseup", handleMouseUp, false);
	deleteUselessIframes();
	showPassword();
	fixForums();
	//appendInfo();
}

function showPassword()
{
	var e, i, s;
	e = get("input");
	i = e.length;
	while(i--)
		if(e[i].type && e[i].type === "password")
			e[i].addEventListener("keyup", echoPassword, false);
}

function echoPassword(e)
{
	var e;
	e = e.target;
	showMessage(e.value);
}

function insertStyleNegative()
{
	//cleanupGeneral();
	insertStyle('html { background: #181818 !important; } body { margin: 0!important; } body, table, div, ul, ol { color: #888!important; background: #202020!important; font-weight: normal!important; } body.pad100 { padding: 100px!important; } body.pad100 table { width: 100%!important; } body.pad100 td, body.pad100 th { padding: 3px 10px!important; } body.pad100 image { display: block!important; } nav { background: #111!important; } body.xdark { background: #111!important; } body.xblack { background: #000!important; } body.xwrap { width: 500px!important; margin: 0 auto!important; } h1, h2, h3, h4, h5, h6 { color: #AAA!important; padding: 15px 30px !important; line-height: 160%!important; margin: 2px 0!important; background: #141414!important; border: 0!important; } h1 { font: 36px "swis721 cn bt", Calibri!important; color: #FFF !important; } h2 { font: 28px "swis721 cn bt", Calibri!important; } h3 { font: 24px "swis721 cn bt", Calibri!important; } h4 { font: 20px "swis721 cn bt", Calibri!important; } h5 { font: 16px "swis721 cn bt", Calibri!important; } h6 { font: 12px Verdana!important; color: #999!important; } h5, h6 { padding: 0.5em 10px!important; } dl { border-left: 20px solid #111!important; } dt { color: inherit!important; padding: 0.5em 10px!important; line-height: 160%!important; margin: 2px 0!important; background: #111!important; border: 0!important; border-left: 20px solid #080808!important; color: #AAA!important; } dd { color: inherit!important; padding: 0.25em 10px!important; line-height: 160%!important; margin: 2px 0!important; background: #141414!important; border: 0!important; border-left: 20px solid #080808!important; } select, input, textarea { border: 0!important; padding: 5px 10px!important; background: #242424!important; box-shadow: inset 0 0 5px #000!important; color: #999!important; line-height: 100%!important; -moz-appearance: none!important; border-radius: 0!important; } input div { color: #999!important; } select:focus, textarea:focus, input:focus { color: #999!important; outline: 0!important; background: #080808!important; } textarea:focus *, input:focus * { color: #999!important; } a:link { color: #09F !important; text-decoration: none!important; text-shadow: none!important; } a:visited { color: #36A !important; text-decoration: none!important; } a:hover, a:focus { color: #FFF!important; text-decoration: none!important; outline: 0!important; } a:active { color: #FFF!important; outline: none!important; } div { background: transparent!important; } article, section, header, footer, hgroup, nav, ins, small, big, aside, details, font, article, form, fieldset, label, span, blockquote, div, ul, ol, li, a, i, b, strong, dl { color: inherit!important; background: transparent!important; border-color: #181818!important; line-height: inherit!important; font-family: inherit!important; font-size: inherit!important; font-weight: inherit!important; text-decoration: inherit!important; } li { font-size: 12px!important; list-style-image: none!important; background-image: none!important; } tbody, thead, th, tr, td, table { background: #141414!important; color: inherit!important; font: 12px verdana!important; } body.pad100 ul { list-style: none!important; } body.pad100 ul li { border-left: 5px solid #080808!important; padding: 0 0 0 10px!important; margin: 0 0 2px 0!important; } cite, u, em, i, b, strong { font-weight: normal!important; font-style: normal!important; text-decoration: none!important; color: #AAA!important; } a u, a em, a i, a b, a strong { color: inherit!important; } small { font-size: 80%!important; } input, input *, button, button *, div, td, p { font-size: 12px!important; font-family: Verdana!important; line-height: 150%!important; } p { margin: 0!important; padding: 5px 0!important; font-style: normal!important; font-weight: normal!important; line-height: 150%!important; color: inherit!important; background: inherit!important; border: 0!important; } blockquote { margin: 0 0 0 20px!important; padding: 10px 0 10px 20px!important; border-style: solid!important; border-width: 10px 0 0 10px!important; border-color: #080808!important; } blockquote blockquote { margin: 0 0 0 20px!important; padding: 0 0 0 20px!important; border-width: 0 0 0 10px!important; } code { background: #0C0C0C!important; font-family: Verdcode!important; padding: 1px 2px!important; } pre { background: #0c0c0c!important; border-style: solid!important; border-width: 0 0 0 10px!important; border-color: #444!important; padding: 10px 20px!important; font: 12px Verdcode!important; } pre, code { color: #999!important; } pre p { margin: 0!important; padding: 0!important; font: 12px Verdcode!important; } pre em { color: #57F!important; } pre i { color: #FFF!important; } pre b { color: #F90!important; } pre u { color: #0F0!important; text-decoration: none!important; } pre dfn { font-style: normal!important; color: #F70!important; background: #331500!important; } pre s { color: #F00!important; text-decoration: none!important; background: #400!important; } a img { border: none!important; } a:visited img { border-color: #666!important; } a:hover img { border-color: #F00!important; } button img, input img { display: none!important; } table { border-collapse: collapse!important; background: #141414!important; border: 0!important; } td { vertical-align: top!important; border-width: 0px!important; } caption, th { background: #111!important; border-color: #111!important; text-align: left!important; } th, tr, tbody { border: 0!important; } fieldset { border: 1px solid #111!important; margin: 0 0 1px 0!important; } span, ul, ol, li, div { border: 0!important; } hr { height: 2px!important; background: #282828!important; border-style: solid!important; border-color: #000!important; border-width: 1px 0 0 0!important; margin: 20px 0!important; } legend { background: #0e0e0e!important; } textarea, textarea div { font-family: verdcode!important; } mark, samp { background: #331500 !important; color: #F90 !important; } samp, mark mark { font: 24px "swis721 cn bt"!important; }');
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
			case "sn132w.snt132.mail.live.com":
			//case "dropbox.com":
			//case "www.dropbox.com":
				load = false;
				break;
			case "www.imdb.com":
				replaceElement(".head", "h2");
				break;
			case "drupal.org":
				replaceElement(".codeblock", "pre");
				break;
			case "isohunt.com":
				del(["embed", "object", "img"]);
				break;
			case "bolt.cd":
				doBolt();
				//clickThanks();
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
				highlightNodesContaining("cite", "opensubtitles");
				highlightLinksWithHrefContaining("opensubtitles");
				break;
			case "php.net":
			case "www.php.net":
				replaceElement(".phpcode", "pre");
				fixParagraphs();
				break;
			case "forums.whirlpool.net.au":
				del(["h1", "h2"]);
				highlightNodesContaining("a", "Micron21");
				replaceElement("mark", "samp");
				replaceElement(".wcrep1", "blockquote");
				replaceElement(".replyuser", "h5");
				replaceElement(".replytools", "h6");
				replaceElement(".op", "samp");
				break;
			case "www.thinkstockphotos.com.au":
				insertStyle("body, header, aside, article, section, div, td, ul, ol {background: #222 !important;color:#808080 !important;font:12px verdana !important;border:0 !important;border-style:solid!Important;border-color:#000!important;} a{background: #111 !important; }")
				break;
			case 'redditlog.com':
			case 'www.redditlog.com':
				replaceElement(".title", "h1");
				replaceElement("div", "blockquote");
				replaceElement(".author", "h4");
				cleanupGeneral();
				break;
			case 'imgur.com':
				setDocTitle(document.title);
				break;
			case 'last.fm':
			case 'www.last.fm':
				insertStyle('body { background: #222; } article, section, div { background-color: #222 !important; color: #999 !important; border-color: #111 !important; } td, span { background-color: #181818 !important; color: #999 !important; }');
				if(get(".the_photo").length)
				{
					alert("got it");
					location.href = get(".the_photo")[0].src;
				}
				break;
			case '500px.com':
				insertStyle('#px, .photo_wrap, .photo_buy, .photo_show, .photo_activity { background: #111 !important; } ');
				//if(get(".the_photo").length)
				//	location.href = get(".the_photo")[0].src;
				break;
			case 'www.flickr.com':
				//del('.global-nav-shim');
				insertStyle('body, .pp-box, .sub-photo-container, .sub-photo-view, .fluid-subnav {background: #181818 !important; color: #666 !important;} .sub-photo-left-view img, .spaceball { display: none !important;} .photo-display-container .row .photo-display-item, .new-comment-text, #gn-search-field, .meta-field {background: #111 !important; color: #999 !important;}.global-nav-restyle .global-nav-content, .fluid .fluid-subnav.fixed { position: relative !important; }a{color:#CCC!important;}a:hover{color:#FFF!important;}');
				setTimeout(doFlickr, 10000);
				break;
			case 'www.youtube.com':
				setTimeout(doYoutube, 1000);
				break;
			case 'gfycat.com':
			case 'www.gfycat.com':
				setTimeout(doGfycat, 100);
				break;
			case 'giant.gfycat.com':
				var s = location.href.replace(/\.gif/, '');
				s = s.replace(/giant\./, '');
				alert(s);
				location.href = s;
				break;
			case 'secure.professionalhosting.com.au':
				if(location.href.indexOf('phpMyAdmin') > 0)
					insertStyle('#page_content { margin: 0 0 0 300px !important; }');
				break;
			case 'tumblr.com':
				insertStyle('html, body, body * { background-color: #111 !important; color: #777 !important; }');
				break;
			case 'www.nzbindex.nl':
				highlightNodesContaining("span", "missing");
				highlightNodesContaining("span", "Password");
				highlightNodesContaining("label", ".rar");
				replaceElement("label", "h3");
				break;
			case 'stackoverflow.com':
			case 'superuser.com':
				getContent();
				del("img");
				del("#sidebar");
				cleanupGeneral();
				highlightCode();
				break;
			case 'theawesomer.com':
				replaceElement("h2", "h6");
				break;
			case 'twitter.com':
			case 'www.twitter.com':
				insertStyle('.GalleryNav {display: none !important; } .global-nav .people .count { color: #FFF !important; font-size: 18px !important; }')
				break;
			case 'thenounproject.com':
				insertStyle('body, div, section, ul, li, input {background: #181818  !important; color: #FFF !important; }img{ filter: invert(1); }')
				break;
			case 'localhost':
				// for phpmyadmin, may be no longer needed
				//insertStyle('#page_content { margin: 0 0 0 400px; }');
				break;
			case 'developer.mozilla.org':
				
				break;
			default:
				load = true;
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


