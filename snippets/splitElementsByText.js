function splitElementsByText(selector, text, parentTagName, childTagName)
{
	const elems = get(selector);
	for(const elem of elems)
	{
		if(~elem.textContent.indexOf(text))
		{
			const splat = elem.textContent.split(text);
			const parent = document.createElement(parentTagName);
			if(elem.id) parent.id = elem.id;
			for(const splitText of splat)
				parent.appendChild(createElement("h2", { textContent: splitText.trim() }));
			elem.parentNode.replaceChild(parent, elem);
		}
	}
}

splitElementsByText("h2", "|", "hgroup", "h2");
