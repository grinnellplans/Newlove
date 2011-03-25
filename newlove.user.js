/*
   Copyright 2007-2011 Ian Young

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Revision History
// 1.0 - Initial release
// 1.1 - Added ability to watch everyone's quicklove
// 1.2 - Erin [nichols] reworked this to work in Chrome!
// 1.3 - Use native JSON for storage, fix problems with FF4
// ==UserScript==
// @name           NewLove
// @namespace      http://www.grinnellplans.com
// @description    Shows only new planlove in the quicklove page.
// @include        http://www.grinnellplans.com/search.php?mysearch=*&planlove=1*
// @include        http://grinnellplans.com/search.php?mysearch=*&planlove=1*
// ==/UserScript==

// credit Joe Simmons http://greasefire.userscripts.org/users/JoeSimmons
var isGM = (typeof getValue != 'undefined' && typeof getValue('a', 'b') != 'undefined'),
getValue = (isGM ? getValue : (function(name, def) {var s=localStorage.getItem(name); return (s=="undefined" || s=="null") ? def : s})),
setValue = (isGM ? setValue : (function(name, value) {return localStorage.setItem(name, value)})),
deleteValue = (isGM ? GM_deleteValue : (function(name, def) {return localStorage.setItem(name, def)}));

/* Credit Douglas Crockford <http://javascript.crockford.com/remedial.html> */
String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/g, "");
}; 

// Gets the name of the author a given result is associated with
function getAuthor(node) {
	var links = node.getElementsByTagName('a');
	return links[0].textContent;
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
		setValue("username", "");
		setValue("planloveHash" + guessUsername, "");
	}
}

// Do not count new planlove as read
function saveOldlove() {
	setValue("planloveHash" + guessUsername, JSON.stringify(oldlove));
}

// Figure out if this is actually the quicklove page, as opposed to 
// a regular search. Hackity hack!
username = getValue("username");

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
	setValue("username", username);
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

// Find all 'sub-lists' in the page
var loves = document.evaluate(
		'//ul[@id="search_results"]/li//ul/li',
		document,
		null,
		XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
		null);

// Get the stored planlove from last time
oldlove_str = getValue("planloveHash" + guessUsername);

// Convert from the stored string to a hashtable of arrays
try {
	var oldlove = JSON.parse( oldlove_str );
	// Test it to see if it's null
	oldlove["foo"];
} catch (e) {
    try {
        // In case we're upgrading from the old storage method
        var oldlove = eval( oldlove_str );
        // Test it to see if it's null
        oldlove["foo"];
    } catch (e) {
        var oldlove = {};
    }
}
var newlove = {};
var toRemove = []

// Iterate through the list of search results
var foo;
while ( foo = loves.iterateNext() ) {
	var author = getAuthor(foo.parentNode.parentNode);

	a_love = foo.textContent;

	// Check each lovin' against list of author's previous lovin'
	if (arrayContains(oldlove[author], a_love)) {
		// It's old, remove it
		toRemove.push( foo );
	}

	// Fetch the array of planlove for the current author
	var temp_arr = newlove[author];
	// Create it if it doesn't exist
	if (!newlove[author]) { newlove[author] = []; }
	// Add it to the new list of planlove
	newlove[author].push( a_love );
}

toRemove.forEach( function( n ) {
    n.parentNode.removeChild( n );
});
setValue("planloveHash" + guessUsername, JSON.stringify(newlove));
