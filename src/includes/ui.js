import { Nimbus } from "./Nimbus";
import { get, getOne, getOrCreate, del } from "./selectors";
import { insertStyle } from "./style";
import { emptyElement, createElement } from "./element";
import { KEYCODES } from "./keycodes";
import { parseCommand, runCommand } from "./command";

const config = {
	messageTimeout: null
}

export function showMessage(message, msgClass, persist)
{
	const MESSAGE_TIMEOUT = 2000;
	clearTimeout(config.messageTimeout);
	msgClass = msgClass || "";
	const strStyle = `
		message { display: block; background: rgba(0,0,0,0.75); font: 12px Verdcode, Verdana; color: #888; height: 60px; line-height: 60px; position: fixed; top: calc(100vh - 60px); left: 0; width: 100%; z-index: 2147483647; }
		messageinner { display: block; text-align: left; padding: 0 2rem; font: 18px "swis721 cn bt"; height: 60px; line-height: 60px; }
		messagebig { display: block; text-align: left; font: 24px "swis721 cn bt"; color: #AAA; height: 60px; line-height: 60px; font-weight: 500; padding: 0 2rem; }
		messageerror { display: block; text-align: left; font: 24px "swis721 cn bt"; color: #DDD; background: #500; height: 60px; line-height: 60px; font-weight: 500; padding: 0 2rem; }
	`;
	const messageInnerTagName = msgClass ? msgClass : "messageinner";
	if(getOne("message"))
	{
		del("message");
	}
	const messageContainer = document.createElement("message");
	messageContainer.className = "excludeFromMutations";
	const messageInner = document.createElement(messageInnerTagName);
	const messageContent = document.createElement("div");
	let messageText;
	let messageTag;
	let messageElement;
	if(typeof message === "string")
	{
		messageElement = document.createTextNode(message);
	}
	else
	{
		messageElement = document.createElement(message.tag);
		messageElement.textContent = message.text;
	}
	messageContent.appendChild(messageElement);
	messageInner.appendChild(messageContent);
	messageContainer.appendChild(messageInner);
	document.body.appendChild(messageContainer);
	if(!getOne("#styleMessage"))
		insertStyle(strStyle, "styleMessage", true);
	if(!persist)
		config.messageTimeout = setTimeout(deleteMessage, MESSAGE_TIMEOUT);
}

export function showMessageBig(message, persist = false)
{
	showMessage(message, "messagebig", persist);
}

export function showMessageError(message, persist = false)
{
	showMessage(message, "messageerror", persist);
}

export function deleteMessage()
{
	del("message");
	del("#styleMessage");
	del("panel");
	del("#stylePanel");
}

export function customPrompt(message, initialValue)
{
	if(!getOne("#xxdialog"))
	{
		del("#style-xxdialog");
		const dialog = createElement("div", { id: "xxdialog", class: "excludeFromMutations" });
		const dialogHeading = createElement("heading", { textContent: message });
		const dialogInput = createElement("input", { id: "xxdialoginput", autocomplete: "off" });
		if(initialValue)
			dialogInput.value = initialValue;
		dialog.appendChild(dialogHeading);
		dialog.appendChild(dialogInput);
		document.body.insertBefore(dialog, document.body.firstChild);
		const s = '#xxdialog { position: fixed; margin: auto; z-index: 10000; height: 90px; top: 0; left: 0px; bottom: 0px; right: 0; background: #111; color: #FFF; border: 10px solid #000; display: block; text-transform: none; width: 60vw; }' +
			'#xxdialog heading { height: 30px; line-height: 30px; padding: 0 10px; background: #111; display: block; margin: 0; }' +
			'#xxdialog #xxdialoginput { font: 32px "swis721 cn bt"; line-height: 60px; verdana; background: #000; color: #FFF; padding: 0 0; margin: 0; border-width: 0 10px; border-color: #000; width: 100%; height: 60px; overflow: hidden; box-sizing: border-box; }';
		insertStyle(s, "style-xxdialog", true);
		dialogInput.focus();
		const func = function(resolve, reject) {
			dialogInput.addEventListener("keydown", function handleCustomPromptInput(evt){
				evt.stopPropagation();
				switch(evt.keyCode)
				{
					case KEYCODES.ESCAPE:
						evt.preventDefault();
						reject(closeCustomPrompt());
						break;
					case KEYCODES.ENTER:
						evt.preventDefault();
						resolve(closeCustomPrompt());
						break;
					case KEYCODES.UPARROW:
						evt.preventDefault();
						restoreCustomPromptHistory(evt.target);
						break;
				}
			}, false);
		};
		return new Promise(func);
	}
}

export function restoreCustomPromptHistory(inputElement)
{
	inputElement.focus();
	if(Nimbus.lastCommand)
		setTimeout(function(){ inputElement.value = Nimbus.lastCommand; }, 0);
}

export function closeCustomPrompt()
{
	const command = getOne("#xxdialoginput").value;
	del("#xxdialog");
	del("#style-xxdialog");
	return command;
}

export function autoCompleteInputBox()
{
	const inputComponent = Nimbus.autoCompleteInputComponent;

	function updateInputField()
	{
		if(~inputComponent.currentIndex && inputComponent.matches[inputComponent.currentIndex])
			getOne("#autoCompleteInput").value = inputComponent.matches[inputComponent.currentIndex] + " ";
	}

	function highlightPrevMatch()
	{
		if(inputComponent.currentIndex > 0)
			inputComponent.currentIndex--;
		renderMatches();
	}

	function highlightNextMatch()
	{
		if(inputComponent.currentIndex < inputComponent.matches.length - 1)
			inputComponent.currentIndex++;
		renderMatches();
	}

	function onAutoCompleteInputKeyUp(evt)
	{
		const inputText = evt.target.value;
		if(!inputText)
		{
			if(evt.keyCode === KEYCODES.UPARROW)
				restoreCustomPromptHistory(evt.target);
			clearMatches();
			return;
		}
		showMatches(inputText);
		switch(evt.keyCode)
		{
			case KEYCODES.TAB: updateInputField(); break;
			case KEYCODES.ENTER: updateInputField(); executeFunction(); break;
		}
	}

	function onAutoCompleteInputKeyDown(evt)
	{
		switch(evt.keyCode)
		{
			case KEYCODES.TAB: evt.preventDefault(); break;
			case KEYCODES.ESCAPE: evt.preventDefault(); close(); break;
			case KEYCODES.UPARROW: evt.preventDefault(); highlightPrevMatch(); break;
			case KEYCODES.DOWNARROW: evt.preventDefault(); highlightNextMatch(); break;
		}
	}

	function renderMatches()
	{
		const matchList = document.createElement("div");
		matchList.className = "excludeFromMutations";
		const numMatches = inputComponent.matches.length;
		if(numMatches === 1)
		{
			inputComponent.currentIndex = 0;
			updateInputField();
		}
		for(let i = 0, ii = numMatches; i < ii; i++)
		{
			const match = document.createElement("match");
			match.className = "excludeFromMutations";
			if(inputComponent.currentIndex === i) match.className = "current";
			match.textContent = inputComponent.matches[i];
			matchList.appendChild(match);
		}
		const matchesContainer = getOne("#autoCompleteMatches");
		matchesContainer.textContent = "";
		matchesContainer.appendChild(matchList);
	}

	function showMatches(str)
	{
		if(!str || !str.length || str.length < 2)
		{
			emptyElement(getOne("#autoCompleteMatches"));
			inputComponent.currentIndex = -1;
			return;
		}
		str = str.toLowerCase().trim();

		inputComponent.matches = [];
		const commands = Object.keys(Nimbus.availableFunctions);
		for(let i = 0, ii = commands.length; i < ii; i++)
		{
			if(~commands[i].toLowerCase().indexOf(str))
				inputComponent.matches.push(commands[i]);
		}
		renderMatches();
	}

	function clearMatches()
	{
		inputComponent.matches = [];
		inputComponent.currentIndex = -1;
		renderMatches();
	}

	function open()
	{
		if(getOne("#autoCompleteInputWrapper"))
			return;
		const style = `autocompleteinputwrapper { display: block; width: 800px; height: 40vh; position: fixed; left: 0; top: 0; right: 0; bottom: 0; margin: auto; z-index: 2147483647; font-family: "swis721 cn bt"; }
			inputelementwrapper { display: block; border: 2px solid #07C; }
			autocompleteinputwrapper input { width: 100%; height: 3rem; font-size: 32px; background: #000; color: #DDD; outline: 0; display: block; font-family: inherit; }
			autocompleteinputwrapper matches { display: block; background: #222; color: #CCC; }
			autocompleteinputwrapper match { display: block; padding: 2px 10px; font-size: 24px; }
			autocompleteinputwrapper match.current { background: #303030; color: #FFF; }
			autocompleteinputwrapper em { display: inline-block; width: 200px; }`;
		insertStyle(style, "styleAutoCompleteInputBox", true);
		const dialogWrapper = createElement("autocompleteinputwrapper", { id: "autoCompleteInputWrapper", class: "excludeFromMutations" });
		const inputElementWrapper = createElement("inputelementwrapper");
		const inputElement = createElement("input", { id: "autoCompleteInput", autocomplete: "off" });
		const optionsList = createElement("matches", { id: "autoCompleteMatches" });
		inputElement.addEventListener("keyup", onAutoCompleteInputKeyUp);
		inputElement.addEventListener("keydown", onAutoCompleteInputKeyDown);
		inputElementWrapper.appendChild(inputElement);
		dialogWrapper.appendChild(inputElementWrapper);
		dialogWrapper.appendChild(optionsList);
		document.body.appendChild(dialogWrapper);
		inputElement.focus();
	}

	function close()
	{
		del("#autoCompleteInputWrapper");
	}

	function executeFunction()
	{
		const command = getOne("#autoCompleteInput").value;
		Nimbus.lastCommand = command;
		clearMatches();
		close();
		runCommand(command);
	}

	return { open, close };
}

export function getSelectionOrUserInput(promptMessage, callback, isUnary)
{
	if(window.getSelection().toString().length)
	{
		const selection = window.getSelection().toString();
		callback(selection);
		return;
	}
	if(isUnary)
	{
		customPrompt(promptMessage).then(callback);
		return;
	}
	function callFunctionWithUserInput(userInput)
	{
		if(~userInput.indexOf(" ") || ~userInput.indexOf('"'))
			callback.apply(null, parseCommand(userInput));
		else
			callback.call(null, userInput);
	}
	customPrompt(promptMessage).then(callFunctionWithUserInput);
}

export function showStatus(id, str)
{
	getOrCreate("h3", id).textContent = id + ": " + str;
}

export function showPanel(panelText)
{
	const strStyle = `
		panel { display: block; background: rgba(0,0,0,0.75); font-size: 20px; font-family: "swis721 cn bt"; color: #888; height: 100vh; position: fixed; top: 0; left: 0; bottom: 0; width: 30%; z-index: 2147483647; }
		panelinner { display: block; text-align: left; padding: 0 2rem; font: inherit; white-space: pre; }
	`;
	if(getOne("panel"))
		del("panel");

	const messageContainer = document.createElement("panel");
	messageContainer.className = "excludeFromMutations";
	const messageInner = document.createElement("panelinner");
	messageInner.textContent = panelText;
	messageContainer.appendChild(messageInner);
	document.body.appendChild(messageContainer);
	if(!getOne("#stylePanel"))
		insertStyle(strStyle, "stylePanel", true);
}
