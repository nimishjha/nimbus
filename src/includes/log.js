import { Nimbus } from "./Nimbus";
import { showMessageError } from "./ui";
import { createElement, createSelector } from "./element";
import { containsAnyOfTheStrings } from "./string";
import { getPropValueSafe } from "./object";
import { getNodeText } from "./node";
import { arrayToString } from "./misc";
import { getClassCounts } from "./inspect";
import { del } from "./selectors";

export const logColors = {
	black: "background: #000; color: #AAA;",
	gray: "background: #555; color: #AAA;",
	blue: "background: #008; color: #ACE;",
	yellow: "background: #000; color: #CC0;",
	orange: "background: #420; color: #C80;",
	green: "background: #040; color: #0C0;",
	red: "background: #600; color: #C00;",
	purple: "background: #204; color: #C7E;",
	success: "background: #030; color: #0a0;",
	info: "background: #000; color: #aaa;",
	warning: "background: #420; color: #C70;",
	error: "background: #400; color: #a00;",
};

export const logStyles = {
	styleHeading: "font-size: 22px;",
};

export function elemToString(elem)
{
	return elem.tagName + ": " + elem.textContent.substring(0, 10);
}

export function printPropOfObjectArray(arr, propName)
{
	let i = -1;
	const len = arr.length;
	let strProps = "";
	while(++i < len)
		strProps += getPropValueSafe(arr[i], propName) + "\n";
	console.log(strProps);
}

export function printPropsContaining(obj, arrStrings)
{
	const keys = Object.keys(obj);
	let strPropsWithValues = "";
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		if(containsAnyOfTheStrings(key, arrStrings))
			strPropsWithValues += key + ": " + obj[key] + "\n";
	}
	console.log(strPropsWithValues);
}

export function logElements(elements)
{
	if(!Array.isArray(elements))
	{
		showMessageError("Expected array, got " + elements);
		return;
	}
	let strElementSelectors = "";
	for(let i = 0, ii = elements.length; i < ii; i++)
		strElementSelectors += "\t" + createSelector(elements[i]) + "\n";
	console.log(strElementSelectors);
}

export function xlog(str, logTag)
{
	const tag = logTag && logTag.length ? logTag : "h6";
	Nimbus.logMessages.push({ tag, str });
}

export function ylog(str, tag = "h6", prepend = true)
{
	const logElement = createElement(tag, { className: "xlog", textContent: str });
	if(prepend)
		document.body.insertBefore(logElement, document.body.firstChild);
	else
		document.body.appendChild(logElement);
}

export function logString(str, label)
{
	if(label) console.log(`%c${label} %c${str}`, logColors.blue, logColors.green);
	else console.log(`%c${str}`, logColors.gray);
}

export function logTable(...args)
{
	const tableElem = document.createElement("table");
	const trElem = document.createElement("tr");
	for(const arg of args)
		trElem.appendChild(createElement("td", { textContent: arg }));
	tableElem.appendChild(trElem);
	document.body.appendChild(tableElem);
}

export function logStringPair(str1, str2)
{
	console.log(`%c${str1}`, "color: #ACE; background: #008", str2);
}

export function logElementsWithText(elems)
{
	for(const elem of elems)
		logStringPair(elem.tagName || "text node", getNodeText(elem));
}

export function showLog(prepend)
{
	if(Nimbus.logMessages.length > 0)
	{
		const logWrapper = document.createElement("footer");
		logWrapper.className = "xlog";
		for(const msg of Nimbus.logMessages)
		{
			const elem = document.createElement(msg.tag);
			elem.textContent = msg.str;
			logWrapper.appendChild(elem);
		}

		if(prepend === true)
			document.body.insertBefore(logWrapper, document.body.firstChild);
		else
			document.body.appendChild(logWrapper);
		Nimbus.logMessages = [];
	}
	else
		ylog("No logs");
}

export function clearLog()
{
	del(".xlog");
	Nimbus.logMessages = [];
}

export function debugVars(params)
{
	const keys = Object.keys(params);
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		const value = params[key];
		if(Array.isArray(value))
			console.log(key, '\n', arrayToString(value, "\n"));
		else
			console.log(key, '\n\t', value);
	}
}

export function logAllClassesFor(selector)
{
	if(typeof selector === "string" && selector.length)
	{
		let str = "";
		const classCounts = getClassCounts(selector);
		if(classCounts.length)
		{
			str += selector + "\n";
			for(const item of classCounts)
				str += "\t" + item.className + "\t" + item.count + "\n";
			console.log(str);
		}
	}
	else
	{
		logAllClassesFor("div");
		logAllClassesFor("h1");
		logAllClassesFor("h2");
		logAllClassesFor("h3");
		logAllClassesFor("p");
		logAllClassesFor("blockquote");
		logAllClassesFor("span");
	}
}

export function logYellow(...args)
{
	const [ str, ...rest ] = args;
	console.log(`%c${str}`, logColors.yellow, ...rest);
}

export function logSuccess(...args)
{
	const [ str, ...rest ] = args;
	console.log(`%c${str}`, logColors.success, ...rest);
}

export function logInfo(...args)
{
	const [ str, ...rest ] = args;
	console.log(`%c${str}`, logColors.info, ...rest);
}

export function logWarning(...args)
{
	const [ str, ...rest ] = args;
	console.log(`%c${str}`, logColors.warning, ...rest);
}

export function logError(...args)
{
	const [ str, ...rest ] = args;
	console.log(`%c${str}`, logColors.error, ...rest);
}
