import { Nimbus } from "./Nimbus";
import { createElement, createElementWithChildren, createLinkInWrapper, unwrapElement, wrapElement, wrapElementInner, unwrapAll } from "./element";
import { hasNonAlphabeticalText, isEmptyElement } from "./elementAndNodeTests";
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

function findSiblingOrParent(elem, siblingSelector, parentSelector)
{
	if(elem.nextElementSibling && elem.nextElementSibling.matches(siblingSelector))
		return elem.nextElementSibling;
	else if(elem.previousElementSibling && elem.previousElementSibling.matches(siblingSelector))
		return elem.previousElementSibling;

	const parent = elem.closest(parentSelector);
	if(parent)
		return parent;

	return null;
}

export function replaceEmptyAnchors(linksByHref)
{
	const emptySpanAnchors = getEmptySpanAnchors();
	const emptyLinkAnchors = getEmptyLinkAnchors();
	const anchors = emptyLinkAnchors.concat(emptySpanAnchors);

	if(!linksByHref)
		linksByHref = createLinksByHrefLookup();

	let numIDsMoved = 0;
	let numIDsRemoved = 0;

	for(let i = 0, ii = anchors.length; i < ii; i++)
	{
		const anchor = anchors[i];
		const linksToAnchor = linksByHref["#" + anchor.id];
		if(linksToAnchor)
		{
			const recipient = findSiblingOrParent(anchor, "a", "p, h1, h2, h3, h4, h5, h6, blockquote, figure, figcaption, aside, dt");
			if(recipient && getTextLength(recipient) > 0)
			{
				if(recipient.id)
				{
					for(let j = 0, jj = linksToAnchor.length; j < jj; j++)
						linksToAnchor[j].setAttribute("href", "#" + recipient.id);
				}
				else
				{
					recipient.id = anchor.id;
				}
				numIDsMoved++;
				unwrapElement(anchor);
			}
			else
			{
				if(linksToAnchor.length === 1)
				{
					if(!linksToAnchor[0].id)
						linksToAnchor[0].id = createUniqueID(i);
					const ref = createLinkInWrapper("reference", anchor.id, "#" + linksToAnchor[0].id, anchor.id);
					anchor.replaceWith(ref);
				}
				else
				{
					const ref = createLinkInWrapper("reference", anchor.id, null, anchor.id);
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

export function moveIdsFromSpans(linksByHref)
{
	const spans = get("span[id]");
	if(!spans)
		return;

	if(!linksByHref)
		linksByHref = createLinksByHrefLookup();

	for(let i = 0, ii = spans.length; i < ii; i++)
	{
		const span = spans[i];
		const recipient = span.querySelector("a") || span.closest("h1, h2, h3, h4, h5, h6, p") || span.nextElementSibling;
		if(recipient)
		{
			if(recipient.id)
			{
				const links = linksByHref["#" + span.id];
				for(let i = 0, ii = links.length; i < ii; i++)
					links[i].setAttribute("href", "#" + recipient.id);
			}
			else
			{
				recipient.id = span.id;
			}
		}
		else
		{
			span.parentNode.appendChild(createLinkInWrapper("reference", span.id, null, span.id));
		}

		if(getTextLength(span) === 0 || span.children.length === span.childNodes.length)
			unwrapElement(span);
		else
			span.removeAttribute("id");
	}
	console.log(`${spans.length} ids removed from spans`);
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
	return /^\d+$/.test(str) || /^[\[\{]\d+[\}\]]$/.test(str) || /^\d+\.$/.test(str);
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
	replaceEmptyAnchors(linksByHref);
	moveIdsFromSpans(linksByHref);
	makeFileLinksRelative();
	const internalLinks = get('a[href^="#"]');
	if(!internalLinks) return;
	const tagsNotToMakeReferencesUnder = new Set([ "REFERENCE", "H1", "H2", "H3", "H4", "H5", "H6", "DT", "DD", "D1", "D2", "D3", "D4" ]);
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
		}

		if(link.parentNode && !tagsNotToMakeReferencesUnder.has(link.parentNode.tagName))
			wrapElement(link, "reference");

		const targetElement = getTargetElement(link);
		if(targetElement)
		{
			if(targetElement.tagName === "A" && !targetElement.getAttribute("href"))
			{
				targetElement.setAttribute("href", "#" + link.id);
				if(targetElement.parentNode && !tagsNotToMakeReferencesUnder.has(targetElement.parentNode.tagName))
					wrapElement(targetElement, "reference");
			}
		}
	}
	const redundantSups = select("sup", "hasChildrenOfType", "reference");
	if(redundantSups)
		for(let i = 0, ii = redundantSups.length; i < ii; i++)
			unwrapElement(redundantSups[i]);
	unwrapAll("reference a sup");
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
			a.${Nimbus.markerClass}::before { content: "id: "attr(id)", name: "attr(name); color: #C90; }
			a.${Nimbus.markerClass}::after { content: attr(href); color: #07C; }
			span.${Nimbus.markerClass} { padding: 0 10px; }
			span.${Nimbus.markerClass}::before { content: attr(id)" "; color: #0C0; }
		`;
		insertStyle(style, 'styleToggleShowEmptyLinksAndSpans', true);
		showMessageBig(`Revealed ${countLinks} empty links and ${countSpans} empty spans`);
	}
}

export function createBackLink(id)
{
	const idLink = "#" + id;
	const linksToId = get(`a[href="${idLink}"]`);
	const backLinkContainer = document.createElement("reference");
	for(let i = 0, ii = linksToId.length; i < ii; i++)
	{
		const link = linksToId[i];
		const linkText = link.textContent;
		const linkId = link.id || createUUID();
		if(!link.id) link.id = linkId;
		const backLink = createElement("a", { href: "#" + linkId, textContent: linkText });
		backLinkContainer.appendChild(backLink);
	}
	if(linksToId.length)
		return backLinkContainer;
	else
		return createBulletAnchor(id);
}

export function logHrefsOnClick(evt)
{
	evt.preventDefault();
	evt.stopPropagation();
	const MAX_DEPTH = 5;
	let link = evt.target.closest("a");
	if(!link)
		return;
	link.classList.add(Nimbus.markerClass);
	const href = link.href;
	if(href)
	{
		const clickedLink = document.createElement("a");
		clickedLink.textContent = clickedLink.href = href;
		const clickedLinkWrapper = createElementWithChildren("h6", clickedLink);
		document.body.appendChild(clickedLinkWrapper);
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
	if(!(links && links.length)) return;
	for(const link of links)
	{
		if(!link.href) continue;
		link.href = trimAt(link.href, "?");
	}
}

export function removeQueryParameterFromLinks(paramName, selector="a[href]")
{
	const links = get(selector);
	for(const link of links)
		link.href = removeQueryParameterFromUrl(link.href, paramName);
}

export function removeAllQueryParametersExcept(paramName, selector="a[href]")
{
	const links = get(selector);
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

export function numberNumericReferencesByInterlinkedGroup()
{
	if(hasDuplicateIDs())
	{
		showMessageError("Document has elements with duplicate IDs");
		return;
	}

	const linksByHref = createLinksByHrefLookup();

	const allLinks = get('reference a[href^="#"]');
	if(!(allLinks && allLinks.length))
		return;

	const links = allLinks.filter(hasNonAlphabeticalText);
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

export function showLinksToIds(selector = "body *[id]")
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
