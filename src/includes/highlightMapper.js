import { Nimbus } from "./Nimbus";
import { showMessageError } from "./ui";
import { getViewportSize } from "./misc";

// For the 'developers' who need guard rails to keep them from doing dumb things
const MODULE_NAME = "highlightMapper";

function findFirstElementInViewport(elements)
{
	function promiseFunc(resolve)
	{
		if(!(elements && elements.length))
		{
			resolve(null);
			return;
		}

		let isFirstInvocation = true;

		function intersectionObserverCallback(entries)
		{
			if(isFirstInvocation)
			{
				isFirstInvocation = false;
				for(const entry of entries)
				{
					if(entry.isIntersecting)
					{
						observer.disconnect();
						resolve(entry.target);
						break;
					}
				}
			}
			observer.disconnect();
			resolve(null);
		}

		const intersectionObserverConfig = {
			root: null,
			rootMargin: '0px',
			threshold: 0
		};

		const observer = new IntersectionObserver(intersectionObserverCallback, intersectionObserverConfig);

		for(const element of elements)
			observer.observe(element);
	}

	return new Promise(promiseFunc);
}

function highlightMapper()
{
	const config = Nimbus.moduleConfigs[MODULE_NAME];

	function setupCanvasClickTracking(canvas) {
		canvas.addEventListener('click', function(event) {
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			handleCanvasClick(x, y);
		});
	}

	function handleCanvasClick(x, y) {
		const rowIndex = Math.max(Math.floor(y / (config.rowHeight + config.rowSpacing)) - 1, 0);
		const element = config.elements[rowIndex * config.groupSize];
		element.scrollIntoView();
	}

	function initCanvas(numParagraphs)
	{
		const canvasElem = document.createElement("canvas");
		canvasElem.id = config.canvasId;
		canvasElem.width = config.width;
		canvasElem.height = numParagraphs * (config.rowHeight + config.rowSpacing);
		canvasElem.setAttribute("style", "position: fixed; top: 0; left: 0;");
		document.body.appendChild(canvasElem);
		if(!canvasElem.getContext)
		{
			showMessageError("highlightMapper: could not get canvas context");
			return;
		}
		setupCanvasClickTracking(canvasElem);
		const ctx = canvasElem.getContext("2d");
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvasElem.width, canvasElem.height);
		return { ctx, width: canvasElem.width, height: canvasElem.height };
	}

	function getBarWidth(highlightLength, widthScale)
	{
		const width = highlightLength * widthScale;
		return config.minWidth ? Math.max(width, config.minWidth) : width;
	}

	function drawHighlightMap(highlightData)
	{
		const { highlightLengths, maxParagraphLength } = highlightData;
		const { ctx, width: canvasWidth, height } = initCanvas(highlightLengths.length);
		const widthScale = (canvasWidth - config.padding) / maxParagraphLength;
		const rowHeightPlusSpacing = config.rowHeight + config.rowSpacing;

		const colorsByHighlightType = config.colorsByHighlightType;

		let x = 0;
		let y = 0;
		for(let i = 0, ii = highlightLengths.length; i < ii; i++)
		{
			if(highlightLengths[i].isFirstVisibleElement)
			{
				ctx.fillStyle = colorsByHighlightType["currentLocation"];
				ctx.fillRect(canvasWidth - 50, y, 50, config.rowHeight);
			}

			x = 0;
			ctx.fillStyle = colorsByHighlightType["plaintext"];
			const width = getBarWidth(highlightLengths[i]["plaintext"], widthScale);
			ctx.fillRect(x, y, width, config.rowHeight);
			for(const key of ["mark", "markyellow", "markpurple", "markgreen", "markblue", "markred", "markwhite"])
			{
				ctx.fillStyle = colorsByHighlightType[key];
				const highlightLength = highlightLengths[i][key];
				if(highlightLength === 0) continue;
				const width = getBarWidth(highlightLength, widthScale);
				ctx.fillRect(x, y, width, config.rowHeight);
				x += width;
				if(config.drawGaps)
				{
					ctx.fillStyle = "#000";
					ctx.fillRect(x, y, 1, config.rowHeight);
					x += 1;
				}
			}
			y += rowHeightPlusSpacing;
		}

		ctx.font = "bold 20px SF Mono";
		ctx.fillStyle = "#CCC";
		ctx.fillText(`1:${config.groupSize}`, canvasWidth - 50, 20);
	}

	function summarizeData(highlightData)
	{
		const { highlightLengths } = highlightData;
		if(highlightLengths.length <= config.maxRows)
		{
			config.groupSize = 1;
			return highlightData;
		}
		const groupSize = Math.ceil(highlightLengths.length / config.maxRows);
		config.groupSize = groupSize;
		const summarizedData = [];
		let maxGroupedParagraphLength = 0;
		for(let i = 0, ii = highlightLengths.length; i < ii; i += groupSize)
		{
			const highlightLengthsGrouped = createHighlightLengthsObject(0);
			for(let j = i, jj = i + groupSize; j < jj && j < ii; j++)
			{
				if(highlightLengths[j].isFirstVisibleElement)
					highlightLengthsGrouped.isFirstVisibleElement = true;
				for(const tag of ["plaintext", "mark", "markyellow", "markpurple", "markgreen", "markblue", "markred", "markwhite"])
					highlightLengthsGrouped[tag] += highlightLengths[j][tag];
			}
			maxGroupedParagraphLength = Math.max(maxGroupedParagraphLength, highlightLengthsGrouped.plaintext);
			summarizedData.push(highlightLengthsGrouped);
		}

		return {
			highlightLengths: summarizedData,
			maxParagraphLength: maxGroupedParagraphLength
		};
	}

	function createHighlightLengthsObject(plaintextLength, isFirstVisibleElement)
	{
		return {
			isFirstVisibleElement: !!isFirstVisibleElement,
			plaintext: plaintextLength,
			mark: 0,
			markyellow: 0,
			markpurple: 0,
			markgreen: 0,
			markblue: 0,
			markred: 0,
			markwhite: 0
		};
	}

	async function generateHighlightData()
	{
		config.maxRows = Math.floor( getViewportSize().height / (config.rowHeight + config.rowSpacing));
		const elems = document.querySelectorAll("p");
		config.elements = elems;
		const firstVisibleElement = await findFirstElementInViewport(elems);
		const highlightData = {
			highlightLengths: [],
			maxParagraphLength: 0
		};
		for(const elem of elems)
		{
			const isFirstVisibleElement = firstVisibleElement && elem === firstVisibleElement;
			const highlightLengthsItem = createHighlightLengthsObject(elem.textContent.length, isFirstVisibleElement);
			highlightData.maxParagraphLength = Math.max(highlightData.maxParagraphLength, highlightLengthsItem.plaintext);
			for(const tag of ["mark", "markyellow", "markpurple", "markgreen", "markblue", "markred", "markwhite"])
			{
				const highlightElements = elem.querySelectorAll(tag);
				if(!highlightElements.length) continue;
				for(const highlightElement of highlightElements)
					highlightLengthsItem[tag] += highlightElement.textContent.length;
			}
			highlightData.highlightLengths.push(highlightLengthsItem);
		}
		return summarizeData(highlightData);
	}

	async function draw(rowHeight, rowSpacing, minWidth, drawGaps)
	{
		if(typeof rowHeight === "number") config.rowHeight = rowHeight;
		if(typeof rowSpacing === "number") config.rowSpacing = rowSpacing;
		if(typeof minWidth === "number") config.minWidth = minWidth;
		if(drawGaps === "true")
			config.drawGaps = true;
		else
			config.drawGaps = false;
		drawHighlightMap(await generateHighlightData());
	}

	function destroy()
	{
		const canvas = document.getElementById(config.canvasId);
		if(canvas)
			canvas.remove();
	}

	return {
		draw,
		destroy
	};
}

export function toggleHighlightMap()
{
	if(!Nimbus.highlightMapper)
	{
		Nimbus.highlightMapper = highlightMapper();
		Nimbus.highlightMapper.draw();
	}
	else
	{
		Nimbus.highlightMapper.destroy();
		Nimbus.highlightMapper = null;
	}
}

export function setHighlightMapColor(marktype, color)
{
	const config = Nimbus.moduleConfigs[MODULE_NAME];
	config.colorsByHighlightType[marktype] = color;
}

export function setHighlightMapOptions(rowHeight, rowSpacing, minWidth)
{
	const config = Nimbus.moduleConfigs[MODULE_NAME];
	if(typeof rowHeight === "number") config.rowHeight = rowHeight;
	if(typeof rowSpacing === "number") config.rowSpacing = rowSpacing;
	if(typeof minWidth === "number") config.minWidth = minWidth;
}
