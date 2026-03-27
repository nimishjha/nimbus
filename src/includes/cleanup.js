import { Nimbus } from "./Nimbus";
import { makePlainText, removeAllAttributesOf, emptyElement, createElement, unwrapElement } from "./element";
import { get, getOne, del, select } from "./selectors";
import { markElement, getMarkedElements, markNavigationalLists, markElements, unmarkAll } from "./mark";
import { fixInternalReferences } from "./link";
import { createElementWithChildren, removeAttributeOf, unwrapAll, removeAllAttributesOfTypes, deleteClass } from "./element";
import { replaceDiacritics, replaceSpecialCharacters } from "./text";
import { containsAnyOfTheStrings, containsAllOfTheStrings, removeWhitespace, trimSpecialChars, normalizeString, capitalize } from "./string";
import { getXpathResultAsArray, getEmptyTextNodesUnderElement } from "./xpath";
import { addLinksToLargerImages } from "./image";
import { replaceElementsBySelector, replaceElementKeepingIdAndClass } from "./replaceElements";
import { deleteEmptyElements, deleteEmptyBlockElements, deleteBySelectorAndRegex } from "./delete";
import { getTextLength } from "./node";
import { deleteIframes, deleteByClassOrIdContaining, deleteBySelectorAndTextMatching } from "./delete";
import { makeClassSelector, getTimestamp, createUniqueID } from "./misc";
import { getBestImageSrc } from "./image";
import { appendMetadata } from "./metadata";
import { toggleStyleNegative, insertStyleHighlight } from "./style";
import { showMessageBig, showMessageError } from "./ui";
import { retrieve } from "./retrieve";
import { moveIDsFromEmptyAnchors, createLinksByHrefLookup } from "./link";
import { isCurrentDomainLink } from "./url";
import { getAllClassesFor } from "./inspect";
import { replaceClass } from "./dom";
import { callFunctionWithArgs } from "./command";
import { hasDuplicateIDs } from "./validations";
import { BLOCK_TAGS_SET } from "./constants";

function replaceIframes()
{
	const elems = get("iframe");
	if(!elems) return;
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		const iframereplacement = document.createElement("rp");
		const iframelink = document.createElement("a");
		let iframeSrc = elem.src;
		if(containsAnyOfTheStrings(iframeSrc, ["facebook", "twitter"]))
		{
			elem.remove();
			continue;
		}
		iframelink.href = iframeSrc;
		if(~iframeSrc.indexOf("youtube") && iframeSrc.indexOf("subscribe_embed") === -1)
		{
			iframeSrc = iframeSrc.replace(/\/embed\//, '/watch?v=');
			const segments = iframeSrc.split('?');
			iframelink.href = segments[0] + '?' + segments[1];
			iframelink.textContent = iframelink.href;
		}
		else
		{
			iframelink.textContent = "iframe: " + iframelink.href;
		}
		iframereplacement.appendChild(iframelink);
		elem.replaceWith(iframereplacement);
	}
}

export function cleanupDocument()
{
	cleanupHead();
	cleanupTitle();
	del(["link", "style", "script", "input", "select", "textarea", "button", "x", "canvas", "label", "svg", "video", "audio", "applet", "message"]);
	deleteHtmlComments();
	removeAllAttributesOf(document.documentElement);
	removeAllAttributesOf(document.body);
	replaceIframes();
	addLinksToLargerImages();
	replaceIncorrectHeading();
	replaceSpecialCharacters();
	replaceElementsBySelector("center", "div");
	setDocTitle();
	cleanupAttributes();
	replaceElementsBySelector("strong", "b");
	replaceElementsBySelector("em", "i");
	replaceElementsBySelector("details", "div");
	replaceElementsBySelector("summary", "h3");
	deleteEmptyBlockElements();
	deleteBySelectorAndRegex("a", /^[¶§#]$/);
	const footers = get("footer");
	if(footers && footers.length > 1)
	{
		replaceElementsBySelector("footer", "h6");
		makePlainText("h6");
	}
	makePlainText("li header");
	replaceAudio();
	appendMetadata();
	getBestImageSrc();
	removeRedundantHrs();
	document.body.className = "pad100 xwrap";
	document.documentElement.id = "nimbus";
	document.documentElement.className = "";
	document.body.id = "nimbus";
	if(~navigator.userAgent.indexOf("Chrome"))
	{
		toggleStyleNegative();
	}
}

export function cleanupAttributes()
{
	const elems = document.getElementsByTagName("*");
	const attrsToKeep = new Set(["id", "class", "href", "src", "srcset", "name", "colspan", "rowspan"]);
	for(const elem of elems)
		for(const attr of elem.attributes)
			if(!attrsToKeep.has(attr.name))
				elem.removeAttribute(attr.name);
}

export function cleanupBarebone()
{
	removeAllAttributesOfTypes(["class", "style", "align"]);
	del("noscript");
	if(get("span[id]"))
		fixInternalReferences();
	unwrapAll("span");
	deleteHtmlComments();
	removeInlineStyles();
	unwrapAll("pre code");
}

export function removeRedundantHrs()
{
	const makesHrRedundant = new Set([
		"HGROUP",
		"H1",
		"H2",
		"H3",
		"H4",
		"H5",
		"H6",
		"HR",
		"FIGURE",
		"FIGCAPTION",
		"FOOTNOTE",
		"RT",
		"BLOCKQUOTE",
		"HEADER",
		"UL",
		"OL",
		"PRE",
		"SECTION",
	]);
	const elems = get("hr");
	if(elems)
	{
		let count = 0;
		for(const elem of elems)
		{
			const prev = elem.previousElementSibling;
			const next = elem.nextElementSibling;
			if( (prev && makesHrRedundant.has(prev.tagName)) || (next && makesHrRedundant.has(next.tagName)) )
			{
				count++;
				elem.remove();
			}
		}
		const firstAndLastHrs = get("hr:first-child, hr:last-child");
		if(firstAndLastHrs.length) {
			count += firstAndLastHrs.length;
			del(firstAndLastHrs);
		}
		showMessageBig(count + " redundant hrs removed");
	}
}

export function deleteNonContentLists()
{
	const lists = select("ul", "doesNotHaveChildrenOfType", "ul");
	if(!lists) return;
	for(let i = 0, ii = lists.length; i < ii; i++)
	{
		const list = lists[i];
		const listText = list.textContent;
		if(listText && (containsAllOfTheStrings(listText, ["witter", "acebook"]) || containsAllOfTheStrings(listText, ["hare", "weet"])))
			list.remove();
	}
}

export function deleteNonContentLinks()
{
	deleteBySelectorAndRegex("a", /^(Edit|Reply|Share|Tweet|Delete|Replies)$/i);
}

export function deleteNonContentElements()
{
	replaceElementsBySelector("article", "div");
	markNavigationalLists();
	deleteNonContentLists();
	deleteEmptyElements("p");
	deleteEmptyElements("div");
	return;
}

export function removeEventListeners()
{
	var newBody = document.createElement("newbody");
	newBody.innerHTML = document.body.innerHTML;
	document.documentElement.textContent = "";
	document.documentElement.appendChild(newBody);
}

export function getContentByParagraphCount()
{
	const LONG_PARAGRAPH_THRESHOLD = 100;
	const markedElements = getMarkedElements();
	if(markedElements.length)
	{
		retrieve(makeClassSelector(Nimbus.markerClass));
		cleanupDocument();
		unmarkAll();
		deleteIframes();
		deleteEmptyBlockElements();
		return;
	}
	del("nav");
	del("svg[class*=icon]");
	deleteNonContentLists();
	deleteNonContentLinks();
	insertStyleHighlight();
	const paragraphs = get("p");
	if(!paragraphs)
	{
		showMessageError("No paragraphs found");
		return;
	}
	const longParagraphs = [];
	for(let i = 0, ii = paragraphs.length; i < ii; i++)
	{
		const paragraph = paragraphs[i];
		if(paragraph.textContent && normalizeString(paragraph.textContent).length > LONG_PARAGRAPH_THRESHOLD)
		{
			paragraph.classList.add("longParagraph");
			longParagraphs.push(paragraph);
		}
	}
	const candidateDivs = [];
	for(let i = 0, ii = longParagraphs.length; i < ii; i++)
	{
		const tempContainer = longParagraphs[i].closest("div");
		if(tempContainer)
			candidateDivs.push(tempContainer);
	}
	let highestNumParagraphs = 0;
	let contentDiv = candidateDivs.length ? candidateDivs[0] : paragraphs[0];
	for(let i = 0, ii = candidateDivs.length; i < ii; i++)
	{
		const div = candidateDivs[i];
		let numParagraphs = div.getElementsByClassName("longParagraph").length;
		if(numParagraphs > highestNumParagraphs)
		{
			highestNumParagraphs = numParagraphs;
			contentDiv = div;
		}
	}
	while(
		contentDiv &&
		contentDiv.parentNode &&
		contentDiv.parentNode.tagName !== "BODY" &&
		contentDiv.getElementsByClassName("longParagraph").length < longParagraphs.length * 0.8
	)
		contentDiv = contentDiv.parentNode;

	let HEADINGS_SELECTOR = "h1, h2";
	if(get("h1")) HEADINGS_SELECTOR = "h1";
	else if(get("h2")) HEADINGS_SELECTOR = "h2";
	else if(get("h3")) HEADINGS_SELECTOR = "h3";
	if(document.querySelectorAll(HEADINGS_SELECTOR).length > 0 && contentDiv.querySelectorAll(HEADINGS_SELECTOR).length === 0)
	{
		while(
			contentDiv &&
			contentDiv.parentNode &&
			contentDiv.parentNode.tagName !== "BODY" &&
			contentDiv.querySelectorAll(HEADINGS_SELECTOR).length === 0
		)
		{
			contentDiv = contentDiv.parentNode;
		}
	}
	deleteClass("longParagraph");
	if(contentDiv)
		markElement(contentDiv);
	else
		showMessageError("Could not find content");
}

function replaceParentWithChild(parentSelector, childSelector)
{
	const children = get(childSelector);
	if(!children) return;
	for(const child of children)
	{
		const parent = child.closest(parentSelector);
		const grandparent = parent.parentNode;
		if(parent && grandparent)
		{
			grandparent.replaceChild(child, parent);
		}
	}
}

export function cleanupStackOverflow()
{
	function handleMutations(mutations)
	{
		console.log("handleMutations");
		for(let i = 0, ii = mutations.length; i < ii; i++)
			if(mutations[i].addedNodes.length)
			{
				console.log("\t deleting resources...");
				del(["link", "script", "iframe"]);
			}
	}

	retrieve("#content");
	del([
		"#sidebar", ".signup-prompt", ".post-menu", ".user-gravatar32", "form", ".d-none", ".-flair", "#launch-popover", ".comments-link", ".aside-cta", ".js-post-menu", "iframe",
		".js-bottom-notice", ".votecell", ".comment-actions", ".js-share-link", ".js-suggest-edit-post", ".js-voting-container", "form", ".js-bottom-notice", ".js-menu-popup-container",
		".js-post-menu", ".answers-subheader", ".s-modal",
	]);

	makePlainText(".comment-date");
	replaceElementsBySelector(".comments-list", "dl");
	replaceElementsBySelector(".comment", "dd");
	replaceElementsBySelector(".comment-copy", "quote");
	replaceElementsBySelector(".comment-user", "postauthor");
	replaceElementsBySelector(".comment-date", "postdate");
	replaceElementsBySelector(".user-action-time", "postdate");
	replaceElementsBySelector(".comment-score", "kbd");
	replaceElementsBySelector(".user-details", "postauthor");
	replaceElementsBySelector(".post-tag", "tag");
	deleteByClassOrIdContaining("comments-link");
	replaceElementsBySelector(".answercell", "dt");
	replaceElementsBySelector(".user-action-time", "postdate");
	makePlainText("pre");
	makePlainText("h6");
	makePlainText("postauthor");
	makePlainText("postdate");
	replaceParentWithChild(".ai-center", ".ai-center postauthor");

	unwrapAll(".js-post-tag-list-item");
	replaceElementsBySelector(".js-post-tag-list-wrapper", "footer");

	deleteBySelectorAndTextMatching("h2", "Not the answer");

	cleanupDocument();
	removeAllAttributesOfTypes(["class", "style", "align", "id"]);
	unwrapAll("span");
	makePlainText("user");
	unwrapAll("user");

	const observer = new MutationObserver(handleMutations);
	observer.observe(getOne("head"), { childList: true });
}

export function replaceCommonClassesNew()
{
	function looksLikeH2(str)
	{
		return /^(ch|fb).*ti/.test(str) ||
			/^ch.*n/.test(str) ||
			/^ch.*(head|label)/.test(str) ||
			/^[bf]m.*tit/.test(str) ||
			/^[bf]mh/.test(str) ||
			/^[bf]msh/.test(str) ||
			str.startsWith("parthead") ||
			str.startsWith("parttitle") ||
			str.startsWith("contentshead") ||
			str.startsWith("h2") ||
			str.startsWith("cst") ||
			str.startsWith("gmh") ||
			/^pt.*(num|tit)/.test(str);
	}

	function looksLikeH4(str)
	{
		return str.startsWith("h4");
	}

	function looksLikeFigcaption(str)
	{
		return /^fig.*cap/.test(str) || str.startsWith("cap");
	}

	function looksLikeFigure(str)
	{
		return str.startsWith("fig") || str.includes("image");
	}

	function looksLikeFootnote(str)
	{
		for(const prefix of ["note", "end", "footn", "fn", "ntx"])
			if(str.startsWith(prefix))
				return true;
		return false;
	}

	function looksLikeDT(str)
	{
		return str.startsWith("bib") || str.startsWith("ref") || str.startsWith("copy");
	}

	function looksLikeQuoteSource(str)
	{
		return str.startsWith("epigraphs");
	}

	function looksLikeQuote(str)
	{
		return str.startsWith("epigraph");
	}

	function looksLikeBlockquote(str)
	{
		return /quote/.test(str) || /block/.test(str);
	}

	replaceElementsBySelector("table p", "div");
	replaceElementsBySelector("strong,.epub-b, .b", "b");
	replaceElementsBySelector("em, .epub-i, .i", "i");
	replaceElementsBySelector(".pn, .pt, .partnum, .parttitle, .pt-num, .pt-title, .partno, .ptno, .pttit", "h1");
	replaceElementsBySelector("body > div", "section");
	replaceElementsBySelector("section section", "div");
	replaceElementsBySelector(".epub-sc, .small", "small");
	replaceElementsBySelector(".atx1, div.block, .afmtx, .afmtx1", "blockquote");
	replaceElementsBySelector("span[class*=ital], span[class*=txit], span[class*=epub-i]", "i");
	replaceElementsBySelector("span[class*=bold], span[class*=txbd], span[class*=epub-b]", "b");
	replaceElementsBySelector("span[class*=small]", "small");

	unwrapAll('span[class*=dropcap]');
	unwrapAll('span[class*=stickup]');

	removeAttributeOf("a, i, b, sup, small", "class");

	const elems = get("p");
	if(elems)
	{
		for(const elem of elems)
		{
			const classNorm = elem.className.toLowerCase().replace(/[^0-9a-z]/g, "");
			if(classNorm.length)
			{
				if(looksLikeH2(classNorm)) replaceElementKeepingIdAndClass(elem, "h2");
				else if(looksLikeH4(classNorm)) replaceElementKeepingIdAndClass(elem, "h4");
				else if(looksLikeFigcaption(classNorm)) replaceElementKeepingIdAndClass(elem, "figcaption");
				else if(looksLikeFigure(classNorm)) replaceElementKeepingIdAndClass(elem, "figure");
				else if(looksLikeDT(classNorm)) replaceElementKeepingIdAndClass(elem, "dt");
				else if(looksLikeFootnote(classNorm)) replaceElementKeepingIdAndClass(elem, "footnote");
				else if(looksLikeQuoteSource(classNorm)) replaceElementKeepingIdAndClass(elem, "quoteauthor");
				else if(looksLikeQuote(classNorm)) replaceElementKeepingIdAndClass(elem, "quote");
				else if(looksLikeBlockquote(classNorm)) replaceElementKeepingIdAndClass(elem, "blockquote");
			}
		}
	}
}

export function replaceCommonClasses()
{
	replaceElementsBySelector("strong", "b");
	replaceElementsBySelector("em", "i");

	replaceElementsBySelector('.pn, .pt, .partnum, .parttitle, .pt-num, .pt-title, .partno, p[class^="part-"], .ptno, .pttit', "h1");
	replaceElementsBySelector(".bmh, .cn, .ct, .chapnum, .chapternumber, .tochead, .chaptitle, .chaptertitle, .chap-num, .chap-title, .fmh, .fmht, .fmtitle, .fm-title, .chapno, .chno, .chnum, .chtitle, .ch-num, .ch-title, .chap-tit, .title-num, .toc-title, .cht, .chaptit", "h2");
	replaceElementsBySelector('p[class*="fmtitle"], p[class*="chtitle"]', "h2");
	replaceElementsBySelector(".cst, .h", "h3");
	replaceElementsBySelector(".figcap", "figcaption");
	replaceElementsBySelector(".fig-cap", "figcaption");
	replaceElementsBySelector(".figure", "figure");
	replaceElementsBySelector(".comment", "comment");
	replaceElementsBySelector('p[class^="fn"], p[class*=note]', "footnote");
	replaceElementsBySelector('p[class^="crt"], p[class^="copy"], .bib', "dt");
	replaceElementsBySelector('.epiv, .cepiv, .epigraph', "quote");
	replaceElementsBySelector('p[class^="attri"], .eps, .ceps, .epigraph-source', "quoteauthor");

	replaceElementsBySelector("div[class*=comment-author]", "h5");
	replaceElementsBySelector("div[class*=comment-meta]", "h6");
	replaceElementsBySelector("div[class*=comment-footer]", "h6");
	replaceElementsBySelector("div[class*=sidebar]", "aside");
	replaceElementsBySelector("div[class*=social]", "aside");
	replaceElementsBySelector("p[class*=toc-head]", "h2");
	replaceElementsBySelector("p[class*=chaptertitle]", "h2");
	replaceElementsBySelector("p[class*=subtitle], div[class*=subtitle], p[class*=subhead], div[class*=subhead]", "h3");
	replaceElementsBySelector("p[class*=image], div[class*=image]", "figure");
	replaceElementsBySelector("p[class*=caption], div[class*=caption]", "figcaption");
	replaceElementsBySelector("p[class*=author], div[class*=author]", "h4");
	replaceElementsBySelector("p[class*=date], div[class*=date]", "h5");
	replaceElementsBySelector("p[class*=quote], div[class*=quote]", "blockquote");

	if(getOne(".indexmain"))
	{
		replaceElementsBySelector(".indexmain", "dt");
		replaceElementsBySelector(".indexmain1", "dt");
		replaceElementsBySelector(".indexsub", "dd");
	}
	if(getOne(".indexitem"))
	{
		replaceElementsBySelector(".indexitem", "dt");
		replaceElementsBySelector(".indexitem1", "dt");
		replaceElementsBySelector(".indexitem2", "dd");
	}

	if(getOne(".primary") && getOne(".secondary"))
	{
		replaceElementsBySelector(".primary, .primary1", "dt");
		replaceElementsBySelector(".secondary", "dd");
		replaceElementsBySelector(".tertiary, .ternary", "d3");
	}

	replaceElementsBySelector("div.indent", "p");
	deleteClass("indent");
}

export function clearBootstrapClasses()
{
	const elems = get("div[class*=col-]");
	for(let i = 0, ii = elems.length; i < ii; i++)
		elems[i].className = "";
}

export function deleteHtmlComments()
{
	del(getXpathResultAsArray("//body//comment()"));
}

export function replaceAudio()
{
	let sources = get("source");
	if(!sources) return;
	let i = sources.length;
	while(i--)
	{
		const source = sources[i];
		if(source.src)
		{
			const audioLink = createElement("a", { href: source.src, textContent: source.src });
			const audioLinkWrapper = createElementWithChildren("h2", audioLink);
			source.replaceWith(audioLinkWrapper);
		}
	}
	replaceElementsBySelector("audio", "h2");
}

export function fixBody()
{
	const newBody = getOne("newbody");
	const replacement = document.createElement("body");
	while(newBody.firstChild)
		replacement.appendChild(newBody.firstChild);
	newBody.replaceWith(replacement);
}

export function removeSpanTags(isOkToLoseIds)
{
	if(!isOkToLoseIds)
		moveIDsFromEmptyAnchors();
	unwrapAll("span");
}

export function removeUnnecessaryClasses()
{
	removeAttributeOf("table, tbody, thead, th, tr, td, i, em, b, strong, a, ul, ol, li, sup, sub, small, pre, code, h1, h2, h3, h4, h5, h6, dt, dd, dl, blockquote, footnote, figure, figcaption", "class");
}

export function simplifyClassNames(selector)
{
	const sel = selector ||  "section, div, header, p, span";
	const elems = get(sel);
	const classMap = {};
	const numClassesByTagName = {};
	const tagMap = {
		div: "d",
		span: "s",
		blockquote: "bl",
		reference: "r",
	};
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const tagName = elem.tagName.toLowerCase();
		const className = elem.className.toString() || "";
		const oldClass = tagName + "_" + className.replace(/[^a-zA-Z0-9]+/g, "");
		if(!oldClass.length)
			continue;
		elem.setAttribute("class", oldClass);
		classMap[oldClass] = tagName;
		numClassesByTagName[tagName] = 0;
	}
	let keys = Object.keys(classMap);
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		const tagName = classMap[key];
		const tagNameMapped = tagMap[tagName] || tagName;
		const index = numClassesByTagName[tagName]++;
		if(/h\d/.test(tagName))
			replaceClass(key, tagNameMapped + "_" + index);
		else
			replaceClass(key, tagNameMapped + index);
	}
}

export function shortenIds()
{
	if(hasDuplicateIDs())
	{
		showMessageError("Document has elements with duplicate IDs");
		return;
	}
	const linksByHref = createLinksByHrefLookup();
	const elems = get("body *[id]");
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(elem.tagName === "STYLE" || elem.tagName === "BODY") continue;
		const links = linksByHref["#" + elem.id];
		if(links && links.length)
		{
			elem.id = createUniqueID(i + 1);
			for(const link of links)
				link.setAttribute("href", "#" + elem.id);
		}
		else
		{
			elem.removeAttribute("id");
		}
	}
}

export function cleanupTitle()
{
	const titleText = sanitizeTitle(document.title);
	const headings = document.querySelectorAll("h1, h2");
	if(headings && headings.length)
	{
		for(let i = 0, ii = headings.length; i < ii; i++)
		{
			const heading = headings[i];
			if(!heading.textContent || !heading.textContent.length)
				continue;
			const headingText = sanitizeTitle(heading.textContent);
			if(removeWhitespace(headingText).length === 0)
				continue;
			if(!titleText)
			{
				document.title = headingText;
				return;
			}
			else if(~titleText.indexOf(headingText) && headingText.length < titleText.length)
			{
				document.title = headingText;
				return;
			}
		}
	}
}

export function editDocumentTitle()
{
	const currentHeading = chooseDocumentHeading();
	callFunctionWithArgs("Set document heading", setDocTitle, 1, currentHeading);
}

export function chooseDocumentHeading()
{
	Nimbus.currentHeadingText = getTitleWithoutDomainTag();
	return Nimbus.currentHeadingText;
}

export function setDocumentHeading(headingText)
{
	emptyElement(getOne(Nimbus.HEADING_CONTAINER_TAGNAME));
	const firstHeadingText = document.body.firstChild.textContent;
	if(firstHeadingText === headingText)
		return;
	let newHeading = createElement("h1", { textContent: headingText });
	let newHeadingWrapper = getOne(Nimbus.HEADING_CONTAINER_TAGNAME);
	if(!newHeadingWrapper)
	{
		newHeadingWrapper = createElement(Nimbus.HEADING_CONTAINER_TAGNAME);
		document.body.insertBefore(newHeadingWrapper, document.body.firstChild);
	}
	newHeadingWrapper.appendChild(newHeading);
	Nimbus.currentHeadingText = headingText;
}

export function getBestDomainSegment(hostname)
{
	if(!hostname || !hostname.length)
		return "";
	const segmentsToReplace = ["www.", "developer.", ".com", ".org", ".net", ".wordpress", ".blogspot"];
	let hostnameSanitized = hostname;
	for(let i = 0, ii = segmentsToReplace.length; i < ii; i++)
		hostnameSanitized = hostnameSanitized.replace(segmentsToReplace[i], "");
	if(/\w+\.github\.io/.test(hostnameSanitized))
		hostnameSanitized = hostnameSanitized.replace(".github.io", "");
	if(hostnameSanitized.indexOf(".") === -1)
		return " [" + hostnameSanitized + "]";
	let segments = hostnameSanitized.split(".");
	let longestSegment = '';
	let i = segments.length;
	while(i--)
	{
		let segment = segments[i];
		if(longestSegment.length < segment.length)
			longestSegment = segment;
	}
	return " [" + longestSegment + "]";
}

export function removeInlineStyles()
{
	const e = get("*");
	let i = e.length;
	while(i--)
		e[i].removeAttribute("style");
}

export function replaceInlineStylesWithClasses(selector = "span[style]")
{
	const elems = get(selector);
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(elem.hasAttribute("style"))
		{
			elem.className = elem.getAttribute("style").replace(/[^A-Za-z0-9]/g, "");
			elem.removeAttribute("style");
		}
	}
}

export function convertClassesToCustomElements(selector, baseTagName)
{
	if(typeof selector !== "string") return;
	const classes = getAllClassesFor(selector);
	for(let i = 0, ii = classes.length; i < ii; i++)
	{
		const className = classes[i];
		let replacementTagName;
		if(typeof baseTagName === "string" && baseTagName.length)
		{
			replacementTagName = baseTagName + i;
		}
		else
		{
			const elem = getOne(makeClassSelector(className));
			if(!elem) continue;
			const tagName = elem.tagName;
			replacementTagName = tagName.toLowerCase() + i;
		}
		replaceElementsBySelector(makeClassSelector(classes[i]), replacementTagName);
	}
}

export function cleanupHead()
{
	const head = getOne("head");
	if(!head)
		return;
	const tempTitle = document.title;
	emptyElement(head);
	document.title = tempTitle;
}

export function cleanupLinks()
{
	const links = get("a");
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		const newLink = document.createElement("a");
		if(link.id) newLink.id = link.id;
		if(link.href) newLink.href = link.href;
		while (link.firstChild)
			newLink.appendChild(link.firstChild);
		link.replaceWith(newLink);
	}
}

export function removeRedundantDivs()
{
	let count = 0;
	const divs = get("div");
	for(let i = 0; i < divs.length; i++)
	{
		const div = divs[i];
		del(getEmptyTextNodesUnderElement(div));
		if(div.children.length === 1 && div.childNodes.length === 1 && BLOCK_TAGS_SET.has(div.firstChild.tagName))
		{
			unwrapElement(div);
			count++;
		}
	}
	showMessageBig(`${count} redundant divs removed`);
}

export function sanitizeTitle(titleString)
{
	if(titleString === undefined || titleString === null)
		return;
	let sanitizedTitle;
	sanitizedTitle = titleString.toString();
	sanitizedTitle = replaceDiacritics(sanitizedTitle);

	sanitizedTitle = sanitizedTitle.replace(/&/g, " and ")
		.replace(/\u00df/g, 'SS')
		.replace(/\u0142/g, "'l")
		.replace(/\u2018/g, "'")
		.replace(/\u2019/g, "'")
		.replace(/[|\?]/g, "")
		.replace(/[\/]/g, "_")
		.replace(/:/g, " - ")
		.replace(/[^\+\(\)0-9A-Za-z_!,\[\]\-\(\)']/g, " ")
		.replace(/ , /g, ", ")
		.replace(/\s+/g, " ");

	return trimSpecialChars(sanitizedTitle);
}

export function getTitleWithoutDomainTag()
{
	if(document.title)
		return document.title.replace(getBestDomainSegment(location.hostname), "").trim()	;
}

export function capitalizeTitle()
{
	if(typeof document.title === "string" && document.title.length)
	{
		const title = getTitleWithoutDomainTag();
		document.title = capitalize(title);
		setDocTitle(document.title);
	}
}

export function addDateToTitle()
{
	document.title = document.title + " " + getTimestamp("dateOnly");
	setDocTitle(document.title);
}

export function setDocTitle(newTitle)
{
	let headingText = sanitizeTitle(newTitle || chooseDocumentHeading());
	setDocumentHeading(headingText);
	const domainSegment = getBestDomainSegment(location.hostname);
	document.title = headingText + domainSegment;
}

export function replaceIncorrectHeading()
{
	const heading1 = getOne("h1");
	if(heading1)
	{
		const heading1link = heading1.querySelector("a");
		if(heading1link)
		{
			if(isCurrentDomainLink(heading1link.href))
			{
				const temp = createElement("h3", { innerHTML: heading1.innerHTML });
				heading1.replaceWith(temp);
			}
		}
	}
}

export function fixTextAroundReferences(selector = "footnote reference")
{
	const regexPeriodOrClosingBracket = /^[\]\.]/;
	const regexOpeningBracket = /\[$/;
	const elems = get(selector);
	if(!elems) return;

	let count = 0;
	for(const elem of elems)
	{
		const next = elem.nextSibling;
		if(next && next.nodeType === 3)
		{
			if(regexPeriodOrClosingBracket.test(next.data))
			{
				next.data = next.data.replace(regexPeriodOrClosingBracket, "");
				count++;
			}
		}
		const prev = elem.previousSibling;
		if(prev && prev.nodeType === 3)
		{
			if(regexOpeningBracket.test(prev.data))
			{
				prev.data = prev.data.replace(regexOpeningBracket, "");
				count++;
			}
		}
	}
	showMessageBig(`${count} text nodes fixed`);
}

export function splitElementsByChildren(selector = "h1, h2, h3, h4", parentTagName, childTagName)
{
	const elems = get(selector);
	if(elems)
	{
		let count = 0;
		const tagName = childTagName || "same";
		const wrapperTagName = parentTagName || "hgroup";
		for(const elem of elems)
		{
			elem.normalize();

			if(elem.childNodes.length === 1)
				continue;

			const wrapper = document.createElement(wrapperTagName);
			for(let i = 0, ii = elem.childNodes.length; i < ii; i++)
			{
				const child = elem.childNodes[i];
				if(!child)
					continue;

				const childWrapper = tagName === "same" ? document.createElement(elem.tagName) : document.createElement(tagName);
				childWrapper.className = "child" + i;

				if(child.nodeType === Node.TEXT_NODE)
				{
					if(getTextLength(child) !== 0)
					{
						childWrapper.textContent = child.data;
						wrapper.appendChild(childWrapper);
					}
				}
				else
				{
					if(child.tagName !== "BR" && child.tagName !== "HR" && getTextLength(child) !== 0)
					{
						childWrapper.appendChild(child.cloneNode(true));
						wrapper.appendChild(childWrapper);
					}
				}
			}
			if(wrapper.children.length > 1)
			{
				if(elem.id)
					wrapper.id = elem.id;
				elem.replaceWith(wrapper);
				count++;
			}
		}
		showMessageBig(`${count} elements affected`);
	}
}

export function createAnchorInside(element, id)
{
	const anchor = document.createElement("cite");
	anchor.textContent = anchor.id = id;
	element.appendChild(anchor);
}

export function unwrapLinksInsideHeadings(selector = "h1 a, h2 a, h3 a, h4 a")
{
	const elems = get(selector);
	if(elems)
	{
		let count = 0;
		for(const elem of elems)
		{
			if(elem.getAttribute("href") !== null)
				continue;
			const parent = elem.closest("h1, h2, h3, h4, h5, h6");
			if(parent)
			{
				if(!parent.id)
					parent.id = elem.id;
				else
					createAnchorInside(parent, elem.id);
				unwrapElement(elem);
				count++;
			}
		}
		showMessageBig(`${count} links unwrapped`);
	}
}

export function cloneBody()
{
	const newBody = document.createElement("section");
	while(document.body.firstChild)
		newBody.appendChild(document.body.firstChild);

	document.body.textContent = "";
	document.body.appendChild(newBody);
}

export function replaceSmallCapsWithLowercase()
{
	const smalls = get("small");
	for(let i = 0, ii = smalls.length; i < ii; i++)
	{
		const prev = smalls[i].previousSibling;
		if(prev && prev.nodeType === Node.TEXT_NODE && /[A-Z]$/.test(prev.data))
		{
			smalls[i].textContent = smalls[i].textContent.toLowerCase();
			unwrapElement(smalls[i]);
		}
	}
}

export function removeUnnecessarySpans()
{
	let numSpansThatHaveNoTextOrAreRedundantWrappers = 0;
	let numSpansWithNoClass = 0;
	let numOrnamentalSpans = 0;

	const spans = get("span");
	if(spans)
	{
		for(let i = 0, ii = spans.length; i < ii; i++)
		{
			const span = spans[i];

			del(getEmptyTextNodesUnderElement(span));

			if(span.id && span.id.length)
			{
			}
			else
			{
				if(getTextLength(span) === 0 || span.children.length === span.childNodes.length)
				{
					unwrapElement(span);
					numSpansThatHaveNoTextOrAreRedundantWrappers++;
				}
				else if(span.className.length === 0)
				{
					unwrapElement(span);
					numSpansWithNoClass++;
				}
				else if(span.className.includes("dropcap") || span.className.includes("stickup"))
				{
					unwrapElement(span);
					numOrnamentalSpans++;
				}
			}
		}

		const totalSpansRemoved = numSpansThatHaveNoTextOrAreRedundantWrappers + numSpansWithNoClass + numOrnamentalSpans;
		if(totalSpansRemoved === spans.length)
			showMessageBig("All spans removed");
		else
			showMessageBig(`Removed ${totalSpansRemoved} out of ${spans.length} spans`);
	}
	else
	{
		showMessageBig("No spans in document");
	}
}

export function normalizeClassnames()
{
	const elems = get("body *");
	for(const elem of elems)
	{
		if(elem.className.length)
			elem.className = elem.tagName.toLowerCase() + elem.className.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
	}
}

export function deleteIndexSection()
{
	function getClass()
	{
		let elem = getOne('p[class^="index"]');
		if(elem)
			return "." + elem.className;

		elem = getOne('p[class^="ind-tx"]');
		if(elem)
			return "." + elem.className;

		return false;
	}

	const classToSeek = getClass();
	if(classToSeek)
	{
		const sections = select("section", "hasChildrenOfType", classToSeek);
		if(sections)
		{
			if(sections.length === 1)
			{
				sections[0].remove();
				showMessageBig("Deleted index section");
			}
			else
			{
				markElements(sections);
				showMessageBig("More than one index section");
			}
		}
		else
		{
			showMessageBig("Did not find any matching sections");
		}
	}
	else
	{
		showMessageBig("Did not find classname for index entries");
	}
}
