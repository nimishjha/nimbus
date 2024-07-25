// When headings are numbered, like 1.2.3.4, assign them a matching heading tag
function markBySelectorAndRegex(selector, regex, boolInvertSelection = false)
{
	const selected = [];
	const selectedInverse = [];
	const elements = get(selector);
	if(!elements) return;
	for(let i = 0, ii = elements.length; i < ii; i++)
	{
		const element = elements[i];
		if(element.textContent && element.textContent.trim().match(regex) !== null && !element.querySelector(selector))
			selected.push(element);
		else
			selectedInverse.push(element);
	}
	if(boolInvertSelection === true)
		markElements(selectedInverse);
	markElements(selected);
}

function makeHierarchicalHeadingsByNumber()
{
	markBySelectorAndRegex("p", /^\d\.\d\.\d\.\d\.\d\.\d\s/)
	replaceElementsBySelector(".markd", "h6");
	markBySelectorAndRegex("p", /^\d\.\d\.\d\.\d\.\d\s/)
	replaceElementsBySelector(".markd", "h5");
	markBySelectorAndRegex("p", /^\d\.\d\.\d\.\d\s/)
	replaceElementsBySelector(".markd", "h4");
	markBySelectorAndRegex("p", /^\d\.\d\.\d\s/)
	replaceElementsBySelector(".markd", "h3");
	markBySelectorAndRegex("p", /^\d\.\d\s/)
	replaceElementsBySelector(".markd", "h2");
}
