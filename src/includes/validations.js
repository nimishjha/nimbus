export function doDuplicateIDsExist()
{
	const elementsWithIDs = document.querySelectorAll("body *[id]");
	const seen = new Set();
	for(const elem of elementsWithIDs)
	{
		if(seen.has(elem.id))
			return true;
		seen.add(elem.id);
	}
	return false;
}
