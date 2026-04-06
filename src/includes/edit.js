import { showMessageBig, customPrompt } from "./ui";

function editTextNodeOnClick(evt)
{
	evt.preventDefault();

	let node;
	function setText(text)
	{
		if(node && node.nodeType === Node.TEXT_NODE)
			node.data = text;
	}

	if(evt.target.childNodes.length === 1)
	{
		node = evt.target.firstChild;
	}
	else
	{
		const selection = window.getSelection();
		if(selection)
			node = selection.anchorNode;
	}

	if(node && node.nodeType === Node.TEXT_NODE)
		customPrompt("Edit text", node.data.replace(/\s+/g, " ").trim()).then(setText);
}

export function enableEditTextOnClick()
{
	document.addEventListener("click", editTextNodeOnClick, { capture: true, once: true });
	showMessageBig("Click on a text node to edit it");
}
