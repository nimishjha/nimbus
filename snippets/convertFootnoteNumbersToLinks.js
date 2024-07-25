// for documents where reference numbers are plain text instead of links
function convertFootnoteNumbersToLinks()
{
	const footnotes = get("footnote");
	for(const footnote of footnotes)
	{
		const footnoteHTML = trim(footnote.innerHTML);
		const matches = footnoteHTML.match(/^[0-9]+\./);
		if(matches && matches.length)
		{
			footnote.innerHTML = footnoteHTML.replace(/^[0-9]+\./, "");
			const footnoteNumber = parseInt(matches[0], 10);
			if(isNaN(footnoteNumber))
				continue;
			const link = createElement("a", { textContent: footnoteNumber });
			const ref = document.createElement("reference");
			ref.appendChild(link);
			footnote.insertBefore(ref, footnote.firstChild);
		}
	}
}

convertFootnoteNumbersToLinks();
