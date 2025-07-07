import { showMessageBig } from "./ui";
import { getOne, del } from "./selectors";
import { insertStyle } from "./style";

function handleBlockEditClick(evt)
{
	evt.stopPropagation();
	let targ;
	let ctrlOrMeta = "ctrlKey";
	if(~navigator.userAgent.indexOf("Macintosh"))
		ctrlOrMeta = "metaKey";
	if(!evt)
		evt = window.event;
	if(evt.target)
		targ = evt.target;
	const tagNameLower = targ.tagName.toLowerCase();
	// Retrieve clicked element
	if(evt[ctrlOrMeta] && evt.shiftKey)
	{
		document.body.innerHTML = targ.innerHTML;
		toggleBlockEditMode();
		return;
	}
	// delete clicked element
	else if(evt[ctrlOrMeta] && !evt.shiftKey)
	{
		if(tagNameLower === 'body')
			return;
		if(tagNameLower === "li" || tagNameLower === "p" && targ.parentNode && targ.parentNode !== document.body)
			targ = targ.parentNode;
		targ.remove();
		return false;
	}
	// append clicked element to a div
	else if(evt.shiftKey)
	{
		if(!document.getElementById("newbody"))
		{
			const newbody = document.createElement("div");
			newbody.id = "newbody";
			document.body.appendChild(newbody);
		}
		if(targ.tagName.toLowerCase() === 'body')
			return;
		document.getElementById("newbody").appendChild(targ);
	}
	return true;
}

//	This function toggles "block edit mode," in which you can:
//		- ctrl-shift-click to retrieve the clicked element
//		- ctrl-click to delete the clicked element
//		- shift-click to move the clicked element to a container div at the end of the document, which you can later retrieve using ctrl-shift-click
export function toggleBlockEditMode()
{
	const db = document.body;
	if(getOne("#styleToggleBlockEditMode"))
	{
		del("#styleToggleBlockEditMode");
		db.removeEventListener("mouseup", handleBlockEditClick, false);
		db.classList.remove("debug");
		showMessageBig("Block edit mode off");
	}
	else
	{
		db.addEventListener("mouseup", handleBlockEditClick, false);
		db.classList.add("debug");
		const style = `
			html body.debug header, html body.debug footer, html body.debug article, html body.debug aside, html body.debug section, html body.debug div { box-shadow: inset 2px 2px #555, inset -2px -2px #555; margin: 10px; padding: 10px; }
			html body.debug header:hover, html body.debug footer:hover, html body.debug article:hover, html body.debug aside:hover, html body.debug section:hover, html body.debug div:hover { box-shadow: inset 2px 2px #888, inset -2px -2px #888; }
		`;
		insertStyle(style, "styleToggleBlockEditMode", true);
		showMessageBig("Block edit mode on");
	}
}
