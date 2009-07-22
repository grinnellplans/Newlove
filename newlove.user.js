/*
(c) Ian Young 2007

This program is free software; you can redistribute it and/or modify it 
under the terms of the GNU General Public License as published by the Free
Software Foundation; either version 2 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc., 59
Temple Place, Suite 330, Boston, MA 02111-1307 USA 
*/

// Revision History
// 1.1 - Initial release.
// 1.3 - Added ability to watch everyone's quicklove

// ==UserScript==
// @name           NewLove Only
// @namespace      http://www.grinnellplans.com
// @description    Shows only new planlove in the quicklove page.
// @include        http://www.grinnellplans.com/search.php?mysearch=*&planlove=1*
// ==/UserScript==

/* Credit Douglas Crockford <http://javascript.crockford.com/remedial.html> */
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}; 

// Gets the name of the author a given result is associated with
function getAuthor(node) {
	var links = node.getElementsByTagName('a');
	return links[0].innerHTML;
}

// Check given item against all members of the given array. Returns true if the item is found in the array
function arrayContains(arr, obj) {
	if (!arr) return false;
	for (var i=0; i<arr.length; i++) {
		//GM_log("Checking string\n" + obj + "\nagainst\n" + arr[i]);
		if (arr[i].trim() == obj.trim()) {
			//GM_log("Match found");
			return true;
		}
	}
	return false;
}

// Reset the username and history (simulate a fresh install)
function resetValues(e) {
	if (window.confirm("Reset username and saved planlove?")) {
		GM_setValue("username", "");
		GM_setValue("planloveHash" + guessUsername, "");
	}
}

// Do not count new planlove as read
function saveOldlove() {
	GM_setValue("planloveHash" + guessUsername, oldlove.toSource());
}

// Figure out if this is actually the quicklove page, as opposed to 
// a regular search. Hackity hack!
	username = GM_getValue("username");

		// We need to determine the username. Let's make a guess based on
		// the current url of the page.
		var urly = window.location.href;
		var startIndex = urly.indexOf("mysearch=") + 9;
		var endIndex = urly.indexOf("&", startIndex);
		var guessUsername = urly.substring(startIndex, endIndex);

	if (!username) {
		// Ask for confirmation of the username
		username = window.prompt("What's your username?\n\nIf you want to stalk other people's newlove as well as your own, enter 'everyone' here.", guessUsername).toLowerCase();
		if (!username) return false; // give up
		GM_setValue("username", username);
	}
	// Now, if the page we're currently on isn't searching for that
	// username, fuggedaboudit.
	if (username != guessUsername && username != "everyone") {
		GM_log("False alarm, this isn't a quicklove page. Exiting.");
		return false;
	}

// Add items to the menu
GM_registerMenuCommand("Reset username", resetValues, "", "", "R");
GM_registerMenuCommand("Save as unread", saveOldlove, "", "", "u");

var startTime = new Date();
var origTime = new Date();

// Find all 'sub-lists' in the page
var loves = document.evaluate(
	'//ul[@id="search_results"]/li//ul/li',
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);

var timeDiff1 = new Date() - startTime;

startTime = new Date();
// Get the stored planlove from last time
oldlove_str = GM_getValue("planloveHash" + guessUsername);
// Convert from the stored string to a hashtable of arrays
try {
	var oldlove = eval(oldlove_str);
	// Test it to see if it's null
	oldlove["foo"];
} catch (e) { 
	var oldlove = {};
}
newlove = {}
var timeDiff2 = new Date() - startTime;

startTime = new Date();
// Iterate through the list of search results
var foo;
for (var i=0; i<loves.snapshotLength; i++) {
	foo = loves.snapshotItem(i);
	var author = getAuthor(foo.parentNode.parentNode);

	content = foo.firstChild.innerHTML;

	// Check each lovin' against list of author's previous lovin'
	if (arrayContains(oldlove[author], content)) {
		// It's old, remove it
		foo.parentNode.removeChild(foo);
	}

	// Fetch the array of planlove for the current author
	var temp_arr = newlove[author];
	// Create it if it doesn't exist
	if (!temp_arr) { temp_arr = []; }
	// Add it to the new list of planlove
	temp_arr[temp_arr.length] = content;
	newlove[author] = temp_arr;

}
var timeDiff3 = new Date() - startTime;

startTime = new Date();
//alert(newlove.toSource());
	// Store the new list value as a string (hacked this way because
	// we can only store strings, ints, and booleans
	GM_setValue("planloveHash" + guessUsername, newlove.toSource());
var timeDiff4 = new Date() - startTime;
var timeDiffTot = new Date() - origTime;

GM_log("Time spent: (1) " + timeDiff1 + " (2) " + timeDiff2 + " (3) " + timeDiff3 + " (4) " + timeDiff4 + " (total) " +  timeDiffTot);
