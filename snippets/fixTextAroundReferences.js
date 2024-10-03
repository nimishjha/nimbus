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
			if(next.data.match(regexPeriodOrClosingBracket))
				next.data = next.data.replace(regexPeriodOrClosingBracket, "");
		}
		const prev = elem.previousSibling;
		if(prev && prev.nodeType === 3)
		{
			if(prev.data.match(regexOpeningBracket))
				prev.data = prev.data.replace(regexOpeningBracket, "");
		}
	}
}

fixTextAroundReferences(".markd");
