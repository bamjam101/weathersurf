const redBtn = document.querySelector("#red");
const yellowBtn = document.querySelector("#yellow");
const greenBtn = document.querySelector("#green");

redBtn.addEventListener('click', () => {
    document.documentElement.style.setProperty('--dark', getComputedStyle(document.documentElement).getPropertyValue('--red'));
    document.documentElement.style.setProperty('--txt-color', getComputedStyle(document.documentElement).getPropertyValue('--txt-light'));
});

yellowBtn.addEventListener('click', () => {
    document.documentElement.style.setProperty('--dark', getComputedStyle(document.documentElement).getPropertyValue('--yellow'));
    document.documentElement.style.setProperty('--txt-color', getComputedStyle(document.documentElement).getPropertyValue('--txt-dark'));
});

greenBtn.addEventListener('click', () => {
    document.documentElement.style.setProperty('--dark', getComputedStyle(document.documentElement).getPropertyValue('--green'));
    document.documentElement.style.setProperty('--txt-color', getComputedStyle(document.documentElement).getPropertyValue('--txt-light'));
});