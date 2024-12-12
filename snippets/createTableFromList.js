function createTableFromList(selector, numCols)
{
	const elems = get(selector);
	if(elems.length % numCols !== 0)
	{
		console.log("element count", elems.length , "is not divisible by", numCols);
	}
	const parent = elems[0].parentNode;
	const placeholder = document.createElement("aside");
	insertBefore(elems[0], placeholder);
	const table = document.createElement("table");
	for(let i = 0, ii = elems.length; i < ii; i += numCols)
	{
		const tr = document.createElement("tr");
		for(let j = 0, jj = numCols; j < jj; j++)
		{
			const td = document.createElement("td");
			td.appendChild(elems[i + j]);
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	placeholder.appendChild(table);
	unmarkAll();
}

createTableFromList(".markd", 2);


function createTableFromElements(elems, numCols)
{
	if(elems.length % numCols !== 0)
	{
		console.log("element count", elems.length , "is not divisible by", numCols);
	}
	const parent = elems[0].parentNode;
	const placeholder = document.createElement("dt");
	insertBefore(elems[0], placeholder);
	const table = document.createElement("table");
	for(let i = 0, ii = elems.length; i < ii; i += numCols)
	{
		const tr = document.createElement("tr");
		for(let j = 0, jj = numCols; j < jj; j++)
		{
			const td = document.createElement("td");
			td.appendChild(elems[i + j]);
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	placeholder.appendChild(table);
}


forAll("section", f);
function f(x) {
	if(x.querySelector("table")) return;
	const paras = x.querySelectorAll("p");
	createTableFromElements(paras, 2);
}
