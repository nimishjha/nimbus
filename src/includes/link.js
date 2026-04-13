import { Nimbus } from "./Nimbus";
import { createElement, createElementWithChildren, createLinkInWrapper, unwrapElement, wrapElement, wrapElementInner, unwrapAll } from "./element";
import { isEmptyElement } from "./elementAndNodeTests";
import { markElement, unmarkAll, getMarkedElements } from "./mark";
import { showMessageBig, showMessageError } from "./ui";
import { get, getOne, del, select, getEmptyLinkAnchors, getEmptySpanAnchors, getFirstBlockParent } from "./selectors";
import { getTextLength } from "./node";
import { trimAt } from "./string";
import { insertStyle } from "./style";
import { STYLES } from "./stylesheets";
import { createUUID, createBulletAnchor, createUniqueID } from "./misc";
import { removeQueryParameterFromUrl } from "./url";
import { annotateElement } from "./dom";
import { hasDuplicateIDs } from "./validations";
import { fixTextAroundReferences } from "./cleanup";
import { REFERENCE_TAGNAME } from "./constants";
import { logError, logInfo } from "./log";

function moveIDToRecipient(anchor, recipient, linksByHref)
{
	if(recipient.id)
	{
		const linksToAnchor = linksByHref["#" + anchor.id];
		if(linksToAnchor)
			for(const link of linksToAnchor)
				link.setAttribute("href", "#" + recipient.id);
	}
	else
	{
		recipient.id = anchor.id;
	}
}

export function moveIDsFromEmptyAnchors(linksByHref)
{
	const emptySpanAnchors = getEmptySpanAnchors();
	const emptyLinkAnchors = getEmptyLinkAnchors();
	const emptyLinkAnchorsRemaining = [];

	if(!linksByHref)
		linksByHref = createLinksByHrefLookup();

	let numIDsMoved = 0;
	let numIDsRemoved = 0;

	for(const link of emptyLinkAnchors)
	{
		const next = link.nextSibling;
		const nextElement = link.nextElementSibling;
		if(next && nextElement && next === nextElement && nextElement.tagName === "A" && getTextLength(next) !== 0)
		{
			moveIDToRecipient(link, next, linksByHref);
			link.remove();
			numIDsMoved++;
		}
		else
		{
			const prev = link.previousSibling;
			const prevElement = link.previousElementSibling;
			if(prev && prevElement && prev === prevElement && prevElement.tagName === "A" && getTextLength(prev) !== 0)
			{
				moveIDToRecipient(link, prev, linksByHref);
				link.remove();
				numIDsMoved++;
			}
			else
			{
				emptyLinkAnchorsRemaining.push(link);
			}
		}
	}

	const anchors = emptyLinkAnchorsRemaining.concat(emptySpanAnchors);

	for(let i = 0, ii = anchors.length; i < ii; i++)
	{
		const anchor = anchors[i];
		const linksToAnchor = linksByHref["#" + anchor.id];
		if(linksToAnchor)
		{
			const recipient = anchor.closest("p, h1, h2, h3, h4, h5, h6, blockquote, figure, figcaption, aside, dt");
			if(recipient && getTextLength(recipient) > 0)
			{
				moveIDToRecipient(anchor, recipient, linksByHref);
				numIDsMoved++;
				unwrapElement(anchor);
			}
			else
			{
				if(linksToAnchor.length === 1)
				{
					if(!linksToAnchor[0].id)
						linksToAnchor[0].id = createUniqueID(i);
					const ref = createLinkInWrapper(REFERENCE_TAGNAME, anchor.id, "#" + linksToAnchor[0].id, anchor.id);
					anchor.replaceWith(ref);
				}
				else
				{
					const ref = createLinkInWrapper(REFERENCE_TAGNAME, anchor.id, null, anchor.id);
					anchor.replaceWith(ref);
				}
				numIDsMoved++;
			}
		}
		else
		{
			unwrapElement(anchor);
			numIDsRemoved++;
		}
	}

	showMessageBig(`${numIDsMoved} IDs moved, ${numIDsRemoved} deleted, ${anchors.length} total`);
}

export function moveIDsFromSpans(linksByHref)
{
	const spans = get("span[id]");
	if(!spans)
		return;

	if(!linksByHref)
		linksByHref = createLinksByHrefLookup();

	for(let i = 0, ii = spans.length; i < ii; i++)
	{
		const span = spans[i];
		const recipient = span.querySelector("a") || span.closest("p, h1, h2, h3, h4, h5, h6") || span.nextElementSibling || span.previousElementSibling;
		if(recipient)
			moveIDToRecipient(span, recipient, linksByHref);
		else
			span.parentNode.appendChild(createLinkInWrapper(REFERENCE_TAGNAME, span.id, null, span.id));

		if(getTextLength(span) === 0 || span.children.length === span.childNodes.length)
			unwrapElement(span);
		else
			span.removeAttribute("id");
	}
	console.log(`${spans.length} ids moved from spans`);
}

export function moveIDsFromImages(linksByHref)
{
	const images = get("img[id]");
	if(!images)
		return;

	if(!linksByHref)
		linksByHref = createLinksByHrefLookup();

	for(const image of images)
	{
		const recipient = image.closest("figure, p, div") || image.nextElementSibling;
		if(recipient)
			moveIDToRecipient(image, recipient, linksByHref);
		else
			image.parentNode.appendChild(createLinkInWrapper(REFERENCE_TAGNAME, image.id, null, image.id));
		image.removeAttribute("id");
	}
	showMessageBig(`${images.length} ids moved from images`);
}

export function getTargetElement(link)
{
	const href = link.getAttribute("href");
	if(href && href.startsWith("#") && href.length > 1)
	{
		const target = document.querySelector(href);
		if(target)
			return target;
	}
	return null;
}

export function looksLikeReference(str)
{
	str = str.trim();
	if(/^\d+$/.test(str) || /^[\[\{]\d+[\}\]]$/.test(str) || /^\d+\.$/.test(str))
		return true;
	if(str.length > 0 && str.length < 4 && /[^A-Za-z0-9]/.test(str))
		return true;
	if(str.length === 1 && /[a-z]/.test(str))
		return true;
	return false;
}

export function fixInternalReferences()
{
	if(hasDuplicateIDs())
	{
		showMessageError("Document has elements with duplicate IDs");
		return;
	}
	deleteUselessLinks();
	const linksByHref = createLinksByHrefLookup();
	removeUnreferencedIDs(linksByHref);
	moveIDsFromEmptyAnchors(linksByHref);
	moveIDsFromSpans(linksByHref);
	moveIDsFromImages(linksByHref);
	makeFileLinksRelative();
	const internalLinks = get('a[href^="#"]');
	if(!internalLinks) return;
	const tagsNotToMakeReferencesUnder = new Set([ REFERENCE_TAGNAME, "H1", "H2", "H3", "H4", "H5", "H6", "DT", "DD", "D1", "D2", "D3", "D4" ]);
	for(let i = 0, ii = internalLinks.length; i < ii; i++)
	{
		const link = internalLinks[i];

		if(!link.id)
			link.id = createUniqueID(i);

		let refText = link.textContent;
		if(looksLikeReference(refText))
		{
			refText = refText.replace(/[^0-9]+/g, "");
			if(!refText.length)
				refText = "0" + i;
			link.textContent = refText;

			if(link.parentNode && !tagsNotToMakeReferencesUnder.has(link.parentNode.tagName))
				wrapElement(link, REFERENCE_TAGNAME);
		}

		const targetElement = getTargetElement(link);
		if(targetElement)
		{
			if(targetElement.tagName === "A" && !targetElement.getAttribute("href"))
			{
				targetElement.setAttribute("href", "#" + link.id);
				if(targetElement.parentNode && !tagsNotToMakeReferencesUnder.has(targetElement.parentNode.tagName))
					wrapElement(targetElement, REFERENCE_TAGNAME);
			}
		}
	}
	const redundantSups = select("sup", "hasChildrenOfType", REFERENCE_TAGNAME);
	if(redundantSups)
		for(let i = 0, ii = redundantSups.length; i < ii; i++)
			unwrapElement(redundantSups[i]);
	unwrapAll(REFERENCE_TAGNAME + " a sup");
	fixTextAroundReferences();
}

export function revealLinkAttributes()
{
	insertStyle(STYLES.REVEAL_LINK_ATTRIBUTES, "styleRevealLinkAttributes", true);
}

export function humanizeUrl(url)
{
	const matches = url.match(/[0-9A-Za-z_\-\+]+/g);
	if(!matches)
		return url;
	let i = matches.length;
	let longestMatch = matches[i - 1];
	while(i--)
		if(matches[i].length > longestMatch.length)
			longestMatch = matches[i];
	return longestMatch;
}

export function revealEmptyLinks()
{
	const links = get("a");
	for(const link of links)
	{
		if(isEmptyElement(link))
		{
			if(link.id)
				annotateElement(link, "a1", link.id);
			if(link.href)
				annotateElement(link, "a2", link.getAttribute("href"));
			if(link.name)
				annotateElement(link, "a3", link.name);
		}
	}
}

export function deleteUselessLinks()
{
	const links = Array.from(document.links);
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		if(isEmptyElement(link) && !link.id && !link.name)
			unwrapElement(link);
	}
}

export function toggleShowEmptyLinksAndSpans()
{
	if(getOne("#styleToggleShowEmptyLinksAndSpans"))
	{
		del("#styleToggleShowEmptyLinksAndSpans");
		unmarkAll();
		return;
	}
	const links = get("a");
	let countLinks = 0;
	let countSpans = 0;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		if(isEmptyElement(link))
		{
			if(!link.id && !link.name)
			{
				unwrapElement(link);
			}
			else
			{
				countLinks++;
				markElement(link);
			}
		}
	}
	const spans = get("span");
	for(let i = 0, ii = spans.length; i < ii; i++)
	{
		const span = spans[i];
		if(isEmptyElement(span))
		{
			if(!span.id)
			{
				unwrapElement(span);
			}
			else
			{
				countSpans++;
				markElement(span);
			}
		}
	}
	if(countLinks + countSpans === 0)
	{
		showMessageBig(`No empty links or spans`);
	}
	else
	{
		const style = `
			a.${Nimbus.markerClass} { padding: 0 5px; }
			a.${Nimbus.markerClass}::before { content: attr(id);  padding: 1px 5px; background: #000; color: #C0A; font-weight: bold; }
			a.${Nimbus.markerClass}::after { content: attr(href); padding: 1px 5px; background: #000; color: #07C; }
			span.${Nimbus.markerClass} { padding: 0 10px; }
			span.${Nimbus.markerClass}::before { content: attr(id)" "; color: #0C0; }
		`;
		insertStyle(style, 'styleToggleShowEmptyLinksAndSpans', true);
		showMessageBig(`Revealed ${countLinks} empty links and ${countSpans} empty spans`);
	}
}

export function logHrefsOnClick(evt)
{
	evt.preventDefault();
	evt.stopPropagation();
	const link = evt.target.closest("a");
	if(link)
	{
		link.classList.add(Nimbus.markerClass);
		if(link.href)
			document.body.appendChild(createLinkInWrapper("h6", link.href, link.href));
	}
	return false;
}

//	Useful when you want to grab a bunch of links from a webpage (to pass to a download manager, for instance)
export function enableClickToCollectUrls()
{
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
		links[i].setAttribute("onclick", "return false");
	document.body.addEventListener("mouseup", logHrefsOnClick);
	showMessageBig("Clicking links will now log their hrefs");
}

export function disableClickToCollectUrls()
{
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
		links[i].removeAttribute("onclick");
	document.body.removeEventListener("mouseup", logHrefsOnClick);
	showMessageBig("Clicking links will now work normally");
}

//	When saving webpages that have internal links (to references/footnotes or images),
//	the browser converts those links to absolute URLs (with "file:///"). If you then move
//	the saved HTML files to a new location, all those links break. This function makes those links relative.
export function makeFileLinksRelative()
{
	const links = get("a");
	let hashCount = 0;
	let imageCount = 0;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		const linkHref = link.href;
		if(linkHref && linkHref.indexOf("file:///") === 0)
		{
			if(~linkHref.indexOf("#"))
			{
				const splitHref = linkHref.split("#");
				if(splitHref.length)
				{
					const hash = "#" + splitHref[splitHref.length - 1];
					link.setAttribute("href", hash);
					hashCount++;
				}
			}
			else if(~linkHref.indexOf("/images/"))
			{
				const splitHref = linkHref.split("/");
				const folderName = splitHref[splitHref.length - 2];
				const imageFileName = splitHref[splitHref.length - 1];
				link.setAttribute("href", folderName + "/" + imageFileName);
				imageCount++;
			}
		}
	}
	showMessageBig(`${hashCount} hash links and ${imageCount} image links fixed`);
}

export function removeQueryStringFromLinks()
{
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		link.href = trimAt(link.href, "?");
	}
}

export function removeQueryStringFromLinksMatching(text)
{
	const links = get(`a[href*=${text}]`);
	if(links)
		for(const link of links)
			if(link.href)
				link.href = trimAt(link.href, "?");
}

export function removeQueryParameterFromLinks(paramName, selector="a[href]")
{
	const links = get(selector);
	if(links)
		for(const link of links)
			link.href = removeQueryParameterFromUrl(link.href, paramName);
}

export function removeAllQueryParametersExcept(paramName, selector="a[href]")
{
	const links = get(selector);
	if(links)
		for(const link of links)
			link.href = removeQueryParameterFromUrl(link.href, paramName, true);
}

export function createLinksByHrefLookup()
{
	const links = get('a[href^="#"]');
	const linksByHref = {};
	if(links)
	{
		for(const link of links)
		{
			const href = link.getAttribute("href");
			if(linksByHref[href])
				linksByHref[href].push(link);
			else
				linksByHref[href] = [link];
		}
	}
	return linksByHref;
}

function getReferenceLinks()
{
	const filterFunc = elem => looksLikeReference(elem.textContent);
	const allLinks = get(REFERENCE_TAGNAME + ' a[href^="#"]');
	if(allLinks)
		return allLinks.filter(filterFunc);
	return false;
}

export function numberReferencesByInterlinkedGroup()
{
	if(hasDuplicateIDs())
	{
		showMessageError("Document has elements with duplicate IDs");
		return;
	}

	const linksByHref = createLinksByHrefLookup();

	const links = getReferenceLinks();
	if(!(links && links.length))
		return;

	const seen = new Set();
	const groups = [];
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		if(seen.has(link))
			continue;
		seen.add(link);

		const group = new Set();
		const href = link.getAttribute("href");

		group.add(link);
		const targetId = href.substring(1);
		const targetElem = document.getElementById(targetId);
		if(targetElem && targetElem.tagName === "A")
		{
			group.add(targetElem);
			seen.add(targetElem);
		}

		if(link.id)
		{
			const linksToThisAnchor = linksByHref["#" + link.id];
			if(linksToThisAnchor && linksToThisAnchor.length)
			{
				for(const backlink of linksToThisAnchor)
				{
					group.add(backlink);
					seen.add(backlink);
				}
			}
		}

		const groupLinks = Array.from(group);
		if(groupLinks.length)
			groups.push(groupLinks);
	}

	let count = 0;
	for(let i = 0, ii = groups.length; i < ii; i++)
	{
		for(const link of groups[i])
		{
			count++;
			link.textContent = (i + 1).toString();
		}
	}

	showMessageBig(`${groups.length} groups found; ${count} links fixed`);
}

export function markBrokenInternalLinks()
{
	const links = document.querySelectorAll('a[href^="#"]');
	let count = 0;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		const href = link.getAttribute("href");
		if(href === null || href.length < 2)
			continue;
		const target = document.getElementById(href.slice(1));
		if(target === null)
		{
			link.className = Nimbus.markerClass;
			count++;
		}
	}
	if(count)
		showMessageBig(`${count} broken internal links marked`);
	else
		showMessageBig("No broken internal links");
}

export function removeUnreferencedIDs(linksByHref)
{
	const anchors = document.querySelectorAll('body *[id]');
	if(!linksByHref)
		linksByHref = createLinksByHrefLookup();

	let count = 0;
	for(let i = 0, ii = anchors.length; i < ii; i++)
	{
		const anchor = anchors[i];
		const links = linksByHref["#" + anchor.id];
		if(!links)
		{
			anchor.removeAttribute("id");
			count++;
		}
	}

	if(count)
		showMessageBig(`${count} unreferenced IDs removed`);
	else
		showMessageBig("No unreferenced anchors");
}

export function showLinksToIDs(selector = "body *[id]")
{
	const elems = document.querySelectorAll(selector);
	const linksByHref = createLinksByHrefLookup();

	let numIDsWithLinks = 0;
	let numLinks = 0;

	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(!elem.id)
			continue;
		const id = "#" + elem.id;
		const links = linksByHref[id];
		if(links)
		{
			numIDsWithLinks++;
			numLinks += links.length;
			for(let j = 0, jj = links.length; j < jj; j++)
			{
				const link = links[j];
				if(!link.id)
					link.id = `b${numIDsWithLinks}_${j}`;
				if(elem.tagName === "A")
					elem.insertAdjacentElement("afterend", createLinkInWrapper("x", `${link.textContent}`, "#" + link.id))
				else
					elem.appendChild(createLinkInWrapper("x", `${link.textContent}`, "#" + link.id));
			}
		}
	}
	showMessageBig(`${numIDsWithLinks} ids have ${numLinks} links`);
}

export function interlinkMarkedElements()
{
	const elems = getMarkedElements();
	if(!elems || elems.length !== 2)
	{
		showMessageError("Expected two marked elements");
		return;
	}

	if(!elems[0].querySelector("a"))
		wrapElementInner(elems[0], "a");
	if(!elems[1].querySelector("a"))
		wrapElementInner(elems[1], "a");

	const link1 = elems[0].querySelector("a");
	const link2 = elems[1].querySelector("a");

	link1.id = "link" + createUniqueID(Math.floor(Math.random() * 1000));
	link2.id = link1.id + "b";
	link1.setAttribute("href", "#" + link2.id);
	link2.setAttribute("href", "#" + link1.id);

	unmarkAll();
}

export function relinkTableOfContents(linksSelector = ".markd", headingsSelector = "h1, h2, h3, h4, h5, h6")
{
	function normalizeText(str)
	{
		return str.toLowerCase().trim()
			.replaceAll("chapter", "")
			.replace(/[^A-Za-z]+/g, "");
	}

	const links = get(linksSelector);
	const headings = get(headingsSelector);
	if(!(links && headings))
	{
		showMessageError("Failed to get one or both of links and headings");
		return;
	}

	if(links[0].tagName !== "A")
	{
		showMessageError(`Expected <a>, found ${links[0].tagName}`);
		return;
	}

	const headingsByText = {};
	for(const heading of headings)
		headingsByText[normalizeText(heading.textContent)] = heading;

	let numLinksFixed = 0;
	let numHeadingNotFound = 0;

	for(const link of links)
	{
		const linkTextLower = normalizeText(link.textContent);
		const heading = headingsByText[linkTextLower];
		if(heading)
		{
			if(!heading.id)
				heading.id = createUniqueID(normalizeText(heading.textContent));
			link.setAttribute("href", "#" + heading.id);
			link.className = "statusOk";
			numLinksFixed++;
		}
		else
		{
			link.className = "statusError";
			numHeadingNotFound++;
			logError(`Did not find heading with normalized text ${linkTextLower}`);
		}
	}

	if(numHeadingNotFound > 0)
	{
		logInfo("headingsByText:", Object.keys(headingsByText).join(", "));
	}

	showMessageBig(`${numLinksFixed} links fixed, ${numHeadingNotFound} headings not found`);
}
