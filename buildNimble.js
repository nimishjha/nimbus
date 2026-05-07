const buildResult = await Bun.build({
	entrypoints: ['./src/nimble.js'],
	watch: true,
	outdir: './dist',
	format: "cjs",
	minify: true,
	banner: 'javascript:(function(){',
	footer: '})();',
	drop: ["showMessageBig", "showMessageError"],
});

console.log("buildResult.success:", buildResult.success);
