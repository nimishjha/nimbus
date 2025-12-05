export const STYLES = {
	FONT_01: `
		*, p, li { font-family: "swis721 cn bt"; }
		a { text-decoration: none; }
	`,
	MIN_FONT_SIZE: `* { font-size: calc(22px + 0.0001vh); line-height: 1.4; }`,
	GITHUB_HIDE_DELETE_DIFFS: ".blob-num-deletion, .blob-code-deletion { display: none; }",
	DIM_BODY: 'html, body { background: #000; color: #AAA; } body { opacity: 0.8; } ',
	REVEAL_LINK_ATTRIBUTES: `
		a[id]::after { content: "id: "attr(id); background: #000; color: #c0c; padding: 1px 5px; font-weight: bold; }
		a[href]::after { content: "href: "attr(href); background: #000; color: #0b0; padding: 1px 5px; font-weight: bold; }
		a[name]::after { content: "name: "attr(name); background: #000; color: #cc0; padding: 1px 5px; font-weight: bold; }

		a[id][href]::after { content: "id: "attr(id)" href: "attr(href); background: #000; color: #88c; padding: 1px 5px; font-weight: bold; }
		a[id][name]::after { content: "id: "attr(id)" name: "attr(name); background: #000; color: #c90; padding: 1px 5px; font-weight: bold; }
		a[href][name]::after { content: "href: "attr(href)" name: "attr(name); background: #500; color: #c00; padding: 1px 5px; font-weight: bold; }

		a[id][href][name]::after { content: "id: "attr(id)" href: "attr(href)" name: "attr(name); background: #000; color: #c00; padding: 1px 5px; font-weight: bold; }
	`,
	SIMPLE_NEGATIVE: `
		html, body, body[class] { background: #000; font-family: "swis721 cn bt"; font-size: 22px; }
		*, *[class], *[class][class] { background: rgba(0,0,0,0.4); color: #B0B0B0; border-color: transparent; background-image: none; border-radius: 0; font-size: calc(16px + 0.00001vh); font-family: "swis721 cn bt"; }
		*::before, *::after { opacity: 0.25; }
		span, input, button { border-radius: 0; }
		h1, h2, h3, h4, h5, h6, b, strong, em, i { color: #EEE; }
		mark { color: #FF0; }
		a, a[class] *, * a[class] { color: #05C; }
		a:hover, a:hover *, a[class]:hover *, * a[class]:hover { color: #CCC; }
		a:visited, a:visited *, a[class]:visited *, * a[class]:visited { color: #C55; }
		*[class*=stock][class] { background: #080; }
		*[class*=hover][class] { background: #000; }
		button[class], button[class][class], input[class], textarea[class] { border: 1px solid #333; background: #333; color: #AAA; }
		button[class]:focus, button[class][class]:focus, input[class]:focus, textarea[class]:focus, button[class]:hover, input[class]:hover, textarea[class]:hover { border: 1px solid #CCC; color: #FFF; }
		img, svg { opacity: 0.5; }
		img:hover, a:hover img { opacity: 1; }
	`,
	SIMPLE_NEGATIVE_2: `
		html { background: #000; }
		body { background: #181818; color: #777; font-family: "swis721 cn bt"; }
		* { box-shadow: none; background-image: none; font-family: inherit; border-radius: 0; }
		*::before, *::after { opacity: 0.25; }
		table { border-collapse: collapse; }
		nav, header, footer { background: #111; }
		div { background: #181818; }
		td { background: #1C1C1C; }
		ol, ul, li { background: transparent; }
		div, tr, td { border: 0; }
		a:link { color: #05C; background: #111; }
		a:visited { color: #C55; background: #111; }
		a:hover, a:focus { color: #0CC; background: #222; }
		span, input, button { border-radius: 0; }
		span { border: 0; color: inherit; }
		input { background: #111; border: 1px solid #333; }
		button { background: #111; border: 1px solid #555; }
		img, svg { opacity: 0.5; }
	`,
	SIMPLE_NEGATIVE_3: `
		html { background: #000; color: #999; font-size: 18px; }
		body { background: #222; padding: 10rem; margin: 1rem 10rem; }
		pre { padding: 1rem };
		pre, code { background: #000; font-family: "swis721 cn bt"; font-weight: bold; }
		h1, h2, h3, h4, h5, h6 { background: #111; color: #AAA; padding: 0.5rem 1rem; margin: 0 0 2px 0; font-weight: normal; }
		p { background: #282828; padding: 0.5rem 1rem; margin: 0 0 2px 0; }
		a { text-decoration: none; }
	`,
	VIEW_VIDEO_01: `
		html { background: #000; color: #999; font-size: 12px; }
		body { background: #000; overflow: hidden; }
		* { border: 0; text-shadow: none; font-size: 12px; color: #555; }
		a { text-decoration: none; }
		img { display: none; }
		.jw-text-track-display { opacity: 0.75; margin-top: 30px; }
		.jw-text-track-cue { background: transparent; line-height: 1.4; font-size: 14px; }
	`,
	OUTLINE_ELEMENTS: `header, footer, article, aside, section, div, blockquote, canvas { box-shadow: inset 2px 2px #06C, inset -2px -2px #06C; }
		form, input, button, label { box-shadow: inset 2px 2px #C60, inset -2px -2px #C60; background: rgba(255, 150, 0, 0.2); }
		table, tr, td { box-shadow: inset 2px 2px #04C, inset -2px -2px #04C; }
		th { box-shadow: inset 2px 2px #048, inset -2px -2px #048; }
		ul, ol { box-shadow: inset 2px 2px #0A0, inset -2px -2px #0A0; }
		li { box-shadow: inset 2px 2px #070, inset -2px -2px #070; }
		sup, sub { box-shadow: inset 2px 2px #68A, inset -2px -2px #68A; }
		span { box-shadow: inset 2px 2px #AA0, inset -2px -2px #AA0; }
		font { box-shadow: inset 2px 2px #C60, inset -2px -2px #C60; }
		abbr { box-shadow: inset 2px 2px #A40, inset -2px -2px #A40; }
		nobr { box-shadow: inset 2px 2px #A0A, inset -2px -2px #A0A; }
		cite { box-shadow: inset 2px 2px #0C0, inset -2px -2px #0A0; }
		small { box-shadow: inset 2px 2px #088, inset -2px -2px #088; }
		p { box-shadow: inset 2px 2px #909, inset -2px -2px #505; }
		mark, markyellow, markred, markgreen, markblue, markpurple, markwhite { box-shadow: inset 2px 2px #888, inset -2px -2px #888; }
		a, a * { background: rgba(180, 255, 0, 0.25); }
		img { background: #800; padding: 2px; box-sizing: border-box; }
	`,
	SHOW_SELECTORS: `
		*[class]::before { content: attr(class); color: #C90; background: #000; padding: 2px 6px; font: bold 18px "Swis721 Cn BT"; }
		*[id]::before { content: attr(id); color: #C00; background: #000; padding: 2px 6px; font: bold 18px "Swis721 Cn BT"; }
		*[id][class]::before { content: "#"attr(id)" ."attr(class); color: #C0C; background: #000; padding: 2px 6px; font: bold 18px "Swis721 Cn BT"; }

		div, blockquote, hgroup, h1, h2, h3, h4, h5, h6, ol, ul, li, head, figure, figcaption, pre, dt, dd, message, annotation, td, article { box-shadow: inset 2px 2px #444, inset -2px -2px #444; margin: 4px; padding: 4px; }
		p { box-shadow: inset 2px 2px #808, inset -2px -2px #808; margin: 4px; padding: 4px; }
		small, big, sup, sub, abbr, time, cite { box-shadow: inset 2px 2px #357, inset -2px -2px #357; }
		font { box-shadow: inset 2px 2px #C90, inset -2px -2px #C90; }
		span { box-shadow: inset 0 -100px #040; padding: 4px; border: 2px solid #0A0; }
		span span { padding: 0px; }

		h1::after { content: "h1"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }
		h2::after { content: "h2"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }
		h3::after { content: "h3"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }
		h4::after { content: "h4"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }
		h5::after { content: "h5"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }
		h6::after { content: "h6"; color: #AAA; background: #000; padding: 2px 6px; font: bold 18px "SF Mono"; float: right; }

		message::before, autocompleteinputwrapper::before, autocompleteinputwrapper *::before, #userInputWrapper::before, #userInputWrapper *::before, .excludeFromMutations::before { content: none; }
		message *, autocompleteinputwrapper, autocompleteinputwrapper *, #userInputWrapper, #userInputWrapper * { box-shadow: none; }

		.excludeFromMutations::before, .excludeFromMutations *::before { content: none; }
		.excludeFromMutations[id]::before, .excludeFromMutations[id] *::after { content: none; }
		.excludeFromMutations[class]::before, .excludeFromMutations[class] *::after { content: none; }
	`,
	SHOW_SELECTORS_MINIMAL: `
		*[class]::before { content: attr(class); color: #F90; background: #000; padding: 2px 6px; font: 16px "swis721 cn bt"; }
		*[id]::before { content: attr(id); color: #F0F; background: #000; padding: 2px 6px; font: 16px "swis721 cn bt"; }
		*[id][class]::before { content: "#"attr(id) "."attr(class); color: #0DD; background: #000; padding: 2px 6px; font: 16px "swis721 cn bt"; }
	`,
	PAD_BLOCK_ELEMENTS: `
		div, p, hgroup, article, nav, footnote, header, footer { margin: 4px; padding: 4px; }
	`,
	SHOW_TABLE_STRUCTURE: 'th { background-image: linear-gradient(45deg, #000, #888); } td { background-image: linear-gradient(45deg, #000, #555); } th *, td * { background: transparent; color: #FFF; fill: #999; }',
	INSPECTOR: `
		body.inspector { padding-bottom: 30vh; }
		div#inspector { padding: 5px 10px; position: fixed; left: 0; bottom: 0; width: 50%; min-width: 500px; height: 30vh; overflow: hidden; background:#000; color: #AAA; text-align:left; z-index: 2147483647; font: bold 18px "Swis721 Cn BT", verdana; letter-spacing: 0; box-shadow: none; min-height: 30vh; margin: 0; }
		#inspector.onTop { bottom: auto; top: 0; }
		#inspector b { color:#09F; }
		#inspector em { font-style:normal; color:#F90; }
		.hovered { filter: contrast(1.5); }
		#inspector div { box-shadow: none; margin: 0; padding: 0; }
		#inspector::after, #inspector div::after { display: none; }
	`,
	INVERT_IMAGES: "img { filter: invert(1) hue-rotate(180deg); }",
	INDICATE_LINK_ATTRIBUTES: `
		*[id]::before { content: " "; background: #c00; width: 10px; height: 10px; margin-right: 6px; display: inline-block; border: 5px solid #000; }
		a[id]::before { content: none; }
		a[href]::after { content: " "; background: #08c; width: 10px; height: 10px; margin-left: 6px; display: inline-block; border: 5px solid #000; }
		a[id]::after { content: " "; background: #c00; width: 10px; height: 10px; margin-left: 6px; display: inline-block; border: 5px solid #000; }
		a[id][href]::after { content: " "; background: #0c0; width: 10px; height: 10px; margin-left: 6px; display: inline-block; border: 5px solid #000; }
	`,
	NEGATIVE: `html { background: #181818; font-size: 20px; }
html body, #nimbus body { background: #242424; color: #999; border: 0; font-size: 20px; font-family: "swis721 cn bt"; font-style: normal; line-height: 1.35; }
form { font-family: inherit; font-size: 20px; }

body.pad100 { padding: 100px 200px; }
body.pad100 table { width: 100%; }
body.pad100 td, body.pad100 th { padding: 3px 10px; vertical-align: top; text-align: left; }
body.pad100 ul { list-style: none; }
body.pad100 li { padding: 5px 0 5px 10px; margin: 0 0 2px 0; }
body.pad100 ul li { border-left: 5px solid #0C0C0C; }
body.pad100 img { max-width: 100%; display: block; }
body.pad100 section { padding: 10px; border: 2px solid #111; margin: 100px 0; }
body.xwrap { width: 1200px; margin: 0 auto; padding: 100px 200px; }

h1, h1[class], h2, h2[class], h3, h3[class], h4, h4[class], h5, h5[class], h6, h6[class]
	{ color: inherit; margin-top: 2px; margin-bottom: 2px; border: 0; font-family: "swis721 cn bt"; font-weight: normal; line-height: inherit; background: #111; }
body.pad100 h1, body.pad100 h1[class], body.pad100 h2, body.pad100 h2[class], body.pad100 h3, body.pad100 h3[class], body.pad100 h4, body.pad100 h4[class], body.pad100 h5, body.pad100 h5[class], body.pad100 h6, body.pad100 h6[class]
	{ padding: 10px 1rem; margin: 2px 0 2px -1rem; }

.pad100 h1 { font-size: 2.4rem; }
.pad100 h2 { font-size: 2.0rem; }
.pad100 h3 { font-size: 1.6rem; }
.pad100 h4 { font-size: 1.4rem; }
.pad100 h5 { font-size: 1.2rem; }
.pad100 h6 { font-size: 1.0rem; }

quote { display: block; padding: 1rem 2rem; margin: 2px 0; background: #181818; border-width: 0 0 0 20px; border-style: solid; border-color: #0C0C0C; color: #808080; font-size: 1rem; }
quoteauthor { display: block;  padding: 0.5rem 2rem; margin: 2px 0; background: #202020; border-width: 0 0 0 20px; border-style: solid; border-color: #0C0C0C; font-size: 1rem; text-align: right; }
footnote { display: block; padding: 0.5em 10px; margin: 2px 0; background: #181818; border-width: 0 0 0 10px; border-style: solid; border-color: #181818; color: #808080; }
right { display: block; text-align: right; }
documentheading { display: block; margin: 0 0 100px 0; padding: 10px 0; border-top: 10px solid #141414; border-bottom: 10px solid #141414; }
documentheading h1 { font-size: 2.8rem; }
slideshow { display: block; background: #111; padding: 10px; }
slideshow::after { content: " "; clear: both; display: block; }
img { opacity: 0.5; }
img:hover { opacity: 1; }

hgroup, article, caption, blockquote, center, col, colgroup, div, div[class], form, li, main, noscript, ol, p, section, summary, ul, video
{
	background: transparent;
	color: inherit;
	border: none;
	font-family: "swis721 cn bt";
	font-size: inherit;
	font-style: normal;
	line-height: inherit;
}
div[class*="modal"],
div[class*="popover"]
	{ background: #151515; }
section { background: inherit; color: inherit; }
aside { background-color: #333; color: #808080; padding: 10px; }

abbr, acronym, address, applet, area, audio, b, base, bdo, big, cite, code, command, datalist, del, details, dfn, dir, em, fieldset, font, i, ins, label, legend, link, mark, meter, optgroup, option, output, param, progress, q, rp, rt, ruby, s, select, small, source, strike, strong, time, title, u, var, wbr, xmp
	{ background: inherit; color: inherit; font-family: inherit; font-size: inherit; font-style: normal; line-height: inherit; }
sub, sup { font-size: 16px; font-family: inherit; line-height: 1.2; }
header, header[class], footer, footer[class], nav, nav[class] { background: #111; }
span, span[class] { font-family: inherit; font-size: inherit; line-height: inherit; color: inherit; background: inherit; }
span.italic, span.txit { color: #FF0; }
span.bold, span.txbd { color: #FF0; font-weight: bold; }

hr { height: 4px; background: #111; border-color: #111; border-style: solid; border-width: 0; margin: 40px 0; }
legend { background: #181818; }
container { border: 2px solid #F00; margin: 10px; display: block; padding: 10px; }
figure { border: 0; background: #111; padding: 10px 0; margin: 2px 0 0 0; }
figcaption { background: #111; color: #AAA; padding: 10px 20px; margin-left: 20px; }
annotation { background: #444; color: inherit; padding: 1rem 2rem; display: block; margin: 10px 0 10px -30px; border-style: solid; border-color: #AAA; border-width: 2px 2px 2px 20px; }
ruby { margin: 10px 0; background: #F90; color: #FFF; padding: 20px 30px; display: block; font-size: 20px; border-left: 10px solid #F90; }
rp { margin: 10px 0; background: #181818; color: #888; padding: 40px; display: block; font: 20px "swis721 cn bt"; border-top: 50px solid #000; border-bottom: 50px solid #000; }
rt { margin: 10px 0; padding: 20px; display: block; background: #181818; font: 12px Verdana; text-align: left; }
rt:before { content: ""; display: block; width: 10px; height: 15px; border: 2px solid #AAA; float: left; margin: -3px 20px 0 0; }

button, select, textarea, input, input[class], input[type] { background: #151515; color: #909090; -moz-appearance: none; border-radius: 0; border: 0; font-family: inherit; font-size: 20px; }
select, textarea { border: 0; box-shadow: none; }
html input[type="checkbox"] { width: 24px; height: 24px; background: #242424; }
button:hover, button:focus, input[type="submit"]:hover, input[type="submit"]:focus, input[type="button"]:hover, input[type="button"]:focus { background: #090909; color: #CCC; border-color: #FFF; }
select:focus, textarea:focus, input:focus { color: #BBB; outline: 0; background: #0C0C0C; box-shadow: none; }
html small textarea[class] { font: 12px Verdana; }
span[class*="button"] { background: #151515; color: #909090; border: 0; border-radius: 0; }
span[class*="button"]:hover, span[class*="button"]:focus { background: #090909; color: #CCC; }

autocompleteinputwrapper input, autocompleteinputwrapper input[class] { font-size: 40px; color: #FFF; }
autocompleteinputwrapper input div, autocompleteinputwrapper input[class] div { color: #FFF; }

a, a:link, a[class], a[id] { color: #77C; text-decoration: none; text-shadow: none; font: inherit; border: 0; background: inherit; }
a[class*="btn"] { background: #333; }
button[class*="active"], a[class*="active"], a[class*="selected"] { outline: 2px solid #6F0; }
a:visited, a:visited * { color: #357; text-decoration: none; }
a:active, a:hover, a:focus, a:hover *, a:focus * { color: #09F; text-decoration: none; outline: 0; }
.pagination a:link { font: bold 30px "swis721 cn bt"; border: 0; background: #111; padding: 10px; }

p { margin: 0; padding: 5px 0; }
blockquote { margin: 0 0 6px 0; padding: 20px 40px; border-left: 10px solid #111;  }
blockquote blockquote { padding: 0 0 0 40px; }

table { border-collapse: collapse; }
table, tr, td, th { margin: 0; padding: 0; line-height: inherit; font: 20px/1.4 "swis721 cn bt"; color: inherit; border: 0; }
table, tbody, tr, td { background: inherit; }
thead, th { background: #111; }
tr:nth-child(odd) td , tr:nth-child(odd) th { background-color: #181818; }
tr:nth-child(even) td , tr:nth-child(even) th { background-color: #202020; }

dl, dl[class] { border-left: 20px solid #111; background: #181818; font: inherit; line-height: inherit; }
dt, dt[class] { padding: 0.5em 10px; margin: 2px 0; background: #181818; border-width: 0 0 0 20px; border-style: solid; border-color: #0C0C0C; font: inherit; line-height: inherit; }
dd, dd[class] { padding: 0.25em 10px; margin: 2px 0; background: #202020; border-width: 0 0 0 60px; border-style: solid; border-color: #0C0C0C; font: inherit; line-height: inherit; }

cite, u, em, i { font-weight: normal; font-style: normal; text-decoration: none; color: #CCC; }
b, strong { font-weight: bold; font-style: normal; text-decoration: none; color: #CCC; }
a u, a em, a i, a b, a strong, a div, a span { color: inherit; }
small { font-size: 80%; }

code { font: inherit; padding: 1px 2px; background: #0C0C0C; color: #999; }
tt { font: Consolas; padding: 1px 2px; background: #0C0C0C; color: #06C; }
kbd { font: Consolas; padding: 1px 2px; background: #0C0C0C; color: #3E0; }
samp { font: Consolas; padding: 1px 2px; background: #0C0C0C; color: #0CC; }
pre { background: #0C0C0C; color: #909090; border-style: solid; border-width: 0 0 0 10px; border-color: #444; padding: 10px 20px; overflow-x: auto; }
pre p { margin: 0; padding: 0; }
pre { font-family: "Swis721 Cn BT"; font-size: 18px; font-weight: bold; line-height: 1.2; }
pre * { font: inherit; text-recoration: none; }

pre em { color: #00AAFF; }
pre i { color: #0088CC; }
pre b { color: #44EEFF; }
pre u { color: #6677EE; }
pre dfn { color: #8888CC; }
pre s { color: #6677CC; }
pre q1 { color: #1CF; background: #003040; }
pre q2 { color: #57F; background: #203040; }
pre c1 { color: #AABBCC; background: #303840; }
pre c2 { color: #88BBEE; background: #304050; }
pre b1 { color: #11FF00; }
pre b2 { color: #00FFFF; }
pre b3 { color: #EEAAFF; }
pre xk { color: #0099FF; }
pre xh { color: #AADDCC; }

X0 { color: #664477; }
X1 { color: #6677CC; }
X2 { color: #6644BB; }
X3 { color: #666688; }
X4 { color: #6666FF; }
X5 { color: #774488; }
X6 { color: #667777; }
X7 { color: #667766; }
X8 { color: #6655DD; }
X9 { color: #666677; }
X10 { color: #6644AA; }
X11 { color: #777788; }
X12 { color: #665566; }
X13 { color: #7744DD; }
X14 { color: #774488; }
X15 { color: #6677EE; }

XC { color: #1CF; background: #247; }
XK { color: #1177CC; }
XO { color: #11AACC; }
XP { color: #11FF00; }
XS { color: #1CF; background: #113060; }

mark, markgreen, markred, markblue, markpurple, markyellow, markwhite { padding: 3px 0; line-height: inherit; }
mark { background: #048; color: #6CF; }
markgreen { background: #150; color: #3F0; }
markred { background: #500; color: #E33; }
markblue { background: #005; color: #05D; }
markpurple { background: #408; color: #C7F; }
markyellow { background: #804800; color: #FF0; }
markwhite { background: #000; color: #DDD; }

user { background: #000; padding: 2px 10px; border-left: 10px solid #09F; margin: 0; }
author { display: block; font-size: 24px; background: #111; color: #FFF; padding: 2px 10px; border-left: 10px solid #AF0; margin: 0; }
reference, internalref { background: #000; color: #AAA; padding: 1px 5px; }
comment { display: block; padding: 20px 40px; border-left: 10px solid #555; background: #181818; margin-bottom: 2px; }
ind { display: block; padding-left: 50px; }
warning, info, error { display: block; border-width: 2px 2px 2px 20px; border-style: solid; padding: 1rem 2rem; margin: 10px 0; }
warning { background: #420; border-color: #C70; }
info { background: #035; border-color: #07C; }
error { background: #600; border-color: #D40; }
tag { background: #333 !important; color: #888 !important; padding: 2px 4px !important; margin: 0 5px 0 0 !important; }

.markd { box-shadow: inset 2px 2px #C00, inset -2px -2px #C00 !important; background: #000 !important; }
	`,
};
