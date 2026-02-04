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
//	Copyright (C) 2008-2026 Nimish Jha
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
import { KEYCODES, KEYCODES_REVERSE } from "./includes/keycodes";
import { SYMBOLS, BLOCK_ELEMENTS, INLINE_ELEMENTS } from "./includes/constants";
import { parseCommand, runCommand, callFunctionWithArgs } from "./includes/command";
import {
	count,
	del,
	filterNodesByAttributeContaining,
	filterNodesByAttributeExistence,
	filterNodesByAttributeMatching,
	filterNodesByAttributeNonExistence,
	filterNodesByAttributeNotContaining,
	filterNodesByAttributeNotEqualTo,
	filterNodesByAttributeValueGreaterThan,
	filterNodesByAttributeValueLessThan,
	filterNodesFollowingNodesOfType,
	filterNodesPrecedingNodesOfType,
	filterNodesWithChildrenOfType,
	filterNodesWithDirectChildrenOfType,
	filterNodesWithFirstChildOfType,
	filterNodesWithLastChildOfType,
	filterNodesWithoutChildrenOfType,
	filterNodesWithoutDirectChildrenOfType,
	filterNodesWithoutParentOfType,
	filterNodesWithTextLengthOver,
	filterNodesWithTextLengthUnder,
	get,
	getFirstBlockParent,
	getFirstTextChild,
	getNodeContainingSelection,
	getNonCodeTextNodes,
	getOne,
	getOrCreate,
	getPreTextNodes,
	mark,
	markByChildrenHavingTheExactText,
	markElementsWithChildrenSpanning,
	remove,
	select,
	selectBlockElementsContainingText,
	selectByChildrenWithText,
	selectByClassOrIdContaining,
	selectByRelativePosition,
	selectBySelectorAndExactText,
	selectBySelectorAndNormalizedText,
	selectBySelectorAndRegex,
	selectBySelectorAndRelativePosition,
	selectBySelectorAndText,
	selectByTagNameAndText,
	selectByTagNameMatching,
	selectElementsEndingWithText,
	selectElementsStartingWithText,
	selectNodesBetweenMarkers,
} from "./includes/selectors";
import {
	getTextNodesUnderElement,
	getTextNodesUnderElementMatching,
	getTextNodesUnderSelector,
	getXpathResultAsArray,
	XpathNodesToArray,
	xPathSelect,
} from "./includes/xpath";
import {
	identifyClassCycle,
	identifyClassMark,
	identifyClassSetStyle,
	identifyClassSetup,
	identifyClassShowMarked,
	identifyClassTeardown,
} from "./includes/identifyClass";
import {
	forceReloadCss,
	getAllCssRulesForElement,
	getAllCssRulesMatching,
	getAllInlineStyles,
	insertStyle,
	insertStyleHighlight,
	insertStyleShowErrors,
	toggleNimbusStyles,
	toggleStyle,
	toggleStyleNegative,
	toggleWebsiteSpecificStyle,
} from "./includes/style";
import {
	editStyleById,
	toggleConsole,
} from "./includes/console";
import {
	addDateToTitle,
	capitalizeTitle,
	chooseDocumentHeading,
	cleanupAttributes,
	cleanupBarebone,
	cleanupDocument,
	cleanupHead,
	cleanupHeadings,
	cleanupLinks,
	cleanupStackOverflow,
	cleanupTitle,
	clearBootstrapClasses,
	deleteHtmlComments,
	deleteNonContentElements,
	deleteNonContentLinks,
	deleteNonContentLists,
	editDocumentTitle,
	fixBody,
	fixTextAroundReferences,
	getBestDomainSegment,
	getContentByParagraphCount,
	removeEventListeners,
	removeInlineStyles,
	removeRedundantDivs,
	removeRedundantHrs,
	removeSpanTags,
	removeUnnecessaryClasses,
	replaceAudio,
	convertClassesToCustomElements,
	replaceCommonClasses,
	replaceInlineStylesWithClasses,
	setDocTitle,
	setDocumentHeading,
	shortenIds,
	simplifyClassNames,
} from "./includes/cleanup";
import {
	autoCompleteInputBox,
	closeCustomPrompt,
	customPrompt,
	deleteMessage,
	getSelectionOrUserInput,
	restoreCustomPromptHistory,
	showMessage,
	showMessageBig,
	showMessageError,
	showPanel,
	showStatus,
} from "./includes/ui";
import { replaceInTextNodes, replaceInPreTextNodes, replaceInTextNodesRegex } from "./includes/textReplace";
import { toggleHighlightMap, setHighlightMapColor } from "./includes/highlightMapper";
import { getPrevious, getNext } from "./includes/array";
import { logPropertiesMatching, logValuesMatching } from "./includes/object";
import {
	capitalize,
	containsAllOfTheStrings,
	containsAnyOfTheStrings,
	escapeHTML,
	ltrim,
	normalizeHTML,
	normalizeString,
	normalizeWhitespace,
	padLeft,
	padRight,
	removeLineBreaks,
	removeNonAlpha,
	removeWhitespace,
	startsWithAnyOfTheStrings,
	trimAt,
	trimAtInclusive,
	trimBetween,
	trimNonAlphanumeric,
	trimSpecialChars,
	trimStartingAt,
	unescapeHTML,
} from "./includes/string";
import {
	createBackLink,
	createUniqueId,
	disableClickToCollectUrls,
	enableClickToCollectUrls,
	fixInternalReferences,
	humanizeUrl,
	isEmptyLink,
	logHrefsOnClick,
	makeFileLinksRelative,
	moveIdsFromSpans,
	numberNumericReferencesByInterlinkedGroup,
	removeAllQueryParametersExcept,
	removeQueryParameterFromLinks,
	removeQueryStringFromLinks,
	removeQueryStringFromLinksMatching,
	replaceEmptyAnchors,
	revealEmptyLinks,
	revealLinkAttributes,
	toggleShowEmptyLinksAndSpans,
} from "./includes/link";
import {
	debugVars,
	logAllClassesFor,
	logElements,
	logString,
	logTable,
	printPropOfObjectArray,
	printPropsContaining,
	showLog,
	xlog,
	ylog,
} from "./includes/log";
import {
	addLinksToLargerImages,
	buildGallery,
	buildSlideshow,
	deleteImageByNumber,
	deleteImagesSmallerThan,
	deletePersistedImages,
	deleteSmallImages,
	forceImageHeight,
	forceImageWidth,
	getBestImageSrc,
	getImageHeight,
	getImageWidth,
	toggleInvertImages,
	persistStreamingImages,
	removeQueryStringFromImageSources,
	replaceImagesWithTextLinks,
	retrieveLargeImages,
	setMinPersistSize,
	shortenImageSrc,
	showSavedStreamingImages,
	slideshowChangeSlide,
	tagLargeImages,
} from "./includes/image";
import {
	annotate,
	deselect,
	insertElementAfterSelectionAnchor,
	insertElementBeforeSelectionAnchor,
	insertElementNextToAnchorNode,
	makeAnchorNodePlainText,
	wrapAnchorNodeInTag,
} from "./includes/selection";
import {
	appendMetadata,
	getMetadata,
} from "./includes/metadata";
import {
	arrayToString,
	forAll,
	getTimestamp,
	getUniqueClassNames,
	getViewportHeight,
	getViewportSize,
	isChrome,
	isIframe,
	makeClassSelector,
	makeIdSelector,
	noop,
	selectRandom,
	toggleShowKeyCodes,
	toNumber,
	zeroPad,
} from "./includes/misc";
import {
	addVideoFilter,
	applyVideoFilter,
	disableVideoFilter,
	nextVideoFilter,
	previousVideoFilter,
	toggleVideoFilter,
} from "./includes/videoFilter";
import {
	toggleMutationObserver
} from "./includes/mutations";
import {
	boldInlineColonHeadings,
	convertLineBreaksToBrs,
	deleteNonEnglishText,
	disableHyphensToDashesOnClick,
	enableHyphensToDashesOnClick,
	fixBullets,
	fixDashes,
	fixLineBreaks,
	fixSpacesBetweenNestedQuotes,
	invertItalics,
	italicizeSelection,
	joinByBrs,
	makeTextLowerCase,
	makeParagraphsByLineBreaks,
	normalizeAllWhitespace,
	removeAllEmphasis,
	removeEmojis,
	removePeriodsFromAbbreviations,
	replaceBrs,
	replaceDiacritics,
	replaceSpecialCharacters,
	singleQuotesToDoubleQuotes,
	splitByBrs,
	toggleDashes,
} from "./includes/text";
import {
	convertToFragment,
	copyAttribute,
	createClassSelector,
	createElement,
	createElementWithChildren,
	createElementWithText,
	createReplacementElement,
	createSelector,
	cycleClass,
	deleteClass,
	emptyElement,
	getAlphanumericTextLength,
	getAttributes,
	getElemPropSafe,
	makeElementPlainText,
	makePlainText,
	removeAllAttributesExcept,
	removeAllAttributesOf,
	removeAllAttributesOfType,
	removeAllAttributesOfTypes,
	removeAttributeOf,
	removeColorsFromInlineStyles,
	saveIdsToElement,
	setAttributeOf,
	setAttributeOrProperty,
	toggleClass,
	unwrapAll,
	unwrapAllExcept,
	unwrapElement,
	wrapAll,
	wrapAllInner,
	wrapElement,
	wrapElementInLayers,
	wrapElementInner,
	wrapMarkedElement,
} from "./includes/element";
import {
	getNodeText,
	getTextLength,
} from "./includes/node";
import {
	createListsFromBulletedParagraphs,
	fixParagraphs,
	normaliseWhitespaceForParagraphs,
	replaceEmptyParagraphsWithHr,
	replaceFontTags,
	rescueOrphanedInlineElements,
	rescueOrphanedTextNodes,
} from "./includes/fixBrokenHtml";
import { cycleFocusOverFormFields, focusButton } from "./includes/form";
import {
	changePage,
	changePageByUrl,
	cycleThroughDocumentHeadings,
	goToLastElement,
	goToNextElement,
	goToPrevElement,
	setElementsToCycleThrough,
} from "./includes/navigate";
import {
	deleteByClassOrIdContaining,
	deleteBySelectorAndExactText,
	deleteBySelectorAndNormalizedText,
	deleteBySelectorAndRegex,
	deleteBySelectorAndText,
	deleteBySelectorAndTextMatching,
	deleteBySelectorAndTextNotMatching,
	deleteElements,
	deleteEmptyBlockElements,
	deleteEmptyElements,
	deleteEmptyHeadings,
	deleteEmptyTextNodes,
	deleteFollowingNodesBySelector,
	deleteIframes,
	deleteImages,
	deleteMarkedElements,
	deleteNodesAfterAnchorNode,
	deleteNodesBeforeAnchorNode,
	deleteNodesBetweenMarkers,
	deleteNodesByRelativePosition,
	deleteNodesBySelectorAndRelativePosition,
	deleteNodesRelativeToAnchorNode,
	deletePrecedingNodesBySelector,
	deleteResources,
	delRange,
	markNodesBetweenMarkers,
} from "./includes/delete";
import {
	annotateElement,
	duplicateMarkedElement,
	insertAfter,
	insertAroundAll,
	insertAsFirstChild,
	insertAsLastChild,
	insertBefore,
	insertHrBeforeAll,
	insertSpacesAround,
	makeChildOf,
	makeList,
	makeOL,
	makeUL,
	mapIdsToClasses,
	moveDataTestIdToClassName,
	moveIdToChild,
	moveElementUp,
	replaceClass,
	replaceInClassNames,
	swapElementPositions,
	toggleContentEditable,
} from "./includes/dom";
import { findStringsInProximity } from "./includes/proximitySearch";
import { generateTableOfContents, inlineFootnotes } from "./includes/ebook";
import { highlightCode } from "./includes/code";
import { toggleBlockEditMode } from "./includes/blockEdit";
import {
	createPagerFromSelect,
	cycleTheme,
	doWebsiteSpecificTasks,
	doWebsiteSpecificTasksInternal,
	echoPassword,
	getCurrentlyPlayingVideo,
	getPageNavLinks,
	hideNonVideoContent,
	hideReferences,
	highlightUserLinks,
	logout,
	makeButtonsReadable,
	setBodyOpacity,
	setTheme,
	showPassword,
	showPrintLink,
	toggleNonVideoContent,
	toggleViewVideoMode,
	unhideNonVideoContent,
} from "./includes/browse";
import {
	groupAdjacentElements,
	groupMarkedElements,
	groupUnderHeading,
	groupUnderHeadings,
	makeDocumentHierarchical,
	setGroupTagName,
} from "./includes/groupElements";
import {
	cycleHighlightTag,
	expandSelectionToSentenceBoundaries,
	expandSelectionToWordBoundaries,
	highlightAllMatchesInDocument,
	highlightAllMatchesInDocumentCaseSensitive,
	highlightAllMatchesInDocumentRegex,
	highlightAllMatchesInDocumentWithWordExpansion,
	highlightAllStrings,
	highlightAllTextNodesMatching,
	highlightBySelectorAndText,
	highlightByTagNameAndText,
	highlightCodeComments,
	highlightCodeInPreTextNodes,
	highlightCodeKeywords,
	highlightCodePunctuation,
	highlightCodeStrings,
	highlightElements,
	highlightFirstParentByText,
	highlightInElementTextNodes,
	highlightInPres,
	highlightInTextNode,
	highlightInTextNodes,
	highlightLinksInPres,
	highlightLinksWithHrefContaining,
	highlightMatchesInElementRegex,
	highlightMatchesUnderSelector,
	highlightOnMutation,
	highlightQuotes,
	highlightSelectedElement,
	unhighlightSelectedElement,
	highlightSelection,
	highlightTableRows,
	highlightTextAcrossTags,
	highlightTextInElement,
	moveLeadingAndTrailingReferencesOutOfHighlight,
	removeAllHighlights,
	removeHighlightsFromMarkedElements,
	resetHighlightTag,
	setHighlightTag,
	toggleHighlight,
	toggleHighlightSelectionMode,
} from "./includes/highlight";
import {
	containsNonEmptyPlainTextNodes,
	containsOnlyPlainText,
	containsPlainTextNodes,
	hasAdjacentBlockElement,
	hasClassesContaining,
	hasClassesStartingWith,
	hasDirectChildrenOfType,
	isBlockElement,
	isEmptyTextNode,
} from "./includes/elementAndNodeTests";
import {
	countReferencesToId,
	deleteResource,
	getAllClassesFor,
	getClassCounts,
	getMarkedHTML,
	inspect,
	listSelectorsWithLightBackgrounds,
	numberDivs,
	numberTableRowsAndColumns,
	renderResourceInfo,
	setClassByDepth,
	showAttributes,
	showExternalStyles,
	showHtmlComments,
	showHtmlTextRatio,
	showIframeCount,
	showImageCount,
	showInlineStyles,
	showResources,
	showScripts,
	showSelectors,
	showTags,
	toggleShowSelectors,
	traceLineage,
} from "./includes/inspect";
import {
	joinAdjacentElements,
	joinElements,
	joinMarkedElements,
	joinNodesContainingSelection,
	joinParagraphsByLastChar,
} from "./includes/joinElements";
import {
	forAllMarked,
	getFirstMarkedElement,
	getMarkedElements,
	markAllFollowingSiblings,
	markBlockElementsContainingText,
	markByClassOrIdContaining,
	markByCssRule,
	markBySelector,
	markBySelectorAndNormalizedText,
	markBySelectorAndRegex,
	markBySelectorAndText,
	markByTagNameAndText,
	markElements,
	markElementsWithSameClass,
	markNavigationalLists,
	markNumericElements,
	markSelectionAnchorNode,
	markUppercaseElements,
	modifyMark,
	setMarkerClass,
	showMarkedElementInfo,
	unmarkAll,
	unmarkElements,
	unmarkFromBeginning,
	unmarkFromBeginningOrEnd,
	unmarkFromEnd,
	xPathMark,
} from "./includes/mark";
import {
	convertDivsToParagraphs,
	convertElement,
	replaceByClassOrIdContaining,
	replaceElement,
	replaceElementKeepingId,
	replaceElements,
	replaceElementsBySelector,
	replaceElementsBySelectorHelper,
	replaceElementsByTagNameMatching,
	replaceElementsOfMarkedTypeWith,
	replaceMarkedElements,
	replaceMarkedWithTextElement,
	replaceNonStandardElements,
	replaceSelectedElement,
	replaceTables,
	setItalicTag,
	setReplacementTag1,
	setReplacementTag2,
} from "./includes/replaceElements";
import {
	preMakeDivsFromLineBreaks,
	preRemoveMultiLineBreaks,
	preReplaceBrs,
	preSnakeCaseToCamelCase,
	preTabifySpaces,
} from "./includes/preformatted";
import {
	isCurrentDomainLink,
	parseQueryString,
	removeQueryParameterFromUrl,
	replaceQueryParameter,
	setQueryParameter,
} from "./includes/url";
import {
	retrieve,
	retrieveBySelectorAndText,
	retrieveElements,
	retrieveGrouped,
} from "./includes/retrieve";
import {
	keyMenuOptionsByKey
} from "./includes/keyMenu.js";

const isDebugMode = true;

const availableFunctions = {
	addDateToTitle: addDateToTitle,
	addLinksToLargerImages: addLinksToLargerImages,
	annotate: annotate,
	annotateElement: annotateElement,
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
	convertClassesToCustomElements: convertClassesToCustomElements,
	convertDivsToParagraphs: convertDivsToParagraphs,
	convertLineBreaksToBrs: convertLineBreaksToBrs,
	copyAttribute: copyAttribute,
	count: count,
	createListsFromBulletedParagraphs: createListsFromBulletedParagraphs,
	cycleFocusOverFormFields: cycleFocusOverFormFields,
	cycleThroughDocumentHeadings: cycleThroughDocumentHeadings,
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
	enableHyphensToDashesOnClick: enableHyphensToDashesOnClick,
	disableHyphensToDashesOnClick: disableHyphensToDashesOnClick,
	findStringsInProximity: findStringsInProximity,
	fixBody: fixBody,
	fixBullets: fixBullets,
	fixDashes: fixDashes,
	fixInternalReferences: fixInternalReferences,
	fixLineBreaks: fixLineBreaks,
	fixParagraphs: fixParagraphs,
	fixSpacesBetweenNestedQuotes: fixSpacesBetweenNestedQuotes,
	fixTextAroundReferences: fixTextAroundReferences,
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
	hideReferences: hideReferences,
	highlightAllMatchesInDocument: highlightAllMatchesInDocument,
	highlightAllMatchesInDocumentRegex: highlightAllMatchesInDocumentRegex,
	highlightAllMatchesInDocumentWithWordExpansion: highlightAllMatchesInDocumentWithWordExpansion,
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
	highlightOnMutation: highlightOnMutation,
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
	insertSpacesAround: insertSpacesAround,
	inspect: inspect,
	iw: forceImageWidth,
	joinAdjacentElements: joinAdjacentElements,
	joinByBrs: joinByBrs,
	joinMarkedElements: joinMarkedElements,
	joinParagraphsByLastChar: joinParagraphsByLastChar,
	listSelectorsWithLightBackgrounds: listSelectorsWithLightBackgrounds,
	logAllClassesFor: logAllClassesFor,
	makeTextLowerCase: makeTextLowerCase,
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
	markAllFollowingSiblings: markAllFollowingSiblings,
	markBlockElementsContainingText: markBlockElementsContainingText,
	markByChildrenHavingTheExactText: markByChildrenHavingTheExactText,
	markByCssRule: markByCssRule,
	markBySelector: markBySelector,
	markBySelectorAndNormalizedText: markBySelectorAndNormalizedText,
	markBySelectorAndRegex: markBySelectorAndRegex,
	markByTagNameAndText: markByTagNameAndText,
	markElementsWithChildrenSpanning: markElementsWithChildrenSpanning,
	markElementsWithSameClass: markElementsWithSameClass,
	markNavigationalLists: markNavigationalLists,
	markNodesBetweenMarkers: markNodesBetweenMarkers,
	markNumericElements: markNumericElements,
	markUppercaseElements: markUppercaseElements,
	moveDataTestIdToClassName: moveDataTestIdToClassName,
	moveIdsFromSpans: moveIdsFromSpans,
	moveIdToChild: moveIdToChild,
	normaliseWhitespaceForParagraphs: normaliseWhitespaceForParagraphs,
	normalizeAllWhitespace: normalizeAllWhitespace,
	numberDivs: numberDivs,
	numberNumericReferencesByInterlinkedGroup: numberNumericReferencesByInterlinkedGroup,
	numberTableRowsAndColumns: numberTableRowsAndColumns,
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
	rrd: removeRedundantDivs,
	rrh: removeRedundantHrs,
	removeSpanTags: removeSpanTags,
	removeUnnecessaryClasses: removeUnnecessaryClasses,
	replaceAudio: replaceAudio,
	replaceBrs: replaceBrs,
	replaceByClassOrIdContaining: replaceByClassOrIdContaining,
	replaceClass: replaceClass,
	replaceCommonClasses: replaceCommonClasses,
	replaceDiacritics: replaceDiacritics,
	replaceElementsBySelector: replaceElementsBySelector,
	replaceElementsOfMarkedTypeWith: replaceElementsOfMarkedTypeWith,
	replaceEmptyAnchors: replaceEmptyAnchors,
	replaceEmptyParagraphsWithHr: replaceEmptyParagraphsWithHr,
	replaceFontTags: replaceFontTags,
	replaceImagesWithTextLinks: replaceImagesWithTextLinks,
	replaceInClassNames: replaceInClassNames,
	replaceInlineStylesWithClasses: replaceInlineStylesWithClasses,
	replaceInTextNodes: replaceInTextNodes,
	replaceInPreTextNodes: replaceInPreTextNodes,
	replaceMarkedElements: replaceMarkedElements,
	replaceMarkedWithTextElement: replaceMarkedWithTextElement,
	replaceNonStandardElements: replaceNonStandardElements,
	replaceQueryParameter: replaceQueryParameter,
	replaceTables: replaceTables,
	rescueOrphanedInlineElements: rescueOrphanedInlineElements,
	rescueOrphanedTextNodes: rescueOrphanedTextNodes,
	retrieve: retrieve,
	retrieveBySelectorAndText: retrieveBySelectorAndText,
	retrieveLargeImages: retrieveLargeImages,
	revealEmptyLinks: revealEmptyLinks,
	revealLinkAttributes: revealLinkAttributes,
	selectElementsEndingWithText: selectElementsEndingWithText,
	selectElementsStartingWithText: selectElementsStartingWithText,
	setAttributeOf: setAttributeOf,
	setBodyOpacity: setBodyOpacity,
	setClassByDepth: setClassByDepth,
	setDocTitle: setDocTitle,
	setElementsToCycleThrough: setElementsToCycleThrough,
	setGroupTagName: setGroupTagName,
	setItalicTag: setItalicTag,
	setMarkerClass: setMarkerClass,
	setMinPersistSize: setMinPersistSize,
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
	toggleNimbusStyles: toggleNimbusStyles,
	unhideNonVideoContent: unhideNonVideoContent,
	unhighlightAll: removeAllHighlights,
	unmarkFromBeginning: unmarkFromBeginning,
	unmarkFromEnd: unmarkFromEnd,
	unwrapAll: unwrapAll,
	unwrapAllExcept: unwrapAllExcept,
	uwa: unwrapAll,
	uwe: unwrapAllExcept,
	wrapAll: wrapAll,
	wrapAllInner: wrapAllInner,
	wrapAnchorNodeInTag: wrapAnchorNodeInTag,
	xlog: xlog,
	xPathMark: xPathMark,
	ylog: ylog,
};

const consoleFunctions = [
	del,
	insertStyle,
	logPropertiesMatching,
	logValuesMatching,
	setHighlightMapColor,
	showMessage,
	showMessageBig,
	showMessageError,
	trimAt,
	trimAtInclusive,
	trimBetween,
	trimNonAlphanumeric,
	trimSpecialChars,
	trimStartingAt,
];

Nimbus.blockElementSelector = Object.keys(BLOCK_ELEMENTS).join();
Nimbus.availableFunctions = availableFunctions;
Nimbus.consoleFunctions = consoleFunctions;

function enableConsoleLogs()
{
	Nimbus.consoleLog = window.console.log;
	Nimbus.consoleWarn = window.console.warn;
	Nimbus.consoleError = window.console.error;
}

function disableConsoleLogs()
{
	Nimbus.consoleLog = noop;
	Nimbus.consoleWarn = noop;
	Nimbus.consoleError = noop;
}

function showVersion()
{
	showMessageBig("Nimbus version " + Nimbus.version);
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

//
//
//

function disableKeyMenu()
{
	document.removeEventListener("keydown", handleKeyMenu, false);
	Nimbus.keyMenu.isActive = false;
}

function handleKeyMenuCommand(str)
{
	if(!(typeof str === "string" && str.length === 2))
	{
		showMessageBig("Invalid command: " + str);
		return;
	}

	deleteMessage();

	if(str[1] === ".")
	{
		showKeyMenuOptions(str[0]);
		Nimbus.keyMenu.keys = [str[0]];
	}
	else
	{
		switch(str)
		{
			case "AB": setTheme("nimbusThemeBlack"); break;
			case "AD": setTheme("nimbusThemeDimGrey"); break;
			case "AL": setTheme("nimbusThemeHideLinks"); break;
			case "AN": setTheme("none"); break;
			case "AR": setTheme("nimbusThemeRed"); break;
			case "AS": setTheme("nimbusThemeSepia"); break;

			case "BK": toggleShowKeyCodes(); break;

			case "CB": cleanupBarebone(); break;
			case "CC": getContentByParagraphCount(); break;
			case "CD": cleanupDocument(); break;
			case "CJ": toggleConsole("js"); break;
			case "CS": toggleConsole("css"); break;
			case "CO": makeOL(); break;
			case "CT": capitalizeTitle(); break;
			case "CU": makeUL(); break;

			case "DA": deleteNodesAfterAnchorNode(); break;
			case "DB": deleteNodesBeforeAnchorNode(); break;
			case "DC": callFunctionWithArgs("Delete class", deleteClass, 1); break;
			case "DE": callFunctionWithArgs("Delete elements (optionally containing text)", deleteBySelectorAndTextMatching); break;
			case "DF": deleteIframes(); break;
			case "DI": deleteImages(); break;
			case "DJ": removeEmojis(); break;
			case "DN": deleteNonContentElements(); break;
			case "DP": callFunctionWithArgs("Delete elements with class or id containing text", deleteByClassOrIdContaining); break;
			case "DR": deleteResources(); break;
			case "DT": callFunctionWithArgs("Delete elements not containing text", deleteBySelectorAndTextNotMatching, 2); break;
			case "DY": deleteEmptyBlockElements(); break;

			case "ET": editDocumentTitle(); break;

			case "FD": fixDashes(); break;
			case "FP": fixParagraphs(); break;
			case "FR": fixTextAroundReferences(); break;

			case "HA": getSelectionOrUserInput("Highlight all occurrences of string", highlightAllMatchesInDocument, true); break;
			case "HE": callFunctionWithArgs("Highlight elements by tag name containing text", highlightByTagNameAndText, 2); break;
			case "HC": callFunctionWithArgs("Set highlight map color", setHighlightMapColor, 2); break;
			case "HP": highlightCode(true); break;
			case "HR": removeAllHighlights(); break;
			case "HS": getSelectionOrUserInput("Highlight all occurrences of string (case-sensitive)", highlightAllMatchesInDocumentCaseSensitive, true); break;
			case "HT": customPrompt("Highlight all text nodes matching").then(highlightAllTextNodesMatching); break;
			case "HW": callFunctionWithArgs("Highlight all matches with word expansion", highlightAllMatchesInDocumentWithWordExpansion, 1); break;

			case "LI": retrieveLargeImages(); break;

			case "MC": markElementsWithSameClass(); break;
			case "MP": callFunctionWithArgs("Mark elements by class or id containing text", markByClassOrIdContaining, 1); break;
			case "MS": callFunctionWithArgs("Mark elements by selector and containing text", markBySelectorAndText, 2); break;
			case "MU": unmarkAll(); break;
			case "MX": customPrompt("Mark by xPath").then(xPathMark); break;
			case "M1": toggleHighlightMap(3, 0, 3); break;
			case "M2": toggleHighlightMap(4, 0, 4); break;
			case "M3": toggleHighlightMap(4, 1, 4); break;
			case "M4": toggleHighlightMap(4, 1, 20); break;

			case "PT": callFunctionWithArgs("Make plain text", makePlainText, 1); break;

			case "RB": replaceBrs(); break;
			case "RE": replaceElementsBySelectorHelper(); break;
			case "RM": callFunctionWithArgs("Replace marked element with element containing text", replaceMarkedWithTextElement, 2, "h2 "); break;
			case "RS": replaceSpecialCharacters(); break;
			case "RT": replaceTables(); break;

			case "TX": deleteNonEnglishText(); makeTextLowerCase(); break;
			case "TL": makeTextLowerCase(); break;

			case "UA": callFunctionWithArgs("Unwrap all", unwrapAll, 1); break;
			case "UE": callFunctionWithArgs("Unwrap all except", unwrapAllExcept, 1); break;
			case "UM": unwrapAll(".markd"); break;

			case "VB": cleanupBarebone(); break;
			case "VC": simplifyClassNames(); break;
			case "VD": removeRedundantDivs(); break;
			case "VH": removeRedundantHrs(); break;
			case "VI": shortenIds(); break;
			case "VU": removeUnnecessaryClasses(); break;

			case "WA": callFunctionWithArgs("Wrap all", wrapAll, 2); break;
			case "WI": callFunctionWithArgs("Wrap all inner", wrapAllInner, 2); break;

			case "YF": toggleStyle(STYLES.FONT_01, "styleFont01", true); break;
			case "YH": insertStyleHighlight(); break;
			case "YI": toggleStyle(STYLES.INVERT_IMAGES, "styleInvertImages", true); break;
			case "YL": toggleStyle(STYLES.INDICATE_LINK_ATTRIBUTES, "styleIndicateLinkAttributes", true); break;
			case "YN": toggleStyleNegative(); break;
			case "YO": toggleStyle(STYLES.OUTLINE_ELEMENTS, "styleOutlineElements", true); break;
			case "YS": toggleStyle(STYLES.SHOW_SELECTORS, "styleShowSelectors", true); break;

			case "ZB": setHighlightTag("markblue"); break;
			case "ZG": setHighlightTag("markgreen"); break;
			case "ZM": setHighlightTag("mark"); break;
			case "ZP": setHighlightTag("markpurple"); break;
			case "ZR": setHighlightTag("markred"); break;
			case "ZW": setHighlightTag("markwhite"); break;
			case "ZY": setHighlightTag("markyellow"); break;

			default: showMessageBig(`Unknown command ${str}`);
		}
	}

	if(Nimbus.keyMenu.shouldExitMenuModeAfterCommand)
		disableKeyMenu();
}

function showKeyMenuOptions(key)
{
	const options = keyMenuOptionsByKey[key];
	if(options)
		showPanel(options);
	else
		showMessageBig(`No commands starting with ${key}`);
}

function handleKeyMenu(evt)
{
	const ctrlOrMeta = ~navigator.userAgent.indexOf("Macintosh") ? "metaKey" : "ctrlKey";
	if(evt.altKey || evt.shiftKey || evt[ctrlOrMeta])
		return;
	if(evt.keyCode === KEYCODES.ESCAPE)
	{
		Nimbus.keyMenu.keys = [];
		toggleKeyMenu();
		deleteMessage();
		return;
	}
	if(!((evt.keyCode > 47 && evt.keyCode < 91) || evt.keyCode === 190))
		return;

	evt.preventDefault();
	const key = KEYCODES_REVERSE[evt.keyCode.toString()];
	Nimbus.keyMenu.keys.push(key);
	if(Nimbus.keyMenu.keys.length === 2)
	{
		handleKeyMenuCommand(Nimbus.keyMenu.keys.join(""));
		Nimbus.keyMenu.keys = [];
	}
	else
	{
		showMessageBig(Nimbus.keyMenu.keys[0], true);
	}
}

function toggleKeyMenu(firstKey)
{
	if(Nimbus.keyMenu.isActive)
	{
		document.removeEventListener("keydown", handleKeyMenu, false);
		Nimbus.keyMenu.keys = [];
		Nimbus.keyMenu.isActive = false;
		showMessageBig("Key menu disabled");
	}
	else
	{
		if(firstKey)
		{
			Nimbus.keyMenu.shouldExitMenuModeAfterCommand = true;
			Nimbus.keyMenu.keys = [firstKey];
			showMessageBig(firstKey, true);
		}
		else
		{
			Nimbus.keyMenu.shouldExitMenuModeAfterCommand = false;
			showMessageBig("Key menu enabled");
		}

		document.addEventListener("keydown", handleKeyMenu, false);
		Nimbus.keyMenu.isActive = true;
	}
}

//
//
//

function handleKeyDown(e)
{
	let shouldPreventDefault = true;
	const ctrlOrMeta = ~navigator.userAgent.indexOf("Macintosh") ? "metaKey" : "ctrlKey";
	if(!(e.altKey || e.shiftKey || e[ctrlOrMeta]))
	{
		if(e.keyCode === KEYCODES.F1 || e.keyCode === KEYCODES.F2)
			toggleKeyMenu();
		else if(e.keyCode === KEYCODES.ESCAPE)
			deleteMessage();
		if(Nimbus.showKeyCodes)
			console.log(e.keyCode);

		return;
	}

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
			case KEYCODES.NUMPAD1: simplifyClassNames(); break;
			case KEYCODES.NUMPAD2: shortenIds(); break;
			case KEYCODES.NUMPAD3: removeRedundantDivs(); break;
			case KEYCODES.NUMPAD4: forceReloadCss(); break;
			case KEYCODES.NUMPAD5: toggleHighlightMap(3, 0, 3); break;
			case KEYCODES.NUMPAD6: showMessageBig("Unbound"); break;
			case KEYCODES.NUMPAD7: groupMarkedElements(Nimbus.GROUP_TAGNAME); break;
			case KEYCODES.NUMPAD8: showMessageBig("Unbound"); break;
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
			case KEYCODES.SIX: showMessageBig("Unbound"); break;
			case KEYCODES.SEVEN: showMessageBig("Unbound"); break;
			case KEYCODES.EIGHT: toggleBlockEditMode(); break;
			case KEYCODES.NINE: removeAllAttributesOfTypes(["class", "style", "align"]); unwrapAll("span"); break;
			case KEYCODES.ZERO: cycleThroughDocumentHeadings(); break;
			case KEYCODES.A: toggleKeyMenu("A"); break;
			case KEYCODES.B: toggleKeyMenu("B"); break;
			case KEYCODES.C: toggleKeyMenu("C"); break;
			case KEYCODES.D: toggleKeyMenu("D"); break;
			case KEYCODES.E: cycleHighlightTag(); break;
			case KEYCODES.F: toggleKeyMenu("F"); break;
			case KEYCODES.G: callFunctionWithArgs("Delete elements (optionally containing text)", deleteBySelectorAndTextMatching); break;
			case KEYCODES.H: toggleKeyMenu("H"); break;
			case KEYCODES.I: toggleConsole("css"); break;
			case KEYCODES.J: toggleKeyMenu("J"); break;
			case KEYCODES.K: toggleConsole("js"); break;
			case KEYCODES.L: toggleKeyMenu("L"); break;
			case KEYCODES.M: toggleKeyMenu("M"); break;
			case KEYCODES.N: toggleKeyMenu("N"); break;
			case KEYCODES.O: getSelectionOrUserInput("Highlight all occurrences of string", highlightAllMatchesInDocument, true); break;
			case KEYCODES.P: toggleKeyMenu("P"); break;
			case KEYCODES.Q: resetHighlightTag(); Nimbus.selectionHighlightMode = "sentence"; break;
			case KEYCODES.R: toggleHighlight(); break;
			case KEYCODES.S: toggleContentEditable(); break;
			case KEYCODES.T: toggleKeyMenu("T"); break;
			case KEYCODES.U: toggleKeyMenu("U"); break;
			case KEYCODES.V: toggleKeyMenu("V"); break;
			case KEYCODES.W: highlightSelection("word"); break;
			case KEYCODES.X: joinNodesContainingSelection(); break;
			case KEYCODES.Y: toggleKeyMenu("Y"); break;
			case KEYCODES.Z: toggleKeyMenu("Z"); break;
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
			case KEYCODES.I: toggleInvertImages(); break;
			case KEYCODES.J: joinMarkedElements(); break;
			case KEYCODES.K: makeChildOf(); break;
			case KEYCODES.L: logout(); break;
			case KEYCODES.M: toggleMutationObserver(true); break;
			case KEYCODES.N: callFunctionWithArgs("Delete numbered divs in range", delRange); break;
			case KEYCODES.O: getSelectionOrUserInput("Highlight all occurrences of string (case-sensitive)", highlightAllMatchesInDocumentCaseSensitive, true); break;
			case KEYCODES.P: getPageNavLinks(); break;
			case KEYCODES.R: unhighlightSelectedElement(); break;
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
			case KEYCODES.C: getContentByParagraphCount(); break;
			case KEYCODES.E: replaceElementsBySelectorHelper(); break;
			case KEYCODES.F: del(["object", "embed", "video", "iframe"]); break;
			case KEYCODES.G: callFunctionWithArgs("Delete elements with class or id containing the string", deleteByClassOrIdContaining); break;
			case KEYCODES.H: callFunctionWithArgs("Mark elements by selector", markBySelector, 1); break;
			case KEYCODES.I: toggleStyle(STYLES.INVERT_IMAGES, "styleInvertImages", true); break;
			case KEYCODES.J: deleteNodesBeforeAnchorNode(); break;
			case KEYCODES.K: deleteNodesAfterAnchorNode(); break;
			case KEYCODES.L: deleteNodesBetweenMarkers(); break;
			case KEYCODES.M: Nimbus.autoCompleteCommandPrompt.open(); break;
			case KEYCODES.N: toggleStyle(STYLES.INDICATE_LINK_ATTRIBUTES, "styleShowIdsAndHrefs", true); break;
			case KEYCODES.O: customPrompt("Highlight all text nodes matching").then(highlightAllTextNodesMatching); break;
			case KEYCODES.P: makeAnchorNodePlainText(); break;
			case KEYCODES.R: toggleKeyMenu("R"); break;
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
			case KEYCODES.BACKSPACE: identifyClassTeardown(); break;
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
