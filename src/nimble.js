import { del, get, getOne } from "./includes/selectors";
import { forAll } from "./includes/misc";
import { logInfo, logError, logWarning, logSuccess, logYellow } from "./includes/log";

function main()
{
	window.get = get;
	window.del = del;
	window.getOne = getOne;
	window.forAll = forAll;
	window.logInfo = logInfo;
	window.logError = logError;
}

main();



