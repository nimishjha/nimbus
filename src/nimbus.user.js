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

import { Nimbus } from "./includes/Nimbus";
import { Cyclable } from "./includes/Cyclable";
import { STYLES } from "./includes/stylesheets";
import { KEYCODES } from "./includes/keycodes";
import { SYMBOLS, BLOCK_ELEMENTS, INLINE_ELEMENTS } from "./includes/constants";
import { parseCommand, runCommand, callFunctionWithArgs } from "./includes/command";
import {
	get,
	getOne,
	count,
	del,
	getOrCreate,
	selectElementsStartingWithText,
	selectElementsEndingWithText,
	selectByTagNameMatching,
	selectByClassOrIdContaining,
	selectByChildrenWithText,
	markByChildrenHavingTheExactText,
	markElementsWithChildrenSpanning,
	filterNodesByAttributeNotEqualTo,
	filterNodesByAttributeValueLessThan,
	filterNodesByAttributeValueGreaterThan,
	filterNodesByAttributeContaining,
	filterNodesByAttributeNotContaining,
	filterNodesByAttributeMatching,
	filterNodesByAttributeExistence,
	filterNodesByAttributeNonExistence,
	filterNodesWithChildrenOfType,
	filterNodesWithoutChildrenOfType,
	filterNodesWithDirectChildrenOfType,
	filterNodesWithoutDirectChildrenOfType,
	filterNodesWithFirstChildOfType,
	filterNodesWithLastChildOfType,
	filterNodesWithoutParentOfType,
	filterNodesWithTextLengthUnder,
	filterNodesWithTextLengthOver,
	filterNodesFollowingNodesOfType,
	filterNodesPrecedingNodesOfType,
	select,
	mark,
	unmark,
	remove,
	getNonCodeTextNodes,
	getPreTextNodes,
	selectBySelectorAndText,
	selectBySelectorAndExactText,
	selectBySelectorAndNormalizedText,
	selectBySelectorAndRegex,
	selectByTagNameAndText,
	selectBlockElementsContainingText,
	selectByRelativePosition,
	selectBySelectorAndRelativePosition,
	selectNodesBetweenMarkers,
	getFirstBlockParent,
	getFirstTextChild,
	getNodeContainingSelection,
} from "./includes/selectors";
import {
	XpathNodesToArray,
	getTextNodesUnderElement,
	getTextNodesUnderElementMatching,
	getTextNodesUnderSelector,
	getXpathResultAsArray,
	xPathSelect,
} from "./includes/xpath";
import {
	identifyClassSetup,
	identifyClassTeardown,
	identifyClassSetStyle,
	identifyClassCycle,
	identifyClassMark,
	identifyClassShowMarked,
} from "./includes/identifyClass";
import {
	insertStyle,
	insertStyleHighlight,
	insertStyleShowErrors,
	toggleStyleNegative,
	toggleNimbusStyles,
	toggleWebsiteSpecificStyle,
	toggleStyle,
	getAllInlineStyles,
	getAllCssRulesForElement,
	getAllCssRulesMatching,
	forceReloadCss,
} from "./includes/style";
import {
	toggleConsole,
	editStyleById,
} from "./includes/console";
import {
	addDateToTitle,
	capitalizeTitle,
	setDocTitle,
	replaceIframes,
	cleanupDocument,
	cleanupAttributes,
	cleanupHeadings,
	cleanupBarebone,
	removeRedundantHrs,
	deleteNonContentLists,
	deleteNonContentLinks,
	deleteNonContentElements,
	removeEventListeners,
	getContentByParagraphCount,
	cleanupStackOverflow,
	clearBootstrapClasses,
	deleteHtmlComments,
	replaceAudio,
	fixBody,
	replaceCommonClasses,
	removeSpanTags,
	removeUnnecessaryClasses,
	simplifyClassNames,
	shortenIds,
	cleanupTitle,
	editDocumentTitle,
	chooseDocumentHeading,
	setDocumentHeading,
	getBestDomainSegment,
	removeInlineStyles,
	replaceInlineStylesWithClasses,
	replaceClassesWithCustomElements,
	cleanupHead,
	cleanupLinks,
	removeRedundantDivs,
} from "./includes/cleanup";
import {
	showMessage,
	showMessageBig,
	showMessageError,
	deleteMessage,
	customPrompt,
	restoreCustomPromptHistory,
	closeCustomPrompt,
	autoCompleteInputBox,
	getSelectionOrUserInput,
} from "./includes/ui";
import { replaceInTextNodes, replaceInPreTextNodes, replaceInTextNodesRegex } from "./includes/textReplace";
import { toggleHighlightMap } from "./includes/highlightMapper";
import { getPrevious, getNext } from "./includes/array";
import {
	removeLineBreaks,
	trimNonAlphanumeric,
	trimSpecialChars,
	ltrim,
	trimAt,
	trimAtInclusive,
	trimStartingAt,
	trimBetween,
	padLeft,
	padRight,
	normalizeWhitespace,
	removeWhitespace,
	normalizeString,
	normalizeHTML,
	removeNonAlpha,
	capitalize,
	escapeHTML,
	unescapeHTML,
	containsAnyOfTheStrings,
	containsAllOfTheStrings,
	startsWithAnyOfTheStrings,
} from "./includes/string";
import {
	createUniqueId,
	replaceEmptyAnchors,
	moveIdsFromSpans,
	fixInternalReferences,
	revealLinkHrefs,
	humanizeUrl,
	isEmptyLink,
	revealEmptyLinks,
	toggleShowEmptyLinksAndSpans,
	createBackLink,
	logHrefsOnClick,
	enableClickToCollectUrls,
	disableClickToCollectUrls,
	makeFileLinksRelative,
	removeQueryStringFromLinks,
	removeQueryStringFromLinksMatching,
	removeQueryParameterFromLinks,
	removeAllQueryParametersExcept,
} from "./includes/link";
import {
	printPropOfObjectArray,
	printPropsContaining,
	logElements,
	xlog,
	ylog,
	logString,
	logTable,
	showLog,
	debugVars,
	logAllClassesFor,
} from "./includes/log";
import {
	deleteImagesSmallerThan,
	deleteSmallImages,
	deleteImageByNumber,
	getBestImageSrc,
	shortenImageSrc,
	replaceImagesWithAltText,
	replaceImagesWithTextLinks,
	retrieveLargeImages,
	getImageWidth,
	getImageHeight,
	persistStreamingImages,
	deletePersistedImages,
	showSavedStreamingImages,
	addLinksToLargerImages,
	tagLargeImages,
	forceImageWidth,
	forceImageHeight,
	buildGallery,
	buildSlideshow,
	slideshowChangeSlide,
	removeQueryStringFromImageSources,
} from "./includes/image";
import {
	insertElementNextToAnchorNode,
	insertElementBeforeSelectionAnchor,
	insertElementAfterSelectionAnchor,
	annotate,
	wrapAnchorNodeInTag,
	deselect,
	makeAnchorNodePlainText,
} from "./includes/selection";
import {
	getMetadata,
	appendMetadata
} from "./includes/metadata";
import {
	makeClassSelector,
	getTimestamp,
	selectRandom,
	toNumber,
	getUniqueClassNames,
	makeIdSelector,
	zeroPad,
	getViewportSize,
	getViewportHeight,
	forAll,
	arrayToString,
} from "./includes/misc";
import {
	toggleVideoFilter,
	disableVideoFilter,
	nextVideoFilter,
	previousVideoFilter,
	addVideoFilter,
	applyVideoFilter,
} from "./includes/videoFilter";
import {
	toggleMutationObserver
} from "./includes/mutations";
import {
	fixLineBreaks,
	joinByBrs,
	convertLineBreaksToBrs,
	makeParagraphsByLineBreaks,
	splitByBrs,
	replaceBrs,
	replaceDiacritics,
	replaceSpecialCharacters,
	fixBullets,
	removePeriodsFromAbbreviations,
	singleQuotesToDoubleQuotes,
	invertItalics,
	italicizeSelection,
	makeAllTextLowerCase,
	removeEmojis,
	deleteNonEnglishText,
	normalizeAllWhitespace,
	boldInlineColonHeadings,
	fixDashes,
	toggleDashes,
	removeAllEmphasis,
} from "./includes/text";
import {
	createElement,
	createElementWithText,
	createElementWithChildren,
	setAttributeOrProperty,
	removeColorsFromInlineStyles,
	wrapElement,
	wrapElementInner,
	wrapAll,
	wrapAllInner,
	unwrapAll,
	unwrapAllExcept,
	unwrapElement,
	convertToFragment,
	copyAttribute,
	setAttributeOf,
	removeAttributeOf,
	removeAllAttributesOfType,
	removeAllAttributesOfTypes,
	getAttributes,
	saveIdsToElement,
	removeAllAttributesOf,
	removeAllAttributesExcept,
	wrapElementInLayers,
	deleteClass,
	makeElementPlainText,
	getAlphanumericTextLength,
	emptyElement,
	createSelector,
	createClassSelector,
	toggleClass,
	cycleClass,
	getElemPropSafe,
	makePlainText,
	createReplacementElement,
} from "./includes/element";
import {
	getTextLength,
	getNodeText
} from "./includes/node";
import {
	rescueOrphanedInlineElements,
	rescueOrphanedTextNodes,
	createListsFromBulletedParagraphs,
	replaceFontTags,
	fixParagraphs,
	normaliseWhitespaceForParagraphs,
	replaceEmptyParagraphsWithHr,
} from "./includes/fixBrokenHtml";
import { cycleFocusOverFormFields, focusButton } from "./includes/form";
import {
	changePageByUrl,
	changePage,
	cycleThroughDocumentHeadings,
	goToNextElement,
	goToPrevElement,
	goToLastElement,
} from "./includes/navigate";
import {
	deleteMarkedElements,
	deleteIframes,
	deleteImages,
	deleteEmptyTextNodes,
	deleteEmptyElements,
	deleteEmptyHeadings,
	deleteEmptyBlockElements,
	delRange,
	deleteNodesBeforeAnchorNode,
	deleteNodesAfterAnchorNode,
	deleteNodesRelativeToAnchorNode,
	deleteNodesByRelativePosition,
	deleteNodesBySelectorAndRelativePosition,
	deletePrecedingNodesBySelector,
	deleteFollowingNodesBySelector,
	markNodesBetweenMarkers,
	deleteNodesBetweenMarkers,
	deleteResources,
	deleteBySelectorAndTextMatching,
	deleteBySelectorAndTextNotMatching,
	deleteBySelectorAndText,
	deleteBySelectorAndExactText,
	deleteBySelectorAndRegex,
	deleteElements,
	deleteByClassOrIdContaining,
} from "./includes/delete";
import {
	swapElementPositions,
	moveElementUp,
	makeChildOf,
	toggleContentEditable,
	makeUL,
	makeOL,
	makeList,
	insertHrBeforeAll,
	insertBefore,
	insertAfter,
	insertAsFirstChild,
	insertAsLastChild,
	insertAroundAll,
	insertSpacesAround,
	replaceClass,
	moveDataTestIdToClassName,
	replaceInClassNames,
	mapIdsToClasses,
	duplicateMarkedElement,
} from "./includes/dom";
import { findStringsInProximity } from "./includes/proximitySearch";
import { generateTableOfContents, inlineFootnotes } from "./includes/ebook";
import { highlightCode } from "./includes/code";
import { toggleBlockEditMode } from "./includes/blockEdit";
import {
	logout,
	showPrintLink,
	getCurrentlyPlayingVideo,
	toggleNonVideoContent,
	hideNonVideoContent,
	unhideNonVideoContent,
	makeButtonsReadable,
	toggleViewVideoMode,
	showPassword,
	echoPassword,
	getPageNavLinks,
	createPagerFromSelect,
	highlightUserLinks,
} from "./includes/browse";
import {
	setGroupTagName,
	groupMarkedElements,
	groupAdjacentElements,
	makeDocumentHierarchical,
	groupUnderHeadings,
	groupUnderHeading,
} from "./includes/groupElements";
import {
	highlightInPres,
	highlightCodeInPreTextNodes,
	highlightCodePunctuation,
	highlightCodeStrings,
	highlightCodeKeywords,
	highlightCodeComments,
	highlightInTextNodes,
	highlightMatchesUnderSelector,
	highlightMatchesInElementRegex,
	highlightAllMatchesInDocument,
	highlightAllMatchesInDocumentCaseSensitive,
	highlightAllMatchesInDocumentRegex,
	toggleHighlight,
	moveLeadingAndTrailingReferencesOutOfHighlight,
	highlightSelectedElement,
	highlightLinksInPres,
	removeAllHighlights,
	removeHighlightsFromMarkedElements,
	highlightElements,
	toggleHighlightSelectionMode,
	stripTrailingReferenceNumber,
	expandSelectionToWordBoundaries,
	expandSelectionToSentenceBoundaries,
	highlightSelection,
	highlightTextInElement,
	highlightInElementTextNodes,
	highlightTextAcrossTags,
	highlightInTextNode,
	highlightAllStrings,
	highlightByTagNameAndText,
	highlightQuotes,
	highlightTableRows,
	highlightFirstParentByText,
	highlightAllTextNodesMatching,
	highlightBySelectorAndText,
	highlightLinksWithHrefContaining,
	cycleHighlightTag,
	resetHighlightTag,
} from "./includes/highlight";
import {
	hasClassesContaining,
	hasClassesStartingWith,
	containsPlainTextNodes,
	containsNonEmptyPlainTextNodes,
	containsOnlyPlainText,
	hasAdjacentBlockElement,
	isBlockElement,
	isEmptyTextNode,
	hasDirectChildrenOfType,
} from "./includes/elementAndNodeTests";
import {
	traceLineage,
	showHtmlComments,
	numberTableRowsAndColumns,
	renderResourceInfo,
	deleteResource,
	showImageCount,
	showIframeCount,
	showScripts,
	showExternalStyles,
	showInlineStyles,
	showHtmlTextRatio,
	showResources,
	inspect,
	showAttributes,
	toggleShowSelectors,
	showSelectors,
	showTags,
	listSelectorsWithLightBackgrounds,
	setClassByDepth,
	numberDivs,
	getAllClassesFor,
	getClassCounts,
	getMarkedHTML,
	countReferencesToId,
} from "./includes/inspect";
import {
	joinAdjacentElements,
	joinParagraphsByLastChar,
	joinNodesContainingSelection,
	joinMarkedElements,
	joinElements,
} from "./includes/joinElements";
import {
	markElements,
	unmarkElements,
	getMarkedElements,
	getFirstMarkedElement,
	forAllMarked,
	unmarkFromBeginningOrEnd,
	unmarkFromBeginning,
	unmarkFromEnd,
	modifyMark,
	markByCssRule,
	markBySelector,
	markBySelectorAndText,
	markBySelectorAndRegex,
	markByTagNameAndText,
	markElementsWithSetWidths,
	markNavigationalLists,
	markSelectionAnchorNode,
	showMarkedElementInfo,
	markUppercaseElements,
	markNumericElements,
	markElementsWithSameClass,
	unmarkAll,
	xPathMark,
} from "./includes/mark";
import {
	replaceElementsByTagNameMatching,
	replaceElementsBySelectorHelper,
	replaceElementsBySelector,
	convertElement,
	cloneElement ,
	replaceElement,
	replaceElementKeepingId,
	replaceElementsOfMarkedTypeWith,
	replaceElements,
	replaceMarkedElements,
	replaceByClassOrIdContaining,
	replaceNonStandardElements,
	replaceTables,
	replaceMarkedWithTextElement,
	replaceSelectedElement,
} from "./includes/replaceElements";
import {
	preReplaceBrs,
	preTabifySpaces,
	preSnakeCaseToCamelCase,
	preMakeDivsFromLineBreaks,
	preRemoveMultiLineBreaks
} from "./includes/preformatted";
import {
	parseQueryString,
	removeQueryParameterFromUrl,
	setQueryParameter,
	replaceQueryParameter,
	isCurrentDomainLink,
} from "./includes/url";
import {
	retrieve,
	retrieveGrouped,
	retrieveBySelectorAndText,
	retrieveElements,
} from "./includes/retrieve";

const noop = function(){};
let consoleLog = noop;
let consoleWarn = noop;
let consoleError = noop;

const isDebugMode = true;

const availableFunctions = {
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
	markElementsWithSameClass: markElementsWithSameClass,
	markElementsWithSetWidths: markElementsWithSetWidths,
	markNavigationalLists: markNavigationalLists,
	markNodesBetweenMarkers: markNodesBetweenMarkers,
	markNumericElements: markNumericElements,
	markUppercaseElements: markUppercaseElements,
	moveDataTestIdToClassName: moveDataTestIdToClassName,
	moveIdsFromSpans: moveIdsFromSpans,
	normaliseWhitespaceForParagraphs: normaliseWhitespaceForParagraphs,
	normalizeAllWhitespace: normalizeAllWhitespace,
	numberDivs: numberDivs,
	numberTableRowsAndColumns: numberTableRowsAndColumns,
	om: toggleMutationObserver,
	persistStreamingImages: persistStreamingImages,
	preMakeDivsFromLineBreaks: preMakeDivsFromLineBreaks,
	preRemoveMultiLineBreaks: preRemoveMultiLineBreaks,
	preReplaceBrs: preReplaceBrs,
	preSnakeCaseToCamelCase: preSnakeCaseToCamelCase,
	preTabifySpaces: preTabifySpaces,
	remove: remove,
	removeAllAttributesExcept: removeAllAttributesExcept,
	removeAllAttributesOf: removeAllAttributesOf,
	removeAllAttributesOfType: removeAllAttributesOfType,
	removeAllEmphasis: removeAllEmphasis,
	removeAllHighlights: removeAllHighlights,
	removeAllQueryParametersExcept: removeAllQueryParametersExcept,
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
	replaceInPreTextNodes: replaceInPreTextNodes,
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
	setBodyOpacity: setBodyOpacity,
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
	showTags: showTags,
	showVersion: showVersion,
	simplifyClassNames: simplifyClassNames,
	singleQuotesToDoubleQuotes: singleQuotesToDoubleQuotes,
	splitByBrs: splitByBrs,
	swapElementPositions: swapElementPositions,
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
	unwrapAllExcept: unwrapAllExcept,
	wrapAll: wrapAll,
	wrapAllInner: wrapAllInner,
	wrapAnchorNodeInTag: wrapAnchorNodeInTag,
	xlog: xlog,
	xPathMark: xPathMark,
	ylog: ylog,
};

Nimbus.blockElementSelector = Object.keys(BLOCK_ELEMENTS).join();
Nimbus.availableFunctions = availableFunctions;

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

function showVersion()
{
	showMessageBig("Nimbus version " + Nimbus.version);
}

function cycleTheme()
{
	cycleClass(document.body, ["nimbusTheme1", "nimbusTheme3", "nimbusTheme2", "none"]);
	document.documentElement.className = document.body.className;
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

function markByClassOrIdContaining(str) { markElements(selectByClassOrIdContaining(str)); }

function setBodyOpacity(n)
{
	const styleId = "styleBodyOpacity";
	if(n >= 10) del("#" + styleId);
	else insertStyle(`body { opacity: ${n/10}; }`, styleId, true);
}

function showStatus(id, str)
{
	getOrCreate("h3", id).textContent = id + ": " + str;
}

function markBlockElementsContainingText(text)
{
	markElements(selectBlockElementsContainingText(text));
}

function setMarkerClass(str) { Nimbus.markerClass = str; }
function setReplacementTag1(tagName) { Nimbus.replacementTagName1 = tagName; }
function setReplacementTag2(tagName) { Nimbus.replacementTagName2 = tagName; }
function setItalicTag(tagName) { Nimbus.italicTag = tagName; }
function markBySelectorAndNormalizedText(selector, str) { markElements(selectBySelectorAndNormalizedText(selector, str)); }
function deleteBySelectorAndNormalizedText(selector, str) { del(selectBySelectorAndNormalizedText(selector, str)); }
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
	deleteMessage();
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
