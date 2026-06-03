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

export function splitTextByWords(text, offset)
{
	const NUM_WORDS = 0;

	let index1 = offset;
	let countSpacesLeft = 0;
	let countSpacesRight = 0;

	while(text[index1] && countSpacesLeft < NUM_WORDS + 1)
	{
		if(text[index1] === " ")
			countSpacesLeft++;
		index1--;
	}
	index1++;
	if(text[index1] === " ")
		index1++;

	let index2 = offset;
	while(text[index2] && countSpacesRight < NUM_WORDS + 1)
	{
		if(text[index2] === " ")
			countSpacesRight++;
		index2++;
	}
	if(countSpacesRight)
		index2--;

	if(index2 > index1)
	{
		return [
			text.substring(0, index1),
			text.substring(index1, index2).replace(/\s+/g, " "),
			text.substring(index2),
			false
		];
	}

	return [null, null, null, true];
}

function editWordsAroundSelection()
{
	const selection = window.getSelection();
	if(selection)
	{
		const node = selection.anchorNode;
		if(node)
		{
			const [preceding, textToEdit, following, error] = splitTextByWords(node.data, selection.anchorOffset);

			function replaceWord(str)
			{
				node.data = `${preceding}${str}${following}`;
			}

			if(!error)
				customPrompt("Edit text", textToEdit).then(replaceWord);
		}
	}
}

export function editWordsOnClick()
{
	document.addEventListener('click', editWordsAroundSelection, { capture: true, once: true });
	showMessageBig("Click on some text to edit it");
}

export function editTextOfSelectionAnchorNode()
{
	const selection = window.getSelection();
	if(selection)
	{
		const node = selection.anchorNode;
		if(node)
		{
			const [preceding, textToEdit, following, error] = splitTextByWords(node.data, selection.anchorOffset);

			function replaceWord(str)
			{
				node.data = `${preceding}${str}${following}`;
			}

			if(!error)
				customPrompt("Edit text", textToEdit).then(replaceWord);
		}
	}
}
