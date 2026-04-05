import { wrapElementInner } from "./element";
import { showMessageBig, showMessageError } from "./ui";
import { resetHighlightTag, highlightAllMatchesInDocument } from "./highlight";
import { Nimbus } from "./Nimbus";

function getBitCount(num)
{
	return num.toString(2).split('1').length - 1;
}

function clusterNumbers(sortedArr, distance)
{
	const clusters = [];
	let start = 0;

	for (let i = 1; i < sortedArr.length; i++)
	{
		if (sortedArr[i] - sortedArr[start] > distance)
		{
			clusters.push(sortedArr.slice(start, i));
			start = i;
		}
	}

	clusters.push(sortedArr.slice(start));
	return clusters;
}

export function proximitySearch(...args)
{
	if(args.length < 2 || args.length > 6)
	{
		showMessageError("Provide at least two or up to six strings to search for");
		return;
	}

	const elems = document.querySelectorAll("p");
	if(!elems) return;

	const MAX_DISTANCE = 6;
	const HIGHLIGHT_ALL_MATCHES = false;

	const lookups = [];
	const stringsLower = [];
	const matchFlagsByParagraphIndex = {};
	const indexesOfParagraphsWithMatches = [];

	if(HIGHLIGHT_ALL_MATCHES)
	{
		Nimbus.highlightTagName = "markgreen";
		for(const str of args)
		{
			stringsLower.push(str.toLowerCase());
			highlightAllMatchesInDocument(str);
		}
		resetHighlightTag();
	}
	else
	{
		for(const str of args)
			stringsLower.push(str.toLowerCase());
	}

	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const text = elem.textContent.replace(/\s+/g, " ").toLowerCase();
		let mask = 0;
		for(let j = 0, jj = stringsLower.length; j < jj; j++)
			if(text.includes(stringsLower[j]))
				mask |= 1 << j;

		if(mask > 0)
		{
			matchFlagsByParagraphIndex[i] = mask;
			indexesOfParagraphsWithMatches.push(i);
		}
	}

	const matchGroups = clusterNumbers(indexesOfParagraphsWithMatches, MAX_DISTANCE);

	for(const matchGroup of matchGroups)
	{
		let maxBitmask = 0;

		for(const paraIndex of matchGroup)
			maxBitmask |= matchFlagsByParagraphIndex[paraIndex];

		for(const paraIndex of matchGroup)
			matchFlagsByParagraphIndex[paraIndex] = maxBitmask;
	}

	const highlightTagByBitCount = [ "none", "mark", "markyellow", "markwhite", "markpurple", "markblue", "markred" ];

	let allStringsWereFound = false;
	for(const index of Object.keys(matchFlagsByParagraphIndex))
	{
		const bitCount = getBitCount(matchFlagsByParagraphIndex[index]);
		if(bitCount === args.length)
			allStringsWereFound = true;
		const highlightTag = highlightTagByBitCount[bitCount] || "markred";
		wrapElementInner(elems[index], highlightTag);
	}

	if(allStringsWereFound)
	{
		showMessageBig("All strings were found in proximity");
		const highestTag = highlightTagByBitCount[args.length];
		const elem = document.querySelector(highestTag);
		if(elem)
			elem.scrollIntoView();
	}
	else
		showMessageBig("Not all strings were found in proximity");
}
