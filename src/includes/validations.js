import { Nimbus } from "./Nimbus";

export function countDuplicateIDs()
{
	const elementsWithIDs = document.querySelectorAll("body *[id]");
	const seen = new Set();
	let count = 0;

	for(const elem of elementsWithIDs)
	{
		if(elem.id === "")
		{
			elem.removeAttribute("id");
			continue;
		}
		if(seen.has(elem.id))
		{
			count++;
			elem.classList.add(Nimbus.markerClass);
		}
		seen.add(elem.id);
	}
	return count;
}
