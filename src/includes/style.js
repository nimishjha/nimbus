import { Nimbus } from "./Nimbus";
import { del } from "./selectors";
import { showMessageBig } from "./ui";
import { ylog } from "./log";

export function insertStyle(str, id, important)
{
	if(id && id.length && document.querySelector("#" + id))
		del("#" + id);
	if(important)
		str = str.replace(/!important/g, " ").replace(/;/g, " !important;");
	let head = document.querySelector("head");
	if(!head)
	{
		head = document.createElement("head");
		document.documentElement.insertBefore(head, document.documentElement.firstChild);
	}
	const style = document.createElement("style");
	const rules = document.createTextNode(str);
	style.type = "text/css";
	if(style.styleSheet)
		style.styleSheet.cssText = rules.nodeValue;
	else
		style.appendChild(rules);
	if(id && id.length)
		style.id = id;
	head.appendChild(style);
}

export function insertStyleHighlight()
{
	if(document.querySelector("#styleHighlight")) return;
	const s = `
		.${Nimbus.markerClass} { box-shadow: inset 2px 2px #c00, inset -2px -2px #c00; padding: 2px; background: #000; }
		.focused { box-shadow: inset 0px 1000px #000; color: #FFF; }
		.${Nimbus.markerClass}2 { box-shadow: inset 2px 2px #00c, inset -2px -2px #00c; padding: 2px; }
		.${Nimbus.markerClass}::after, .${Nimbus.markerClass}2::after { content: " "; display: block; clear: both; }
		a.${Nimbus.markerClass}::after, span.${Nimbus.markerClass}::after { content: ""; display: inline; clear: none; }
		mark, markgreen, markred, markblue, markpurple, markyellow, markwhite { padding: 3px 0; line-height: inherit; }
		mark { background: #303336; color: #808488; }
		markgreen  { background: #040; color: #0B0; }
		markred    { background: #500; color: #E33; }
		markblue   { background: #005; color: #66D; }
		markpurple { background: #180030; color: #60A; }
		markyellow { background: #502800; color: #c0b040; }
		markwhite  { background: #000; color: #b0b0b0; }
	`;
	insertStyle(s, "styleHighlight", true);
}

export function toggleNimbusStyles()
{
	function isNimbusStyle(item)
	{
		return item.id && item.id.indexOf("style") === 0;
	}
	const nimbusStyles = Array.from(document.querySelectorAll("style")).filter(isNimbusStyle);
	for(const style of nimbusStyles)
		style.disabled = !style.disabled;
}

export function toggleWebsiteSpecificStyle()
{
	const style = document.querySelector("#websiteSpecificStyle");
	if(style)
		style.disabled = !style.disabled;
}

export function toggleStyle(str, id, important)
{
	if(id && id.length && document.querySelector("#" + id))
	{
		del("#" + id);
		return;
	}
	insertStyle(str, id, important);
}

export function getAllInlineStyles()
{
	let styleText = "";
	const styleElements = document.querySelectorAll("style");
	for(const styleElement of styleElements)
		for(const rule of styleElement.sheet.cssRules)
			styleText += rule.cssText + "\n";
	return styleText;
}

export function getNonNimbusStylesheets()
{
	function excludeNimbusStylesheets(styleSheet)
	{
		return !(styleSheet.id && styleSheet.id.startsWith("style"));
	}
	return Array.from(document.styleSheets).filter(excludeNimbusStylesheets);
}

export function getAllCssRulesForElement(elem)
{
	const styleSheets = getNonNimbusStylesheets();
	const rules = [];
	for(const styleSheet of styleSheets)
		for(const rule of styleSheet.cssRules)
			if(elem.matches(rule.selectorText))
				rules.push(rule.cssText);
	return rules;
}

export function getAllCssRulesMatching(str)
{
	const styleSheets = getNonNimbusStylesheets();
	const matchingRules = [];
	for(const styleSheet of styleSheets)
	{
		const rules = Array.from(styleSheet.cssRules).filter(rule => rule.cssText.includes(str));
		for(const rule of rules)
			matchingRules.push(rule);
	}
	return matchingRules;
}

export function showCssRulesMatching(str)
{
	const rules = getAllCssRulesMatching(str);
	for(const rule of rules)
		ylog(rule.cssText);
}

export function forceReloadCss()
{
	showMessageBig("Force-reloading CSS");
	const styleLinks = document.getElementsByTagName('link');
	for(let i = 0, ii = styleLinks.length; i < ii; i++)
	{
		const styleSheet = styleLinks[i];
		if(styleSheet.rel.toLowerCase().indexOf('stylesheet') >= 0 && styleSheet.href)
		{
			const h = styleSheet.href.replace(/(&|%5C?)forceReload=\d+/, '');
			styleSheet.href = h + (h.indexOf('?') >= 0 ? '&' : '?') + 'forceReload=' + new Date().valueOf();
		}
	}
}
