export function getNodeText(node)
{
	if(!node.nodeType)
		throw new Error(node);
	if(node.nodeType === 1) return node.textContent;
	if(node.nodeType === 3) return node.data;
}

export function getTextLength(node)
{
	const text = node.nodeType === 1 ? node.textContent : node.data;
	return text.replace(/[\s\u200B]+/g, "").length;
}
