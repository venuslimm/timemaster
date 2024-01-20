// Creates an alarm that fires every second
chrome.alarms.create('timer', {
  periodInMinutes: 1 / 60,
});

// Called when alarm is fired
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'timer') {
    chrome.storage.local.get(['timer', 'isRunning'], (res) => {
      // Updates timer if running
      if (res.isRunning) {
        let timer = res.timer + 1;
        console.log(timer);
        chrome.storage.local.set({
          timer,
        });
      }
    });
  }
});

// Retrieve timer and isRunning values when extension is loaded (0 and false if they dont exist)
chrome.storage.local.get(['timer', 'isRunning'], (res) => {
  chrome.storage.local.set({
    timer: 'timer' in res ? res.timer : 0,
    isRunning: 'isRunning' in res ? res.isRunning : false,
  });
});
