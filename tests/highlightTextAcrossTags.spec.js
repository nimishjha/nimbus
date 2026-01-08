import { test, expect } from "bun:test";
import { highlightTextAcrossTags } from "../src/includes/highlight";

test("highlightTextAcrossTags 1", () => {
	document.body.innerHTML = `<p>For millions of years, mankind lived just like the animals.<reference><a href="#a6106">49</a></reference> <markyellow>Then something happened which <i>unleashed</i> the power of our imagination. We learned to talk.</markyellow> And we learned to listen.</p>`;
	const element = document.querySelector("markyellow");
	const paragraph = document.querySelector("p");
	highlightTextAcrossTags(element, "Then something happened which unleashed the power of our imagination.");
	expect(paragraph.innerHTML).toEqual(`For millions of years, mankind lived just like the animals.<reference><a href="#a6106">49</a></reference> <markyellow><mark>Then something happened which <i>unleashed</i> the power of our imagination.</mark> We learned to talk.</markyellow> And we learned to listen.`);
});
