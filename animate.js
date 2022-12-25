const redBtn = document.querySelector("#red");
const yellowBtn = document.querySelector("#yellow");
const greenBtn = document.querySelector("#green");

const svgElement = document.querySelector(".wave");

redBtn.addEventListener('click', () => {
    svgElement.innerHTML = `
    <g mask="url(&quot;#SvgjsMask1154&quot;)" fill="none">
        <rect width="1440" height="560" x="0" y="0" fill="url(#SvgjsLinearGradient1155)"></rect>
        <path d="M 0,60 C 72,89.8 216,209.8 360,209 C 504,208.2 576,61.4 720,56 C 864,50.6 936,175.6 1080,182 C 1224,188.4 1368,106.8 1440,88L1440 560L0 560z" fill="rgba(117, 35, 35, 1)"></path>
        <path d="M 0,334 C 144,354 432,434.6 720,434 C 1008,433.4 1296,351.6 1440,331L1440 560L0 560z" fill="rgba(143, 22, 22, 1)"></path>
    </g>
    <defs>
        <mask id="SvgjsMask1154">
            <rect width="1440" height="560" fill="#ffffff"></rect>
        </mask>
        <linearGradient x1="15.28%" y1="-39.29%" x2="84.72%" y2="139.29%" gradientUnits="userSpaceOnUse" id="SvgjsLinearGradient1155">
            <stop stop-color="#0e2a47" offset="0"></stop>
            <stop stop-color="rgba(200, 27, 27, 1)" offset="1"></stop>
        </linearGradient>
    </defs>
    `;
});

yellowBtn.addEventListener('click', () => {
    svgElement.innerHTML = `
    <g mask="url(&quot;#SvgjsMask1223&quot;)" fill="none">
      <rect width="1440" height="560" x="0" y="0" fill="url(#SvgjsLinearGradient1224)"></rect>
      <path
        d="M 0,60 C 72,89.8 216,209.8 360,209 C 504,208.2 576,61.4 720,56 C 864,50.6 936,175.6 1080,182 C 1224,188.4 1368,106.8 1440,88L1440 560L0 560z"
        fill="rgba(83, 83, 5, 1)"></path>
      <path d="M 0,334 C 144,354 432,434.6 720,434 C 1008,433.4 1296,351.6 1440,331L1440 560L0 560z"
        fill="rgba(150, 127, 21, 1)"></path>
    </g>
    <defs>
      <mask id="SvgjsMask1223">
        <rect width="1440" height="560" fill="#ffffff"></rect>
      </mask>
      <linearGradient x1="15.28%" y1="-39.29%" x2="84.72%" y2="139.29%" gradientUnits="userSpaceOnUse"
        id="SvgjsLinearGradient1224">
        <stop stop-color="#0e2a47" offset="0"></stop>
        <stop stop-color="rgba(108, 110, 46, 1)" offset="1"></stop>
      </linearGradient>
    </defs>
    `;
});

greenBtn.addEventListener('click', () => {
    document.documentElement.style.setProperty('--dark', getComputedStyle(document.documentElement).getPropertyValue('--green'));
    svgElement.innerHTML = `
    <g mask="url(&quot;#SvgjsMask1390&quot;)" fill="none">
        <rect width="1440" height="560" x="0" y="0" fill="url(#SvgjsLinearGradient1391)"></rect>
        <path d="M 0,102 C 144,127.4 432,244 720,229 C 1008,214 1296,67.4 1440,27L1440 560L0 560z" fill="rgba(23, 94, 37, 1)"></path>
        <path d="M 0,352 C 72,392.6 216,549.2 360,555 C 504,560.8 576,395.8 720,381 C 864,366.2 936,497.6 1080,481 C 1224,464.4 1368,334.6 1440,298L1440 560L0 560z" fill="rgba(20, 81, 36, 1)"></path>
    </g>
    <defs>
        <mask id="SvgjsMask1390">
            <rect width="1440" height="560" fill="#ffffff"></rect>
        </mask>
        <linearGradient x1="15.28%" y1="-39.29%" x2="84.72%" y2="139.29%" gradientUnits="userSpaceOnUse" id="SvgjsLinearGradient1391">
            <stop stop-color="#0e2a47" offset="0"></stop>
            <stop stop-color="rgba(27, 124, 16, 1)" offset="1"></stop>
        </linearGradient>
    </defs>
    `;
});

