import { createElement } from "./element";
import { showMessage, showMessageBig } from "./ui";
import { containsAnyOfTheStrings, normalizeString, trimAt } from "./string";
import { markElement } from "./mark";
import { insertStyle, toggleStyle, toggleWebsiteSpecificStyle } from "./style";
import { looksLikeUrl } from "./misc";
import { wrapElement, deleteClass, cycleClass, createElementWithChildren } from "./element";
import { get, getOne, del, selectByRelativePosition } from "./selectors";
import { cleanupStackOverflow } from "./cleanup";
import { runCommand } from "./command";
import { STYLES } from "./stylesheets";

export function logout()
{
	switch(location.hostname)
	{
		case 'mail.google.com':
		case 'accounts.google.com':
			location.href = 'https://accounts.google.com/Logout';
			return;
	}
	let found = false;
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const node = links[i];
		if(node.href)
		{
			const s = normalizeString(node.href);
			if(~s.indexOf("logout") && s.indexOf("logout_gear") === -1 || ~s.indexOf("signout"))
			{
				found = true;
				showMessageBig(node.href);
				markElement(node);
				node.click();
				break;
			}
		}
		if(node.textContent)
		{
			const s = normalizeString(node.textContent);
			if(~s.indexOf("logout") || ~s.indexOf("signout"))
			{
				found = true;
				showMessageBig(node.href);
				markElement(node);
				node.click();
				break;
			}
		}
	}
	if(!found)
	{
		const inputsButtons = document.querySelectorAll("input, button");
		for(let i = 0, ii = inputsButtons.length; i < ii; i++)
		{
			const element = inputsButtons[i];
			const s = normalizeString(element.value || element.textContent);
			if(s.indexOf("logout") >= 0 || s.indexOf("signout") >= 0)
			{
				found = true;
				showMessageBig("Logging out...");
				markElement(element);
				element.click();
				break;
			}
		}
	}
	if(!found)
		showMessageBig("Logout link not found");
}

export function showPrintLink()
{
	let i, found = false;
	const e = get("a");
	i = e.length;
	while(i--)
	{
		const href = e[i].href;
		if(href && href.toLowerCase().indexOf("print") >= 0)
		{
			found = true;
			const printLink = createElement("a", { href: href, textContent: "Print" });
			document.body.insertBefore(createElementWithChildren("h2", printLink), document.body.firstChild);
			printLink.focus();
			break;
		}
	}
	if(!found)
		showMessageBig("Print link not found");
}

export function getCurrentlyPlayingVideo(videos)
{
	for(const video of videos) {
		if(!video.paused)
			return video;
	}
}

export function toggleNonVideoContent()
{
	if(get("#styleHNVC")) unhideNonVideoContent();
	else hideNonVideoContent();
}

export function hideNonVideoContent()
{
	const videos = get("video");
	if(videos && videos.length)
	{
		const mainVideo = getCurrentlyPlayingVideo(videos);
		if(!mainVideo)
		{
			showMessageBig("Could not find currently playing video");
			return;
		}
		const elemsFollowing = selectByRelativePosition(mainVideo, "after");
		for(const elem of elemsFollowing)
			elem.classList.add("nimbusHide");
		const elemsPreceding = selectByRelativePosition(mainVideo, "before");
		for(const elem of elemsPreceding)
			elem.classList.add("nimbusHide");
	}
	const style = `
		.nimbusHide { opacity: 0; }
		div { background-image: none; }
	`;
	insertStyle(style, "styleHNVC", true);
}

export function unhideNonVideoContent()
{
	deleteClass("nimbusHide");
	del("#styleHNVC");
}

export function makeButtonsReadable()
{
	const buttons = get("button");
	if(!buttons) return;
	let count = 0;
	for(let i = 0, ii = buttons.length; i < ii; i++)
	{
		const button = buttons[i];
		if(button.hasAttribute("aria-label"))
		{
			count++;
			button.textContent = trimAt(button.getAttribute("aria-label"), " ");
		}
	}
	showMessageBig(`Labeled ${count} buttons`);
}

export function toggleViewVideoMode()
{
	toggleStyle(STYLES.VIEW_VIDEO_01, "styleViewVideo", true);
	toggleWebsiteSpecificStyle();
}

export function showPassword()
{
	const inputs = get("input");
	let i = inputs.length;
	while(i--)
	{
		const input = inputs[i];
		if(input.type && input.type === "password" && !input.classList.contains("showPassword"))
		{
			input.addEventListener("keyup", echoPassword, false);
			input.classList.add("showPassword");
		}
	}
}

export function echoPassword(e)
{
	showMessage(e.target.value, "none", true);
}

export function getPageNavLinks()
{
	const links = get("a");
	const pagerWrapper = createElement("h1", { textContent: "Pages: " });
	let count = 0;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		let linkText = link.textContent;
		if(linkText && linkText.trim().length && !isNaN(Number(linkText)))
		{
			count++;
			pagerWrapper.appendChild(createElement("a", { href: link.href, textContent: link.textContent || "[no text]" }));
			pagerWrapper.appendChild(document.createTextNode(" "));
		}
	}
	if(count)
	{
		document.body.appendChild(pagerWrapper);
		pagerWrapper.querySelector("a").focus();
	}
	else
		showMessageBig("No page nav links found");
	createPagerFromSelect();
}

export function createPagerFromSelect()
{
	const selects = get("select");
	for(let j = 0, jj = selects.length; j < jj; j++)
	{
		const select = selects[j];
		for(let i = 0, ii = select.length; i < ii; i++)
		{
			const option = select[i];
			if(looksLikeUrl(option.value))
			{
				const pagerWrapper = createElement("h3");
				pagerWrapper.appendChild(createElement("a", { href: option.value, textContent: option.textContent || i + 1 }));
				document.body.appendChild(pagerWrapper);
			}
		}
	}
	document.body.appendChild(createElement("hr"));
}

export function highlightUserLinks()
{
	const links = get("a");
	if(!links) return;
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		if(
			link.href &&
			link.textContent.replace(/\s+/g, "").length &&
			containsAnyOfTheStrings(link.pathname, ["/u/", "/user", "/member", "profile"]) &&
			link.parentNode && link.parentNode.tagName !== "USER"
		)
			wrapElement(link, "user");
	}
}

export function cycleTheme()
{
	cycleClass(document.documentElement, ["nimbusTheme1", "nimbusTheme3", "nimbusTheme2", "none"]);
}

export function setBodyOpacity(n)
{
	const styleId = "styleBodyOpacity";
	if(n >= 10) del("#" + styleId);
	else insertStyle(`body { opacity: ${n/10}; }`, styleId, true);
}

export function doWebsiteSpecificTasks()
{
	const commandElems = get("#website-specific-commands li");
	if(!commandElems) return;
	for(const commandElem of commandElems)
		runCommand(commandElem.textContent);
	del("#website-specific-commands");
}

export function doWebsiteSpecificTasksInternal()
{
	const sites = ["stackexchange", "stackoverflow", "superuser", "serverfault", "askubuntu"];
	if(containsAnyOfTheStrings(location.hostname, sites) && /questions\/[0-9]+/.test(location.href))
		cleanupStackOverflow();
}

export function hideReferences()
{
	const style = "reference { display: none; }";
	insertStyle(style, "styleHideReferences", true);
}
