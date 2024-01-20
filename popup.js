/**
 * References:
 * Timer: https://blog.openreplay.com/chrome-extensions-for-beginners--part-2-practice/
 */

// Get current time and print to window
const timeElement = document.getElementById('time');
const currentTime = new Date().toLocaleTimeString();
timeElement.textContent = `The time is: ${currentTime}`;

// Element to hold timer/stopwatch content
const contentContainer = document.getElementById('content-container');

// HTML rendered when timer is selected to be opened
document.getElementById('toggleTimer').addEventListener('click', () => {
  chrome.storage.local.get(['isRunning'], (res) => {
    contentContainer.innerHTML = `<h1 id='timer-display'>00:00</h1><button id='start-timer-btn'>${
      res.isRunning ? 'Pause Timer' : 'Start Timer'
    }</button><button id='reset-timer-btn'>Reset Timer</button>`;

    // Start timer button logic
    const startTimerBtn = document.getElementById('start-timer-btn');
    startTimerBtn.addEventListener('click', () => {
      chrome.storage.local.get(['isRunning'], (res) => {
        // Toggle isRunning state and button text accordingly
        chrome.storage.local.set(
          {
            isRunning: !res.isRunning,
          },
          () => {
            startTimerBtn.textContent = !res.isRunning
              ? 'Pause Timer'
              : 'Start Timer';
          }
        );
      });
    });

    // Reset timer button logic
    const resetTimerBtn = document.getElementById('reset-timer-btn');
    resetTimerBtn.addEventListener('click', () => {
      // Update variables values
      chrome.storage.local.set({
        timer: 0,
        isRunning: false,
      });
      // Update button text
      startTimerBtn.textContent = 'Start Timer';
    });
  });
});

document.getElementById('toggleStopwatch').addEventListener('click', () => {
  // TODO
  contentContainer.innerHTML = '<p>2</p>';
});
