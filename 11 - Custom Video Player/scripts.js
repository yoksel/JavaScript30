console.log('hi');

const doc = document;
const player = doc.querySelector('.player');
const video = player.querySelector('.player__video');
const toggle = player.querySelector('.toggle');
const progress = player.querySelector('.progress');
const progressFilled = player.querySelector('.progress__filled');
const skipButtons = player.querySelectorAll('button[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
let isDragging = false;

// console.log(video);

// cur = ?
// dur = 100%

//---------------------------------------------

video.addEventListener('click', startStop);
video.addEventListener('play', () => toggle.classList.toggle('toggle--paused'));
video.addEventListener('pause', () => toggle.classList.toggle('toggle--paused'));
toggle.addEventListener('click', startStop);

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 32) {
    startStop();
  }
  else if (e.keyCode === 37) {
    skip(-10);
  }
  else if (e.keyCode === 39) {
    skip(10);
  }
});

function startStop() {
  if( video.paused ) {
    video.play();
  }
  else {
    video.pause();
  }
}

//---------------------------------------------

function updateProgress() {
  var progress = video.currentTime * 100 / video.duration;
  progressFilled.style.flexBasis = `${progress}%`;
}

video.addEventListener('timeupdate', () => {
  updateProgress();
});

//---------------------------------------------

function grabProgress(e) {
  // console.log(e.type);
  const newTime = e.offsetX / progress.scrollWidth * 100;
  progressFilled.style.flexBasis = `${progress}%`;
  const currentTime = newTime * video.duration / 100;
  video.currentTime = currentTime;
}

progress.addEventListener('click', grabProgress);
progress.addEventListener('mousemove', (e) => isDragging && grabProgress(e));
progress.addEventListener('mousedown',  () => isDragging = true);

progress.addEventListener('mouseup', () => isDragging = false);

//---------------------------------------------

function skip( ...vars ) {
  const skipVal = typeof vars[0] === 'number' ? vars[0] : +this.dataset.skip;
  let finalTime = video.currentTime + skipVal;

  if (finalTime > video.duration) {
    finalTime = video.duration;
  }
  else if (finalTime < 0) {
    finalTime = 0;
  }

  video.currentTime = finalTime;
}

skipButtons.forEach(item => item.addEventListener('click', skip));

//---------------------------------------------

function changeRange() {
  video[this.name] = this.value;
}

ranges.forEach(item => item.addEventListener('input', changeRange));
