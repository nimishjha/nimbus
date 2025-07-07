import { Nimbus } from "./Nimbus";
import { get, getOne, del } from "./selectors";
import { KEYCODES } from "./keycodes";
import { createElement } from "./element";
import { insertStyle } from "./style";
import { makeIdSelector } from "./misc";
import { showMessageBig, showMessageError } from "./ui";

function handleConsoleInput(evt, consoleType)
{
	function insertTab(evt)
	{
		const targ = evt.target;
		evt.preventDefault();
		evt.stopPropagation();
		const iStart = targ.selectionStart;
		const iEnd = targ.selectionEnd;
		targ.value = targ.value.substr(0, iStart) + '\t' + targ.value.substr(iEnd, targ.value.length);
		targ.setSelectionRange(iStart + 1, iEnd + 1);
	}

	const userInputElement = getOne("#userInput");
	if(!userInputElement)
		return;
	const inputText = userInputElement.value;
	if(consoleType === "js")
		Nimbus.jsConsoleText = inputText;
	else if(consoleType === "css")
		Nimbus.cssConsoleText = inputText;
	const ctrlOrMeta = ~navigator.userAgent.indexOf("Macintosh") ? "metaKey" : "ctrlKey";
	switch(evt.keyCode)
	{
		case KEYCODES.ENTER:
			if(evt[ctrlOrMeta])
			{
				if(consoleType === "js")
				{
					try
					{
						eval(inputText);
					}
					catch(err)
					{
						console.log(err);
					}
					return;
				}
				else if(consoleType === "css")
				{
					insertStyle(inputText, "userStyle", true);
				}
			}
			break;
		case KEYCODES.TAB:
			insertTab(evt);
			return false;
		case KEYCODES.ESCAPE:
			toggleConsole();
			break;
	}
}

function getConsoleHistory(consoleType)
{
	switch(consoleType)
	{
		case "css": return Nimbus.cssConsoleText || "";
		case "js": return Nimbus.jsConsoleText || "";
		default: return "";
	}
}

export function editStyleById(styleId)
{
	if(typeof styleId !== "string" || !styleId.length)
	{
		showMessageBig("Style ID is required");
		return;
	}
	styleId = makeIdSelector(styleId);
	const styleElem = getOne(styleId);
	if(!styleElem)
	{
		showMessageBig("Could not get style with id " + styleId);
		return;
	}
	toggleConsole("css");
	getOne("#userInput").value = styleElem.textContent.replace(/!important/g, "");
}

export function toggleConsole(consoleType)
{
	if(getOne("#userInputWrapper"))
	{
		del("#userInputWrapper");
		del("#styleUserInputWrapper");
		return;
	}
	if(!consoleType || !["css", "js"].includes(consoleType))
	{
		showMessageError("toggleConsole needs a consoleType");
		return;
	}
	let dialogStyle;
	const consoleBackgroundColor = consoleType === "css" ? "#036" : "#000";
	dialogStyle = '#userInputWrapper { position: fixed; bottom: 0; left: 0; right: 0; height: 30vh; z-index: 1000000000; }' +
		'#userInput { background: ' + consoleBackgroundColor + '; color: #CCC; font-family: "SF Mono", Consolas, Verdana; font-size: 18px; font-weight: bold; width: 100%; height: 100%; padding: 10px 40px; border: 0; outline: 0; }';
	insertStyle(dialogStyle, "styleUserInputWrapper", true);

	const inputTextareaWrapper = createElement("div", { id: "userInputWrapper", class: "excludeFromMutations" });
	const inputTextarea = createElement("textarea", { id: "userInput", class: "monospace", value: getConsoleHistory(consoleType) });
	const handleKeyDown = function(event){ handleConsoleInput(event, consoleType); };
	inputTextarea.addEventListener("keydown", handleKeyDown);
	inputTextareaWrapper.appendChild(inputTextarea);
	document.body.appendChild(inputTextareaWrapper);
	inputTextarea.focus();
	let history;
	if(consoleType === "css")
	{
		let userStyleText;
		const userStyle = getOne("#userStyle");
		if(userStyle)
			userStyleText = userStyle.textContent;
		history = Nimbus.cssConsoleText || userStyleText;
		if(history)
			inputTextarea.value = history.replace(/\s*!important/g, "");
	}
	else
	{
		history = Nimbus.jsConsoleText;
		if(history)
			inputTextarea.value = history;
	}
}
