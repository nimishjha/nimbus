import { zeroPad } from "./src/includes/misc";

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

function getTimestamp()
{
	const d = new Date();
	const YYYY = d.getFullYear();
	const MO = zeroPad(d.getMonth() + 1);
	const DD = zeroPad(d.getDate());
	const HH = zeroPad(d.getHours());
	const MM = zeroPad(d.getMinutes());
	const SS = zeroPad(d.getSeconds());
	return `${YYYY}${MO}${DD}_${HH}${MM}${SS}`;
}

const versionString = getTimestamp();
const bytesWritten = await Bun.write('./src/includes/version.js', `export const version = "${versionString}";`);
if(bytesWritten > 0)
	console.log("version: " + versionString);
else
	console.error("Failed to write version file");

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
