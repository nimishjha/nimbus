function fixTextAroundReferences(selector)
{
	const regexPeriodOrClosingBracket = /^[\]\.]/;
	const regexOpeningBracket = /\[$/;
	const elems = get(selector);
	let count = 0;
	for(const elem of elems)
	{
		const next = elem.nextSibling;
		if(next && next.nodeType === 3)
		{
			if(regexPeriodOrClosingBracket.test(next.data))
			{
				next.data = next.data.replace(regexPeriodOrClosingBracket, "");
				count++;
			}
		}
		const prev = elem.previousSibling;
		if(prev && prev.nodeType === 3)
		{
			if(regexOpeningBracket.test(prev.data))
			{
				prev.data = prev.data.replace(regexOpeningBracket, "");
				count++;
			}
		}
	}
	showMessageBig(`${count} text nodes fixed`);
}

fixTextAroundReferences("footnote reference");
