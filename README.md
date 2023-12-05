# Asynchronously Resettable Timer for MuddEscapes

(message from Anan) I'm not sure how clear this readme is. If you have any questions feel free to just message me.

## How the website works
This website uses a Firebase database on the backend to save the amount of time remaining and the current game state.

Currently, the data stored in the database is as follows:
* startTime: time the timer was started
* secs: the amount of time remaining
* win: whether the game has been won or not

To see how/when these variables are updated in the database, see the callback functions in Timer.js

Only instructions to send, reset, and stop the timer can be sent, and to ensure that the time is counting down smoothly, the actual time on the timer is not stored in the database.

## Structure of website

### App.js
This the the topmost component of the site. It's primary purpose is to have Firebase configurations, which are passed to the Timer component. The timer component is the only direct child component of App.

Currently, it is tied to my Firebase account (Anan). You can easily switch it to using a different database linked to your account by modifying the configuration in this file. Let me know if you need help doing this but I'm also perfectly happy with you guys continuing to use my account.

### Timer.js
The first main component of the site. This file contains functions used for keeping the timer running and updating the timer. It also contains the definitions for the callback functions used in the settings menu, such as onReset, onStart, onPause, etc.

Additionally, this component loads child components depending on the game state, such as the win screen, lose screen, and the timer contents. It is also responsible for loading the popup settings menu we can use to interact with the timer.

### SettingsPopup.js
The settings page that pops up when you click on the timer. The actual definitions for what each of the buttons do are actually defined in Timer, but this component defines how they are displayed.

### EndScreens.js
The end screens, (lose screen, winscreen) are defined here. This is where the credits go. The logic for which screen to display and when is in Timer.js

### TimerContents.js
The component that actually displays the timer. It is responsible for rendering the actual text that displays the time remaining.

### Other resources
Music/sound effects are in `public`.

## To update the website.
Currently, there are github workflows set up such that the website automatically updates once you merge a branch to main (actually it updates whenever main is updated, and that's what we've been doing, but its better practice to develop on a separate branch and merge it in)

### Other development instructions
* Run `npm install` in this directory to get all the dependencies required for the site to work.
* Run `npm start` start to start the app locally and see your changes.

## Previous timers

If there's a feature you remember that you no longer see, feel free to check out the tags (timers for previous escape rooms):

* [Inside Job (art museum, spring 2023)](https://github.com/muddescapes/muddescapes-timer/releases/tag/inside-job)
* [Long Overdue (library, fall 2022)](https://github.com/muddescapes/muddescapes-timer/releases/tag/long-overdue)
