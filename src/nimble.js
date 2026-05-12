import { del, get, getOne } from "./includes/selectors";
import { forAll } from "./includes/misc";
import { cleanupAttributes, deleteHtmlComments, cleanupHead } from "./includes/cleanup";
import { removeAllAttributesOf, createElement } from "./includes/element";
import { getTimestamp } from "./includes/misc";

function appendMetadata()
{
	const { protocol, hostname, pathname, search } = window.location;

	const urlWithoutHash = protocol + "//" + hostname + pathname + search;

	const domainLinkWrapper = createElement("h4", { textContent: "Domain: " });
	const domainLink = createElement("a", { textContent: hostname, href: protocol + "//" + hostname });
	domainLinkWrapper.appendChild(domainLink);
	document.body.appendChild(domainLinkWrapper);

	const documentLinkWrapper = createElement("h4", { textContent: "URL: " });
	const documentLink = createElement("a", { textContent: urlWithoutHash, href: urlWithoutHash });
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
	window.cleanupDocument = cleanupDocument;
	window.cleanupAttributes = cleanupAttributes;
	window.appendMetadata = appendMetadata;
}

main();
