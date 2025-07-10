import { Cyclable } from "./Cyclable";

export const Nimbus = {
	version: "2025.07.12.01",
	logString: "",
	autoCompleteInputComponent: {
		matches: [],
		currentIndex: -1,
	},
	highlightTagName: "mark",
	highlightTagNameList: ["mark", "markyellow", "markpurple", "markgreen", "markblue", "markred", "markwhite"],
	smallImageThreshold: 50,
	smallImageThresholdList: [100, 200, 300, 400, 500, 600],
	trHighlightClass: {
		"mark": "trMark",
		"markyellow": "trMarkYellow",
		"markred": "trMarkRed",
		"markgreen": "trMarkGreen",
		"markblue": "trMarkBlue",
		"markpurple": "trMarkPurple",
		"markwhite": "trMarkWhite",
	},
	replacementTagName1: "h2",
	replacementTagName2: "h3",
	markerClass: "markd",
	minPersistSize: 800,
	HEADING_CONTAINER_TAGNAME: "documentheading",
	selectionHighlightMode: "sentence",
	GROUP_TAGNAME: "blockquote",
	italicTag: "i",
	logColors: {
		gray: "background: #555; color: #AAA",
		blue: "background: #008; color: #ACE",
		yellow: "background: #000; color: #CC0",
		green: "background: #040; color: #0C0",
		red: "background: #600; color: #C00",
	},
	identifyClass: {
		style: "{ box-shadow: inset 2px 2px #09C, inset -2px -2px #09C; }",
		classes: new Cyclable([]),
		markedClasses: [],
	},
	goToNextElement: {
		selector: null,
		elements: [],
		currentElement: null,
	},
	symbolsString: "∆∑σ√∫αβγλμνπΦϕΨψρστυ≃°θΩω⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉—",
};
