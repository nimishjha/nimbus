import { get } from "./selectors";
import { createLinkInWrapper, createPlaceholderForElementAttribute } from "./element";
import { parseSrcSet, shortenImageSrc, createImagePlaceholderFromSrcset } from "./image";

export function replaceVideosWithPlaceholders()
{
	const videos = get("video");
	if(videos)
	{
		for(const video of videos)
		{
			const videoPh = document.createElement("videoph");
			const sources = video.querySelectorAll("source");
			if(sources)
			{
				for(const source of sources)
				{
					if(source.srcset)
					{
						videoPh.appendChild(createImagePlaceholderFromSrcset(source.srcset));
					}
					else
					{
						const dataSrcset = source.getAttribute("data-srcset");
						const media = source.getAttribute("media");
						if(dataSrcset && media)
						{
							const width = media.replace(/[^0-9]/g, "");
							const srcPh = createLinkInWrapper("videosrcph", `${width}: ${dataSrcset}`, dataSrcset);
							videoPh.appendChild(srcPh);
						}
						else
						{
							const src = source.getAttribute("src");
							if(src)
							{
								const srcPh = createLinkInWrapper("videosrcph", shortenImageSrc(src), src);
								videoPh.appendChild(srcPh);
							}
						}
					}
				}
				video.replaceWith(videoPh);
			}
			else
			{
				videoPh.appendChild(createPlaceholderForElementAttribute(video, "poster", "videosrcph"));
				videoPh.appendChild(createPlaceholderForElementAttribute(video, "resource", "videosrcph"));
				video.replaceWith(videoPh);
			}
		}
	}
}

export function replacePicturesWithPlaceholders()
{
	const pictures = get("picture");

	for(let i = 0, ii = pictures.length; i < ii; i++)
	{
		const picture = pictures[i];
		const picturePh = document.createElement("pictureph");
		const sources = picture.getElementsByTagName("source");
		const srcsets = [];

		for(let j = 0, jj = sources.length; j < jj; j++)
		{
			const srcset = sources[j].srcset || sources[j].getAttribute("data-srcset");
			if(srcset)
			{
				const media = sources[j].getAttribute("media");
				if(media)
					srcsets.push(srcset + " " + media.replace(/[^0-9]/g, ""));
				else
					srcsets.push(srcset);
			}
		}

		const srcsetPh = createImagePlaceholderFromSrcset(srcsets.join(", "));
		if(srcsetPh)
		{
			picturePh.appendChild(srcsetPh);
			picture.replaceWith(picturePh);
		}
		else
		{
			const errorElem = document.createElement("error");
			errorElem.textContent = srcsets.join(", ");
			picture.replaceWith(errorElem);
		}
	}
}
