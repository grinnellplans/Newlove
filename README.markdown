# GrinnellPlans Newlove Script #

This is a script that lets you easily find newly added planlove on your quicklove page. It runs under the Greasemonkey extension to Firefox.

## Supported Browsers ##

 * Firefox 3.5+
 * Chrome 4+
 * [Opera?](http://www.opera.com/docs/userjs/using/#writingscripts)
 * For a Safari extension, see [johnsonn]

## Installation ##

### Firefox ###

1. Install the [Greasemonkey extension](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).

2. [Click here](https://github.com/grinnellplans/Newlove/raw/master/newlove.user.js). A box should show up asking you if you want to install the script. Do so. If the box doesn't show up, click on _Tools->Greasemonkey->Install User Script..._ (you must first navigate to the script for this option to not be grayed out).

3. Now go to your quicklove page. A box should pop up asking for your username. Assuming it has guessed correctly, click 'Ok' and you're all set. Check out Usage below for more options.

### Chrome ###

[Install the extension from the Chrome Store.](https://chrome.google.com/webstore/detail/grinnellplans-newlove/backipgbokemnkkfbcicjllnfeoeenaf/details)

## Usage ##

The script runs every time you open your quicklove page. It will only show planlove that is different from the last time the page was opened. There are a couple options you should know about. You can find both of these by navigating to _Tools->Greasemonkey->User Script Commands..._

* _Save as unread_ saves the most recent newlove as unread, so it will still be shown next time you view the page. Useful if you haven't had a chance to look through all of your newlove or need to refresh the page for some reason.

* _Reset username_ clears the stored values for your username and old planlove, as if it were a fresh install. Use this if you entered the wrong username by mistake or something.
