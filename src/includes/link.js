import { Nimbus } from "./Nimbus";
import { createElement, createElementWithChildren, unwrapElement, wrapElement, unwrapAll } from "./element";
import { hasNonAlphabeticalText } from "./elementAndNodeTests";
import { markElement, unmarkAll } from "./mark";
import { showMessageBig, showMessageError } from "./ui";
import { get, getOne, del, select, getLinkAnchors, getSpanAnchors, getLinksToId, getFirstBlockParent } from "./selectors";
import { getTextLength } from "./node";
import { trimAt } from "./string";
import { insertStyle } from "./style";
import { STYLES } from "./stylesheets";
import { createUUID, createBulletAnchor } from "./misc";
import { removeQueryParameterFromUrl } from "./url";
import { annotateElement } from "./dom";
import { doDuplicateIDsExist } from "./validations";

export function createUniqueId(index)
{
	let prefix = "a";
	while(get("#" + prefix + index))
		prefix += "a";
	return prefix + index;
}

export function replaceEmptyAnchors()
{
	const anchors = getLinkAnchors().concat(getSpanAnchors());
	const parentsAndLinks = [];
	const anchorsWithoutLinks = [];
	for(let i = 0, ii = anchors.length; i < ii; i++)
	{
		const anchor = anchors[i];
		const linksToAnchor = getLinksToId(anchor.id);
		if(!linksToAnchor.length)
		{
			anchorsWithoutLinks.push(anchor);
		}
		else
		{
			const parent = getFirstBlockParent(anchor);
			if(!parent.id) parent.id = createUniqueId(i);
			if(linksToAnchor.length) parentsAndLinks.push({ anchor, parent, linksToAnchor });
		}
	}

	let numLinks = 0;
	for(let i = 0, ii = parentsAndLinks.length; i < ii; i++)
	{
		const anchorData = parentsAndLinks[i];
		const links = anchorData.linksToAnchor;
		numLinks += links.length;
		for(let i = 0, ii = links.length; i < ii; i++)
			links[i].setAttribute("href", "#" + anchorData.parent.id);
		unwrapElement(anchorData.anchor);
	}

	for(const anchor of anchorsWithoutLinks)
		unwrapElement(anchor);

	showMessageBig(`Fixed ${numLinks} links to ${parentsAndLinks.length} anchors; deleted ${anchorsWithoutLinks.length} anchors without links`);
}

export function moveIdsFromSpans()
{
	const spans = get("span[id]");
	if(!spans) return;
	for(const span of spans)
	{
		const recipient = span.closest("h1, h2, h3, h4, h5, h6, p") || span.nextElementSibling;
		if(recipient && !recipient.id)
		{
			recipient.id = span.id;
			if(getTextLength(span) === 0)
				span.remove();
		}
		else
		{
			const repl = document.createElement("cite");
			repl.textContent = "\u2022";
			repl.id = span.id;
			if(getTextLength(span) === 0)
				span.parentNode.replaceChild(repl, span);
			else
				span.insertAdjacentElement("beforebegin", repl);
		}
	}
}

export function fixInternalReferences()
{
	if(doDuplicateIDsExist())
	{
		showMessageError("Document has elements with duplicate IDs");
		return;
	}
	moveIdsFromSpans();
	replaceEmptyAnchors();
	makeFileLinksRelative();
	const internalLinks = get('a[href^="#"]');
	if(!internalLinks) return;
	const tagsNotToMakeReferencesUnder = {
		"REFERENCE": true,
		"H1": true,
		"H2": true,
		"H3": true,
		"H4": true,
		"H5": true,
		"H6": true,
	};
	const regexIsNumeric = /^\[\d+\]$/;
	const regexIsNumberInBraces = /^\{\d+\}$/;
	const regexIsNumericWithPeriod = /\d+\.$/;
	for(let i = 0, ii = internalLinks.length; i < ii; i++)
	{
		const link = internalLinks[i];
		let refText = link.textContent.trim();
		if(regexIsNumeric.test(refText) || regexIsNumberInBraces.test(refText) || regexIsNumericWithPeriod.test(refText))
			refText = refText.replace(/[^0-9]+/g, "");
		if(!refText.length)
			refText = "0" + i;
		link.textContent = refText;
		if(link.parentNode && !tagsNotToMakeReferencesUnder[link.parentNode.tagName])
			wrapElement(link, "reference");
	}
	const redundantSups = select("sup", "hasChildrenOfType", "reference");
	if(redundantSups)
		for(let i = 0, ii = redundantSups.length; i < ii; i++)
			unwrapElement(redundantSups[i]);
	unwrapAll("reference a sup");
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

export function isEmptyLink(link) { return !(getTextLength(link) || link.getElementsByTagName("img").length); }

export function revealEmptyLinks()
{
	const links = get("a");
	for(const link of links)
	{
		if(isEmptyLink(link))
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
		if(isEmptyLink(link))
		{
			countLinks++;
			markElement(link);
		}
	}
	const spans = get("span");
	for(let i = 0, ii = spans.length; i < ii; i++)
	{
		const span = spans[i];
		if(!(span.textContent.length || span.getElementsByTagName("img").length))
		{
			countSpans++;
			markElement(span);
		}
	}
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
	wrapElement(link, Nimbus.highlightTagName);
	const href = link.href;
	if(href)
	{
		const clickedLink = createElement("a", { textContent: href, href: href });
		if(link.textContent)
			clickedLink.textContent += " " + link.textContent;
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
