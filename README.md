# nimbus

## Browsing utility suite for use with Greasemonkey/Tampermonkey

### or

## How I learned to stop worrying and love the DOM

This user script gives the user a great deal of control over the browsing experience, and is quite useful for front-end development as well. Many commands can be executed using keyboard shortcuts, and all commands can be invoked using the in-page command prompt (`Ctrl-Alt-M`).

The command prompt uses a shorthand to call functions with arguments. For instance, if you wanted to call `markElementsWithCssRule("float", "left")`, in the command prompt you'd enter

`markElementsWithCssRule float left`

Numerical arguments are parsed as integers. To force parsing them as a string, or to pass a string with spaces in it, use double quotes.

Say you wanted to highlight all `divs` with `role` attributes containing `tab` (tab, tablist, tabpanel, etc.) You'd bring up the command prompt, then enter:

`mark div role contains tab`

This would add a class `hl` to all the divs matching that criterion, and insert a stylesheet to give all `.hl` elements a red border. Then, if you wanted to remove the `role` attribute from all the marked divs, you'd use the command prompt to enter:

`removeAttributesOf .hl role`

There's also a console to quickly test CSS or JS snippets. If you're viewing a page with a large table of products, for instance, and you want to mark the ones with a price less than $500, you could do this in the JS console (Ctrl-enter to execute):

```
forAll("td", f);
function f(x)
{
	const t = x.textContent;
	if(!t || t.indexOf("$") === -1) return;
	const val = t.replace(/[^0-9]+/g, "");
	if(val.length && parseInt(val, 10) < 500)
	{
		x.className = "hl";
	}
}
```

Then, if you want to highlight the table rows containing the brand name "OCP", you'd hit `Alt-Y`(for `highlight nodes containing text`), then enter `tr OCP` in the command prompt.

## Note

This userscript is meant to be used along with a custom stylesheet, without which quite a few of the operations will have no visible effect. To apply this stylesheet, press Ctrl-Alt-1. This should be the first thing you do if you're expecting to work with highlights, annotations, etc.

## Keyboard shortcuts

Some of these are very likely out of date. As this script is mainly for my personal use, I'm not too concerned about this.

### With Alt key

- 0: Cycle through the first ten H1/H2 elements on the page, setting them as the heading and title of the document
- 1: Delete all styles and scripts, remove all attributes from all elements excluding **link** and **img** src, append URL and time to document, replace embedded videos and iframes with links to their src. Useful for saving web pages for reference.
- 2: Delete all images
- 3: Insert margin
- 4: Delete images smaller than 100px (first run), 200px, 300px, and 400px (on subsequent runs). Useful for clearing cruft like avatars, logos, etc. from a page.
- 5: Retrieve all images on the current page and display them as a gallery at the top of the page
- 6: Delete iframes
- 7: Show HTML comments.
- 8: Allow deletion and retrieval of DOM elements using mouse clicks. Ctrl-click to delete, Ctrl-shift-click to retrieve.
- 9: Insert a stylesheet that displays classes and ids for major block elements, and tags headings with the relevant tag name.
- C: Try to identify the div containing the content and retrieve it if found
- I: CSS scratchpad (`Ctrl-Enter` to apply styles. All rules will have !important applied. )
- K: JS console (`Ctrl-Enter` to execute. Internal functions like `get`, `forAll`, etc. are all available.)
- O: Highlight all occurrences of the given string in the document text
- P: Convert text separated by **br** tags into paragraphs, and indent code in **pre** elements
- Q: Scan document text and convert text that should be a heading into h1, h2, h3 etc.
- R: Highlight node containing current selection.
- `: Highlight selected text
- G: Delete elements containing text
- Y: Highlight nodes containing text
- L: Show log
- Z: Convert common unicode entities into ASCII
- F12: highlight scope operators in **pre** elements. Really helps with readability. Note: must be used with a custom stylesheet.
- Numpad 1: Auto-fill forms using the field names as a guide. Useful for testing forms.
- Numpad 2: Get links with href or title containing the given string
- /: Cycle through and focus form input fields. Useful when you don't want to take your hand off the keyboard to select an input field.

### With Alt-Shift

- 0: If available, use the currently selected text, or ask the user to enter text to use as the document heading and title.
- 1: Create links to all **link** and **script** elements at the top of the webpage. Useful if you want to quickly inspect CSS or JS files used on a page, and much faster than mucking around with browser developer tools. All links have a [delete] button, to remove the relevant script/stylesheet, for the purpose of deleting unnecessary scripts and styles before saving the page.
- 2: Replace all images with links. Useful if you want to save a document without the images, but want to save the image links for future reference.
- W: Remove all attributes except the essential ones (`href` for links, `src` for images, etc.) from all elements.
- A: add an annotation to the currently selected element. Note: must be used with a custom stylesheet to style the annotations properly.
- C: Highlight divs that seem to be non-content-related, e.g. sharing links, sidebars, related links, etc. Pressing Alt-Shift-C again will delete the highlighted divs.
- D: Delete log
- G: Retrieve elements by selector. Replaces the current content of a page with elements that match the selector. For instance, you could `mark` the div that contains the content you want, then retrieve `.hl`.
- P: Scan **pre** elements for plaintext links, and convert them to actual clickable links
- R: Wrap the currently selected element in a **blockquote**
- K: If the page has a "Print" link, prepend it to the top of the page
- L: If the page has a "Log out" link or button, click it. Useful if you hate taking your hands off the keyboard.
- /: Cycle through and focus form submit buttons
- F12: Highlight code in **pre** elements (scope operators and common keywords).

### With Ctrl-Alt

- UP ARROW: Find the first marked element (`.hl`), then move the mark to its parent element.
- 1: Insert a custom stylesheet. This stylesheet will display highlighted text, annotations etc. correctly. **This should be the first thing you do before running any commands, or many functions that rely on this stylesheet (for instance, code and text highlighting) will not seem to work properly.**
- 2-4: More custom stylesheets.
- I: Get content for all iframes, and append it to the current page. If a document has multiple pages, you can shift-click on the links to append each page as an iframe to the current page, then press Ctrl-Alt-i to append each iframe's content to the current page.
- F12: Add a mouse handler that shows you the DOM hierarchy of the currently hovered element. Useful if you're using Developer Tools and don't want to switch tabs just to grab a selector for an element.
- B: Show page grid structure and div class/IDs
- H: Prompt the user for a selector, then mark all elements matching that selector
- M: toggle in-page command prompt (`Enter` to execute command, `Esc` to close). For a list of available commands, see `Nimbus.availableFunctions` in the source code.
- N: Show page grid structure, alternate view
- O: Prompt the user for a string, then mark common block elements containing that string.
- V: Show page grid structure
- Z: Mark the parent node of the currently selected text. Typical use: select a few words of content, then mark the selection's parent node. Expand the mark until all content is inside the marked element. Then run the command `retrieve .hl`, or `Alt-shift-G` then enter `.hl` .

### With Ctrl-Alt-Shift

- D: Deselect all selections
- E: Prompt the user for a string, then delete all elements that have a class containing that string.
- F: Replace non-semantic classes with semantic elements.
- H: Unmark all marked elements (`.hl`, `.hl2`).
- S: Force-reload all linked stylesheets.
