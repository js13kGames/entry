function coerceToString(value){var defaultValue=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';if(isNil(value)){return defaultValue}
if(isString(value)){return value}
return String(value)}
function isNil(value){return value===undefined||value===null}
function isString(subject){return typeof subject==='string'}
function coerceToNumber(value){var defaultValue=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;if(isNil(value)){return defaultValue}
if(typeof value==='number'){return value}
return Number(value)}
function splice(subject,start,deleteCount,toAdd){var subjectString=coerceToString(subject);var toAddString=coerceToString(toAdd);var startPosition=coerceToNumber(start);if(startPosition<0){startPosition=subjectString.length+startPosition;if(startPosition<0){startPosition=0}}else if(startPosition>subjectString.length){startPosition=subjectString.length}
var deleteCountNumber=coerceToNumber(deleteCount,subjectString.length-startPosition);if(deleteCountNumber<0){deleteCountNumber=0}
return subjectString.slice(0,startPosition)+toAddString+subjectString.slice(startPosition+deleteCountNumber)}