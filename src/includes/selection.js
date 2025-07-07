import { Nimbus } from "./Nimbus";
import { createElement, wrapElement, makeElementPlainText } from "./element";
import { getNodeContainingSelection } from "./selectors";
import { insertBefore, insertAfter } from "./dom";
import { customPrompt } from "./ui";

export function insertElementNextToAnchorNode(tagName, position)
{
	const tag = tagName || "hr";
	const node = getNodeContainingSelection();
	if(node)
	{
		switch(position)
		{
			case "before": insertBefore(node, createElement(tag)); break;
			case "after": insertAfter(node, createElement(tag)); break;
		}
	}
}

export function insertElementBeforeSelectionAnchor(tagName)
{
	const tag = tagName || "hr";
	const node = getNodeContainingSelection();
	if(node)
		insertBefore(node, createElement(tag));
}

export function insertElementAfterSelectionAnchor(tagName)
{
	const tag = tagName || "hr";
	const node = getNodeContainingSelection();
	if(node)
		insertAfter(node, createElement(tag));
}

export function annotate(position = "before")
{
	let node = getNodeContainingSelection();
	function annotateFunc(userInput)
	{
		const annotationText = userInput.indexOf(" ") !== -1 ? userInput : undefined;
		const annotation = userInput.length && !annotationText ?
			document.createElement(userInput) :
			document.createElement("annotation");
		if(position === "after")
			insertAfter(node, annotation);
		else
			insertBefore(node, annotation);
		if(annotationText)
		{
			annotation.textContent = annotationText;
		}
		else
		{
			annotation.setAttribute("contenteditable", "true");
			Nimbus.isEditing = true;
			annotation.focus();
		}
	}
	if(node && node.parentNode)
		customPrompt("Enter annotation tag").then(annotateFunc);
}

export function wrapAnchorNodeInTag()
{
	const node = getNodeContainingSelection();
	if(!node) return;
	function wrapFunc(tagName)
	{
		wrapElement(node, tagName);
	}
	customPrompt("Enter tagName to wrap this node in").then(wrapFunc);
}

export function deselect()
{
	window.getSelection().removeAllRanges();
}

export function makeAnchorNodePlainText()
{
	const anchorNode = getNodeContainingSelection();
	if(anchorNode)
		makeElementPlainText(anchorNode);
}
