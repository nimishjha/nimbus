import { showMessageBig } from "./ui";
import { getOne, del } from "./selectors";
import { insertStyle } from "./style";

function handleBlockEditClick(evt)
{
	evt.stopPropagation();
	const ctrlOrMeta = navigator.userAgent.includes("Macintosh") ? "metaKey" : "ctrlKey";
	const targ = evt.target;
	if(targ.tagName.toLowerCase() === 'body')
		return;

	const tagNameLower = targ.tagName.toLowerCase();

	if(evt[ctrlOrMeta] && evt.shiftKey)
	{
		const clone = targ.cloneNode(true);
		while(document.body.firstChild)
			document.body.firstChild.remove();
		document.body.appendChild(clone);
		toggleBlockEditMode();
		return;
	}
	else if(evt[ctrlOrMeta] && !evt.shiftKey)
	{
		if(tagNameLower === 'body')
			return;
		const node = tagNameLower === "li" && targ.parentNode && targ.parentNode !== document.body ? targ.parentNode : targ;
		node.remove();
		return;
	}
	else if(evt.shiftKey)
	{
		if(!document.getElementById("newbody"))
		{
			const newbody = document.createElement("div");
			newbody.id = "newbody";
			document.body.appendChild(newbody);
		}
		document.getElementById("newbody").appendChild(targ);
	}
	return true;
}

export function toggleBlockEditMode()
{
	const db = document.body;
	if(getOne("#styleToggleBlockEditMode"))
	{
		del("#styleToggleBlockEditMode");
		db.removeEventListener("mouseup", handleBlockEditClick, false);
		showMessageBig("Block edit mode off");
	}
	else
	{
		db.addEventListener("mouseup", handleBlockEditClick, false);
		const style = `
			html body.debug header, html body.debug footer, html body.debug article, html body.debug aside, html body.debug section, html body.debug div { box-shadow: inset 2px 2px #555, inset -2px -2px #555; margin: 10px; padding: 10px; }
			html body.debug header:hover, html body.debug footer:hover, html body.debug article:hover, html body.debug aside:hover, html body.debug section:hover, html body.debug div:hover { box-shadow: inset 2px 2px #888, inset -2px -2px #888; }
		`;
		insertStyle(style, "styleToggleBlockEditMode", true);
		showMessageBig("Block edit mode on");
	}
}
