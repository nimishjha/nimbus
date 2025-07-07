import { get, getOne, del } from "./selectors";
import { insertStyle } from "./style";
import { showMessageBig } from "./ui";
import { Cyclable } from "./Cyclable";

const videoStyles = [
	"video, img { filter: saturate(1.5); }",
	"video, img { filter: saturate(2); }",
	"video, img { filter: saturate(1.5) brightness(0.9) contrast(1.1); }",
	"video, img { filter: saturate(1.5) brightness(0.9) contrast(1.2); }",
	"video, img { filter: saturate(1.5) brightness(0.8) contrast(1.1); }",
	"video, img { filter: saturate(1.5) brightness(0.8) contrast(1.2); }",
	"video, img { filter: saturate(1.5) hue-rotate(-10deg) brightness(0.8) contrast(1.1); }",
	"video, img { filter: saturate(1.5) hue-rotate(-10deg) brightness(0.8) contrast(1.2); }",
	"video, img { filter: saturate(0.75) contrast(0.9); }",
	"video, img { filter: saturate(0); }",
	"video, img { filter: saturate(0) brightness(0.9) contrast(1.1); }",
	"video, img { filter: saturate(0) brightness(0.8) contrast(1.2); }",
	"video, img { filter: sepia(1) hue-rotate(180deg) brightness(0.8) contrast(1.2); }",
	"video, img { filter: sepia(1) hue-rotate(180deg) saturate(2) brightness(0.8) contrast(1.2); }",
	"video, img { filter: sepia(1) hue-rotate(180deg) saturate(3) brightness(0.8) contrast(1.2); }",
	"video, img { filter: sepia(1) hue-rotate(180deg) saturate(4) brightness(0.8) contrast(1.2); }",
	"video, img { filter: sepia(1) hue-rotate(180deg); }",
	"video, img { filter: sepia(1) hue-rotate(180deg) saturate(2); }",
	"video, img { filter: sepia(1) hue-rotate(180deg) saturate(3); }",
	"video, img { filter: sepia(1) hue-rotate(180deg) saturate(4); }",
];

const VideoFilter = {
	enabled: false,
	filters: new Cyclable(videoStyles),
};

export function disableVideoFilter()
{
	del("#styleVideoFilter");
	showMessageBig("Video filter disabled");
	VideoFilter.enabled = false;
}

export function previousVideoFilter()
{
	const lastValue = VideoFilter.filters.getCurrentValue();
	const newValue = VideoFilter.filters.previousValue();
	if(newValue !== lastValue)
		applyVideoFilter();
}

export function nextVideoFilter()
{
	const lastValue = VideoFilter.filters.getCurrentValue();
	const newValue = VideoFilter.filters.nextValue();
	if(newValue !== lastValue)
		applyVideoFilter();
}

export function addVideoFilter(style)
{
	VideoFilter.filters.addAndSelect(style);
	applyVideoFilter();
}

export function applyVideoFilter(index)
{
	const currentVideoFilter = VideoFilter.filters.getCurrentValue();
	insertStyle(currentVideoFilter, "styleVideoFilter", true);
	showMessageBig("Video filter " + currentVideoFilter);
	VideoFilter.enabled = true;
}

export function toggleVideoFilter()
{
	if(VideoFilter.enabled)
		disableVideoFilter();
	else
		applyVideoFilter();
}
