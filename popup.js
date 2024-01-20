/**
 * References:
 * Timer: https://blog.openreplay.com/chrome-extensions-for-beginners--part-2-practice/
 */

// Get current time and print to window
const timeElement = document.getElementById('time');
function updateTime() {
  const currentTime = new Date().toLocaleTimeString();
  timeElement.textContent = `The time is: ${currentTime}`;
}
updateTime();
setInterval(updateTime, 1000);

// Element to hold timer/stopwatch content
const contentContainer = document.getElementById('content-container');

// HTML rendered when timer is selected to be opened
document.getElementById('toggleTimer').addEventListener('click', () => {
  chrome.storage.local.get(['timer'], (res) => {
    contentContainer.innerHTML = `
      <h2 id='timer-display'>${res.timer.duration}:00</h2>
      <button id='start-end-timer-btn'>Start/End</button>
    `;

    // Start End timer button logic
    function updateIsRunning(isRunningValue) {
      chrome.storage.local.set({
        timer: {
          currentTime: 0,
          isRunning: isRunningValue,
          duration: res.timer.duration,
        },
      });
    }
    const startEndTimerBtn = document.getElementById('start-end-timer-btn');
    startEndTimerBtn.addEventListener('click', () => {
      if (res.timer.isRunning) {
        updateIsRunning(false);
      } else {
        updateIsRunning(true);
      }
    });
  });

  // Update timer every 1sec
  function updateTimer() {
    chrome.storage.local.get(['timer'], (res) => {
      const timerDisplay = document.getElementById('timer-display');
      if (timerDisplay != null) {
        const minutes = `${
          res.timer.duration - Math.ceil(res.timer.currentTime / 60)
        }`.padStart(2, '0');
        let seconds = '00';
        if (res.timer.currentTime % 60 != 0) {
          seconds = `${60 - (res.timer.currentTime % 60)}`.padStart(2, '0');
        }

        // Show minutes & secs on UI
        timerDisplay.textContent = `${minutes}:${seconds}`;
      }
    });
  }
  updateTimer();
  setInterval(updateTimer, 1000);
});

document.getElementById('toggleStopwatch').addEventListener('click', () => {
  // Set content for stopwatch
  contentContainer.innerHTML = `
    <h2 id="stopwatch">00:00:00</h2>

    <div>
      <button id="btn-start-stopwatch">Start</button>
      <button id="btn-stop-stopwatch">Stop</button>
      <button id="btn-reset-stopwatch">Reset</button>
    </div>
  `;

  // Map html elements to variables
  const startButton = document.getElementById('btn-start-stopwatch');
  const stopButton = document.getElementById('btn-stop-stopwatch');
  const resetButton = document.getElementById('btn-reset-stopwatch');
  const display = document.getElementById('stopwatch');

  // Attach OnClick Listeners to buttons
  startButton.addEventListener('click', () => {
    startStopwatch();
  });
  stopButton.addEventListener('click', () => {
    stopStopwatch();
  });
  resetButton.addEventListener('click', () => {
    stopStopwatch();
    document.getElementById('stopwatch').innerText = '00:00:00';
  });

  /// Logic for stopwatch

  let startTime_;
  let isRunning_ = false;

  // Read from storage
  chrome.storage.local.get(['stopwatch'], (res) => {
    if (!isObjEmpty(res)) {
      startTime_ = res['stopwatch']['startTime'];
      isRunning_ = res['stopwatch']['isRunning'];
    }

    if (isRunning_) updateStopwatch();
  });

  function updateStorage(_start, _running) {
    chrome.storage.local.set({
      stopwatch: {
        startTime: _start,
        isRunning: _running,
      },
    });
  }

  function startStopwatch() {
    if (!isRunning_) {
      startTime_ = new Date().getTime();
      isRunning_ = true;
      updateStopwatch();
    }
  }

  function stopStopwatch() {
    if (isRunning_) {
      isRunning_ = false;
      updateStorage(startTime_, isRunning_);
    }
  }

  function resetStopwatch() {
    stopStopwatch();
    display.innerText = '00:00:00';
    updateStorage(null, isRunning_);
  }

  function updateStopwatch() {
    if (isRunning_) {
      const currentTime = new Date().getTime();
      const elapsedTime = new Date(currentTime - startTime_);
      display.innerText = time2string(elapsedTime);
      updateStorage(startTime_, isRunning_);
      setTimeout(updateStopwatch, 1000);
    }
  }
});

/// Helper Functions

function isObjEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function time2string(time) {
  const hours = time.getUTCHours().toString().padStart(2, '0');
  const minutes = time.getUTCMinutes().toString().padStart(2, '0');
  const seconds = time.getUTCSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
