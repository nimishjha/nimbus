import { arrayToString } from "./misc";

function quoteIfString(arg)
{
	if(typeof arg === "string")
		return '"' + arg + '"';
	return arg;
}

//	Prints all properties of an object that match a string
function logPropertiesMatching(obj, str)
{
	str = str.toLowerCase();
	const seen = new Set();
	function traverse(object, str, path = [])
	{
		if(seen.has(object))
			return;
		seen.add(object);
		const keys = Object.keys(object);
		for(let i = 0, ii = keys.length; i < ii; i++)
		{
			const key = keys[i];
			const value = object[key];
			const fullPath = path.length ? path.join(".") + "." + key : key;
			const type = Object.prototype.toString.call(value);
			const doesMatch = key.toLowerCase().indexOf(str) !== -1;
			if(type === "[object Object]")
			{
				if(doesMatch)
					console.log(`%c${fullPath}`, "color: #0F0;", type);
				traverse(value, str, path.concat(key));
			}
			else if(doesMatch)
			{
				console.log(`%c${fullPath}`, "color: #0F0;", quoteIfString(value));
			}
		}
	}
	traverse(obj, str);
}

//	Prints all property values of an object that match a string
function logValuesMatching(obj, str)
{
	str = str.toLowerCase();
	const seen = new Set();
	function traverse(object, str, path = [])
	{
		if(seen.has(object))
			return;
		seen.add(object);
		const keys = Object.keys(object);
		for(let i = 0, ii = keys.length; i < ii; i++)
		{
			const key = keys[i];
			const value = object[key];
			const fullPath = path.length ? path.join(".") + "." + key : key;
			const type = Object.prototype.toString.call(value);
			if(type === "[object Object]")
				traverse(value, str, path.concat(key));
			else if(typeof value === "string" && value.toLowerCase().indexOf(str) !== -1)
				console.log(`%c${fullPath}`, "color: #0F0;", quoteIfString(value));
			else if(typeof value === "number" && value.toString().indexOf(str) !== -1)
				console.log(`%c${fullPath}`, "color: #0F0;", value);
		}
	}
	traverse(obj, str);
}

function parseObject(o, indentLevel, parent)
{
	if(typeof indentLevel === "undefined")
		indentLevel = 0;
	let s = "";
	let type;
	let indentString = "<dd>";
	let indentStringParent = "<dd>";
	let indentStringClose = "";
	let indentStringParentClose = "";
	for(let i = 0; i < indentLevel; i++)
	{
		indentString += "<blockquote>";
		indentStringClose += "</blockquote>";
	}
	for(let i = 0; i < indentLevel - 1; i++)
	{
		indentStringParent += "<blockquote>";
		indentStringParentClose += "</blockquote>";
	}
	indentStringClose += "</dd>";
	indentStringParentClose += "</dd>";
	if(parent)
		s = indentStringParent + "<h2>" + parent + "</h2>" + indentStringParentClose;

	for(const prop in o)
	{
		if(o.hasOwnProperty(prop))
		{
			type = Object.prototype.toString.call(o[prop]);
			switch(type)
			{
				case "[object Object]":
					if(indentLevel < 2)
						s += parseObject(o[prop], indentLevel + 1, prop);
					else
						s += indentString + "<em>[object Object],</em><i>too many levels</i>" + indentStringClose;
					break;
				case "[object Array]":
					s += indentString + "<em>" + prop + "</em><i>" + "[" + arrayToString(o[prop]) + "]</i>" + indentStringClose;
					break;
				default:
					s += indentString + "<em>" + prop + "</em><i>" + o[prop] + "</i>" + indentStringClose;
					break;
			}
		}
	}
	return s;
}


export function getPropValueSafe(obj, propName)
{
	const propValue = obj[propName];
	if(propValue)
		return propValue;
	return null;
}
