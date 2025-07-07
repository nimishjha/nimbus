function openDialog(inputHandler)
{
	if(getOne("#xxdialog")) return;
	del("#styleDialog");
	const dialog = createElement("div", { id: "xxdialog" });
	const dialogInput = createElement("textarea", { id: "xxdialoginput" });
	dialog.appendChild(dialogInput);
	document.body.appendChild(dialog);
	const s = '#xxdialog { position: fixed; margin: auto; z-index: 10000; height: 60px; top: 0; left: 0px; bottom: 0px; right: 0; background: #111; color: #FFF; border: 10px solid #000; display: block; text-transform: none; width: 800px; }' +
		'#xxdialoginput { font: 32px "swis721 cn bt"; line-height: 60px; verdana; background: #000; color: #FFF; padding: 0; border: 0; width: 100%; height: 100%; overflow: hidden; }';
	insertStyle(s, "style-xxdialog", true);
	const handler = inputHandler || defaultDialogInputHandler;
	dialogInput.addEventListener("keydown", handler, false);
	dialogInput.focus();
}

function closeDialog()
{
	const command = getOne("#xxdialoginput").value;
	del("#xxdialog");
	del("#styleDialog");
	return command;
}

function defaultDialogInputHandler(evt)
{
	evt.stopPropagation();
	switch(evt.keyCode)
	{
		case KEYCODES.ESCAPE: closeDialog(); break;
	}
}

function handleCommandInput(evt)
{
	evt.stopPropagation();
	switch(evt.keyCode)
	{
		case KEYCODES.ESCAPE: closeDialog(); break;
		case KEYCODES.ENTER: runCommandcloseDialog(); break;
	}
}
