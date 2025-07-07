import { get } from "./selectors";

export function replaceBrsInPres()
{
	const brs = document.querySelectorAll("pre br");
	for(let i = 0, ii = brs.length; i < ii; i++)
	{
		const br = brs[i];
		br.parentNode.replaceChild(document.createTextNode("\n"), br);
	}
}

export function tabifySpacesInPres()
{
	const pres = get("pre");
	for(const pre of pres)
	{
		let s = pre.innerHTML;
		if(/\n  [^ ]/.test(s))
			s = s.replace(/ {2}/g, "\t");
		else if(/\n   [^ ]/.test(s))
			s = s.replace(/ {3}/g, "\t");
		else if(/\n    [^ ]/.test(s))
			s = s.replace(/ {4}/g, "\t");
		else
			s = s.replace(/ {4}/g, "\t");
		pre.innerHTML = s;
	}
}
