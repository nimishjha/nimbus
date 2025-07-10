import { Nimbus } from "./Nimbus";
import { makePlainText, removeAllAttributesOf, emptyElement, createElement, unwrapElement } from "./element";
import { get, getOne, del, select } from "./selectors";
import { markElement, getMarkedElements, markNavigationalLists, unmarkAll } from "./mark";
import { fixInternalReferences } from "./link";
import { createElementWithChildren, removeAttributeOf, unwrapAll, removeAllAttributesOfTypes, deleteClass } from "./element";
import { replaceDiacritics, replaceSpecialCharacters } from "./text";
import { containsAnyOfTheStrings, containsAllOfTheStrings, removeWhitespace, trimSpecialChars, normalizeString, capitalize } from "./string";
import { getXpathResultAsArray } from "./xpath";
import { addLinksToLargerImages } from "./image";
import { replaceElementsBySelector } from "./replaceElements";
import { deleteEmptyElements, deleteEmptyBlockElements, deleteBySelectorAndRegex } from "./delete";
import { getTextLength } from "./node";
import { deleteIframes, deleteByClassOrIdContaining, deleteBySelectorAndTextMatching } from "./delete";
import { makeClassSelector, getTimestamp } from "./misc";
import { highlightUserLinks } from "./browse";
import { getBestImageSrc } from "./image";
import { appendMetadata } from "./metadata";
import { toggleStyleNegative, insertStyleHighlight } from "./style";
import { showMessageBig, showMessageError } from "./ui";
import { retrieve } from "./retrieve";
import { replaceEmptyAnchors } from "./link";
import { isCurrentDomainLink } from "./url";
import { getAllClassesFor } from "./inspect";
import { replaceClass } from "./dom";
import { callFunctionWithArgs } from "./command";

export function replaceIframes()
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
		elem.parentNode.replaceChild(iframereplacement, elem);
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
	highlightUserLinks();
	appendMetadata();
	getBestImageSrc();
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
	const elems = document.getElementsByTagName('*');
	document.body.removeAttribute("background");
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(elem.attributes)
		{
			const attrs = elem.attributes;
			for(let j = attrs.length - 1; j >= 0; j--)
			{
				const attr = attrs[j];
				if(!attr) continue;
				switch(attr.name)
				{
					case "href":
					case "src":
					case "srcset":
					case "name":
					case "colspan":
					case "rowspan":
					case "id":
					case "class":
						break;
					default:
						elem.removeAttribute(attr.name);
						break;
				}
			}
		}
	}
}

export function cleanupHeadings()
{
	const headings = get("h1, h2, h3, h4, h5, h6");
	let i = headings.length;
	const toUnwrap = [];
	while(i--)
	{
		const heading = headings[i];
		if(!getTextLength(heading))
		{
			heading.remove();
			continue;
		}
		const children = heading.getElementsByTagName("*");
		if(!children) continue;
		for(let i = 0, ii = children.length; i < ii; i++)
		{
			const child = children[i];
			if(child.tagName === "SPAN")
			{
				if(child.id)
					heading.id = child.id;
				toUnwrap.push(child);
			}
			else if(child.tagName === "A")
			{
				if(!getTextLength(child))
				{
					if(child.id)
						heading.id = child.id;
					else if(child.name)
						heading.id = child.name;
					toUnwrap.push(child);
				}
			}
			else
			{
				toUnwrap.push(child);
			}
		}
	}
	for(let i = 0, ii = toUnwrap.length; i < ii; i++)
	{
		if(toUnwrap[i])
			unwrapElement(toUnwrap[i]);
	}
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
	shortenIds();
}

export function removeRedundantHrs()
{
	const makesHrRedundant = {
		H1: true,
		H2: true,
		H3: true,
		H4: true,
		H5: true,
		H6: true,
		HR: true,
		FIGURE: true,
		FIGCAPTION: true,
		FOOTNOTE: true,
		RT: true,
		BLOCKQUOTE: true,
		HEADER: true,
		UL: true,
		OL: true,
		PRE: true,
	};
	const elems = get("hr");
	let count = 0;
	for(const elem of elems)
	{
		const prev = elem.previousElementSibling;
		const next = elem.nextElementSibling;
		if( (prev && makesHrRedundant[prev.tagName]) || (next && makesHrRedundant[next.tagName]) )
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
	const markedElements = getMarkedElements();
	if(markedElements)
	{
		del(markedElements);
		cleanupDocument();
		return;
	}
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

	del(["#sidebar", ".signup-prompt", ".post-menu", ".user-gravatar32", "form", ".d-none", ".-flair", "#launch-popover", ".comments-link", ".aside-cta", ".js-post-menu", "iframe", ".js-bottom-notice", ".votecell"]);
	deleteByClassOrIdContaining("comments-link");
	replaceElementsBySelector(".post-tag", "tag");
	unwrapAll(".js-post-tag-list-item");
	replaceElementsBySelector(".js-post-tag-list-wrapper", "footer");
	replaceElementsBySelector(".user-action-time", "h5");
	replaceElementsBySelector(".user-details", "h2");
	replaceElementsBySelector(".answercell", "dt");
	deleteBySelectorAndTextMatching("h2", "Not the answer");
	retrieve("#content");
	cleanupDocument();
	removeAllAttributesOfTypes(["class", "style", "align", "id"]);
	unwrapAll("span");
	makePlainText("user");
	unwrapAll("user");
	makePlainText("pre");
	const observer = new MutationObserver(handleMutations);
	observer.observe(getOne("head"), { childList: true });
}

export function replaceCommonClasses()
{
	replaceElementsBySelector("strong", "b");
	replaceElementsBySelector("em", "i");

	replaceElementsBySelector(".pn, .pt, .partnum, .parttitle, .pt-num, .pt-title, .partno", "h1");
	replaceElementsBySelector(".cn, .ct, .chapnum, .chapter, .chapternumber, .tochead, .chaptitle, .chaptertitle, .chap-num, .chap-title, .fmh, .fmht, .fmtitle, .fm-title, .chapno, .chno, .chnum, .chtitle, .ch-num, .ch-title, .chap-tit, .title-num", "h2");
	replaceElementsBySelector(".cst, .h", "h3");
	replaceElementsBySelector(".figcap", "figcaption");
	replaceElementsBySelector(".fig-cap", "figcaption");
	replaceElementsBySelector(".figure", "figure");
	replaceElementsBySelector(".comment", "comment");
	replaceElementsBySelector(".fn, .fn1, p[class*=footnote]", "footnote");

	replaceElementsBySelector(".epub-i, .i", "i");
	replaceElementsBySelector(".epub-b, .b", "b");
	replaceElementsBySelector(".epub-sc, .small", "small");
	replaceElementsBySelector("div.block, .afmtx, .afmtx1", "blockquote");

	replaceElementsBySelector("div[class*=comment-author]", "h5");
	replaceElementsBySelector("div[class*=comment-meta]", "h6");
	replaceElementsBySelector("div[class*=comment-footer]", "h6");
	replaceElementsBySelector("div[class*=sidebar]", "aside");
	replaceElementsBySelector("div[class*=social]", "aside");
	replaceElementsBySelector("p[class*=toc-head]", "h2");
	replaceElementsBySelector("p[class*=subtitle], div[class*=subtitle], p[class*=subhead], div[class*=subhead]", "h3");
	replaceElementsBySelector("p[class*=image], div[class*=image]", "figure");
	replaceElementsBySelector("p[class*=caption], div[class*=caption]", "figcaption");
	replaceElementsBySelector("p[class*=quote], div[class*=quote]", "blockquote");
	replaceElementsBySelector("p[class*=author], div[class*=author]", "h4");
	replaceElementsBySelector("p[class*=date], div[class*=date]", "h5");
	replaceElementsBySelector("p[class*=quote], div[class*=quote]", "blockquote");

	replaceElementsBySelector("span[class*=ital], span[class*=txit], span[class*=epub-i]", "i");
	replaceElementsBySelector("span[class*=bold], span[class*=txbd], span[class*=epub-b]", "b");
	replaceElementsBySelector("span[class*=small]", "small");

	replaceElementsBySelector("body > div", "section");
	deleteEmptyElements("section");

	removeAttributeOf("a, i, b, sup, small", "class");

	replaceElementsBySelector(".indexmain", "dt");
	replaceElementsBySelector(".indexsub", "dd");

	document.body.innerHTML = document.body.innerHTML.replaceAll("calibre_link-", "l");
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
			source.parentNode.replaceChild(audioLinkWrapper, source);
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
	newBody.parentNode.replaceChild(replacement, newBody);
}

export function removeSpanTags(isOkToLoseIds)
{
	if(!isOkToLoseIds)
		replaceEmptyAnchors();
	unwrapAll("span");
}

export function removeUnnecessaryClasses()
{
	removeAttributeOf("table, tbody, thead, th, tr, td, i, em, b, strong, a, ul, ol, li, sup, sub, small, pre, code, h1, h2, h3, h4, h5, h6, dt, dd, dl", "class");
}

export function simplifyClassNames(selector)
{
	const sel = selector ||  "section, div, header, p, ul, ol, li, span, table, tbody, thead, tr, td, th, blockquote";
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
	const links = get('a[href^="#"]');
	const linksByHref = {};
	if(links)
	{
		for(const link of links)
		{
			const href = link.getAttribute("href").substring(1);
			if(linksByHref[href])
				linksByHref[href].push(link);
			else
				linksByHref[href] = [link];
		}
	}

	const elems = get("*[id]");
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(elem.tagName === "STYLE" || elem.tagName === "BODY") continue;
		const links = linksByHref[elem.id];
		if(links && links.length)
		{
			elem.id = "i" + i;
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

export function replaceClassesWithCustomElements(selector, baseTagName)
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
		link.parentNode.replaceChild(newLink, link);
	}
}

export function removeRedundantDivs()
{
	const elems = get("div");
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		let isRedundant = true;
		for(const child of elem.childNodes)
		{
			if((child.nodeType === 3 && child.data.replace(/\s+/g, "").length > 0) || (child.nodeType === 1 && child.tagName !== "DIV"))
			{
				isRedundant = false;
				break;
			}
		}
		if(isRedundant)
			unwrapElement(elem);
	}
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
				heading1.parentNode.replaceChild(temp, heading1);
			}
		}
	}
}
