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
import { SYMBOLS, BLOCK_TAGS } from "./includes/constants";
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
	getOneMarked,
	getFirstTextChild,
	getNodeContainingSelection,
	getNonCodeTextNodes,
	getOne,
	getOrCreate,
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
	selectImagesSmallerThan,
	selectNodesBetweenMarkers,
} from "./includes/selectors";
import {
	getEmptyTextNodesUnderElement,
	getTextNodesUnderElement,
	getTextNodesUnderElementMatching,
	getTextNodesUnderPre,
	getTextNodesUnderSelector,
	getXpathResultAsArray,
	xPathNodesToArray,
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
	cleanupLinks,
	cleanupStackOverflow,
	cleanupTitle,
	clearBootstrapClasses,
	cloneBody,
	convertClassesToCustomElements,
	createHeadingsFromLinks,
	deleteHtmlComments,
	deleteIndexSection,
	deleteNonContentElements,
	deleteNonContentLinks,
	deleteNonContentLists,
	editDocumentTitle,
	fixBody,
	fixTextAroundReferences,
	fixTextWithinReferences,
	getBestDomainSegment,
	getContentByParagraphCount,
	normalizeClassnames,
	removeEventListeners,
	removeInlineStyles,
	removeNestedDuplicates,
	removeRedundantDivs,
	removeRedundantBrs,
	removeRedundantHrs,
	removeSpanTags,
	removeUnnecessaryClasses,
	removeUnnecessarySpans,
	replaceAudio,
	replaceBrs,
	replaceCommonClasses,
	replaceCommonClassesNew,
	replaceInlineStylesWithClasses,
	replaceSmallCapsWithLowercase,
	setDocTitle,
	setDocTitleFromURL,
	setDocumentHeading,
	shortenIDs,
	simplifyClassNames,
	splitByBrs,
	splitElementsByChildren,
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
import { replaceInTextNodes, replaceInTextNodesUnder, replaceInTextNodesRegex } from "./includes/textReplace";
import { toggleHighlightMap, setHighlightMapColor, setHighlightMapOptions } from "./includes/highlightMapper";
import { getPrevious, getNext } from "./includes/array";
import { logPropertiesMatching, logValuesMatching } from "./includes/object";
import {
	capitalize,
	containsAllOfTheStrings,
	containsAnyOfTheStrings,
	escapeHTML,
	ltrim,
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
	disableClickToCollectUrls,
	enableClickToCollectUrls,
	fixInternalReferences,
	humanizeUrl,
	interlinkMarkedElements,
	logHrefsOnClick,
	makeFileLinksRelative,
	markBrokenInternalLinks,
	moveIDsFromImages,
	moveIDsFromSpans,
	numberReferencesByInterlinkedGroup,
	removeAllQueryParametersExcept,
	removeUnreferencedIDs,
	removeQueryParameterFromLinks,
	removeQueryStringFromLinks,
	removeQueryStringFromLinksMatching,
	moveIDsFromEmptyAnchors,
	relinkTableOfContents,
	revealEmptyLinks,
	revealLinkAttributes,
	showLinksToIDs,
	toggleShowEmptyLinksAndSpans,
} from "./includes/link";
import {
	debugVars,
	logAllClassesFor,
	logElements,
	logError,
	logInfo,
	logString,
	logSuccess,
	logTable,
	logWarning,
	printPropOfObjectArray,
	printPropsContaining,
	showLog,
	xlog,
	ylog,
} from "./includes/log";
import {
	buildGallery,
	deletePersistedImages,
	forceImageHeight,
	forceImageWidth,
	getBestImageSrc,
	getImageHeight,
	getImageWidth,
	inspectImages,
	persistStreamingImages,
	retrieveLargeImages,
	setMinPersistSize,
	shortenImageSrc,
	showSavedStreamingImages,
	tagLargeImages,
	toggleBetweenImagesAndPlaceholders,
	toggleInvertImages,
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
	createUniqueID,
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
	enDashToEmDash,
	fixBullets,
	fixDashes,
	fixSpacesBetweenNestedQuotes,
	invertItalics,
	joinByBrs,
	makeTextLowerCase,
	makeParagraphsByLineBreaks,
	normalizeAllWhitespace,
	removeEmojis,
	removePeriodsFromAbbreviations,
	replaceAllDiacritics,
	replaceDiacritics,
	replaceSpecialCharacters,
	singleQuotesToDoubleQuotes,
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
	normalizeHTML,
	removeAllAttributesExcept,
	removeAllAttributesOf,
	removeAllAttributesOfType,
	removeAllAttributesOfTypes,
	removeAttributeOf,
	removeClassOf,
	removeColorsFromInlineStyles,
	saveIDsToElement,
	setAttributeOf,
	setAttributeOrProperty,
	setClassByPrefix,
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
	goToLastHighlight,
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
	deleteCurrentElement,
	deleteElements,
	deleteEmptyBlockElements,
	deleteEmptyElements,
	deleteEmptyHeadings,
	deleteEmptyTextNodes,
	deleteEmptyTextNodesUnderTagName,
	deleteFollowingNodesBySelector,
	deleteIframes,
	deleteImages,
	deleteImagePlaceholders,
	deleteImagesSmallerThan,
	deleteInMarkedBySelector,
	deleteMarkedElements,
	deleteNodesAfterAnchorNode,
	deleteNodesBeforeAnchorNode,
	deleteNodesBetweenMarkers,
	deleteNodesByRelativePosition,
	deleteNodesBySelectorAndRelativePosition,
	deleteNodesRelativeToAnchorNode,
	deletePrecedingNodesBySelector,
	deleteResources,
	deleteSmallImages,
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
	makeLastChild,
	makeList,
	makeOrderedList,
	makeUnorderedList,
	mapIDsToClasses,
	moveDataTestIdToClassName,
	moveElementUp,
	replaceClass,
	replaceInClassNames,
	swapElementPositions,
	toggleContentEditable,
} from "./includes/dom";
import { proximitySearch as findMultipleStringsInProximity } from "./includes/proximitySearch";
import { generateTableOfContents, inlineFootnotes, cleanupEbook } from "./includes/ebook";
import { highlightCode } from "./includes/code";
import { toggleBlockEditMode } from "./includes/blockEdit";
import {
	createPagerFromSelect,
	cycleTheme,
	doWebsiteSpecificTasks,
	doWebsiteSpecificTasksInternal,
	getCurrentlyPlayingVideo,
	getPageNavLinks,
	hideNonVideoContent,
	hideReferences,
	logout,
	makeButtonsReadable,
	setBodyOpacity,
	setPreFontMonospace,
	setPreFontProportional,
	showPrintLink,
	toggleNonVideoContent,
	toggleViewVideoMode,
	unhideNonVideoContent,
} from "./includes/browse";
import {
	groupAdjacentElements,
	groupMarkedElements,
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
	highlightInElementTextNodes,
	highlightInPres,
	highlightInTextNode,
	highlightInTextNodes,
	highlightLinksInPres,
	highlightLinksWithHrefContaining,
	highlightMatchesInElementRegex,
	highlightMatchesUnderSelector,
	highlightOnMutation,
	highlightSelectedElement,
	unhighlightSelectedElement,
	highlightSelection,
	highlightTableRows,
	highlightTextAcrossTags,
	highlightTextInElement,
	italicizeSelection,
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
	hasAdjacentFollowingElementSiblingOfType,
	hasAdjacentPrecedingElementSiblingOfType,
	hasClassesContaining,
	hasClassesStartingWith,
	hasDirectChildrenOfType,
	isBlockElement,
	isEmptyElement,
	isEmptyTextNode,
} from "./includes/elementAndNodeTests";
import {
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
	showDuplicateIDs,
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
	getMarkedElements,
	markAllFollowingSiblings,
	markBlockElementsContainingText,
	markByClassOrIdContaining,
	markByCssRule,
	markByIdenticalText,
	markBySelector,
	markBySelectorAndNormalizedText,
	markBySelectorAndRegex,
	markBySelectorAndText,
	markByTagNameAndText,
	markCurrentElement,
	markElements,
	markElementsIdenticalToCurrentElement,
	markElementsWithSameClass,
	markEmptyElementsOfType,
	markImagesSmallerThan,
	markNavigationalLists,
	markNumericElements,
	markSelectionAnchorNode,
	markUppercaseElements,
	modifyMark,
	moveAllMarksUp,
	setMarkerClass,
	showMarkedElementInfo,
	unmarkAll,
	unmarkElements,
	unmarkFromBeginning,
	unmarkFromEnd,
	xPathMark,
	markByHasChildrenOfType,
	markByDoesNotHaveChildrenOfType,
	markByHasFirstChildOfType,
	markByHasDirectChildrenOfType,
	markByHasAttribute,
	markByDoesNotHaveAttribute,
	markByAttributeEqualTo,
	markByAttributeNotEqualTo,
	markByAttributeContains,
	markByAttributeDoesNotContain,
	markByFollowsElementOfType,
	markByPrecedesElementOfType,
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
	replaceFirstLevelChildrenWith,
	replaceInMarkedBySelector,
	replaceMarkedElements,
	replaceMarkedWithString,
	replaceMarkedWithTextElement,
	replaceNonStandardElements,
	replaceSelectedElement,
	replaceTables,
	replaceWithSpaces,
	setItalicTag,
	setReplacementTag1,
	setReplacementTag2,
} from "./includes/replaceElements";
import {
	collapseMultipleLineBreaksInPres,
	preSnakeCaseToCamelCase,
	replaceBrsInPres,
	replaceLineBreaksInPres,
	tabifySpacesInPres,
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
} from "./includes/keyMenu";
import {
	checkSequence,
	checkSequenceBySelector,
} from "./includes/validations";
import {
	analyzeReferences,
	createReferencesByTags,
	moveID,
	orderFootnotesByNonFootnoteRefs,
} from "./includes/reference";
import { interlinkReferencesUsingFootnoteReferences, interlinkReferencesByIndexInSections } from "./includes/interlinkReferences";
import { enableEditTextOnClick } from "./includes/edit";

const isDebugMode = true;

const availableFunctions = {
	addDateToTitle,
	addVideoFilter,
	analyzeReferences,
	annotate,
	annotateElement,
	appendMetadata,
	applyVideoFilter,
	arrayToString,
	autoCompleteInputBox,
	boldInlineColonHeadings,
	buildGallery,
	capitalize,
	capitalizeTitle,
	changePage,
	changePageByUrl,
	checkSequence,
	checkSequenceBySelector,
	chooseDocumentHeading,
	cleanupAttributes,
	cleanupBarebone,
	cleanupDocument,
	cleanupEbook,
	cleanupHead,
	cleanupLinks,
	cleanupStackOverflow,
	cleanupTitle,
	clearBootstrapClasses,
	cloneBody,
	closeCustomPrompt,
	collapseMultipleLineBreaksInPres,
	containsAllOfTheStrings,
	containsAnyOfTheStrings,
	containsNonEmptyPlainTextNodes,
	containsOnlyPlainText,
	containsPlainTextNodes,
	convertClassesToCustomElements,
	convertDivsToParagraphs,
	convertElement,
	convertLineBreaksToBrs,
	convertToFragment,
	copyAttribute,
	count,
	createClassSelector,
	createElement,
	createElementWithChildren,
	createElementWithText,
	createHeadingsFromLinks,
	createPagerFromSelect,
	createReferencesByTags,
	createReplacementElement,
	createSelector,
	createUniqueID,
	customPrompt,
	cycleClass,
	cycleFocusOverFormFields,
	cycleHighlightTag,
	cycleTheme,
	cycleThroughDocumentHeadings,
	debugVars,
	del,
	deleteByClassOrIdContaining,
	deleteBySelectorAndExactText,
	deleteBySelectorAndNormalizedText,
	deleteBySelectorAndRegex,
	deleteBySelectorAndText,
	deleteBySelectorAndTextMatching,
	deleteBySelectorAndTextNotMatching,
	deleteClass,
	deleteCurrentElement,
	deleteElements,
	deleteEmptyBlockElements,
	deleteEmptyElements,
	deleteEmptyHeadings,
	deleteEmptyTextNodes,
	deleteEmptyTextNodesUnderTagName,
	deleteFollowingNodesBySelector,
	deleteHtmlComments,
	deleteIframes,
	deleteImagePlaceholders,
	deleteImages,
	deleteImagesSmallerThan,
	deleteIndexSection,
	deleteInMarkedBySelector,
	deleteMarkedElements,
	deleteMessage,
	deleteNodesAfterAnchorNode,
	deleteNodesBeforeAnchorNode,
	deleteNodesBetweenMarkers,
	deleteNodesByRelativePosition,
	deleteNodesBySelectorAndRelativePosition,
	deleteNodesRelativeToAnchorNode,
	deleteNonContentElements,
	deleteNonContentLinks,
	deleteNonContentLists,
	deleteNonEnglishText,
	deletePersistedImages,
	deletePrecedingNodesBySelector,
	deleteResource,
	deleteResources,
	deleteSmallImages,
	delRange,
	deselect,
	disableClickToCollectUrls,
	disableVideoFilter,
	doWebsiteSpecificTasks,
	doWebsiteSpecificTasksInternal,
	duplicateMarkedElement,
	editDocumentTitle,
	editStyleById,
	emptyElement,
	enableClickToCollectUrls,
	enDashToEmDash,
	escapeHTML,
	expandSelectionToSentenceBoundaries,
	expandSelectionToWordBoundaries,
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
	fixBody,
	fixBullets,
	fixDashes,
	fixInternalReferences,
	fixParagraphs,
	fixSpacesBetweenNestedQuotes,
	fixTextAroundReferences,
	fixTextWithinReferences,
	focusButton,
	forAll,
	forAllMarked,
	forceImageHeight,
	forceImageWidth,
	forceReloadCss,
	generateTableOfContents,
	get,
	getAllClassesFor,
	getAllCssRulesForElement,
	getAllCssRulesMatching,
	getAllInlineStyles,
	getAlphanumericTextLength,
	getAttributes,
	getBestDomainSegment,
	getBestImageSrc,
	getClassCounts,
	getContentByParagraphCount,
	getCurrentlyPlayingVideo,
	getElemPropSafe,
	getEmptyTextNodesUnderElement,
	getFirstBlockParent,
	getFirstTextChild,
	getImageHeight,
	getImageWidth,
	getMarkedElements,
	getMarkedHTML,
	getMetadata,
	getNext,
	getNodeContainingSelection,
	getNodeText,
	getNonCodeTextNodes,
	getOne,
	getOneMarked,
	getOrCreate,
	getPageNavLinks,
	getPrevious,
	getSelectionOrUserInput,
	getTextLength,
	getTextNodesUnderElement,
	getTextNodesUnderElementMatching,
	getTextNodesUnderPre,
	getTextNodesUnderSelector,
	getTimestamp,
	getUniqueClassNames,
	getViewportHeight,
	getViewportSize,
	getXpathResultAsArray,
	goToLastElement,
	goToLastHighlight,
	goToNextElement,
	goToPrevElement,
	groupAdjacentElements,
	groupMarkedElements,
	groupUnderHeadings,
	hasAdjacentBlockElement,
	hasAdjacentFollowingElementSiblingOfType,
	hasAdjacentPrecedingElementSiblingOfType,
	hasClassesContaining,
	hasClassesStartingWith,
	hasDirectChildrenOfType,
	hideNonVideoContent,
	hideReferences,
	highlightAllMatchesInDocument,
	highlightAllMatchesInDocumentCaseSensitive,
	highlightAllMatchesInDocumentRegex,
	highlightAllMatchesInDocumentWithWordExpansion,
	highlightAllStrings,
	highlightAllTextNodesMatching,
	highlightBySelectorAndText,
	highlightByTagNameAndText,
	highlightCode,
	highlightCodeComments,
	highlightCodeInPreTextNodes,
	highlightCodeKeywords,
	highlightCodePunctuation,
	highlightCodeStrings,
	highlightElements,
	highlightInElementTextNodes,
	highlightInPres,
	highlightInTextNode,
	highlightInTextNodes,
	highlightLinksInPres,
	highlightLinksWithHrefContaining,
	highlightMatchesInElementRegex,
	highlightMatchesUnderSelector,
	highlightOnMutation,
	highlightSelectedElement,
	highlightSelection,
	highlightTableRows,
	highlightTextAcrossTags,
	highlightTextInElement,
	humanizeUrl,
	identifyClassCycle,
	identifyClassMark,
	identifyClassSetStyle,
	identifyClassSetup,
	identifyClassShowMarked,
	identifyClassTeardown,
	inlineFootnotes,
	insertAfter,
	insertAroundAll,
	insertAsFirstChild,
	insertAsLastChild,
	insertBefore,
	insertElementAfterSelectionAnchor,
	insertElementBeforeSelectionAnchor,
	insertElementNextToAnchorNode,
	insertHrBeforeAll,
	insertSpacesAround,
	insertStyle,
	insertStyleHighlight,
	insertStyleShowErrors,
	inspect,
	inspectImages,
	interlinkReferencesByIndexInSections,
	interlinkMarkedElements,
	interlinkReferencesUsingFootnoteReferences,
	invertItalics,
	isBlockElement,
	isChrome,
	isCurrentDomainLink,
	isEmptyElement,
	isEmptyTextNode,
	isIframe,
	italicizeSelection,
	joinAdjacentElements,
	joinByBrs,
	joinElements,
	joinMarkedElements,
	joinNodesContainingSelection,
	joinParagraphsByLastChar,
	listSelectorsWithLightBackgrounds,
	logAllClassesFor,
	logElements,
	logError,
	logHrefsOnClick,
	logInfo,
	logout,
	logPropertiesMatching,
	logString,
	logSuccess,
	logTable,
	logValuesMatching,
	logWarning,
	ltrim,
	makeAnchorNodePlainText,
	makeButtonsReadable,
	makeChildOf,
	makeClassSelector,
	makeDocumentHierarchical,
	makeElementPlainText,
	makeFileLinksRelative,
	makeIdSelector,
	makeLastChild,
	makeList,
	makeOrderedList,
	makeParagraphsByLineBreaks,
	makePlainText,
	makeTextLowerCase,
	makeUnorderedList,
	mapIDsToClasses,
	mark,
	markAllFollowingSiblings,
	markBlockElementsContainingText,
	markBrokenInternalLinks,
	markByAttributeContains,
	markByAttributeDoesNotContain,
	markByAttributeEqualTo,
	markByAttributeNotEqualTo,
	markByChildrenHavingTheExactText,
	markByClassOrIdContaining,
	markByCssRule,
	markByDoesNotHaveAttribute,
	markByDoesNotHaveChildrenOfType,
	markByFollowsElementOfType,
	markByHasAttribute,
	markByHasChildrenOfType,
	markByHasDirectChildrenOfType,
	markByHasFirstChildOfType,
	markByIdenticalText,
	markByPrecedesElementOfType,
	markBySelector,
	markBySelectorAndNormalizedText,
	markBySelectorAndRegex,
	markBySelectorAndText,
	markByTagNameAndText,
	markCurrentElement,
	markElements,
	markElementsIdenticalToCurrentElement,
	markElementsWithChildrenSpanning,
	markElementsWithSameClass,
	markEmptyElementsOfType,
	markImagesSmallerThan,
	markNavigationalLists,
	markNodesBetweenMarkers,
	markNumericElements,
	markSelectionAnchorNode,
	markUppercaseElements,
	modifyMark,
	moveAllMarksUp,
	moveDataTestIdToClassName,
	moveElementUp,
	moveid: moveID,
	moveIDsFromEmptyAnchors,
	moveIDsFromImages,
	moveIDsFromSpans,
	moveLeadingAndTrailingReferencesOutOfHighlight,
	nextVideoFilter,
	noop,
	normaliseWhitespaceForParagraphs,
	normalizeAllWhitespace,
	normalizeClassnames,
	normalizeHTML,
	normalizeString,
	normalizeWhitespace,
	numberDivs,
	numberReferencesByInterlinkedGroup,
	numberTableRowsAndColumns,
	orderFootnotesByNonFootnoteRefs,
	padLeft,
	padRight,
	parseQueryString,
	persistStreamingImages,
	preSnakeCaseToCamelCase,
	previousVideoFilter,
	printPropOfObjectArray,
	printPropsContaining,
	relinkTableOfContents,
	remove,
	removeAllAttributesExcept,
	removeAllAttributesOf,
	removeAllAttributesOfType,
	removeAllAttributesOfTypes,
	removeAllHighlights,
	removeAllQueryParametersExcept,
	removeAttributeOf,
	removeClassOf,
	removeColorsFromInlineStyles,
	removeEmojis,
	removeEventListeners,
	removeHighlightsFromMarkedElements,
	removeInlineStyles,
	removeLineBreaks,
	removeNestedDuplicates,
	removeNonAlpha,
	removePeriodsFromAbbreviations,
	removeQueryParameterFromLinks,
	removeQueryParameterFromUrl,
	removeQueryStringFromLinks,
	removeQueryStringFromLinksMatching,
	removeRedundantBrs,
	removeRedundantDivs,
	removeRedundantHrs,
	removeSpanTags,
	removeUnnecessaryClasses,
	removeUnnecessarySpans,
	removeUnreferencedIDs,
	removeWhitespace,
	renderResourceInfo,
	replaceAllDiacritics,
	replaceAudio,
	replaceBrs,
	replaceBrsInPres,
	replaceByClassOrIdContaining,
	replaceClass,
	replaceCommonClasses,
	replaceCommonClassesNew,
	replaceDiacritics,
	replaceElement,
	replaceElementKeepingId,
	replaceElements,
	replaceElementsBySelector,
	replaceElementsBySelectorHelper,
	replaceElementsByTagNameMatching,
	replaceElementsOfMarkedTypeWith,
	replaceEmptyParagraphsWithHr,
	replaceFirstLevelChildrenWith,
	replaceFontTags,
	replaceInClassNames,
	replaceInlineStylesWithClasses,
	replaceInMarkedBySelector,
	replaceInTextNodes,
	replaceInTextNodesRegex,
	replaceInTextNodesUnder,
	replaceLineBreaksInPres,
	replaceMarkedElements,
	replaceMarkedWithString,
	replaceMarkedWithTextElement,
	replaceNonStandardElements,
	replaceQueryParameter,
	replaceSelectedElement,
	replaceSmallCapsWithLowercase,
	replaceSpecialCharacters,
	replaceTables,
	replaceWithSpaces,
	rescueOrphanedInlineElements,
	rescueOrphanedTextNodes,
	resetHighlightTag,
	restoreCustomPromptHistory,
	retrieve,
	retrieveBySelectorAndText,
	retrieveElements,
	retrieveGrouped,
	retrieveLargeImages,
	revealEmptyLinks,
	revealLinkAttributes,
	saveIDsToElement,
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
	selectImagesSmallerThan,
	selectNodesBetweenMarkers,
	selectRandom,
	setAttributeOf,
	setAttributeOrProperty,
	setBodyOpacity,
	setClassByDepth,
	setClassByPrefix,
	setDocTitle,
	setDocTitleFromURL,
	setDocumentHeading,
	setElementsToCycleThrough,
	setGroupTagName,
	setHighlightMapColor,
	setHighlightMapOptions,
	setHighlightTag,
	setItalicTag,
	setMarkerClass,
	setMinPersistSize,
	setPreFontMonospace,
	setPreFontProportional,
	setQueryParameter,
	setReplacementTag1,
	setReplacementTag2,
	shortenIDs,
	shortenImageSrc,
	showAttributes,
	showAvailableCommands,
	showDuplicateIDs,
	showExternalStyles,
	showHtmlComments,
	showHtmlTextRatio,
	showIframeCount,
	showImageCount,
	showInlineStyles,
	showLinksToIDs,
	showLog,
	showMarkedElementInfo,
	showMessage,
	showMessageBig,
	showMessageError,
	showPanel,
	showPrintLink,
	showResources,
	showSavedStreamingImages,
	showScripts,
	showSelectors,
	showStatus,
	showTags,
	simplifyClassNames,
	singleQuotesToDoubleQuotes,
	splitByBrs,
	splitElementsByChildren,
	startsWithAnyOfTheStrings,
	swapElementPositions,
	tabifySpacesInPres,
	tagLargeImages,
	toggleBetweenImagesAndPlaceholders,
	toggleBlockEditMode,
	toggleClass,
	toggleConsole,
	toggleContentEditable,
	toggleHighlight,
	toggleHighlightMap,
	toggleHighlightSelectionMode,
	toggleInvertImages,
	toggleMutationObserver,
	toggleNimbusStyles,
	toggleNonVideoContent,
	toggleShowEmptyLinksAndSpans,
	toggleShowKeyCodes,
	toggleShowSelectors,
	toggleStyle,
	toggleStyleNegative,
	toggleVideoFilter,
	toggleViewVideoMode,
	toggleWebsiteSpecificStyle,
	toNumber,
	traceLineage,
	trimAt,
	trimAtInclusive,
	trimBetween,
	trimNonAlphanumeric,
	trimSpecialChars,
	trimStartingAt,
	unescapeHTML,
	unhideNonVideoContent,
	unhighlightSelectedElement,
	unmarkAll,
	unmarkElements,
	unmarkFromBeginning,
	unmarkFromEnd,
	unwrapAll,
	unwrapAllExcept,
	unwrapElement,
	wrapAll,
	wrapAllInner,
	wrapAnchorNodeInTag,
	wrapElement,
	wrapElementInLayers,
	wrapElementInner,
	wrapMarkedElement,
	xlog,
	xPathMark,
	xPathNodesToArray,
	xPathSelect,
	ylog,
	zeroPad,
};

Nimbus.blockElementSelector = BLOCK_TAGS.join();
Nimbus.availableFunctions = availableFunctions;

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

function showAvailableCommands(str)
{
	const arr = [];
	if(str)
	{
		for(const shortCode of Object.keys(Nimbus.autoCompleteInputComponent.commandsByShortCode))
		{
			const commands = Nimbus.autoCompleteInputComponent.commandsByShortCode[shortCode];
			for(const command of commands)
				if(command.toLowerCase().includes(str))
					arr.push(`${shortCode}: ${command}`);
		}
	}
	else
	{
		for(const shortCode of Object.keys(Nimbus.autoCompleteInputComponent.commandsByShortCode))
		{
			const commands = Nimbus.autoCompleteInputComponent.commandsByShortCode[shortCode];
			for(const command of commands)
				arr.push(`${shortCode}: ${command}`);
		}
	}
	console.log(arr.join("\n"));
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
	console.log(`%cNimbus version ${Nimbus.version} loaded`, "font-size: 24px; background: #000; color: #cc0;");
}

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
			case "AA": setClassByPrefix(document.documentElement, "nimbusThemeAmber", "nimbusTheme"); break;
			case "AB": setClassByPrefix(document.documentElement, "nimbusThemeBlack", "nimbusTheme"); break;
			case "AD": setClassByPrefix(document.documentElement, "nimbusThemeDimGrey", "nimbusTheme"); break;
			case "AG": setClassByPrefix(document.documentElement, "nimbusThemeGrey", "nimbusTheme"); break;
			case "AL": setClassByPrefix(document.documentElement, "nimbusThemeHideLinks", "nimbusTheme"); break;
			case "AN": setClassByPrefix(document.documentElement, "nimbusThemeNone", "nimbusTheme"); break;
			case "AR": setClassByPrefix(document.documentElement, "nimbusThemeRed", "nimbusTheme"); break;
			case "AS": setClassByPrefix(document.documentElement, "nimbusThemeSepia", "nimbusTheme"); break;

			case "BC": boldInlineColonHeadings(); break;
			case "BG": buildGallery(); break;
			case "BS": replaceWithSpaces(".markd br"); unmarkAll(); break;
			case "BT": splitElementsByChildren(".markd"); break;
			case "BW": toggleClass(document.body, "xwrap"); break;

			case "CC": getContentByParagraphCount(); break;
			case "CD": cleanupDocument(); break;
			case "CE": customPrompt("Count elements by selector").then(count); break;
			case "CJ": toggleConsole("js"); break;
			case "CS": toggleConsole("css"); break;
			case "CO": makeOrderedList(); break;
			case "CR": createReferencesByTags(); break;
			case "CT": capitalizeTitle(); break;
			case "CU": makeUnorderedList(); break;

			case "DA": deleteNodesAfterAnchorNode(); break;
			case "DB": deleteNodesBeforeAnchorNode(); break;
			case "DC": callFunctionWithArgs("Delete class", deleteClass, 1); break;
			case "DE": callFunctionWithArgs("Delete elements (optionally containing text)", deleteBySelectorAndTextMatching); break;
			case "DF": deleteIframes(); break;
			case "DI": deleteImages(); break;
			case "DJ": removeEmojis(); break;
			case "DN": deleteNonContentElements(); break;
			case "DO": deleteImagePlaceholders(); break;
			case "DP": callFunctionWithArgs("Delete elements with class or id containing text", deleteByClassOrIdContaining); break;
			case "DR": deleteResources(); break;
			case "DS": customPrompt("Delete elements by selector").then(del); break;
			case "DT": callFunctionWithArgs("Delete elements not containing text", deleteBySelectorAndTextNotMatching, 2); break;
			case "DZ": deleteCurrentElement(); break;
			case "DX": del("x"); break;
			case "DY": deleteEmptyBlockElements(); break;

			case "ET": editDocumentTitle(); break;
			case "EC": enableEditTextOnClick(); break;

			case "FD": fixDashes(); break;
			case "FE": cleanupEbook(); break;
			case "FI": fixInternalReferences(); break;
			case "FM": callFunctionWithArgs("findMultipleStringsInProximity", findMultipleStringsInProximity); break;
			case "FP": fixParagraphs(); break;
			case "FR": fixTextAroundReferences(); break;

			case "GA": groupAdjacentElements(".markd", "blockquote", "p"); break;
			case "GB": groupAdjacentElements("blockquote", "blockquote", "p"); break;
			case "GM": groupMarkedElements(Nimbus.GROUP_TAGNAME); break;
			case "GS": groupMarkedElements("section"); break;

			case "HA": getSelectionOrUserInput("Highlight all occurrences of string", highlightAllMatchesInDocument, true); break;
			case "HE": callFunctionWithArgs("Highlight elements by tag name containing text", highlightByTagNameAndText, 2); break;
			case "HC": highlightCode(); break;
			case "HR": removeAllHighlights(); break;
			case "HS": getSelectionOrUserInput("Highlight all occurrences of string (case-sensitive)", highlightAllMatchesInDocumentCaseSensitive, true); break;
			case "HT": customPrompt("Highlight all text nodes matching").then(highlightAllTextNodesMatching); break;
			case "HW": callFunctionWithArgs("Highlight all matches with word expansion", highlightAllMatchesInDocumentWithWordExpansion, 1); break;

			case "II": inspectImages(); break;
			case "IS": callFunctionWithArgs("Mark images smaller than a given pixel area", markImagesSmallerThan, 1); break;

			case "J1": replaceSelectedElement("h1"); break;
			case "J2": replaceSelectedElement("h2"); break;
			case "J3": replaceSelectedElement("h3"); break;
			case "J4": replaceSelectedElement("h4"); break;
			case "J5": replaceSelectedElement("h5"); break;
			case "J6": replaceSelectedElement("h6"); break;

			case "LI": retrieveLargeImages(); break;
			case "LM": interlinkMarkedElements(); break;
			case "LN": numberReferencesByInterlinkedGroup(); break;
			case "LS": customPrompt("Go to last element by selector").then(goToLastElement); break;

			case "M1": setHighlightMapOptions(3, 0, 3); break;
			case "M2": setHighlightMapOptions(4, 0, 4); break;
			case "M3": setHighlightMapOptions(4, 1, 4); break;
			case "M4": setHighlightMapOptions(4, 1, 20); break;
			case "MB": callFunctionWithArgs("Mark block elements containing text", markBlockElementsContainingText, 1); break;
			case "MC": markElementsWithSameClass(); break;
			case "MD": replaceFirstLevelChildrenWith("dt"); break;
			case "ME": callFunctionWithArgs("Replace marked element with element containing text", replaceMarkedWithTextElement, 2, "h2 "); break;
			case "MF": markAllFollowingSiblings(); break;
			case "ML": makeLastChild(); break;
			case "MM": toggleHighlightMap(); break;
			case "MP": callFunctionWithArgs("Mark elements by class or id containing text", markByClassOrIdContaining, 1); break;
			case "MR": callFunctionWithArgs("Mark elements by selector and regex", markBySelectorAndRegex, 2); break;
			case "MS": callFunctionWithArgs("Mark elements by selector and containing text", markBySelectorAndText, 2); break;
			case "MT": markByIdenticalText(); break;
			case "MU": unmarkAll(); break;
			case "MX": customPrompt("Mark by xPath").then(xPathMark); break;

			case "NH": goToNextElement("h1, h2, h3"); break;
			case "NI": goToNextElement("img"); break;
			case "NM": goToNextElement(".markd"); break;
			case "NS": customPrompt("Go to next element by selector").then(goToNextElement); break;
			case "NE": goToNextElement(".statusError"); break;
			case "NW": goToNextElement(".statusWarning"); break;
			case "NO": goToNextElement(".statusOk"); break;

			case "PT": callFunctionWithArgs("Make plain text", makePlainText, 1); break;
			case "P1": setReplacementTag1("h1"); setReplacementTag2("h2"); break;
			case "P2": setReplacementTag1("h2"); setReplacementTag2("h3"); break;
			case "PH": replaceEmptyParagraphsWithHr(); break;
			case "PQ": setReplacementTag1("quote"); setReplacementTag2("quoteauthor"); break;
			case "PP": setPreFontProportional(); break;
			case "PM": setPreFontMonospace(); break;
			case "PJ": setClassByPrefix(document.documentElement, "nimbusPreFontSizeSmall", "nimbusPreFontSize"); break;
			case "PK": setClassByPrefix(document.documentElement, "nimbusPreFontSizeMedium", "nimbusPreFontSize"); break;
			case "PL": setClassByPrefix(document.documentElement, "nimbusPreFontSizeLarge", "nimbusPreFontSize"); break;

			case "RA": analyzeReferences(); break;
			case "RB": replaceBrs(); break;
			case "RC": replaceCommonClassesNew(); break;
			case "RE": replaceElementsBySelectorHelper(); break;
			case "RM": callFunctionWithArgs("Replace children of marked elements by selector", replaceInMarkedBySelector, 2); break;
			case "RS": replaceSpecialCharacters(); break;
			case "RT": callFunctionWithArgs("Replace in all text nodes", replaceInTextNodes, 2); break;
			case "RU": callFunctionWithArgs("Replace in text nodes under", replaceInTextNodesUnder, 3); break;

			case "SD": replaceElementsBySelector("section section", "div"); break;
			case "SW": swapElementPositions(); break;

			case "TX": deleteNonEnglishText(); makeTextLowerCase(); break;
			case "TL": makeTextLowerCase(); break;
			case "TP": setDocTitleFromURL(); break;
			case "TT": deleteEmptyTextNodes(); break;

			case "UA": callFunctionWithArgs("Unwrap all", unwrapAll, 1); break;
			case "UE": callFunctionWithArgs("Unwrap all except", unwrapAllExcept, 1); break;
			case "UM": unwrapAll(".markd"); break;

			case "VB": cleanupBarebone(); break;
			case "VC": simplifyClassNames(); break;
			case "VD": removeRedundantDivs(); break;
			case "VH": removeRedundantHrs(); break;
			case "VI": shortenIDs(); break;
			case "VU": removeUnnecessaryClasses(); break;
			case "VS": removeUnnecessarySpans(); break;

			case "WA": callFunctionWithArgs("Wrap all", wrapAll, 2); break;
			case "WI": callFunctionWithArgs("Wrap all inner", wrapAllInner, 2); break;

			case "YF": toggleStyle(STYLES.FONT_01, "styleFont01", true); break;
			case "YH": insertStyleHighlight(); break;
			case "YI": toggleStyle(STYLES.INVERT_IMAGES, "styleInvertImages", true); break;
			case "YL": toggleStyle(STYLES.REVEAL_LINK_ID_AND_HREF, "styleRevealLinkIDAndHref", true); break;
			case "YM": toggleStyle(STYLES.SHOW_SELECTORS_MINIMAL, "styleShowSelectorsMinimal", true); break;
			case "YN": toggleStyleNegative(); break;
			case "YO": toggleStyle(STYLES.OUTLINE_ELEMENTS, "styleOutlineElements", true); break;
			case "YS": toggleStyle(STYLES.SHOW_SELECTORS, "styleShowSelectors", true); break;
			case "YT": toggleStyle(STYLES.SHOW_LINK_TARGET, "styleShowLinkTarget", true); break;

			case "ZB": markBrokenInternalLinks(); break;
			case "ZC": removeAttributeOf(".markd", "class"); break;
			case "ZD": showDuplicateIDs(); break;
			case "ZE": deleteClass("statusError"); break;
			case "ZI": removeUnreferencedIDs(); break;
			case "ZK": toggleShowKeyCodes(); break;
			case "ZL": showLinksToIDs(); break;
			case "ZO": deleteClass("statusOk"); break;
			case "ZW": deleteClass("statusWarning"); break;
			case "ZZ": markSelectionAnchorNode(); break;
			case "Z5": setBodyOpacity(5); break;
			case "Z6": setBodyOpacity(6); break;
			case "Z7": setBodyOpacity(7); break;
			case "Z8": setBodyOpacity(8); break;
			case "Z9": setBodyOpacity(9); break;
			case "Z0": setBodyOpacity(10); break;

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
	const ctrlOrMeta = navigator.userAgent.includes("Macintosh") ? "metaKey" : "ctrlKey";
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
			Nimbus.keyMenu.shouldExitMenuModeAfterCommand = true;
			showMessageBig("Key menu enabled");
		}

		document.addEventListener("keydown", handleKeyMenu, false);
		Nimbus.keyMenu.isActive = true;
	}
}

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
			case     KEYCODES.TILDE:                highlightSelection(); break;
			case     KEYCODES.NUMPAD1:              setHighlightTag("markblue"); break;
			case     KEYCODES.NUMPAD2:              setHighlightTag("markred"); break;
			case     KEYCODES.NUMPAD3:              setHighlightTag("markwhite"); break;
			case     KEYCODES.NUMPAD4:              showMessageBig("Unbound"); break;
			case     KEYCODES.NUMPAD5:              toggleHighlightMap(); break;
			case     KEYCODES.NUMPAD6:              showMessageBig("Unbound"); break;
			case     KEYCODES.NUMPAD7:              showMessageBig("Unbound"); break;
			case     KEYCODES.NUMPAD8:              showMessageBig("Unbound"); break;
			case     KEYCODES.NUMPAD9:              toggleNimbusStyles(); break;
			case     KEYCODES.NUMPAD0:              deleteResources(); document.body.removeAttribute("style"); break;
			case     KEYCODES.NUMPAD_ADD:           persistStreamingImages(); break;
			case     KEYCODES.NUMPAD_SUBTRACT:      deletePersistedImages(); break;
			case     KEYCODES.NUMPAD_MULTIPLY:      showSavedStreamingImages(); break;
			case     KEYCODES.PERIOD:               toggleNonVideoContent(); break;
			case     KEYCODES.F1:                   replaceSelectedElement(Nimbus.replacementTagName1); break;
			case     KEYCODES.F2:                   replaceSelectedElement(Nimbus.replacementTagName2); break;
			case     KEYCODES.F3:                   customPrompt("Enter tag name to replace elements of the marked type with").then(replaceElementsOfMarkedTypeWith); break;
			case     KEYCODES.F11:                  inspect(); break;
			case     KEYCODES.ONE:                  setHighlightTag("mark"); break;
			case     KEYCODES.TWO:                  setHighlightTag("markyellow"); break;
			case     KEYCODES.THREE:                setHighlightTag("markpurple"); break;
			case     KEYCODES.FOUR:                 setHighlightTag("markgreen"); break;
			case     KEYCODES.FIVE:                 setHighlightTag("markblue"); break;
			case     KEYCODES.SIX:                  setHighlightTag("markred"); break;
			case     KEYCODES.SEVEN:                setHighlightTag("markwhite"); break;
			case     KEYCODES.EIGHT:                toggleBlockEditMode(); break;
			case     KEYCODES.NINE:                 removeAllAttributesOfTypes(["class", "style", "align"]); unwrapAll("span"); break;
			case     KEYCODES.ZERO:                 cycleThroughDocumentHeadings(); break;
			case     KEYCODES.A:                    toggleKeyMenu("A"); break;
			case     KEYCODES.B:                    toggleKeyMenu("B"); break;
			case     KEYCODES.C:                    toggleKeyMenu("C"); break;
			case     KEYCODES.D:                    toggleKeyMenu("D"); break;
			case     KEYCODES.E:                    cycleHighlightTag(); break;
			case     KEYCODES.F:                    toggleKeyMenu("F"); break;
			case     KEYCODES.G:                    toggleKeyMenu("G"); break;
			case     KEYCODES.H:                    toggleKeyMenu("H"); break;
			case     KEYCODES.I:                    toggleConsole("css"); break;
			case     KEYCODES.J:                    toggleKeyMenu("J"); break;
			case     KEYCODES.K:                    toggleConsole("js"); break;
			case     KEYCODES.L:                    toggleKeyMenu("L"); break;
			case     KEYCODES.M:                    toggleKeyMenu("M"); break;
			case     KEYCODES.N:                    toggleKeyMenu("N"); break;
			case     KEYCODES.O:                    getSelectionOrUserInput("Highlight all occurrences of string", highlightAllMatchesInDocument, true); break;
			case     KEYCODES.P:                    toggleKeyMenu("P"); break;
			case     KEYCODES.Q:                    resetHighlightTag(); Nimbus.selectionHighlightMode = "sentence"; break;
			case     KEYCODES.R:                    toggleHighlight(); break;
			case     KEYCODES.S:                    toggleKeyMenu("S"); break;
			case     KEYCODES.T:                    toggleKeyMenu("T"); break;
			case     KEYCODES.U:                    toggleKeyMenu("U"); break;
			case     KEYCODES.V:                    toggleKeyMenu("V"); break;
			case     KEYCODES.W:                    highlightSelection("word"); break;
			case     KEYCODES.X:                    joinNodesContainingSelection(); break;
			case     KEYCODES.Y:                    toggleKeyMenu("Y"); break;
			case     KEYCODES.Z:                    toggleKeyMenu("Z"); break;
			case     KEYCODES.FORWARD_SLASH:        cycleFocusOverFormFields(); break;
			case     KEYCODES.DELETE:               deleteMarkedElements(); break;
			case     KEYCODES.SQUARE_BRACKET_OPEN:  modifyMark("previous"); break;
			case     KEYCODES.SQUARE_BRACKET_CLOSE: modifyMark("next"); break;
			case     KEYCODES.MINUS:                insertElementBeforeSelectionAnchor(); break;
			case     KEYCODES.BACK_SLASH:           italicizeSelection(); break;
			case     KEYCODES.END:                  goToLastHighlight(); break;
			default: shouldPreventDefault           = false;
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
			case     KEYCODES.ZERO:                 editDocumentTitle(); break;
			case     KEYCODES.ONE:                  showResources(); break;
			case     KEYCODES.TWO:                  toggleBetweenImagesAndPlaceholders(); break;
			case     KEYCODES.FOUR:                 deleteImagesSmallerThan(100, 100); break;
			case     KEYCODES.A:                    annotate(); break;
			case     KEYCODES.C:                    deleteNonContentElements(); break;
			case     KEYCODES.E:                    callFunctionWithArgs("Replace marked element with text", replaceMarkedWithTextElement, 2, "h2 "); break;
			case     KEYCODES.G:                    callFunctionWithArgs("Retrieve elements by selector (optionally containing text)", retrieveBySelectorAndText); break;
			case     KEYCODES.I:                    toggleInvertImages(); break;
			case     KEYCODES.J:                    joinMarkedElements(); break;
			case     KEYCODES.K:                    makeChildOf(); break;
			case     KEYCODES.L:                    logout(); break;
			case     KEYCODES.M:                    toggleMutationObserver(true); break;
			case     KEYCODES.N:                    callFunctionWithArgs("Delete numbered divs in range", delRange); break;
			case     KEYCODES.O:                    getSelectionOrUserInput("Highlight all occurrences of string (case-sensitive)", highlightAllMatchesInDocumentCaseSensitive, true); break;
			case     KEYCODES.P:                    getPageNavLinks(); break;
			case     KEYCODES.R:                    unhighlightSelectedElement(); break;
			case     KEYCODES.U:                    moveElementUp("before"); break;
			case     KEYCODES.D:                    moveElementUp("after"); break;
			case     KEYCODES.W:                    cleanupAttributes(); break;
			case     KEYCODES.Y:                    callFunctionWithArgs("Highlight elements by tag name containing text", highlightByTagNameAndText, 2); break;
			case     KEYCODES.FORWARD_SLASH:        focusButton(); break;
			case     KEYCODES.F12:                  highlightCode(true); break;
			case     KEYCODES.MINUS:                callFunctionWithArgs("Insert HR before all (selector)", insertHrBeforeAll); break;
			case     KEYCODES.SQUARE_BRACKET_OPEN:  goToPrevElement(); break;
			case     KEYCODES.SQUARE_BRACKET_CLOSE: goToNextElement(); break;
			default: shouldPreventDefault           = false; break;
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
			case     KEYCODES.UPARROW:              modifyMark("expand"); break;
			case     KEYCODES.DOWNARROW:            modifyMark("contract"); break;
			case     KEYCODES.LEFTARROW:            modifyMark("previous"); break;
			case     KEYCODES.RIGHTARROW:           modifyMark("next"); break;
			case     KEYCODES.ONE:                  toggleStyleNegative(); break;
			case     KEYCODES.TWO:                  toggleStyle(STYLES.DIM_BODY + STYLES.FONT_01, "style2", true); break;
			case     KEYCODES.THREE:                toggleStyle(STYLES.FONT_01, "styleFont01", true); break;
			case     KEYCODES.FOUR:                 toggleStyle(STYLES.SIMPLE_NEGATIVE_3, "styleSimpleNegative3", true); break;
			case     KEYCODES.FIVE:                 toggleStyle(STYLES.MIN_FONT_SIZE, "styleMinFontSize", true); break;
			case     KEYCODES.SIX:                  toggleStyle(STYLES.GITHUB_HIDE_DELETE_DIFFS, "styleGithubHideDeleteDiffs", true); break;
			case     KEYCODES.ZERO:                 clearBootstrapClasses(); toggleViewVideoMode(); break;
			case     KEYCODES.A:                    toggleShowEmptyLinksAndSpans(); break;
			case     KEYCODES.B:                    toggleStyle(STYLES.SHOW_SELECTORS, "styleShowSelectors", true); break;
			case     KEYCODES.C:                    getContentByParagraphCount(); break;
			case     KEYCODES.E:                    replaceElementsBySelectorHelper(); break;
			case     KEYCODES.F:                    del(["object", "embed", "video", "iframe"]); break;
			case     KEYCODES.G:                    callFunctionWithArgs("Delete elements with class or id containing the string", deleteByClassOrIdContaining); break;
			case     KEYCODES.H:                    callFunctionWithArgs("Mark elements by selector", markBySelector, 1); break;
			case     KEYCODES.I:                    toggleStyle(STYLES.INVERT_IMAGES, "styleInvertImages", true); break;
			case     KEYCODES.J:                    deleteNodesBeforeAnchorNode(); break;
			case     KEYCODES.K:                    deleteNodesAfterAnchorNode(); break;
			case     KEYCODES.L:                    deleteNodesBetweenMarkers(); break;
			case     KEYCODES.M:                    Nimbus.autoCompleteCommandPrompt.open(); break;
			case     KEYCODES.N:                    toggleStyle(STYLES.INDICATE_LINK_ATTRIBUTES, "styleShowIDsAndHrefs", true); break;
			case     KEYCODES.O:                    customPrompt("Highlight all text nodes matching").then(highlightAllTextNodesMatching); break;
			case     KEYCODES.P:                    makeAnchorNodePlainText(); break;
			case     KEYCODES.R:                    toggleKeyMenu("R"); break;
			case     KEYCODES.S:                    toggleContentEditable(); break;
			case     KEYCODES.T:                    tabifySpacesInPres(); break;
			case     KEYCODES.V:                    toggleStyle(STYLES.OUTLINE_ELEMENTS, "styleOutlineElements", true); break;
			case     KEYCODES.X:                    customPrompt("Enter xPath").then(xPathMark); break;
			case     KEYCODES.Z:                    markSelectionAnchorNode(); break;
			case     KEYCODES.MINUS:                insertElementAfterSelectionAnchor(); break;
			case     KEYCODES.U:                    customPrompt("Enter custom video filter style", "video, img { filter: saturate(0); }").then(addVideoFilter); break;
			case     KEYCODES.Y:                    toggleVideoFilter(); break;
			case     KEYCODES.SQUARE_BRACKET_OPEN:  previousVideoFilter(); break;
			case     KEYCODES.SQUARE_BRACKET_CLOSE: nextVideoFilter(); break;
			default: shouldPreventDefault           = false; break;
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
			case     KEYCODES.SQUARE_BRACKET_OPEN:  identifyClassCycle("previous"); break;
			case     KEYCODES.SQUARE_BRACKET_CLOSE: identifyClassCycle("next"); break;
			case     KEYCODES.BACK_SLASH:           customPrompt("Enter tag to mark this class with").then(identifyClassMark); break;
			case     KEYCODES.BACKSPACE:            identifyClassTeardown(); break;
			case     KEYCODES.ONE:                  fixBody(); break;
			case     KEYCODES.ZERO:                 capitalizeTitle(); break;
			case     KEYCODES.A:                    annotate("after"); break;
			case     KEYCODES.B:                    toggleShowSelectors(); break;
			case     KEYCODES.D:                    deleteCurrentElement(); break;
			case     KEYCODES.E:                    customPrompt("Enter replacement text").then(replaceMarkedWithString); break;
			case     KEYCODES.G:                    callFunctionWithArgs("Delete elements not containing text", deleteBySelectorAndTextNotMatching, 2); break;
			case     KEYCODES.Z:                    deselect(); break;
			case     KEYCODES.E:                    callFunctionWithArgs("Replace elements by class or id containing", replaceByClassOrIdContaining, 2); break;
			case     KEYCODES.H:                    unmarkAll(); break;
			case     KEYCODES.M:                    markCurrentElement(); break;
			case     KEYCODES.S:                    forceReloadCss(); break;
			case     KEYCODES.V:                    replaceCommonClasses(); break;
			case     KEYCODES.F11:                  inspect(true); break;
			case     KEYCODES.UPARROW:              modifyMark("expand", true); break;
			case     KEYCODES.DOWNARROW:            modifyMark("contract", true); break;
			case     KEYCODES.LEFTARROW:            modifyMark("previous", true); break;
			case     KEYCODES.RIGHTARROW:           modifyMark("next", true); break;
			default: shouldPreventDefault           = false; break;
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
		console.log(`%cNimbus: ${location.hostname} is excluded domain, not injecting`, "font-size: 24px; background: #000; color: #c00;");
}

main();
