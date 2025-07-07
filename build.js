const bannerText = `// ==UserScript==
// @name Nimbus
// @version 1.0
// @namespace nimishjha.com
// @author Nimish Jha
// @description Swiss Army Knife for the DOM
// @include *
// @include file:///*
// @run-at document-end
// @grant none
// ==/UserScript==`;

const buildResult = await Bun.build({
	entrypoints: ['./src/nimbus.user.js'],
	watch: true,
	outdir: './dist',
	banner: bannerText,
	format: "cjs",
	minify: {
		whitespace: true
	}
});

console.log("buildResult.success:", buildResult.success);
