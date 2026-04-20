import { get } from "./selectors";
import { emptyElement } from "./element";
import { getTextNodesUnderElement } from "./xpath";
import { logError } from "./log";
import { snakeCaseToCamelCase } from "./text";

export function replaceBrsInPres()
{
	const brs = document.querySelectorAll("pre br");
	for(const br of brs)
		br.replaceWith(document.createTextNode("\n"));
}

export function tabifySpacesInPres()
{
	const pres = document.querySelectorAll("pre");
	const REGEX_MULTIPLE_CONSECUTIVE_SPACES_AFTER_NEWLINE = /\n {2,}/;
	const REGEX_MULTIPLE_CONSECUTIVE_SPACES_AFTER_NEWLINE_GLOBAL = /\n {2,}/g;

	for(const pre of pres)
	{
		pre.normalize();

		const indentsSet = new Set();
		const nodes = getTextNodesUnderElement(pre);
		let isIndentedWithSpaces = false;
		for(const node of nodes)
		{
			if(REGEX_MULTIPLE_CONSECUTIVE_SPACES_AFTER_NEWLINE.test(node.data))
			{
				isIndentedWithSpaces = true;
				const matches = node.data.match(REGEX_MULTIPLE_CONSECUTIVE_SPACES_AFTER_NEWLINE_GLOBAL);
				for(const match of matches)
					indentsSet.add(match.length - 1);
			}
		}

		if(isIndentedWithSpaces)
		{
			const indents = Array.from(indentsSet);
			const smallestIndent = Math.min(...indents);
			if(isNaN(smallestIndent))
				logError("smallestIndent is NaN, this should never happen");
			else
			{
				const spacesPerIndent = " ".repeat(smallestIndent);
				for(const node of nodes)
					node.data = node.data.replaceAll(spacesPerIndent, "\t");
			}
		}
	}
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

export function replaceLineBreaksInPres()
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

export function collapseMultipleLineBreaksInPres()
{
	const elems = get("pre");
	if(!elems) return;
	for(const elem of elems)
		elem.textContent = elem.textContent.replace(/\n+/g, "\n").trim();
}
