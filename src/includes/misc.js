import { get } from "./selectors";
import { createElement } from "./element";

export function isNumber(s)
{
	const str = s.trim();
	if(!str.length || /[^0-9\.\-]/.test(str))
		return false;
	const num = Number(str);
	if(isNaN(num))
		return false;
	return num;
}

export function arrayToString(arr, separator)
{
	let sep = separator || " | ";
	let s = "";
	if(!arr.length)
		return "[empty array]";
	for(let i = 0, ii = arr.length; i < ii; i++)
		s += "\t" + arr[i] + sep;
	return s.substring(0, s.length - sep.length);
}

export function arrayToStringTyped(arr, separator)
{
	let sep = separator || " | ";
	let s = "";
	for(let i = 0, ii = arr.length; i < ii; i++)
	{
		if(typeof arr[i] === "string")
			s += '"' + arr[i] + '"' + sep;
		else
			s += arr[i] + sep;
	}
	return s.substring(0, s.length - sep.length);
}

export function escapeForRegExp(str)
{
	const specials = /[.*+?|()\[\]{}\\]/g;
	return str.replace(specials, "\\$&");
}

export function looksLikeUrl(str)
{
	if(str.indexOf("http") === 0)
		return true;
	if(~str.indexOf("/"))
		return true;
}

export function makeClassSelector(className)
{
	if(className.indexOf(".") !== 0)
		return "." + className.trim();
	return className.trim();
}

export function createUUID()
{
	return 'nimbus-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function(c)
	{
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}

export function createBulletAnchor(id)
{
	const CHAR_BULLET = '\u2022';
	return createElement("cite", { textContent: CHAR_BULLET, id: id });
}

export function getTimestamp(mode = "dateAndTime")
{
	const d = new Date();
	const YYYY = d.getFullYear();
	const MO = zeroPad(d.getMonth() + 1);
	const DD = zeroPad(d.getDate());
	const HH = zeroPad(d.getHours());
	const MM = zeroPad(d.getMinutes());
	const SS = zeroPad(d.getSeconds());
	if(mode === "dateOnly")
		return `${YYYY}-${MO}-${DD}`;
	return `${YYYY}/${MO}/${DD} ${HH}:${MM}:${SS}`;
}

export function toNumber(str)
{
	if(!(typeof str === "string" && str.length))
		return false;
	const noCommas = str.replace(/,/g, "").trim();
	const n = Number(noCommas);
	return !isNaN(n) ? n : false;
}

export function selectRandom(arr)
{
	if(!(arr && arr.length)) throw new Error(arr);
	return arr[Math.floor(Math.random() * arr.length)];
}

export function forAll(selector, callback)
{
	const elems = get(selector);
	if(!elems) return;
	const len = elems.length;
	let i = -1;
	while(++i < len)
		callback(elems[i]);
}

export function getUniqueClassNames(arrClasses)
{
	if (!arrClasses) return [];
	const allClassNames = arrClasses.flatMap(line => line.trim().split('.').filter(name => name));
	return [...new Set(allClassNames)];
}

export function zeroPad(num, width = 2)
{
	const str = num.toString();
	const len = str.length;
	if (len >= width) return str;
	return '0'.repeat(width - len) + str;
}

export function makeIdSelector(id)
{
	if(id.indexOf("#") !== 0)
		return "#" + id.trim();
	return id.trim();
}

export function getViewportSize()
{
	if (window.innerWidth) return { width: window.innerWidth, height: window.innerHeight };
	if (document.documentElement && document.documentElement.clientWidth) return { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
	if (document.body) return { width: document.body.clientWidth, height: document.body.clientHeight };
	return { width: 0, height: 0 };
}

export function getViewportHeight()
{
	if (window.innerHeight) return window.innerHeight;
	if (document.documentElement && document.documentElement.clientHeight) return document.documentElement.clientHeight;
	if (document.body) return document.body.clientHeight;
	return 0;
}

export function isChrome() { return navigator.userAgent.indexOf("Chrome/") !== -1; }
export function isIframe() { return window !== window.top; }
export function noop(){};
