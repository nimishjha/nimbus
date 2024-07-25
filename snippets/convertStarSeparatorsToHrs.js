function convertStarSeparatorsToHrs()
{
	const paragraphs = get("p");
	for(const paragraph of paragraphs)
	{
		let text = paragraph.textContent;
		if(text && text.indexOf("*") !== -1)
		{
			text = text.replace(/\s+/g, "");
			if(text.indexOf("***") !== -1 && text.match(/[^\*]/) === null)
			{
				const hr = document.createElement("hr");
				paragraph.parentNode.replaceChild(hr, paragraph);
			}
		}
	}
}

convertStarSeparatorsToHrs();
