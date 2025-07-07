import { Nimbus } from "./Nimbus";
import { showMessageBig } from "./ui";
import { forAll } from "./misc";
import { insertStyle } from "./style";
import { get, getOne, del } from "./selectors";
import { createSelector } from "./element";

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
export function toggleMutationObserver(watchAttributes, mutationFilterSelector = null, attributeFilter = null)
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
