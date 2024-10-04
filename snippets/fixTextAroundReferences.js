function fixTextAroundReferences(selector)
{
	const regexPeriodOrClosingBracket = /^[\]\.]/;
	const regexOpeningBracket = /\[$/;
	const elems = get(selector);
	for(const elem of elems)
	{
		const next = elem.nextSibling;
		if(next && next.nodeType === 3)
		{
			if(regexPeriodOrClosingBracket.test(next.data))
				next.data = next.data.replace(regexPeriodOrClosingBracket, "");
		}
		const prev = elem.previousSibling;
		if(prev && prev.nodeType === 3)
		{
			if(regexOpeningBracket.test(prev.data))
				prev.data = prev.data.replace(regexOpeningBracket, "");
		}
	}
}

fixTextAroundReferences(".markd");
