import { showMessageBig } from "./ui";
import { get } from "./selectors";
import { deleteClass, createSelector } from "./element";

function focusField(elem)
{
	if(!elem)
		return;
	deleteClass("focused");
	elem.focus();
	elem.classList.add("focused");
	showMessageBig(`Focused ${createSelector(elem)}`);
	console.log("focusField: " + createSelector(document.activeElement));
}

export function cycleFocusOverFormFields()
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

export function focusButton()
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
