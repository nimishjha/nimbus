import { Nimbus } from "./Nimbus";
import { showMessageBig } from "./ui";
import { get, getOne, del } from "./selectors";
import { setDocTitle, sanitizeTitle, getTitleWithoutDomainTag } from "./cleanup";
import { containsAnyOfTheStrings, trimAt, startsWithAnyOfTheStrings } from "./string";
import { parseQueryString } from "./url";
import { getPrevious, getNext } from "./array";
import { deleteEmptyHeadings } from "./delete";
import { markElement, unmarkAll } from "./mark";

export function changePageByUrl(direction)
{
	const url = window.location.href;
	const urlPageMatch = url.match(/page\/[0-9]+/);
	if(urlPageMatch)
	{
		let page = parseInt(urlPageMatch[0].split('/')[1], 10);
		let currentPage = page;
		switch(direction)
		{
			case "previous": page--; break;
			case "next": page++; break;
		}
		if(page < 1)
			page = 1;
		showMessageBig(`Found page ${currentPage} in URL, Going to page ${page}`);
		const newUrl = url.replace(urlPageMatch[0], `page/${page}`);
		console.log(newUrl);
		location.href = newUrl;
		return true;
	}

	const queryParams = parseQueryString(url);
	if(!queryParams)
		return false;
	let found = false;
	let page;
	let currentPage;
	for(let i = 0, ii = queryParams.length; i < ii; i++)
	{
		if(["page", "p"].includes(queryParams[i].key))
		{
			found = true;
			page = parseInt(queryParams[i].value, 10);
			currentPage = page;
			switch(direction)
			{
				case "previous": page--; break;
				case "next": page++; break;
			}
			if(page < 1)
				page = 1;
			queryParams[i].value = page;
			break;
		}
	}
	if(found)
	{
		showMessageBig(`Found page ${currentPage} in query string, going to page ${page}`);
		let newQueryString = "";
		for(let i = 0, ii = queryParams.length; i < ii; i++)
			newQueryString += `${queryParams[i].key}=${queryParams[i].value}&`;
		let baseUrl = trimAt(url, "?");
		const newUrl = `${baseUrl}?${newQueryString}`;
		location.href = newUrl.substring(0, newUrl.length - 1);
		return true;
	}
	return false;
}

export function changePage(direction)
{
	const canChangePageByUrl = changePageByUrl(direction);
	if(canChangePageByUrl)
		return;
	const links = get("a");
	let matchStrings = [];
	if(direction === "previous")
		matchStrings = ["previous", "previous", "previouspage", "\u00AB", "\u2190"];
	else if(direction === "next")
		matchStrings = ["next", "nextpage", "\u00BB", "\u25BA", "\u2192"];

	let i = links.length;
	while(i--)
	{
		const link = links[i];
		let linkText = link.textContent;
		if(linkText)
		{
			linkText = linkText.replace(/[^a-zA-Z0-9\u00AB\u00BB\u25BA]/g, "").toLowerCase();
			if(matchStrings.includes(linkText) || containsAnyOfTheStrings(linkText, matchStrings))
			{
				link.innerHTML = "<mark>" + link.innerHTML + "</mark>";
				location.href = link.href;
				return;
			}
		}
	}
}

function filterHeadings(headings)
{
	if(!headings.length)
		return null;
	const filteredHeadings = [];
	for(let i = 0, ii = headings.length; i < ii; i++)
	{
		const heading = headings[i];
		if(!startsWithAnyOfTheStrings(heading.textContent, ["Share", "Comments"]))
			filteredHeadings.push(heading);
	}
	return filteredHeadings;
}

export function cycleThroughDocumentHeadings()
{
	const MAX_HEADINGS = 5;
	deleteEmptyHeadings();
	Nimbus.currentHeadingText = getTitleWithoutDomainTag();
	del(Nimbus.HEADING_CONTAINER_TAGNAME + " h1");
	const headings = filterHeadings(get("h1, h2"));
	const candidateHeadingTexts = [];
	if(headings && headings.length)
	{
		for(let i = 0, ii = Math.min(MAX_HEADINGS, headings.length); i < ii; i++)
		{
			const heading = headings[i];
			if(heading.classList.contains("currentHeading"))
				continue;
			const text = sanitizeTitle(heading.textContent);
			if(text.length && !candidateHeadingTexts.includes(text))
				candidateHeadingTexts.push(text);
		}
	}
	if(candidateHeadingTexts.length && Nimbus.currentHeadingText)
		Nimbus.currentHeadingText = getNext(Nimbus.currentHeadingText, candidateHeadingTexts);

	const pageNumberStrings = document.body.textContent.match(/Page [0-9]+ of [0-9]+/);
	if(pageNumberStrings && !/Page [0-9]+/i.test(Nimbus.currentHeadingText))
		Nimbus.currentHeadingText = Nimbus.currentHeadingText + " - " + pageNumberStrings[0];
	setDocTitle(Nimbus.currentHeadingText);
	return Nimbus.currentHeadingText;
}

export function goToNextElement(selector)
{
	const config = Nimbus.goToNextElement;
	if(selector)
	{
		config.selector = selector;
		config.elements = get(selector);
		if(config.elements.length)
		{
			config.currentElement = config.elements[0];
			config.currentElement.scrollIntoView();
		}
	}
	else
	{
		const elementToScrollTo = getNext(config.currentElement, config.elements);
		if(elementToScrollTo)
		{
			config.currentElement = elementToScrollTo;
			elementToScrollTo.scrollIntoView();
		}
	}
}

export function goToPrevElement(selector)
{
	const config = Nimbus.goToNextElement;
	if(selector)
	{
		config.selector = selector;
		config.elements = get(selector);
		if(config.elements.length)
		{
			config.currentElement = config.elements[0];
			config.currentElement.scrollIntoView();
		}
	}
	else
	{
		const elementToScrollTo = getPrevious(config.currentElement, config.elements);
		if(elementToScrollTo)
		{
			config.currentElement = elementToScrollTo;
			elementToScrollTo.scrollIntoView();
		}
	}
}

export function goToLastElement(selector)
{
	const config = Nimbus.goToNextElement;
	if(selector)
	{
		config.selector = selector;
		config.elements = get(selector);
		if(config.elements.length)
		{
			config.currentElement = config.elements[config.elements.length - 1];
			config.currentElement.scrollIntoView();
		}
	}
}
