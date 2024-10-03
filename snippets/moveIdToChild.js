function moveIdToChild(parentSelector, childSelector)
{
	const parents = get(parentSelector);
	if(!(parents && parents.length))
	{
		showMessageBig(`No parents matching selector ${parentSelector}`);
		return;
	}
	let numIdsMoved = 0;
	for(const elem of parents)
	{
		if(!elem.id) continue;
		const child = elem.querySelector(childSelector);
		if(!child) continue;
		child.id = elem.id;
		elem.removeAttribute("id");
		numIdsMoved++;
	}
	showMessageBig(`Moved ${numIdsMoved} ids from ${parents.length} elements`);
}

moveIdToChild("footnote", "a");
