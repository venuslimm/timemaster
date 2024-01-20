// Creates an alarm that fires every second
chrome.alarms.create('timer', {
  periodInMinutes: 1 / 60,
});

// Called when alarm is fired
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'timer') {
    chrome.storage.local.get(['timer'], (res) => {
      // Updates timer if running
      if (res.timer.isRunning) {
        let timer = res.timer.currentTime + 1;
        console.log(timer);
        chrome.storage.local.set({
          timer: {
            currentTime: timer,
            isRunning: res.timer.isRunning,
            duration: res.timer.duration,
          },
        });
      }
    });
  }
});

// Retrieve timer and isRunning values when extension is loaded (0 and false if they dont exist)
chrome.storage.local.get(['timer'], (res) => {
  chrome.storage.local.set({
    timer:
      'timer' in res
        ? res.timer
        : { currentTime: 0, isRunning: false, duration: 20 },
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'timer') {
    chrome.storage.local.get(['timer'], (res) => {
      if (res.timer.isRunning) {
        let timer = res.timer.currentTime + 1;
        let isRunning = true;
        if (timer === res.timer.duration * 60) {
          this.registration.showNotification(
            res.timer.duration > 1
              ? `${res.timer.duration} Minutes Pomodoro Timer`
              : `${res.timer.duration} Minute Pomodoro Timer`,
            {
              body:
                res.timer.duration > 1
                  ? `${res.timer.duration} minutes has passed`
                  : `${res.timer.duration} minute has passed`,
            }
          );
          timer = 0;
          isRunning = false;
        }
        chrome.storage.local.set({
          timer: {
            currentTime: timer,
            isRunning: isRunning,
            duration: res.timer.duration,
          },
        });
      }
    });
  }
});
