let sliderVal = document.getElementById('schoolLeniencyVal');
let slider = document.querySelector('[name="schoolLeniency"]');
sliderVal.innerText = slider.value;
slider.addEventListener('change', e => {
  sliderVal.innerText = slider.value;
});
