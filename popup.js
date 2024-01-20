const contentContainer = document.getElementById('content-container');

document.getElementById('toggleTimer').addEventListener('click', () => {
  // TODO
  contentContainer.innerHTML = '<p>1</p>';
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
