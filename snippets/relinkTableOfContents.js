function assignIdsIfMissing(elems)
{
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(!elem.id)
			elem.id = elem.tagName + "_" +  i;
	}
}

function annotateElement(elem, str)
{
	const annotation = document.createElement("an");
	annotation.textContent = " " + str;
	elem.appendChild(annotation);
}

function relinkTableOfContents(linksSelector, headingsSelector)
{
	function normalizeText(str)
	{
		return str.toLowerCase().trim().replace(/[^A-Za-z]/g, "");
	}

	const links = get(linksSelector);
	const headings = get(headingsSelector);
	if(!(links && headings))
	{
		showMessageBig("Failed to get one or both of links and headings");
		return;
	}

	if(links[0].tagName !== "A")
	{
		console.log(`Expected <a>, found ${links[0].tagName}`);
		return;
	}

	assignIdsIfMissing(headings);

	const headingsByText = {};
	for(const heading of headings)
		headingsByText[normalizeText(heading.textContent)] = heading;

	let numLinksFixed = 0;

	for(const link of links)
	{
		const linkTextLower = normalizeText(link.textContent);
		const heading = headingsByText[linkTextLower];
		if(heading)
		{
			link.setAttribute("href", "#" + heading.id);
			link.className = "statusOk";
			// annotateElement(link, "●");
			numLinksFixed++;
		}
		else
		{
			annotateElement(link, "○");
		}
	}

	showMessageBig(`${numLinksFixed} links fixed`);
}

relinkTableOfContents("li a", "h1, h2, h3, h4, h5, h6");
