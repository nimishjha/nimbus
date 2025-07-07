import { Nimbus } from "./Nimbus";
import { Cyclable } from "./Cyclable";
import { showMessageBig } from "./ui";
import { makeClassSelector } from "./misc";
import { getAllClassesFor, getClassCounts } from "./inspect";
import { get, del } from "./selectors";
import { insertStyle } from "./style";

export function identifyClassSetup(selector, atomic = true)
{
	const classes = atomic ? getClassCounts(selector).map(item => item.className) : getAllClassesFor(selector);
	Nimbus.identifyClass.classes = new Cyclable(classes, -1);
	showMessageBig(atomic ? `Found ${classes.length} atomic classes for ${selector}` : `Found ${classes.length} classes for ${selector}`);
}

export function identifyClassTeardown()
{
	identifyClassShowMarked();
	del("#styleIdentifyClass");
	const config = Nimbus.identifyClass;
	config.classes.setValues([]);
	config.markedClasses = [];
	showMessageBig("Identify class mode disabled");
}

export function identifyClassSetStyle(styleString)
{
	const styleRule = "{" + styleString + "}";
	Nimbus.identifyClass.style = styleRule;
	showMessageBig("identifyClass style set to " + styleRule);
}

export function identifyClassCycle(direction)
{
	const config = Nimbus.identifyClass;
	if(!config.classes.getLength())
	{
		showMessageBig("No classes to work with. Run identifyClassSetup <selector> first.");
		return;
	}
	const currentClass = direction === "previous" ? config.classes.previousValue() : config.classes.nextValue();
	const classCount = config.classes.getLength();
	if(currentClass)
	{
		const elemCount = get(makeClassSelector(currentClass)).length;
		showMessageBig("[" + (config.classes.getCurrentIndex() + 1) + "/" + classCount + "] ." + currentClass + ": " + elemCount + " elements", true);
		const style = `.${currentClass} ${config.style}`;
		insertStyle(style, "styleIdentifyClass", true);
	}
}

export function identifyClassMark(str)
{
	const config = Nimbus.identifyClass;
	const currentClass = config.classes[config.currentIndex];
	config.markedClasses.push(`.${currentClass} {} /* ${str} */`);
	showMessageBig(`Marked ${currentClass} with tag ${str}`);
}

export function identifyClassShowMarked()
{
	console.log(Nimbus.identifyClass.markedClasses.join("\n"));
}
