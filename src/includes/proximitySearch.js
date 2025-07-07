import { Nimbus } from "./Nimbus";
import { createElement, createElementWithChildren } from "./element";
import { showMessageBig, showMessageError } from "./ui";
import { get, getOne, del } from "./selectors";
import { insertStyleHighlight } from "./style";
import { resetHighlightTag, highlightAllMatchesInDocument } from "./highlight";

function createExcerpt(elem)
{
	const excerpt = document.createElement("p");
	const temp = elem.cloneNode(true);
	while(temp.firstChild)
		excerpt.appendChild(temp.firstChild);
	return excerpt;
}

export function findStringsInProximity(stringOne, stringTwo)
{
	if(!(typeof stringOne === "string" && typeof stringTwo === "string"))
	{
		showMessageError("Two strings are required");
		return;
	}
	del("#proximateSearchResults");
	insertStyleHighlight();
	Nimbus.highlightTagName = "markgreen";
	highlightAllMatchesInDocument(stringOne);
	Nimbus.highlightTagName = "markblue";
	highlightAllMatchesInDocument(stringTwo);
	resetHighlightTag();

	const stringOneLower = stringOne.toLowerCase();
	const stringTwoLower = stringTwo.toLowerCase();
	const BRACKET_SIZE = 2;
	const createBracketKey = (n) => Math.round(n / BRACKET_SIZE) * BRACKET_SIZE;
	const paras = get("p, blockquote, li");
	if(!paras) return;
	const lookup1 = {};
	const lookup2 = {};
	for(let i = 0, ii = paras.length; i < ii; i++)
	{
		const para = paras[i];
		para.id = `p${i}`;
		const paraText = para.textContent.toLowerCase().replace(/\s+/g, " ");
		if(~paraText.indexOf(stringOneLower))
		{
			const bracket = 'p' + createBracketKey(i);
			if(!lookup1[bracket])
				lookup1[bracket] = i;
		}
		if(~paraText.indexOf(stringTwoLower))
		{
			const bracket = 'p' + createBracketKey(i);
			if(!lookup2[bracket])
				lookup2[bracket] = i;
		}
	}

	function getIndex(lookup, key, keyPrev, keyNext)
	{
		if(typeof lookup[keyPrev] === "number")
			return lookup[keyPrev];
		if(typeof lookup[key] === "number")
			return lookup[key];
		if(typeof lookup[keyNext] === "number")
			return lookup[keyNext];
		return false;
	}

	const keys = Object.keys(lookup1);
	if(!keys.length)
		return;

	const resultsWrapper = createElement("div", { id: "proximateSearchResults" } );
	resultsWrapper.appendChild(createElement( "h2", { textContent: `Proximity search results for "${stringOne}" and "${stringTwo}"` } ));
	const resultsList = document.createElement("ol");
	const seen = new Set();
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		const stringOneParagraphIndex = lookup1[key];
		const keyPrev = "p" + createBracketKey(Math.max(0, stringOneParagraphIndex - BRACKET_SIZE));
		const keyNext = "p" + createBracketKey(stringOneParagraphIndex + BRACKET_SIZE);
		const stringTwoParagraphIndex = getIndex(lookup2, key, keyPrev, keyNext);
		if(stringTwoParagraphIndex !== false)
		{
			const firstIndex = Math.min(stringOneParagraphIndex, stringTwoParagraphIndex);
			if(seen.has(firstIndex)) continue;
			const secondIndex = Math.max(stringOneParagraphIndex, stringTwoParagraphIndex);
			if(seen.has(secondIndex)) continue;
			seen.add(firstIndex);
			seen.add(secondIndex);
			const areSeparateParagraphs = firstIndex !== secondIndex;
			const firstExcerpt = createExcerpt(getOne("#p" + firstIndex))
			const secondExcerpt = createExcerpt(getOne("#p" + secondIndex))
			const resultsListItem = document.createElement("li");
			const link = createElement("a", { textContent: firstIndex, href: "#p" + firstIndex });
			const result = areSeparateParagraphs ? createElementWithChildren("blockquote", link, firstExcerpt, secondExcerpt) : createElementWithChildren("blockquote", link, firstExcerpt);
			resultsListItem.appendChild(result);
			resultsList.appendChild(resultsListItem);
		}
	}
	resultsWrapper.appendChild(resultsList);
	document.body.insertBefore(resultsWrapper, document.body.firstChild);
	window.scrollTo(0, 0);
}
