const optionsA = `
B	set theme black
D	set theme dim grey
L	set theme hide links
N	set theme none
R	set theme red
S	set theme sepia
`;

const optionsB = `
K	toggle show key codes
`;

const optionsC = `
B	cleanup barebone
C	get content by paragraph count
D	cleanup document
J	toggle JS console
S	toggle CSS console
O	make OL
T	capitalize title
U	make UL
`;

const optionsD = `
A	delete nodes after anchor node
B	delete nodes before anchor node
C	delete class
E	delete elements (optionally containing text)
F	delete iframes
I	delete images
J	delete emojis
N	delete non-content elements
P	delete elements with class or id containing text
R	delete resources
T	delete elements not containing text
Y	delete empty block elements
`;

const optionsE = `
T	edit document title
`;

const optionsF = `
D	fix dashes
P	fix paragraphs
R	fix text around references
`;

const optionsG = ``;

const optionsH = `
A	highlight all occurrences of string
E	highlight elements by selector and containing text
C	set highlight map color
P	highlight code
R	remove all highlights
S	highlight all matches (case-sensitive)
T	highlight all text nodes matching
W	highlight all matches with word expansion
`;

const optionsI = ``;

const optionsJ = ``;

const optionsM = `
C	mark elements with the same class
P	mark elements by class or id containing text
S	mark elements by selector and containing text
U	unmark all
X	mark by xPath
`;

const optionsP = `
T	make plain text
`;

const optionsR = `
B	replace BRs
E	replace elements by selector
M	replace marked element with element containing text
S	replace special characters
T	replace tables
`;

const optionsT = `
X	delete non-ASCII text and make lowercase
L	make text lowercase
`;

const optionsU = `
A	unwrap all
E	unwrap all except
M	unwrap all marked elements
`;

const optionsV = `
B	cleanup barebone
C	simplify classnames
D	remove redundant divs
H	remove redundant HRs
I	shorten IDs
U	remove unnecessary classes
`;

const optionsW = `
A	wrap all
I	wrap all inner
`;

const optionsY = `
F	font
H	highlight
I	invert images
L	show link attributes
N	negative
O	outline elements
S	show selectors
`;

const optionsZ = `
B	blue
G	green
M	mark
P	purple
R	red
W	white
Y	yellow
`;

export const keyMenuOptionsByKey = {
	A: optionsA,
	B: optionsB,
	C: optionsC,
	D: optionsD,
	E: optionsE,
	F: optionsF,
	G: optionsG,
	H: optionsH,
	I: optionsI,
	J: optionsJ,
	M: optionsM,
	P: optionsP,
	R: optionsR,
	T: optionsT,
	U: optionsU,
	V: optionsV,
	W: optionsW,
	Y: optionsY,
	Z: optionsZ,
};
