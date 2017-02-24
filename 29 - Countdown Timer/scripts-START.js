const doc = document;
const timerButtons = doc.querySelectorAll('.timer__button');
const display = doc.querySelector('.display');
const timeLeft = doc.querySelector('.display__time-left');
const timeEnd = doc.querySelector('.display__end-time');
const form = doc.querySelector('#form');
const minutes = doc.querySelector('#minutes');
const initialTime = '00:00';
const text = {
  before: 'Choose your timer',
  back: 'Be back at',
  after: 'Time is over'
};
const classFinished = 'display__time-left--finished';
let timeout = null;
let interval = null;

//---------------------------------------------

function clearState() {
  display.dataset.state = 'ready';
  timeLeft.innerHTML = initialTime;
  timeEnd.innerHTML = text.before;
}

//---------------------------------------------

function timer(seconds) {
  clearTimeout(timeout);
  clearInterval(interval);

  display.dataset.state = 'start';

  const milliSeconds = seconds * 1000;
  showTimeEnd(milliSeconds);

  timeLeft.innerHTML = timeFormat(seconds);

  interval = setInterval(()=> {
    seconds--;

    if (seconds > 0) {
      timeLeft.innerHTML = timeFormat(seconds);
    }
    else {
      clearInterval(interval);
      timeOver();
    }

  }, 1000);

  timeout = setTimeout(timeOver, milliSeconds);
}

//---------------------------------------------

function timeFormat(seconds) {
  let result = '';
  const time = {};
  time.hours = Math.floor(seconds/3600);
  time.mins = Math.floor(seconds % 3600 / 60);
  time.seconds = seconds % 3600 % 60;

  for(const key in time) {
    if (time[key] < 10) {
      time[key] = '0' + time[key];
    }
  }

  result = `${time.mins}:${time.seconds}`;

  if (time.hours > 0) {
    result = `${time.hours}:${result}`;
  }

  return result;
}

//---------------------------------------------

function showTimeEnd(interval) {
  let date = new Date();
  date.setMilliseconds(interval);

  const time = {
    hours : date.getHours(),
    mins: date.getMinutes(),
    seconds : date.getSeconds()
  };

  for(const key in time) {
    if (time[key] < 10) {
      time[key] = '0' + time[key];
    }
  }

  timeEnd.innerHTML = `${text.back} ${time.hours}:${time.mins}:${time.seconds}`;
}

//---------------------------------------------

function timeOver() {
  timeLeft.innerHTML = initialTime;
  display.dataset.state = 'finished';
  timeEnd.innerHTML = text.after;

  setTimeout(stopState, 5000)
}

//---------------------------------------------

function stopState() {
  display.dataset.state = 'ready';
}

//---------------------------------------------

function setTimer() {
  timer(+this.dataset.time);
}

//---------------------------------------------

function setCustomTimer(e) {
  e.preventDefault();
  const seconds = +minutes.value * 60;
  timer(seconds);
}

//---------------------------------------------

clearState();

timerButtons.forEach(item => item.addEventListener('click', setTimer));
form.addEventListener('submit', setCustomTimer)
