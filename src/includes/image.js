import { Nimbus } from "./Nimbus";
import { createElement, deleteClass, removeAllAttributesExcept, setAttributeOf, removeAllAttributesOf, createElementWithText, createElementWithChildren, createLinkInWrapper } from "./element";
import { isEmptyElement } from "./elementAndNodeTests";
import { get, getOne, del } from "./selectors";
import { insertStyle } from "./style";
import { containsAnyOfTheStrings, trimAt } from "./string";
import { showMessage, showMessageBig, showMessageError } from "./ui";
import { deleteBySelectorAndText, deleteImagesSmallerThan } from "./delete";
import { getNext } from "./array";
import { insertBefore } from "./dom";
import { ylog } from "./log";
import { retrieve } from "./retrieve";
import { cleanupHead } from "./cleanup";
import { replaceElementKeepingId } from "./replaceElements";
import { replaceVideosWithPlaceholders, replacePicturesWithPlaceholders } from "./media";
import { STYLES } from "./stylesheets";

function sortSources(a, b)
{
	return b.size - a.size;
}

function getLargeImages()
{
	const link = Nimbus.largeImagesData.pop();
	if(link)
	{
		const image = document.createElement("img");
		image.src = link.href;
		link.replaceWith(image);
	}
	if(Nimbus.largeImagesData.length)
		setTimeout(getLargeImages, 2000);
}

export function getBestImageSrc()
{
	function getBestImages()
	{
		const imageData = Nimbus.bestImagesData.pop();
		if(imageData)
		{
			const img = imageData.image;
			if(img.src !== imageData.bestSource)
			{
				const newImage = document.createElement("img");
				newImage.src = imageData.bestSource;
				img.replaceWith(newImage);
			}
		}
		if(Nimbus.bestImagesData.length)
			setTimeout(getBestImages, 2000);
	}

	Nimbus.bestImagesData = [];

	const images = document.querySelectorAll("img");
	if(!images)
		return;
	let i = images.length;
	while(i--)
	{
		const image = images[i];
		const set1 = typeof image.srcset === "string" && image.srcset.length ? image.srcset : null;
		const set2 = image.getAttribute("data-srcset");
		let srcset = set1 || set2;
		if(!srcset)
			continue;
		srcset = srcset.replace(/, /g, ",");
		if(srcset)
		{
			let bestSource;
			let sources = srcset.split(',');
			let sourcesArray = [];
			for(let j = 0, jj = sources.length; j < jj; j++)
			{
				const splat = sources[j].trim().split(' ');
				if(splat.length === 2)
				{
					const src = splat[0];
					const size = parseInt(splat[1].replace(/[^0-9]/g, ""), 10);
					if(!isNaN(size))
						sourcesArray.push({ size: size, src: src });
				}
			}
			if(sourcesArray.length > 1)
			{
				sourcesArray.sort(sortSources);
				bestSource = sourcesArray[0].src;
				Nimbus.bestImagesData.push({ image, bestSource });
			}
			else if(sourcesArray.length === 1)
			{
				bestSource = sourcesArray[0].src;
				Nimbus.bestImagesData.push({ image, bestSource });
			}
			removeAllAttributesExcept(image, "src");
		}
	}
	getBestImages();
}

function getLastSplit(str, splitter)
{
	if(str.indexOf(splitter) === -1) return str;
	const splat = str.split(splitter);
	return splat[splat.length - 1];
}

export function retrieveLargeImages()
{
	Nimbus.largeImagesData = [];
	const links = get("a");
	if(links)
	{
		let count = 0;
		let i = links.length;
		while(i--)
		{
			const link = links[i];
			if(link.parentNode.tagName === "RT")
				continue;
			const linkHref = link.href;
			if(containsAnyOfTheStrings(linkHref.toLowerCase(), [".png", ".jpg", ".gif", ".jpe", ".webp"]))
			{
				if(link.parentNode)
				{
					Nimbus.largeImagesData.push(link);
					count++;
				}
			}
		}
		showMessageBig(`Retrieving ${count} large images`);
		getLargeImages();
	}
}

export function getImageWidth(image)
{
	return image.naturalWidth || image.clientWidth;
}

export function getImageHeight(image)
{
	return image.naturalHeight || image.clientHeight;
}

export function setMinPersistSize(sideOfSquare)
{
	Nimbus.minPersistSize = sideOfSquare;
}

export function persistStreamingImages(sideOfSquare)
{
	if(sideOfSquare)
		Nimbus.minPersistSize = sideOfSquare;
	const minArea = Nimbus.minPersistSize * Nimbus.minPersistSize;
	let imageContainer = getOne("#nimbusStreamingImageContainer");
	if(!imageContainer)
	{
		imageContainer = createElement("div", { id: "nimbusStreamingImageContainer" });
		document.body.appendChild(imageContainer);
		const style = `#nimbusStreamingImageContainer { z-index: 2147483647; position: fixed; bottom: 90px; left: 10px; width: 100%; height: 20vh; background: #000; overflow: auto; }
			#nimbusStreamingImageContainer img { height: 50px; width: auto; float: left; margin: 0 1px 1px 0; }`;
		insertStyle(style, "stylePersistStreamingImages", true);
	}
	if(!Nimbus.streamingImages)
		Nimbus.streamingImages = [];
	const images = Nimbus.streamingImages;
	const seen = new Set();
	const unsavedImages = document.querySelectorAll("img:not(.alreadySaved)");
	for(let i = 0, ii = unsavedImages.length; i < ii; i++)
	{
		const image = unsavedImages[i];
		const imgSrc = image.src;
		if(seen.has(imgSrc) || image.naturalWidth * image.naturalHeight < minArea)
			continue;
		images.push(imgSrc);
		seen.add(imgSrc);
		imageContainer.appendChild(createElement("img", { src: imgSrc, className: "alreadySaved" }));
	}
	const savedImages = get(".alreadySaved");
	const numImages = savedImages.length ? savedImages.length : 0;
	showMessage(`${numImages} unique images larger than ${Nimbus.minPersistSize}px so far`, "messagebig", true);
	Nimbus.persistStreamingImagesTimeout = setTimeout(persistStreamingImages, 250);
}

export function deletePersistedImages()
{
	clearTimeout(Nimbus.persistStreamingImagesTimeout);
	del("#nimbusStreamingImageContainer");
}

export function showSavedStreamingImages()
{
	clearTimeout(Nimbus.persistStreamingImagesTimeout);
	deleteImagesSmallerThan(100, 100);
	insertStyle("#nimbusStreamingImageContainer { height: 80vh; }", "temp", true);
	retrieve("#nimbusStreamingImageContainer");
	deleteClass("alreadySaved");
	const images = get("img");
	for(let i = 0, ii = images.length; i < ii; i++)
	{
		const image = images[i];
		removeAllAttributesExcept(image, "src");
	}
	ylog(images.length + " images", "h2");
}

export function addLinksToLargerImages()
{
	const imageLinks = [];
	const images = get("img");
	if(images)
		for(let i = 0, ii = images.length; i < ii; i++)
			imageLinks.push(images[i].src);
	const imagePlaceholders = get("rt a");
	if(imagePlaceholders)
		for(let i = 0, ii = imagePlaceholders.length; i < ii; i++)
			imageLinks.push(imagePlaceholders[i].href);
	const links = get("a");
	if(links)
	{
		let i = links.length;
		while(i--)
		{
			const link = links[i];
			const linkHref = link.href;
			if( /(\.png|\.jpg|\.jpeg|\.gif)/i.test(linkHref) && !imageLinks.includes(linkHref) )
			{
				link.parentNode.insertBefore(createElementWithChildren("rt", createElement("a", { href: linkHref, textContent: shortenImageSrc(linkHref) })), link);
				if(isEmptyElement(link))
					del(link);
			}
		}
	}
}

export function tagLargeImages(threshold = 500)
{
	const images = get("img");
	for(let i = 0, ii = images.length; i < ii; i++)
	{
		const image = images[i];
		if(image.naturalWidth > threshold || image.naturalHeight > threshold)
			image.classList.add("large");
	}
}

export function forceImageWidth(width, largeImagesOnly)
{
	tagLargeImages();
	if(width < 20)
		width *= 100;
	const className = largeImagesOnly ? ".large" : "";
	const s = `img${className} { width: ${width}px; height: auto; }`;
	insertStyle(s, "styleImageWidth", true);
}

export function forceImageHeight(height, largeImagesOnly)
{
	tagLargeImages();
	if(height < 20)
		height *= 100;
	const className = largeImagesOnly ? ".large" : "";
	const s = `img${className} { height: ${height}px; width: auto; }`;
	insertStyle(s, "styleImageHeight", true);
}

export function buildGallery()
{
	const MIN_AREA = 20000;
	const images = get("img");
	if(!(images && images.length))
	{
		showMessageBig("No images found");
		return;
	}
	const galleryElement = createElement("slideshow", { id: "nimbusGallery" });
	const seen = new Set();
	for(let i = 0, ii = images.length; i < ii; i++)
	{
		const image = images[i];
		if(seen.has(image.src))
			continue;
		let w = image.naturalWidth;
		let h = image.naturalHeight;
		if(w * h < MIN_AREA)
			continue;
		let aspectRatioClass;
		if(w && h)
			aspectRatioClass = w / h > 16 / 9 ? "aspectRatioLandscape" : "aspectRatioPortrait";
		galleryElement.appendChild(createElement("img", { src: image.src, className: aspectRatioClass }));
		seen.add(image.src);
	}
	del("img");
	cleanupHead();
	insertStyle("img { display: block; float: left; max-height: 500px; } slideshow::after { content: ''; display: block; clear: both; }", "styleGallery", true);
	document.body.insertBefore(galleryElement, document.body.firstChild);
}

export function shortenImageSrc(src)
{
	const splat = src.split("/");
	let domain = "unknown domain";
	let imageFileName = "image";

	if(splat.length && splat.length > 2)
	{
		domain = splat[2];
		imageFileName = unescape(splat[splat.length - 1]);
		if(imageFileName.indexOf("/") !== -1)
			imageFileName = getLastSplit(imageFileName, "/");
	}

	imageFileName = trimAt(imageFileName, "?");

	if(domain.length)
		return domain + " | " + imageFileName;
	return imageFileName;
}

export function getPlaceholderSrc(elem)
{
	const bSrcElem = elem.querySelector("b");
	if(bSrcElem)
	{
		return bSrcElem.textContent;
	}
	else
	{
		const aSrcElem = elem.querySelector("a");
		if(aSrcElem)
			return aSrcElem.href;
	}
	return null;
}

export function toggleBetweenImagesAndPlaceholders()
{
	const hasImages = Boolean(getOne("img"));
	const hasImagePlaceholders = Boolean(getOne("rt"));

	if(getOne("picture"))
		replacePicturesWithPlaceholders();

	if(hasImages)
		replaceImagesWithPlaceholders();
	else if(hasImagePlaceholders)
		replaceImagePlaceholdersWithImages();

	if(getOne("video"))
		replaceVideosWithPlaceholders();
}

export function toggleInvertImages()
{
	const images = get("img");
	const invertedImages = get("img.invert");

	if(images && invertedImages && images.length === invertedImages.length)
		deleteClass("invert");
	else
		setAttributeOf("img", "class", "invert");
}

export function parseSrcSet(srcset)
{
	const sources = srcset.split(', ');
	if(sources)
	{
		const sourcesArray = [];
		for(const source of sources)
		{
			const splat = source.trim().split(' ');
			if(splat.length === 2)
			{
				const src = splat[0];
				const size = parseInt(splat[1].replace(/[^0-9]/g, ""), 10);
				sourcesArray.push({ size, src });
			}
			else
			{
				sourcesArray.push({ size: 0, src: source });
			}
		}
		return sourcesArray;
	}
	else
	{
		console.log("parseSrcSet - srcset:", srcset);
	}
	return null;
}

export function createImagePlaceholder(img)
{
	const srcset = img.getAttribute("srcset") || img.getAttribute("data-srcset");
	return srcset ? createImagePlaceholderFromSrcset(srcset) : createImagePlaceholderFromSrc(img.src);
}

export function createImagePlaceholderFromSrc(src)
{
	const wrapper = document.createElement("rt");
	if(src.startsWith("file:"))
	{
		const srcElem = document.createElement("b");
		const srcSplat = src.split("/");
		const folderName = srcSplat[srcSplat.length - 2];
		const fileName = srcSplat[srcSplat.length - 1];
		srcElem.textContent = `${folderName}/${fileName}`;
		wrapper.appendChild(srcElem);
	}
	else
	{
		const srcElem = document.createElement("a");
		srcElem.href = src;
		srcElem.textContent = shortenImageSrc(src)
		wrapper.appendChild(srcElem);
	}
	return wrapper;
}

export function createImagePlaceholderFromSrcset(srcset)
{
	const sourcesArray = parseSrcSet(srcset);

	if(sourcesArray.length)
	{
		sourcesArray.sort(sortSources);
		const wrapper = document.createElement("imageph");
		wrapper.appendChild(createImagePlaceholderFromSrc(sourcesArray[0].src));
		if(sourcesArray.length > 1)
			for(const item of sourcesArray)
				wrapper.appendChild(createLinkInWrapper("div", item.size + ": " + shortenImageSrc(item.src), item.src));
		return wrapper;
	}

	return null;
}

export function replaceImagePlaceholdersWithImages()
{
	const imagePlaceholders = get("rt");
	let i = imagePlaceholders.length;
	while(i--)
	{
		const image = document.createElement("img");
		image.src = getPlaceholderSrc(imagePlaceholders[i]);
		if(image.src)
			imagePlaceholders[i].replaceWith(image);
		else
			console.error("Could not get src from placeholder");
	}
	del("#styleReplaceImages");
}

export function replaceImagesWithPlaceholders()
{
	const images = get("img");
	let numImagesWithIDs = 0;
	let i = images.length;
	while(i--)
	{
		const image = images[i];
		if(image.id)
		{
			numImagesWithIDs++;
			image.className = "statusError";
		}
		else if(image.src)
		{
			const imagePlaceholder = createImagePlaceholder(image);
			if(image.parentNode.tagName === "A")
				image.parentNode.replaceWith(imagePlaceholder);
			else
				image.replaceWith(imagePlaceholder);
		}
	}

	if(numImagesWithIDs)
	{
		showMessageError(`${numImagesWithIDs} have IDs; move IDs before replacing`);
		return;
	}

	const elems = get("rt");
	i = elems.length;
	while(i--)
	{
		const parent = elems[i].parentNode;
		if(parent && parent.children.length === 1 && parent.tagName !== "FIGURE")
			replaceElementKeepingId(parent, "figure");
	}

	insertStyle(STYLES.REPLACE_IMAGES, "styleReplaceImages");
}

export function inspectImages()
{
	const images = document.querySelectorAll("img");
	for(const image of images)
	{
		const placeholder = createImagePlaceholder(image);
		if(image.parentNode.tagName === "A")
			image.parentNode.replaceWith(placeholder);
		else
			image.replaceWith(placeholder);
	}
}
