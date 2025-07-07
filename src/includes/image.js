import { Nimbus } from "./Nimbus";
import { createElement, deleteClass, removeAllAttributesExcept } from "./element";
import { get, getOne, del } from "./selectors";
import { removeAllAttributesOf, createElementWithText, createElementWithChildren } from "./element";
import { insertStyle } from "./style";
import { containsAnyOfTheStrings, trimAt } from "./string";
import { showMessage, showMessageBig } from "./ui";
import { deleteBySelectorAndText } from "./delete";
import { getNext } from "./array";
import { insertBefore } from "./dom";
import { ylog } from "./log";
import { retrieve } from "./retrieve";
import { isEmptyLink } from "./link";
import { cleanupHead } from "./cleanup";

export function deleteImagesSmallerThan(pixelArea)
{
	const images = get('img');
	let i = images.length;
	let count = 0;
	while(i--)
	{
		const image = images[i];
		if(image.src.includes(".svg"))
		{
			if(image.width * image.height < pixelArea)
			{
				image.remove();
				count++;
			}
		}
		else if(image.naturalWidth * image.naturalHeight < pixelArea)
		{
			image.remove();
			count++;
		}
	}
	showMessageBig(`Deleted ${count} images smaller than ${pixelArea} pixels`);
}

export function deleteSmallImages()
{
	deleteBySelectorAndText("img", "data:");
	deleteBySelectorAndText("img", "emoji");
	const nextThreshold = getNext(Nimbus.smallImageThreshold, Nimbus.smallImageThresholdList);
	Nimbus.smallImageThreshold = nextThreshold;
	deleteImagesSmallerThan(nextThreshold * nextThreshold);
}

export function deleteImageByNumber(num)
{
	if(!document.images) return;
	if(document.images[num])
		document.images[num].remove();
}

export function getBestImageSrc()
{
	Nimbus.bestImagesData = [];

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
				img.parentNode.replaceChild(newImage, img);
			}
		}
		if(Nimbus.bestImagesData.length)
			setTimeout(getBestImages, 1000);
	}

	function sortSources(a, b)
	{
		if(a.size > b.size) return 1;
		if(a.size < b.size) return -1;
		return 0;
	}

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
		srcset = srcset.replace(/, /g, "|");
		if(srcset)
		{
			let bestSource;
			let sources = srcset.split('|');
			let sourcesArray = [];
			for(let j = 0, jj = sources.length; j < jj; j++)
			{
				const splat = sources[j].trim().split(' ');
				const src = splat[0];
				const size = parseInt(splat[1], 10);
				if(!isNaN(size))
					sourcesArray.push({ size: size, src: src });
			}
			if(sourcesArray.length > 1)
			{
				sourcesArray = sourcesArray.sort(sortSources);
				bestSource = sourcesArray[sourcesArray.length - 1].src;
				Nimbus.bestImagesData.push({ image, bestSource });
			}
			removeAllAttributesExcept(image, "src");
		}
	}
	getBestImages();
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
	}
	if(domain.length)
		return domain + " | " + imageFileName;
	return imageFileName;
}

export function replaceImagesWithAltText()
{
	const imgs = get("img");
	for(let i = 0, ii = imgs.length; i < ii; i++)
	{
		const img = imgs[i];
		const altText = img.alt;
		if(altText && altText.length)
			img.parentNode.replaceChild(createElementWithText("small", altText), img);
		else
			img.remove();
	}
}

export function replaceImagesWithTextLinks()
{
	if(getOne("rt"))
	{
		const images = get("rt");
		let i = images.length;
		while(i--)
		{
			const elem = images[i];
			const imageLink = createElement("img", { src: elem.querySelector("a").href });
			elem.parentNode.replaceChild(imageLink, elem);
		}
		del('#styleReplaceImages');
		return;
	}
	else if(getOne("img"))
	{
		const images = get("img");
		let i = images.length;
		while(i--)
		{
			const elem = images[i];
			if(elem.src)
			{
				const imageLink = createElement("a", { href: elem.src, textContent: shortenImageSrc(elem.src) });
				const imageReplacement = createElementWithChildren("rt", imageLink);
				if(elem.parentNode.tagName === "A")
					insertBefore(elem.parentNode, imageReplacement);
				else
					insertBefore(elem, imageReplacement);
			}
		}
		del("img");
		const s = 'rt { margin: 10px 0; padding: 20px; display: block; background: #181818; font: 12px verdana; text-align: left; }' +
		'rt a { color: #FFF; }' +
		'rt:before { content: ""; display: block; width: 10px; height: 15px; border: 2px solid #AAA; float: left; margin: -3px 20px 0 0; }';
		insertStyle(s, "styleReplaceImages");
	}
}

export function retrieveLargeImages()
{
	const links = get("a");
	let i = links.length;
	let count = 0;
	while(i--)
	{
		const link = links[i];
		if(link.parentNode.tagName === "RT")
			continue;
		const linkHref = link.href;
		if(containsAnyOfTheStrings(linkHref.toLowerCase(), [".png", ".jpg", ".gif", ".jpe"]))
		{
			if(link.parentNode)
			{
				link.parentNode.replaceChild(createElement("img", { src: linkHref }), link);
				count++;
			}
		}
	}
	showMessageBig(`Retrieved ${count} large images`);
}

export function getImageWidth(image)
{
	return image.naturalWidth || image.clientWidth;
}

export function getImageHeight(image)
{
	return image.naturalHeight || image.clientHeight;
}

export function persistStreamingImages(minSize)
{
	if(minSize)
		Nimbus.minPersistSize = minSize;
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
	let images = Nimbus.streamingImages;
	const unsavedImages = document.querySelectorAll("img:not(.alreadySaved)");
	for(let i = 0, ii = unsavedImages.length; i < ii; i++)
	{
		const image = unsavedImages[i];
		const imgSrc = image.src;
		if(images.includes(imgSrc) || getImageWidth(image) * getImageHeight(image) < minArea)
			continue;
		images.push(imgSrc);
		imageContainer.appendChild(createElement("img", { src: imgSrc, className: "alreadySaved" }));
	}
	let numImages = get(".alreadySaved").length;
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
				if(isEmptyLink(link))
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

export function buildSlideshow()
{
	if(getOne("#styleSlideshow"))
	{
		del("#styleSlideshow");
		return;
	}
	if(!getOne("#nimbusGallery"))
		buildGallery();
	del("#styleGallery");
	const gallery = getOne("#nimbusGallery");
	const images = gallery.querySelectorAll("img");
	if(!(gallery && images))
		return;
	const s = 'body { margin: 0; padding: 0; }' +
	'#nimbusGallery { width: 100%; height: 100vh; background: #000; color: #999; position: absolute; top: 0; left: 0; z-index: 1999999999; }' +
	'#nimbusGallery img { position: absolute; top: -1000em; left: -1000em; z-index: 2147483647; }' +
	'#nimbusGallery img.currentImage { margin: auto; position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: block; }' +
	'#nimbusGallery img.currentImage.aspectRatioPortrait { height: 100vh; width: auto; }' +
	'#nimbusGallery img.currentImage.aspectRatioLandscape { width: 100vw; height: auto; }' +
	'#nimbusGallery a { color: #000; }' +
	'slideshow::after { content: ""; display: block; clear: both; }';
	insertStyle(s, 'styleSlideshow', true);
	images[0].classList.add("currentImage");
	window.scrollTo(0, 0);
}

export function slideshowChangeSlide(direction)
{
	if(!getOne("#styleSlideshow"))
		return;
	const gallery = getOne("#nimbusGallery");
	if(!gallery)
		return;
	const images = gallery.getElementsByTagName("img");
	for(let i = 0, ii = images.length; i < ii; i++)
	{
		if(images[i].classList.contains("currentImage"))
		{
			images[i].classList.remove("currentImage");
			if(direction === "previous")
			{
				if(i === 0) images[ii - 1].classList.add("currentImage");
				else images[i - 1].classList.add("currentImage");
				break;
			}
			else if(direction === "next")
			{
				if(i === ii-1) images[0].classList.add("currentImage");
				else images[i + 1].classList.add("currentImage");
				break;
			}
		}
	}
}

export function removeQueryStringFromImageSources()
{
	const images = get("img");
	for(let i = 0, ii = images.length; i < ii; i++)
	{
		const image = images[i];
		image.src = trimAt(image.src, "?");
	}
	const imagePlaceholders = get("rt a");
	for(let i = 0, ii = imagePlaceholders.length; i < ii; i++)
	{
		const imagePlaceholder = imagePlaceholders[i];
		imagePlaceholder.href = trimAt(imagePlaceholder.href, "?");
		imagePlaceholder.textContent = imagePlaceholder.href;
	}
}
