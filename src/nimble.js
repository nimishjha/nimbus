import { del, get, getOne } from "./includes/selectors";
import { forAll } from "./includes/misc";
import { logInfo, logError, logWarning, logSuccess, logYellow } from "./includes/log";
import { cleanupAttributes, deleteHtmlComments, cleanupHead } from "./includes/cleanup";
import { removeAllAttributesOf } from "./includes/element";

export function appendMetadata()
{
	const { protocol, hostname, pathname, search } = window.location;

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

function cleanupDocument()
{
	cleanupHead();
	del(["iframe", "link", "style", "script", "input", "select", "form", "textarea", "label", "button", "canvas", "svg", "video", "audio", "applet", "message"]);
	deleteHtmlComments();
	removeAllAttributesOf(document.documentElement);
	removeAllAttributesOf(document.body);
	cleanupAttributes();
	appendMetadata();
	document.body.className = "pad100 xwrap";
	document.documentElement.id = "nimbus";
}

function main()
{
	window.get = get;
	window.del = del;
	window.getOne = getOne;
	window.forAll = forAll;
	window.logInfo = logInfo;
	window.logError = logError;
	window.cleanupDocument = cleanupDocument;
	window.cleanupAttributes = cleanupAttributes;
}

main();
