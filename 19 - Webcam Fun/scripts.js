const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  const params = {video: true, audio: false};
  navigator.mediaDevices.getUserMedia(params)
    .then(localMediaStream => {
      // console.log(video.src);
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => console.log('No webcam — no video : (',err));
}

function paintToCanvas() {
  const height = video.videoHeight;
  const width = video.videoWidth;

  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    const maxSteps = 100;
    const step = canvas.height / maxSteps;

    // for (var i = 0; i < maxSteps; i++) {
    //   const rowPos = i * step;
    //   let imgData = ctx.getImageData(0, rowPos, canvas.width, step);
    //   if ( i % 2 ) {
    //     imageData = rgbSplit(imgData);
    //   }
    //   else {
    //     imageData = rgbSplitBack(imgData);
    //   }
    //
    //   ctx.putImageData(imgData, 0, rowPos);
    // }

    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // // console.log(imgData);
    // imageData = redFilter(imgData);
    // imageData = invert(imgData);
    // imageData = grayscale(imgData);
    // imageData = rgbSplit(imgData);
    // ctx.globalAlpha = .1;

    // imageData = greenScreen(imgData);
    ctx.putImageData(imgData, 0, 0);

  }, 16);
}

function grayscale(pixels) {
  const data = pixels.data;
  for (let i = 0; i < data.length; i += 4) {
    const avrg = (data[i + 0] + data[i + 1] + data[i + 2]) / 3;
    data[i + 0] = avrg;
    data[i + 1] = avrg;
    data[i + 2] = avrg;
  }
  return pixels;
}

function sepia(pixels) {
  const data = pixels.data;
  for (let i = 0; i < data.length; i += 4) {
    const avrg = (data[i + 0] + data[i + 1] + data[i + 2]) / 3;
    data[i + 0] = avrg + 50;
    data[i + 1] = avrg + 40;
    data[i + 2] = avrg;
  }
  return pixels;
}

function redFilter(pixels) {
  const data = pixels.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = data[i + 0] + 100;
    data[i + 1] = data[i + 1] - 50;
    data[i + 2] = data[i + 2] * .5;
  }
  return pixels;
}

function rgbSplit(pixels) {
  const data = pixels.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i - 150] = data[i + 0];
    data[i + 100] = data[i + 1];
    data[i - 150] = data[i + 2];
  }
  return pixels;
}
function rgbSplitBack(pixels) {
  const data = pixels.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i + 150] = data[i + 0];
    data[i - 100] = data[i + 1];
    data[i + 150] = data[i + 2];
  }
  return pixels;
}

function invert(pixels) {
  const data = pixels.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = 255 - data[i + 0];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  });

  // console.log(levels.rmin, levels.rmax);

  const data = pixels.data;
  for (let i = 0; i < pixels.data.length; i += 4) {
    // console.log(i);
    let red = pixels.data[i + 0];
    let green = pixels.data[i + 1];
    let blue = pixels.data[i + 2];
    let alpha = pixels.data[i + 3];

    if( red >= levels.rmin && red <= levels.rmax
        && green >= levels.gmin && green <= levels.gmax
        && blue >= levels.bmin && blue <= levels.bmax){
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg', 60);
  const img = document.createElement('img');
  img.src = data;

  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download','Hi there');
  link.appendChild(img);

  strip.insertBefore(link, strip.firstChild);

}

getVideo();
video.addEventListener('canplay', paintToCanvas);
