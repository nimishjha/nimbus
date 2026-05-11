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
		customPrompt("Edit text", node.data.replace(/\s+/g, " ")).then(setText);
}

export function enableEditTextOnClick()
{
	document.addEventListener("click", editTextNodeOnClick, { capture: true, once: true });
	showMessageBig("Click on a text node to edit it");
}

function findIndicesOfAdjacentSpaces(text, offset)
{
	const regex = /[\w\d]/;
	let index1 = offset;

	while(text[index1] && regex.test(text[index1]))
		index1--;
	index1++;

	let index2 = offset;
	while(text[index2] && regex.test(text[index2]))
		index2++;

	return ([index1, index2]);
}

function handleEditWordOnClick()
{
	const selection = window.getSelection();
	const node = selection.anchorNode;
	const [index1, index2] = findIndicesOfAdjacentSpaces(node.data, selection.focusOffset);
	if(index1 >= 0 && index2 > index1)
	{
		const textBeforeWord = node.data.substring(0, index1);
		const textAfterWord = node.data.substring(index2);
		const textToEdit = node.data.substring(index1, index2);

		function replaceWord(str)
		{
			node.data = `${textBeforeWord}${str}${textAfterWord}`;
		}

		customPrompt("Edit word", textToEdit).then(replaceWord);
	}
}

export function editWordOnClick()
{
	document.addEventListener('click', handleEditWordOnClick, { capture: true, once: true });
	showMessageBig("Click on a word to edit it");
}
