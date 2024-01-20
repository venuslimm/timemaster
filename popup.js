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

  // Set content for stopwatch
  contentContainer.innerHTML = `
    <div id="stopwatch">00:00:00</div>

    <div>
      <button id="btn-start-stopwatch">Start</button>
      <button id="btn-stop-stopwatch">Stop</button>
      <button id="btn-reset-stopwatch">Reset</button>
    </div>
  `;

  const debugText = document.getElementById('debug');
  debugText.innerText = 'rename';

  // Map html elements to variables
  const startButton = document.getElementById('btn-start-stopwatch');
  const stopButton = document.getElementById('btn-stop-stopwatch');
  const resetButton = document.getElementById('btn-reset-stopwatch');
  const display = document.getElementById('stopwatch');

  // Attach OnClick Listeners to buttons
  startButton.addEventListener('click', () => { startStopwatch(); });
  stopButton.addEventListener('click', () => { stopStopwatch(); });
  resetButton.addEventListener('click', () => { 
    stopStopwatch();
    document.getElementById('stopwatch').innerText = '00:00:00';
  });

  // Logic for stopwatch

  let startTime;
  let isRunning = false;

  function startStopwatch() {
    debugText.innerHTML = "Start Pressed";

    if (!isRunning) {
      startTime = new Date().getTime();
      isRunning = true;
      updateStopwatch();
    }
  }

  function stopStopwatch() {
    debugText.innerHTML = "Stop Pressed";

    if (isRunning) {
      isRunning = false;
    }
  }

  function resetStopwatch() {
    debugText.innerHTML = "Reset Pressed";

    stopStopwatch();
    display.innerText = '00:00:00';
  }

  function updateStopwatch() {
    debugText.innerHTML = "Updating ...";

    if (isRunning) {
      const currentTime = new Date().getTime();
      const elapsedTime = new Date(currentTime - startTime);
      const hours = elapsedTime.getUTCHours().toString().padStart(2, '0');
      const minutes = elapsedTime.getUTCMinutes().toString().padStart(2, '0');
      const seconds = elapsedTime.getUTCSeconds().toString().padStart(2, '0');
      display.innerText = `${hours}:${minutes}:${seconds}`;
      setTimeout(updateStopwatch, 1000);
    }
  }


});
