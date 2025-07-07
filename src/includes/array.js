export function getNext(item, arr)
{
	let nextItem = arr[0];
	const index = arr.indexOf(item);
	if(~index)
	{
		const nextIndex = index < arr.length - 1 ? index + 1 : 0;
		nextItem = arr[nextIndex];
	}
	return nextItem;
}

export function getPrevious(item, arr)
{
	let prevItem = arr[0];
	const index = arr.indexOf(item);
	if(~index)
	{
		const prevIndex = index > 0 ? index - 1 : arr.length - 1;
		prevItem = arr[prevIndex];
	}
	return prevItem;
}
