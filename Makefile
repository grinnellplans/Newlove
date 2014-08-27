build: chrome.zip

chrome.zip: manifest.json newlove.user.js
	zip chrome.zip manifest.json newlove.user.js
