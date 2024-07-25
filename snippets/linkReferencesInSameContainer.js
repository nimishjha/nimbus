function linkReferencesInSameContainer()
{
	const container = document.querySelector(".markd");
	if(!container) return;
	const chapNum = container.querySelector("h2");
	if(!chapNum)
	{
		console.log("Couldn't get chapter number");
		return;
	}
	const chapNumText = chapNum.textContent.trim();
	const references = container.querySelectorAll("reference a");
	if(!references && references.length) return;
	const sourceRefLookup = {};
	for(const reference of references)
	{
		const refText = reference.textContent.trim();
		if(!sourceRefLookup[refText]) sourceRefLookup[refText] = {
			sourceLink: reference,
			targetLinks: []
		};
		else sourceRefLookup[refText].targetLinks.push(reference);
	}
	let count = 0;
	for(const sourceLinkText of Object.keys(sourceRefLookup))
	{
		count++;
		const linkData = sourceRefLookup[sourceLinkText];
		if(!linkData.targetLinks.length)
		{
			console.log(`%cReference ${sourceLinkText} has no target link`, "color: #F90");
			continue;
		}
		if(linkData.targetLinks.length > 1)
		{
			console.log("%cExpected one target link, found", "color: #F90", linkData.targetLinks.length);
			continue;
		}
		linkData.sourceLink.id = chapNumText + "_ref" + count;
		const targetLink = linkData.targetLinks[0];
		targetLink.id = chapNumText + "_backref" + count;
		targetLink.setAttribute("href", "#" + linkData.sourceLink.id);
		linkData.sourceLink.setAttribute("href", "#" + targetLink.id);
		console.log("targetLink href set to", targetLink.getAttribute("href"), "; sourceLink href set to", linkData.sourceLink.getAttribute("href"));
	}
}

linkReferencesInSameContainer();
