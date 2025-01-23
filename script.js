const canvas = document.getElementById('canvas'); //my grammar when talking: stock graph downnnnn my grammar when i have to write good looking js: stock graph up!!!1
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('image-upload');
const colorPicker = document.getElementById('color-picker'); // new color picker
let img = new Image();
let drawing = false;
let currentColor = '#ff0000'; // default color shall be red, just red nothing else
let scale = 1;
let offsetX = 0;
let offsetY = 0;

function loadDefaultImage() {
    img.src = "default-image.jpg"; //change to whatever you like or even easier, change filename to default-image when forking teehee i'd do that too dw
    img.onload = () => {
        adjustCanvasSize();
        ctx.drawImage(img, offsetX, offsetY, canvas.width, canvas.height);
    };
}

function adjustCanvasSize() {
    const aspectRatio = img.width / img.height;
    if (img.width > window.innerWidth || img.height > window.innerHeight) {
        if (aspectRatio > 1) {
            canvas.width = window.innerWidth;
            canvas.height = canvas.width / aspectRatio;
        } else {
            canvas.height = window.innerHeight;
            canvas.width = canvas.height * aspectRatio;
        }
    } else {
        canvas.width = img.width;
        canvas.height = img.height;
    }
    scale = canvas.width / img.width;
    offsetX = (canvas.width - img.width * scale) / 2;
    offsetY = (canvas.height - img.height * scale) / 2;
}

imageUpload.addEventListener('change', (e) => { //how else would you get an image, also im gonna a throw in a example image for those demoing
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        img.onload = function() {
            adjustCanvasSize();
            ctx.drawImage(img, offsetX, offsetY, canvas.width, canvas.height);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

colorPicker.addEventListener('change', (e) => { // update the current color when the color picker value changes
    currentColor = e.target.value;
});

function applyFilter(filter) { //got inspired to make this project when i was bored and searched for ctx filter and found out theres actually a bunch of good intergrated filters into your browser (sorry safari ios users!)
    if (!img) return;

    ctx.filter = 'none';
    switch (filter) {
        case 'grayscale':
            ctx.filter = 'grayscale(100%)';
            break;
        case 'sepia':
            ctx.filter = 'sepia(100%)';
            break;
        case 'blur':
            const blurValue = document.getElementById('blur-slider').value + 'px';
            ctx.filter = `blur(${blurValue})`;
            break;
        case 'vintage':
            ctx.filter = 'contrast(1.5) brightness(1.2)';
            break;
    }
    ctx.drawImage(img, offsetX, offsetY, canvas.width, canvas.height);
}

function pixelate() { //pixelation is so good yet it had me geeking with math and imagedata, reminds me of my python days
    if (!img) return;
    const pixelSize = parseInt(document.getElementById('pixelate-slider').value);
    const width = canvas.width;
    const height = canvas.height;
    ctx.drawImage(img, offsetX, offsetY, width, height);
    const imageData = ctx.getImageData(0, 0, width, height); //this will retrieve all the image data from the beginning coord to the last cord which is width and height of image
    const data = imageData.data;

    for (let y = 0; y < height; y += pixelSize) { //beginning, yet so important but its just essentials
        for (let x = 0; x < width; x += pixelSize) {
            const i = (y * width + x) * 4;
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            for (let dy = 0; dy < pixelSize; dy++) { // NOW this is where the pixelation will happen
                for (let dx = 0; dx < pixelSize; dx++) { //keyword is pixelSize
                    if (x + dx < width && y + dy < height) {
                        const j = ((y + dy) * width + (x + dx)) * 4;
                        data[j] = red;
                        data[j + 1] = green;
                        data[j + 2] = blue;
                    }
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0); //without this, you would've wasted your precious clock cycles without it ever updating 
}

function saveImage() { //is the name cool, funfact you can also save the image by right clicking your canvas and clicking save image
    const link = document.createElement('a');
    link.download = 'Reyal_image.png';
    link.href = canvas.toDataURL();
    link.click();
}

function updateFilters() { //little refresh i made. 4 in 1, helps to combine them in one, but they act very aggressively with filters or blur/pixelater
    if (!img) return;

    const brightness = document.getElementById('brightness-slider').value / 100;
    const contrast = document.getElementById('contrast-slider').value / 100;
    const saturation = document.getElementById('saturation-slider').value / 100;
    const hueRotate = document.getElementById('hue-rotate-slider').value;

    ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) hue-rotate(${hueRotate}deg)`;
    ctx.drawImage(img, offsetX, offsetY, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', startDrawing); //very complex!!1111
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

function startDrawing(event) {
    drawing = true; //mind blowing, see how when im drawing the draw is true, but when it isnt its false, pure logic!!! 
    draw(event);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(event) { //draw
    if (!drawing) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor; // use the current color for drawing

    const rect = canvas.getBoundingClientRect(); //tried best to implement cursor/scale synchronizing, i semi succeeded, current fix is zooming out to 80%
    const x = (event.clientX - rect.left - offsetX) / scale;
    const y = (event.clientY - rect.top - offsetY) / scale;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Add event listeners for live updating the blur and pixelate filters, because when I was messing with earlier revision, it just won't update properly.
document.getElementById('blur-slider').addEventListener('input', () => applyFilter('blur'));
document.getElementById('pixelate-slider').addEventListener('input', pixelate);

// Load the default image on page load to not mess with canvas
window.onload = loadDefaultImage;