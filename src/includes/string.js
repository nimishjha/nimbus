import { createElement } from "./element";

export function removeLineBreaks(str)
{
	return str.replace(/[\r\n\s]+/g, " ");
}

export function trimNonAlphanumeric(str)
{
	if(!str)
		return null;
	return str.replace(/^[^A-Za-z0-9]+/, '').replace(/[^A-Za-z0-9]+$/, '');
}

export function trimSpecialChars(str)
{
	if(!str)
		return null;
	return str.replace(/^[^A-Za-z0-9\(\)\[\]]+/, '').replace(/[^A-Za-z0-9\(\)\[\]]+$/, '');
}

export function ltrim(str)
{
	return str.replace(/^\s+/, '');
}

export function trimAt(str, sub)
{
	const index = str.indexOf(sub);
	if(index === -1)
		return str;
	return str.substring(0, index);
}

export function trimAtInclusive(str, sub)
{
	const index = str.indexOf(sub);
	if(index === -1)
		return str;
	return str.substring(0, index + sub.length);
}

export function trimStartingAt(str, sub)
{
	const index = str.indexOf(sub);
	if(index === -1)
		return str;
	return str.substring(index);
}

export function trimBetween(str, sub1, sub2)
{
	const index1 = str.indexOf(sub1);
	const index2 = str.indexOf(sub2);
	if(!(~index1 && ~index2))
		return str;
	return str.substring(index1 + sub1.length, index2);
}

export function padLeft(str, width)
{
	let spaces = "";
	for(let i = 0, ii = width - str.length; i < ii; i++)
		spaces += " ";
	return spaces + str;
}

export function padRight(str, width)
{
	let spaces = "";
	for(let i = 0, ii = width - str.length; i < ii; i++)
		spaces += " ";
	return str + spaces;
}

export function normalizeWhitespace(str) { return str.replace(/\s+/g, " "); }
export function removeWhitespace(str) { return str.replace(/\s+/g, ''); }
export function normalizeString(str) { return removeWhitespace(str.toLowerCase()); }
export function normalizeHTML(html) { return html.replace(/&nbsp;/g, " ").replace(/\s+/g, " "); }
export function removeNonAlpha(str) { return str.replace(/[^A-Za-z]/g, ''); }

export function capitalize(text)
{
	const words = text.split(" ");
	let str = "";
	for(const word of words)
	{
		if(word.length > 1 && (!/[a-z]+/.test(word) || /^[A-Z]+'\w+$/.test(word)) || word === "I")
			str += word + " ";
		else
			str += word.toLowerCase() + " ";
	}
	str = str.trim();
	return str[0].toUpperCase() + str.slice(1);
}

export function escapeHTML(html)
{
	const escapeElem = createElement("textarea");
	escapeElem.textContent = html;
	return escapeElem.innerHTML;
}

export function unescapeHTML(html)
{
	const escapeElem = createElement("textarea");
	escapeElem.innerHTML = html;
	return escapeElem.textContent;
}

export function containsAnyOfTheStrings(s, arrStrings)
{
	if(!s || typeof s !== "string")
		return false;
	let i = arrStrings.length;
	while(i--)
		if(~s.indexOf(arrStrings[i]))
			return true;
	return false;
}

export function containsAllOfTheStrings(s, arrStrings)
{
	if(typeof s !== "string")
		return false;
	let i = arrStrings.length;
	let found = 0;
	while(i--)
		if(~s.indexOf(arrStrings[i]))
			found++;
	if(found === arrStrings.length)
		return true;
	return false;
}

export function startsWithAnyOfTheStrings(s, arrStrings)
{
	if(!s || typeof s !== "string")
		return false;
	for(let i = 0, ii = arrStrings.length; i < ii; i++)
		if(s.indexOf(arrStrings[i]) === 0)
			return true;
	return false;
}
