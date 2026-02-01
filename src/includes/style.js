import { Nimbus } from "./Nimbus";
import { del, get, getOne } from "./selectors";
import { showMessageBig } from "./ui";
import { ylog } from "./log";
import { STYLES } from "./stylesheets";

export function insertStyle(str, id, important)
{
	if(id && id.length && getOne("#" + id))
		del("#" + id);
	if(important)
		str = str.replace(/!important/g, " ").replace(/;/g, " !important;");
	str = "\n" + str.replace(/\n\t+/g, "\n");
	let head = getOne("head");
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
	if(getOne("#styleHighlight")) return;
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
		markyellow { background: #630; color: #c0b040; }
		markwhite  { background: #000; color: #c0c0c0; }
	`;
	insertStyle(s, "styleHighlight", true);
}

export function insertStyleShowErrors()
{
	const s = ".error { box-shadow: inset 2000px 2000px rgba(255, 0, 0, 1);";
	insertStyle(s, "styleShowErrors", true);
}

export function toggleStyleNegative()
{
	toggleStyle(STYLES.NEGATIVE, "styleNegative", true);
}

export function toggleNimbusStyles()
{
	const styles = Array.from(document.querySelectorAll("style"));
	function isNimbusStyle(item)
	{
		return item.id && item.id.indexOf("style") === 0;
	}
	const nimbusStyles = styles.filter(isNimbusStyle);
	for(const style of nimbusStyles)
		style.disabled = !style.disabled;
}

export function toggleWebsiteSpecificStyle()
{
	const style = getOne("#websiteSpecificStyle");
	if(style)
		style.disabled = !style.disabled;
}

export function toggleStyle(str, id, important)
{
	if(id && id.length && getOne("#" + id))
	{
		del("#" + id);
		return;
	}
	insertStyle(str, id, important);
}

export function getAllInlineStyles()
{
	let styleText = "";
	const styleElements = get("style");
	if(!styleElements)
		return;
	for(let j = 0, jj = styleElements.length; j < jj; j++)
	{
		const styleElement = styleElements[j];
		const rules = styleElement.sheet.cssRules;
		for(let i = 0, ii = rules.length; i < ii; i++)
			styleText += rules[i].cssText + "\n";
	}
	return styleText;
}

export function getAllCssRulesForElement(elem)
{
	const styleSheets = document.styleSheets;
	const rulesArray = [];
	let i = styleSheets.length;
	while(i--)
	{
		const styleSheet = styleSheets[i];
		if(styleSheet.href && styleSheet.href.indexOf(location.hostname) === -1)
			continue;
		const rules = styleSheet.cssRules;
		if(!rules)
			continue;
		let j = rules.length;
		while(j--)
			if(elem.matches(rules[j].selectorText))
				rulesArray.push(rules[j].cssText);
	}
	return rulesArray;
}

export function getAllCssRulesMatching(selectorOrPropertyOrValue)
{
	const styleSheets = document.styleSheets;
	let i = styleSheets.length;
	while(i--)
	{
		const styleSheet = styleSheets[i];
		if(styleSheet.href && styleSheet.href.indexOf(location.hostname) === -1)
			continue;
		const rules = styleSheet.cssRules;
		if(!rules)
			continue;
		let j = rules.length;
		while(j--)
			if(~rules[j].cssText.indexOf(selectorOrPropertyOrValue))
				ylog(rules[j].cssText.replace(selectorOrPropertyOrValue, "<mark>" + selectorOrPropertyOrValue + "</mark>"));
	}
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
