export function XpathNodesToArray(nodes)
{
	let selected = Array.from({ length: nodes.snapshotLength });
	for(let i = 0, ii = selected.length; i < ii; i++)
		selected[i] = nodes.snapshotItem(i);
	return selected;
}

export function getTextNodesUnderElement(elem)
{
	return XpathNodesToArray(document.evaluate(".//text()", elem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}

export function getTextNodesUnderElementMatching(elem, text)
{
	return XpathNodesToArray(document.evaluate(`.//text()[contains(., "${text}")]`, elem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}

export function getTextNodesUnderSelector(tagName, strClass)
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

export function getXpathResultAsArray(xpath)
{
	return XpathNodesToArray(document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null));
}

export function xPathSelect(xpath, context)
{
	const xPathContext = context || document;
	return XpathNodesToArray(document.evaluate(xpath, xPathContext, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}
