//GLOBAL VARIABLES
const canvas = document.querySelector('canvas'),
  toolBtns = document.querySelectorAll('.tool'),
  fillColor = document.querySelector('#fill-color'),
  sizeSlider = document.querySelector('#size-slider'),
  colorBtns = document.querySelectorAll('.colors .option'),
  colorPicker = document.querySelector('#color-picker'),
  clearCanvas = document.querySelector('.clear-canvas'),
  saveImg = document.querySelector('.save-img');

//VARIABLES WITH DEFAULT VALUES
let ctx = canvas.getContext('2d'),
  isDrawing = false,
  brushWidth = 3,
  selectedTool = 'brush',
  selectedColor = '#000',
  prevMouseX,
  prevMouseY,
  snapshot;

//SETTING CANVAS' HEIGHT AND WIDTH
window.addEventListener('load', () => {
  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
});

//SET CANVAS BACKGROUND
const setCanvasBg = () => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

//START DRAWING
const startDraw = e => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log(snapshot);
};

//STOP DRAWING
const stopDraw = e => {
  isDrawing = false;
};

//DRAWING RECTANGLE
const drawRectangle = e => {
  fillColor.checked
    ? ctx.fillRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
      )
    : ctx.strokeRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
      );
};

//DRAWING CIRCLE
const drawCircle = e => {
  ctx.beginPath();
  if (!fillColor.checked) {
    const radius = Math.sqrt(
      Math.pow(e.offsetX - prevMouseX, 2) + Math.pow(e.offsetY - prevMouseY, 2)
    );
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  } else {
    const radius = Math.sqrt(
      Math.pow(e.offsetX - prevMouseX, 2) + Math.pow(e.offsetY - prevMouseY, 2)
    );
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
};

//DRAWING TRIANGLE
const drawTriangle = e => {
  ctx.beginPath();
  if (!fillColor.checked) {
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    ctx.stroke();
  } else {
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    ctx.fill();
  }
};

//DRAWING
const drawing = e => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  switch (selectedTool) {
    case 'brush':
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;

    case 'rectangle':
      drawRectangle(e);
      break;

    case 'circle':
      drawCircle(e);
      break;
    case 'triangle':
      drawTriangle(e);
      break;
    case 'eraser':
      ctx.strokeStyle = '#fff';
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
  }
};

//BUTTONS
toolBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.options .active').classList.remove('active');
    btn.classList.add('active');
    selectedTool = btn.id;
  });
});

//SLIDER CHANGER
sizeSlider.addEventListener('change', () => (brushWidth = sizeSlider.value));

//COLOR CHANGER
colorBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    document.querySelector('.options .selected').classList.remove('selected');
    btn.classList.add('selected');
    console.log(btn);
    const bgColor = window
      .getComputedStyle(btn)
      .getPropertyValue('background-color');
    selectedColor = bgColor;
  });
});

//COLOR-PICKER WORK
colorPicker.addEventListener('change', () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

//CLEAR CANVAS
clearCanvas.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

//SAVE IMAGE
saveImg.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `Teebx-paint${new Date()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

//MOUSE ROLES
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', stopDraw);
