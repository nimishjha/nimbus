import { Nimbus } from "./Nimbus";
import { customPrompt, showMessageBig } from "./ui";
import { arrayToStringTyped, isNumber } from "./misc";

export function parseCommand(commandString)
{
	const args = [];
	let arg = '';
	const cleanCommandString = commandString.replace(/\s+/g, ' ').trim();
	for(let i = 0, ii = cleanCommandString.length; i < ii; i++)
	{
		switch(cleanCommandString[i])
		{
			case '"':
				i++;
				while(cleanCommandString[i] !== '"' && i < ii)
					arg += cleanCommandString[i++];
				break;
			case ' ':
				args.push(arg);
				arg = '';
				break;
			default:
				arg += cleanCommandString[i];
		}
	}
	args.push(arg);
	return args;
}

export function runCommand(commandString)
{
	if(typeof commandString === "undefined" || !commandString.length)
		return;
	Nimbus.lastCommand = commandString;
	const commandSegments = parseCommand(commandString);
	if(!commandSegments.length)
		return;
	const funcName = commandSegments[0];
	if(Nimbus.availableFunctions[funcName])
	{
		const args = [];
		for(let i = 1, ii = commandSegments.length; i < ii; i++)
		{
			const n = isNumber(commandSegments[i]);
			if(n === false)
				args.push(commandSegments[i]);
			else args.push(n);
		}
		const argsString = arrayToStringTyped(args, ", ");
		console.log(`%c${funcName}(${argsString})`, 'color: #FF0');
		Nimbus.availableFunctions[funcName].apply(this, args);
	}
	else
	{
		showMessageBig(funcName + ": not found");
	}
}

export function callFunctionWithArgs(promptMessage, callback, numArgs, initialValue)
{
	function callFunctionWithArgsHelper(userInput)
	{
		if(!numArgs || numArgs > 1)
		{
			const args = parseCommand(userInput);
			if(numArgs && args.length !== numArgs)
			{
				showMessageBig(numArgs + " arguments are required");
				callFunctionWithArgs(promptMessage, callback, numArgs);
				return;
			}
			console.log(`%c${promptMessage}: ${args.join(", ")}`, 'color: #FF0');
			callback.apply(null, args);
		}
		else
		{
			userInput = userInput.replaceAll('"', "");
			console.log(`%c${promptMessage} ${userInput}`, 'color: #FF0');
			callback.call(null, userInput);
		}
	}
	customPrompt(promptMessage, initialValue).then(callFunctionWithArgsHelper);
}
