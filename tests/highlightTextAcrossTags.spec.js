import { test, expect } from "bun:test";
import { highlightTextAcrossTags } from "../src/includes/highlight";

window.console.log = () => {};

test("highlightTextAcrossTags 1", () => {
	document.body.innerHTML = `<p>For millions of years, mankind lived just like the animals.<reference><a href="#a6106">49</a></reference> <markyellow>Then something happened which <i>unleashed</i> the power of our imagination. We learned to talk.</markyellow> And we learned to listen.</p>`;
	const element = document.querySelector("markyellow");
	const paragraph = document.querySelector("p");
	highlightTextAcrossTags(element, "Then something happened which unleashed the power of our imagination.");
	expect(paragraph.innerHTML).toEqual(`For millions of years, mankind lived just like the animals.<reference><a href="#a6106">49</a></reference> <markyellow><mark>Then something happened which <i>unleashed</i> the power of our imagination.</mark> We learned to talk.</markyellow> And we learned to listen.`);
});

test("highlightTextAcrossTags 2", () => {
	document.body.innerHTML = `<p>A typical program starts with a <code> main() </code> function, executes a series of instructions, and terminates after completing these instructions. Kernel modules, however, follow a different pattern. A module always begins with either the <code>init_module</code> function or a function designated by the <code>module_init</code> call. This function acts as the module's entry point, informing the kernel of the module's functionalities and preparing the kernel to utilize the module's functions when necessary. After performing these tasks, the entry function returns, and the module remains inactive until the kernel requires its code.</p>`;
	const paragraph = document.querySelector("p");
	highlightTextAcrossTags(paragraph, "main() function");
	expect(paragraph.innerHTML).toEqual(`A typical program starts with a <mark><code> main() </code>function</mark>, executes a series of instructions, and terminates after completing these instructions. Kernel modules, however, follow a different pattern. A module always begins with either the <code>init_module</code> function or a function designated by the <code>module_init</code> call. This function acts as the module's entry point, informing the kernel of the module's functionalities and preparing the kernel to utilize the module's functions when necessary. After performing these tasks, the entry function returns, and the module remains inactive until the kernel requires its code.`);
});

test("highlightTextAcrossTags 3", () => {
	document.body.innerHTML = `<p>A typical program starts with a <code> main() </code> function, executes a series of instructions, and terminates after completing these instructions. Kernel modules, however, follow a different pattern. A module always begins with either the <code>init_module</code> function or a function designated by the <code>module_init</code> call. This function acts as the module's entry point, informing the kernel of the module's functionalities and preparing the kernel to utilize the module's functions when necessary. After performing these tasks, the entry function returns, and the module remains inactive until the kernel requires its code.</p>`;
	const paragraph = document.querySelector("p");
	highlightTextAcrossTags(paragraph, "starts with a main()");
	expect(paragraph.innerHTML).toEqual(`A typical program <mark>starts with a <code>main()</code></mark>  function, executes a series of instructions, and terminates after completing these instructions. Kernel modules, however, follow a different pattern. A module always begins with either the <code>init_module</code> function or a function designated by the <code>module_init</code> call. This function acts as the module's entry point, informing the kernel of the module's functionalities and preparing the kernel to utilize the module's functions when necessary. After performing these tasks, the entry function returns, and the module remains inactive until the kernel requires its code.`);
});

test("highlightTextAcrossTags 4", () => {
	document.body.innerHTML = `<p>A typical program starts with a <code> main() </code> function, executes a series of instructions, and terminates after completing these instructions. Kernel modules, however, follow a different pattern. A module always begins with either the <code>init_module</code> function or a function designated by the <code>module_init</code> call. This function acts as the module's entry point, informing the kernel of the module's functionalities and preparing the kernel to utilize the module's functions when necessary. After performing these tasks, the entry function returns, and the module remains inactive until the kernel requires its code.</p>`;
	const paragraph = document.querySelector("p");
	highlightTextAcrossTags(paragraph, "init_module function or a function designated by the module_init");
	expect(paragraph.innerHTML).toEqual(`A typical program starts with a <code> main() </code> function, executes a series of instructions, and terminates after completing these instructions. Kernel modules, however, follow a different pattern. A module always begins with either the <mark><code>init_module</code> function or a function designated by the <code>module_init</code></mark> call. This function acts as the module's entry point, informing the kernel of the module's functionalities and preparing the kernel to utilize the module's functions when necessary. After performing these tasks, the entry function returns, and the module remains inactive until the kernel requires its code.`);
});

