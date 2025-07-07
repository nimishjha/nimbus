import { Nimbus } from "./Nimbus";
import { showMessageBig, showMessageError } from "./ui";
import { createElement, createSelector } from "./element";
import { containsAnyOfTheStrings } from "./string";
import { getPropValueSafe } from "./object";
import { getNodeText } from "./node";
import { arrayToString } from "./misc";
import { getClassCounts } from "./inspect";

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
	let tag;
	if(logTag && logTag.length)
		tag = logTag;
	else
		tag = "h6";
	Nimbus.logString += '<' + tag + ' class="xlog">' + str + '</' + tag + '>\r\n';
}

export function ylog(str, tag, prepend, logClassName = "xlog")
{
	const tagName = tag || "h6";
	const logElement = createElement(tagName, { className: logClassName, innerHTML: str });
	if(prepend)
		document.body.insertBefore(logElement, document.body.firstChild);
	else
		document.body.appendChild(logElement);
}

export function log2(str)
{
	document.body.appendChild(createElement("h2", { className: "xlog", innerHTML: str }));
}

export function logString(str, label)
{
	const colors = Nimbus.logColors;
	if(label) console.log(`%c${label} %c${str}`, colors.blue, colors.green);
	else console.log(`%c${str}`, colors.gray);
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
	let logDiv;
	if(Nimbus.logString.length > 0)
	{
		logDiv = document.createElement("log");
		logDiv.innerHTML = Nimbus.logString;
		if(prepend === true)
			document.body.insertBefore(logDiv, document.body.firstChild);
		else
			document.body.appendChild(logDiv);
		Nimbus.logString = "";
	}
	else
	{
		ylog("No logs");
	}
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
