import { get } from "./selectors";
import { emptyElement } from "./element";

export function preReplaceBrs()
{
	const brs = document.querySelectorAll("pre br");
	for(let i = 0, ii = brs.length; i < ii; i++)
	{
		const br = brs[i];
		br.parentNode.replaceChild(document.createTextNode("\n"), br);
	}
}

export function preTabifySpaces()
{
	const pres = get("pre");
	for(const pre of pres)
	{
		let s = pre.innerHTML;
		if(/\n  [^ ]/.test(s))
			s = s.replace(/ {2}/g, "\t");
		else if(/\n   [^ ]/.test(s))
			s = s.replace(/ {3}/g, "\t");
		else if(/\n    [^ ]/.test(s))
			s = s.replace(/ {4}/g, "\t");
		else
			s = s.replace(/ {4}/g, "\t");
		pre.innerHTML = s;
	}
}

function snakeCaseToCamelCase(snakeCase)
{
	const splat = snakeCase.split("_");
	if(!splat || !splat.length) return snakeCase;
	let camelCase = splat[0];
	for(let i = 1, ii = splat.length; i < ii; i++)
	{
		const segment = splat[i];
		if(!(segment && typeof segment === "string")) return snakeCase;
		camelCase += segment[0].toUpperCase() + segment.substring(1);
	}
	return camelCase;
}

export function preSnakeCaseToCamelCase()
{
	const elems = get("pre");
	if(elems)
	{
		for(const elem of elems)
		{
			const matches = elem.textContent.match(/\b\w+_\w+\b/g);
			if(matches === null) continue;
			for(const match of matches)
			{
				if(!/[a-z]/.test(match)) continue;
				const camelCased = snakeCaseToCamelCase(match);
				elem.textContent = elem.textContent.replaceAll(match, camelCased);
			}
		}
	}
}

export function preMakeDivsFromLineBreaks()
{
	const pres = get("pre");
	for(const pre of pres)
	{
		const wrapper = document.createDocumentFragment();
		const lines = pre.textContent.split("\n");

		for(const line of lines)
		{
			const lineDiv = document.createElement("div");
			lineDiv.textContent = line;
			wrapper.appendChild(lineDiv);
		}

		emptyElement(pre);
		pre.appendChild(wrapper);
	}
}

export function preRemoveMultiLineBreaks()
{
	const elems = get("pre");
	if(!elems) return;
	for(const elem of elems)
		elem.textContent = elem.textContent.replace(/\n+/g, "\n").trim();
}
