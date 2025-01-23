// Added buttons for better management and seperate from script.js its more organized that way so yipeee
document.querySelector('button[onclick*="grayscale"]').addEventListener('click', () => applyFilter('grayscale')); //regular old button
document.querySelector('button[onclick*="sepia"]').addEventListener('click', () => applyFilter('sepia'));
document.querySelector('button[onclick*="blur"]').addEventListener('click', () => applyFilter('blur'));
document.querySelector('button[onclick*="vintage"]').addEventListener('click', () => applyFilter('vintage'));
document.querySelector('button[onclick*="pixelate"]').addEventListener('click', pixelate);
document.getElementById('brightness-slider').addEventListener('input', updateFilters); //sliders
document.getElementById('contrast-slider').addEventListener('input', updateFilters);
document.getElementById('saturation-slider').addEventListener('input', updateFilters);
document.getElementById('hue-rotate-slider').addEventListener('input', updateFilters);
document.getElementById('blur-slider').addEventListener('input', () => applyFilter('blur'));
document.getElementById('pixelate-slider').addEventListener('input', pixelate);
document.querySelector('button[onclick*="saveImage"]').addEventListener('click', saveImage); //save image