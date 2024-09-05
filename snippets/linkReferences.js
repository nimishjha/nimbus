function linkReferences(chapterSelector, footnoteContainerSelector)
{
	const chapterElements = get(chapterSelector);
	const footnoteContainerElements = get(footnoteContainerSelector);

	if(!(chapterElements && footnoteContainerElements))
	{
		console.log("Could not get containers");
		return;
	}

	if(chapterElements.length !== footnoteContainerElements.length)
	{
		console.log("Container counts mismatch");
		return;
	}

	for(let i = 0, ii = chapterElements.length; i < ii; i++)
	{
		const chapterContainerIndex = i + 1;
		const chapterElement = chapterElements[i];
		const footnoteContainerElement = footnoteContainerElements[i];

		const chapterHeading = chapterElement.querySelector("h1, h2, h3");
		const chapterHeadingText = chapterHeading ? chapterHeading.textContent : "NO_HEADING";

		const chapterReferences = chapterElement.querySelectorAll("reference");
		const footnoteReferences = footnoteContainerElement.querySelectorAll("reference");
		if(chapterReferences.length !== footnoteReferences.length)
		{
			console.log(`Chapter container ${chapterContainerIndex}: reference counts mismatch: ${chapterReferences.length} references in chapter, ${footnoteReferences.length} references in footnote container`);
			return;
		}

		for(let j = 0, jj = chapterReferences.length; j < jj; j++)
		{
			const chapterReference = chapterReferences[j];
			const footnoteReference = footnoteReferences[j];
			const chapterReferenceText = chapterReference.textContent.trim();
			const footnoteReferenceText = footnoteReference.textContent.trim();
			if(chapterReferenceText !== footnoteReferenceText)
			{
				console.log(`Chapter container ${chapterContainerIndex} - ${chapterHeadingText}: Reference texts do not match: chapter reference text is ${chapterReferenceText}, footnote reference text is ${footnoteReferenceText}`);
				return;
			}

			const sourceLink = chapterReference.querySelector("a");
			const targetLink = footnoteReference.querySelector("a");
			if(!sourceLink && targetLink)
			{
				console.log(`Chapter container ${chapterContainerIndex}: Could not get reference links for one or both of: ${chapterReferenceText}, ${footnoteReferenceText}`);
				return;
			}

			const referenceNumber = j + 1;
			if(referenceNumber.toString() !== chapterReferenceText)
			{
				console.log(`Reference numbers do not match: chapter container ${chapterContainerIndex} - ${chapterHeadingText}, reference ${chapterReferenceText}`);
				return;
			}
			if(referenceNumber.toString() !== footnoteReferenceText)
			{
				console.log(`Reference numbers do not match: chapter container ${chapterContainerIndex} - ${chapterHeadingText}, back-reference ${footnoteReferenceText}`);
				return;
			}

			const refId = `c${chapterContainerIndex}r${referenceNumber}`;
			sourceLink.id = refId + "b";
			targetLink.id = refId;
			sourceLink.setAttribute("href", "#" + targetLink.id);
			targetLink.setAttribute("href", "#" + sourceLink.id);
		}

		console.log(`Linked ${chapterReferences.length} references in chapter ${chapterContainerIndex}`);
	}
}

linkReferences(".chapter", ".footnoteContainer");
