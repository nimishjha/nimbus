import { Nimbus } from "./Nimbus";
import { emptyElement, createElement, createElementWithChildren } from "./element";
import { replaceElement } from "./replaceElements";
import { get, getOne, del } from "./selectors";
import { getXpathResultAsArray } from "./xpath";
import { removeAttributeOf, createSelector } from "./element";
import { createUUID } from "./misc";
import { trimAt } from "./string";
import { xlog, ylog } from "./log";
import { toggleStyle, insertStyle } from "./style";
import { STYLES } from "./stylesheets";
import { BLOCK_ELEMENTS, INLINE_ELEMENTS } from "./constants";
import { identifyClassSetup } from "./identifyClass";

export function traceLineage(element)
{
	let current = element;
	while (current)
	{
		const id = current.id || "";
		const classes = current.className || "";
		console.log(`#${id} .${classes}`);
		current = current.parentNode;
	}
}

export function showHtmlComments()
{
	const comments = getXpathResultAsArray("//body//comment()");
	for(let i = 0, ii = comments.length; i < ii; i++)
	{
		const comment = comments[i];
		const replacement = document.createElement("aside");
		replacement.innerHTML = comment.data;
		comment.parentNode.replaceChild(replacement, comment);
	}
}

export function numberTableRowsAndColumns(tableElement)
{
	const tableRows = tableElement ? tableElement.querySelectorAll("tr") : get("tr");
	for(let i = 0, ii = tableRows.length; i < ii; i++)
	{
		const tableRow = tableRows[i];
		tableRow.className = "row" + i;
		const tableCells = tableRow.querySelectorAll("td, th");
		let count = 0;
		for(let j = 0, jj = tableCells.length; j < jj; j++)
		{
			const tableCell = tableCells[j];
			tableCell.className = "col" + count++;
			if(tableCell.hasAttribute("colspan"))
				count += parseInt(tableCell.getAttribute("colspan"), 10) - 1;
		}
	}
	const tables = tableElement ? [tableElement] : get("table");
	for(let i = 0, ii = tables.length; i < ii; i++)
		tables[i].classList.add("numbered");
}

export function renderResourceInfo(str, uuid)
{
	let strSanitized = trimAt(str, "?");
	const resourceLink = createElement("a", { textContent: strSanitized, href: str });
	const resourceLinkWrapper = createElement("h3", { id: "link" + uuid, className: "xlog" });
	const resourceDelete = createElement("span", { textContent: "[Delete]" });
	resourceDelete.setAttribute("data-delete", uuid);
	document.body.addEventListener('mouseup', deleteResource, false);
	resourceLinkWrapper.appendChild(resourceDelete);
	resourceLinkWrapper.appendChild(resourceLink);
	document.body.insertBefore(resourceLinkWrapper, document.body.firstChild);
}

export function deleteResource(evt)
{
	if(!["h3", "span"].includes(evt.target.parentNode.tagName.toLowerCase()))
		return;
	evt.stopPropagation();
	evt.preventDefault();
	const idToDelete = evt.target.getAttribute("data-delete");
	del("#" + idToDelete);
	del("#link" + idToDelete);
}

export function showImageCount()
{
	const images = get("img");
	const numImages = images ? images.length : 0;
	if(numImages)
		ylog(numImages + " images", "h2", true);
}

export function showIframeCount()
{
	const iframes = get("iframe");
	const numIframes = iframes ? iframes.length : 0;
	if(numIframes)
		ylog(numIframes + " iframes", "h2", true);
}

export function showScripts()
{
	let numScripts = 0;
	const scripts = get("script");
	if(!scripts) return;
	for(let i = 0, ii = scripts.length; i < ii; i++)
	{
		const script = scripts[i];
		if(script.src)
		{
			numScripts++;
			const uuid = createUUID();
			script.id = uuid;
			renderResourceInfo(script.src, uuid);
		}
	}
	const scriptlinks = get("link[href*=\\.js]");
	if(scriptlinks)
	{
		for(let i = 0, ii = scriptlinks.length; i < ii; i++)
		{
			const scriptlink = scriptlinks[i];
			numScripts++;
			const uuid = createUUID();
			scriptlink.id = uuid;
			renderResourceInfo(scriptlink.href, uuid);
		}
	}
	if(numScripts)
		ylog(numScripts + " scripts", "h2", true);
}

export function showExternalStyles()
{
	let numLinks = 0;
	const links = get("link");
	if(!links) return;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		if(link.href && ~link.href.indexOf("css"))
		{
			numLinks++;
			const uuid = createUUID();
			link.id = uuid;
			renderResourceInfo(link.href, uuid);
		}
	}
	if(numLinks)
		ylog(numLinks + " external styles", "h2", true);
}

export function showInlineStyles()
{
	const styles = get("style");
	if(styles && styles.length)
	{
		for(const style of styles)
		{
			const styleId = style.id;
			if(styleId)
				ylog(styleId, "dd", true);
		}
		ylog(styles.length + " inline styles", "h2", true);
	}
}

export function showHtmlTextRatio()
{
	const bytesHtml = document.documentElement.innerHTML.length;
	const bytesText = document.body.textContent.length;
	const kilobytesHtml = Math.round(bytesHtml / 100) / 10;
	const kilobytesText = Math.round(bytesText / 100) / 10;
	const textToHtmlRatio = (Math.round((bytesText / bytesHtml) * 100)) / 100;
	const str = `${kilobytesHtml} KB : ${kilobytesText} KB (${textToHtmlRatio})`;
	ylog(str, "h2", true);
	xlog(str);
}

export function showResources()
{
	if(get(".xlog"))
	{
		del(".xlog");
		return;
	}

	showImageCount();
	showIframeCount();
	showScripts();
	showExternalStyles();
	showInlineStyles();
	showHtmlTextRatio();

	window.scrollTo(0, 0);
}

function handleClick(evt)
{
	evt.stopPropagation();
	if(evt.ctrlKey)
		identifyClassSetup("." + Array.from(evt.target.classList).join("."));
	else
		evt.target.classList.add(Nimbus.markerClass);
}

function handleMouseOver(evt)
{
	function showAttributes(elem)
	{
		const inspectorPanel = document.createElement('div');
		if(elem.tagName)
			inspectorPanel.appendChild(createElement("b", { textContent: elem.tagName.toLowerCase() }) );
		if(elem.attributes)
		{
			const attrs = elem.attributes;
			const frag = document.createDocumentFragment();
			for(let i = 0, ii = attrs.length; i < ii; i++)
			{
				const attr = attrs[i];
				if(attr)
				{
					frag.appendChild(createElement("em", { textContent: " " + attr.name + "="}));
					frag.appendChild(document.createTextNode('"' + attr.value + '"'));
				}
			}
			inspectorPanel.appendChild(frag);
			const keys = Object.keys(elem);
			const elemKeys = document.createElement("em");
			for(let i = 0, ii = keys.length; i < ii; i++)
				elemKeys.appendChild(document.createTextNode(keys[i] + " "));
			inspectorPanel.appendChild(elemKeys);
			const inspectorElem = document.getElementById("inspector");
			inspectorElem.appendChild(inspectorPanel);
		}
	}

	const inspectorElem = document.getElementById("inspector");
	emptyElement(inspectorElem);
	inspectorElem.appendChild(document.createTextNode(''));
	evt.stopPropagation();
	let target = evt.target;
	while(target)
	{
		showAttributes(target);
		target = target.parentNode;
	}
}

export function inspect(onTop)
{
	if(!getOne("#inspector"))
	{
		const inspectorElem = document.createElement("div");
		inspectorElem.id = "inspector";
		if(onTop)
			inspectorElem.className = "onTop";
		document.body.insertBefore(inspectorElem, document.body.firstChild);
		document.body.addEventListener('mouseover', handleMouseOver, false);
		document.body.addEventListener('contextmenu', handleClick, false);
		document.body.classList.add("inspector");
		insertStyle(STYLES.INSPECTOR, "styleInspector", true);
	}
	else
	{
		document.body.removeEventListener('mouseover', handleMouseOver, false);
		document.body.removeEventListener('contextmenu', handleClick, false);
		del('#inspector');
		del('#styleInspector');
		document.body.classList.remove("inspector");
	}
}

export function showAttributes(selector = "*")
{
	const elems = Array.from( document.body.querySelectorAll(selector) );
	const SPECIAL_ELEMS = ["A", "INPUT", "TEXTAREA"];
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const attrs = elem.attributes;
		let attributesAndValues = elem.tagName + "\n";
		for(let j = 0, jj = attrs.length; j < jj; j++)
			attributesAndValues += "\t" + attrs[j].name + ": " + attrs[j].value + "\n";
		const tag = createElement("pre", { textContent: attributesAndValues });
		elem.insertAdjacentElement("beforebegin", tag);
		if(SPECIAL_ELEMS.includes(elem.tagName))
			replaceElement(elem, "div");
	}
	const style = "div { padding: 5px 20px; box-shadow: inset 10px 0 #555; }";
	insertStyle(style, "styleShowAttributes", true);
}

export function toggleShowSelectors(tagName)
{
	if(document.body.classList.contains("nimbusShowSelectors"))
	{
		document.body.classList.remove("nimbusShowSelectors");
		del("#styleShowSelectors");
	}
	else
	{
		document.body.classList.add("nimbusShowSelectors");
		showSelectors(tagName);
	}
}

export function showSelectors(tagName)
{
	function generateBlockStyleRule(tag) {
		tag = tag.toLowerCase();
		return `
			${tag}::before { content: "${tag}"; color: #07C; background: #000; padding: 2px 6px; font: bold 22px "swis721 cn bt"; }
			${tag}[id]::before { content: "${tag}#" attr(id); color: #C0C; background: #000; padding: 2px 6px; font: bold 22px "swis721 cn bt"; }
			${tag}[class]::before { content: "${tag}." attr(class); color: #C90; background: #000; padding: 2px 6px; font: bold 22px "swis721 cn bt"; }
			${tag}[id][class]::before { content: "${tag}#" attr(id) "."attr(class); color: #CC0; background: #000; padding: 2px 6px; font: bold 22px "swis721 cn bt"; }
		`;
	}
	function generateInlineStyleRule(tag) {
		tag = tag.toLowerCase();
		return `
			${tag}::before { content: "${tag}"; color: #7C0; background: #000; padding: 2px 6px; font: bold 18px "swis721 cn bt"; }
			${tag}[id]::before { content: "${tag}#" attr(id); color: #C0C; background: #000; padding: 2px 6px; font: bold 18px "swis721 cn bt"; }
			${tag}[class]::before { content: "${tag}." attr(class); color: #C90; background: #000; padding: 2px 6px; font: bold 18px "swis721 cn bt"; }
			${tag}[id][class]::before { content: "${tag}#" attr(id) "."attr(class); color: #CC0; background: #000; padding: 2px 6px; font: bold 18px "swis721 cn bt"; }
		`;
	}

	if(tagName)
	{
		const style = BLOCK_ELEMENTS[tagName.toUpperCase()] ? generateBlockStyleRule(tagName) : generateInlineStyleRule(tagName);
		insertStyle(style, "styleShowSelectors", true);
	}
	else
	{
		const borderStyle = `
			div, p, blockquote, hgroup, h1, h2, h3, h4, h5, h6, ol, ul, li, head, figure, figcaption, pre, dt, dd, message, annotation, td, quote, quoteauthor, aside, section, article, nav, footnote, header, footer, hr, rt, style { box-shadow: inset 2px 2px #444, inset -2px -2px #111; margin: 4px; padding: 4px; }
			small, big, sup, sub, abbr, time, cite { box-shadow: inset 2px 2px #357, inset -2px -2px #357; }
			font { box-shadow: inset 2px 2px #C90, inset -2px -2px #C90; }
			span { box-shadow: inset 0 -100px #040; padding: 4px; border: 2px solid #0A0; }
			span span { padding: 0px; }
		`;

		const blockTags = Object.keys(BLOCK_ELEMENTS);
		const inlineTags = Object.keys(INLINE_ELEMENTS);
		const rulesBlock = blockTags.map(generateBlockStyleRule);
		const rulesInline = inlineTags.map(generateInlineStyleRule);
		const style = rulesBlock.join("\n") + rulesInline.join("\n") + borderStyle;
		insertStyle(style, "styleShowSelectors", true);
	}
}

export function showSelectorsHeavy()
{
	if(getOne("#styleShowSelectorsHeavy"))
	{
		del("#styleShowSelectorsHeavy");
		removeAttributeOf("body *", "data-id");
		removeAttributeOf("body *", "data-idclass");
		removeAttributeOf("body *", "data-class");
		return;
	}
	const elems = get("*");
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(elem.id && !elem.className)
			elem.setAttribute("data-id", elem.tagName.toLowerCase() + "#" + elem.id);
		else if(elem.id && elem.className)
			elem.setAttribute("data-idclass", elem.tagName.toLowerCase() + "#" + elem.id + "." + elem.className);
		else if(elem.className)
			elem.setAttribute("data-class", elem.tagName.toLowerCase() + "." + elem.className);
	}
	const style = `
		*[data-id]::before { content: attr(data-id); color: #F0F; background: #000; padding: 2px 5px; }
		*[data-idclass]::before { content: attr(data-idclass); color: #0FF; background: #000; padding: 2px 5px; }
		*[data-class]::before { content: attr(data-class); color: #F90; background: #000; padding: 2px 5px; }
	`;
	insertStyle(style, "styleShowSelectorsHeavy", true);
}

export function showTags()
{
	const e = Array.from( document.body.getElementsByTagName("*") );
	for(let i = 0, ii = e.length; i < ii; i++)
	{
		const elem = e[i];
		if(!elem || !elem.nodeType)
			continue;
		const elemTagName = elem.tagName;
		if(elemTagName)
		{
			elem.setAttribute("data-tagname", elemTagName.toLowerCase());
			elem.classList.add("nimbusShowTags");
		}
	}
	const style = `
		.nimbusShowTags { padding: 10px; margin: 10px; box-shadow: inset 4px 4px #000, inset -4px -4px #000; }
		.nimbusShowTags::before { content: attr(data-tagname); color: #F90; background: #000; padding: 2px 5px; }
		`;
	insertStyle(style, "styleShowTags", true);
}

export function listSelectorsWithLightBackgrounds()
{
	const THRESHOLD = 200;
	const e = Array.from(document.getElementsByTagName("*"));
	let str = "";
	for(let i = 0, count = 0; i < e.length, count < 4000; i++, count++)
	{
		const elem = e[i];
		if(!elem)
			continue;
		const bgColor = getComputedStyle(elem).getPropertyValue("background-color");
		const rgbValues = bgColor.match(/[0-9]+/g);
		if(rgbValues)
		{
			let average = (Number(rgbValues[0]) + Number(rgbValues[1]) + Number(rgbValues[2])) / 3;
			if(average > THRESHOLD)
			{
				str += createSelector(elem) + "\r\n";
				// str += padRight(createSelector(elem), 100) + bgColor + "\r\n";
			}
		}
	}
	console.log(str);
}

export function setClassByDepth(selector = "div")
{
	const elems = get(selector);
	let i = elems.length;
	let node, level;
	while(i--)
	{
		node = elems[i];
		level = 0;
		while(node.parentNode)
		{
			node = node.parentNode;
			level++;
		}
		elems[i].className = "level" + level;
	}
	toggleStyle(STYLES.SHOW_SELECTORS, "styleShowSelectors", true);
}

export function numberDivs()
{
	const e = get("header, footer, article, aside, section, div");
	let i = e.length;
	while(i--)
		e[i].id = "i" + i;
	for(let i = 0, ii = document.images.length; i < ii; i++)
		document.images[i].id = "img" + i;
	toggleStyle(STYLES.SHOW_SELECTORS, "styleShowSelectors", true);
}

export function getClassCounts(selector) {
	function sortFunc(a, b) { return a.count - b.count; }
	const elements = get(selector);
	const classMap = new Map();
	for (const element of elements)
	{
		for (const className of element.classList)
		{
			classMap.set(className, (classMap.get(className) || 0) + 1);
		}
	}
	return Array.from(classMap, ([className, count]) => ({className, count})).sort(sortFunc);
}

export function getAllClassesFor(selector)
{
	const sel = typeof selector === "string" ? selector : "*";
	const nodes = get(sel);
	const classes = {};
	let i = nodes.length;
	while(i--)
	{
		const classList = Array.from(nodes[i].classList);
		if(!classList.length)
			continue;
		const elementClasses = classList.join('.');
		const elementClassesSanitized = elementClasses.replace(/[^a-zA-Z0-9]+/g, '');
		classes[elementClassesSanitized] = elementClasses;
	}
	const keys = Object.keys(classes);
	const result = [];
	for(let i = 0, ii = keys.length; i < ii; i++)
		result.push(classes[keys[i]]);
	return result;
}

export function getMarkedHTML()
{
	const id = "nimbusMarkedInnerHTML";
	function destroy()
	{
		const elem = getOne(id);
		if(elem) elem.remove();
		del("#" + id);
	}
	const elem = getOne(".markd");
	if(!elem) return;
	const ta = document.createElement("textarea");
	ta.id = id;
	ta.value = elem.innerHTML;
	ta.setAttribute("style", "position: fixed; top: 100px; left: 100px; width: 80vw; height: 80vh;");
	document.body.appendChild(ta);
	ta.focus();
	ta.select();
	setTimeout(destroy, 3000);
}

export function countReferencesToId(idString)
{
	let idSelector = idString;
	if(idSelector.indexOf("#") !== 0)
		idSelector = "#" + idString;
	const links = get('a[href^="#"]');
	let count = 0;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		if(link.hasAttribute("href") && link.getAttribute("href") === idSelector)
			count++;
	}
	return count;
}
