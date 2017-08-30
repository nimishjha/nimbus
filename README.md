# nimbus

Browsing utility toolkit for use with Scriptish/Greasemonkey

This user script gives the user a great deal of control over the browsing experience. It includes a number of commands that can be invoked using the keyboard.

##With Alt key

- 0: Use currently selected text to create the document heading and title
- 1: Delete all styles and scripts, remove all attributes from all elements excluding **link** and **img** src, append URL and time to document, replace embedded videos and iframes with links to their src. Useful for saving web pages for reference.
- 2: Delete all images
- 3: Insert margin
- 4: Delete small images, and unnecessary images like social media icons, avatars, etc.
- 5: Retrieve all images on the current page and display them as a gallery at the top of the page
- 6: Delete iframes
- 7: Show HTML comments.
- 8: Allow deletion and retrieval of DOM elements using mouse clicks. Ctrl-click to delete, Ctrl-shift-click to retrieve.
- C: Try to identify the div containing the content and retrieve it if found
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

##With Alt-Shift

- 1: Create links to all **link** and **script** elements at the top of the webpage. Useful if you want to view or save CSS or JS files used on a page.
- 2: Replace all images with links. Useful if you want to save a document without the images, but want to save the image links for future reference.
- W: On Wikipedia, get the links to the large image files for all the thumbnails in the wiki page, and prepend them to the page.
- F12: Highlight code in **pre** elements (scope operators and common keywords)
- A: add an annotation to the currently selected element. Note: must be used with a custom stylesheet to style the annotations properly.
- C: Highlight divs that seem to be non-content-related, e.g. sharing links, sidebars, related links, etc. Pressing Alt-Shift-C again will delete the highlighted divs.
- D: Delete log
- P: Scan **pre** elements for plaintext links, and convert them to actual clickable links
- R: Wrap the currently selected element in a **blockquote**
- K: If the page has a "Print" link, prepend it to the top of the page
- L: If the page has a "Log out" link or button, click it. Useful if you hate taking your hands off the keyboard.
- /: Cycle through and focus form submit buttons

##With Ctrl-Alt

- 1: Insert a custom stylesheet. This stylesheet will display highlighted text, annotations etc. correctly.
- 2-6: More custom stylesheets.
- I: Get content for all iframes, and append it to the current page. If a document has multiple pages, you can shift-click on the links to append each page as an iframe to the current page, then press Ctrl-Alt-i to append each iframe's content to the current page.
- F12: Add a mouse handler that shows you the DOM hierarchy of the currently hovered element. Useful if you're using Developer Tools and don't want to switch tabs just to grab a selector for an element.
- V: Show page grid structure
- B: Show page grid structure and div class/IDs
- N: Show page grid structure, alternate view
