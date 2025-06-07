function moveIdToParent(childSelector, parentSelector)
{
	const children = get(childSelector);
	if(!(children && children.length))
	{
		showMessageBig(`No children matching selector ${childSelector}`);
		return;
	}
	let numIdsMoved = 0;
	let numNoId = 0;
	let numNoParent = 0;
	let numParentAlreadyHasId = 0;

	for(const child of children)
	{
		if(!child.id)
		{
			numNoId++;
			continue;
		}
		const parent = child.closest(parentSelector);
		if(!parent)
		{
			numNoParent++;
			continue;
		}
		if(parent.id)
		{
			numParentAlreadyHasId++;
			continue;
		}
		parent.id = child.id;
		child.removeAttribute("id");
		numIdsMoved++;
	}
	showMessageBig(`Moved ${numIdsMoved} ids; ${numNoId} had no ID; ${numNoParent} had no matching parent; ${numParentAlreadyHasId}'s parent already had an ID`);
}

moveIdToParent(".markd", "h1, h2, h3, h4, h5, h6, p, li, blockquote, figure");
