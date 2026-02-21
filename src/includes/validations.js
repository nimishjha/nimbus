import { Nimbus } from "./Nimbus";

export function hasDuplicateIDs()
{
	const elementsWithIDs = document.querySelectorAll("body *[id]");
	const seen = new Set();
	for(const elem of elementsWithIDs)
	{
		if(elem.id === "")
		{
			elem.removeAttribute("id");
			continue;
		}
		if(seen.has(elem.id))
		{
			return true;
		}
	}
	return false;
}
