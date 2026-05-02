export function xPathNodesToArray(nodes)
{
	let selected = Array.from({ length: nodes.snapshotLength });
	for(let i = 0, ii = selected.length; i < ii; i++)
		selected[i] = nodes.snapshotItem(i);
	return selected;
}

export function getTextNodesUnderElement(elem)
{
	return xPathNodesToArray(document.evaluate(`.//text()`, elem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}

export function getEmptyTextNodesUnderElement(elem)
{
	return xPathNodesToArray(document.evaluate(`.//text()[normalize-space() = '']`, elem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}

export function getEmptyTextNodesUnderTagName(tagName)
{
	return getXpathResultAsArray(`.//${tagName}//text()[normalize-space() = '']`);
}

export function getEmptyElementsOfType(tagName)
{
	return xPathNodesToArray(document.evaluate(`.//${tagName}[normalize-space() = '']`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}

export function getTextNodesUnderElementMatching(elem, text)
{
	return xPathNodesToArray(document.evaluate(`.//text()[contains(., "${text}")]`, elem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}

export function getTextNodesUnderPre(directDescendantsOnly, markedOnly)
{
	const selectorPre = markedOnly ? "pre[contains(@class, 'markd')]" : "pre";
	if(directDescendantsOnly) return getXpathResultAsArray(`//${selectorPre}/text()`);
	return getXpathResultAsArray(`//${selectorPre}//text()`);
}

export function getTextNodesNotUnderPre()
{
	return getXpathResultAsArray(`//text()[not(ancestor::pre)]`);
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
	return xPathNodesToArray(document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}

export function xPathSelect(xpath, context)
{
	const xPathContext = context || document;
	return xPathNodesToArray(document.evaluate(xpath, xPathContext, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}

