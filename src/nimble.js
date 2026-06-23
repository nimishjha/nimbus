import { del, get, getOne } from "./includes/selectors";
import { forAll } from "./includes/misc";
import { cleanupAttributes, deleteHtmlComments, cleanupHead } from "./includes/cleanup";
import { removeAllAttributesOf, createElement } from "./includes/element";
import { getTimestamp } from "./includes/misc";

function appendMetadata()
{
	const { protocol, hostname, pathname, search } = window.location;

	const urlWithoutHash = protocol + "//" + hostname + pathname + search;

	const domainLinkWrapper = createElement("h4", { textContent: "Domain: " });
	const domainLink = createElement("a", { textContent: hostname, href: protocol + "//" + hostname });
	domainLinkWrapper.appendChild(domainLink);
	document.body.appendChild(domainLinkWrapper);

	const documentLinkWrapper = createElement("h4", { textContent: "URL: " });
	const documentLink = createElement("a", { textContent: urlWithoutHash, href: urlWithoutHash });
	documentLinkWrapper.appendChild(documentLink);
	document.body.appendChild(documentLinkWrapper);

	const saveTime = createElement("h4", { textContent: "Saved at " + getTimestamp() });
	document.body.appendChild(saveTime);
}

function cleanupDocument()
{
	cleanupHead();
	del(["iframe", "link", "style", "script", "input", "select", "form", "textarea", "label", "button", "canvas", "svg", "video", "audio", "applet", "message"]);
	deleteHtmlComments();
	removeAllAttributesOf(document.documentElement);
	removeAllAttributesOf(document.body);
	cleanupAttributes();
	appendMetadata();
	document.body.className = "pad100 xwrap";
	document.documentElement.id = "nimbus";
}

function getXpathResultAsArray(xpath)
{
	const nodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	let selected = Array.from({ length: nodes.snapshotLength });
	for(let i = 0, ii = selected.length; i < ii; i++)
		selected[i] = nodes.snapshotItem(i);
	return selected;
}

function getTextNodesUnderSelector(tagName, strClass)
{
	let xpathString;
	if(tagName && strClass)
		xpathString = `//${tagName}[contains(@class, '${strClass}')]//text()`;
	else if(tagName)
		xpathString = `//${tagName}//text()`;
	else if(strClass)
		xpathString = `//*[contains(@class, '${strClass}')]//text()`;
	return getXpathResultAsArray(xpathString);
}

function replaceInTextNodesUnder(selector, searchString, replacementString)
{
	const textNodes = selector.startsWith(".") ? getTextNodesUnderSelector(null, selector.slice(1)) : getTextNodesUnderSelector(selector);
	let replCount = 0;
	for(const textNode of textNodes)
	{
		if(textNode.data.includes(searchString))
		{
			replCount++;
			textNode.data = textNode.data.replaceAll(searchString, replacementString);
		}
	}
	if(replCount)
		console.log(`${replCount} text nodes affected`);
}

function main()
{
	window.get = get;
	window.del = del;
	window.getOne = getOne;
	window.forAll = forAll;
	window.cleanupDocument = cleanupDocument;
	window.cleanupAttributes = cleanupAttributes;
	window.appendMetadata = appendMetadata;
	window.getXpathResultAsArray = getXpathResultAsArray;
	window.getTextNodesUnderSelector = getTextNodesUnderSelector;
	window.replaceInTextNodesUnder = replaceInTextNodesUnder;
}

main();
