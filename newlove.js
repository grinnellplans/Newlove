// ==UserScript==
// @name           NewLove
// @namespace      http://www.grinnellplans.com
// @description    Highlights new planlove in the quicklove page.
// @include        http://www.grinnellplans.com/search.php?mysearch=*&planlove=1*
// ==/UserScript==

// Gets the name of the author a given result is associated with
function getAuthor(node) {
	var links = node.getElementsByTagName('a');
	return links[0].innerHTML;
}

// Check given item against all members of the given array. Returns true if the item is found in the array
function array_contains(arr, obj) {
	if (!arr) return false;
	for (var i=0; i<arr.length; i++) {
		//GM_log("Checking string\n" + obj + "\nagainst\n" + arr[i]);
		if (arr[i] == obj) {
			//GM_log("Match found");
			return true;
		}
	}
	return false;
}

var startTime = new Date();
var origTime = new Date();

// Find all 'sub-lists' in the page
var loves = document.evaluate(
	'//ul/li/ul/li',
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);

var timeDiff1 = new Date() - startTime;

startTime = new Date();
// Get the stored planlove from last time
oldlove_str = GM_getValue("planlove_hash");
// Convert from the stored string to a hashtable of arrays
try {
	oldlove = eval(oldlove_str);
} catch (e) { 
	oldlove = {};
}
newlove = {}
var timeDiff2 = new Date() - startTime;

startTime = new Date();
// Iterate through the list of search results
var foo;
for (var i=0; i<loves.snapshotLength; i++) {
	foo = loves.snapshotItem(i);
	var author = getAuthor(foo.parentNode.parentNode);

//var newBar = document.createElement('br');
//	foo.parentNode.insertBefore(newBar, foo.nextSibling);
//	foo.parentNode.insertBefore(newBar, foo);
	if (!array_contains(oldlove[author], foo.innerHTML)) {
		// It's new, highlight it
		//foo.style.backgroundColor = "blue";
		// Also add "newlove" class to it
		var cName = foo.className;
		if (cName) {
			cName = cName + " newlove";
			GM_log("New class = " + cName);
		} else {
			cName = "newlove";
		}
		foo.className = cName;
	}

	// Fetch the array of planlove for the current author
	var temp_arr = newlove[author];
	// Create it if it doesn't exist
	if (!temp_arr) { temp_arr = []; }
	// Add it to the new list of planlove
	temp_arr[temp_arr.length] = foo.innerHTML;
	newlove[author] = temp_arr;

}
var timeDiff3 = new Date() - startTime;

startTime = new Date();
//alert(newlove.toSource());
	// Store the new list value as a string (hacked this way because
	// we can only store strings, ints, and booleans
	//GM_setValue("planlove_hash", newlove.toSource());
var timeDiff4 = new Date() - startTime;
var timeDiffTot = new Date() - origTime;

//	foo.style.borderWidth = "1px";
//	foo.style.borderStyle = "dashed";

GM_log("Time spent: (1) " + timeDiff1 + " (2) " + timeDiff2 + " (3) " + timeDiff3 + " (4) " + timeDiff4 + " (total) " +  timeDiffTot);
