import { Nimbus } from "./Nimbus";
import { get } from "./selectors";
import { createElement } from "./element";
import { removeQueryParameterFromUrl } from "./url";
import { getTimestamp } from "./misc";

export function getMetadata()
{
	const headings4 = get("h4");
	if(!headings4) return;
	const len = headings4.length;
	if(len < 3)
		return false;
	const lastHeading4 = headings4[len - 1];
	if(!lastHeading4 || lastHeading4.textContent.indexOf("Saved at") !== 0)
		return false;

	const fields = headings4.splice(len - 3);
	const domain = fields[0].querySelector("a").textContent;
	const pageUrl = fields[1].querySelector("a").textContent;
	const saveTimestamp = fields[2].textContent;
	return {
		domain,
		pageUrl,
		saveTimestamp
	};
}

export function appendMetadata()
{
	if(getMetadata()) return;

	const existingMetadata = Nimbus.pageMetadata;
	const { protocol, hostname, pathname, search } = window.location;
	if(!existingMetadata && protocol === "file:") return;

	const urlWithoutHash = protocol + "//" + hostname + pathname + search;
	let documentUrl = removeQueryParameterFromUrl(urlWithoutHash, "utm_source");
	documentUrl = removeQueryParameterFromUrl(documentUrl, "utm_medium");
	documentUrl = removeQueryParameterFromUrl(documentUrl, "utm_campaign");

	const domainLinkWrapper = createElement("h4", { textContent: "Domain: " });
	const domainLink = createElement("a", { textContent: hostname, href: protocol + "//" + hostname });
	domainLinkWrapper.appendChild(domainLink);
	document.body.appendChild(domainLinkWrapper);

	const documentLinkWrapper = createElement("h4", { textContent: "URL: " });
	const documentLink = createElement("a", { textContent: documentUrl, href: documentUrl });
	documentLinkWrapper.appendChild(documentLink);
	document.body.appendChild(documentLinkWrapper);

	const saveTime = createElement("h4", { textContent: "Saved at " + getTimestamp() });
	document.body.appendChild(saveTime);
}
