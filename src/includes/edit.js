import { showMessageBig, customPrompt } from "./ui";

const EDIT_WHAT = {
	WORD: 0,
	WORD_INCLUDING_PUNCTUATION: 1
}

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

function splitTextByOffsetAndRegex(text, offset, regex)
{
	let index1 = offset;

	while(text[index1] && regex.test(text[index1]))
		index1--;
	index1++;

	let index2 = offset;
	while(text[index2] && regex.test(text[index2]))
		index2++;

	if(index1 >= 0 && index2 > index1)
	{
		return [
			text.substring(0, index1),
			text.substring(index1, index2),
			text.substring(index2),
			false
		];
	}

	return [null, null, null, true];
}

function handleEditOnClick(regex)
{
	return function()
	{
		const selection = window.getSelection();
		const node = selection.anchorNode;
		if(node)
		{
			const [preceding, textToEdit, following, error] = splitTextByOffsetAndRegex(node.data, selection.focusOffset, regex);

			function replaceWord(str)
			{
				node.data = `${preceding}${str}${following}`;
			}

			if(!error)
				customPrompt("Edit text", textToEdit).then(replaceWord);
		}
	}
}

function createEditHandler(whatToEdit)
{
	if(whatToEdit === EDIT_WHAT.WORD)
		return handleEditOnClick(/\w/);
	else if(whatToEdit === EDIT_WHAT.WORD_INCLUDING_PUNCTUATION)
		return handleEditOnClick(/[\w\x21-\x2F\u2013\u2014]/);
	else
		return handleEditOnClick(/\w/);
}

export function editWordOnClick()
{
	document.addEventListener('click', createEditHandler(EDIT_WHAT.WORD), { capture: true, once: true });
	showMessageBig("Click on a word to edit it");
}

export function editWordAndPunctuationOnClick()
{
	document.addEventListener('click', createEditHandler(EDIT_WHAT.WORD_INCLUDING_PUNCTUATION), { capture: true, once: true });
	showMessageBig("Click on some text to edit it");
}
