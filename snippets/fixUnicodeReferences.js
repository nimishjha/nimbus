function replaceUnicodeSuperscriptDigitsInReferences()
{
	const replacements = {
		"⁰": "0",
		"¹": "1",
		"²": "2",
		"³": "3",
		"⁴": "4",
		"⁵": "5",
		"⁶": "6",
		"⁷": "7",
		"⁸": "8",
		"⁹": "9",
		// "₀": "0",
		// "₁": "1",
		// "₂": "2",
		// "₃": "3",
		// "₄": "4",
		// "₅": "5",
		// "₆": "6",
		// "₇": "7",
		// "₈": "8",
		// "₉": "9",
	};

	const regularExpressions = {};
	const keys = Object.keys(replacements);
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		regularExpressions[key] = new RegExp(key, 'g');
	}

	const textNodes = getTextNodesUnderSelector("reference");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		let nodeText = textNode.data;
		for(let j = 0, jj = keys.length; j < jj; j++)
		{
			const key = keys[j];
			nodeText = nodeText.replace(regularExpressions[key], replacements[key]);
		}
		textNode.data = nodeText;
	}
}

function fixUnicodeReferences()
{
	highlightInTextNodes(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, "reference");
	replaceUnicodeSuperscriptDigitsInReferences();
}

fixUnicodeReferences();
