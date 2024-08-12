function isSeparator(elem)
{
	if(elem.textContent.indexOf("•") !== -1) return elem.textContent.replace(/[•\s]+/g, "").length === 0;
	else return ~elem.textContent.indexOf("*") && elem.textContent.replace(/[\*\s]+/g, "").length === 0;
}

function convertSeparatorsToHrs()
{
	const paragraphs = get("p");
	for(const paragraph of paragraphs)
	{
		if(isSeparator(paragraph))
		{
			const hr = document.createElement("hr");
			paragraph.parentNode.replaceChild(hr, paragraph);
		}
	}
}

convertSeparatorsToHrs();
