import { trimAt } from "./string";
import { get } from "./selectors";

export function parseQueryString(url)
{
	const index = url.indexOf("?");
	if(index === -1 || index > url.length - 4)
		return;
	const queryString = url.substring(index + 1);
	let queryStringSplat = queryString.split("&");
	const parsedParameters = [];
	for(let i = 0, ii = queryStringSplat.length; i < ii; i++)
	{
		const keyValuePairSplat = queryStringSplat[i].split("=");
		parsedParameters.push({
			key: keyValuePairSplat[0],
			value: keyValuePairSplat[1]
		});
	}
	return(parsedParameters);
}

export function removeQueryParameterFromUrl(url, parameterName, shouldInvertMatch = false)
{
	const parsedParameters = parseQueryString(url);
	if(!parsedParameters)
		return url;
	let baseUrl = trimAt(url, "?");
	const newParamValuePairs = [];
	if(shouldInvertMatch)
	{
		for(let i = 0, ii = parsedParameters.length; i < ii; i++)
		{
			const param = parsedParameters[i].key;
			const value = parsedParameters[i].value;
			if(param && param.length && param === parameterName)
				newParamValuePairs.push(`${param}=${value}`);
		}
	}
	else
	{
		for(let i = 0, ii = parsedParameters.length; i < ii; i++)
		{
			const param = parsedParameters[i].key;
			const value = parsedParameters[i].value;
			if(param && param.length && param !== parameterName)
				newParamValuePairs.push(`${param}=${value}`);
		}
	}
	const newQueryString = newParamValuePairs.join("&");
	if(newQueryString.length)
		return(`${baseUrl}?${newQueryString}`);
	return baseUrl;
}

export function setQueryParameter(url, parameterName, newValue)
{
	const parsedParameters = parseQueryString(url);
	if(!parsedParameters)
		return url;
	let baseUrl = trimAt(url, "?");
	let newQueryString = "";
	for(let i = 0, ii = parsedParameters.length; i < ii; i++)
	{
		const param = parsedParameters[i].key;
		const value = parsedParameters[i].value;
		if(param !== parameterName)
			newQueryString += `${param}=${value}&`;
		else
			newQueryString += `${param}=${newValue}&`;
	}
	newQueryString = newQueryString.substring(0, newQueryString.length - 1);
	if(newQueryString.length)
		return(`${baseUrl}?${newQueryString}`);
	return baseUrl;
}

export function replaceQueryParameter(key, oldValue, newValue)
{
	const links = get(`a[href*='${key}=${oldValue}']`);
	if(!links) return;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		link.href = setQueryParameter(link.href, key, newValue);
	}
}

export function isCurrentDomainLink(url)
{
	const urlSegments = url.split("/");
	if(urlSegments[2] === location.hostname)
	{
		if(urlSegments.length === 3)
			return true;
		if(urlSegments.length === 4 && urlSegments[urlSegments.length - 1].length === 0)
			return true;
	}
	return false;
}
