// ==UserScript==
// @id             Nimbus
// @name           Nimbus
// @version        1.0
// @namespace      nimishjha.com
// @author         Nimish Jha
// @description    Swiss Army Knife for browsing
// @include        *
// @include        file:///*
// @run-at         document-end
// @grant		none
// ==/UserScript==

//
//	Nimbus
//	Copyright (C) 2008-2025 Nimish Jha
//
//	This program is free software: you can redistribute it and/or modify
//	it under the terms of the GNU General Public License as published by
//	the Free Software Foundation, either version 3 of the License, or
//	(at your option) any later version.
//
//	This program is distributed in the hope that it will be useful,
//	but WITHOUT ANY WARRANTY; without even the implied warranty of
//	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//	GNU General Public License for more details.
//
//	You should have received a copy of the GNU General Public License
//	along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

"use strict";

const noop = function(){};
let consoleLog = noop;
let consoleWarn = noop;
let consoleError = noop;

const isDebugMode = true;

const Nimbus = {
	version: "2025.06.30.01",
	logString: "",
	messageTimeout: null,
	KEYCODES: {
		ZERO: 48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
		A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
		F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123,
		NUMPAD0: 96, NUMPAD1: 97, NUMPAD2: 98, NUMPAD3: 99, NUMPAD4: 100, NUMPAD5: 101, NUMPAD6: 102, NUMPAD7: 103, NUMPAD8: 104, NUMPAD9: 105,
		NUMPAD_MULTIPLY: 106, NUMPAD_ADD: 107, NUMPAD_SUBTRACT: 109, NUMPAD_DECIMAL_POINT: 110, NUMPAD_DIVIDE: 111,
		FORWARD_SLASH: 191, BACK_SLASH: 220, MINUS: 173, TILDE: 192, SPACE: 32,
		UPARROW: 38, DOWNARROW: 40, LEFTARROW: 37, RIGHTARROW: 39, TAB: 9, ENTER: 13, ESCAPE: 27, SQUARE_BRACKET_OPEN: 219, SQUARE_BRACKET_CLOSE: 221,
		PERIOD: 190, HOME: 36, END: 35, DELETE: 46
	},
	availableFunctions: {
		addDateToTitle: addDateToTitle,
		addLinksToLargerImages: addLinksToLargerImages,
		annotate: annotate,
		appendMetadata: appendMetadata,
		boldInlineColonHeadings: boldInlineColonHeadings,
		buildGallery: buildGallery,
		buildSlideshow: buildSlideshow,
		capitalizeTitle: capitalizeTitle,
		cleanupAttributes: cleanupAttributes,
		cleanupDocument: cleanupDocument,
		cleanupHead: cleanupHead,
		cleanupHeadings: cleanupHeadings,
		cleanupLinks: cleanupLinks,
		convertLineBreaksToBrs: convertLineBreaksToBrs,
		copyAttribute: copyAttribute,
		count: count,
		createListsFromBulletedParagraphs: createListsFromBulletedParagraphs,
		createPagerFromSelect: createPagerFromSelect,
		cycleFocusOverFormFields: cycleFocusOverFormFields,
		cycleThroughDocumentHeadings: cycleThroughDocumentHeadings,
		del: del,
		deleteByClassOrIdContaining: deleteByClassOrIdContaining,
		deleteBySelectorAndExactText: deleteBySelectorAndExactText,
		deleteBySelectorAndNormalizedText: deleteBySelectorAndNormalizedText,
		deleteBySelectorAndRegex: deleteBySelectorAndRegex,
		deleteBySelectorAndText: deleteBySelectorAndText,
		deleteClass: deleteClass,
		deleteEmptyBlockElements: deleteEmptyBlockElements,
		deleteEmptyElements: deleteEmptyElements,
		deleteEmptyHeadings: deleteEmptyHeadings,
		deleteEmptyTextNodes: deleteEmptyTextNodes,
		deleteFollowingNodesBySelector: deleteFollowingNodesBySelector,
		deleteIframes: deleteIframes,
		deleteImageByNumber: deleteImageByNumber,
		deleteImages: deleteImages,
		deleteImagesSmallerThan: deleteImagesSmallerThan,
		deleteMessage: deleteMessage,
		deleteNodesBetweenMarkers: deleteNodesBetweenMarkers,
		deleteNodesBySelectorAndRelativePosition: deleteNodesBySelectorAndRelativePosition,
		deleteNonContentElements: deleteNonContentElements,
		deleteNonContentLinks: deleteNonContentLinks,
		deleteNonContentLists: deleteNonContentLists,
		deleteNonEnglishText: deleteNonEnglishText,
		deletePersistedImages: deletePersistedImages,
		deletePrecedingNodesBySelector: deletePrecedingNodesBySelector,
		deleteResources: deleteResources,
		deleteSmallImages: deleteSmallImages,
		delRange: delRange,
		deselect: deselect,
		disableClickToCollectUrls: disableClickToCollectUrls,
		disableConsoleLogs: disableConsoleLogs,
		duplicateMarkedElement: duplicateMarkedElement,
		edit: toggleContentEditable,
		editDocumentTitle: editDocumentTitle,
		editStyleById: editStyleById,
		enableClickToCollectUrls: enableClickToCollectUrls,
		enableConsoleLogs: enableConsoleLogs,
		findStringsInProximity: findStringsInProximity,
		fixBody: fixBody,
		fixBullets: fixBullets,
		fixDashes: fixDashes,
		fixInternalReferences: fixInternalReferences,
		fixLineBreaks: fixLineBreaks,
		fixParagraphs: fixParagraphs,
		focusButton: focusButton,
		forAll: forAll,
		forAllMarked: forAllMarked,
		forceImageWidth: forceImageWidth,
		forceReloadCss: forceReloadCss,
		generateTableOfContents: generateTableOfContents,
		getAllCssRulesMatching: getAllCssRulesMatching,
		getBestImageSrc: getBestImageSrc,
		getContentByParagraphCount: getContentByParagraphCount,
		getMarkedHTML: getMarkedHTML,
		getPageNavLinks: getPageNavLinks,
		goToLastElement: goToLastElement,
		goToNextElement: goToNextElement,
		goToPrevElement: goToPrevElement,
		groupAdjacentElements: groupAdjacentElements,
		groupMarkedElements: groupMarkedElements,
		groupUnderHeadings: groupUnderHeadings,
		hideNonVideoContent: hideNonVideoContent,
		highlightAllMatchesInDocument: highlightAllMatchesInDocument,
		highlightAllStrings: highlightAllStrings,
		highlightBySelectorAndText: highlightBySelectorAndText,
		highlightCode: highlightCode,
		highlightCodeComments: highlightCodeComments,
		highlightCodePunctuation: highlightCodePunctuation,
		highlightCodeStrings: highlightCodeStrings,
		highlightFirstParentByText: highlightFirstParentByText,
		highlightInPres: highlightInPres,
		highlightInTextNodes: highlightInTextNodes,
		highlightLinksInPres: highlightLinksInPres,
		highlightLinksWithHrefContaining: highlightLinksWithHrefContaining,
		highlightMatchesUnderSelector: highlightMatchesUnderSelector,
		highlightQuotes: highlightQuotes,
		highlightSelection: highlightSelection,
		highlightUserLinks: highlightUserLinks,
		identifyClassSetStyle: identifyClassSetStyle,
		identifyClassSetup: identifyClassSetup,
		identifyClassShowMarked: identifyClassShowMarked,
		identifyClassTeardown: identifyClassTeardown,
		ih: forceImageHeight,
		inlineFootnotes: inlineFootnotes,
		insertAroundAll: insertAroundAll,
		insertElementBeforeSelectionAnchor: insertElementBeforeSelectionAnchor,
		insertHrBeforeAll: insertHrBeforeAll,
		insertSpacesAround: insertSpacesAround,
		insertStyle: insertStyle,
		insertStyleHighlight: insertStyleHighlight,
		inspect: inspect,
		iw: forceImageWidth,
		joinAdjacentElements: joinAdjacentElements,
		joinByBrs: joinByBrs,
		joinMarkedElements: joinMarkedElements,
		joinParagraphsByLastChar: joinParagraphsByLastChar,
		listSelectorsWithLightBackgrounds: listSelectorsWithLightBackgrounds,
		logAllClassesFor: logAllClassesFor,
		makeAllTextLowerCase: makeAllTextLowerCase,
		makeButtonsReadable: makeButtonsReadable,
		makeChildOf: makeChildOf,
		makeDocumentHierarchical: makeDocumentHierarchical,
		makeFileLinksRelative: makeFileLinksRelative,
		makeOL: makeOL,
		makeParagraphsByLineBreaks: makeParagraphsByLineBreaks,
		makePlainText: makePlainText,
		makeUL: makeUL,
		mapIdsToClasses: mapIdsToClasses,
		mark: mark,
		markBlockElementsContainingText: markBlockElementsContainingText,
		markByChildrenHavingTheExactText: markByChildrenHavingTheExactText,
		markByClassOrIdContaining: markByClassOrIdContaining,
		markByCssRule: markByCssRule,
		markBySelector: markBySelector,
		markBySelectorAndNormalizedText: markBySelectorAndNormalizedText,
		markBySelectorAndRegex: markBySelectorAndRegex,
		markByTagNameAndText: markByTagNameAndText,
		markElementsWithChildrenSpanning: markElementsWithChildrenSpanning,
		markElementsWithSetWidths: markElementsWithSetWidths,
		markNavigationalLists: markNavigationalLists,
		markNodesBetweenMarkers: markNodesBetweenMarkers,
		markNumericElements: markNumericElements,
		markOverlays: markOverlays,
		markUppercaseElements: markUppercaseElements,
		moveDataTestIdToClassName: moveDataTestIdToClassName,
		moveIdsFromSpans: moveIdsFromSpans,
		normaliseWhitespaceForParagraphs: normaliseWhitespaceForParagraphs,
		normalizeAllWhitespace: normalizeAllWhitespace,
		numberDivs: numberDivs,
		numberTableRowsAndColumns: numberTableRowsAndColumns,
		om: toggleMutationObserver,
		persistStreamingImages: persistStreamingImages,
		remove: remove,
		removeAllAttributesExcept: removeAllAttributesExcept,
		removeAllAttributesOf: removeAllAttributesOf,
		removeAllAttributesOfType: removeAllAttributesOfType,
		removeAllEmphasis: removeAllEmphasis,
		removeAllHighlights: removeAllHighlights,
		removeAttributeOf: removeAttributeOf,
		removeColorsFromInlineStyles: removeColorsFromInlineStyles,
		removeEmojis: removeEmojis,
		removeEventListeners: removeEventListeners,
		removeHighlightsFromMarkedElements: removeHighlightsFromMarkedElements,
		removeInlineStyles: removeInlineStyles,
		removePeriodsFromAbbreviations: removePeriodsFromAbbreviations,
		removeQueryParameterFromLinks: removeQueryParameterFromLinks,
		removeQueryStringFromImageSources: removeQueryStringFromImageSources,
		removeQueryStringFromLinks: removeQueryStringFromLinks,
		removeQueryStringFromLinksMatching: removeQueryStringFromLinksMatching,
		removeRedundantDivs: removeRedundantDivs,
		removeRedundantHrs: removeRedundantHrs,
		removeSpanTags: removeSpanTags,
		removeUnnecessaryClasses: removeUnnecessaryClasses,
		replaceAudio: replaceAudio,
		replaceBrs: replaceBrs,
		replaceBrsInPres: replaceBrsInPres,
		replaceByClassOrIdContaining: replaceByClassOrIdContaining,
		replaceClass: replaceClass,
		replaceClassesWithCustomElements: replaceClassesWithCustomElements,
		replaceCommonClasses: replaceCommonClasses,
		replaceDiacritics: replaceDiacritics,
		replaceElementsBySelector: replaceElementsBySelector,
		replaceElementsOfMarkedTypeWith: replaceElementsOfMarkedTypeWith,
		replaceEmptyAnchors: replaceEmptyAnchors,
		replaceEmptyParagraphsWithHr: replaceEmptyParagraphsWithHr,
		replaceFontTags: replaceFontTags,
		replaceIframes: replaceIframes,
		replaceImagesWithAltText: replaceImagesWithAltText,
		replaceImagesWithTextLinks: replaceImagesWithTextLinks,
		replaceInClassNames: replaceInClassNames,
		replaceInlineStylesWithClasses: replaceInlineStylesWithClasses,
		replaceInTextNodes: replaceInTextNodes,
		replaceLongTextLinks: replaceLongTextLinks,
		replaceMarkedElements: replaceMarkedElements,
		replaceMarkedWithTextElement: replaceMarkedWithTextElement,
		replaceNonStandardElements: replaceNonStandardElements,
		replaceQueryParameter: replaceQueryParameter,
		replaceSpecialCharacters:replaceSpecialCharacters,
		replaceTables: replaceTables,
		rescueOrphanedInlineElements: rescueOrphanedInlineElements,
		rescueOrphanedTextNodes: rescueOrphanedTextNodes,
		retrieve: retrieve,
		retrieveBySelectorAndText: retrieveBySelectorAndText,
		retrieveLargeImages: retrieveLargeImages,
		revealEmptyLinks: revealEmptyLinks,
		revealLinkHrefs: revealLinkHrefs,
		selectElementsEndingWithText: selectElementsEndingWithText,
		selectElementsStartingWithText: selectElementsStartingWithText,
		setAttributeOf: setAttributeOf,
		setClassByDepth: setClassByDepth,
		setDocTitle: setDocTitle,
		setGroupTagName: setGroupTagName,
		setItalicTag: setItalicTag,
		setMarkerClass: setMarkerClass,
		setQueryParameter: setQueryParameter,
		setReplacementTag1: setReplacementTag1,
		setReplacementTag2: setReplacementTag2,
		shortenIds: shortenIds,
		showAttributes: showAttributes,
		showHtmlComments: showHtmlComments,
		showPrintLink: showPrintLink,
		showResources: showResources,
		showSavedStreamingImages: showSavedStreamingImages,
		showSelectorsHeavy: showSelectorsHeavy,
		showTags: showTags,
		showVersion: showVersion,
		simplifyClassNames: simplifyClassNames,
		singleQuotesToDoubleQuotes: singleQuotesToDoubleQuotes,
		splitByBrs: splitByBrs,
		swapElementPositions: swapElementPositions,
		tabifySpacesInPres: tabifySpacesInPres,
		toggleBlockEditMode: toggleBlockEditMode,
		toggleContentEditable: toggleContentEditable,
		toggleHighlightMap: toggleHighlightMap,
		toggleHighlightSelectionMode: toggleHighlightSelectionMode,
		toggleMutationObserver: toggleMutationObserver,
		toggleNimbusStyles: toggleNimbusStyles,
		toggleShowEmptyLinksAndSpans: toggleShowEmptyLinksAndSpans,
		toggleShowSelectors: toggleShowSelectors,
		toggleStyleNegative: toggleStyleNegative,
		unhideNonVideoContent: unhideNonVideoContent,
		unhighlightAll: removeAllHighlights,
		unmark: unmark,
		unmarkAll: unmarkAll,
		unmarkFromBeginning: unmarkFromBeginning,
		unmarkFromEnd: unmarkFromEnd,
		unwrapAll: unwrapAll,
		wrapAll: wrapAll,
		wrapAllInner: wrapAllInner,
		wrapAnchorNodeInTag: wrapAnchorNodeInTag,
		xlog: xlog,
		xPathMark: xPathMark,
		ylog: ylog,
	},
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
	BLOCK_ELEMENTS: {
		DIV: true,
		P: true,
		BLOCKQUOTE: true,
		HGROUP: true,
		H1: true,
		H2: true,
		H3: true,
		H4: true,
		H5: true,
		H6: true,
		OL: true,
		UL: true,
		LI: true,
		HEAD: true,
		FIGURE: true,
		FIGCAPTION: true,
		PRE: true,
		DT: true,
		DD: true,
		MESSAGE: true,
		ANNOTATION: true,
		TD: true,
		QUOTE: true,
		QUOTEAUTHOR: true,
		ASIDE: true,
		SECTION: true,
		ARTICLE: true,
		NAV: true,
		FOOTNOTE: true,
		HEADER: true,
		FOOTER: true,
		HR: true,
		RT: true,
		STYLE: true,
	},
	INLINE_ELEMENTS: {
		SUP: true,
		SUB: true,
		SPAN: true,
		FONT: true,
		EM: true,
		I: true,
		STRONG: true,
		B: true,
		A: true,
		TIME: true,
		CODE: true,
		KBD: true,
		TT: true,
		SAMP: true,
		CITE: true,
	},
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
		classes: [],
		markedClasses: [],
		currentClass: null,
		currentIndex: -1,
	},
	goToNextElement: {
		selector: null,
		elements: [],
		currentElement: null,
	},
	symbolsString: "∆∑σ√∫αβγλμνπΦϕΨψρστυ≃°θΩω⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉—",
	symbols: {
		delta: "∆",
		sigmaUpper: "∑",
		sigmaLower: "σ",
		pi: "π",
		phiUpper: "Φ",
		phiLower: "ϕ",
		psiUpper: "Ψ",
		psiLower: "ψ",
		rho: "ρ",
		tau: "τ",
		squareRoot: "√",
		lambda: "λ",
		gamma: "γ",
		mu: "μ",
		nu: "ν",
		theta: "θ",
		omegaUpper: "Ω",
		omegaLower: "ω",
		pow0: "⁰",
		pow1: "¹",
		pow2: "²",
		pow3: "³",
		sub0: "₀",
		sub1: "₁",
		sub2: "₂",
		sub3: "₃",
		degree: "°",
		emdash: "—",
		pbar: "p̄",
		qbar: "q̄",
		hbar: "h̄",
	},
	videoFilter: {
		enabled: false,
		currentIndex: -1,
		styles: [
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
		],
	},
};

Nimbus.blockElementSelector = Object.keys(Nimbus.BLOCK_ELEMENTS).join();

const MATCH_TYPE = {
	CONTAINS_BEGINNING: 1,
	CONTAINS_END: 2
};

const KEYCODES = Nimbus.KEYCODES;

const STYLES = {
	FONT_01: `
		*, p, li { font-family: "swis721 cn bt"; }
		a { text-decoration: none; }
	`,
	MIN_FONT_SIZE: `* { font-size: calc(22px + 0.0001vh); line-height: 1.4; }`,
	GITHUB_HIDE_DELETE_DIFFS: ".blob-num-deletion, .blob-code-deletion { display: none; }",
	DIM_BODY: 'html, body { background: #000; color: #AAA; } body { opacity: 0.7; } ',
	SIMPLE_NEGATIVE: `
		html, body, body[class] { background: #000; font-family: "swis721 cn bt"; font-size: 22px; }
		*, *[class], *[class][class] { background: rgba(0,0,0,0.4); color: #B0B0B0; border-color: transparent; background-image: none; border-radius: 0; font-size: calc(16px + 0.00001vh); font-family: "swis721 cn bt"; }
		*::before, *::after { opacity: 0.25; }
		span, input, button { border-radius: 0; }
		h1, h2, h3, h4, h5, h6, b, strong, em, i { color: #EEE; }
		mark { color: #FF0; }
		a, a[class] *, * a[class] { color: #05C; }
		a:hover, a:hover *, a[class]:hover *, * a[class]:hover { color: #CCC; }
		a:visited, a:visited *, a[class]:visited *, * a[class]:visited { color: #C55; }
		*[class*=stock][class] { background: #080; }
		*[class*=hover][class] { background: #000; }
		button[class], button[class][class], input[class], textarea[class] { border: 1px solid #333; background: #333; color: #AAA; }
		button[class]:focus, button[class][class]:focus, input[class]:focus, textarea[class]:focus, button[class]:hover, input[class]:hover, textarea[class]:hover { border: 1px solid #CCC; color: #FFF; }
		img, svg { opacity: 0.5; }
		img:hover, a:hover img { opacity: 1; }
	`,
	SIMPLE_NEGATIVE_2: `
		html { background: #000; }
		body { background: #181818; color: #777; font-family: "swis721 cn bt"; }
		* { box-shadow: none; background-image: none; font-family: inherit; border-radius: 0; }
		*::before, *::after { opacity: 0.25; }
		table { border-collapse: collapse; }
		nav, header, footer { background: #111; }
		div { background: #181818; }
		td { background: #1C1C1C; }
		ol, ul, li { background: transparent; }
		div, tr, td { border: 0; }
		a:link { color: #05C; background: #111; }
		a:visited { color: #C55; background: #111; }
		a:hover, a:focus { color: #0CC; background: #222; }
		span, input, button { border-radius: 0; }
		span { border: 0; color: inherit; }
		input { background: #111; border: 1px solid #333; }
		button { background: #111; border: 1px solid #555; }
		img, svg { opacity: 0.5; }
	`,
	SIMPLE_NEGATIVE_3: `
		html { background: #000; color: #999; font-size: 18px; }
		body { background: #222; padding: 10rem; margin: 1rem 10rem; }
		pre { padding: 1rem };
		pre, code { background: #000; font-family: "swis721 cn bt"; font-weight: bold; }
		h1, h2, h3, h4, h5, h6 { background: #111; color: #AAA; padding: 0.5rem 1rem; margin: 0 0 2px 0; font-weight: normal; }
		p { background: #282828; padding: 0.5rem 1rem; margin: 0 0 2px 0; }
		a { text-decoration: none; }
	`,
	VIEW_VIDEO_01: `
		html { background: #000; color: #999; font-size: 12px; }
		body { background: #000; overflow: hidden; }
		* { border: 0; text-shadow: none; font-size: 12px; color: #555; }
		a { text-decoration: none; }
		img { display: none; }
		.jw-text-track-display { opacity: 0.75; margin-top: 30px; }
		.jw-text-track-cue { background: transparent; line-height: 1.4; font-size: 14px; }
	`,
	OUTLINE_ELEMENTS: `header, footer, article, aside, section, div, blockquote, canvas { box-shadow: inset 2px 2px #06C, inset -2px -2px #06C; }
		form, input, button, label { box-shadow: inset 2px 2px #C60, inset -2px -2px #C60; background: rgba(255, 150, 0, 0.2); }
		table, tr, td { box-shadow: inset 2px 2px #04C, inset -2px -2px #04C; }
		th { box-shadow: inset 2px 2px #048, inset -2px -2px #048; }
		ul, ol { box-shadow: inset 2px 2px #0A0, inset -2px -2px #0A0; }
		li { box-shadow: inset 2px 2px #070, inset -2px -2px #070; }
		sup, sub { box-shadow: inset 2px 2px #68A, inset -2px -2px #68A; }
		span { box-shadow: inset 2px 2px #AA0, inset -2px -2px #AA0; }
		font { box-shadow: inset 2px 2px #C60, inset -2px -2px #C60; }
		abbr { box-shadow: inset 2px 2px #A40, inset -2px -2px #A40; }
		nobr { box-shadow: inset 2px 2px #A0A, inset -2px -2px #A0A; }
		cite { box-shadow: inset 2px 2px #0C0, inset -2px -2px #0A0; }
		code { box-shadow: inset 2px 2px #0C0, inset -2px -2px #0A0; }
		small { box-shadow: inset 2px 2px #088, inset -2px -2px #088; }
		p { box-shadow: inset 2px 2px #909, inset -2px -2px #505; }
		mark, markyellow, markred, markgreen, markblue, markpurple, markwhite { box-shadow: inset 2px 2px #888, inset -2px -2px #888; }
		a, a * { background: rgba(180, 255, 0, 0.25); }
		img { background: #800; padding: 2px; box-sizing: border-box; }
	`,
	SHOW_SELECTORS: `
		*[class]::before { content: attr(class); color: #C90; background: #000; padding: 2px 6px; font: bold 18px "Swis721 Cn BT"; }
		*[id]::before { content: attr(id); color: #C0C; background: #000; padding: 2px 6px; font: bold 18px "Swis721 Cn BT"; }
		*[id][class]::before { content: "#"attr(id) "."attr(class); color: #C90; background: #000; padding: 2px 6px; font: bold 18px "Swis721 Cn BT"; }

		div, p, blockquote, hgroup, h1, h2, h3, h4, h5, h6, ol, ul, li, head, figure, figcaption, pre, dt, dd, message, annotation, td, article { box-shadow: inset 4px 4px #444, inset -4px -4px #111; margin: 4px; padding: 4px; }
		small, big, sup, sub, abbr, time, cite { box-shadow: inset 2px 2px #357, inset -2px -2px #357; }
		font { box-shadow: inset 2px 2px #C90, inset -2px -2px #C90; }
		span { box-shadow: inset 0 -100px #040; padding: 4px; border: 2px solid #0A0; }
		span span { padding: 0px; }

		h1::after { content: "h1"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }
		h2::after { content: "h2"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }
		h3::after { content: "h3"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }
		h4::after { content: "h4"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }
		h5::after { content: "h5"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }
		h6::after { content: "h6"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }

		message::before, autocompleteinputwrapper::before, autocompleteinputwrapper *::before, #userInputWrapper::before, #userInputWrapper *::before { display: none; }
		message *, autocompleteinputwrapper, autocompleteinputwrapper *, #userInputWrapper, #userInputWrapper * { box-shadow: none; }
	`,
	SHOW_SELECTORS_MINIMAL: `
		*[class]::before { content: attr(class); color: #F90; background: #000; padding: 2px 6px; font: 16px "swis721 cn bt"; }
		*[id]::before { content: attr(id); color: #F0F; background: #000; padding: 2px 6px; font: 16px "swis721 cn bt"; }
		*[id][class]::before { content: "#"attr(id) "."attr(class); color: #0DD; background: #000; padding: 2px 6px; font: 16px "swis721 cn bt"; }
	`,
	PAD_BLOCK_ELEMENTS: `
		div, p, hgroup, article, nav, footnote, header, footer { margin: 4px; padding: 4px; }
	`,
	SHOW_TABLE_STRUCTURE: 'th { background-image: linear-gradient(45deg, #000, #888); } td { background-image: linear-gradient(45deg, #000, #555); } th *, td * { background: transparent; color: #FFF; fill: #999; }',
	INSPECTOR: `
		body.inspector { padding-bottom: 30vh; }
		div#inspector { padding: 5px 10px; position: fixed; left: 0; bottom: 0; width: 50%; min-width: 500px; height: 30vh; overflow: hidden; background:#000; color: #AAA; text-align:left; z-index: 2147483647; font: bold 18px "Swis721 Cn BT", verdana; letter-spacing: 0; box-shadow: none; min-height: 30vh; margin: 0; }
		#inspector.onTop { bottom: auto; top: 0; }
		#inspector b { color:#09F; }
		#inspector em { font-style:normal; color:#F90; }
		.hovered { filter: contrast(1.5); }
		#inspector div { box-shadow: none; margin: 0; padding: 0; }
		#inspector::after, #inspector div::after { display: none; }
	`,
	INVERT_IMAGES: "img { filter: invert(1) hue-rotate(180deg); }",
};

//	Useful wrapper around document.querySelector() and document.querySelectorAll()
//	Returns an array of nodes except when the selector is an id selector, in which case it
//	returns a single node.
function get(selector)
{
	let nodes;
	if(selector === "h") selector = "h1, h2, h3, h4, h5, h6";
	try
	{
		nodes = document.querySelectorAll(selector);
	}
	catch(error)
	{
		showMessageError("Invalid selector: " + selector);
		return false;
	}
	if(nodes.length)
		return Array.from(nodes);
	return false;
}

function getOne(selector)
{
	return document.querySelector(selector);
}

function count(selector)
{
	const elems = get(selector);
	const count = elems ? elems.length : 0;
	showMessageBig(count + " elements matching " + selector);
}

//	This function will delete from the DOM tree anything that's passed to it,
//	whether that's a node, an array of nodes, a selector, or an array of selectors.
function del(arg)
{
	if(!arg)
		return;
	if(arg.nodeType)
		arg.remove();
	else if(arg.length)
		if(typeof arg === "string")
			del(get(arg));
		else
			for(let i = 0, ii = arg.length; i < ii; i++)
				del(arg[i]);
}

function getOrCreate(tagName, id, parent)
{
	const elem = getOne("#" + id);
	if(elem)
		return elem;
	const container = parent || document.body;
	const newElem = createElement(tagName, { id: id });
	container.appendChild(newElem);
	return newElem;
}

function XpathNodesToArray(nodes)
{
	let selected = Array.from({ length: nodes.snapshotLength });
	for(let i = 0, ii = selected.length; i < ii; i++)
		selected[i] = nodes.snapshotItem(i);
	return selected;
}

function getTextNodesUnderElement(elem)
{
	return XpathNodesToArray(document.evaluate(".//text()", elem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}

function getTextNodesUnderElementMatching(elem, text)
{
	return XpathNodesToArray(document.evaluate(`.//text()[contains(., "${text}")]`, elem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}

function getTextNodesUnderSelector(tagName, strClass)
{
	let xpathString;
	if(tagName && strClass)
		xpathString = `//${tagName}[contains(@class, '${strClass}')]//text()`;
	else if(tagName)
		xpathString = `//${tagName}//text()`;
	else if(strClass)
		xpathString = `//*[contains(@class, '${strClass}')]//text()`;
	return getXpathResultAsArray(xpathString);
}

function getXpathResultAsArray(xpath)
{
	return XpathNodesToArray(document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null));
}

function xPathSelect(xpath, context)
{
	const xPathContext = context || document;
	return XpathNodesToArray(document.evaluate(xpath, xPathContext, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null));
}

function xPathMark(xpath)
{
	const elements = xPathSelect(xpath);
	if(elements.length)
		markElements(elements);
	else
		showMessageBig("No matches found");
}

function getTextNodesExcludingPre()
{
	function filter(node)
	{
		if (node.parentElement.closest('pre, code'))
		{
			return NodeFilter.FILTER_REJECT;
		}
		return NodeFilter.FILTER_ACCEPT;
	}
	const textNodes = [];
	const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, filter);
	let node;
	while ((node = walker.nextNode()))
	{
		textNodes.push(node);
	}
	return textNodes;
}

function markElement(elem) { elem.classList.add(Nimbus.markerClass); }
function unmarkElement(elem) { elem.classList.remove(Nimbus.markerClass); }

function markElements(elements)
{
	if(!elements)
	{
		showMessageBig("No elements found");
		return;
	}
	for(let i = 0, ii = elements.length; i < ii; i++)
		markElement(elements[i]);
	showMessageBig("Marked " + elements.length + " elements");
}

function unmarkElements(elements)
{
	if(!elements) return;
	for(let i = 0, ii = elements.length; i < ii; i++)
		unmarkElement(elements[i]);
}

function highlightElements(elems)
{
	const elements = elems.nodeType ? [elems] : elems;
	if(!(elements && elements.length))
	{
		showMessageError("highlightElements(): no elements given");
		return;
	}
	const BLOCK_ELEMENTS = Nimbus.BLOCK_ELEMENTS;
	const firstElement = elements[0];
	const highlightTagName = Nimbus.highlightTagName;
	//	Assumption: the elements are all of the same type
	if(firstElement.tagName === "TR")
	{
		highlightTableRows(elements);
		return;
	}
	else if(BLOCK_ELEMENTS[firstElement.tagName])
	{
		for(let i = 0, ii = elements.length; i < ii; i++)
			wrapElementInner(elements[i], highlightTagName);
	}
	else
	{
		for(let i = 0, ii = elements.length; i < ii; i++)
			wrapElement(elements[i], highlightTagName);
	}
}

function deleteElements(elems)
{
	const elements = elems.nodeType ? [elems] : elems;
	if(!(elements && elements.length))
		return;
	del(elements);
	showMessageBig(`Deleted ${elements.length} elements`);
}

function retrieveElements(elems)
{
	if(!elems) return;
	const docTitle = document.title;
	const elements = elems.nodeType ? [elems] : elems;
	if(!(elements && elements.length))
		return;
	const wrapper = document.createElement("div");
	for(let i = 0, ii = elements.length; i < ii; i++)
		wrapper.appendChild(elements[i]);
	emptyElement(document.body);
	del(["link", "script"]);
	document.body.appendChild(wrapper);
	document.title = docTitle;
	showMessageBig(`Retrieved ${elements.length} elements`);
}

function selectElementsStartingWithText(selector, text)
{
	const elems = get(selector);
	if(!elems) return;
	const selected = [];
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(elem.textContent && elem.textContent.trim().indexOf(text) === 0)
			selected.push(elem);
	}
	return selected;
}

function selectElementsEndingWithText(selector, text)
{
	const elems = get(selector);
	if(!elems) return;
	const textLength = text.length;
	const selected = [];
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const elemText = elem.textContent.trim();
		if(elemText && elemText.length && elemText.lastIndexOf(text) === elemText.length - textLength)
			selected.push(elem);
	}
	return selected;
}

function selectByTagNameMatching(text)
{
	const selected = [];
	const textUpper = text.toUpperCase();
	const e = Array.from( document.body.getElementsByTagName("*") );
	for(let i = 0, ii = e.length; i < ii; i++)
	{
		const elem = e[i];
		if(!elem || !elem.nodeType)
			continue;
		const elemTagName = elem.tagName;
		if(elemTagName && ~elemTagName.indexOf(textUpper))
			selected.push(elem);
	}
	return selected;
}

function selectByClassOrIdContaining(str)
{
	const strLower = str.toLowerCase();
	const elems = get("body *");
	if(!elems) return;
	const selected = [];
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const node = elems[i];
		if(node && ~node.className.toString().toLowerCase().indexOf(strLower) || ~node.id.toString().toLowerCase().indexOf(strLower))
			selected.push(node);
	}
	return selected;
}

function selectByChildrenWithText(params)
{
	const { parentTagName, parentClass, childTagName, text, exactMatch } = params;
	let parentClause, childClause;
	if(parentTagName)
	{
		if(parentClass)
			parentClause = `/ancestor::${parentTagName}[contains(@class, '${parentClass}')]`;
		else
			parentClause = `/ancestor::${parentTagName}`;
	}
	if(childTagName && text)
	{
		if(exactMatch)
			childClause = `//${childTagName}[text()='${text}']`;
		else
			childClause = `//${childTagName}[contains(text(), '${text}')]`;
	}
	if(!(parentClause && childClause))
	{
		showMessageError("Invalid parameters");
		return false;
	}
	return xPathSelect(childClause + parentClause);
}

function markByChildrenHavingTheExactText(...args)
{
	let parentTagName, parentClass, childTagName, text;
	const params = { exactMatch: true };
	switch(args.length)
	{
		case 3:
			parentTagName = args[0];
			childTagName = args[1];
			text = args[2];
			break;
		case 4:
			parentTagName = args[0];
			parentClass = args[1];
			childTagName = args[2];
			text = args[3];
			break;
		default:
			showMessageError("Invalid arguments");
			return false;
	}
	let isValid = false;
	if(parentTagName && childTagName && text)
	{
		params.parentTagName = parentTagName;
		params.childTagName = childTagName;
		params.text = text;
		isValid = true;
	}
	if(parentClass)
		params.parentClass = parentClass;
	if(isValid)
	{
		const elems = selectByChildrenWithText(params);
		let i = elems.length;
		showMessageBig(`Found ${i} elements`);
		while(i--)
			markElement(elems[i]);
		insertStyleHighlight();
	}
}

//	Marks elements that have children of a given type that contain all the parent's text
function markElementsWithChildrenSpanning(parentSelector, childSelector)
{
	const parents = get(parentSelector);
	if(!parents) return;
	let i = parents.length;
	while(i--)
	{
		const parent = parents[i];
		if(!parent.textContent)
			continue;
		const children = Array.from(parent.querySelectorAll(childSelector));
		let parentTextLength = getTextLength(parent);
		const childrenTextLength = children.reduce((acc, child) => acc + getTextLength(child), 0);
		if(parentTextLength === childrenTextLength)
			markElement(parent);
	}
}

function removeRedundantDivs()
{
	const elems = get("div");
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		let isRedundant = true;
		for(const child of elem.childNodes)
		{
			if((child.nodeType === 3 && child.data.replace(/\s+/g, "").length > 0) || (child.nodeType === 1 && child.tagName !== "DIV"))
			{
				isRedundant = false;
				break;
			}
		}
		if(isRedundant)
			unwrapElement(elem);
	}
}

function debounce(func, delay)
{
	var timeout;
	return function()
	{
		var context = this;
		var args = arguments;
		var debounced = function()
		{
			timeout = null;
			func.apply(context, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(debounced, delay);
	};
}

function forAll(selector, callback)
{
	const elems = get(selector);
	if(!elems) return;
	const len = elems.length;
	let i = -1;
	while(++i < len)
		callback(elems[i]);
}

function getMarkedElements()
{
	const markedElements = get(makeClassSelector(Nimbus.markerClass));
	return markedElements ? markedElements : [];
}

function getFirstMarkedElement()
{
	const markedElement = getOne(makeClassSelector(Nimbus.markerClass));
	return markedElement ? markedElement : false;
}

function forAllMarked(func)
{
	const elements = getMarkedElements();
	for(let i = 0, ii = elements.length; i < ii; i++)
		if(elements[i])
			func.call(null, elements[i]);
}

function getMarkedHTML()
{
	const id = "nimbusMarkedInnerHTML";
	function destroy()
	{
		const elem = getOne(id);
		if(elem) elem.remove();
		del("#" + id);
	}
	const elem = getOne(".markd");
	if(!elem) return;
	const ta = document.createElement("textarea");
	ta.id = id;
	ta.value = elem.innerHTML;
	ta.setAttribute("style", "position: fixed; top: 100px; left: 100px; width: 80vw; height: 80vh;");
	document.body.appendChild(ta);
	ta.focus();
	ta.select();
	setTimeout(destroy, 3000);
}

function setAttributeOrProperty(element, key, value)
{
	const settableProperties = ["id", "className", "textContent", "innerHTML", "value"];
	if(settableProperties.includes(key))
		element[key] = value;
	else
		element.setAttribute(key, value);
}

function createElementWithText(tag, text)
{
	const elem = document.createElement(tag);
	elem.textContent = text;
	return elem;
}

function createElement(tag, props)
{
	const elem = document.createElement(tag);
	if(props && typeof props === "object")
	{
		const keys = Object.keys(props);
		let i = keys.length;
		while(i--)
		{
			const key = keys[i];
			const value = props[key];
			setAttributeOrProperty(elem, key, value);
		}
		return elem;
	}
	return elem;
}

function removeRedundantHrs()
{
	const makesHrRedundant = {
		H1: true,
		H2: true,
		H3: true,
		H4: true,
		H5: true,
		H6: true,
		HR: true,
		FIGURE: true,
		FIGCAPTION: true,
		FOOTNOTE: true,
		RT: true,
		BLOCKQUOTE: true,
		HEADER: true,
		UL: true,
		OL: true,
		PRE: true,
	};
	const elems = get("hr");
	let count = 0;
	for(const elem of elems)
	{
		const prev = elem.previousElementSibling;
		const next = elem.nextElementSibling;
		if( (prev && makesHrRedundant[prev.tagName]) || (next && makesHrRedundant[next.tagName]) )
		{
			count++;
			elem.remove();
		}
	}
	const firstAndLastHrs = get("hr:first-child, hr:last-child");
	if(firstAndLastHrs.length) {
		count += firstAndLastHrs.length;
		del(firstAndLastHrs);
	}
	showMessageBig(count + " redundant hrs removed");
}

function removeLineBreaks(str)
{
	return str.replace(/[\r\n\s]+/g, " ");
}

function trimNonAlphanumeric(str)
{
	if(!str)
		return null;
	return str.replace(/^[^A-Za-z0-9]+/, '').replace(/[^A-Za-z0-9]+$/, '');
}

function trimSpecialChars(str)
{
	if(!str)
		return null;
	return str.replace(/^[^A-Za-z0-9\(\)\[\]]+/, '').replace(/[^A-Za-z0-9\(\)\[\]]+$/, '');
}

function ltrim(str)
{
	return str.replace(/^\s+/, '');
}

function trimAt(str, sub)
{
	const index = str.indexOf(sub);
	if(index === -1)
		return str;
	return str.substring(0, index);
}

function trimAtInclusive(str, sub)
{
	const index = str.indexOf(sub);
	if(index === -1)
		return str;
	return str.substring(0, index + sub.length);
}

function trimStartingAt(str, sub)
{
	const index = str.indexOf(sub);
	if(index === -1)
		return str;
	return str.substring(index);
}

function trimBetween(str, sub1, sub2)
{
	const index1 = str.indexOf(sub1);
	const index2 = str.indexOf(sub2);
	if(!(~index1 && ~index2))
		return str;
	return str.substring(index1 + sub1.length, index2);
}

function padLeft(str, width)
{
	let spaces = "";
	for(let i = 0, ii = width - str.length; i < ii; i++)
		spaces += " ";
	return spaces + str;
}

function padRight(str, width)
{
	let spaces = "";
	for(let i = 0, ii = width - str.length; i < ii; i++)
		spaces += " ";
	return str + spaces;
}

function normalizeWhitespace(str) { return str.replace(/\s+/g, " "); }
function removeWhitespace(str) { return str.replace(/\s+/g, ''); }
function normalizeString(str) { return removeWhitespace(str.toLowerCase()); }
function normalizeHTML(html) { return html.replace(/&nbsp;/g, " ").replace(/\s+/g, " "); }
function removeNonAlpha(str) { return str.replace(/[^A-Za-z]/g, ''); }

function capitalize(text)
{
	const words = text.split(" ");
	let str = "";
	for(const word of words)
	{
		if(word.length > 1 && (!/[a-z]+/.test(word) || /^[A-Z]+'\w+$/.test(word)) || word === "I")
			str += word + " ";
		else
			str += word.toLowerCase() + " ";
	}
	str = str.trim();
	return str[0].toUpperCase() + str.slice(1);
}

function escapeHTML(html)
{
	const escapeElem = createElement("textarea");
	escapeElem.textContent = html;
	return escapeElem.innerHTML;
}

function unescapeHTML(html)
{
	const escapeElem = createElement("textarea");
	escapeElem.innerHTML = html;
	return escapeElem.textContent;
}

function containsAnyOfTheStrings(s, arrStrings)
{
	if(!s || typeof s !== "string")
		return false;
	let i = arrStrings.length;
	while(i--)
		if(~s.indexOf(arrStrings[i]))
			return true;
	return false;
}

function containsAllOfTheStrings(s, arrStrings)
{
	if(typeof s !== "string")
		return false;
	let i = arrStrings.length;
	let found = 0;
	while(i--)
		if(~s.indexOf(arrStrings[i]))
			found++;
	if(found === arrStrings.length)
		return true;
	return false;
}

function startsWithAnyOfTheStrings(s, arrStrings)
{
	if(!s || typeof s !== "string")
		return false;
	for(let i = 0, ii = arrStrings.length; i < ii; i++)
		if(s.indexOf(arrStrings[i]) === 0)
			return true;
	return false;
}

function fixLineBreaks()
{
	const spans = get("span");
	if(spans)
	{
		for(let i = 0, ii = spans.length; i < ii; i++)
		{
			const span = spans[i];
			if(span.textContent.endsWith('\n'))
				span.appendChild(document.createElement("br"));
		}
	}
	var marked = getOne(makeClassSelector(Nimbus.markerClass));
	if(marked)
	{
		marked.innerHTML = marked.innerHTML.replace(/\n+/g, "<br>");
		splitByBrs(makeClassSelector(Nimbus.markerClass));
	}
}

function joinByBrs(selector)
{
	const brs = get(selector + " br");
	if(!brs) return;
	for(let i = 0, ii = brs.length; i < ii; i++)
	{
		const br = brs[i];
		br.parentNode.replaceChild(document.createTextNode(" "), br);
	}
}

function hasChildrenOfType(elem, selector) { return elem.querySelector(selector) === null ? false: true; }

function hasDirectChildrenOfType(elem, selector)
{
	const children = elem.children;
	if(!children.length) return false;
	for(let i = 0, ii = children.length; i < ii; i++)
		if(children[i].matches(selector)) return true;
	return false;
}

function hasOnlyChildOfType(elem, selector)
{
	const children = elem.children;
	if(!children.length) return false;
	if(children.length !== 1) return false;
	if(children[0].matches(selector)) return true;
	return false;
}

function convertLineBreaksToBrs(selectorOrElement)
{
	const elems = typeof selectorOrElement === "string" ? get(selectorOrElement) : [selectorOrElement];
	if(!elems) return;
	for(const elem of elems)
		elem.innerHTML = elem.innerHTML.replaceAll("\n", "<br>");
}

function makeParagraphsByLineBreaks(selector) {
	const elems = selector ? get(selector) : getMarkedElements();
	if(!elems) return;
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const splat = elem.textContent.split("\n");
		const tempWrapper = document.createElement("div");
		for(let i = 0, ii = splat.length; i < ii; i++)
		{
			const para = document.createElement("p");
			para.textContent = splat[i];
			tempWrapper.appendChild(para);
		}
		emptyElement(elem);
		while(tempWrapper.firstChild)
			elem.appendChild(tempWrapper.firstChild);
	}
}

function splitByBrs(selectorOrElement, wrapperTagName, childTagName)
{
	const elems = typeof selectorOrElement === "string" ? get(selectorOrElement) : [selectorOrElement];
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(!hasDirectChildrenOfType(elem, "BR"))
			continue;
		const WRAPPER_TAGNAME = (wrapperTagName || elem.tagName).toUpperCase();
		const CHILD_TAGNAME = (childTagName || "P").toUpperCase();
		const elemChildNodes = elem.childNodes;
		const groups = [];
		let nodeGroup = [];
		for(let i = 0, ii = elemChildNodes.length; i < ii; i++)
		{
			let node = elemChildNodes[i];
			if(node.nodeType === 1 && node.tagName === "BR")
			{
				if(nodeGroup.length)
				{
					groups.push(nodeGroup.slice());
					nodeGroup = [];
				}
			}
			else
			{
				nodeGroup.push(node);
			}
		}
		if(nodeGroup.length)
			groups.push(nodeGroup);
		if(groups.length > 1)
		{
			const replacementWrapper = WRAPPER_TAGNAME === "P" ? document.createDocumentFragment() : document.createElement(WRAPPER_TAGNAME);
			for(let i = 0, ii = groups.length; i < ii; i++)
				replacementWrapper.appendChild(createElementWithChildren(CHILD_TAGNAME, ...groups[i]));
			if(elem.id)
				replacementWrapper.id = elem.id;
			elem.parentNode.replaceChild(replacementWrapper, elem);
		}
	}
}

function replaceBrs()
{
	const brs = get("br");
	if(!brs) return;
	for(let i = 0, ii = brs.length; i < ii; i++)
	{
		const parent = brs[i].parentNode;
		if(parent) parent.classList.add("hasBrs");
	}
	const elems = get(".hasBrs");
	if(!elems) return;
	for(let i = 0, ii = elems.length; i < ii; i++)
		splitByBrs(elems[i]);
	replaceElementsBySelector("br", "brk");
	del("brk:first-child");
	del("brk:last-child");
}

function replaceDiacritics(str)
{
	const diacriticRegexesByLetter = {
		A: /[\u0100\u0102\u0104\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5]/g,
		a: /[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u0105\u0101\u0103]/g,
		B: /[\u00df]/g,
		C: /[\u00c7\u0106\u0108\u010a\u010c]/g,
		c: /[\u00e7\u0107\u0109\u010b\u010d]/g,
		E: /[\u00c8\u00c9\u00ca\u00cb\u0112\u0114\u0116\u0118\u011a]/g,
		e: /[\u00e8\u00e9\u00ea\u00eb\u0113\u0115\u0117\u0119\u011b]/g,
		AE: /[\u00c6]/g,
		ae: /[\u00e6]/g,
		oe: /[\u0153]/g,
		I: /[\u00cc\u00cd\u00ce\u00cf]/g,
		i: /[\u00ec\u00ed\u00ee\u00ef]/g,
		O: /[\u00d2\u00d3\u00d4\u00d5\u00d6\u00d8\u014c\u014e\u0150]/g,
		o: /[\u00f0\u00f2\u00f3\u00f4\u00f5\u00f6\u00f8\u014d\u014f\u0151]/g,
		U: /[\u00d9\u00da\u00db\u00dc]/g,
		u: /[\u00f9\u00fa\u00fb\u00fc]/g,
		N: /[\u00d1\u0143\u0145\u0147]/g,
		n: /[\u00f1\u0148\u0144\u0146]/g,
		Y: /[\u00dd\u0176\u0178]/g,
		y: /[\u00fd\u00ff\u0177]/g,
		Z: /[\u0179\u017b\u017d]/g,
		z: /[\u017a\u017c\u017e]/g,
	};
	const letters = Object.keys(diacriticRegexesByLetter);
	for(let i = 0, ii = letters.length; i < ii; i++)
	{
		const letter = letters[i];
		str = str.replace(diacriticRegexesByLetter[letter], letter);
	}
	return str;
}

function replaceSpecialCharacters()
{
	const replacements = {
		"\xa0": " ",
		// "\xa9": "(c)",
		// "\xae": "(r)",
		"\xb7": "*",
		"\u2018": "'",
		"\u2019": "'",
		"\u2032": "'",
		"\u201c": '"',
		"\u201d": '"',
		"\u2026": "...",
		"\u2002": " ",
		"\u2003": " ",
		"\u2009": " ",
		"\u2013": "-",
		"\u2122": "(tm)"
	};

	const regularExpressions = {};
	const keys = Object.keys(replacements);
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		regularExpressions[key] = new RegExp(key, 'g');
	}

	const textNodes = getTextNodesUnderSelector("body");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		let nodeText = textNode.data;
		for(let j = 0, jj = keys.length; j < jj; j++)
		{
			const key = keys[j];
			nodeText = nodeText.replace(regularExpressions[key], replacements[key]);
		}
		textNode.data = nodeText;
	}
}

function replaceTables() { replaceElementsBySelector("table, tbody, tr, td, th, thead", "div"); }

function replaceNonStandardElements()
{
	const elems = get("body *");
	if(!elems) return;
	const BLOCK_ELEMENTS = Nimbus.BLOCK_ELEMENTS;
	const INLINE_ELEMENTS = Nimbus.INLINE_ELEMENTS;
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		if(!elem.tagName)
			continue;
		if(!BLOCK_ELEMENTS[elem.tagName] && !INLINE_ELEMENTS[elem.tagName])
		{
			const replacement = convertElement(elem, "div");
			replacement.className = elem.tagName;
			if(elem.parentNode)
				elem.parentNode.replaceChild(replacement, elem);
		}
	}
}

function replaceLongTextLinks()
{
	const links = get("a");
	if(!links) return;
	for(const link of links)
	{
		if(link.getElementsByTagName("img").length)
			continue;
		if(link.textContent && link.textContent.length > 500)
		{
			const newLink = createElement("a", { textContent: "[link]", href: link.href });
			insertAfter(link, newLink);
			unwrapElement(link);
		}
	}
}

function replaceMarkedWithTextElement(tagName, text)
{
	const elems = getMarkedElements();
	if(!elems) return;
	if(tagName === "text")
	{
		for(const elem of elems)
		{
			elem.parentNode.replaceChild(document.createTextNode(text), elem);
		}
	}
	else
	{
		for(const elem of elems)
		{
			const replacement = document.createElement(tagName);
			replacement.textContent = text;
			elem.parentNode.replaceChild(replacement, elem);
		}
	}
}

function getTitleWithoutDomainTag()
{
	if(document.title)
		return document.title.replace(getBestDomainSegment(location.hostname), "").trim()	;
}

function capitalizeTitle()
{
	if(typeof document.title === "string" && document.title.length)
	{
		const title = getTitleWithoutDomainTag();
		document.title = capitalize(title);
		setDocTitle(document.title);
	}
}

function addDateToTitle()
{
	document.title = document.title + " " + getTimestamp("dateOnly");
	setDocTitle(document.title);
}

function setDocTitle(newTitle)
{
	let headingText = sanitizeTitle(newTitle || chooseDocumentHeading());
	setDocumentHeading(headingText);
	const domainSegment = getBestDomainSegment(location.hostname);
	document.title = headingText + domainSegment;
}

function sanitizeTitle(titleString)
{
	if(titleString === undefined || titleString === null)
		return;
	let sanitizedTitle;
	sanitizedTitle = titleString.toString();
	sanitizedTitle = replaceDiacritics(sanitizedTitle);

	sanitizedTitle = sanitizedTitle.replace(/&/g, " and ")
		.replace(/\u00df/g, 'SS')
		.replace(/\u0142/g, "'l")
		.replace(/\u2018/g, "'")
		.replace(/\u2019/g, "'")
		.replace(/[|\?]/g, "")
		.replace(/[\/]/g, "_")
		.replace(/:/g, " - ")
		.replace(/[^\+\(\)0-9A-Za-z_!,\[\]\-\(\)']/g, " ")
		.replace(/ , /g, ", ")
		.replace(/\s+/g, " ");

	return trimSpecialChars(sanitizedTitle);
}

function escapeForRegExp(str)
{
	const specials = /[.*+?|()\[\]{}\\]/g;
	return str.replace(specials, "\\$&");
}

function enableConsoleLogs()
{
	consoleLog = window.console.log;
	consoleWarn = window.console.warn;
	consoleError = window.console.error;
}

function disableConsoleLogs()
{
	consoleLog = consoleWarn = consoleError = noop;
}

function parseObject(o, indentLevel, parent)
{
	if(typeof indentLevel === "undefined")
		indentLevel = 0;
	let s = "";
	let type;
	let indentString = "<dd>";
	let indentStringParent = "<dd>";
	let indentStringClose = "";
	let indentStringParentClose = "";
	for(let i = 0; i < indentLevel; i++)
	{
		indentString += "<blockquote>";
		indentStringClose += "</blockquote>";
	}
	for(let i = 0; i < indentLevel - 1; i++)
	{
		indentStringParent += "<blockquote>";
		indentStringParentClose += "</blockquote>";
	}
	indentStringClose += "</dd>";
	indentStringParentClose += "</dd>";
	if(parent)
		s = indentStringParent + "<h2>" + parent + "</h2>" + indentStringParentClose;

	for(const prop in o)
	{
		if(o.hasOwnProperty(prop))
		{
			type = Object.prototype.toString.call(o[prop]);
			switch(type)
			{
				case "[object Object]":
					if(indentLevel < 2)
						s += parseObject(o[prop], indentLevel + 1, prop);
					else
						s += indentString + "<em>[object Object],</em><i>too many levels</i>" + indentStringClose;
					break;
				case "[object Array]":
					s += indentString + "<em>" + prop + "</em><i>" + "[" + arrayToString(o[prop]) + "]</i>" + indentStringClose;
					break;
				default:
					s += indentString + "<em>" + prop + "</em><i>" + o[prop] + "</i>" + indentStringClose;
					break;
			}
		}
	}
	return s;
}

function quoteIfString(arg)
{
	if(typeof arg === "string")
		return '"' + arg + '"';
	return arg;
}

//	Prints all properties of an object that match a string
function logPropertiesMatching(obj, str)
{
	str = str.toLowerCase();
	const seen = new Set();
	function traverse(object, str, path = [])
	{
		if(seen.has(object))
			return;
		seen.add(object);
		const keys = Object.keys(object);
		for(let i = 0, ii = keys.length; i < ii; i++)
		{
			const key = keys[i];
			const value = object[key];
			const fullPath = path.length ? path.join(".") + "." + key : key;
			const type = Object.prototype.toString.call(value);
			const doesMatch = key.toLowerCase().indexOf(str) !== -1;
			if(type === "[object Object]")
			{
				if(doesMatch)
					console.log(`%c${fullPath}`, "color: #0F0;", type);
				traverse(value, str, path.concat(key));
			}
			else if(doesMatch)
			{
				console.log(`%c${fullPath}`, "color: #0F0;", quoteIfString(value));
			}
		}
	}
	traverse(obj, str);
}

//	Prints all property values of an object that match a string
function logValuesMatching(obj, str)
{
	str = str.toLowerCase();
	const seen = new Set();
	function traverse(object, str, path = [])
	{
		if(seen.has(object))
			return;
		seen.add(object);
		const keys = Object.keys(object);
		for(let i = 0, ii = keys.length; i < ii; i++)
		{
			const key = keys[i];
			const value = object[key];
			const fullPath = path.length ? path.join(".") + "." + key : key;
			const type = Object.prototype.toString.call(value);
			if(type === "[object Object]")
				traverse(value, str, path.concat(key));
			else if(typeof value === "string" && value.toLowerCase().indexOf(str) !== -1)
				console.log(`%c${fullPath}`, "color: #0F0;", quoteIfString(value));
			else if(typeof value === "number" && value.toString().indexOf(str) !== -1)
				console.log(`%c${fullPath}`, "color: #0F0;", value);
		}
	}
	traverse(obj, str);
}

function parseQueryString(url)
{
	const index = url.indexOf("?");
	if(index === -1 || index > url.length - 4)
		return;
	const queryString = url.substring(index + 1);
	let queryStringSplat = queryString.split("&");
	const parsedParameters = [];
	for(let i = 0, ii = queryStringSplat.length; i < ii; i++)
	{
		const keyValuePairSplat = queryStringSplat[i].split("=");
		parsedParameters.push({
			key: keyValuePairSplat[0],
			value: keyValuePairSplat[1]
		});
	}
	return(parsedParameters);
}

function removeQueryParameterFromUrl(url, parameterName)
{
	const parsedParameters = parseQueryString(url);
	if(!parsedParameters)
		return url;
	let baseUrl = trimAt(url, "?");
	let newQueryString = "";
	for(let i = 0, ii = parsedParameters.length; i < ii; i++)
	{
		const param = parsedParameters[i].key;
		const value = parsedParameters[i].value;
		if(param !== parameterName)
			newQueryString += `${param}=${value}&`;
	}
	if(newQueryString.length)
		return(`${baseUrl}?${newQueryString}`);
	return baseUrl;
}

function removeQueryParameterFromLinks(str, selector="a[href]")
{
	const links = get(selector);
	for(const link of links)
		link.href = removeQueryParameterFromUrl(link.href, str);
}

function setQueryParameter(url, parameterName, newValue)
{
	const parsedParameters = parseQueryString(url);
	if(!parsedParameters)
		return url;
	let baseUrl = trimAt(url, "?");
	let newQueryString = "";
	for(let i = 0, ii = parsedParameters.length; i < ii; i++)
	{
		const param = parsedParameters[i].key;
		const value = parsedParameters[i].value;
		if(param !== parameterName)
			newQueryString += `${param}=${value}&`;
		else
			newQueryString += `${param}=${newValue}&`;
	}
	newQueryString = newQueryString.substring(0, newQueryString.length - 1);
	if(newQueryString.length)
		return(`${baseUrl}?${newQueryString}`);
	return baseUrl;
}

function replaceQueryParameter(key, oldValue, newValue)
{
	const links = get(`a[href*='${key}=${oldValue}']`);
	if(!links) return;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		link.href = setQueryParameter(link.href, key, newValue);
	}
}

function arrayToString(arr, separator)
{
	let sep = separator || " | ";
	let s = "";
	if(!arr.length)
		return "[empty array]";
	for(let i = 0, ii = arr.length; i < ii; i++)
		s += "\t" + arr[i] + sep;
	return s.substring(0, s.length - sep.length);
}

function arrayToStringTyped(arr, separator)
{
	let sep = separator || " | ";
	let s = "";
	for(let i = 0, ii = arr.length; i < ii; i++)
	{
		if(typeof arr[i] === "string")
			s += '"' + arr[i] + '"' + sep;
		else
			s += arr[i] + sep;
	}
	return s.substring(0, s.length - sep.length);
}

function printPropOfObjectArray(arr, propName)
{
	let i = -1;
	const len = arr.length;
	let strProps = "";
	while(++i < len)
		strProps += getPropValueSafe(arr[i], propName) + "\n";
	console.log(strProps);
}

function printPropsContaining(obj, arrStrings)
{
	const keys = Object.keys(obj);
	let strPropsWithValues = "";
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		if(containsAnyOfTheStrings(key, arrStrings))
			strPropsWithValues += key + ": " + obj[key] + "\n";
	}
	console.log(strPropsWithValues);
}

function logElements(elements)
{
	if(!Array.isArray(elements))
	{
		showMessageError("Expected array, got " + elements);
		return;
	}
	let strElementSelectors = "";
	for(let i = 0, ii = elements.length; i < ii; i++)
		strElementSelectors += "\t" + createSelector(elements[i]) + "\n";
	console.log(strElementSelectors);
}

function showVersion()
{
	showMessageBig("Nimbus version " + Nimbus.version);
}

function showLog(prepend)
{
	let logDiv;
	if(Nimbus.logString.length > 0)
	{
		logDiv = document.createElement("log");
		logDiv.innerHTML = Nimbus.logString;
		if(prepend === true)
			document.body.insertBefore(logDiv, document.body.firstChild);
		else
			document.body.appendChild(logDiv);
		Nimbus.logString = "";
	}
	else
	{
		ylog("No logs");
	}
}

function emptyElement(elem) { if(elem) elem.textContent = ''; }

function createSelector(elem)
{
	let s = elem.tagName ? elem.tagName.toLowerCase() : "";
	if(elem.id)
		s += "#" + elem.id + " ";
	if(elem.className && elem.className !== Nimbus.markerClass)
		s += createClassSelector(elem);
	if(elem.name)
		s += " name: " + elem.name;
	return s;
}

function createClassSelector(elem)
{
	if(elem.className && elem.className !== Nimbus.markerClass)
		return "." + Array.from(elem.classList).join('.').replace(makeClassSelector(Nimbus.markerClass), "");
	return "";
}

function toggleClass(element, className)
{
	const classList = element.classList;
	if(classList.contains(className))
		classList.remove(className);
	else
		classList.add(className);
}

function cycleClass(elem, arrClasses)
{
	let found = false;
	for(let i = 0, ii = arrClasses.length; i < ii; i++)
	{
		const currClass = arrClasses[i];
		if(elem.classList.contains(currClass))
		{
			elem.classList.remove(currClass);
			const nextIndex = i < ii - 1 ? i + 1 : 0;
			const nextClass = arrClasses[nextIndex];
			elem.classList.add(nextClass);
			showMessageBig(nextClass);
			found = true;
			break;
		}
	}
	if(!found)
	{
		const nextClass = arrClasses[0];
		elem.classList.add(nextClass);
		showMessageBig(nextClass);
	}
}

function cycleTheme()
{
	cycleClass(document.body, ["nimbusTheme1", "nimbusTheme3", "nimbusTheme2", "none"]);
	document.documentElement.className = document.body.className;
}

function insertBefore(anchorElement, elementToInsert) { anchorElement.insertAdjacentElement("beforebegin", elementToInsert); }
function insertAfter(anchorElement, elementToInsert) { anchorElement.insertAdjacentElement("afterend", elementToInsert); }
function insertAsFirstChild(anchorElement, elementToInsert) { anchorElement.insertAdjacentElement("afterbegin", elementToInsert); }
function insertAsLastChild(anchorElement, elementToInsert) { anchorElement.insertAdjacentElement("beforeend", elementToInsert); }

function insertAroundAll(selector, position, elemType, textContent)
{
	const elems = get(selector);
	if(!elems) return;
	const where = position === "after" ? "afterend" : "beforebegin";
	const tagName = elemType === "text" ? "span" : elemType;
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const elemToInsert = createElementWithText(tagName, textContent);
		elem.insertAdjacentElement(where, elemToInsert);
		if(elemType === "text")
			unwrapElement(elemToInsert);
	}
}

function insertSpacesAround(selector)
{
	const elems = get(selector);
	if(!elems) return;
	for(const elem of elems)
	{
		const next = elem.nextSibling;
		if(next && next.nodeType === 3 && /^[a-z]/.test(next.data))
			next.data = " " + next.data;
		const prev = elem.previousSibling;
		if(prev && prev.nodeType === 3 && /[a-z]$/.test(prev.data))
			prev.data = prev.data + " ";
	}
}

function createElementWithChildren(tagName, ...children)
{
	const elem = document.createElement(tagName);
	for(let i = 0, ii = children.length; i < ii; i++)
		elem.appendChild(children[i]);
	return elem;
}

//	Takes a source element and a tagName, and returns an element of type tagName
//	with the source element's properties mapped across to the new element as specified
//	in the propertyMapping parameter. This could be used, for instance, to create an <a>
//	based upon an <img>, taking its textContent and href from the image's src attribute.
function createReplacementElement(tagName, sourceElement, propertyMapping)
{
	const elem = document.createElement(tagName);
	const keys = Object.keys(propertyMapping);
	let i = keys.length;
	while(i--)
	{
		const key = keys[i];
		const sourceProp = propertyMapping[key];
		const value = sourceElement[sourceProp] || sourceElement.getAttribute(sourceProp);
		if(value)
			setAttributeOrProperty(elem, key, value);
	}
	return elem;
}

function duplicateMarkedElement(num)
{
	const markedElements = getMarkedElements();
	if(markedElements.length !== 1)
	{
		showMessageBig(`Expected 1 marked element; found ${markedElements.length}`);
		return;
	}
	const marked = markedElements[0];
	marked.classList.remove(Nimbus.markerClass);
	const parent = marked.parentNode;
	if(parent)
	{
		let i = num;
		while(i--)
			parent.appendChild(marked.cloneNode(true));
	}
}

function getPropValueSafe(obj, propName)
{
	const propValue = obj[propName];
	if(propValue)
		return propValue;
	return null;
}

function getElemPropSafe(elem, prop)
{
	if(!elem)
		return null;
	if(elem[prop])
		return elem[prop];
	if(elem.hasAttribute(prop))
		return elem.getAttribute(prop);
	return null;
}

function replaceIframes()
{
	const elems = get("iframe");
	if(!elems) return;
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		const iframereplacement = document.createElement("rp");
		const iframelink = document.createElement("a");
		let iframeSrc = elem.src;
		if(containsAnyOfTheStrings(iframeSrc, ["facebook", "twitter"]))
		{
			elem.remove();
			continue;
		}
		iframelink.href = iframeSrc;
		if(~iframeSrc.indexOf("youtube") && iframeSrc.indexOf("subscribe_embed") === -1)
		{
			iframeSrc = iframeSrc.replace(/\/embed\//, '/watch?v=');
			const segments = iframeSrc.split('?');
			iframelink.href = segments[0] + '?' + segments[1];
			iframelink.textContent = iframelink.href;
		}
		else
		{
			iframelink.textContent = "iframe: " + iframelink.href;
		}
		iframereplacement.appendChild(iframelink);
		elem.parentNode.replaceChild(iframereplacement, elem);
	}
}

//	If the user has selected some text, this function takes that selection's first block parent,
//	and replaces that element with an element of type tagName.
function replaceSelectedElement(tagName)
{
	const node = getNodeContainingSelection();
	if(node)
	{
		const replacementTag = tagName ? tagName : Nimbus.replacementTagName1;
		replaceElementKeepingId(node, replacementTag);
	}
}

function wrapMarkedElement(tagName)
{
	const node = getMarkedElements()[0];
	if(node)
	{
		const wrapperTag = tagName ? tagName : Nimbus.replacementTagName1;
		wrapElement(node, wrapperTag);
	}
}

function replaceElementsByTagNameMatching(text, tagName)
{
	const newTagName = tagName || "blockquote";
	const elems = selectByTagNameMatching(text);
	for(let i = 0, ii = elems.length; i < ii; i++)
		replaceElement(elems[i], newTagName);
}

function replaceElementsBySelectorHelper()
{
	if(getMarkedElements().length)
		callFunctionWithArgs("Replace elements by selector", replaceElementsBySelector, 2, makeClassSelector(Nimbus.markerClass) + " ");
	else
		callFunctionWithArgs("Replace elements by selector", replaceElementsBySelector, 2);
}

function replaceElementsBySelector(selector, tagName)
{
	const toReplace = get(selector);
	if(!toReplace) return;
	if(toReplace.length)
	{
		showMessageBig(`Replacing ${toReplace.length} ${selector} with ${tagName}`);
		let deletedTextLength = 0;
		let i = toReplace.length;
		if(tagName === "hr" && toReplace[0].tagName !== "RT")
		{
			while(i--)
			{
				const elem = toReplace[i];
				const textLength = getAlphanumericTextLength(elem);
				if(textLength !== 0)
				{
					deletedTextLength += textLength;
					xlog(elem.textContent);
				}
				elem.parentNode.replaceChild(createElement(tagName), elem);
			}
			if(deletedTextLength)
			{
				showMessageError(`${deletedTextLength} characters of text were lost`);
				setTimeout(showLog, 100);
			}
		}
		else
		{
			while(i--)
			{
				replaceElementKeepingId(toReplace[i], tagName);
			}
		}
	}
	else if(toReplace && toReplace.parentNode)
	{
		showMessageBig("Replacing one " + selector);
		replaceElementKeepingId(toReplace, tagName);
	}
}

function convertElement(elem, tagName)
{
	const replacement = document.createElement(tagName);
	const temp = elem.cloneNode(true);
	while(temp.firstChild)
		replacement.appendChild(temp.firstChild);
	if(elem.id)
		replacement.id = elem.id;
	return replacement;
}

function cloneElement(elem) { return convertElement(elem, elem.tagName); }

function replaceElement(elem, tagName)
{
	const replacement = document.createElement(tagName);
	while(elem.firstChild)
		replacement.appendChild(elem.firstChild);
	elem.parentNode.replaceChild(replacement, elem);
}

function replaceElementKeepingId(elem, tagName)
{
	const replacement = document.createElement(tagName);
	while(elem.firstChild)
		replacement.appendChild(elem.firstChild);
	const elemId = elem.id;
	if(elemId)
		replacement.id = elemId;
	elem.parentNode.replaceChild(replacement, elem);
}

function replaceElementsOfMarkedTypeWith(tagName)
{
	const marked = getMarkedElements();
	if(marked.length !== 1)
	{
		showMessageBig(`Expected 1 marked element; found ${marked.length}`);
		return;
	}
	if(!tagName)
	{
		showMessageBig('tagName is required');
		return;
	}
	const elem = marked[0];
	const classSelector = createClassSelector(elem);
	if(classSelector.length)
	{
		const selector = elem.tagName + classSelector;
		replaceElementsBySelector(selector, tagName);
	}
	else
	{
		showMessageBig("Selected node has no classes");
	}
}

function replaceElements(toReplace, tagName)
{
	let i = toReplace.length;
	while(i--)
		replaceElement(toReplace[i], tagName);
}

function replaceMarkedElements(tagName)
{
	const toReplace = getMarkedElements();
	let i = toReplace.length;
	while(i--)
		replaceElement(toReplace[i], tagName);
}

function replaceByClassOrIdContaining(str, tagName)
{
	const toReplace = selectByClassOrIdContaining(str);
	showMessageBig(`Replacing ${toReplace.length} elements`);
	for(let i = 0, ii = toReplace.length; i < ii; i++)
		replaceElementKeepingId(toReplace[i], tagName);
}

function deleteByClassOrIdContaining(str) { deleteElements(selectByClassOrIdContaining(str)); }
function markByClassOrIdContaining(str) { markElements(selectByClassOrIdContaining(str)); }

function hasAdjacentBlockElement(node)
{
	const BLOCK_ELEMENTS = Nimbus.BLOCK_ELEMENTS;
	const prevSib = node.previousSibling;
	const prevElemSib = node.previousElementSibling;
	const nextSib = node.nextSibling;
	const nextElemSib = node.nextElementSibling;
	if(prevSib && prevElemSib && prevSib === prevElemSib && BLOCK_ELEMENTS[prevElemSib.tagName])
		return true;
	if(nextSib && nextElemSib && nextSib === nextElemSib && BLOCK_ELEMENTS[nextElemSib.tagName])
		return true;
	return false;
}

function isBlockElement(node)
{
	const NON_BLOCK_ELEMENTS = {
		A: true,
		B: true,
		BIG: true,
		SMALL: true,
		STRONG: true,
		I: true,
		EM: true,
		SPAN: true,
		TIME: true,
		MARK: true,
		MARKYELLOW: true,
		MARKRED: true,
		MARKGREEN: true,
		MARKBLUE: true,
		MARKPURPLE: true,
		MARKWHITE: true,
		CODE: true,
		USER: true
	}
	if(node.nodeType !== 1) return false;
	if(NON_BLOCK_ELEMENTS[node.tagName]) return false;
	return true;
}

//	If any text nodes or inline elements have a block element as a sibling, they need to be wrapped in a block container.
function rescueOrphanedInlineElements()
{
	deleteEmptyTextNodes();
	const WRAPPER_TAGNAME = "comment";
	const nodes = get("body *");
	const numNodes = nodes.length;
	let count = 0;
	let node, nodeParent;
	for(let i = 0, ii = nodes.length; i < ii; i++)
	{
		node = nodes[i];
		if(isBlockElement(node))
			continue;

		if(hasAdjacentBlockElement(node))
		{
			nodeParent = node.parentNode;
			const orphanedNodes = [];
			orphanedNodes.push(node);
			while(node.nextSibling && count < numNodes)
			{
				count++;
				node = node.nextSibling;
				if(!isBlockElement(node))
				{
					orphanedNodes.push(node);
					i++;
				}
				else
				{
					break;
				}
			}

			if(orphanedNodes.length)
			{
				const wrapper = document.createElement(WRAPPER_TAGNAME);
				// wrapper.className = Nimbus.markerClass;
				for(const orphan of orphanedNodes)
					wrapper.appendChild(orphan.cloneNode(true));
				nodeParent.insertBefore(wrapper, orphanedNodes[0]);
				del(orphanedNodes);
			}
		}
	}
}

function rescueOrphanedTextNodes()
{
	const WRAPPER_TAGNAME = "p";
	const textNodes = getTextNodesUnderSelector("body");
	const numNodes = textNodes.length;
	let count = 0;
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		let node = textNodes[i];
		if(!getTextLength(node)) continue;
		if(hasAdjacentBlockElement(node))
		{
			const nodeParent = node.parentNode;
			const orphanedNodes = [];
			const orphanedNodesLeft = [];
			orphanedNodes.push(node);
			let nodeLeft = node.previousSibling;
			while(nodeLeft)
			{
				if(!isBlockElement(nodeLeft))
				{
					orphanedNodesLeft.push(nodeLeft);
					nodeLeft = nodeLeft.previousSibling;
				}
				else
				{
					break;
				}
			}
			while(node.nextSibling)
			{
				node = node.nextSibling;
				if(!isBlockElement(node))
				{
					orphanedNodes.push(node);
					i++;
				}
				else
				{
					break;
				}
			}
			const allOrphanedNodes = orphanedNodesLeft.reverse().concat(orphanedNodes);

			if(allOrphanedNodes.length)
			{
				const wrapper = document.createElement(WRAPPER_TAGNAME);
				// wrapper.className = Nimbus.markerClass;
				for(const orphan of allOrphanedNodes)
					wrapper.appendChild(orphan.cloneNode(true));
				nodeParent.insertBefore(wrapper, orphanedNodes[0]);
				del(allOrphanedNodes);
			}
		}
	}
}

function createListsFromBulletedParagraphs()
{
	const paras = get("p");
	let i = paras.length;
	while(i--)
	{
		const para = paras[i];
		if(/\u2022/.test(para.textContent))
		{
			markElement(para);
			para.innerHTML = para.innerHTML.replace(/\u2022/, "");
		}
	}

	const elems = getMarkedElements();
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		let nextElem = elem.nextElementSibling;
		const parent = document.createElement("ul");
		insertBefore(elem, parent);
		parent.appendChild(elem);
		while(nextElem && nextElem.classList.contains(Nimbus.markerClass))
		{
			i++;
			const nextElemTemp = nextElem.nextElementSibling;
			parent.appendChild(nextElem);
			nextElem = nextElemTemp;
		}
	}
	replaceElementsBySelector(makeClassSelector(Nimbus.markerClass), "li");
}

function deleteClass(className)
{
	const elems = get(makeClassSelector(className));
	let i = elems.length;
	let count = i ? i : 0;
	while(i--)
	{
		const elem = elems[i];
		elem.classList.remove(className);
		if(elem.className === "")
			elem.removeAttribute("class");
	}
	return count;
}

function hasClassesContaining(element, arrStr)
{
	const classes = element.className.toLowerCase().replace(/[^a-z\-]+/g, "");
	let i = arrStr.length;
	while(i--)
	{
		const str = arrStr[i].toLowerCase();
		if(~classes.indexOf(str))
			return true;
	}
	return false;
}

function hasClassesStartingWith(element, arrStr)
{
	const classes = element.className.toLowerCase();
	let i = arrStr.length;
	while(i--)
	{
		const str = arrStr[i].toLowerCase();
		if(classes.indexOf(str) === 0 || classes.indexOf(" " + str) !== -1)
			return true;
	}
	return false;
}

function insertStyle(str, id, important)
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

function toggleNimbusStyles()
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

function toggleWebsiteSpecificStyle()
{
	const style = getOne("#websiteSpecificStyle");
	if(style)
		style.disabled = !style.disabled;
}

function toggleStyle(str, id, important)
{
	if(id && id.length && getOne("#" + id))
	{
		del("#" + id);
		return;
	}
	insertStyle(str, id, important);
}

function getTimestamp(mode = "dateAndTime")
{
	const d = new Date();
	const YYYY = d.getFullYear();
	const MO = zeroPad(d.getMonth() + 1);
	const DD = zeroPad(d.getDate());
	const HH = zeroPad(d.getHours());
	const MM = zeroPad(d.getMinutes());
	const SS = zeroPad(d.getSeconds());
	if(mode === "dateOnly")
		return `${YYYY}-${MO}-${DD}`;
	return `${YYYY}/${MO}/${DD} ${HH}:${MM}:${SS}`;
}

function toNumber(str)
{
	if(!(typeof str === "string" && str.length))
		return false;
	const noCommas = str.replace(/,/g, "").trim();
	const n = Number(noCommas);
	return !isNaN(n) ? n : false;
}

function selectRandom(arr)
{
	if(!(arr && arr.length)) throw new Error(arr);
	return arr[Math.floor(Math.random() * arr.length)];
}

function debugVars(params)
{
	const keys = Object.keys(params);
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		const value = params[key];
		if(Array.isArray(value))
			console.log(key, '\n', arrayToString(value, "\n"));
		else
			console.log(key, '\n\t', value);
	}
}

function getNext(item, arr)
{
	let nextItem = arr[0];
	const index = arr.indexOf(item);
	if(~index)
	{
		const nextIndex = index < arr.length - 1 ? index + 1 : 0;
		nextItem = arr[nextIndex];
	}
	return nextItem;
}

function getPrevious(item, arr)
{
	let prevItem = arr[0];
	const index = arr.indexOf(item);
	if(~index)
	{
		const prevIndex = index > 0 ? index - 1 : arr.length - 1;
		prevItem = arr[prevIndex];
	}
	return prevItem;
}

function createUUID()
{
	return 'nimbus-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function(c)
	{
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}

function xlog(str, logTag)
{
	let tag;
	if(logTag && logTag.length)
		tag = logTag;
	else
		tag = "h6";
	Nimbus.logString += '<' + tag + ' class="xlog">' + str + '</' + tag + '>\r\n';
}

function ylog(str, tag, prepend, logClassName = "xlog")
{
	const tagName = tag || "h6";
	const logElement = createElement(tagName, { className: logClassName, innerHTML: str });
	if(prepend)
		document.body.insertBefore(logElement, document.body.firstChild);
	else
		document.body.appendChild(logElement);
}

function log2(str)
{
	document.body.appendChild(createElement("h2", { className: "xlog", innerHTML: str }));
}

function logString(str, label)
{
	const colors = Nimbus.logColors;
	if(label) consoleLog(`%c${label} %c${str}`, colors.blue, colors.green);
	else consoleLog(`%c${str}`, colors.gray);
}

function logTable(...args)
{
	const tableElem = document.createElement("table");
	const trElem = document.createElement("tr");
	for(const arg of args)
		trElem.appendChild(createElement("td", { textContent: arg }));
	tableElem.appendChild(trElem);
	document.body.appendChild(tableElem);
}

function logAllClassesFor(selector)
{
	if(typeof selector === "string" && selector.length)
	{
		let str = "";
		const classCounts = getClassCounts(selector);
		if(classCounts.length)
		{
			str += selector + "\n";
			for(const item of classCounts)
				str += "\t" + item.className + "\t" + item.count + "\n";
			console.log(str);
		}
	}
	else
	{
		logAllClassesFor("div");
		logAllClassesFor("h1");
		logAllClassesFor("h2");
		logAllClassesFor("h3");
		logAllClassesFor("p");
		logAllClassesFor("blockquote");
		logAllClassesFor("span");
	}
}

function getClassCounts(selector) {
	function sortFunc(a, b) { return a.count - b.count; }
	const elements = get(selector);
	const classMap = new Map();
	for (const element of elements)
	{
		for (const className of element.classList)
		{
			classMap.set(className, (classMap.get(className) || 0) + 1);
		}
	}
	return Array.from(classMap, ([className, count]) => ({className, count})).sort(sortFunc);
}

function getAllClassesFor(selector)
{
	const sel = typeof selector === "string" ? selector : "*";
	const nodes = get(sel);
	const classes = {};
	let i = nodes.length;
	while(i--)
	{
		const classList = Array.from(nodes[i].classList);
		if(!classList.length)
			continue;
		const elementClasses = classList.join('.');
		const elementClassesSanitized = elementClasses.replace(/[^a-zA-Z0-9]+/g, '');
		classes[elementClassesSanitized] = elementClasses;
	}
	const keys = Object.keys(classes);
	const result = [];
	for(let i = 0, ii = keys.length; i < ii; i++)
		result.push(classes[keys[i]]);
	return result;
}

function mapIdsToClasses()
{
	const elems = get("*[id]");
	for(const elem of elems)
		elem.className = elem.id.replace(/[^A-Za-z]+/g, "");
}

function replaceClass(class1, class2)
{
	const e = document.querySelectorAll(makeClassSelector(class1));
	let i = e.length;
	while(i--)
		e[i].classList.replace(class1, class2);
}

function replaceInClassNames(str, repl)
{
	const elems = get("*");
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(typeof elem.className === "string" && elem.className.length)
			elem.className = elem.className.replaceAll(str, repl);
	}
}

function getUniqueClassNames(arrClasses)
{
	if (!arrClasses) return [];
	const allClassNames = arrClasses.flatMap(line => line.trim().split('.').filter(name => name));
	return [...new Set(allClassNames)];
}

function identifyClassSetup(selector, atomic = true)
{
	const classes = atomic ? getClassCounts(selector).map(item => item.className) : getAllClassesFor(selector);
	Nimbus.identifyClass.classes = classes;
	Nimbus.identifyClass.currentIndex = -1;
	showMessageBig(atomic ? `Found ${classes.length} atomic classes for ${selector}` : `Found ${classes.length} classes for ${selector}`);
}

function identifyClassTeardown()
{
	identifyClassShowMarked();
	del("#styleIdentifyClass");
	const config = Nimbus.identifyClass;
	config.currentIndex = -1;
	config.currentClass = null;
	config.classes = [];
	config.markedClasses = [];
	showMessageBig("Identify class mode disabled");
}

function identifyClassSetStyle(styleString)
{
	const styleRule = "{" + styleString + "}";
	Nimbus.identifyClass.style = styleRule;
	showMessageBig("identifyClass style set to " + styleRule);
}

function identifyClassCycle(direction)
{
	const config = Nimbus.identifyClass;
	if(!(config.classes && config.classes.length))
	{
		showMessageBig("No classes to work with. Run identifyClassSetup <selector> first.");
		return;
	}
	config.currentIndex = direction === "previous" ? getPreviousIndex(config.currentIndex) : getNextIndex(config.currentIndex, config.classes);
	const currentClass = config.classes[config.currentIndex];
	const classCount = config.classes.length;
	if(currentClass)
	{
		const elemCount = get(makeClassSelector(currentClass)).length;
		showMessageBig("[" + (config.currentIndex + 1) + "/" + classCount + "] ." + currentClass + ": " + elemCount + " elements", true);
		const style = `.${currentClass} ${config.style}`;
		insertStyle(style, "styleIdentifyClass", true);
	}
}

function identifyClassMark(str)
{
	const config = Nimbus.identifyClass;
	const currentClass = config.classes[config.currentIndex];
	config.markedClasses.push(`.${currentClass} {} /* ${str} */`);
	showMessageBig(`Marked ${currentClass} with tag ${str}`);
}

function identifyClassShowMarked()
{
	console.log(Nimbus.identifyClass.markedClasses.join("\n"));
}

function zeroPad(num, width = 2)
{
	const str = num.toString();
	const len = str.length;
	if (len >= width) return str;
	return '0'.repeat(width - len) + str;
}

function isCurrentDomainLink(url)
{
	const urlSegments = url.split("/");
	if(urlSegments[2] === location.hostname)
	{
		if(urlSegments.length === 3)
			return true;
		if(urlSegments.length === 4 && urlSegments[urlSegments.length - 1].length === 0)
			return true;
	}
	return false;
}

function makeClassSelector(className)
{
	if(className.indexOf(".") !== 0)
		return "." + className.trim();
	return className.trim();
}

function makeIdSelector(id)
{
	if(id.indexOf("#") !== 0)
		return "#" + id.trim();
	return id.trim();
}

function removeUnnecessaryClasses()
{
	removeAttributeOf("table, tbody, thead, th, tr, td, i, em, b, strong, a, ul, ol, li, sup, sub, small, pre, code, h1, h2, h3, h4, h5, h6, dt, dd, dl", "class");
}

function simplifyClassNames(selector)
{
	const sel = selector ||  "section, div, header, p, ul, ol, li, span, table, tbody, thead, tr, td, th, blockquote";
	const elems = get(sel);
	const classMap = {};
	const numClassesByTagName = {};
	const tagMap = {
		div: "d",
		span: "s",
		blockquote: "bl",
		reference: "r",
	};
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const tagName = elem.tagName.toLowerCase();
		const className = elem.className.toString() || "";
		const oldClass = tagName + "_" + className.replace(/[^a-zA-Z0-9]+/g, "");
		if(!oldClass.length)
			continue;
		elem.setAttribute("class", oldClass);
		classMap[oldClass] = tagName;
		numClassesByTagName[tagName] = 0;
	}
	let keys = Object.keys(classMap);
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		const tagName = classMap[key];
		const tagNameMapped = tagMap[tagName] || tagName;
		const index = numClassesByTagName[tagName]++;
		if(/h\d/.test(tagName))
			replaceClass(key, tagNameMapped + "_" + index);
		else
			replaceClass(key, tagNameMapped + index);
	}
}

function moveDataTestIdToClassName()
{
	removeAllAttributesOfTypes(["class", "id"]);
	copyAttribute("body *", "data-testid", "class");
	removeAttributeOf("body *", "data-testid");
}

function showStatus(id, str)
{
	getOrCreate("h3", id).textContent = id + ": " + str;
}

function showMessage(message, msgClass, persist)
{
	const MESSAGE_TIMEOUT = 2000;
	clearTimeout(Nimbus.messageTimeout);
	msgClass = msgClass || "";
	const strStyle = `
		message { display: block; background: rgba(0,0,0,0.5); font: 12px Verdcode, Verdana; color: #888; height: 60px; line-height: 60px; position: fixed; top: calc(100vh - 60px); left: 0; width: 100%; z-index: 2147483647; }
		messageinner { display: block; text-align: left; padding: 0 2rem; font: 18px "swis721 cn bt"; height: 60px; line-height: 60px; }
		messagebig { display: block; text-align: left; font: 24px "swis721 cn bt"; color: #AAA; height: 60px; line-height: 60px; font-weight: 500; padding: 0 2rem; }
		messageerror { display: block; text-align: left; font: 24px "swis721 cn bt"; color: #DDD; background: #500; height: 60px; line-height: 60px; font-weight: 500; padding: 0 2rem; }
	`;
	const messageInnerTagName = msgClass ? msgClass : "messageinner";
	if(getOne("message"))
	{
		del("message");
	}
	const messageContainer = document.createElement("message");
	messageContainer.className = "excludeFromMutations";
	const messageInner = document.createElement(messageInnerTagName);
	const messageContent = document.createElement("div");
	let messageText;
	let messageTag;
	let messageElement;
	if(typeof message === "string")
	{
		messageElement = document.createTextNode(message);
	}
	else
	{
		messageElement = document.createElement(message.tag);
		messageElement.textContent = message.text;
	}
	messageContent.appendChild(messageElement);
	messageInner.appendChild(messageContent);
	messageContainer.appendChild(messageInner);
	document.body.appendChild(messageContainer);
	if(!getOne("#styleMessage"))
		insertStyle(strStyle, "styleMessage", true);
	if(!persist)
		Nimbus.messageTimeout = setTimeout(deleteMessage, MESSAGE_TIMEOUT);
}

function showMessageBig(message, persist = false)
{
	showMessage(message, "messagebig", persist);
}

function showMessageError(message, persist = false)
{
	showMessage(message, "messageerror", persist);
}

function deleteMessage()
{
	del("message");
	del("#styleMessage");
}

function getSelectionOrUserInput(promptMessage, callback, isUnary)
{
	if(window.getSelection().toString().length)
	{
		const selection = window.getSelection().toString();
		callback(selection);
		return;
	}
	if(isUnary)
	{
		customPrompt(promptMessage).then(callback);
		return;
	}
	function callFunctionWithUserInput(userInput)
	{
		if(~userInput.indexOf(" ") || ~userInput.indexOf('"'))
			callback.apply(null, parseCommand(userInput));
		else
			callback.call(null, userInput);
	}
	customPrompt(promptMessage).then(callFunctionWithUserInput);
}

function callFunctionWithArgs(promptMessage, callback, numArgs, initialValue)
{
	function callFunctionWithArgsHelper(userInput)
	{
		if(!numArgs || numArgs > 1)
		{
			const args = parseCommand(userInput);
			if(numArgs && args.length !== numArgs)
			{
				showMessageBig(numArgs + " arguments are required");
				callFunctionWithArgs(promptMessage, callback, numArgs);
				return;
			}
			console.log(`%c${promptMessage}: ${args.join(", ")}`, 'color: #FF0');
			callback.apply(null, args);
		}
		else
		{
			console.log(`%c${promptMessage}`, 'color: #FF0');
			callback.call(null, userInput);
		}
	}
	customPrompt(promptMessage, initialValue).then(callFunctionWithArgsHelper);
}

function handleConsoleInput(evt, consoleType)
{
	function insertTab(evt)
	{
		const targ = evt.target;
		evt.preventDefault();
		evt.stopPropagation();
		const iStart = targ.selectionStart;
		const iEnd = targ.selectionEnd;
		targ.value = targ.value.substr(0, iStart) + '\t' + targ.value.substr(iEnd, targ.value.length);
		targ.setSelectionRange(iStart + 1, iEnd + 1);
	}

	const userInputElement = getOne("#userInput");
	if(!userInputElement)
		return;
	const inputText = userInputElement.value;
	if(consoleType === "js")
		Nimbus.jsConsoleText = inputText;
	else if(consoleType === "css")
		Nimbus.cssConsoleText = inputText;
	const ctrlOrMeta = ~navigator.userAgent.indexOf("Macintosh") ? "metaKey" : "ctrlKey";
	switch(evt.keyCode)
	{
		case KEYCODES.ENTER:
			if(evt[ctrlOrMeta])
			{
				if(consoleType === "js")
				{
					try
					{
						eval(inputText);
					}
					catch(err)
					{
						console.log(err);
					}
					return;
				}
				else if(consoleType === "css")
				{
					insertStyle(inputText, "userStyle", true);
				}
			}
			break;
		case KEYCODES.TAB:
			insertTab(evt);
			return false;
		case KEYCODES.ESCAPE:
			toggleConsole();
			break;
	}
}

function getConsoleHistory(consoleType)
{
	switch(consoleType)
	{
		case "css": return Nimbus.cssConsoleText || "";
		case "js": return Nimbus.jsConsoleText || "";
		default: return "";
	}
}

function editStyleById(styleId)
{
	if(typeof styleId !== "string" || !styleId.length)
	{
		showMessageBig("Style ID is required");
		return;
	}
	styleId = makeIdSelector(styleId);
	const styleElem = getOne(styleId);
	if(!styleElem)
	{
		showMessageBig("Could not get style with id " + styleId);
		return;
	}
	toggleConsole("css");
	getOne("#userInput").value = styleElem.textContent.replace(/!important/g, "");
}

function toggleConsole(consoleType)
{
	if(getOne("#userInputWrapper"))
	{
		del("#userInputWrapper");
		del("#styleUserInputWrapper");
		return;
	}
	if(!consoleType || !["css", "js"].includes(consoleType))
	{
		showMessageError("toggleConsole needs a consoleType");
		return;
	}
	let dialogStyle;
	const consoleBackgroundColor = consoleType === "css" ? "#036" : "#000";
	dialogStyle = '#userInputWrapper { position: fixed; bottom: 0; left: 0; right: 0; height: 30vh; z-index: 1000000000; }' +
		'#userInput { background: ' + consoleBackgroundColor + '; color: #CCC; font-family: "SF Mono", Consolas, Verdana; font-size: 18px; font-weight: bold; width: 100%; height: 100%; padding: 10px 40px; border: 0; outline: 0; }';
	insertStyle(dialogStyle, "styleUserInputWrapper", true);

	const inputTextareaWrapper = createElement("div", { id: "userInputWrapper", class: "excludeFromMutations" });
	const inputTextarea = createElement("textarea", { id: "userInput", class: "monospace", value: getConsoleHistory(consoleType) });
	const handleKeyDown = function(event){ handleConsoleInput(event, consoleType); };
	inputTextarea.addEventListener("keydown", handleKeyDown);
	inputTextareaWrapper.appendChild(inputTextarea);
	document.body.appendChild(inputTextareaWrapper);
	inputTextarea.focus();
	let history;
	if(consoleType === "css")
	{
		let userStyleText;
		const userStyle = getOne("#userStyle");
		if(userStyle)
			userStyleText = userStyle.textContent;
		history = Nimbus.cssConsoleText || userStyleText;
		if(history)
			inputTextarea.value = history.replace(/\s*!important/g, "");
	}
	else
	{
		history = Nimbus.jsConsoleText;
		if(history)
			inputTextarea.value = history;
	}
}

function parseCommand(commandString)
{
	const args = [];
	let arg = '';
	const cleanCommandString = commandString.replace(/\s+/g, ' ').trim();
	for(let i = 0, ii = cleanCommandString.length; i < ii; i++)
	{
		switch(cleanCommandString[i])
		{
			case '"':
				i++;
				while(cleanCommandString[i] !== '"' && i < ii)
					arg += cleanCommandString[i++];
				break;
			case ' ':
				args.push(arg);
				arg = '';
				break;
			default:
				arg += cleanCommandString[i];
		}
	}
	args.push(arg);
	return args;
}

function isNumber(s)
{
	const str = s.trim();
	if(!str.length || /[^0-9\.\-]/.test(str))
		return false;
	const num = Number(str);
	if(isNaN(num))
		return false;
	return num;
}

function runCommand(commandString)
{
	if(typeof commandString === "undefined" || !commandString.length)
		return;
	Nimbus.lastCommand = commandString;
	const commandSegments = parseCommand(commandString);
	if(!commandSegments.length)
		return;
	const funcName = commandSegments[0];
	if(Nimbus.availableFunctions[funcName])
	{
		const args = [];
		for(let i = 1, ii = commandSegments.length; i < ii; i++)
		{
			const n = isNumber(commandSegments[i]);
			if(n === false)
				args.push(commandSegments[i]);
			else args.push(n);
		}
		const argsString = arrayToStringTyped(args, ", ");
		console.log(`%c${funcName}(${argsString})`, 'color: #FF0');
		Nimbus.availableFunctions[funcName].apply(this, args);
	}
	else
	{
		showMessageBig(funcName + ": not found");
	}
}

function customPrompt(message, initialValue)
{
	if(!getOne("#xxdialog"))
	{
		del("#style-xxdialog");
		const dialog = createElement("div", { id: "xxdialog", class: "excludeFromMutations" });
		const dialogHeading = createElement("heading", { textContent: message });
		const dialogInput = createElement("input", { id: "xxdialoginput", autocomplete: "off" });
		if(initialValue)
			dialogInput.value = initialValue;
		dialog.appendChild(dialogHeading);
		dialog.appendChild(dialogInput);
		document.body.insertBefore(dialog, document.body.firstChild);
		const s = '#xxdialog { position: fixed; margin: auto; z-index: 10000; height: 90px; top: 0; left: 0px; bottom: 0px; right: 0; background: #111; color: #FFF; border: 10px solid #000; display: block; text-transform: none; width: 60vw; }' +
			'#xxdialog heading { height: 30px; line-height: 30px; padding: 0 10px; background: #111; display: block; margin: 0; }' +
			'#xxdialog #xxdialoginput { font: 32px "swis721 cn bt"; line-height: 60px; verdana; background: #000; color: #FFF; padding: 0 0; margin: 0; border-width: 0 10px; border-color: #000; width: 100%; height: 60px; overflow: hidden; box-sizing: border-box; }';
		insertStyle(s, "style-xxdialog", true);
		dialogInput.focus();
		const func = function(resolve, reject) {
			dialogInput.addEventListener("keydown", function handleCustomPromptInput(evt){
				evt.stopPropagation();
				switch(evt.keyCode)
				{
					case KEYCODES.ESCAPE:
						evt.preventDefault();
						reject(closeCustomPrompt());
						break;
					case KEYCODES.ENTER:
						evt.preventDefault();
						resolve(closeCustomPrompt());
						break;
					case KEYCODES.UPARROW:
						evt.preventDefault();
						restoreCustomPromptHistory(evt.target);
						break;
				}
			}, false);
		};
		return new Promise(func);
	}
}

function restoreCustomPromptHistory(inputElement)
{
	inputElement.focus();
	if(Nimbus.lastCommand)
		setTimeout(function(){ inputElement.value = Nimbus.lastCommand; }, 0);
}

function closeCustomPrompt()
{
	const command = getOne("#xxdialoginput").value;
	del("#xxdialog");
	del("#style-xxdialog");
	return command;
}

function autoCompleteInputBox()
{
	const inputComponent = Nimbus.autoCompleteInputComponent;

	function updateInputField()
	{
		if(~inputComponent.currentIndex && inputComponent.matches[inputComponent.currentIndex])
			getOne("#autoCompleteInput").value = inputComponent.matches[inputComponent.currentIndex] + " ";
	}

	function highlightPrevMatch()
	{
		if(inputComponent.currentIndex > 0)
			inputComponent.currentIndex--;
		renderMatches();
	}

	function highlightNextMatch()
	{
		if(inputComponent.currentIndex < inputComponent.matches.length - 1)
			inputComponent.currentIndex++;
		renderMatches();
	}

	function onAutoCompleteInputKeyUp(evt)
	{
		const inputText = evt.target.value;
		if(!inputText)
		{
			if(evt.keyCode === KEYCODES.UPARROW)
				restoreCustomPromptHistory(evt.target);
			clearMatches();
			return;
		}
		showMatches(inputText);
		switch(evt.keyCode)
		{
			case KEYCODES.TAB: updateInputField(); break;
			case KEYCODES.ENTER: updateInputField(); executeFunction(); break;
		}
	}

	function onAutoCompleteInputKeyDown(evt)
	{
		switch(evt.keyCode)
		{
			case KEYCODES.TAB: evt.preventDefault(); break;
			case KEYCODES.ESCAPE: evt.preventDefault(); close(); break;
			case KEYCODES.UPARROW: evt.preventDefault(); highlightPrevMatch(); break;
			case KEYCODES.DOWNARROW: evt.preventDefault(); highlightNextMatch(); break;
		}
	}

	function renderMatches()
	{
		const matchList = document.createElement("div");
		matchList.className = "excludeFromMutations";
		const numMatches = inputComponent.matches.length;
		if(numMatches === 1)
		{
			inputComponent.currentIndex = 0;
			updateInputField();
		}
		for(let i = 0, ii = numMatches; i < ii; i++)
		{
			const match = document.createElement("match");
			match.className = "excludeFromMutations";
			if(inputComponent.currentIndex === i) match.className = "current";
			match.textContent = inputComponent.matches[i];
			matchList.appendChild(match);
		}
		const matchesContainer = getOne("#autoCompleteMatches");
		matchesContainer.textContent = "";
		matchesContainer.appendChild(matchList);
	}

	function showMatches(str)
	{
		if(!str || !str.length || str.length < 2)
		{
			emptyElement(getOne("#autoCompleteMatches"));
			inputComponent.currentIndex = -1;
			return;
		}
		str = str.toLowerCase().trim();

		inputComponent.matches = [];
		const commands = Object.keys(Nimbus.availableFunctions);
		for(let i = 0, ii = commands.length; i < ii; i++)
		{
			if(~commands[i].toLowerCase().indexOf(str))
				inputComponent.matches.push(commands[i]);
		}
		renderMatches();
	}

	function clearMatches()
	{
		inputComponent.matches = [];
		inputComponent.currentIndex = -1;
		renderMatches();
	}

	function open()
	{
		if(getOne("#autoCompleteInputWrapper"))
			return;
		const style = `autocompleteinputwrapper { display: block; width: 800px; height: 40vh; position: fixed; left: 0; top: 0; right: 0; bottom: 0; margin: auto; z-index: 2147483647; font-family: "swis721 cn bt"; }
			inputelementwrapper { display: block; border: 2px solid #07C; }
			autocompleteinputwrapper input { width: 100%; height: 3rem; font-size: 32px; background: #000; color: #DDD; outline: 0; display: block; font-family: inherit; }
			autocompleteinputwrapper matches { display: block; background: #222; color: #CCC; }
			autocompleteinputwrapper match { display: block; padding: 2px 10px; font-size: 24px; }
			autocompleteinputwrapper match.current { background: #303030; color: #FFF; }
			autocompleteinputwrapper em { display: inline-block; width: 200px; }`;
		insertStyle(style, "styleAutoCompleteInputBox", true);
		const dialogWrapper = createElement("autocompleteinputwrapper", { id: "autoCompleteInputWrapper", class: "excludeFromMutations" });
		const inputElementWrapper = createElement("inputelementwrapper");
		const inputElement = createElement("input", { id: "autoCompleteInput", autocomplete: "off" });
		const optionsList = createElement("matches", { id: "autoCompleteMatches" });
		inputElement.addEventListener("keyup", onAutoCompleteInputKeyUp);
		inputElement.addEventListener("keydown", onAutoCompleteInputKeyDown);
		inputElementWrapper.appendChild(inputElement);
		dialogWrapper.appendChild(inputElementWrapper);
		dialogWrapper.appendChild(optionsList);
		document.body.appendChild(dialogWrapper);
		inputElement.focus();
	}

	function close()
	{
		del("#autoCompleteInputWrapper");
	}

	function executeFunction()
	{
		const command = getOne("#autoCompleteInput").value;
		Nimbus.lastCommand = command;
		clearMatches();
		close();
		runCommand(command);
	}

	return { open, close };
}

function getViewportSize()
{
	if (window.innerWidth) return { width: window.innerWidth, height: window.innerHeight };
	if (document.documentElement && document.documentElement.clientWidth) return { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
	if (document.body) return { width: document.body.clientWidth, height: document.body.clientHeight };
	return { width: 0, height: 0 };
}

function getViewportHeight()
{
	if (window.innerHeight) return window.innerHeight;
	if (document.documentElement && document.documentElement.clientHeight) return document.documentElement.clientHeight;
	if (document.body) return document.body.clientHeight;
	return 0;
}

function highlightMapper()
{
	const config = {
		width: 300,
		rowHeight: 4,
		rowSpacing: 1,
		minWidth: 4,
		groupSize: 1,
		canvasId: "highlightMapCanvas",
		maxRows: 100,
		padding: 20,
		drawGaps: false,
		elements: [],
	};

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
		const { ctx, width, height } = initCanvas(highlightLengths.length);
		const widthScale = (width - config.padding) / maxParagraphLength;
		const rowHeightPlusSpacing = config.rowHeight + config.rowSpacing;

		const colorsByHighlightType = {
			plaintext: "#303030",
			currentLocation: "#A0A0A0",
			mark: "#0077BB",
			markyellow: "#DDBB00",
			markpurple: "#AA00CC",
			markgreen: "#00CC00",
			markblue: "#4444DD",
			markred: "#CC0000",
			markwhite: "#E0E0E0",
		};

		let currentScrollPosition = 0;
		if(window.scrollY > 0 && window.scrollMaxY > 0)
		{
			const scrollPercentage = window.scrollY / window.scrollMaxY;
			currentScrollPosition = Math.min(height - config.rowHeight, height * scrollPercentage);
		}
		ctx.fillStyle = colorsByHighlightType["currentLocation"];
		ctx.fillRect(width - 50, currentScrollPosition, width, config.rowHeight);

		let x = 0;
		let y = 0;
		for(let i = 0, ii = highlightLengths.length; i < ii; i++)
		{
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
					ctx.fillRect(x, y, 2, config.rowHeight);
					x += 2;
				}
			}
			y += rowHeightPlusSpacing;
		}

		ctx.font = "bold 20px SF Mono";
		ctx.fillStyle = "#CCC";
		ctx.fillText(`1:${config.groupSize}`, width - 50, 20);
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

	function createHighlightLengthsObject(plaintextLength)
	{
		return {
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

	function generateHighlightData()
	{
		config.maxRows = Math.floor( getViewportSize().height / (config.rowHeight + config.rowSpacing));
		const elems = document.querySelectorAll("p");
		config.elements = elems;
		const highlightData = {
			highlightLengths: [],
			maxParagraphLength: 0
		};
		for(const elem of elems)
		{
			const highlightLengthsItem = createHighlightLengthsObject(elem.textContent.length);
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

	function draw(rowHeight, rowSpacing, minWidth)
	{
		if(typeof rowHeight === "number") config.rowHeight = rowHeight;
		if(typeof rowSpacing === "number") config.rowSpacing = rowSpacing;
		if(typeof minWidth === "number") config.minWidth = minWidth;
		drawHighlightMap(generateHighlightData());
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

function toggleHighlightMap(rowHeight = 4, rowSpacing = 1, minWidth = 4)
{
	if(!Nimbus.highlightMapper)
	{
		Nimbus.highlightMapper = highlightMapper();
		Nimbus.highlightMapper.draw(rowHeight, rowSpacing, minWidth);
	}
	else
	{
		Nimbus.highlightMapper.destroy();
		Nimbus.highlightMapper = null;
	}
}

function markByCssRule(prop, value, selector)
{
	const sel = selector || "*";
	const val = value.toLowerCase();
	const elems = get(sel);
	if(!elems) return;
	let i = elems.length;
	let count = 0;
	while(i--)
	{
		const elem = elems[i];
		const computedStyle = getComputedStyle(elem, null);
		if(computedStyle)
		{
			const propertyValue = computedStyle.getPropertyValue(prop);
			if(propertyValue.toLowerCase() === val)
			{
				markElement(elem);
				count++;
			}
		}
	}
	if(count)
	{
		showMessageBig("Found " + count + " elements with " + prop + ": " + val);
		insertStyleHighlight();
	}
}

function markBySelector(selector)
{
	const elems = get(selector);
	if(!elems)
	{
		showMessageError("No elements matching " + selector);
		return;
	}
	const elemsArray = Array.isArray(elems) ? elems : [elems];
	markElements(elemsArray);
}

function markBySelectorAndText(selector, str)
{
	markElements(selectBySelectorAndText(selector, str));
}

function markBySelectorAndRegex(selector, regexString, boolInvertSelection = false)
{
	const selected = [];
	const selectedInverse = [];
	const elements = get(selector);
	if(!elements) return;
	const regex = new RegExp(regexString);
	for(let i = 0, ii = elements.length; i < ii; i++)
	{
		const element = elements[i];
		if(element.textContent && regex.test(element.textContent.trim()) && !element.querySelector(selector))
			selected.push(element);
		else
			selectedInverse.push(element);
	}
	if(boolInvertSelection === true)
		markElements(selectedInverse);
	markElements(selected);
}

function markByTagNameAndText(tagName, str)
{
	markElements(selectByTagNameAndText(tagName, str));
}

function highlightByTagNameAndText(tagName, str)
{
	highlightElements(selectByTagNameAndText(tagName, str));
}

function markBlockElementsContainingText(text)
{
	markElements(selectBlockElementsContainingText(text));
}

function markOverlays()
{
	mark("div", "style", "contains", "z-index");
	mark("div", "class", "contains", "modal");
	mark("div", "hasAttribute", "aria-modal");
}

function highlightQuotes()
{
	const UTF8_SINGLEQUOTEOPEN = '\u2018';
	const UTF8_SINGLEQUOTECLOSE = '\u2019';
	document.body.innerHTML = document.body.innerHTML.replace(/\u201C/g, '<markwhite>"').replace(/\u201D/g, '"</markwhite>');
}

function highlightTableRows(rows)
{
	const trHighlightClass = Nimbus.trHighlightClass[Nimbus.highlightTagName];
	for(let i = 0, ii = rows.length; i < ii; i++)
		rows[i].classList.add(trHighlightClass);
}

function markElementsWithSetWidths()
{
	showMessageBig("Finding divs with pixel widths...");
	const elems = get("div");
	if(!elems) return;
	let i = elems.length, j, cssRules;
	while(i--)
	{
		const elem = elems[i];
		cssRules = getAllCssRulesForElement(elem);
		j = cssRules.length;
		while(j--)
		{
			if(/width:[^;]*px/.test(cssRules[j]))
			{
				markElement(elem);
				elem.innerHTML = "<x>#" + elem.id + " ." + elem.className + " " + getComputedStyle(elem, null).getPropertyValue("width") + "</x>" + elem.innerHTML;
				ylog(cssRules[j]);
			}
		}
	}
	insertStyle("x { background: #000; color: #FFF; padding: 2px 4px; display: block; font: 12px verdana;  } .xlog { clear: both; }", "styleMarkElementsWithSetWidths", true);
	insertStyleHighlight();
}

function markNavigationalLists()
{
	const lists = get("ul, ol");
	if(!lists) return;
	let len = lists.length;
	let i = -1;
	while(++i < len)
	{
		const list = lists[i];
		if(removeWhitespace(list.textContent).length === 0 && list.getElementsByTagName("img").length === 0)
		{
			list.remove();
			continue;
		}
		const links = list.querySelectorAll("a");
		let j = links.length;
		let linkText = "";
		while(j--)
		{
			linkText += links[j].textContent.replace(/[^A-Za-z]+/g, "");
		}
		const listTextLength = list.textContent.replace(/[^A-Za-z]+/g, "").length;
		if(listTextLength === linkText.length)
			markElement(list);
	}
	insertStyleHighlight();
}

function markSelectionAnchorNode()
{
	const node = getNodeContainingSelection();
	markElement(node);
	insertStyleHighlight();
	showMarkedElementInfo(node);
}

function showMarkedElementInfo(node)
{
	const classSelector = createClassSelector(node);
	const fullSelector = createSelector(node);
	const tagName = node.tagName.toLowerCase();
	const elems = classSelector ? get(classSelector) : get(tagName);
	if(elems)
	{
		const count = elems.length;
		if(count === 1)
			showMessage(`${fullSelector}: unique`, "messageinner", true);
		else
			showMessage(`${fullSelector}: ${count} instances`, "messageinner", true);
	}
}

function highlightUserLinks()
{
	const links = get("a");
	if(!links) return;
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		if(
			link.href &&
			link.textContent.replace(/\s+/g, "").length &&
			containsAnyOfTheStrings(link.pathname, ["/u/", "/user", "/member", "profile"]) &&
			link.parentNode && link.parentNode.tagName !== "USER"
		)
			wrapElement(link, "user");
	}
}

const getLinkAnchors = () => Array.from(document.querySelectorAll("a[id]")).filter(link => !link.href);
const getSpanAnchors = () => Array.from(document.querySelectorAll("span[id]")).filter(span => !getTextLength(span));
const getLinksToId = (id) => document.querySelectorAll(`a[href="#${id}"]`);

function createUniqueId(index)
{
	let prefix = "a";
	while(get("#" + prefix + index))
		prefix += "a";
	return prefix + index;
}

function replaceEmptyAnchors()
{
	const anchors = getLinkAnchors().concat(getSpanAnchors());
	const parentsAndLinks = [];
	const anchorsWithoutLinks = [];
	for(let i = 0, ii = anchors.length; i < ii; i++)
	{
		const anchor = anchors[i];
		const linksToAnchor = getLinksToId(anchor.id);
		if(!linksToAnchor.length)
		{
			anchorsWithoutLinks.push(anchor);
		}
		else
		{
			const parent = getFirstBlockParent(anchor);
			if(!parent.id) parent.id = createUniqueId(i);
			if(linksToAnchor.length) parentsAndLinks.push({ anchor, parent, linksToAnchor });
		}
	}

	let numLinks = 0;
	for(let i = 0, ii = parentsAndLinks.length; i < ii; i++)
	{
		const anchorData = parentsAndLinks[i];
		const links = anchorData.linksToAnchor;
		numLinks += links.length;
		for(let i = 0, ii = links.length; i < ii; i++)
			links[i].setAttribute("href", "#" + anchorData.parent.id);
		unwrapElement(anchorData.anchor);
	}

	for(const anchor of anchorsWithoutLinks)
		unwrapElement(anchor);

	showMessageBig(`Fixed ${numLinks} links to ${parentsAndLinks.length} anchors; deleted ${anchorsWithoutLinks.length} anchors without links`);
}

function moveIdsFromSpans()
{
	const spans = get("span[id]");
	if(!spans) return;
	for(const span of spans)
	{
		const recipient = span.closest("h1, h2, h3, h4, h5, h6, p") || span.nextElementSibling;
		if(recipient && !recipient.id)
		{
			recipient.id = span.id;
			if(getTextLength(span) === 0)
				span.remove();
		}
		else
		{
			const repl = document.createElement("cite");
			repl.textContent = "\u2022";
			repl.id = span.id;
			if(getTextLength(span) === 0)
				span.parentNode.replaceChild(repl, span);
			else
				span.insertAdjacentElement("beforebegin", repl);
		}
	}
}

function fixInternalReferences()
{
	moveIdsFromSpans();
	replaceEmptyAnchors();
	makeFileLinksRelative();
	const internalLinks = get('a[href^="#"]');
	if(!internalLinks) return;
	const tagsNotToMakeReferencesUnder = {
		"REFERENCE": true,
		"H1": true,
		"H2": true,
		"H3": true,
		"H4": true,
		"H5": true,
		"H6": true,
	};
	const regexIsNumeric = /^\[\d+\]$/;
	const regexIsNumberInBraces = /^\{\d+\}$/;
	for(let i = 0, ii = internalLinks.length; i < ii; i++)
	{
		const link = internalLinks[i];
		let refText = link.textContent.trim();
		if(regexIsNumeric.test(refText) || regexIsNumberInBraces.test(refText))
			refText = refText.replace(/[^0-9]+/g, "");
		if(!refText.length)
			refText = "0" + i;
		link.textContent = refText;
		if(link.parentNode && !tagsNotToMakeReferencesUnder[link.parentNode.tagName])
			wrapElement(link, "reference");
	}
	const redundantSups = select("sup", "hasChildrenOfType", "reference");
	if(redundantSups)
		for(let i = 0, ii = redundantSups.length; i < ii; i++)
			unwrapElement(redundantSups[i]);
	unwrapAll("reference a sup");
}

//	Takes footnotes from the end of the document and puts them inline after the paragraph that references them.
//	Requirement: the footnotes have to be in <footnote> elements, references in <reference> elements, and
//	the references have to be numeric.
function inlineFootnotes()
{
	const FOOTNOTE_TAGNAME = "FOOTNOTE";
	const REFERENCE_TAGNAME = "REFERENCE";
	let numFootnotesNotFound = 0;
	let numFootnotesFixed = 0;
	const paras = get("p, blockquote, quote, quoteauthor");
	for(let i = 0, ii = paras.length; i < ii; i++)
	{
		const para = paras[i];
		const paraRefs = para.querySelectorAll(REFERENCE_TAGNAME + " a");
		if(!paraRefs.length) continue;
		let j = paraRefs.length;
		while(j--)
		{
			const ref = paraRefs[j];
			if(isNaN(Number(ref.textContent)))
				continue;
			let footnote;
			const refTarget = getOne(ref.getAttribute("href"));
			if(refTarget)
			{
				if(refTarget.tagName === "A")
					footnote = refTarget.closest(FOOTNOTE_TAGNAME);
				else if(refTarget.tagName === FOOTNOTE_TAGNAME)
					footnote = refTarget;
			}
			if(footnote)
			{
				para.insertAdjacentElement("afterend", footnote);
				numFootnotesFixed++;
			}
			else
			{
				numFootnotesNotFound++;
			}
		}
	}
	showMessageBig(`Inlined ${numFootnotesFixed} footnotes, ${numFootnotesNotFound} footnote elements not found`);
}

function markUppercaseElements(selector)
{
	const elems = get(selector);
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		let s = elem.textContent;
		let cUpper = 0;
		let cLower = 0;
		cUpper = s.match(/[A-Z]/g);
		cLower = s.match(/[a-z]/g);
		if(cUpper && (!cLower || cUpper.length > cLower.length))
			markElement(elem);
	}
	insertStyleHighlight();
}

function markNumericElements(selector)
{
	const elements = get(selector);
	let i = elements.length;
	while(i--)
	{
		const elem = elements[i];
		if(getTextLength(elem) === 0) continue;
		let elemText = elem.textContent.replace(/\s+/g, "");
		if(elemText && !isNaN(Number(elemText)))
			markElement(elem);
	}
	insertStyleHighlight();
}

function setClassByDepth(selector = "div")
{
	const elems = get(selector);
	let i = elems.length;
	let node, level;
	while(i--)
	{
		node = elems[i];
		level = 0;
		while(node.parentNode)
		{
			node = node.parentNode;
			level++;
		}
		elems[i].className = "level" + level;
	}
	toggleStyle(STYLES.SHOW_SELECTORS, "styleShowSelectors", true);
}

function numberDivs()
{
	const e = get("header, footer, article, aside, section, div");
	let i = e.length;
	while(i--)
		e[i].id = "i" + i;
	for(let i = 0, ii = document.images.length; i < ii; i++)
		document.images[i].id = "img" + i;
	toggleStyle(STYLES.SHOW_SELECTORS, "styleShowSelectors", true);
}

function showTags()
{
	const e = Array.from( document.body.getElementsByTagName("*") );
	for(let i = 0, ii = e.length; i < ii; i++)
	{
		const elem = e[i];
		if(!elem || !elem.nodeType)
			continue;
		const elemTagName = elem.tagName;
		if(elemTagName)
		{
			elem.setAttribute("data-tagname", elemTagName.toLowerCase());
			elem.classList.add("nimbusShowTags");
		}
	}
	const style = `
		.nimbusShowTags { padding: 10px; margin: 10px; box-shadow: inset 4px 4px #000, inset -4px -4px #000; }
		.nimbusShowTags::before { content: attr(data-tagname); color: #F90; background: #000; padding: 2px 5px; }
		`;
	insertStyle(style, "styleShowTags", true);
}

function unmarkAll()
{
	const marked = getMarkedElements();
	if(!marked) return;
	const count = marked.length;
	unmarkElements(marked);
	showMessageBig(`Unmarked ${count} elements`);
}

function filterNodesByAttributeEqualTo(nodes, attribute, value)
{
	if(typeof value === "number")
		value += "";
	value = value.trim();
	let i = nodes.length;
	const result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.textContent.trim() === value)
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && node.getAttribute(attribute) === value)
				result.push(node);
		}
	}
	return result;
}

function filterNodesByAttributeNotEqualTo(nodes, attribute, value)
{
	let i = nodes.length;
	const result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.textContent.trim() !== value)
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && node.getAttribute(attribute) !== value)
				result.push(node);
		}
	}
	return result;
}

function filterNodesByAttributeValueLessThan(nodes, attribute, value)
{
	let i = nodes.length;
	const result = [];
	while(i--)
	{
		const node = nodes[i];
		const nodeAttr = node.hasAttribute(attribute) || node[attribute];
		if(nodeAttr)
		{
			const attrValue = parseInt(nodeAttr, 10);
			if(!isNaN(attrValue) && attrValue < value)
				result.push(node);
		}
	}
	return result;
}

function filterNodesByAttributeValueGreaterThan(nodes, attribute, value)
{
	let i = nodes.length;
	const result = [];
	while(i--)
	{
		const node = nodes[i];
		const nodeAttr = node.hasAttribute(attribute) || node[attribute];
		if(nodeAttr)
		{
			const attrValue = parseInt(nodeAttr, 10);
			if(!isNaN(attrValue) && attrValue > value)
				result.push(node);
		}
	}
	return result;
}

function filterNodesByAttributeContaining(nodes, attribute, value)
{
	let i = nodes.length;
	const result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(~node.textContent.indexOf(value))
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && ~node.getAttribute(attribute).indexOf(value))
				result.push(node);
		}
	}
	return result;
}

function filterNodesByAttributeNotContaining(nodes, attribute, value)
{
	let i = nodes.length;
	const result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.textContent.indexOf(value) === -1)
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && node.getAttribute(attribute).indexOf(value) === -1)
				result.push(node);
		}
	}
	return result;
}

function filterNodesByAttributeMatching(nodes, attribute, value)
{
	let i = nodes.length;
	const result = [];
	let regex = new RegExp(escapeForRegExp(value));
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(regex.test(node.textContent))
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && regex.test(node.getAttribute(attribute)))
				result.push(node);
		}
	}
	return result;
}

function filterNodesByAttributeExistence(nodes, attribute)
{
	let i = nodes.length;
	const result = [];
	while(i--)
	{
		const node = nodes[i];
		if(node.hasAttribute(attribute))
			result.push(node);
	}
	return result;
}

function filterNodesByAttributeNonExistence(nodes, attribute)
{
	let i = nodes.length;
	const result = [];
	while(i--)
	{
		const node = nodes[i];
		if(!node.hasAttribute(attribute))
			result.push(node);
	}
	return result;
}

function filterNodesWithChildrenOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(node.querySelector(selector))
			result.push(node);
	}
	return result;
}

function filterNodesWithoutChildrenOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(!node.querySelector(selector))
			result.push(node);
	}
	return result;
}

function filterNodesWithDirectChildrenOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(hasDirectChildrenOfType(node, selector))
			result.push(node);
	}
	return result;
}

function filterNodesWithoutDirectChildrenOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(!hasDirectChildrenOfType(node, selector))
			result.push(node);
	}
	return result;
}

function filterNodesWithFirstChildOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const firstChild = node.firstElementChild;
		if(firstChild && firstChild === node.firstChild && firstChild.matches(selector))
			result.push(node);
	}
	return result;
}

function filterNodesWithLastChildOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const lastChild = node.lastElementChild;
		if(lastChild && lastChild === node.lastChild && lastChild.matches(selector))
			result.push(node);
	}
	return result;
}

function filterNodesWithoutParentOfType(nodes, tagNameOrClass)
{
	const MAX_DEPTH = 20;
	const result = [];
	let i = nodes.length;
	if(tagNameOrClass.indexOf(".") === -1)
	{
		const tagNameUpper = tagNameOrClass.toUpperCase();
		while(i--)
		{
			const node = nodes[i];
			let hasParentOfType = false;
			let depth = 0;
			let currentNode = node;
			while(currentNode.parentNode && depth < MAX_DEPTH)
			{
				depth++;
				currentNode = currentNode.parentNode;
				if(currentNode.tagName && currentNode.tagName === tagNameUpper)
				{
					hasParentOfType = true;
					break;
				}
			}
			if(!hasParentOfType)
				result.push(node);
		}
	}
	else
	{
		const classSelector = tagNameOrClass;
		while(i--)
		{
			const node = nodes[i];
			let hasParentOfType = false;
			let depth = 0;
			let currentNode = node;
			while(currentNode.parentNode && depth < MAX_DEPTH)
			{
				depth++;
				currentNode = currentNode.parentNode;
				if(currentNode.classList.includes(classSelector))
				{
					hasParentOfType = true;
					break;
				}
			}
			if(!hasParentOfType)
				result.push(node);
		}
	}
	return result;
}

function filterNodesWithTextLengthUnder(nodes, maxLength)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(getTextLength(node) < maxLength)
			result.push(node);
	}
	return result;
}

function filterNodesWithTextLengthOver(nodes, maxLength)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(getTextLength(node) > maxLength)
			result.push(node);
	}
	return result;
}

function filterNodesFollowingNodesOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		// const prevSibling = node.previousSibling;
		const prevElement = node.previousElementSibling;
		// if(prevElement && prevElement === prevSibling && prevElement.matches(selector))
		if(prevElement && prevElement.matches(selector))
			result.push(node);
	}
	return result;
}

function filterNodesPrecedingNodesOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		// const nextSibling = node.nextSibling;
		const nextElement = node.nextElementSibling;
		// if(nextElement && nextElement === nextSibling && nextElement.matches(selector))
		if(nextElement && nextElement.matches(selector))
			result.push(node);
	}
	return result;
}

function select(...args)
{
	const selector = args[0];
	const elems = document.querySelectorAll(selector);
	if(elems && elems.length)
	{
		if(args.length === 4)
		{
			const attribute = args[1];
			const operator = args[2];
			const value = args[3];
			switch(operator)
			{
				case "equals":
				case "=":
					return filterNodesByAttributeEqualTo(elems, attribute, value);
				case "doesNotEqual":
				case "!=":
					return filterNodesByAttributeNotEqualTo(elems, attribute, value);
				case "<": return filterNodesByAttributeValueLessThan(elems, attribute, value);
				case ">": return filterNodesByAttributeValueGreaterThan(elems, attribute, value);
				case "contains": return filterNodesByAttributeContaining(elems, attribute, value);
				case "doesNotContain": return filterNodesByAttributeNotContaining(elems, attribute, value);
				case "matches": return filterNodesByAttributeMatching(elems, attribute, value);
				default: return [];
			}
		}
		else if(args.length === 3 && ["hasAttribute", "doesNotHaveAttribute", "following", "preceding"].includes(args[1]))
		{
			const operator = args[1];
			const attribute = args[2];
			switch(operator)
			{
				case "hasAttribute": return filterNodesByAttributeExistence(elems, attribute);
				case "doesNotHaveAttribute": return filterNodesByAttributeNonExistence(elems, attribute);
				case "following": return filterNodesFollowingNodesOfType(elems, attribute);
				case "preceding": return filterNodesPrecedingNodesOfType(elems, attribute);
				default: return [];
			}
		}
		else if(args.length === 3)
		{
			const operator = args[1];
			const value = args[2];
			switch(operator)
			{
				case "hasChildrenOfType": return filterNodesWithChildrenOfType(elems, value);
				case "hasDirectChildrenOfType": return filterNodesWithDirectChildrenOfType(elems, value);
				case "doesNotHaveChildrenOfType": return filterNodesWithoutChildrenOfType(elems, value);
				case "doesNotHaveDirectChildrenOfType": return filterNodesWithoutDirectChildrenOfType(elems, value);
				case "hasFirstChildOfType": return filterNodesWithFirstChildOfType(elems, value);
				case "hasLastChildOfType": return filterNodesWithLastChildOfType(elems, value);
				case "hasParentOfType": return get(value + " " + selector);
				case "doesNotHaveParentOfType": return filterNodesWithoutParentOfType(elems, value);
				case "hasTextLengthUnder": return filterNodesWithTextLengthUnder(elems, value);
				case "hasTextLengthOver": return filterNodesWithTextLengthOver(elems, value);
				default: return [];
			}
		}
	}
}

function mark(...args)
{
	const e = select(...args);
	if(!(e && e.length))
		return;
	let i = e.length;
	showMessageBig("Found " + i + " elements");
	while(i--)
		markElement(e[i]);
	insertStyleHighlight();
}

function unmark(...args)
{
	const e = select(...args);
	if(!(e && e.length))
		return;
	let i = e.length;
	showMessageBig("Found " + i + " elements");
	while(i--)
		unmarkElement(e[i]);
	insertStyleHighlight();
}

function remove(...args)
{
	const e = select(...args);
	if(!(e && e.length))
		return;
	showMessageBig("Removing " + e.length + " elements");
	del(e);
}

function removeQueryStringFromImageSources()
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

function removeQueryStringFromLinks()
{
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		link.href = trimAt(link.href, "?");
	}
}

function removeQueryStringFromLinksMatching(text)
{
	const links = get(`a[href*=${text}]`);
	if(!(links && links.length)) return;
	for(const link of links)
	{
		if(!link.href) continue;
		link.href = trimAt(link.href, "?");
	}
}

function deleteImagesSmallerThan(pixelArea)
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

function deleteSmallImages()
{
	deleteBySelectorAndText("img", "data:");
	deleteBySelectorAndText("img", "emoji");
	const nextThreshold = getNext(Nimbus.smallImageThreshold, Nimbus.smallImageThresholdList);
	Nimbus.smallImageThreshold = nextThreshold;
	deleteImagesSmallerThan(nextThreshold * nextThreshold);
}

function deleteImageByNumber(num)
{
	if(!document.images) return;
	if(document.images[num])
		document.images[num].remove();
}

function getBestImageSrc()
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

function shortenIds()
{
	const links = get('a[href^="#"]');
	const linksByHref = {};
	if(links)
	{
		for(const link of links)
		{
			const href = link.getAttribute("href").substring(1);
			if(linksByHref[href])
				linksByHref[href].push(link);
			else
				linksByHref[href] = [link];
		}
	}

	const elems = get("*[id]");
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(elem.tagName === "STYLE" || elem.tagName === "BODY") continue;
		const links = linksByHref[elem.id];
		if(links && links.length)
		{
			elem.id = "i" + i;
			for(const link of links)
				link.setAttribute("href", "#" + elem.id);
		}
		else
		{
			elem.removeAttribute("id");
		}
	}
}

function shortenImageSrc(src)
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

function replaceImagesWithAltText()
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

function replaceImagesWithTextLinks()
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

function retrieveLargeImages()
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

function getImageWidth(image)
{
	return image.naturalWidth || image.clientWidth;
}

function getImageHeight(image)
{
	return image.naturalHeight || image.clientHeight;
}

function persistStreamingImages(minSize)
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

function deletePersistedImages()
{
	clearTimeout(Nimbus.persistStreamingImagesTimeout);
	del("#nimbusStreamingImageContainer");
}

function showSavedStreamingImages()
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

function addLinksToLargerImages()
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

function tagLargeImages(threshold = 500)
{
	const images = get("img");
	for(let i = 0, ii = images.length; i < ii; i++)
	{
		const image = images[i];
		if(image.naturalWidth > threshold || image.naturalHeight > threshold)
			image.classList.add("large");
	}
}

function forceImageWidth(width, largeImagesOnly)
{
	tagLargeImages();
	if(width < 20)
		width *= 100;
	const className = largeImagesOnly ? ".large" : "";
	const s = `img${className} { width: ${width}px; height: auto; }`;
	insertStyle(s, "styleImageWidth", true);
}

function forceImageHeight(height, largeImagesOnly)
{
	tagLargeImages();
	if(height < 20)
		height *= 100;
	const className = largeImagesOnly ? ".large" : "";
	const s = `img${className} { height: ${height}px; width: auto; }`;
	insertStyle(s, "styleImageHeight", true);
}

function buildGallery()
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

function buildSlideshow()
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

function slideshowChangeSlide(direction)
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

function replaceIncorrectHeading()
{
	const heading1 = getOne("h1");
	if(heading1)
	{
		const heading1link = heading1.querySelector("a");
		if(heading1link)
		{
			if(isCurrentDomainLink(heading1link.href))
			{
				const temp = createElement("h3", { innerHTML: heading1.innerHTML });
				heading1.parentNode.replaceChild(temp, heading1);
			}
		}
	}
}

function replaceEmptyParagraphsWithHr()
{
	const elems = get("p");
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		if(getTextLength(elem) === 0 || /^[_•\*]+$/.test(elem.textContent.replace(/\s+/g, "")))
		{
			elem.parentNode.replaceChild(document.createElement("hr"), elem);
		}
	}
	removeRedundantHrs();
}

function makePlainText(selector)
{
	const elements = get(selector);
	if(!elements) return;
	if(selector === "pre") replaceBrsInPres();
	for(let i = 0, ii = elements.length; i < ii; i++)
		makeElementPlainText(elements[i]);
}

function makeElementPlainText(elem)
{
	const tagName = elem.tagName.toLowerCase();
	switch(tagName)
	{
		case "a":
			if(!elem.getElementsByTagName("img").length)
				elem.textContent = removeLineBreaks(elem.textContent);
			break;
		case "pre":
			elem.textContent = elem.textContent.trim();
			break;
		default:
			elem.textContent = removeLineBreaks(elem.textContent);
			break;
	}
}

function makeAnchorNodePlainText()
{
	const anchorNode = getNodeContainingSelection();
	if(anchorNode)
		makeElementPlainText(anchorNode);
}

function boldInlineColonHeadings()
{
	const paras = getMarkedElements();
	if(!(paras && paras.length))
	{
		showMessageBig("Didn't find any marked elements");
		return;
	}
	for(let i = 0, ii = paras.length; i < ii; i++)
	{
		const para = paras[i];
		para.innerHTML = normalizeHTML(para.innerHTML);
		if(/^[\w\d\.\s\-,"]+:.+/.test(para.innerHTML))
			para.innerHTML = para.innerHTML.replace(/(^[\w\d\.\s\-,"]+:)/, "<b>$1</b>");
	}
	unmarkAll();
}

function replaceCommonClasses()
{
	replaceElementsBySelector("strong", "b");
	replaceElementsBySelector("em", "i");

	replaceElementsBySelector(".pn, .pt, .partnum, .parttitle, .pt-num, .pt-title, .partno", "h1");
	replaceElementsBySelector(".cn, .ct, .chapnum, .chapter, .chapternumber, .tochead, .chaptitle, .chaptertitle, .chap-num, .chap-title, .fmh, .fmht, .fmtitle, .fm-title, .chapno, .chno, .chnum, .chtitle, .ch-num, .ch-title, .chap-tit, .title-num", "h2");
	replaceElementsBySelector(".cst, .h", "h3");
	replaceElementsBySelector(".figcap", "figcaption");
	replaceElementsBySelector(".fig-cap", "figcaption");
	replaceElementsBySelector(".figure", "figure");
	replaceElementsBySelector(".comment", "comment");
	replaceElementsBySelector(".fn, .fn1, p[class*=footnote]", "footnote");

	// replaceElementsBySelector("div.calibre", "section");
	replaceElementsBySelector(".epub-i, .i", "i");
	replaceElementsBySelector(".epub-b, .b", "b");
	replaceElementsBySelector(".epub-sc, .small", "small");
	replaceElementsBySelector("div.block, .afmtx, .afmtx1", "blockquote");

	replaceElementsBySelector("div[class*=comment-author]", "h5");
	replaceElementsBySelector("div[class*=comment-meta]", "h6");
	replaceElementsBySelector("div[class*=comment-footer]", "h6");
	replaceElementsBySelector("div[class*=sidebar]", "aside");
	replaceElementsBySelector("div[class*=social]", "aside");
	replaceElementsBySelector("p[class*=toc-head]", "h2");
	replaceElementsBySelector("p[class*=subtitle], div[class*=subtitle], p[class*=subhead], div[class*=subhead]", "h3");
	replaceElementsBySelector("p[class*=image], div[class*=image]", "figure");
	replaceElementsBySelector("p[class*=caption], div[class*=caption]", "figcaption");
	replaceElementsBySelector("p[class*=quote], div[class*=quote]", "blockquote");
	replaceElementsBySelector("p[class*=author], div[class*=author]", "h4");
	replaceElementsBySelector("p[class*=date], div[class*=date]", "h5");
	replaceElementsBySelector("p[class*=quote], div[class*=quote]", "blockquote");

	replaceElementsBySelector("span[class*=ital], span[class*=txit], span[class*=epub-i]", "i");
	replaceElementsBySelector("span[class*=bold], span[class*=txbd], span[class*=epub-b]", "b");
	replaceElementsBySelector("span[class*=small]", "small");

	replaceElementsBySelector("body > div", "section");
	deleteEmptyElements("section");

	removeAttributeOf("a, i, b, sup, small", "class");

	replaceElementsBySelector(".indexmain", "dt");
	replaceElementsBySelector(".indexsub", "dd");

	document.body.innerHTML = document.body.innerHTML.replaceAll("calibre_link-", "l");
}

//	Some people use <br> elements to create line breaks inside pres.
//	"Only two things are infinite..."
function replaceBrsInPres()
{
	const brs = document.querySelectorAll("pre br");
	for(let i = 0, ii = brs.length; i < ii; i++)
	{
		const br = brs[i];
		br.parentNode.replaceChild(document.createTextNode("\n"), br);
	}
}

function tabifySpacesInPres()
{
	const pres = get("pre");
	for(const pre of pres)
	{
		let s = pre.innerHTML;
		if(/\n  [^ ]/.test(s))
			s = s.replace(/ {2}/g, "\t");
		else if(/\n   [^ ]/.test(s))
			s = s.replace(/ {3}/g, "\t");
		else if(/\n    [^ ]/.test(s))
			s = s.replace(/ {4}/g, "\t");
		else
			s = s.replace(/ {4}/g, "\t");
		pre.innerHTML = s;
	}
}

function fixParagraphs()
{
	replaceBrs();
	deleteEmptyElements("p");
	cleanupHeadings();
	rescueOrphanedTextNodes();
}

function fixDashes()
{
	const ps = get("p, li, blockquote");
	for(const p of ps)
		p.innerHTML = removeLineBreaks(p.innerHTML);

	let replCount = 0;
	const regex = /(\s+[-–—]\s+|\s+[-–—]|[-–—]\s+|--)/g;
	const textNodes = getTextNodesExcludingPre();
	for(const textNode of textNodes)
	{
		if(regex.test(textNode.data))
		{
			replCount++;
			textNode.data = textNode.data.replace(regex, "—");
		}
	}
	if(replCount)
		showMessageBig(`${replCount} text nodes fixed`);
}

function toggleDashes()
{
	const node = getNodeContainingSelection();
	if(node)
	{
		if(node.textContent.indexOf('-') !== -1)
			node.textContent = node.textContent.replace(/-/g, "\u2014");
		else
			node.textContent = node.textContent.replaceAll("\u2014", "-");
	}
}

function looksLikeUrl(str)
{
	if(str.indexOf("http") === 0)
		return true;
	if(~str.indexOf("/"))
		return true;
}

function filterHeadings(headings)
{
	if(!headings.length)
		return null;
	const filteredHeadings = [];
	for(let i = 0, ii = headings.length; i < ii; i++)
	{
		const heading = headings[i];
		if(!startsWithAnyOfTheStrings(heading.textContent, ["Share", "Comments"]))
			filteredHeadings.push(heading);
	}
	return filteredHeadings;
}

function cleanupTitle()
{
	const titleText = sanitizeTitle(document.title);
	const headings = document.querySelectorAll("h1, h2");
	if(headings && headings.length)
	{
		for(let i = 0, ii = headings.length; i < ii; i++)
		{
			const heading = headings[i];
			if(!heading.textContent || !heading.textContent.length)
				continue;
			const headingText = sanitizeTitle(heading.textContent);
			if(removeWhitespace(headingText).length === 0)
				continue;
			if(!titleText)
			{
				document.title = headingText;
				return;
			}
			else if(~titleText.indexOf(headingText) && headingText.length < titleText.length)
			{
				document.title = headingText;
				return;
			}
		}
	}
}

function editDocumentTitle()
{
	const currentHeading = chooseDocumentHeading();
	callFunctionWithArgs("Set document heading", setDocTitle, 1, currentHeading);
}

function chooseDocumentHeading()
{
	Nimbus.currentHeadingText = getTitleWithoutDomainTag();
	return Nimbus.currentHeadingText;
}

function cycleThroughDocumentHeadings()
{
	const MAX_HEADINGS = 5;
	deleteEmptyHeadings();
	Nimbus.currentHeadingText = getTitleWithoutDomainTag();
	del(Nimbus.HEADING_CONTAINER_TAGNAME + " h1");
	const headings = filterHeadings(get("h1, h2"));
	const candidateHeadingTexts = [];
	if(headings && headings.length)
	{
		for(let i = 0, ii = Math.min(MAX_HEADINGS, headings.length); i < ii; i++)
		{
			const heading = headings[i];
			if(heading.classList.contains("currentHeading"))
				continue;
			const text = sanitizeTitle(heading.textContent);
			if(text.length && !candidateHeadingTexts.includes(text))
				candidateHeadingTexts.push(text);
		}
	}
	if(candidateHeadingTexts.length && Nimbus.currentHeadingText)
		Nimbus.currentHeadingText = getNext(Nimbus.currentHeadingText, candidateHeadingTexts);

	const pageNumberStrings = document.body.textContent.match(/Page [0-9]+ of [0-9]+/);
	if(pageNumberStrings && !/Page [0-9]+/i.test(Nimbus.currentHeadingText))
		Nimbus.currentHeadingText = Nimbus.currentHeadingText + " - " + pageNumberStrings[0];
	setDocTitle(Nimbus.currentHeadingText);
	return Nimbus.currentHeadingText;
}

function setDocumentHeading(headingText)
{
	emptyElement(getOne(Nimbus.HEADING_CONTAINER_TAGNAME));
	const firstHeadingText = document.body.firstChild.textContent;
	if(firstHeadingText === headingText)
		return;
	let newHeading = createElement("h1", { textContent: headingText });
	let newHeadingWrapper = getOne(Nimbus.HEADING_CONTAINER_TAGNAME);
	if(!newHeadingWrapper)
	{
		newHeadingWrapper = createElement(Nimbus.HEADING_CONTAINER_TAGNAME);
		document.body.insertBefore(newHeadingWrapper, document.body.firstChild);
	}
	newHeadingWrapper.appendChild(newHeading);
	Nimbus.currentHeadingText = headingText;
}

function getBestDomainSegment(hostname)
{
	if(!hostname || !hostname.length)
		return "";
	const segmentsToReplace = ["www.", "developer.", ".com", ".org", ".net", ".wordpress", ".blogspot"];
	let hostnameSanitized = hostname;
	for(let i = 0, ii = segmentsToReplace.length; i < ii; i++)
		hostnameSanitized = hostnameSanitized.replace(segmentsToReplace[i], "");
	if(/\w+\.github\.io/.test(hostnameSanitized))
		hostnameSanitized = hostnameSanitized.replace(".github.io", "");
	if(hostnameSanitized.indexOf(".") === -1)
		return " [" + hostnameSanitized + "]";
	let segments = hostnameSanitized.split(".");
	let longestSegment = '';
	let i = segments.length;
	while(i--)
	{
		let segment = segments[i];
		if(longestSegment.length < segment.length)
			longestSegment = segment;
	}
	return " [" + longestSegment + "]";
}

function removeColorsFromInlineStyles()
{
	const elems = get("div");
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		if(elem.hasAttribute("style"))
		{
			let styleText = elem.getAttribute("style");
			styleText = styleText.replace(/background/g, "XXX").replace(/color/g, "YYY");
			elem.setAttribute("style", styleText);
		}
	}
}

function deselect()
{
	window.getSelection().removeAllRanges();
}

function showPassword()
{
	const inputs = get("input");
	let i = inputs.length;
	while(i--)
	{
		const input = inputs[i];
		if(input.type && input.type === "password" && !input.classList.contains("showPassword"))
		{
			input.addEventListener("keyup", echoPassword, false);
			input.classList.add("showPassword");
		}
	}
}

function echoPassword(e)
{
	showMessage(e.target.value, "none", true);
}

function getPageNavLinks()
{
	const links = get("a");
	const pagerWrapper = createElement("h1", { textContent: "Pages: " });
	let count = 0;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		let linkText = link.textContent;
		if(linkText && linkText.trim().length && !isNaN(Number(linkText)))
		{
			count++;
			pagerWrapper.appendChild(createElement("a", { href: link.href, textContent: link.textContent || "[no text]" }));
			pagerWrapper.appendChild(document.createTextNode(" "));
		}
	}
	if(count)
	{
		document.body.appendChild(pagerWrapper);
		pagerWrapper.querySelector("a").focus();
	}
	else
		showMessageBig("No page nav links found");
	createPagerFromSelect();
}

function createPagerFromSelect()
{
	const selects = get("select");
	for(let j = 0, jj = selects.length; j < jj; j++)
	{
		const select = selects[j];
		for(let i = 0, ii = select.length; i < ii; i++)
		{
			const option = select[i];
			if(looksLikeUrl(option.value))
			{
				const pagerWrapper = createElement("h3");
				pagerWrapper.appendChild(createElement("a", { href: option.value, textContent: option.textContent || i + 1 }));
				document.body.appendChild(pagerWrapper);
			}
		}
	}
	document.body.appendChild(createElement("hr"));
}

function cycleFocusOverFormFields()
{
	let inputs = get("input, textarea");
	const len = inputs.length;
	if(len === 1)
	{
		focusField(inputs[0]);
		return;
	}
	const candidateInputs = [];
	const excludedInputTypes = {
		hidden: true,
		submit: true,
		reset: true,
		button: true,
		radio: true,
		checkbox: true,
		image: true
	};
	for(let i = 0; i < len; i++)
	{
		const input = inputs[i];
		if(input.type)
		{
			if(!excludedInputTypes[input.type])
				candidateInputs.push(input);
		}
		else
		{
			candidateInputs.push(input);
		}
	}
	let found = false;
	for(let i = 0, ii = candidateInputs.length; i < ii; i++)
	{
		if(candidateInputs[i].classList.contains("focused"))
		{
			found = true;
			if(i < ii-1)
				focusField(candidateInputs[i + 1]);
			else
				focusField(candidateInputs[0]);
			break;
		}
	}
	if(!found)
		focusField(candidateInputs[0]);
}

function focusField(elem)
{
	if(!elem)
		return;
	deleteClass("focused");
	elem.focus();
	elem.classList.add("focused");
	showMessageBig(`Focused ${createSelector(elem)}`);
	consoleLog("focusField: " + createSelector(document.activeElement));
}

function focusButton()
{
	let candidateButtons = [];
	const inputElements = get("input");
	let len = inputElements.length;
	for(let i = 0; i < len; i++)
	{
		const inputElement = inputElements[i];
		if(inputElement.type && ["button", "submit"].includes(inputElement.type))
			candidateButtons.push(inputElement);
	}
	const buttonElements = get("button");
	candidateButtons = candidateButtons.concat(buttonElements);
	if(candidateButtons.length === 1)
	{
		focusField(candidateButtons[0]);
		return;
	}
	let found = false;
	for(let i = 0, ii = candidateButtons.length; i < ii; i++)
	{
		if(candidateButtons[i].classList.contains("focused"))
		{
			found = true;
			if(i < ii-1)
				focusField(candidateButtons[i+1]);
			else
				focusField(candidateButtons[0]);
			break;
		}
	}
	if(!found)
		focusField(candidateButtons[0]);
}

function parseCode(s)
{
	let t = "";
	let cur, prev, next;
	let phpVarRegex;
	let i, ii;
	for(i = 0, ii = s.length; i < ii; i++)
	{
		cur = s[i];
		prev = i > 0 ? s[i-1] : null;
		next = i < ii-1 ? s[i+1] : null;
		switch(cur)
		{
			// double quote strings
			case '"':
				t += '<xs>"';
				i++;
				while(s[i] && s[i]!== '"')
				{
					t += s[i];
					i++;
				}
				t += '"</xs>';
				break;
			// single quote strings
			case "'":
				t += "<xs>'";
				i++;
				while(s[i] && s[i]!== "'")
				{
					t += s[i];
					i++;
				}
				t += "'</xs>";
				break;
			// comments
			case '/':
				if(prev && prev === ":") // is a URL, don't highlight
				{
					t += cur;
				}
				else if(next === '/') // single-line comment
				{
					t += "<xc>/";
					i++;
					while(s[i] && s[i].match(/[\r\n]/) === null)
					{
						t += s[i];
						i++;
					}
					t += '</xc>\r\n';
				}
				else if(next === '*') // block comment
				{
					t += '<xc>' + cur;
					i++;
					while(s[i] && !(s[i] === '*' && s[i+1] === '/'))
					{
						t += s[i];
						i++;
					}
					t += '*/</xc>';
					i++;
				}
				else
				{
					t += cur;
				}
				break;
			// PHP variables
			case '$':
				phpVarRegex = new RegExp('[a-z0-9_\-]', 'i');
				if(next && phpVarRegex.test(next))
				{
					t += '<xv>' + cur;
					i++;
					if(s[i] && phpVarRegex.test(s[i]))
					{
						while(s[i] && phpVarRegex.test(s[i]))
						{
							t += s[i];
							i++;
						}
						i--;
					}
					else
					{
						t += cur;
					}
					t += '</xv>';
				}
				else
				{
					t += cur;
				}
				break;
			// brackets
			case '{':
			case '}':
				t += '<xp>' + cur + '</xp>';
				break;
			case '(':
			case ')':
				t += '<xp>' + cur + '</xp>';
				break;
			case '[':
			case ']':
				t += '<xp>' + cur + '</xp>';
				break;
			// no highlighting
			default:
				t += cur;
				break;
		}
	}
	return t;
}

function highlightCode(shouldHighlightKeywords)
{
	removeAttributeOf("pre", "class");
	if(get("pre span[style]"))
	{
		replaceInlineStylesWithClasses();
		replaceClassesWithCustomElements("pre span", "x");
		unwrapAll("pre span");
		return;
	}
	if(get("pre span[class]"))
	{
		replaceClassesWithCustomElements("pre span", "x");
		unwrapAll("pre span");
		return;
	}
	else if(get("pre code[class]"))
	{
		replaceClassesWithCustomElements("pre code", "x");
		unwrapAll("pre code");
		return;
	}

	replaceBrsInPres();
	makePlainText("pre");

	const preBlocks = get("pre");
	let i = preBlocks.length;
	while(i--)
	{
		const preElement = preBlocks[i];
		// delete the <pre>s that only contain line numbers
		if(preElement.textContent && !/[a-z]/.test(preElement.textContent))
		{
			preElement.remove();
			continue;
		}

		let nodeHTML = preElement.innerHTML;
		// nodeHTML = nodeHTML.replace(/<span[^>]*>/g, "");
		// nodeHTML = nodeHTML.replace(/<\/span>/g, "");
		nodeHTML = parseCode(nodeHTML);

		// Everything between angle brackets
		nodeHTML = nodeHTML.replace(/(&lt;\/?[^&\r\n]+&gt;)/g, '<xh>$1</xh>');
		// php/XML opening and closing tags
		nodeHTML = nodeHTML.replace(/(&lt;\?)/g, '<b1>$1</b1>');
		nodeHTML = nodeHTML.replace(/(\?&gt;)/g, '<b1>$1</b1>');

		if(shouldHighlightKeywords === true)
		{
			const keywords = [
				"abstract", "addEventListener", "appendChild", "arguments", "async", "await", "abs",
				"break", "byte",
				"case", "catch", "char", "class", "const", "continue", "createElement", "createTextNode",
				"debugger", "default", "delete", "do", "document", "documentElement", "double",
				"else", "enum", "export", "extends", "eval",
				"false", "final", "finally", "firstChild", "float", "for", "function", "float2", "float3", "float4",
				"getElementsByClassName", "getElementsByID", "getElementsByTagName", "goto",
				"if", "implements", "import", "in", "Infinity", "insertBefore", "instanceof", "int", "interface",
				"let", "long", "lerp",
				"mediump",
				"NaN", "native", "new", "npm", "null",
				"object", "onclick", "onload", "onmouseover",
				"package", "private", "protected", "prototype", "public", "precision",
				"querySelector", "querySelectorAll",
				"return", "register",
				"script", "src", "static", "String", "struct", "switch", "synchronized", "sampler",
				"this", "throw", "throws", "transient", "true", "try", "type", "typeof", "texture2D",
				"undefined", "uniform",
				"var", "void", "volatile", "vec4", "varying",
				"yarn", "yield",
				"while", "window", "with"
			];
			let j = keywords.length;
			while(j--)
			{
				const regex = new RegExp("\\b" + keywords[j] + "\\b", "g");
				nodeHTML = nodeHTML.replace(regex, "<xk>" + keywords[j] + "</xk>");
			}
		}
		preElement.innerHTML = nodeHTML;
	}
	// makePlainText("xc");
	// makePlainText("xs");
}

function getNodeContainingSelection()
{
	const selection = window.getSelection();
	if(!selection)
	{
		showMessageError("Couldn't get selection");
		return false;
	}
	return getFirstBlockParent(selection.anchorNode);
}

function toggleContentEditable()
{
	function makeNonEditable(elem) { elem.removeAttribute("contenteditable"); }
	const selectedNode = getNodeContainingSelection();
	const MAX_TEXT_LENGTH = 10000;
	if(!selectedNode)
		return;
	if(selectedNode.textContent.length > MAX_TEXT_LENGTH)
		return;
	let isEditable = selectedNode.getAttribute("contenteditable") === "true";
	selectedNode.setAttribute("contenteditable", isEditable ? "false" : "true");
	isEditable = !isEditable;
	if(isEditable)
	{
		showMessageBig("contentEditable ON");
		selectedNode.focus();
		Nimbus.isEditing = true;
	}
	else
	{
		showMessageBig("contentEditable OFF");
		// selectedNode.removeAttribute("contentEditable");
		forAll("*[contenteditable]", makeNonEditable);
		const tagName = selectedNode.tagName;
		if(tagName !== "PRE")
		{
			if(["H1", "H2", "H3", "H4", "H5", "H6"].includes(tagName))
				splitByBrs(selectedNode, "hgroup", tagName);
			else
				splitByBrs(selectedNode);
		}
		Nimbus.isEditing = false;
	}
}

function revealLinkHrefs()
{
	const style = "a::after { content: attr(href); background: #000; color: #F90; padding: 2px 10px; }";
	insertStyle(style, "styleRevealLinkHrefs", true);
}

function humanizeUrl(url)
{
	const matches = url.match(/[0-9A-Za-z_\-\+]+/g);
	if(!matches)
		return url;
	let i = matches.length;
	let longestMatch = matches[i - 1];
	while(i--)
		if(matches[i].length > longestMatch.length)
			longestMatch = matches[i];
	return longestMatch;
}

function isEmptyLink(link) { return !(getTextLength(link) || link.getElementsByTagName("img").length); }

function revealEmptyLinks()
{
	const links = get("a");
	for(const link of links)
		if(isEmptyLink(link))
			link.textContent = link.href;
}

function toggleShowEmptyLinksAndSpans()
{
	if(getOne("#styleToggleShowEmptyLinksAndSpans"))
	{
		del("#styleToggleShowEmptyLinksAndSpans");
		unmarkAll();
		return;
	}
	const links = get("a");
	let countLinks = 0;
	let countSpans = 0;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		if(isEmptyLink(link))
		{
			countLinks++;
			markElement(link);
		}
	}
	const spans = get("span");
	for(let i = 0, ii = spans.length; i < ii; i++)
	{
		const span = spans[i];
		if(!(span.textContent.length || span.getElementsByTagName("img").length))
		{
			countSpans++;
			markElement(span);
		}
	}
	const style = `
		a.${Nimbus.markerClass} { padding: 0 5px; }
		a.${Nimbus.markerClass}::before { content: "id: "attr(id)", name: "attr(name); color: #FF0; }
		a.${Nimbus.markerClass}::after { content: attr(href); color: #55F; }
		span.${Nimbus.markerClass} { padding: 0 10px; }
		span.${Nimbus.markerClass}::before { content: attr(id)" "; color: #0F0; }
	`;
	insertStyle(style, 'styleToggleShowEmptyLinksAndSpans', true);
	showMessageBig(`Revealed ${countLinks} empty links and ${countSpans} empty spans`);
}

function createBackLink(id)
{
	const idLink = "#" + id;
	const linksToId = get(`a[href="${idLink}"]`);
	const backLinkContainer = document.createElement("reference");
	for(let i = 0, ii = linksToId.length; i < ii; i++)
	{
		const link = linksToId[i];
		const linkText = link.textContent;
		const linkId = link.id || createUUID();
		if(!link.id) link.id = linkId;
		const backLink = createElement("a", { href: "#" + linkId, textContent: linkText });
		backLinkContainer.appendChild(backLink);
	}
	if(linksToId.length)
		return backLinkContainer;
	else
		return createBulletAnchor(id);
}

function changePageByUrl(direction)
{
	const url = window.location.href;
	const urlPageMatch = url.match(/page\/[0-9]+/);
	if(urlPageMatch)
	{
		let page = parseInt(urlPageMatch[0].split('/')[1], 10);
		let currentPage = page;
		switch(direction)
		{
			case "previous": page--; break;
			case "next": page++; break;
		}
		if(page < 1)
			page = 1;
		showMessageBig(`Found page ${currentPage} in URL, Going to page ${page}`);
		const newUrl = url.replace(urlPageMatch[0], `page/${page}`);
		consoleLog(newUrl);
		location.href = newUrl;
		return true;
	}

	const queryParams = parseQueryString(url);
	if(!queryParams)
		return false;
	let found = false;
	let page;
	let currentPage;
	for(let i = 0, ii = queryParams.length; i < ii; i++)
	{
		if(["page", "p"].includes(queryParams[i].key))
		{
			found = true;
			page = parseInt(queryParams[i].value, 10);
			currentPage = page;
			switch(direction)
			{
				case "previous": page--; break;
				case "next": page++; break;
			}
			if(page < 1)
				page = 1;
			queryParams[i].value = page;
			break;
		}
	}
	if(found)
	{
		showMessageBig(`Found page ${currentPage} in query string, going to page ${page}`);
		let newQueryString = "";
		for(let i = 0, ii = queryParams.length; i < ii; i++)
			newQueryString += `${queryParams[i].key}=${queryParams[i].value}&`;
		let baseUrl = trimAt(url, "?");
		const newUrl = `${baseUrl}?${newQueryString}`;
		location.href = newUrl.substring(0, newUrl.length - 1);
		return true;
	}
	return false;
}

function changePage(direction)
{
	const canChangePageByUrl = changePageByUrl(direction);
	if(canChangePageByUrl)
		return;
	const links = get("a");
	let matchStrings = [];
	if(direction === "previous")
		matchStrings = ["previous", "previous", "previouspage", "\u00AB", "\u2190"];
	else if(direction === "next")
		matchStrings = ["next", "nextpage", "\u00BB", "\u25BA", "\u2192"];

	let i = links.length;
	while(i--)
	{
		const link = links[i];
		let linkText = link.textContent;
		if(linkText)
		{
			linkText = linkText.replace(/[^a-zA-Z0-9\u00AB\u00BB\u25BA]/g, "").toLowerCase();
			if(matchStrings.includes(linkText) || containsAnyOfTheStrings(linkText, matchStrings))
			{
				link.innerHTML = "<mark>" + link.innerHTML + "</mark>";
				location.href = link.href;
				return;
			}
		}
	}
}

function cycleHighlightTag()
{
	const nextTag = getNext(Nimbus.highlightTagName, Nimbus.highlightTagNameList);
	showMessageBig({ text: `Highlight tag is ${nextTag}`, tag: nextTag });
	Nimbus.highlightTagName = nextTag;
}

function resetHighlightTag()
{
	const nextTag = Nimbus.highlightTagNameList[0];
	if(Nimbus.highlightTagName === nextTag)
		return;
	showMessageBig({ text: `Highlight tag is ${nextTag}`, tag: nextTag });
	Nimbus.highlightTagName = nextTag;
}

function setMarkerClass(str) { Nimbus.markerClass = str; }
function setReplacementTag1(tagName) { Nimbus.replacementTagName1 = tagName; }
function setReplacementTag2(tagName) { Nimbus.replacementTagName2 = tagName; }
function setItalicTag(tagName) { Nimbus.italicTag = tagName; }

function moveElementUp(position)
{
	const elem = getFirstMarkedElement();
	if(!elem)
	{
		showMessageBig("Nothing marked");
		return;
	}
	const currentParent = elem.parentNode;
	if(currentParent)
	{
		if(position === "before") currentParent.insertAdjacentElement("beforebegin", elem);
		else if(position === "after") currentParent.insertAdjacentElement("afterend", elem);
	}
}

function swapElementPositions()
{
	const marked = getMarkedElements();
	if(marked.length !== 2)
	{
		showMessageBig(`Expected 2 marked elements; found ${marked.length}`);
		return false;
	}
	const c0 = document.createElement("div");
	const c1 = document.createElement("div");
	marked[0].insertAdjacentElement("beforebegin", c1);
	marked[1].insertAdjacentElement("beforebegin", c0);
	c0.appendChild(marked[0]);
	c1.appendChild(marked[1]);
	unwrapElement(c0);
	unwrapElement(c1);
	unmarkAll();
}

function goToNextElement(selector)
{
	const config = Nimbus.goToNextElement;
	if(selector)
	{
		config.selector = selector;
		config.elements = get(selector);
		if(config.elements.length)
		{
			config.currentElement = config.elements[0];
			config.currentElement.scrollIntoView();
		}
	}
	else
	{
		const elementToScrollTo = getNext(config.currentElement, config.elements);
		if(elementToScrollTo)
		{
			config.currentElement = elementToScrollTo;
			elementToScrollTo.scrollIntoView();
		}
	}
}

function goToPrevElement(selector)
{
	const config = Nimbus.goToNextElement;
	if(selector)
	{
		config.selector = selector;
		config.elements = get(selector);
		if(config.elements.length)
		{
			config.currentElement = config.elements[0];
			config.currentElement.scrollIntoView();
		}
	}
	else
	{
		const elementToScrollTo = getPrevious(config.currentElement, config.elements);
		if(elementToScrollTo)
		{
			config.currentElement = elementToScrollTo;
			elementToScrollTo.scrollIntoView();
		}
	}
}

function goToLastElement(selector)
{
	const config = Nimbus.goToNextElement;
	if(selector)
	{
		config.selector = selector;
		config.elements = get(selector);
		if(config.elements.length)
		{
			config.currentElement = config.elements[config.elements.length - 1];
			config.currentElement.scrollIntoView();
		}
	}
}

function setGroupTagName(tagName)
{
	if(typeof tagName === "string" && tagName.length)
	{
		Nimbus.GROUP_TAGNAME = tagName;
	}
	else
	{
		showMessageBig("No tag provided, defaulting to blockquote");
		Nimbus.GROUP_TAGNAME = "blockquote";
	}
}

function groupMarkedElements(tagName)
{
	const groupTagName = tagName || "ul";
	const elemsToJoin = getMarkedElements();
	if(!elemsToJoin.length)
		return;
	const wrapper = document.createElement(groupTagName);
	for(let i = 0, ii = elemsToJoin.length; i < ii; i++)
	{
		const elem = elemsToJoin[i];
		const child = convertElement(elem, elem.tagName);
		child.id = elem.id;
		wrapper.appendChild(child);
	}
	insertBefore(elemsToJoin[0], wrapper);
	del(makeClassSelector(Nimbus.markerClass));
	deleteMessage();
}

function groupAdjacentElements(selector, parentTag, childTag)
{
	const elems = get(selector);
	const firstElemTagName = elems[0].tagName;
	let parentTagName = parentTag || "";
	let childTagName = childTag || "";
	if(!(parentTagName && childTagName))
	{
		switch(firstElemTagName)
		{
			case "BLOCKQUOTE":
			case "P":
				parentTagName = "blockquote";
				childTagName = "p";
				break;
			case "LI":
				parentTagName = "ul";
				childTagName = "li";
				break;
			default:
				parentTagName = "blockquote";
				childTagName = "same";
				break;
		}
	}
	const groups = [];
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const group = document.createElement(parentTagName);
		groups.push(group);
		if(childTagName === "same")
			group.appendChild(cloneElement(elem));
		else
			group.appendChild(convertElement(elem, childTagName));
		let nextElem = elem.nextElementSibling;
		// while(nextElem && nextElem === elem.nextSibling && elems.includes(nextElem))
		while(nextElem && elems.includes(nextElem))
		{
			i++;
			const nextElemTemp = nextElem.nextElementSibling;
			if(childTagName === "same")
				group.appendChild(cloneElement(nextElem));
			else
				group.appendChild(convertElement(nextElem, childTagName));
			nextElem.remove();
			nextElem = nextElemTemp;
		}
		if(elem.parentNode)
			elem.parentNode.replaceChild(group, elem);
	}
	return groups;
}

function makeUL() { makeList("ul"); }
function makeOL() { makeList("ol"); }

function makeList(listTagName)
{
	const groups = groupAdjacentElements(makeClassSelector(Nimbus.markerClass), listTagName, "li");
	if(groups.length)
	{
		for(let i = 0, ii = groups.length; i < ii; i++)
		{
			const elems = groups[i].querySelectorAll("li");
			if(elems)
				fixBullets(elems);
		}
	}
}

function makeDocumentHierarchical()
{
	const headingSelectors = ["h6", "h5", "h4", "h3", "h2", "h1"];
	for(let i = 0, ii = headingSelectors.length; i < ii; i++)
		groupUnderHeadings(headingSelectors[i]);
}

function groupUnderHeadings(selector, selectorToBreakOn)
{
	const headings = get(selector);
	for(let i = 0, ii = headings.length; i < ii; i++)
		groupUnderHeading(headings[i], selectorToBreakOn);
}

function groupUnderHeading(heading, selectorToBreakOn)
{
	const WRAPPER_ELEMENT_TAGNAME = "section";
	const headingTagName = heading.tagName;
	const wrapperElem = document.createElement(WRAPPER_ELEMENT_TAGNAME);
	const elemsToDelete = [];
	wrapperElem.appendChild(heading.cloneNode(true));
	let nextElem = heading.nextElementSibling;
	let count = 0;
	while(nextElem && nextElem.tagName !== headingTagName && !nextElem.matches(selectorToBreakOn) && count < 1000)
	{
		count++;
		wrapperElem.appendChild(nextElem.cloneNode(true));
		elemsToDelete.push(nextElem);
		nextElem = nextElem.nextElementSibling;
	}
	heading.parentNode.replaceChild(wrapperElem, heading);
	del(elemsToDelete);
}

function joinAdjacentElements(selector)
{
	const idsToSave = [];
	deleteEmptyTextNodes();
	const elems = get(selector);
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		let nextElem = elem.nextElementSibling;
		while(nextElem && nextElem === elem.nextSibling && nextElem.matches(selector))
		{
			i++;
			while(nextElem.firstChild)
			{
				elem.appendChild(document.createTextNode(" "));
				elem.appendChild(nextElem.firstChild);
			}
			const appendedElem = nextElem;
			if(appendedElem.id)
				idsToSave.push(appendedElem.id);
			nextElem = nextElem.nextElementSibling;
			appendedElem.remove();
		}
		saveIdsToElement(elem, idsToSave);
	}
}

function joinParagraphsByLastChar()
{
	const MINLENGTH = 20;
	const paras = get("p");
	const regexLowercaseOrComma = /[a-z,]/;
	let i = paras.length;
	while(i--)
	{
		const para = paras[i];
		const paraText = para.textContent.trim();
		if(!paraText || paraText.length < MINLENGTH)
			continue;
		const lastChar = paraText[paraText.length - 1];
		if(regexLowercaseOrComma.test(lastChar))
		{
			const nextPara = para.nextElementSibling;
			if(nextPara && nextPara.tagName === "P")
			{
				markElement(para);
				para.appendChild(document.createTextNode(" "));
				while(nextPara.firstChild)
					para.appendChild(nextPara.firstChild);
			}
		}
		else if(lastChar === "-")
		{
			const nextPara = para.nextElementSibling;
			if(nextPara && nextPara.tagName === "P")
			{
				markElement(para);
				while(nextPara.firstChild)
					para.appendChild(nextPara.firstChild);
			}
		}
	}
}

function createBulletAnchor(id)
{
	const CHAR_BULLET = '\u2022';
	return createElement("cite", { textContent: CHAR_BULLET, id: id });
}

function saveIdsToElement(element, ids)
{
	if(ids.length === 1 && !element.id)
	{
		element.id = ids[0];
	}
	else
	{
		for(let j = 0, jj = ids.length; j < jj; j++)
			element.appendChild(createBulletAnchor(ids[j]));
	}
}

function selectNodesContainingSelection()
{
	const sel = window.getSelection();
	if(!window.getSelection().toString().length) return false;
	let firstNode = getFirstBlockParent(sel.anchorNode);
	let lastNode = getFirstBlockParent(sel.focusNode);
	if(firstNode === lastNode)
	{
		showMessageBig("Selection is contained within one node, it needs to span at least two");
		return;
	}
	const result = [];
	// swap first and last nodes if the user selected text backwards
	const relativePosition = lastNode.compareDocumentPosition(firstNode);
	if(relativePosition & Node.DOCUMENT_POSITION_FOLLOWING)
	{
		const temp = firstNode;
		firstNode = lastNode;
		lastNode = temp;
	}
	result.push(firstNode);
	let sibling = firstNode.nextElementSibling;
	while(sibling)
	{
		result.push(sibling);
		if(sibling === lastNode)
			break;
		sibling = sibling.nextElementSibling;
	}
	return result;
}

function joinNodesContainingSelection()
{
	const elems = selectNodesContainingSelection();
	if(!elems) return;
	joinElements(elems);
}

function joinMarkedElements()
{
	const marked = getMarkedElements();
	if(marked)
	{
		unmarkAll();
		joinElements(marked);
	}
}

function logStringPair(str1, str2)
{
	console.log(`%c${str1}`, "color: #ACE; background: #008", str2);
}

function logElementsWithText(elems)
{
	for(const elem of elems)
		logStringPair(elem.tagName || "text node", getNodeText(elem));
}

function joinElements(elemsToJoin)
{
	if(!elemsToJoin.length)
	{
		return;
	}
	const idsToSave = [];
	const wrapperTagName = elemsToJoin[0].tagName || "P";
	const wrapper = document.createElement(wrapperTagName);
	for(let i = 0, ii = elemsToJoin.length; i < ii; i++)
	{
		const originalElement = elemsToJoin[i];
		if(originalElement.id)
			idsToSave.push(originalElement.id);
		while(originalElement.firstChild)
		{
			wrapper.appendChild(originalElement.firstChild);
			wrapper.appendChild(document.createTextNode(" "));
		}
	}
	saveIdsToElement(wrapper, idsToSave);
	insertBefore(elemsToJoin[0], wrapper);
	del(elemsToJoin);
	deleteMessage();
}

//	Takes two or more marked elements, and appends all but the first to the first
function makeChildOf()
{
	const marked = getMarkedElements();
	if(marked.length < 2)
	{
		showMessageBig("Expected at least 2 marked elements, found " + marked.length);
		return;
	}
	for(let i = 1, ii = marked.length; i < ii; i++)
		marked[0].appendChild(marked[i]);
	unmarkAll();
}

//	I find it hard to believe the number of website creators who think a logout button should be hidden behind two or more clicks.
function logout()
{
	switch(location.hostname)
	{
		case 'mail.google.com':
		case 'accounts.google.com':
			location.href = 'https://accounts.google.com/Logout';
			return;
	}
	let found = false;
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const node = links[i];
		if(node.href)
		{
			const s = normalizeString(node.href);
			if(~s.indexOf("logout") && s.indexOf("logout_gear") === -1 || ~s.indexOf("signout"))
			{
				found = true;
				showMessageBig(node.href);
				markElement(node);
				node.click();
				break;
			}
		}
		if(node.textContent)
		{
			const s = normalizeString(node.textContent);
			if(~s.indexOf("logout") || ~s.indexOf("signout"))
			{
				found = true;
				showMessageBig(node.href);
				markElement(node);
				node.click();
				break;
			}
		}
	}
	if(!found)
	{
		const inputsButtons = document.querySelectorAll("input, button");
		for(let i = 0, ii = inputsButtons.length; i < ii; i++)
		{
			const element = inputsButtons[i];
			const s = normalizeString(element.value || element.textContent);
			if(s.indexOf("logout") >= 0 || s.indexOf("signout") >= 0)
			{
				found = true;
				showMessageBig("Logging out...");
				markElement(element);
				element.click();
				break;
			}
		}
	}
	if(!found)
		showMessageBig("Logout link not found");
}

function showPrintLink()
{
	let i, found = false;
	const e = get("a");
	i = e.length;
	while(i--)
	{
		const href = e[i].href;
		if(href && href.toLowerCase().indexOf("print") >= 0)
		{
			found = true;
			const printLink = createElement("a", { href: href, textContent: "Print" });
			document.body.insertBefore(createElementWithChildren("h2", printLink), document.body.firstChild);
			printLink.focus();
			break;
		}
	}
	if(!found)
		showMessageBig("Print link not found");
}

function insertStyleHighlight()
{
	if(getOne("#styleHighlight")) return;
	const s = `
		.${Nimbus.markerClass} { box-shadow: inset 2px 2px #F00, inset -2px -2px #F00; padding: 2px; background: #000; }
		.focused { box-shadow: inset 0px 1000px #000; color: #FFF; }
		.${Nimbus.markerClass}2 { box-shadow: inset 2px 2px #00F, inset -2px -2px #00F; padding: 2px; }
		.${Nimbus.markerClass}::after, .${Nimbus.markerClass}2::after { content: " "; display: block; clear: both; }
		a.${Nimbus.markerClass}::after, span.${Nimbus.markerClass}::after { content: ""; display: inline; clear: none; }
		mark, markgreen, markred, markblue, markpurple, markyellow, markwhite { padding: 3px 0; line-height: inherit; }
		mark { background: #048; color: #6CF; }
		markgreen { background: #150; color: #4F0; }
		markred { background: #500; color: #E33; }
		markblue { background: #005; color: #66D; }
		markpurple { background: #204; color: #C7E; }
		markyellow { background: #804800; color: #FF0; }
		markwhite { background: #000; color: #DDD; }
	`;
	insertStyle(s, "styleHighlight", true);
}

function insertStyleShowErrors()
{
	const s = ".error { box-shadow: inset 2000px 2000px rgba(255, 0, 0, 1);";
	insertStyle(s, "styleShowErrors", true);
}

function toggleStyleNegative()
{
	const s = `
	html { background: #181818; font-size: 20px; }
	html body, #nimbus body { background: #242424; color: #999; border: 0; font-size: 20px; font-family: "swis721 cn bt"; font-style: normal; line-height: 1.35; }
	form { font-family: inherit; font-size: 20px; }

	body.pad100 { padding: 100px 200px; }
	body.pad100 table { width: 100%; }
	body.pad100 td, body.pad100 th { padding: 3px 10px; vertical-align: top; text-align: left; }
	body.pad100 ul { list-style: none; }
	body.pad100 li { padding: 5px 0 5px 10px; margin: 0 0 2px 0; }
	body.pad100 ul li { border-left: 5px solid #0C0C0C; }
	body.pad100 img { max-width: 100%; display: block; }
	body.pad100 section { padding: 10px; border: 2px solid #111; margin: 100px 0; }
	body.xwrap { width: 1200px; margin: 0 auto; padding: 100px 200px; }

	h1, h1[class], h2, h2[class], h3, h3[class], h4, h4[class], h5, h5[class], h6, h6[class]
		{ color: inherit; margin-top: 2px; margin-bottom: 2px; border: 0; font-family: "swis721 cn bt"; font-weight: normal; line-height: inherit; background: #111; }
	body.pad100 h1, body.pad100 h1[class], body.pad100 h2, body.pad100 h2[class], body.pad100 h3, body.pad100 h3[class], body.pad100 h4, body.pad100 h4[class], body.pad100 h5, body.pad100 h5[class], body.pad100 h6, body.pad100 h6[class]
		{ padding: 10px 1rem; margin: 2px 0 2px -1rem; }

	.pad100 h1 { font-size: 2.4rem; }
	.pad100 h2 { font-size: 2.0rem; }
	.pad100 h3 { font-size: 1.6rem; }
	.pad100 h4 { font-size: 1.4rem; }
	.pad100 h5 { font-size: 1.2rem; }
	.pad100 h6 { font-size: 1.0rem; }

	quote { display: block; padding: 1rem 2rem; margin: 2px 0; background: #181818; border-width: 0 0 0 20px; border-style: solid; border-color: #0C0C0C; color: #808080; font-size: 1rem; }
	quoteauthor { display: block;  padding: 0.5rem 2rem; margin: 2px 0; background: #202020; border-width: 0 0 0 20px; border-style: solid; border-color: #0C0C0C; font-size: 1rem; text-align: right; }
	footnote { display: block; padding: 0.5em 10px; margin: 2px 0; background: #181818; border-width: 0 0 0 10px; border-style: solid; border-color: #181818; color: #808080; }
	right { display: block; text-align: right; }
	documentheading { display: block; margin: 0 0 100px 0; padding: 10px 0; border-top: 10px solid #141414; border-bottom: 10px solid #141414; }
	documentheading h1 { font-size: 2.8rem; }
	slideshow { display: block; background: #111; padding: 10px; }
	slideshow::after { content: " "; clear: both; display: block; }
	img { opacity: 0.5; }
	img:hover { opacity: 1; }

	hgroup, article, caption, blockquote, center, col, colgroup, div, div[class], form, li, main, noscript, ol, p, section, summary, ul, video
	{
		background: transparent;
		color: inherit;
		border: none;
		font-family: "swis721 cn bt";
		font-size: inherit;
		font-style: normal;
		line-height: inherit;
	}
	div[class*="modal"],
	div[class*="popover"]
		{ background: #151515; }
	section { background: inherit; color: inherit; }
	aside { background-color: #333; color: #808080; padding: 10px; }

	abbr, acronym, address, applet, area, audio, b, base, bdo, big, cite, code, command, datalist, del, details, dfn, dir, em, fieldset, font, i, ins, label, legend, link, mark, meter, optgroup, option, output, param, progress, q, rp, rt, ruby, s, select, small, source, strike, strong, time, title, u, var, wbr, xmp
		{ background: inherit; color: inherit; font-family: inherit; font-size: inherit; font-style: normal; line-height: inherit; }
	sub, sup { font-size: 16px; font-family: inherit; line-height: 1.2; }
	header, header[class], footer, footer[class], nav, nav[class] { background: #111; }
	span, span[class] { font-family: inherit; font-size: inherit; line-height: inherit; color: inherit; background: inherit; }
	span.italic, span.txit { color: #FF0; }
	span.bold, span.txbd { color: #FF0; font-weight: bold; }

	hr { height: 4px; background: #111; border-color: #111; border-style: solid; border-width: 0; margin: 40px 0; }
	legend { background: #181818; }
	container { border: 2px solid #F00; margin: 10px; display: block; padding: 10px; }
	figure { border: 0; background: #111; padding: 10px 0; margin: 2px 0 0 0; }
	figcaption { background: #111; color: #AAA; padding: 10px 20px; margin-left: 20px; }
	annotation { background: #444; color: inherit; padding: 1rem 2rem; display: block; margin: 10px 0 10px -30px; border-style: solid; border-color: #AAA; border-width: 2px 2px 2px 20px; }
	ruby { margin: 10px 0; background: #F90; color: #FFF; padding: 20px 30px; display: block; font-size: 20px; border-left: 10px solid #F90; }
	rp { margin: 10px 0; background: #181818; color: #888; padding: 40px; display: block; font: 20px "swis721 cn bt"; border-top: 50px solid #000; border-bottom: 50px solid #000; }
	rt { margin: 10px 0; padding: 20px; display: block; background: #181818; font: 12px Verdana; text-align: left; }
	rt:before { content: ""; display: block; width: 10px; height: 15px; border: 2px solid #AAA; float: left; margin: -3px 20px 0 0; }

	button, select, textarea, input, input[class], input[type] { background: #151515; color: #909090; -moz-appearance: none; border-radius: 0; border: 0; font-family: inherit; font-size: 20px; }
	select, textarea { border: 0; box-shadow: none; }
	html input[type="checkbox"] { width: 24px; height: 24px; background: #242424; }
	button:hover, button:focus, input[type="submit"]:hover, input[type="submit"]:focus, input[type="button"]:hover, input[type="button"]:focus { background: #090909; color: #CCC; border-color: #FFF; }
	select:focus, textarea:focus, input:focus { color: #BBB; outline: 0; background: #0C0C0C; box-shadow: none; }
	html small textarea[class] { font: 12px Verdana; }
	span[class*="button"] { background: #151515; color: #909090; border: 0; border-radius: 0; }
	span[class*="button"]:hover, span[class*="button"]:focus { background: #090909; color: #CCC; }

	autocompleteinputwrapper input, autocompleteinputwrapper input[class] { font-size: 40px; color: #FFF; }
	autocompleteinputwrapper input div, autocompleteinputwrapper input[class] div { color: #FFF; }

	a, a:link, a[class], a[id] { color: #77C; text-decoration: none; text-shadow: none; font: inherit; border: 0; background: inherit; }
	a[class*="btn"] { background: #333; }
	button[class*="active"], a[class*="active"], a[class*="selected"] { outline: 2px solid #6F0; }
	a:visited, a:visited * { color: #55C; text-decoration: none; }
	a:active, a:hover, a:focus, a:hover *, a:focus * { color: #09F; text-decoration: none; outline: 0; }
	.pagination a:link { font: bold 30px "swis721 cn bt"; border: 0; background: #111; padding: 10px; }

	p { margin: 0; padding: 5px 0; }
	blockquote { margin: 0 0 6px 0; padding: 20px 40px; border-left: 10px solid #111;  }
	blockquote blockquote { padding: 0 0 0 40px; }

	table { border-collapse: collapse; }
	table, tr, td, th { margin: 0; padding: 0; line-height: inherit; font: 20px/1.4 "swis721 cn bt"; color: inherit; border: 0; }
	table, tbody, tr, td { background: inherit; }
	thead, th { background: #111; }
	tr:nth-child(odd) td , tr:nth-child(odd) th { background-color: #181818; }
	tr:nth-child(even) td , tr:nth-child(even) th { background-color: #202020; }

	dl, dl[class] { border-left: 20px solid #111; background: #181818; font: inherit; line-height: inherit; }
	dt, dt[class] { padding: 0.5em 10px; margin: 2px 0; background: #181818; border-width: 0 0 0 20px; border-style: solid; border-color: #0C0C0C; font: inherit; line-height: inherit; }
	dd, dd[class] { padding: 0.25em 10px; margin: 2px 0; background: #202020; border-width: 0 0 0 60px; border-style: solid; border-color: #0C0C0C; font: inherit; line-height: inherit; }

	cite, u, em, i { font-weight: normal; font-style: normal; text-decoration: none; color: #CCC; }
	b, strong { font-weight: bold; font-style: normal; text-decoration: none; color: #CCC; }
	a u, a em, a i, a b, a strong, a div, a span { color: inherit; }
	small { font-size: 80%; }

	code { font: inherit; padding: 1px 2px; background: #0C0C0C; color: #999; }
	tt { font: Consolas; padding: 1px 2px; background: #0C0C0C; color: #06C; }
	kbd { font: Consolas; padding: 1px 2px; background: #0C0C0C; color: #3E0; }
	samp { font: Consolas; padding: 1px 2px; background: #0C0C0C; color: #0CC; }
	pre { background: #0C0C0C; color: #909090; border-style: solid; border-width: 0 0 0 10px; border-color: #444; padding: 10px 20px; overflow-x: auto; }
	pre p { margin: 0; padding: 0; }
	pre { font-family: "Swis721 Cn BT"; font-size: 18px; font-weight: bold; line-height: 1.2; }
	pre * { font: inherit; text-recoration: none; }

	pre em { color: #00AAFF; }
	pre i { color: #0088CC; }
	pre b { color: #44EEFF; }
	pre u { color: #6677EE; }
	pre dfn { color: #8888CC; }
	pre s { color: #6677CC; }
	pre q1 { color: #1CF; background: #003040; }
	pre q2 { color: #57F; background: #203040; }
	pre c1 { color: #AABBCC; background: #303840; }
	pre c2 { color: #88BBEE; background: #304050; }
	pre b1 { color: #11FF00; }
	pre b2 { color: #00FFFF; }
	pre b3 { color: #EEAAFF; }
	pre xk { color: #0099FF; }
	pre xh { color: #AADDCC; }

	X0 { color: #664477; }
	X1 { color: #6677CC; }
	X2 { color: #6644BB; }
	X3 { color: #666688; }
	X4 { color: #6666FF; }
	X5 { color: #774488; }
	X6 { color: #667777; }
	X7 { color: #667766; }
	X8 { color: #6655DD; }
	X9 { color: #666677; }
	X10 { color: #6644AA; }
	X11 { color: #777788; }
	X12 { color: #665566; }
	X13 { color: #7744DD; }
	X14 { color: #774488; }
	X15 { color: #6677EE; }

	XC { color: #1CF; background: #247; }
	XK { color: #1177CC; }
	XO { color: #11AACC; }
	XP { color: #11FF00; }
	XS { color: #1CF; background: #113060; }

	mark, markgreen, markred, markblue, markpurple, markyellow, markwhite { padding: 3px 0; line-height: inherit; }
	mark { background: #048; color: #6CF; }
	markgreen { background: #150; color: #3F0; }
	markred { background: #500; color: #E33; }
	markblue { background: #005; color: #05D; }
	markpurple { background: #408; color: #C7F; }
	markyellow { background: #804800; color: #FF0; }
	markwhite { background: #000; color: #DDD; }

	user { background: #000; padding: 2px 10px; border-left: 10px solid #09F; margin: 0; }
	author { display: block; font-size: 24px; background: #111; color: #FFF; padding: 2px 10px; border-left: 10px solid #AF0; margin: 0; }
	reference, internalref { background: #000; color: #AAA; padding: 1px 5px; }
	comment { display: block; padding: 20px 40px; border-left: 10px solid #555; background: #181818; margin-bottom: 2px; }
	ind { display: block; padding-left: 50px; }
	warning, info, error { display: block; border-width: 2px 2px 2px 20px; border-style: solid; padding: 1rem 2rem; margin: 10px 0; }
	warning { background: #420; border-color: #C70; }
	info { background: #035; border-color: #07C; }
	error { background: #600; border-color: #D40; }
	tag { background: #333 !important; color: #888 !important; padding: 2px 4px !important; margin: 0 5px 0 0 !important; }

	.markd { box-shadow: inset 2px 2px #C00, inset -2px -2px #C00 !important; background: #000 !important; }
	`;

	toggleStyle(s, "styleNegative", true);
}

//	Returns an array of elements matching a selector and also containing or not containing the specified text.
//	For links and images, it matches the text against hrefs and image sources as well.
function selectBySelectorAndText(selector, text, boolInvertSelection = false)
{
	if(!(typeof selector === "string" && selector.length))
		return;
	if(!(typeof text === "string" && text.length))
		return get(selector);

	text = text.toLowerCase();
	const selected = [];
	const selectedInverse = [];
	const elements = get(selector);
	for(let i = 0, ii = elements.length; i < ii; i++)
	{
		const element = elements[i];
		if(element.textContent && ~element.textContent.toLowerCase().indexOf(text) && !element.querySelector(selector))
		{
			selected.push(element);
		}
		else if(element.tagName === "A")
		{
			if(element.href && ~element.href.toLowerCase().indexOf(text))
				selected.push(element);
		}
		else if(element.tagName === "IMG")
		{
			if(element.src && ~element.src.toLowerCase().indexOf(text))
				selected.push(element);
		}
		else
		{
			selectedInverse.push(element);
		}
	}
	if(boolInvertSelection === true)
		return selectedInverse;
	return selected;
}

function selectBySelectorAndExactText(selector, text, boolInvertSelection = false)
{
	if(!(typeof selector === "string" && selector.length))
		return;
	if(!(typeof text === "string" && text.length))
		return;

	const selected = [];
	const selectedInverse = [];
	const elements = get(selector);
	for(let i = 0, ii = elements.length; i < ii; i++)
	{
		const element = elements[i];
		if(element.textContent && element.textContent.trim() === text && !element.querySelector(selector))
			selected.push(element);
		else
			selectedInverse.push(element);
	}
	if(boolInvertSelection === true)
		return selectedInverse;
	return selected;
}

function selectBySelectorAndNormalizedText(selector, str)
{
	const elems = get(selector);
	const selected = [];
	if(!elems) return;
	for(const elem of elems)
	{
		if(elem.querySelector(selector)) continue;
		if(~elem.textContent.replace(/[^A-Za-z0-9]/g, "").toLowerCase().indexOf(str))
			selected.push(elem);
	}
	return selected;
}

function markBySelectorAndNormalizedText(selector, str) { markElements(selectBySelectorAndNormalizedText(selector, str)); }
function deleteBySelectorAndNormalizedText(selector, str) { del(selectBySelectorAndNormalizedText(selector, str)); }

function selectBySelectorAndRegex(selector, regex, boolInvertSelection = false)
{
	const selected = [];
	const selectedInverse = [];
	const elements = get(selector);
	for(let i = 0, ii = elements.length; i < ii; i++)
	{
		const element = elements[i];
		if(element.textContent && regex.test(element.textContent.trim()) && !element.querySelector(selector))
			selected.push(element);
		else
			selectedInverse.push(element);
	}
	if(boolInvertSelection === true)
		return selectedInverse;
	return selected;
}

//	This is optimised for the case when the selector is simply a tagName, excluding "img" or "a".
function selectByTagNameAndText(tagName, text)
{
	tagName = tagName.toUpperCase();

	if(tagName === "A" || tagName === "IMG")
		return selectBySelectorAndText(tagName, text);

	text = text.toLowerCase();
	const MAX_DEPTH = 5;
	const textNodes = getTextNodesUnderSelector("body");
	const selected = [];
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		if(~textNode.data.toLowerCase().indexOf(text))
		{
			let parent = textNode;
			let depth = 0;
			let found = false;
			while(parent.parentNode && ++depth < MAX_DEPTH)
			{
				parent = parent.parentNode;
				if(parent.tagName === tagName)
				{
					found = true;
					break;
				}
			}
			if(found)
				selected.push(parent);
		}
	}
	return selected;
}

function getFirstBlockParent(node)
{
	const elem = node.nodeType === 1 ? node : node.parentNode;
	if(Nimbus.BLOCK_ELEMENTS[elem.tagName])
		return elem;
	else
		return elem.closest(Nimbus.blockElementSelector);
}

function getFirstTextChild(elem)
{
	let child = elem.firstChild;
	while(child && child.nodeType !== 3)
		child = child.firstChild;
	return child;
}

function selectBlockElementsContainingText(text)
{
	const textNodes = getTextNodesUnderSelector("body");
	const escapedString = "(\\w*" + escapeForRegExp(text) + "\\w*)";
	let regex = new RegExp(escapedString, "i");
	const selected = [];
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		if(regex.test(textNode.data))
		{
			const parent = getFirstBlockParent(textNode);
			if(parent)
				selected.push(parent);
		}
	}
	return selected;
}

//	To be used once all the container elements on a page have been given numeric IDs.
//	Useful to delete all the cruft after the main content.
function delRange(m, n)
{
	const numBlockElements = get("header, footer, article, aside, section, div").length || 0;
	if(typeof n === "undefined")
		n = numBlockElements - 1;
	for(let i = m; i <= n; i++)
		del(`#i${i}`);
}

function deleteNodesBeforeAnchorNode()
{
	deleteNodesRelativeToAnchorNode("before");
}

function deleteNodesAfterAnchorNode()
{
	deleteNodesRelativeToAnchorNode("after");
}

function deleteNodesRelativeToAnchorNode(beforeOrAfter = "after")
{
	const anchorNode = getNodeContainingSelection();
	if(anchorNode)
		deleteNodesByRelativePosition(anchorNode, beforeOrAfter);
}

function deleteNodesByRelativePosition(anchorNode, beforeOrAfter)
{
	del(selectByRelativePosition(anchorNode, beforeOrAfter));
}

function deleteNodesBySelectorAndRelativePosition(selector, beforeOrAfter)
{
	del(selectBySelectorAndRelativePosition(selector, beforeOrAfter));
}

function deletePrecedingNodesBySelector(selector)
{
	del(selectBySelectorAndRelativePosition(selector, "before"));
}

function deleteFollowingNodesBySelector(selector)
{
	del(selectBySelectorAndRelativePosition(selector, "after"));
}

function selectByRelativePosition(anchorNode, beforeOrAfter)
{
	const condition = beforeOrAfter === "after" ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING;
	const nodes = get("div, aside, section, article, ol, ul, p, h1, h2, h3, h5, h6, table, img, header, footer, blockquote, pre, hr, dl, dt");
	const selected = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const relativePosition = anchorNode.compareDocumentPosition(node);
		if(relativePosition & condition && !(relativePosition & Node.DOCUMENT_POSITION_CONTAINS))
			selected.push(node);
	}
	return selected;
}

function selectBySelectorAndRelativePosition(selector, beforeOrAfter)
{
	const marked = getMarkedElements();
	if(marked.length !== 1)
	{
		showMessageBig(`Expected 1 marked element; found ${marked.length}`);
		return false;
	}
	const anchorNode = marked[0];
	const condition = beforeOrAfter === "after" ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING;
	const nodes = get(selector);
	const selected = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const relativePosition = anchorNode.compareDocumentPosition(node);
		if(relativePosition & condition && !(relativePosition & Node.DOCUMENT_POSITION_CONTAINS))
			selected.push(node);
	}
	return selected;
}

function selectNodesBetweenMarkers(selector)
{
	const marked = getMarkedElements();
	if(marked.length !== 2)
	{
		showMessageBig("Expected 2 marked elements, found " + marked.length);
		return;
	}
	unmarkAll();
	const nodes = get(selector);
	const selected = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const positionRelativeToFirst = marked[0].compareDocumentPosition(node);
		const positionRelativeToSecond = marked[1].compareDocumentPosition(node);
		if(
			positionRelativeToFirst & Node.DOCUMENT_POSITION_FOLLOWING &&
			positionRelativeToSecond & Node.DOCUMENT_POSITION_PRECEDING &&
			!(positionRelativeToFirst & Node.DOCUMENT_POSITION_CONTAINS) &&
			!(positionRelativeToSecond & Node.DOCUMENT_POSITION_CONTAINS)
		)
			selected.push(node);
	}
	return selected;
}

function markNodesBetweenMarkers(selector = "div, ol, ul, p")
{
	markElements(selectNodesBetweenMarkers(selector));
}

function deleteNodesBetweenMarkers(selector = "div, ol, ul, p")
{
	deleteElements(selectNodesBetweenMarkers(selector));
}

function removeAllAttributesOf(elem)
{
	const attrs = elem.attributes;
	let i = attrs.length;
	while(i--)
	{
		const attr = attrs[i];
		if(attr)
			elem.removeAttribute(attr.name);
	}
}

function removeAllAttributesExcept(selectorOrElement, attrToKeep)
{
	const attrToKeepLower = attrToKeep.toLowerCase();
	const elems = typeof selectorOrElement === "string" ? get(selectorOrElement) : [selectorOrElement];
	for(const elem of elems)
	{
		const attrs = elem.attributes;
		let i = attrs.length;
		while(i--)
		{
			const attr = attrs[i];
			if(attr && attr.name.toLowerCase() !== attrToKeepLower)
				elem.removeAttribute(attr.name);
		}
	}
}

//	Removes all attributes from all elements, excluding the essential ones. It's surprising how
//	much a page's file size can be reduced simply by removing classes and other attributes.
function cleanupAttributes()
{
	const elems = document.getElementsByTagName('*');
	document.body.removeAttribute("background");
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(elem.attributes)
		{
			const attrs = elem.attributes;
			for(let j = attrs.length - 1; j >= 0; j--)
			{
				const attr = attrs[j];
				switch(attr.name)
				{
					case "href":
					case "src":
					case "srcset":
					case "name":
					case "colspan":
					case "rowspan":
					case "id":
					case "class":
						break;
					default:
						elem.removeAttribute(attr.name);
						break;
				}
			}
		}
	}
}

function cleanupHeadings()
{
	const headings = get("h1, h2, h3, h4, h5, h6");
	let i = headings.length;
	const toUnwrap = [];
	while(i--)
	{
		const heading = headings[i];
		if(!getTextLength(heading))
		{
			heading.remove();
			continue;
		}
		const children = heading.getElementsByTagName("*");
		if(!children) continue;
		for(let i = 0, ii = children.length; i < ii; i++)
		{
			const child = children[i];
			if(child.tagName === "SPAN")
			{
				if(child.id)
					heading.id = child.id;
				toUnwrap.push(child);
			}
			else if(child.tagName === "A")
			{
				if(!getTextLength(child))
				{
					if(child.id)
						heading.id = child.id;
					else if(child.name)
						heading.id = child.name;
					toUnwrap.push(child);
				}
			}
			else
			{
				toUnwrap.push(child);
			}
		}
	}
	for(let i = 0, ii = toUnwrap.length; i < ii; i++)
	{
		if(toUnwrap[i])
			unwrapElement(toUnwrap[i]);
	}
}

//	This function "cleans up" a webpage and optimises it for saving locally.
function cleanupDocument()
{
	cleanupHead();
	cleanupTitle();
	del(["link", "style", "script", "input", "select", "textarea", "button", "x", "canvas", "label", "svg", "video", "audio", "applet", "message"]);
	deleteHtmlComments();
	removeAllAttributesOf(document.documentElement);
	removeAllAttributesOf(document.body);
	replaceIframes();
	addLinksToLargerImages();
	replaceIncorrectHeading();
	replaceSpecialCharacters();
	replaceElementsBySelector("center", "div");
	setDocTitle();
	cleanupAttributes();
	replaceElementsBySelector("strong", "b");
	replaceElementsBySelector("em", "i");
	replaceElementsBySelector("details", "div");
	replaceElementsBySelector("summary", "h3");
	deleteEmptyBlockElements();
	deleteBySelectorAndRegex("a", /^[¶§]$/);
	const footers = get("footer");
	if(footers && footers.length > 1)
	{
		replaceElementsBySelector("footer", "h6");
		makePlainText("h6");
	}
	makePlainText("li header");
	replaceAudio();
	highlightUserLinks();
	appendMetadata();
	getBestImageSrc();
	document.body.className = "pad100 xwrap";
	document.documentElement.id = "nimbus";
	document.documentElement.className = "";
	document.body.id = "nimbus";
	if(~navigator.userAgent.indexOf("Chrome"))
	{
		toggleStyleNegative();
	}
}

function cleanupBarebone()
{
	removeAllAttributesOfTypes(["class", "style", "align"]);
	del("noscript");
	if(get("span[id]"))
		fixInternalReferences();
	unwrapAll("span");
	deleteHtmlComments();
	removeInlineStyles();
	shortenIds();
}

function cleanupHead()
{
	const head = getOne("head");
	if(!head)
		return;
	const tempTitle = document.title;
	emptyElement(head);
	document.title = tempTitle;
}

function deleteResources()
{
	del(["link", "style", "script", "message", "iframe"]);
	document.body.className = "xwrap pad100";
}

function removeInlineStyles()
{
	const e = get("*");
	let i = e.length;
	while(i--)
		e[i].removeAttribute("style");
}

function replaceInlineStylesWithClasses(selector = "span[style]")
{
	const elems = get(selector);
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(elem.hasAttribute("style"))
		{
			elem.className = elem.getAttribute("style").replace(/[^A-Za-z0-9]/g, "");
			elem.removeAttribute("style");
		}
	}
}

function replaceClassesWithCustomElements(selector, baseTagName)
{
	if(typeof selector !== "string") return;
	const classes = getAllClassesFor(selector);
	for(let i = 0, ii = classes.length; i < ii; i++)
	{
		const className = classes[i];
		let replacementTagName;
		if(typeof baseTagName === "string" && baseTagName.length)
		{
			replacementTagName = baseTagName + i;
		}
		else
		{
			const elem = getOne(makeClassSelector(className));
			if(!elem) continue;
			const tagName = elem.tagName;
			replacementTagName = tagName.toLowerCase() + i;
		}
		replaceElementsBySelector(makeClassSelector(classes[i]), replacementTagName);
	}
}

function deleteBySelectorAndTextMatching(selector, str)
{
	deleteBySelectorAndText(selector, str);
}

function deleteBySelectorAndTextNotMatching(selector, str)
{
	deleteBySelectorAndText(selector, str, true);
}

function deleteBySelectorAndText(selector, str, boolInvertSelection = false)
{
	let selected;
	if(typeof selector === "string")
	{
		if(typeof str === "string")
			selected = selectBySelectorAndText(selector, str, boolInvertSelection);
		else
			selected = get(selector);
	}
	if(selected)
		deleteElements(selected);
	else
		showMessageBig("deleteBySelectorAndText: no elements found");
}

function deleteBySelectorAndExactText(selector, str, boolInvertSelection = false)
{
	const selected = selectBySelectorAndExactText(selector, str, boolInvertSelection);
	if(selected)
		deleteElements(selected);
	else
		showMessageBig("deleteBySelectorAndExactText: no elements found");
}

function deleteBySelectorAndRegex(selector, regex, boolInvertSelection = false)
{
	const selected = selectBySelectorAndRegex(selector, regex, boolInvertSelection);
	if(selected)
		deleteElements(selected);
	else
		showMessageBig("deleteBySelectorAndRegex: no elements found");
}

function deleteNonEnglishText()
{
	replaceInTextNodesRegex("body", /[^A-Za-z0-9 :\-]/g, "");
}

function makeAllTextLowerCase()
{
	const textNodes = getTextNodesUnderSelector("body");
	for(const node of textNodes) node.data = node.data.toLowerCase();
}

//	Potential improvement: add another function that scans comments for over-use of emojis to flag the poster as an idiot.
function removeEmojis()
{
	const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
	const textNodes = getTextNodesUnderSelector("body");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		textNode.data = textNode.data.replace(regex, "");
	}
}

function normalizeAllWhitespace()
{
	const textNodes = getTextNodesUnderSelector("body");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		textNode.data = textNode.data.replace(/\s+/g, " ");
	}
}

function normaliseWhitespaceForParagraphs()
{
	const textNodes = getTextNodesUnderSelector("body");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		const blockParent = getFirstBlockParent(textNode);
		if(blockParent && blockParent.tagName === "P")
			textNode.data = normalizeWhitespace(textNode.data);
	}
}

function isEmptyTextNode(node)
{
	return node.data.replace(/\s+/g, "").length === 0;
}

function deleteEmptyTextNodes(parentTagName)
{
	const parent = parentTagName || "body";
	const nodes = getXpathResultAsArray(`//${parent}//text()`);
	let count = 0;
	for(let i = 0, ii = nodes.length; i < ii; i++)
	{
		const node = nodes[i];
		if(isEmptyTextNode(node))
		{
			count++;
			node.remove();
		}
	}
	showMessageBig(`${count} empty text nodes removed`);
}

function deleteEmptyElements(selector)
{
	const elems = get(selector);
	if(!elems) return;
	let count = 0;
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		if(elem.textContent)
		{
			if(getTextLength(elem) === 0 && !elem.getElementsByTagName("img").length && !elem.getElementsByTagName("video").length)
			{
				elem.remove();
				count++;
			}
		}
		else
		{
			if(!elem.getElementsByTagName("img").length && !elem.getElementsByTagName("video").length)
			{
				elem.remove();
				count++;
			}
		}
	}
	showMessageBig(`Deleted ${count} empty elements`);
}

function deleteEmptyHeadings()
{
	const e = get("h1, h2, h3, h4, h5, h6");
	let i = e.length;
	while(i--)
	{
		const elem = e[i];
		if(getTextLength(elem) === 0)
			elem.remove();
	}
}

function deleteEmptyBlockElements()
{
	del("noscript");
	const SELECTOR = "div, p, blockquote, h1, h2, h3, h4, h5, h6, li, figure, figcaption, pre, dl, dt, dd, message, annotation, quote, quoteauthor, aside, section, article, nav, ul, ol, fieldset, figure, header, footer, fieldset";
	deleteEmptyElements(SELECTOR);
}

//	For those ancient webpages that still use <font size...> tags to denote headings.
function replaceFontTags()
{
	const fontElements = get("font");
	function getTagName(fontSize)
	{
		if(!fontSize) return "p";
		const map = {
			"1": "p",
			"2": "h6",
			"3": "h5",
			"4": "h4",
			"5": "h3",
			"6": "h2",
			"7": "h1"
		};
		return map[fontSize] || "p";
	}
	for(let i = 0, ii = fontElements.length; i < ii; i++)
	{
		const fontElem = fontElements[i];
		const fontSize = fontElem.getAttribute("size");
		const replacementHeading = convertElement(fontElem, getTagName(fontSize));
		fontElem.parentNode.replaceChild(replacementHeading, fontElem);
	}
}

function cleanupLinks()
{
	const links = get("a");
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		const newLink = document.createElement("a");
		if(link.id) newLink.id = link.id;
		if(link.href) newLink.href = link.href;
		while (link.firstChild)
			newLink.appendChild(link.firstChild);
		link.parentNode.replaceChild(newLink, link);
	}
}

function logHrefsOnClick(evt)
{
	evt.preventDefault();
	evt.stopPropagation();
	const MAX_DEPTH = 5;
	let link = evt.target.closest("a");
	if(!link)
		return;
	wrapElement(link, Nimbus.highlightTagName);
	const href = link.href;
	if(href)
	{
		console.log(href);
		const link = createElement("a", { textContent: href, href: href });
		const linkWrapper = createElementWithChildren("h6", link);
		document.body.appendChild(linkWrapper);
	}
	return false;
}

//	Useful when you want to grab a bunch of links from a webpage (to pass to a download manager, for instance)
function enableClickToCollectUrls()
{
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
		links[i].setAttribute("onclick", "return false");
	document.body.addEventListener("mouseup", logHrefsOnClick);
	showMessageBig("Clicking links will now log their hrefs");
}

function disableClickToCollectUrls()
{
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
		links[i].removeAttribute("onclick");
	document.body.removeEventListener("mouseup", logHrefsOnClick);
	showMessageBig("Clicking links will now work normally");
}

//	When saving webpages that have internal links (to references/footnotes or images),
//	the browser converts those links to absolute URLs (with "file:///"). If you then move
//	the saved HTML files to a new location, all those links break. This function makes those links relative.
function makeFileLinksRelative()
{
	const links = get("a");
	let hashCount = 0;
	let imageCount = 0;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		const linkHref = link.href;
		if(linkHref && linkHref.indexOf("file:///") === 0)
		{
			if(~linkHref.indexOf("#"))
			{
				const splitHref = linkHref.split("#");
				if(splitHref.length)
				{
					const hash = "#" + splitHref[splitHref.length - 1];
					link.setAttribute("href", hash);
					hashCount++;
				}
			}
			else if(~linkHref.indexOf("/images/"))
			{
				const splitHref = linkHref.split("/");
				const folderName = splitHref[splitHref.length - 2];
				const imageFileName = splitHref[splitHref.length - 1];
				link.setAttribute("href", folderName + "/" + imageFileName);
				imageCount++;
			}
		}
	}
	showMessageBig(`${hashCount} hash links and ${imageCount} image links fixed`);
}

function countReferencesToId(idString)
{
	let idSelector = idString;
	if(idSelector.indexOf("#") !== 0)
		idSelector = "#" + idString;
	const links = get('a[href^="#"]');
	let count = 0;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		if(link.hasAttribute("href") && link.getAttribute("href") === idSelector)
			count++;
	}
	return count;
}

function removeSpanTags(isOkToLoseIds)
{
	if(!isOkToLoseIds)
		replaceEmptyAnchors();
	unwrapAll("span");
}

function showHtmlComments()
{
	const comments = getXpathResultAsArray("//body//comment()");
	for(let i = 0, ii = comments.length; i < ii; i++)
	{
		const comment = comments[i];
		const replacement = document.createElement("aside");
		replacement.innerHTML = comment.data;
		comment.parentNode.replaceChild(replacement, comment);
	}
}

function deleteHtmlComments()
{
	del(getXpathResultAsArray("//body//comment()"));
}

function replaceAudio()
{
	let sources = get("source");
	if(!sources) return;
	let i = sources.length;
	while(i--)
	{
		const source = sources[i];
		if(source.src)
		{
			const audioLink = createElement("a", { href: source.src, textContent: source.src });
			const audioLinkWrapper = createElementWithChildren("h2", audioLink);
			source.parentNode.replaceChild(audioLinkWrapper, source);
		}
	}
	replaceElementsBySelector("audio", "h2");
}

function getMetadata()
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

//	Append useful information to a webpage, including a link to the parent domain, a link to the webpage URL, and a timestamp
function appendMetadata()
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

function deleteNonContentLists()
{
	const lists = select("ul", "doesNotHaveChildrenOfType", "ul");
	if(!lists) return;
	for(let i = 0, ii = lists.length; i < ii; i++)
	{
		const list = lists[i];
		const listText = list.textContent;
		if(listText && (containsAllOfTheStrings(listText, ["witter", "acebook"]) || containsAllOfTheStrings(listText, ["hare", "weet"])))
			list.remove();
	}
}

function deleteNonContentLinks()
{
	deleteBySelectorAndRegex("a", /^(Edit|Reply|Share|Tweet|Delete|Replies)$/i);
}

//	After converting numbered or bulleted paragraphs to lists, we need
//	to remove the redundant numbering or bullets from the list items.
function fixBullets(elems)
{
	const BULLET_REGEX = /^\s*\u2022/;
	const NUMERICBULLET_REGEX = /^\s*\(?[0-9]+[\.\)]?/;
	let ulCount = 0;
	let olCount = 0;
	const lis = elems || get("ol > li");
	for(let i = 0, ii = lis.length; i < ii; i++)
	{
		const firstTextChild = getFirstTextChild(lis[i]);
		if(firstTextChild && NUMERICBULLET_REGEX.test(firstTextChild.textContent))
		{
			olCount++;
			firstTextChild.textContent = firstTextChild.textContent.trim().replace(NUMERICBULLET_REGEX, "");
		}
	}
	const ulis = elems || get("ul > li");
	for(let i = 0, ii = ulis.length; i < ii; i++)
	{
		const firstTextChild = getFirstTextChild(ulis[i]);
		if(firstTextChild && BULLET_REGEX.test(firstTextChild.textContent))
		{
			ulCount++;
			firstTextChild.textContent = firstTextChild.textContent.trim().replace(BULLET_REGEX, "");
		}
	}
	showMessageBig(`${olCount} ordered and ${ulCount} unordered list items fixed`);
}

function removePeriodsFromAbbreviations()
{
	const nodes = getTextNodesUnderSelector("body");
	for(const node of nodes)
	{
		if(node.data.length < 4) continue;
		const matches = node.data.match(/([A-Z]\.){2,}(\s+[a-z]|[,'’-])/g);
		if(matches !== null)
		{
			for(const match of matches)
				node.data = node.data.replace(match, match.replace(/\./g, ""));
		}
		const matchesAtSentenceEnd = node.data.match(/([A-Z]\.){2,}/g);
		if(matchesAtSentenceEnd !== null)
		{
			for(const match of matchesAtSentenceEnd)
				node.data = node.data.replace(match, match.replace(/\./g, "") + ".");
		}
	}
}

function deleteNonContentElements()
{
	const markedElements = getMarkedElements();
	if(markedElements)
	{
		del(markedElements);
		cleanupDocument();
		return;
	}
	replaceElementsBySelector("article", "div");
	markNavigationalLists();
	deleteNonContentLists();
	deleteEmptyElements("p");
	deleteEmptyElements("div");
	return;
}

function deleteMarkedElements()
{
	const markedElements = getMarkedElements();
	showMessageBig(`Deleting ${markedElements.length} elements`);
	del(markedElements);
}

function deleteIframes()
{
	const iframes = get("iframe");
	if(iframes)
	{
		const numIframes = iframes.length;
		if(numIframes)
		{
			del("iframe");
			showMessageBig(numIframes + " iframes deleted");
		}
	}
	else
	{
		showMessageBig("No iframes found");
	}
	deleteBySelectorAndTextMatching("rp", "iframe:");
}

function deleteImages()
{
	del(["svg", "canvas", "picture source"]);
	deleteEmptyElements("picture");
	const images = get("img");
	const imagePlaceholders = get("rt");
	if(images.length)
	{
		del(["img", "slideshow"]);
		showMessageBig("Deleted " + images.length + " images");
	}
	else if(imagePlaceholders.length)
	{
		del("rt");
		showMessageBig("Deleted " + imagePlaceholders.length + " image placeholders");
	}
	else
	{
		showMessageBig("No images found");
	}
}

//	This function takes a selector and replaces the document's content with elements that match that selector.
//	Useful for marking content blocks and deleting everything else, for instance.
function retrieve(selector)
{
	retrieveElements(get(selector));
}

//	Given an array of selectors, retrieve the corresponding elements, grouping them by index.
function retrieveGrouped(selectors, wrapperTagName = "section", groupTagName = "hgroup")
{
	const numSelectors = selectors.length;
	const nodeLists = Array.from({ length: numSelectors });
	for(let i = 0, ii = selectors.length; i < ii; i++)
	{
		const selector = selectors[i];
		nodeLists[i] = get(selector);
	}
	const numGroups = nodeLists[0].length;
	for(let i = 1; i < numSelectors; i++)
	{
		if(nodeLists[i].length !== numGroups)
		{
			showMessageError("retrieveGrouped: number of elements doesn't match");
			return false;
		}
	}
	const wrapper = document.createElement(wrapperTagName);
	wrapper.className = Nimbus.markerClass;
	for(let i = 0, ii = numGroups; i < ii; i++)
	{
		const group = document.createElement(groupTagName);
		for(let j = 0, jj = nodeLists.length; j < jj; j++)
			group.appendChild(nodeLists[j][i]);
		wrapper.appendChild(group);
	}
	document.body.appendChild(wrapper);
	return true;
}

function retrieveBySelectorAndText(selector, text)
{
	retrieveElements(selectBySelectorAndText(selector, text));
}

function removeEventListeners()
{
	var newBody = document.createElement("newbody");
	newBody.innerHTML = document.body.innerHTML;
	document.documentElement.textContent = "";
	document.documentElement.appendChild(newBody);
}

function fixBody()
{
	const newBody = getOne("newbody");
	const replacement = document.createElement("body");
	while(newBody.firstChild)
		replacement.appendChild(newBody.firstChild);
	newBody.parentNode.replaceChild(replacement, newBody);
}

function getCurrentlyPlayingVideo(videos)
{
	for(const video of videos) {
		if(!video.paused)
			return video;
	}
}

function toggleNonVideoContent()
{
	if(get("#styleHNVC")) unhideNonVideoContent();
	else hideNonVideoContent();
}

function hideNonVideoContent()
{
	const videos = get("video");
	if(videos && videos.length)
	{
		const mainVideo = getCurrentlyPlayingVideo(videos);
		if(!mainVideo)
		{
			showMessageBig("Could not find currently playing video");
			return;
		}
		const elemsFollowing = selectByRelativePosition(mainVideo, "after");
		for(const elem of elemsFollowing)
			elem.classList.add("nimbusHide");
		const elemsPreceding = selectByRelativePosition(mainVideo, "before");
		for(const elem of elemsPreceding)
			elem.classList.add("nimbusHide");
	}
	const style = `
		.nimbusHide { opacity: 0; }
		div { background-image: none; }
	`;
	insertStyle(style, "styleHNVC", true);
}

function unhideNonVideoContent()
{
	deleteClass("nimbusHide");
	del("#styleHNVC");
}

function getContentByParagraphCount()
{
	const LONG_PARAGRAPH_THRESHOLD = 100;
	const markedElements = getMarkedElements();
	if(markedElements.length)
	{
		retrieve(makeClassSelector(Nimbus.markerClass));
		cleanupDocument();
		unmarkAll();
		deleteIframes();
		deleteEmptyBlockElements();
		return;
	}
	del("nav");
	del("svg[class*=icon]");
	deleteNonContentLists();
	deleteNonContentLinks();
	insertStyleHighlight();
	const paragraphs = get("p");
	if(!paragraphs)
	{
		showMessageError("No paragraphs found");
		return;
	}
	const longParagraphs = [];
	for(let i = 0, ii = paragraphs.length; i < ii; i++)
	{
		const paragraph = paragraphs[i];
		if(paragraph.textContent && normalizeString(paragraph.textContent).length > LONG_PARAGRAPH_THRESHOLD)
		{
			paragraph.classList.add("longParagraph");
			longParagraphs.push(paragraph);
		}
	}
	const candidateDivs = [];
	for(let i = 0, ii = longParagraphs.length; i < ii; i++)
	{
		const tempContainer = longParagraphs[i].closest("div");
		if(tempContainer)
			candidateDivs.push(tempContainer);
	}
	let highestNumParagraphs = 0;
	let contentDiv = candidateDivs.length ? candidateDivs[0] : paragraphs[0];
	for(let i = 0, ii = candidateDivs.length; i < ii; i++)
	{
		const div = candidateDivs[i];
		let numParagraphs = div.getElementsByClassName("longParagraph").length;
		if(numParagraphs > highestNumParagraphs)
		{
			highestNumParagraphs = numParagraphs;
			contentDiv = div;
		}
	}
	while(
		contentDiv &&
		contentDiv.parentNode &&
		contentDiv.parentNode.tagName !== "BODY" &&
		contentDiv.getElementsByClassName("longParagraph").length < longParagraphs.length * 0.8
	)
		contentDiv = contentDiv.parentNode;

	let HEADINGS_SELECTOR = "h1, h2";
	if(get("h1")) HEADINGS_SELECTOR = "h1";
	else if(get("h2")) HEADINGS_SELECTOR = "h2";
	else if(get("h3")) HEADINGS_SELECTOR = "h3";
	if(document.querySelectorAll(HEADINGS_SELECTOR).length > 0 && contentDiv.querySelectorAll(HEADINGS_SELECTOR).length === 0)
	{
		while(
			contentDiv &&
			contentDiv.parentNode &&
			contentDiv.parentNode.tagName !== "BODY" &&
			contentDiv.querySelectorAll(HEADINGS_SELECTOR).length === 0
		)
		{
			contentDiv = contentDiv.parentNode;
		}
	}
	deleteClass("longParagraph");
	if(contentDiv)
		markElement(contentDiv);
	else
		showMessageError("Could not find content");
}

function cleanupStackOverflow()
{
	function handleMutations(mutations)
	{
		console.log("handleMutations");
		for(let i = 0, ii = mutations.length; i < ii; i++)
			if(mutations[i].addedNodes.length)
			{
				console.log("\t deleting resources...");
				del(["link", "script", "iframe"]);
			}
	}

	del(["#sidebar", ".signup-prompt", ".post-menu", ".user-gravatar32", "form", ".d-none", ".-flair", "#launch-popover", ".comments-link", ".aside-cta", ".js-post-menu", "iframe", ".js-bottom-notice", ".votecell"]);
	deleteByClassOrIdContaining("comments-link");
	replaceElementsBySelector(".post-tag", "tag");
	unwrapAll(".js-post-tag-list-item");
	replaceElementsBySelector(".js-post-tag-list-wrapper", "footer");
	replaceElementsBySelector(".user-action-time", "h5");
	replaceElementsBySelector(".user-details", "h2");
	replaceElementsBySelector(".answercell", "dt");
	deleteBySelectorAndTextMatching("h2", "Not the answer");
	retrieve("#content");
	cleanupDocument();
	removeAllAttributesOfTypes(["class", "style", "align", "id"]);
	unwrapAll("span");
	makePlainText("user");
	unwrapAll("user");
	makePlainText("pre");
	const observer = new MutationObserver(handleMutations);
	observer.observe(getOne("head"), { childList: true });
}

function renderResourceInfo(str, uuid)
{
	let strSanitized = trimAt(str, "?");
	const resourceLink = createElement("a", { textContent: strSanitized, href: str });
	const resourceLinkWrapper = createElement("h3", { id: "link" + uuid, className: "xlog" });
	const resourceDelete = createElement("span", { textContent: "[Delete]" });
	resourceDelete.setAttribute("data-delete", uuid);
	document.body.addEventListener('mouseup', deleteResource, false);
	resourceLinkWrapper.appendChild(resourceDelete);
	resourceLinkWrapper.appendChild(resourceLink);
	document.body.insertBefore(resourceLinkWrapper, document.body.firstChild);
}

function deleteResource(evt)
{
	if(!["h3", "span"].includes(evt.target.parentNode.tagName.toLowerCase()))
		return;
	evt.stopPropagation();
	evt.preventDefault();
	const idToDelete = evt.target.getAttribute("data-delete");
	del("#" + idToDelete);
	del("#link" + idToDelete);
}

function showImageCount()
{
	const images = get("img");
	const numImages = images ? images.length : 0;
	if(numImages)
		ylog(numImages + " images", "h2", true);
}

function showIframeCount()
{
	const iframes = get("iframe");
	const numIframes = iframes ? iframes.length : 0;
	if(numIframes)
		ylog(numIframes + " iframes", "h2", true);
}

function showScripts()
{
	let numScripts = 0;
	const scripts = get("script");
	if(!scripts) return;
	for(let i = 0, ii = scripts.length; i < ii; i++)
	{
		const script = scripts[i];
		if(script.src)
		{
			numScripts++;
			const uuid = createUUID();
			script.id = uuid;
			renderResourceInfo(script.src, uuid);
		}
	}
	if(numScripts)
		ylog(numScripts + " scripts", "h2", true);
}

function showExternalStyles()
{
	let numLinks = 0;
	const links = get("link");
	if(!links) return;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		if(link.href && ~link.href.indexOf("css"))
		{
			numLinks++;
			const uuid = createUUID();
			link.id = uuid;
			renderResourceInfo(link.href, uuid);
		}
	}
	if(numLinks)
		ylog(numLinks + " external styles", "h2", true);
}

function showInlineStyles()
{
	const styles = get("style");
	if(styles && styles.length)
	{
		for(const style of styles)
		{
			const styleId = style.id;
			if(styleId)
				ylog(styleId, "dd", true);
		}
		ylog(styles.length + " inline styles", "h2", true);
	}
}

function showHtmlTextRatio()
{
	const bytesHtml = document.documentElement.innerHTML.length;
	const bytesText = document.body.textContent.length;
	const kilobytesHtml = Math.round(bytesHtml / 100) / 10;
	const kilobytesText = Math.round(bytesText / 100) / 10;
	const textToHtmlRatio = (Math.round((bytesText / bytesHtml) * 100)) / 100;
	const str = `${kilobytesHtml} KB : ${kilobytesText} KB (${textToHtmlRatio})`;
	ylog(str, "h2", true);
	xlog(str);
}

function showResources()
{
	if(get(".xlog"))
	{
		del(".xlog");
		return;
	}

	showImageCount();
	showIframeCount();
	showScripts();
	showExternalStyles();
	showInlineStyles();
	showHtmlTextRatio();

	window.scrollTo(0, 0);
}

function handleBlockEditClick(evt)
{
	evt.stopPropagation();
	let targ;
	let ctrlOrMeta = "ctrlKey";
	if(~navigator.userAgent.indexOf("Macintosh"))
		ctrlOrMeta = "metaKey";
	if(!evt)
		evt = window.event;
	if(evt.target)
		targ = evt.target;
	const tagNameLower = targ.tagName.toLowerCase();
	// Retrieve clicked element
	if(evt[ctrlOrMeta] && evt.shiftKey)
	{
		document.body.innerHTML = targ.innerHTML;
		toggleBlockEditMode();
		return;
	}
	// delete clicked element
	else if(evt[ctrlOrMeta] && !evt.shiftKey)
	{
		if(tagNameLower === 'body')
			return;
		if(tagNameLower === "li" || tagNameLower === "p" && targ.parentNode && targ.parentNode !== document.body)
			targ = targ.parentNode;
		targ.remove();
		return false;
	}
	// append clicked element to a div
	else if(evt.shiftKey)
	{
		if(!document.getElementById("newbody"))
		{
			const newbody = document.createElement("div");
			newbody.id = "newbody";
			document.body.appendChild(newbody);
		}
		if(targ.tagName.toLowerCase() === 'body')
			return;
		document.getElementById("newbody").appendChild(targ);
	}
	return true;
}

//	This function toggles "block edit mode," in which you can:
//		- ctrl-shift-click to retrieve the clicked element
//		- ctrl-click to delete the clicked element
//		- shift-click to move the clicked element to a container div at the end of the document, which you can later retrieve using ctrl-shift-click
function toggleBlockEditMode()
{
	const db = document.body;
	if(getOne("#styleToggleBlockEditMode"))
	{
		del("#styleToggleBlockEditMode");
		db.removeEventListener("mouseup", handleBlockEditClick, false);
		db.classList.remove("debug");
		showMessageBig("Block edit mode off");
	}
	else
	{
		db.addEventListener("mouseup", handleBlockEditClick, false);
		db.classList.add("debug");
		const style = `
			html body.debug header, html body.debug footer, html body.debug article, html body.debug aside, html body.debug section, html body.debug div { box-shadow: inset 2px 2px #555, inset -2px -2px #555; margin: 10px; padding: 10px; }
			html body.debug header:hover, html body.debug footer:hover, html body.debug article:hover, html body.debug aside:hover, html body.debug section:hover, html body.debug div:hover { box-shadow: inset 2px 2px #888, inset -2px -2px #888; }
		`;
		insertStyle(style, "styleToggleBlockEditMode", true);
		showMessageBig("Block edit mode on");
	}
}

function getAttributes(elem)
{
	const inspectorPanel = document.createElement('div');
	if(elem.tagName)
		inspectorPanel.appendChild(createElement("b", { textContent: elem.tagName.toLowerCase() }) );
	if(elem.attributes)
	{
		const attrs = elem.attributes;
		const frag = document.createDocumentFragment();
		for(let i = 0, ii = attrs.length; i < ii; i++)
		{
			const attr = attrs[i];
			if(attr)
			{
				frag.appendChild(createElement("em", { textContent: " " + attr.name + "="}));
				frag.appendChild(document.createTextNode('"' + attr.value + '"'));
			}
		}
		inspectorPanel.appendChild(frag);
		const keys = Object.keys(elem);
		const elemKeys = document.createElement("em");
		for(let i = 0, ii = keys.length; i < ii; i++)
			elemKeys.appendChild(document.createTextNode(keys[i] + " "));
		inspectorPanel.appendChild(elemKeys);
		const inspectordiv = document.getElementById("inspector");
		inspectordiv.appendChild(inspectorPanel);
	}
}

function inspectMouseoverHandler(evt)
{
	const inspectorElem = document.getElementById("inspector");
	emptyElement(inspectorElem);
	inspectorElem.appendChild(document.createTextNode(''));
	evt.stopPropagation();
	// deleteClass("hovered");
	let target = evt.target;
	// target.classList.add("hovered");
	while(target)
	{
		getAttributes(target);
		target = target.parentNode;
	}
}

//	*Much* faster than any browser's devtools inspector.
function inspect(onTop)
{
	if(!getOne("#inspector"))
	{
		const b = document.createElement("div");
		b.id = "inspector";
		if(onTop)
			b.className = "onTop";
		document.body.insertBefore(b, document.body.firstChild);
		document.body.addEventListener('mouseover', inspectMouseoverHandler, false);
		document.body.addEventListener('contextmenu', inspectClickHandler, false);
		document.body.classList.add("inspector");
		insertStyle(STYLES.INSPECTOR, "styleInspector", true);
	}
	else
	{
		document.body.removeEventListener('mouseover', inspectMouseoverHandler, false);
		document.body.removeEventListener('contextmenu', inspectClickHandler, false);
		del('#inspector');
		del('#styleInspector');
		document.body.classList.remove("inspector");
		// deleteClass("hovered");
	}
}

function inspectClickHandler(evt)
{
	evt.stopPropagation();
	if(evt.ctrlKey)
		identifyClassSetup("." + Array.from(evt.target.classList).join("."));
	else
		evt.target.classList.add(Nimbus.markerClass);
}

function showAttributes(selector = "*")
{
	const elems = Array.from( document.body.querySelectorAll(selector) );
	const SPECIAL_ELEMS = ["A", "INPUT", "TEXTAREA"];
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const attrs = elem.attributes;
		let attributesAndValues = elem.tagName + "\n";
		for(let j = 0, jj = attrs.length; j < jj; j++)
			attributesAndValues += "\t" + attrs[j].name + ": " + attrs[j].value + "\n";
		const tag = createElement("pre", { textContent: attributesAndValues });
		elem.insertAdjacentElement("beforebegin", tag);
		if(SPECIAL_ELEMS.includes(elem.tagName))
			replaceElement(elem, "div");
	}
	const style = "div { padding: 5px 20px; box-shadow: inset 10px 0 #555; }";
	insertStyle(style, "styleShowAttributes", true);
}

//	Takes an element, an integer depth, and a tagName, and wraps that element in that many levels of <tagName>
function wrapElementInLayers(elem, depth, tag)
{
	const parent = elem.parentNode;
	if(!parent) throw new Error("element has no parent");
	if(depth < 1) throw new Error("depth must be 1 or greater");
	const tagName = tag || "blockquote";
	let wrapper, deepestChild;
	wrapper = deepestChild = document.createElement(tagName);
	for(let i = 1; i < depth; i++)
	{
		const layer = document.createElement(tagName);
		deepestChild.appendChild(layer);
		deepestChild = layer;
	}
	deepestChild.appendChild(elem.cloneNode(true));
	parent.replaceChild(wrapper, elem);
}


function listSelectorsWithLightBackgrounds()
{
	const THRESHOLD = 200;
	const e = Array.from(document.getElementsByTagName("*"));
	let str = "";
	for(let i = 0, count = 0; i < e.length, count < 4000; i++, count++)
	{
		const elem = e[i];
		if(!elem)
			continue;
		const bgColor = getComputedStyle(elem).getPropertyValue("background-color");
		const rgbValues = bgColor.match(/[0-9]+/g);
		if(rgbValues)
		{
			let average = (Number(rgbValues[0]) + Number(rgbValues[1]) + Number(rgbValues[2])) / 3;
			if(average > THRESHOLD)
			{
				str += createSelector(elem) + "\r\n";
				// str += padRight(createSelector(elem), 100) + bgColor + "\r\n";
			}
		}
	}
	console.log(str);
}

function numberTableRowsAndColumns(tableElement)
{
	const tableRows = tableElement ? tableElement.querySelectorAll("tr") : get("tr");
	for(let i = 0, ii = tableRows.length; i < ii; i++)
	{
		const tableRow = tableRows[i];
		tableRow.className = "row" + i;
		const tableCells = tableRow.querySelectorAll("td, th");
		let count = 0;
		for(let j = 0, jj = tableCells.length; j < jj; j++)
		{
			const tableCell = tableCells[j];
			tableCell.className = "col" + count++;
			if(tableCell.hasAttribute("colspan"))
				count += parseInt(tableCell.getAttribute("colspan"), 10) - 1;
		}
	}
	const tables = tableElement ? [tableElement] : get("table");
	for(let i = 0, ii = tables.length; i < ii; i++)
		tables[i].classList.add("numbered");
}

function traceLineage(element)
{
	let current = element;
	while (current)
	{
		const id = current.id || "";
		const classes = current.className || "";
		console.log(`#${id} .${classes}`);
		current = current.parentNode;
	}
}

function showClonedElements()
{
	function removeStyle(x) { x.removeAttribute("style"); }
	if(Nimbus.clonedNodesContainer && Nimbus.clonedNodesContainer.children.length)
	{
		document.body.insertBefore(Nimbus.clonedNodesContainer, document.body.firstChild);
		insertStyle("#cloneContainer { position: fixed; top: 10px; left: 10px; width: 400px; height: 400px; border: 2px solid #333; z-index: 2147483647; }", "styleCloneContainer", true);
		forAll("#cloneContainer *", removeStyle);
	}
}

function logMutations(mutations)
{
	function clone(elem) { Nimbus.clonedNodesContainer.appendChild(elem.cloneNode(true)); }
	const colors = Nimbus.logColors;
	for(let i = 0, ii = mutations.length; i < ii; i++)
	{
		const mutation = mutations[i];
		if(Nimbus.mutationFilterSelector && !mutation.target.matches(Nimbus.mutationFilterSelector))
			continue;
		if(mutation.type === "childList")
		{
			if(mutation.addedNodes.length)
			{
				for(let j = 0, jj = mutation.addedNodes.length; j < jj; j++)
				{
					const addedNode = mutation.addedNodes[j];
					if(addedNode.className && addedNode.classList.contains("excludeFromMutations"))
						continue;
					console.log(`%cadded:   %c${createSelector(addedNode)} %c${addedNode.textContent}`, colors.green, colors.gray, colors.blue);
					clone(addedNode);
				}
			}
			if(mutation.removedNodes.length)
			{
				for(let j = 0, jj = mutation.removedNodes.length; j < jj; j++)
				{
					const removedNode = mutation.removedNodes[j];
					if( removedNode.className && removedNode.classList.contains("excludeFromMutations") )
						continue;
					console.log(`%cremoved: %c${createSelector(removedNode)} %c${removedNode.textContent}`, colors.red, colors.gray, colors.blue);
				}
			}
		}
		else if(mutation.type === "attributes")
		{
			if(!Nimbus.attributeFilter || (Nimbus.attributeFilter && mutation.attributeName.includes(Nimbus.attributeFilter)))
			{
				console.log(`%c${mutation.attributeName}: %c${createSelector(mutation.target)}`, colors.green, colors.gray);
			}
		}
	}
}

//	Useful for finding out what's changing in the DOM when, for instance, you hover over an element
//	and a popup appears, or similar things that regular developer tools are no good for.
function toggleMutationObserver(watchAttributes, mutationFilterSelector = null, attributeFilter = null)
{
	if(Nimbus.isObservingMutations)
	{
		Nimbus.observer.disconnect();
		Nimbus.isObservingMutations = false;
		showMessageBig("Stopped observing mutations");
		showClonedElements();
		Nimbus.clonedNodesContainer = null;
		return;
	}
	Nimbus.mutationFilterSelector = mutationFilterSelector;
	Nimbus.attributeFilter = attributeFilter;
	Nimbus.observer = new MutationObserver(logMutations);
	del("#cloneContainer");
	Nimbus.clonedNodesContainer = document.createElement("div");
	Nimbus.clonedNodesContainer.id = "cloneContainer";
	let config = { childList: true };
	let message = "Observing mutations";
	if(watchAttributes)
	{
		config.attributes = true;
		config.subtree = true;
		message += " with attributes";
	}
	if(mutationFilterSelector)
		message += ` for elements matching ${mutationFilterSelector}`;
	Nimbus.observer.observe(getOne("body"), config);
	showMessageBig(message);
	Nimbus.isObservingMutations = true;
}

function toggleShowSelectors(tagName)
{
	if(document.body.classList.contains("nimbusShowSelectors"))
	{
		document.body.classList.remove("nimbusShowSelectors");
		del("#styleShowSelectors");
	}
	else
	{
		document.body.classList.add("nimbusShowSelectors");
		showSelectors(tagName);
	}
}

function showSelectors(tagName)
{
	function generateBlockStyleRule(tag) {
		tag = tag.toLowerCase();
		return `
			${tag}::before { content: "${tag}"; color: #07C; background: #000; padding: 2px 6px; font: bold 22px "swis721 cn bt"; }
			${tag}[id]::before { content: "${tag}#" attr(id); color: #C0C; background: #000; padding: 2px 6px; font: bold 22px "swis721 cn bt"; }
			${tag}[class]::before { content: "${tag}." attr(class); color: #C90; background: #000; padding: 2px 6px; font: bold 22px "swis721 cn bt"; }
			${tag}[id][class]::before { content: "${tag}#" attr(id) "."attr(class); color: #CC0; background: #000; padding: 2px 6px; font: bold 22px "swis721 cn bt"; }
		`;
	}
	function generateInlineStyleRule(tag) {
		tag = tag.toLowerCase();
		return `
			${tag}::before { content: "${tag}"; color: #7C0; background: #000; padding: 2px 6px; font: bold 18px "swis721 cn bt"; }
			${tag}[id]::before { content: "${tag}#" attr(id); color: #C0C; background: #000; padding: 2px 6px; font: bold 18px "swis721 cn bt"; }
			${tag}[class]::before { content: "${tag}." attr(class); color: #C90; background: #000; padding: 2px 6px; font: bold 18px "swis721 cn bt"; }
			${tag}[id][class]::before { content: "${tag}#" attr(id) "."attr(class); color: #CC0; background: #000; padding: 2px 6px; font: bold 18px "swis721 cn bt"; }
		`;
	}

	if(tagName)
	{
		const style = Nimbus.BLOCK_ELEMENTS[tagName.toUpperCase()] ? generateBlockStyleRule(tagName) : generateInlineStyleRule(tagName);
		insertStyle(style, "styleShowSelectors", true);
	}
	else
	{
		const borderStyle = `
			div, p, blockquote, hgroup, h1, h2, h3, h4, h5, h6, ol, ul, li, head, figure, figcaption, pre, dt, dd, message, annotation, td, quote, quoteauthor, aside, section, article, nav, footnote, header, footer, hr, rt, style { box-shadow: inset 4px 4px #444, inset -4px -4px #111; margin: 4px; padding: 4px; }
			small, big, sup, sub, abbr, time, cite { box-shadow: inset 2px 2px #357, inset -2px -2px #357; }
			font { box-shadow: inset 2px 2px #C90, inset -2px -2px #C90; }
			span { box-shadow: inset 0 -100px #040; padding: 4px; border: 2px solid #0A0; }
			span span { padding: 0px; }
		`;

		const blockTags = Object.keys(Nimbus.BLOCK_ELEMENTS);
		const inlineTags = Object.keys(Nimbus.INLINE_ELEMENTS);
		const rulesBlock = blockTags.map(generateBlockStyleRule);
		const rulesInline = inlineTags.map(generateInlineStyleRule);
		const style = rulesBlock.join("\n") + rulesInline.join("\n") + borderStyle;
		insertStyle(style, "styleShowSelectors", true);
	}
}

function showSelectorsHeavy()
{
	if(getOne("#styleShowSelectorsHeavy"))
	{
		del("#styleShowSelectorsHeavy");
		removeAttributeOf("body *", "data-id");
		removeAttributeOf("body *", "data-idclass");
		removeAttributeOf("body *", "data-class");
		return;
	}
	const elems = get("*");
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(elem.id && !elem.className)
			elem.setAttribute("data-id", elem.tagName.toLowerCase() + "#" + elem.id);
		else if(elem.id && elem.className)
			elem.setAttribute("data-idclass", elem.tagName.toLowerCase() + "#" + elem.id + "." + elem.className);
		else if(elem.className)
			elem.setAttribute("data-class", elem.tagName.toLowerCase() + "." + elem.className);
	}
	const style = `
		*[data-id]::before { content: attr(data-id); color: #F0F; background: #000; padding: 2px 5px; }
		*[data-idclass]::before { content: attr(data-idclass); color: #0FF; background: #000; padding: 2px 5px; }
		*[data-class]::before { content: attr(data-class); color: #F90; background: #000; padding: 2px 5px; }
	`;
	insertStyle(style, "styleShowSelectorsHeavy", true);
}

function getAllInlineStyles()
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

function getAllCssRulesForElement(elem)
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

function getAllCssRulesMatching(selectorOrPropertyOrValue)
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

function forceReloadCss()
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

function unmarkFromBeginningOrEnd(whichEnd = "end", n)
{
	const marked = getMarkedElements();
	if(!(marked && marked.length))
	{
		showMessageBig("No marked elements");
		return;
	}
	n = Math.max(0, Math.min(n, marked.length));
	if(whichEnd === "beginning")
	{
		for(let i = 0; i < n; i++)
			unmarkElement(marked[i]);
	}
	else
	{
		for(let i = 1; i < n + 1; i++)
			unmarkElement(marked[marked.length - i]);
	}
}

function unmarkFromBeginning(n) { unmarkFromBeginningOrEnd("beginning", n); }
function unmarkFromEnd(n) { unmarkFromBeginningOrEnd("end", n); }

function modifyMark(action, keepSelection)
{
	let currentElement;
	const markedElements = getMarkedElements();
	if(markedElements && markedElements.length)
	{
		if(action === "previous")
			currentElement = markedElements[0];
		else
			currentElement = markedElements[markedElements.length - 1];
	}
	else
	{
		currentElement = document.body.firstElementChild;
	}
	if(!currentElement)
	{
		showMessageError("Couldn't get marked element");
		return;
	}
	let nextElement;
	switch(action)
	{
		case "expand": nextElement = currentElement.parentNode; break;
		case "contract": nextElement = currentElement.firstElementChild; break;
		case "previous": nextElement = currentElement.previousElementSibling; break;
		case "next": nextElement = currentElement.nextElementSibling; break;
	}
	if(!nextElement || (nextElement.tagName === 'MESSAGE' || nextElement.tagName === 'BODY'))
	{
		showMessageError("Couldn't get next element");
		return;
	}
	if(!keepSelection || action === "expand" || action === "contract")
		unmarkElement(currentElement);
	markElement(nextElement);
	showMarkedElementInfo(nextElement);
}

function wrapElement(elem, tagName, className)
{
	const wrapper = createElement(tagName);
	if(className) wrapper.className = className;
	const newElem = elem.cloneNode(true);
	wrapper.appendChild(newElem);
	elem.parentNode.replaceChild(wrapper, elem);
}

function wrapElementInner(elem, tagName)
{
	const wrapper = createElement(tagName);
	const newElem = document.createElement(elem.tagName);
	if(elem.tagName === "A" && elem.href && elem.href.length)
		newElem.href = elem.href;
	while(elem.firstChild)
		wrapper.appendChild(elem.firstChild);
	elem.appendChild(wrapper);
}

function wrapAll(selector, tagName)
{
	const elems = get(selector);
	for(let i = 0, ii = elems.length; i < ii; i++)
		wrapElement(elems[i], tagName);
}

function wrapAllInner(selector, tagName)
{
	const elems = get(selector);
	if(!elems && elems.length) return;
	for(let i = 0, ii = elems.length; i < ii; i++)
		wrapElementInner(elems[i], tagName);
}

function unwrapAll(selector)
{
	const elems = get(selector);
	if(elems)
	{
		const numElems = elems.length || 0;
		let numIdsLost = 0;
		for(let i = 0, ii = numElems; i < ii; i++)
		{
			const elem = elems[i];
			if(elem.id) ++numIdsLost;
			unwrapElement(elem);
		}
		if(numIdsLost)
			showMessageError(`${numElems} ${selector} unwrapped; ${numIdsLost} ids lost`);
		else
			showMessageBig(`${numElems} ${selector} unwrapped`);
	}
}

function unwrapElement(elem)
{
	const frag = document.createDocumentFragment();
	while(elem.firstChild)
		frag.appendChild(elem.firstChild);
	elem.parentNode.replaceChild(frag, elem);
}

function convertToFragment(elem)
{
	const frag = document.createDocumentFragment();
	while(elem.firstChild)
		frag.appendChild(elem.firstChild);
	return frag;
}

function makeButtonsReadable()
{
	const buttons = get("button");
	if(!buttons) return;
	let count = 0;
	for(let i = 0, ii = buttons.length; i < ii; i++)
	{
		const button = buttons[i];
		if(button.hasAttribute("aria-label"))
		{
			count++;
			button.textContent = trimAt(button.getAttribute("aria-label"), " ");
		}
	}
	showMessageBig(`Labeled ${count} buttons`);
}

function copyAttribute(selector, sourceAttribute, targetAttribute)
{
	const elems = get(selector);
	if(!elems) return;
	let count = 0;
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const element = elems[i];
		const sourceAttributeValue = element[sourceAttribute] || element.getAttribute(sourceAttribute);
		if(sourceAttributeValue)
		{
			count++;
			if(typeof sourceAttributeValue !== "string")
				console.log("sourceAttributeValue is", Object.prototype.toString.call(sourceAttributeValue));
			setAttributeOrProperty(element, targetAttribute, sourceAttributeValue);
		}
	}
	showMessageBig(`Copied attribute ${sourceAttribute} to ${targetAttribute} on ${count} ${selector}s`);
}

function setAttributeOf(selector, attribute, value)
{
	const elems = get(selector);
	if(!elems) return;
	let i = elems.length;
	while(i--)
		elems[i].setAttribute(attribute, value);
}

function removeAttributeOf(selector, attribute)
{
	const elems = get(selector);
	if(!elems) return;
	let i = elems.length;
	while(i--)
		elems[i].removeAttribute(attribute);
}

function removeAllAttributesOfType(type)
{
	removeAttributeOf("body *", type);
}

function removeAllAttributesOfTypes(attrNames)
{
	for(const attrName of attrNames)
		removeAllAttributesOfType(attrName);
}

function insertElementNextToAnchorNode(tagName, position)
{
	const tag = tagName || "hr";
	const node = getNodeContainingSelection();
	if(node)
	{
		switch(position)
		{
			case "before": insertBefore(node, createElement(tag)); break;
			case "after": insertAfter(node, createElement(tag)); break;
		}
	}
}

function insertElementBeforeSelectionAnchor(tagName)
{
	const tag = tagName || "hr";
	const node = getNodeContainingSelection();
	if(node)
		insertBefore(node, createElement(tag));
}

function insertElementAfterSelectionAnchor(tagName)
{
	const tag = tagName || "hr";
	const node = getNodeContainingSelection();
	if(node)
		insertAfter(node, createElement(tag));
}

function annotate(position = "before")
{
	let node = getNodeContainingSelection();
	function annotateFunc(userInput)
	{
		const annotationText = userInput.indexOf(" ") !== -1 ? userInput : undefined;
		const annotation = userInput.length && !annotationText ?
			document.createElement(userInput) :
			document.createElement("annotation");
		if(position === "after")
			insertAfter(node, annotation);
		else
			insertBefore(node, annotation);
		if(annotationText)
		{
			annotation.textContent = annotationText;
		}
		else
		{
			annotation.setAttribute("contenteditable", "true");
			Nimbus.isEditing = true;
			annotation.focus();
		}
	}
	if(node && node.parentNode)
		customPrompt("Enter annotation tag").then(annotateFunc);
}

function wrapAnchorNodeInTag()
{
	const node = getNodeContainingSelection();
	if(!node) return;
	function wrapFunc(tagName)
	{
		wrapElement(node, tagName);
	}
	customPrompt("Enter tagName to wrap this node in").then(wrapFunc);
}

function generateTableOfContents(optionalStringToMatch, shouldUseHierarchicalHeadings = false)
{
	const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
	const toc = document.createElement("section");
	toc.id = "tableOfContents";
	const str = optionalStringToMatch ? optionalStringToMatch.toLowerCase() : null;
	for (let i = 0, ii = headings.length; i < ii; i++)
	{
		const heading = headings[i];
		if(!isNaN(Number(heading.textContent)))
			continue;
		if(str && heading.textContent.toLowerCase().indexOf(str) === -1)
			continue;
		if(!heading.id)
			heading.id = heading.tagName + "_" + i;
		const tocEntryLink = createElement("a", { textContent: heading.textContent, href: "#" + heading.id } );
		const indentLevel = parseInt(heading.tagName.substring(1), 10);
		const tocEntryHeading = shouldUseHierarchicalHeadings ? createElement("h" + indentLevel) : createElement("h6");
		const tocEntryWrapper = document.createElement("div");
		tocEntryHeading.appendChild(tocEntryLink);
		tocEntryWrapper.appendChild(tocEntryHeading);
		wrapElementInLayers(tocEntryHeading, indentLevel, "ind");
		toc.appendChild(tocEntryWrapper);
	}
	const documentHeading = getOne("documentheading");
	if(documentHeading)
		insertAfter(documentHeading, toc);
	else
		insertAsFirstChild(document.body, toc);
}

function insertHrBeforeAll(selector)
{
	const elems = get(selector);
	if(!elems) return;
	for(let i = 0, ii = elems.length; i < ii; i++)
		insertBefore(elems[i], document.createElement("hr"));
}

function getTextLength(node)
{
	const text = node.nodeType === 1 ? node.textContent : node.data;
	return text.replace(/[\s\u200B]+/g, "").length;
}

function getAlphanumericTextLength(elem)
{
	if(!elem.textContent)
		return 0;
	return elem.textContent.replace(/[^a-zA-Z0-9]+/g, "").length;
}

function containsPlainTextNodes(node)
{
	for(const child of node.childNodes)
		if(child.nodeType === 3) return true;
	return false;
}

function containsNonEmptyPlainTextNodes(node)
{
	for(const child of node.childNodes)
		if(child.nodeType === 3 && child.data.replace(/\s+/g, "").length > 0) return true;
	return false;
}

function containsOnlyPlainText(node)
{
	return node.children.length === 0;
}

function toggleHighlightSelectionMode()
{
	Nimbus.selectionHighlightMode = Nimbus.selectionHighlightMode === "sentence" ? "word" : "sentence";
	showMessageBig(`Highlight mode is ${Nimbus.selectionHighlightMode}`);
}

function singleQuotesToDoubleQuotes()
{
	replaceInTextNodes('"', "ρρ");
	replaceInTextNodes("'", '"');
	replaceInTextNodesRegex("body", /([a-zA-Z])"([a-zA-Z])/g, "$1'$2");
	replaceInTextNodes(' d" ', " d' ");
	replaceInTextNodes('s" ', "s' ");
	replaceInTextNodes('"s ', "'s ");
	replaceInTextNodes('n" ', "n' ");
	replaceInTextNodes("ρρ", "'");
}

//	When an entire paragraph is italicized, text that would be in italics is rendered normally instead.
//	This function inverts the italicization.
function invertItalics(elem)
{
	const nodes = elem.childNodes;
	for(let i = 0, ii = nodes.length; i < ii; i++)
	{
		const node = nodes[i];
		if(node.nodeType === 1 && (node.tagName === "I" || node.tagName === "EM"))
			unwrapElement(node);
		else
			wrapElement(node, "i");
	}
}

function italicizeSelection()
{
	const selection = window.getSelection();
	const tagName = Nimbus.italicTag || "i";
	if(!selection.toString().length)
	{
		showMessageBig("Nothing selected");
		return;
	}
	const node = selection.anchorNode;
	let selectionText = removeLineBreaks(selection.toString());
	let index1 = Math.min(selection.anchorOffset, selection.focusOffset);
	let index2 = Math.max(selection.anchorOffset, selection.focusOffset);
	const precedingSpaces = selectionText.match(/^\s/);
	const trailingSpaces = selectionText.match(/\s$/);
	if(precedingSpaces) index1 += precedingSpaces.length;
	if(trailingSpaces) index2 -= trailingSpaces.length;
	selectionText = selectionText.trim();
	const frag = document.createDocumentFragment();
	if(index1 > 0)
	{
		let textBeforeSelection = node.textContent.substring(0, index1);
		// if(/[a-zA-Z]/.test(textBeforeSelection[textBeforeSelection.length - 1]))
		// 	textBeforeSelection += " ";
		frag.appendChild(document.createTextNode(textBeforeSelection));
	}
	frag.appendChild(createElement(tagName, { textContent: selectionText }));
	if(index2 < node.textContent.length)
	{
		let textAfterSelection = node.textContent.substring(index2);
		// if(/[a-zA-Z]/.test(textAfterSelection[0]))
		// 	textAfterSelection = " " + textAfterSelection;
		frag.appendChild(document.createTextNode(textAfterSelection));
	}
	node.parentNode.replaceChild(frag, node);
}

function highlightFirstParentByText(str)
{
	const highlightTagName = Nimbus.highlightTagName;
	const textNodes = getTextNodesUnderSelector("body");
	const escapedString = "(\\w*" + escapeForRegExp(str) + "\\w*)";
	let regex = new RegExp(escapedString, "gi");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		if(regex.test(textNode.data))
			wrapElementInner(textNode.parentNode, highlightTagName);
	}
}

function highlightAllTextNodesMatching(str)
{
	insertStyleHighlight();
	str = str.toLowerCase();
	const textNodes = getTextNodesUnderSelector("body");
	let count = 0;
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		const nodeText = textNode.data;
		const parentNode = textNode.parentNode;
		if(~nodeText.toLowerCase().indexOf(str) && parentNode)
		{
			parentNode.replaceChild(createElement(Nimbus.highlightTagName, { textContent: nodeText }), textNode);
			count++;
		}
	}
	if(count)
		showMessageBig(count + " text nodes containing " + str + " highlighted");
}

function highlightBySelectorAndText(selector, str)
{
	const highlightTagName = Nimbus.highlightTagName;
	const elements = selectBySelectorAndText(selector, str);
	let i = elements.length;
	showMessageBig(`Found ${i} elements`);
	if(!i)
		return;
	if(elements[0].tagName === "TR")
		while(i--)
			elements[i].classList.add(Nimbus.trHighlightClass[highlightTagName]);
	else
		highlightElements(elements);
	insertStyleHighlight();
}

function highlightLinksWithHrefContaining(str)
{
	const highlightTagName = Nimbus.highlightTagName;
	const links = document.getElementsByTagName("a");
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		if(~link.href.indexOf(str))
			wrapElementInner(link, highlightTagName);
	}
}

function stripTrailingReferenceNumber(str)
{
	return str.replace(/([\."'])\d+$/, "$1");
}

function expandSelectionToWordBoundaries(node, selection)
{
	const text = node.textContent.replace(/\s+/g, " ");
	let index1 = text.indexOf(selection);
	if(index1 === -1)
		return selection;
	let index2 = index1 + selection.length;
	const regexLeft = /[\w\.\?!,'"\(\)\u2018\u201C]/;
	const regexRight = /[\w\.\?!,;'"\(\)\u2019\u201D]/;
	while(regexLeft.test(text[index1]) && index1 > 0)
		index1--;
	if(text[index1] === "\u2014") // em dash
		index1++;
	while(text[index2] && regexRight.test(text[index2]) && index2 < text.length)
		index2++;
	const expandedSelection = text.substring(index1, index2).replace(/\s+/g, " ").trim();
	return stripTrailingReferenceNumber(expandedSelection);
}

function expandSelectionToSentenceBoundaries(node, selection)
{
	const text = node.textContent.replace(/\s+/g, " ");
	let index1 = text.toLowerCase().indexOf(selection.toLowerCase());
	if(index1 === -1)
		return selection;
	let index2 = index1 + selection.length;
	const regexLeft = /[\.\?!]/;
	const regexRight = /[\.\?!]/;
	while(!regexLeft.test(text[index1]) && index1 > 0)
		index1--;
	while(text[index2] && !regexRight.test(text[index2]) && index2 < text.length)
		index2++;
	if(index2 < text.length - 1 && /['"\)]/.test(text[index2 + 1]) )
		index2++;
	index1++;
	if(/['"\)]/.test(text[index1]))
		index1++;
	if(index1 < 4)
		index1 = 0;
	if(index2 < text.length - 1)
		index2++;
	if(index2 > text.length - 4)
		index2 = text.length;
	const expandedSelection = text.substring(index1, index2).replace(/\s+/g, " ").trim();
	return stripTrailingReferenceNumber(expandedSelection);
}

function getNodeText(node)
{
	if(!node.nodeType)
		throw new Error(node);
	if(node.nodeType === 1) return node.textContent;
	if(node.nodeType === 3) return node.data;
}

function highlightSelection(mode = "sentence")
{
	const selection = window.getSelection();
	if(!selection.toString().length)
	{
		showMessageBig("Nothing selected");
		return;
	}
	const element = getFirstBlockParent(selection.anchorNode);
	let selectionText = removeLineBreaks(selection.toString()).trim();
	if(element.tagName !== "PRE")
		element.innerHTML = normalizeHTML(element.innerHTML);
	if(!element || element.tagName === undefined)
	{
		showMessageBig("Couldn't get anchorNode");
		return;
	}
	if(selectionText.length)
	{
		if(Nimbus.selectionHighlightMode === "sentence" && mode !== "word")
			selectionText = expandSelectionToSentenceBoundaries(element, selectionText);
		else
			selectionText = expandSelectionToWordBoundaries(element, selectionText);
		highlightTextInElement(element, selectionText);
	}
}

function highlightTextInElement(element, searchString)
{
	const isPlainTextMatch = highlightInElementTextNodes(element, searchString);
	if(!isPlainTextMatch) highlightTextAcrossTags(element, searchString);
}

function highlightInElementTextNodes(element, searchString)
{
	const colors = Nimbus.logColors;
	const nodes = getTextNodesUnderElement(element);
	for(const node of nodes)
	{
		const index = node.data.indexOf(searchString);
		if(index !== -1)
		{
			const textBeforeMatch = node.data.substring(0, index);
			const textOfMatch = node.data.substring(index, index + searchString.length);
			const textAfterMatch = node.data.substring(index + searchString.length);
			consoleLog(`%c${textBeforeMatch}%c${textOfMatch}%c${textAfterMatch}`, colors.gray, colors.yellow, colors.gray);
			const replacement = document.createDocumentFragment();
			const highlight = document.createElement(Nimbus.highlightTagName);
			highlight.appendChild(document.createTextNode(textOfMatch));
			if(textBeforeMatch)
				replacement.appendChild(document.createTextNode(textBeforeMatch));
			replacement.appendChild(highlight);
			if(textAfterMatch)
				replacement.appendChild(document.createTextNode(textAfterMatch));
			node.parentNode.replaceChild(replacement, node);
			return true;
		}
	}
	return false;
}

//	This function solves the problem of highlighting text in an HTML element when that text
//	spans other HTML elements, such as span, b, or em tags. It works by finding the
//	starting and ending indices of the search string in the textContent of the parent element,
//	using those indices to figure out which nodes are spanned by the search string, and then
//	highlighting the text across those nodes.
function highlightTextAcrossTags(element, searchString)
{
	const colors = Nimbus.logColors;
	logString(searchString, "highlightTextAcrossTags");
	searchString = searchString.replace(/\s+/g, " ");
	const nodeText = element.textContent.replace(/\s+/g, " ");
	const index1 = nodeText.toLowerCase().indexOf(searchString.toLowerCase());
	if(index1 === -1)
	{
		showMessageError("highlightTextAcrossTags: string not found in text");
		logString(searchString, "searchString");
		logString(nodeText, "nodeText");
		return;
	}
	const index2 = index1 + searchString.length;
	console.log(`%c ${index1} %c ... %c ${index2} `, colors.blue, colors.gray, colors.blue);
	const childNodes = element.childNodes;
	let childNodeEnd = 0;
	const highlightElement = document.createElement(Nimbus.highlightTagName);
	const replacement = document.createDocumentFragment();
	let toReplace;
	const toDelete = [];

	const isIndivisibleElement = {
		A: true,
		B: true,
		I: true,
		EM: true,
		STRONG: true,
		REFERENCE: true
	};

	for(let i = 0, ii = childNodes.length; i < ii; i++)
	{
		const childNode = childNodes[i];
		const childNodeStart = childNodeEnd;
		const childNodeText = getNodeText(childNode);
		childNodeEnd += childNodeText.length;

		if(childNodeEnd < index1)
			continue;

		const containsTheBeginning = index1 >= childNodeStart && index1 < childNodeEnd && index2 > childNodeEnd;
		const isContained = index1 < childNodeStart && index2 > childNodeEnd;
		const containsTheEnd = index2 >= childNodeStart && index2 <= childNodeEnd;
		const contains = index1 >= childNodeStart && index2 <= childNodeEnd;

		if(contains)
		{
			consoleLog(`%c ${childNodeStart} %c${childNodeText}%c ${childNodeEnd} %ccontains the entire string: %c${searchString}`, colors.blue, colors.gray, colors.blue, colors.green, colors.yellow);
			highlightTextAcrossTags(childNode, searchString);
			break;
		}
		else if(containsTheBeginning)
		{
			const substring = searchString.substring(0, childNodeEnd - index1);
			consoleLog(`%c ${childNodeStart} %c${childNodeText}%c ${childNodeEnd} %ccontains the beginning: %c${substring}`, colors.blue, colors.gray, colors.blue, colors.green, colors.yellow);
			if(childNode.nodeType === 1)
			{
				const childNodeTagName = childNode.tagName;
				if(containsOnlyPlainText(childNode) && !isIndivisibleElement[childNodeTagName])
				{
					const splitIndex = index1 - childNodeStart;
					if(splitIndex === 0)
					{
						highlightElement.appendChild(childNode.cloneNode(true));
					}
					else
					{
						const textBeforeMatch = childNodeText.substring(0, splitIndex);
						const textOfMatch = childNodeText.substring(splitIndex);
						replacement.appendChild(createElement(childNodeTagName, { textContent: textBeforeMatch}));
						highlightElement.appendChild(document.createTextNode(textOfMatch));
					}
				}
				else
				{
					highlightElement.appendChild(childNode.cloneNode(true));
				}
			}
			else
			{
				const splitIndex = index1 - childNodeStart;
				const textBeforeMatch = childNodeText.substring(0, splitIndex);
				const textOfMatch = childNodeText.substring(splitIndex);
				consoleLog(`%c${textBeforeMatch}%c${textOfMatch}`, colors.gray, colors.yellow);
				replacement.appendChild(document.createTextNode(textBeforeMatch));
				highlightElement.appendChild(document.createTextNode(textOfMatch));
			}
			replacement.appendChild(highlightElement);
			toReplace = childNode;
		}
		else if(isContained)
		{
			const substring = searchString.substring(childNodeStart - index1, childNodeEnd - index1);
			consoleLog(`%c ${childNodeStart} %c${childNodeText}%c ${childNodeEnd} %cis contained: %c${substring}`, colors.blue, colors.gray, colors.blue, colors.green, colors.yellow);
			consoleLog(`%c${childNodeText}`, colors.yellow);
			highlightElement.appendChild(childNode.cloneNode(true));
			toDelete.push(childNode);
		}
		else if(containsTheEnd)
		{
			const substring = searchString.substr(-(index2 - childNodeStart));
			// handle the problem of extra spaces added by the browser when a selection contains child elements
			const offset = childNodeText.indexOf(substring);
			const adjustedEndIndex = index2 + offset;
			consoleLog(`%c ${childNodeStart} %c${childNodeText}%c ${childNodeEnd} %ccontains the end: %c${substring}`, colors.blue, colors.gray, colors.blue, colors.green, colors.yellow);
			if(childNode.nodeType === 1)
			{
				const childNodeTagName = childNode.tagName;
				if(containsOnlyPlainText(childNode) && !isIndivisibleElement[childNodeTagName])
				{
					const childNodeTagName = childNode.tagName;
					const splitIndex = adjustedEndIndex - childNodeStart;
					const textOfMatch = childNodeText.substring(0, splitIndex);
					const textAfterMatch = childNodeText.substring(splitIndex);
					highlightElement.appendChild(document.createTextNode(textOfMatch));
					replacement.appendChild(createElement(childNodeTagName, { textContent: textAfterMatch}));
				}
				else
				{
					highlightElement.appendChild(childNode.cloneNode(true));
				}
			}
			else
			{
				const splitIndex = adjustedEndIndex - childNodeStart;
				const textOfMatch = childNodeText.substring(0, splitIndex);
				const textAfterMatch = childNodeText.substring(splitIndex);
				consoleLog(`%c${textOfMatch}%c${textAfterMatch}`, colors.yellow, colors.gray);
				highlightElement.appendChild(document.createTextNode(textOfMatch));
				replacement.appendChild(document.createTextNode(textAfterMatch));
			}
			toDelete.push(childNode);
			break;
		}
	}
	if(toReplace)
	{
		element.replaceChild(replacement, toReplace);
		moveLeadingAndTrailingReferencesOutOfHighlight(highlightElement);
		del(toDelete);
	}
}

function createExcerpt(elem)
{
	const excerpt = document.createElement("p");
	const temp = elem.cloneNode(true);
	while(temp.firstChild)
		excerpt.appendChild(temp.firstChild);
	return excerpt;
}

//	Fast search for two strings occurring in close proximity in a document.
//	The document is modified: most importantly, paragraph IDs are replaced, so existing internal references will be destroyed.
// 	The advantage of this approach is that as the distance goes up, the cost goes down.
function findStringsInProximity(stringOne, stringTwo)
{
	if(!(typeof stringOne === "string" && typeof stringTwo === "string"))
	{
		showMessageError("Two strings are required");
		return;
	}
	del("#proximateSearchResults");
	insertStyleHighlight();
	Nimbus.highlightTagName = "markgreen";
	highlightAllMatchesInDocument(stringOne);
	Nimbus.highlightTagName = "markblue";
	highlightAllMatchesInDocument(stringTwo);
	resetHighlightTag();

	const stringOneLower = stringOne.toLowerCase();
	const stringTwoLower = stringTwo.toLowerCase();
	const BRACKET_SIZE = 2;
	const createBracketKey = (n) => Math.round(n / BRACKET_SIZE) * BRACKET_SIZE;
	const paras = get("p, blockquote, li");
	if(!paras) return;
	const lookup1 = {};
	const lookup2 = {};
	for(let i = 0, ii = paras.length; i < ii; i++)
	{
		const para = paras[i];
		para.id = `p${i}`;
		const paraText = para.textContent.toLowerCase().replace(/\s+/g, " ");
		if(~paraText.indexOf(stringOneLower))
		{
			const bracket = 'p' + createBracketKey(i);
			if(!lookup1[bracket])
				lookup1[bracket] = i;
		}
		if(~paraText.indexOf(stringTwoLower))
		{
			const bracket = 'p' + createBracketKey(i);
			if(!lookup2[bracket])
				lookup2[bracket] = i;
		}
	}

	function getIndex(lookup, key, keyPrev, keyNext)
	{
		if(typeof lookup[keyPrev] === "number")
			return lookup[keyPrev];
		if(typeof lookup[key] === "number")
			return lookup[key];
		if(typeof lookup[keyNext] === "number")
			return lookup[keyNext];
		return false;
	}

	const keys = Object.keys(lookup1);
	if(!keys.length)
		return;

	const resultsWrapper = createElement("div", { id: "proximateSearchResults" } );
	resultsWrapper.appendChild(createElement( "h2", { textContent: `Proximity search results for "${stringOne}" and "${stringTwo}"` } ));
	const resultsList = document.createElement("ol");
	const seen = new Set();
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		const stringOneParagraphIndex = lookup1[key];
		const keyPrev = "p" + createBracketKey(Math.max(0, stringOneParagraphIndex - BRACKET_SIZE));
		const keyNext = "p" + createBracketKey(stringOneParagraphIndex + BRACKET_SIZE);
		const stringTwoParagraphIndex = getIndex(lookup2, key, keyPrev, keyNext);
		if(stringTwoParagraphIndex !== false)
		{
			const firstIndex = Math.min(stringOneParagraphIndex, stringTwoParagraphIndex);
			if(seen.has(firstIndex)) continue;
			const secondIndex = Math.max(stringOneParagraphIndex, stringTwoParagraphIndex);
			if(seen.has(secondIndex)) continue;
			seen.add(firstIndex);
			seen.add(secondIndex);
			const areSeparateParagraphs = firstIndex !== secondIndex;
			const firstExcerpt = createExcerpt(getOne("#p" + firstIndex))
			const secondExcerpt = createExcerpt(getOne("#p" + secondIndex))
			const resultsListItem = document.createElement("li");
			const link = createElement("a", { textContent: firstIndex, href: "#p" + firstIndex });
			const result = areSeparateParagraphs ? createElementWithChildren("blockquote", link, firstExcerpt, secondExcerpt) : createElementWithChildren("blockquote", link, firstExcerpt);
			resultsListItem.appendChild(result);
			resultsList.appendChild(resultsListItem);
		}
	}
	resultsWrapper.appendChild(resultsList);
	document.body.insertBefore(resultsWrapper, document.body.firstChild);
	window.scrollTo(0, 0);
}

function replaceInTextNodes(searchString, replacementString)
{
	const textNodes = getTextNodesUnderSelector("body");
	for(const textNode of textNodes)
		textNode.data = textNode.data.replaceAll(searchString, replacementString);
}

function replaceInTextNodesRegex(selector, regex, replacement)
{
	const textNodes = getTextNodesUnderSelector(selector);
	let replCount = 0;
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		if(regex.test(textNode.data))
		{
			replCount++;
			textNode.data = textNode.data.replace(regex, replacement);
		}
	}
	if(replCount)
		showMessageBig(`${replCount} occurrences of "${regex}" replaced with "${replacement}"`);
}

function highlightInTextNode(textNode, regex, highlightTagName)
{
	const tagName = highlightTagName || Nimbus.highlightTagName;
	const nodeText = textNode.data;
	if(nodeText.search(regex) === -1)
		return;
	const parentNode = textNode.parentNode;
	if(!parentNode)
		return;
	const matches = nodeText.matchAll(regex);
	const replacementNodes = [];
	let lastIndex = 0;
	for(const match of matches)
	{
		const matchedString = match[0];
		const matchIndex = match.index;
		if(matchIndex > lastIndex)
			replacementNodes.push(document.createTextNode(nodeText.substring(lastIndex, matchIndex)));
		replacementNodes.push(createElement(tagName, { textContent: matchedString }));
		lastIndex = matchIndex + matchedString.length;
	}
	if(lastIndex < nodeText.length)
		replacementNodes.push(document.createTextNode(nodeText.substring(lastIndex)));
	const frag = document.createDocumentFragment();
	for(const node of replacementNodes)
		frag.appendChild(node);
	parentNode.replaceChild(frag, textNode);
}

function highlightAllStrings(...args)
{
	for(const arg of args)
		highlightAllMatchesInDocument(arg);
}

function getPreTextNodes(directDescendantsOnly, markedOnly)
{
	const selectorPre = markedOnly ? "pre[contains(@class, 'markd')]" : "pre";
	if(directDescendantsOnly) return getXpathResultAsArray(`//${selectorPre}/text()`);
	return getXpathResultAsArray(`//${selectorPre}//text()`);
}

function highlightInPres(str, tagName = "markyellow")
{
	const regex = new RegExp(str, 'g');
	highlightCodeInPreTextNodes(regex, tagName);
}

function highlightCodeInPreTextNodes(regex, tagName)
{
	const nodes = getPreTextNodes();
	if(!nodes) return;
	for(const node of nodes)
		highlightInTextNode(node, regex, tagName);
}

function highlightCodePunctuation()
{
	highlightCodeInPreTextNodes(/[\{\}\[\]\(\)\|]/g, "xp");
	// highlightCodeInPreTextNodes(/[\{\}]/g, "xp");
	// highlightCodeInPreTextNodes(/[\[\]]/g, "x13");
	// highlightCodeInPreTextNodes(/[\(\)]/g, "x14");
	// highlightCodeInPreTextNodes(/\|\|/g, "x15");
}

function highlightCodeStrings()
{
	highlightCodeInPreTextNodes(/''/g, "xs");
	highlightCodeInPreTextNodes(/""/g, "xs");
	highlightCodeInPreTextNodes(/'[^']+'/g, "xs");
	highlightCodeInPreTextNodes(/"[^"]+"/g, "xs");
}

function highlightCodeKeywords(keywords)
{
	const keywordClause = '(' + keywords.join('|') + ')';
	const regex = new RegExp("\\b" + keywordClause + "\\b", "g");
	highlightCodeInPreTextNodes(regex, "xk");
}

function highlightCodeComments()
{
	highlightCodeInPreTextNodes(/[^:]\/\/[^\n]+/g, "xc");
	highlightCodeInPreTextNodes(/[\s]\/\/[^\n]+/g, "xc");
	highlightCodeInPreTextNodes(/^\/\/[^\n]+/g, "xc");
	makePlainText("xc");
}

function highlightInTextNodes(regex, tagName)
{
	const nodes = getTextNodesUnderSelector("body");
	if(!nodes) return;
	for(const node of nodes)
		highlightInTextNode(node, regex, tagName);
}

function highlightMatchesUnderSelector(selector, str, isCaseSensitive = false)
{
	insertStyleHighlight();
	const textNodes = getTextNodesUnderSelector(selector);
	const regexFlags = isCaseSensitive ? "g" : "gi";
	const regex = new RegExp(escapeForRegExp(str), regexFlags);
	for(let i = 0, ii = textNodes.length; i < ii; i++)
		highlightInTextNode(textNodes[i], regex);
}

function highlightMatchesInElementRegex(elem, regex)
{
	insertStyleHighlight();
	const textNodes = getTextNodesUnderElement(elem);
	for(let i = 0, ii = textNodes.length; i < ii; i++)
		highlightInTextNode(textNodes[i], regex);
}

function highlightAllMatchesInDocument(str, isCaseSensitive = false)
{
	highlightMatchesUnderSelector("body", str, isCaseSensitive);
}

function highlightAllMatchesInDocumentCaseSensitive(str)
{
	highlightAllMatchesInDocument(str, true);
}

function highlightAllMatchesInDocumentRegex(regex)
{
	const textNodes = getTextNodesUnderSelector("body");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
		highlightInTextNode(textNodes[i], regex);
}

function toggleHighlight()
{
	const markedElements = getMarkedElements();
	if(markedElements.length)
		removeHighlightsFromMarkedElements();
	else
		highlightSelectedElement();
}

function moveLeadingAndTrailingReferencesOutOfHighlight(highlightElement)
{
	const firstChild = highlightElement.firstChild;
	if(firstChild && firstChild.nodeType === 1 && firstChild.tagName === "REFERENCE")
		highlightElement.insertAdjacentElement("beforebegin", firstChild);
	const lastChild = highlightElement.lastChild;
	if(lastChild && lastChild.nodeType === 1 && lastChild.tagName === "REFERENCE")
		highlightElement.insertAdjacentElement("afterend", lastChild);
}

function highlightSelectedElement(tag)
{
	const MAX_LENGTH = 4000;
	let node = getNodeContainingSelection();
	if(node && node.parentNode && node.tagName !== "BODY" && node.textContent.length < MAX_LENGTH)
	{
		const highlightTagName = tag ? tag : Nimbus.highlightTagName;
		const element = getFirstBlockParent(node);
		if(element.firstChild && element.firstChild.nodeType === 1 && element.firstChild.tagName.toLowerCase() === highlightTagName)
			return;
		wrapElementInner(element, highlightTagName);
		moveLeadingAndTrailingReferencesOutOfHighlight(element.firstChild);
	}
}

function highlightLinksInPres()
{
	const pres = get("pre");
	const linkRegex = /(http[s]*:\/\/[^\s\r\n]+)/g;
	for(let i = 0, ii = pres.length; i < ii; i++ )
	{
		const pre = pres[i];
		if(linkRegex.test(pre.textContent))
			pre.innerHTML = pre.innerHTML.replace(regex, '<a href="' + "$1" + '">' + "$1" + '</a>');
	}
}

function removeAllEmphasis() { unwrapAll("b, strong, i, em, u"); }

function removeAllHighlights()
{
	unwrapAll("mark, markyellow, markred, markgreen, markblue, markpurple, markwhite");
	deleteClass("trMark");
	deleteClass("trMarkYellow");
	deleteClass("trMarkRed");
	deleteClass("trMarkGreen");
	deleteClass("trMarkBlue");
	deleteClass("trMarkPurple");
	deleteClass("trMarkWhite");
}

function removeHighlightsFromMarkedElements()
{
	const markedElements = getMarkedElements();
	for(let i = 0, ii = markedElements.length; i < ii; i++)
	{
		const element = getFirstBlockParent(markedElements[i]);
		const marks = element.querySelectorAll("mark, markyellow, markred, markgreen, markblue, markpurple, markwhite");
		for(let i = 0, ii = marks.length; i < ii; i++)
			unwrapElement(marks[i]);
	}
	unmarkAll();
}

function getPreviousIndex(index)
{
	return Math.max(--index, 0);
}

function getNextIndex(index, array)
{
	return Math.min(++index, array.length - 1);
}

function toggleVideoFilter()
{
	if(Nimbus.videoFilter.enabled)
		disableVideoFilter();
	else
		applyVideoFilter();
}

function disableVideoFilter()
{
	del("#styleVideoFilter");
	showMessageBig("Video filter disabled");
	Nimbus.videoFilter.enabled = false;
}

function previousVideoFilter()
{
	const lastIndex = Nimbus.videoFilter.currentIndex;
	Nimbus.videoFilter.currentIndex = getPreviousIndex(Nimbus.videoFilter.currentIndex);
	if(Nimbus.videoFilter.currentIndex !== lastIndex)
		applyVideoFilter();
}

function nextVideoFilter()
{
	const lastIndex = Nimbus.videoFilter.currentIndex;
	Nimbus.videoFilter.currentIndex = getNextIndex(Nimbus.videoFilter.currentIndex, Nimbus.videoFilter.styles);
	if(Nimbus.videoFilter.currentIndex !== lastIndex)
		applyVideoFilter();
}

function addVideoFilter(style)
{
	Nimbus.videoFilter.styles.push(style);
	Nimbus.videoFilter.currentIndex = Nimbus.videoFilter.styles.length - 1;
	applyVideoFilter();
}

function applyVideoFilter(index)
{
	insertStyle(Nimbus.videoFilter.styles[Nimbus.videoFilter.currentIndex], "styleVideoFilter", true);
	showMessageBig("Video filter " + Nimbus.videoFilter.currentIndex);
	Nimbus.videoFilter.enabled = true;
}

function toggleViewVideoMode()
{
	toggleStyle(STYLES.VIEW_VIDEO_01, "styleViewVideo", true);
	toggleWebsiteSpecificStyle();
}

function clearBootstrapClasses()
{
	const elems = get("div[class*=col-]");
	for(let i = 0, ii = elems.length; i < ii; i++)
		elems[i].className = "";
}

function isChrome() { return navigator.userAgent.indexOf("Chrome/") !== -1; }
function isIframe() { return window !== window.top; }

function doWebsiteSpecificTasksInternal()
{
	const sites = ["stackexchange", "stackoverflow", "superuser", "serverfault", "askubuntu"];
	if(containsAnyOfTheStrings(location.hostname, sites) && /questions\/[0-9]+/.test(location.href)) cleanupStackOverflow();
}

function doWebsiteSpecificTasks()
{
	const commandElems = get("#website-specific-commands li");
	if(!commandElems) return;
	for(const commandElem of commandElems)
		runCommand(commandElem.textContent);
	del("#website-specific-commands");
}

function inject()
{
	document.addEventListener("keydown", handleKeyDown, false);
	if(isChrome())
		insertStyleHighlight();
	xlog("Referrer: " + document.referrer);
	xlog("Page loaded at " + getTimestamp());
	doWebsiteSpecificTasksInternal();
	Nimbus.pageMetadata = getMetadata();
	Nimbus.autoCompleteCommandPrompt = autoCompleteInputBox();
	if(isDebugMode)
		enableConsoleLogs();
	setTimeout(doWebsiteSpecificTasks, 1000);
}

function handleKeyDown(e)
{
	let shouldPreventDefault = true;
	const ctrlOrMeta = ~navigator.userAgent.indexOf("Macintosh") ? "metaKey" : "ctrlKey";
	if(!(e.altKey || e.shiftKey || e[ctrlOrMeta])) return;
	const k = e.keyCode;
	//
	//	Alt
	//
	if(e.altKey && !e.shiftKey && !e[ctrlOrMeta])
	{
		switch(k)
		{
			case KEYCODES.TILDE: highlightSelection(); break;
			case KEYCODES.NUMPAD1: removeAttributeOf("body *", "class"); break;
			case KEYCODES.NUMPAD2: removeAttributeOf("body *", "id"); break;
			case KEYCODES.NUMPAD4: forceReloadCss(); break;
			case KEYCODES.NUMPAD5: toggleHighlightSelectionMode(); break;
			case KEYCODES.NUMPAD6: retrieveLargeImages(); break;
			case KEYCODES.NUMPAD7: groupMarkedElements(Nimbus.GROUP_TAGNAME); break;
			case KEYCODES.NUMPAD8: toggleNonVideoContent(); break;
			case KEYCODES.NUMPAD9: toggleNimbusStyles(); break;
			case KEYCODES.NUMPAD0: deleteResources(); break;
			case KEYCODES.NUMPAD_ADD: persistStreamingImages(); break;
			case KEYCODES.NUMPAD_SUBTRACT: deletePersistedImages(); break;
			case KEYCODES.NUMPAD_MULTIPLY: showSavedStreamingImages(); break;
			case KEYCODES.PERIOD: toggleNonVideoContent(); break;
			case KEYCODES.F1: replaceSelectedElement(Nimbus.replacementTagName1); break;
			case KEYCODES.F2: replaceSelectedElement(Nimbus.replacementTagName2); break;
			case KEYCODES.F3: customPrompt("Enter tag name to replace elements of the marked type with").then(replaceElementsOfMarkedTypeWith); break;
			case KEYCODES.F11: inspect(); break;
			case KEYCODES.ONE: cleanupDocument(); break;
			case KEYCODES.TWO: deleteImages(); break;
			case KEYCODES.THREE: toggleClass(document.body, "xwrap"); break;
			case KEYCODES.FOUR: deleteSmallImages(); break;
			case KEYCODES.FIVE: buildGallery(); break;
			case KEYCODES.SIX: deleteIframes(); break;
			case KEYCODES.SEVEN: showHtmlComments(); break;
			case KEYCODES.EIGHT: toggleBlockEditMode(); break;
			case KEYCODES.NINE: removeAllAttributesOfTypes(["class", "style", "align"]); unwrapAll("span"); break;
			case KEYCODES.ZERO: cycleThroughDocumentHeadings(); break;
			case KEYCODES.A: cycleTheme(); break;
			case KEYCODES.C: getContentByParagraphCount(); break;
			case KEYCODES.D: deleteEmptyBlockElements(); break;
			case KEYCODES.E: cycleHighlightTag(); break;
			case KEYCODES.G: callFunctionWithArgs("Delete elements (optionally containing text)", deleteBySelectorAndTextMatching); break;
			case KEYCODES.I: toggleConsole("css"); break;
			case KEYCODES.J: deleteNonEnglishText(); makeAllTextLowerCase(); break;
			case KEYCODES.K: toggleConsole("js"); break;
			case KEYCODES.L: showLog(); break;
			case KEYCODES.M: toggleHighlightMap(2, 0, 4); break;
			case KEYCODES.N: numberDivs(); break;
			case KEYCODES.O: getSelectionOrUserInput("Highlight all occurrences of string", highlightAllMatchesInDocument, true); break;
			case KEYCODES.P: fixParagraphs(); break;
			case KEYCODES.Q: resetHighlightTag(); Nimbus.selectionHighlightMode = "sentence"; break;
			case KEYCODES.R: toggleHighlight(); break;
			case KEYCODES.S: toggleContentEditable(); break;
			case KEYCODES.T: capitalizeTitle(); break;
			case KEYCODES.U: del("ul"); del("dl"); break;
			case KEYCODES.V: cleanupBarebone(); break;
			case KEYCODES.W: highlightSelection("word"); break;
			case KEYCODES.X: joinNodesContainingSelection(); break;
			case KEYCODES.Y: callFunctionWithArgs("Mark elements by selector and containing text", markBySelectorAndText, 2); break;
			case KEYCODES.Z: replaceSpecialCharacters(); break;
			case KEYCODES.FORWARD_SLASH: showPassword(); cycleFocusOverFormFields(); break;
			case KEYCODES.DELETE: deleteMarkedElements(); break;
			case KEYCODES.SQUARE_BRACKET_OPEN: modifyMark("previous"); break;
			case KEYCODES.SQUARE_BRACKET_CLOSE: modifyMark("next"); break;
			case KEYCODES.MINUS: insertElementBeforeSelectionAnchor(); break;
			case KEYCODES.BACK_SLASH: italicizeSelection(); break;
			case KEYCODES.END: deleteMessage(); goToLastElement("mark"); break;
			default: shouldPreventDefault = false;
		}
		if(shouldPreventDefault)
			e.preventDefault();
	}
	//
	//	Ctrl
	//
	else if(!e.altKey && !e.shiftKey && e[ctrlOrMeta])
	{
		shouldPreventDefault = true;
		switch(k)
		{
			case KEYCODES.ENTER:
				if(Nimbus.isEditing)
					toggleContentEditable();
				else
					shouldPreventDefault = false;
				break;
			default: shouldPreventDefault = false; break;
		}
		if(shouldPreventDefault)
			e.preventDefault();
	}
	//
	//	Alt-Shift
	//
	else if(e.altKey && e.shiftKey && !e[ctrlOrMeta])
	{
		shouldPreventDefault = true;
		switch(k)
		{
			case KEYCODES.ZERO: editDocumentTitle(); break;
			case KEYCODES.ONE: showResources(); break;
			case KEYCODES.TWO: replaceImagesWithTextLinks(); break;
			case KEYCODES.FOUR: deleteImagesSmallerThan(100, 100); break;
			case KEYCODES.FIVE: buildSlideshow(); break;
			case KEYCODES.A: annotate(); break;
			case KEYCODES.C: deleteNonContentElements(); break;
			case KEYCODES.E: callFunctionWithArgs("Replace marked element with text", replaceMarkedWithTextElement, 2, "h2 "); break;
			case KEYCODES.G: callFunctionWithArgs("Retrieve elements by selector (optionally containing text)", retrieveBySelectorAndText); break;
			case KEYCODES.J: joinMarkedElements(); break;
			case KEYCODES.K: makeChildOf(); break;
			case KEYCODES.L: logout(); break;
			case KEYCODES.M: toggleMutationObserver(true); break;
			case KEYCODES.N: callFunctionWithArgs("Delete numbered divs in range", delRange); break;
			case KEYCODES.O: getSelectionOrUserInput("Highlight all occurrences of string (case-sensitive)", highlightAllMatchesInDocumentCaseSensitive, true); break;
			case KEYCODES.P: getPageNavLinks(); break;
			case KEYCODES.R: wrapMarkedElement(); break;
			case KEYCODES.U: moveElementUp("before"); break;
			case KEYCODES.D: moveElementUp("after"); break;
			case KEYCODES.W: cleanupAttributes(); break;
			case KEYCODES.Y: callFunctionWithArgs("Highlight elements by tag name containing text", highlightByTagNameAndText, 2); break;
			case KEYCODES.FORWARD_SLASH: focusButton(); break;
			case KEYCODES.F12: highlightCode(true); break;
			case KEYCODES.MINUS: callFunctionWithArgs("Insert HR before all (selector)", insertHrBeforeAll); break;
			case KEYCODES.SQUARE_BRACKET_OPEN: goToPrevElement(); break;
			case KEYCODES.SQUARE_BRACKET_CLOSE: goToNextElement(); break;
			default: shouldPreventDefault = false; break;
		}
		if(shouldPreventDefault)
			e.preventDefault();
	}
	//
	//	Ctrl-Alt or Meta-Alt
	//
	else if(e.altKey && e[ctrlOrMeta] && !e.shiftKey)
	{
		shouldPreventDefault = true;
		switch(k)
		{
			case KEYCODES.UPARROW: modifyMark("expand"); break;
			case KEYCODES.DOWNARROW: modifyMark("contract"); break;
			case KEYCODES.LEFTARROW: modifyMark("previous"); break;
			case KEYCODES.RIGHTARROW: modifyMark("next"); break;
			case KEYCODES.ONE: toggleStyleNegative(); break;
			case KEYCODES.TWO: toggleStyle(STYLES.DIM_BODY + STYLES.FONT_01, "style2", true); break;
			case KEYCODES.THREE: toggleStyle(STYLES.FONT_01, "styleFont01", true); break;
			case KEYCODES.FOUR: toggleStyle(STYLES.SIMPLE_NEGATIVE_3, "styleSimpleNegative3", true); break;
			case KEYCODES.FIVE: toggleStyle(STYLES.MIN_FONT_SIZE, "styleMinFontSize", true); break;
			case KEYCODES.SIX: toggleStyle(STYLES.GITHUB_HIDE_DELETE_DIFFS, "styleGithubHideDeleteDiffs", true); break;
			case KEYCODES.ZERO: clearBootstrapClasses(); toggleViewVideoMode(); break;
			case KEYCODES.A: toggleShowEmptyLinksAndSpans(); break;
			case KEYCODES.B: toggleStyle(STYLES.SHOW_SELECTORS, "styleShowSelectors", true); break;
			case KEYCODES.E: replaceElementsBySelectorHelper(); break;
			case KEYCODES.F: del(["object", "embed", "video", "iframe"]); break;
			case KEYCODES.G: callFunctionWithArgs("Delete elements with class or id containing the string", deleteByClassOrIdContaining); break;
			case KEYCODES.H: callFunctionWithArgs("Mark elements by selector", markBySelector, 1); break;
			case KEYCODES.I: toggleStyle(STYLES.INVERT_IMAGES, "styleInvertImages", true); break;
			case KEYCODES.J: deleteNodesBeforeAnchorNode(); break;
			case KEYCODES.K: deleteNodesAfterAnchorNode(); break;
			case KEYCODES.L: deleteNodesBetweenMarkers(); break;
			case KEYCODES.M: Nimbus.autoCompleteCommandPrompt.open(); break;
			case KEYCODES.N: toggleStyle(STYLES.PAD_BLOCK_ELEMENTS, "stylePadBlockElements", true); break;
			case KEYCODES.O: customPrompt("Highlight all text nodes matching").then(highlightAllTextNodesMatching); break;
			case KEYCODES.P: makeAnchorNodePlainText(); break;
			case KEYCODES.R: wrapAnchorNodeInTag(); break;
			case KEYCODES.S: callFunctionWithArgs("Mark block elements containing text", markBlockElementsContainingText, 1); break;
			case KEYCODES.T: toggleStyle(STYLES.SHOW_TABLE_STRUCTURE, "styleShowTableStructure", true); break;
			case KEYCODES.V: toggleStyle(STYLES.OUTLINE_ELEMENTS, "styleOutlineElements", true); break;
			case KEYCODES.X: customPrompt("Enter xPath").then(xPathMark); break;
			case KEYCODES.Z: markSelectionAnchorNode(); break;
			case KEYCODES.MINUS: insertElementAfterSelectionAnchor(); break;
			case KEYCODES.U: customPrompt("Enter custom video filter style", "video, img { filter: saturate(0); }").then(addVideoFilter); break;
			case KEYCODES.Y: toggleVideoFilter(); break;
			case KEYCODES.SQUARE_BRACKET_OPEN: previousVideoFilter(); break;
			case KEYCODES.SQUARE_BRACKET_CLOSE: nextVideoFilter(); break;
			default: shouldPreventDefault = false; break;
		}
		if(shouldPreventDefault)
			e.preventDefault();
	}
	//
	//	Ctrl-Alt-Shift
	//
	else if(e.altKey && e[ctrlOrMeta] && e.shiftKey)
	{
		shouldPreventDefault = true;
		switch(k)
		{
			case KEYCODES.SQUARE_BRACKET_OPEN: identifyClassCycle("previous"); break;
			case KEYCODES.SQUARE_BRACKET_CLOSE: identifyClassCycle("next"); break;
			case KEYCODES.BACK_SLASH: customPrompt("Enter tag to mark this class with").then(identifyClassMark); break;
			case KEYCODES.ONE: fixBody(); break;
			case KEYCODES.ZERO: capitalizeTitle(); break;
			case KEYCODES.A: annotate("after"); break;
			case KEYCODES.B: toggleShowSelectors(); break;
			case KEYCODES.D: deselect(); break;
			case KEYCODES.G: callFunctionWithArgs("Delete elements not containing text", deleteBySelectorAndTextNotMatching, 2); break;
			case KEYCODES.Z: deselect(); break;
			case KEYCODES.E: callFunctionWithArgs("Replace elements by class or id containing", replaceByClassOrIdContaining, 2); break;
			case KEYCODES.H: unmarkAll(); break;
			case KEYCODES.M: toggleHighlightMap(4, 1, 20); break;
			case KEYCODES.S: forceReloadCss(); break;
			case KEYCODES.V: replaceCommonClasses(); break;
			case KEYCODES.F11: inspect(true); break;
			case KEYCODES.UPARROW: modifyMark("expand", true); break;
			case KEYCODES.DOWNARROW: modifyMark("contract", true); break;
			case KEYCODES.LEFTARROW: modifyMark("previous", true); break;
			case KEYCODES.RIGHTARROW: modifyMark("next", true); break;
			default: shouldPreventDefault = false; break;
		}
		if(shouldPreventDefault)
			e.preventDefault();
	}
	window.focus();
}

function main()
{
	const excludedDomains = {
		"mail.proton.me": true,
	};
	if(!excludedDomains[location.hostname])
		setTimeout(inject, 200);
	else
		console.log("Nimbus: is excluded domain, not injecting");
}

main();
