import { unwrapAll, removeAttributeOf, makePlainText } from "./element";
import { get } from "./selectors";
import { replaceInlineStylesWithClasses, replaceClassesWithCustomElements } from "./cleanup";
import { preReplaceBrs } from "./preformatted";

function parseCode(s)
{
	let t = "";
	let cur, prev, next;
	let phpVarRegex;
	let i, ii;
	for(i = 0, ii = s.length; i < ii; i++)
	{
		cur = s[i];
		prev = i > 0 ? s[i-1] : null;
		next = i < ii-1 ? s[i+1] : null;
		switch(cur)
		{
			// double quote strings
			case '"':
				t += '<xs>"';
				i++;
				while(s[i] && s[i]!== '"')
				{
					t += s[i];
					i++;
				}
				t += '"</xs>';
				break;
			// single quote strings
			case "'":
				t += "<xs>'";
				i++;
				while(s[i] && s[i]!== "'")
				{
					t += s[i];
					i++;
				}
				t += "'</xs>";
				break;
			// comments
			case '/':
				if(prev && prev === ":") // is a URL, don't highlight
				{
					t += cur;
				}
				else if(next === '/') // single-line comment
				{
					t += "<xc>/";
					i++;
					while(s[i] && s[i].match(/[\r\n]/) === null)
					{
						t += s[i];
						i++;
					}
					t += '</xc>\r\n';
				}
				else if(next === '*') // block comment
				{
					t += '<xc>' + cur;
					i++;
					while(s[i] && !(s[i] === '*' && s[i+1] === '/'))
					{
						t += s[i];
						i++;
					}
					t += '*/</xc>';
					i++;
				}
				else
				{
					t += cur;
				}
				break;
			// PHP variables
			case '$':
				phpVarRegex = new RegExp('[a-z0-9_\-]', 'i');
				if(next && phpVarRegex.test(next))
				{
					t += '<xv>' + cur;
					i++;
					if(s[i] && phpVarRegex.test(s[i]))
					{
						while(s[i] && phpVarRegex.test(s[i]))
						{
							t += s[i];
							i++;
						}
						i--;
					}
					else
					{
						t += cur;
					}
					t += '</xv>';
				}
				else
				{
					t += cur;
				}
				break;
			// brackets
			case '{':
			case '}':
				t += '<xp>' + cur + '</xp>';
				break;
			case '(':
			case ')':
				t += '<xp>' + cur + '</xp>';
				break;
			case '[':
			case ']':
				t += '<xp>' + cur + '</xp>';
				break;
			// no highlighting
			default:
				t += cur;
				break;
		}
	}
	return t;
}

export function highlightCode(shouldHighlightKeywords)
{
	removeAttributeOf("pre", "class");
	if(get("pre span[style]"))
	{
		replaceInlineStylesWithClasses();
		replaceClassesWithCustomElements("pre span", "x");
		unwrapAll("pre span");
		return;
	}
	if(get("pre span[class]"))
	{
		replaceClassesWithCustomElements("pre span", "x");
		unwrapAll("pre span");
		return;
	}
	else if(get("pre code[class]"))
	{
		replaceClassesWithCustomElements("pre code", "x");
		unwrapAll("pre code");
		return;
	}

	preReplaceBrs();
	makePlainText("pre");

	const preBlocks = get("pre");
	let i = preBlocks.length;
	while(i--)
	{
		const preElement = preBlocks[i];
		// delete the <pre>s that only contain line numbers
		if(preElement.textContent && !/[a-z]/.test(preElement.textContent))
		{
			preElement.remove();
			continue;
		}

		let nodeHTML = preElement.innerHTML;
		// nodeHTML = nodeHTML.replace(/<span[^>]*>/g, "");
		// nodeHTML = nodeHTML.replace(/<\/span>/g, "");
		nodeHTML = parseCode(nodeHTML);

		// Everything between angle brackets
		nodeHTML = nodeHTML.replace(/(&lt;\/?[^&\r\n]+&gt;)/g, '<xh>$1</xh>');
		// php/XML opening and closing tags
		nodeHTML = nodeHTML.replace(/(&lt;\?)/g, '<b1>$1</b1>');
		nodeHTML = nodeHTML.replace(/(\?&gt;)/g, '<b1>$1</b1>');

		if(shouldHighlightKeywords === true)
		{
			const keywords = [
				"abstract", "addEventListener", "appendChild", "arguments", "async", "await", "abs",
				"break", "byte",
				"case", "catch", "char", "class", "const", "continue", "createElement", "createTextNode",
				"debugger", "default", "delete", "do", "document", "documentElement", "double",
				"else", "enum", "export", "extends", "eval",
				"false", "final", "finally", "firstChild", "float", "for", "function", "float2", "float3", "float4",
				"getElementsByClassName", "getElementsByID", "getElementsByTagName", "goto",
				"if", "implements", "import", "in", "Infinity", "insertBefore", "instanceof", "int", "interface",
				"let", "long", "lerp",
				"mediump",
				"NaN", "native", "new", "npm", "null",
				"object", "onclick", "onload", "onmouseover",
				"package", "private", "protected", "prototype", "public", "precision",
				"querySelector", "querySelectorAll",
				"return", "register",
				"script", "src", "static", "String", "struct", "switch", "synchronized", "sampler",
				"this", "throw", "throws", "transient", "true", "try", "type", "typeof", "texture2D",
				"undefined", "uniform",
				"var", "void", "volatile", "vec4", "varying",
				"while", "window", "with"
			];
			let j = keywords.length;
			while(j--)
			{
				const regex = new RegExp("\\b" + keywords[j] + "\\b", "g");
				nodeHTML = nodeHTML.replace(regex, "<xk>" + keywords[j] + "</xk>");
			}
		}
		preElement.innerHTML = nodeHTML;
	}
	// makePlainText("xc");
	// makePlainText("xs");
}
