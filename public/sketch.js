const NOISESEED = hashFnv32a(fxhash);
// console.log("Noise seed: " + NOISESEED);


let PROFILES = {
  title: "fine",
  Resolution: 600,
  Brushsize: 0.001,
  TRIANGLECOUNT: 200,
  GEARBUFFERCOUNT: 20,
  title: "furry",
  Resolution: 600,
  Brushsize: 0.01,
  TRIANGLECOUNT: 200,
  GEARBUFFERCOUNT: 20,
}

let RESOLUTION = 500; // how many dots per dominantside length, 200 - 700, 800 top
let BRUSHSIZE;
// let BRUSHSIZE = 0.007;  // 0.01, 0.006, 0.005, 0.003, 0.001
let TRIANGLECOUNT = 200; // 200 - enough, 300, 400 cool - 1200 for full bodies
let GEARBUFFERCOUNT = 20;  // how many buffers for rotation

let startTime, endTime;
let canvas;
let rescaling_width;
let rescaling_height;

let backgroundTexture;

let ANIMATIONSTATE = false;
let PALETTE;
let PALETTE_LABEL;
let ALLDONE = false;
let DOMINANTSIDE;  // side which is the limiting factor

let FRAMEDWIDTH = 800;
let FRAMED = false;

let TITLE = "I like its informality";
let ARTIST = "Stefan Schwaha, @sektionschef";
let DESCRIPTION = "Javascript on html canvas";
let URL = "https://digitalitility.com";
let YEAR = "2022";
let PRICE = "ꜩ 1";
let EDITIONS = "50 editions";

let CURRENTPIXELDENS = 1;


const PALETTESYSTEM = {
  "by the power of greyscale": {
    // OLD "background": "#858585",
    // OLD "pixelColors": ["#303030", "#5c5c5c", "#adadad", "#eeeeee"],
    "background": "#adadad",
    "pixelColors": ["#303030", "#6b6b6b", "#eeeeee"],
  },
  // "the admiral": {
  //   "background": "#a3b2c4",
  //   "pixelColors": ["#16202b", "#0f447c", "#5a84bb", "#91c6f5"],
  // },
  // "the smokol": {
  //   "background": "#96a1b3ff",
  //   "pixelColors": ["#242f40ff", "#cca43bff", "#7e7e7eff", "#ddddddff"],
  // },
  // "jeunesse": {
  //   "background": "#c1c2c4ff",
  //   "pixelColors": ["#cf773bff", "#279ca0ff", "#242424ff"],  //  "#242424ff", "#99409cff"
  // },
  // "duo": {
  //   "background": "#C7C757",
  //   "pixelColors": ["#FBFBA0", "#8E1C3C", "#790724"],  //  "#242424ff", "#99409cff"
  // },

}

choosePalette();

function preload() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // console.log("CURRENTPIXELDENS: " + CURRENTPIXELDENS);

  // if (urlParams.has('infinity')) {
  //   INFINITYSTRING = urlParams.get('infinity');
  //   INFINITY = (INFINITYSTRING === 'true');
  // }
  // console.log("INFINITY: " + INFINITY);

  if (urlParams.has('framed')) {
    if (urlParams.get("framed") === "true") {
      FRAMED = true;
    }
  }

  if (urlParams.has('animated')) {
    if (urlParams.get("animated") === "true") {
      ANIMATIONSTATE = true;
    }
  }

  if (FRAMED) {
    setFrameHTML();
    // setLabelHTML();
  } else {
    setPlainHTML();
  }
  setTagsHTML();


}

function setup() {
  startTime = performance.now()

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);

  // setAttributes('alpha', true);
  // setAttributes('antialias', true);

  rescaling_width = 4000;
  rescaling_height = 4000;
  DOMINANTSIDE = 4000;

  canvas = createCanvas(rescaling_width, rescaling_height);

  canvas.id('badAssCanvas');
  if (FRAMED) {
    canvas.parent("canvasHolderFrame");
  } else {
    canvas.parent("canvasHolderPlain");
  }

  // TEXTURE EXAMPLE
  // textureEx = new PopselTexture({
  //   "color": color(150),
  //   "coords": [[0, 0], [width, 0], [width, height], [0, height]],
  //   "A": createVector(0, 0),
  //   "B": createVector(0, 0),
  //   "C": createVector(0, 0),
  // });

  // hatch example
  // A1 = createVector(0.2 * DOMINANTSIDE, width / 2, 0);
  // A2 = createVector(0.6 * DOMINANTSIDE, width / 2, 0);
  // B1 = createVector(0.2 * DOMINANTSIDE, height / 2 - 100, 0);
  // B2 = createVector(0.6 * DOMINANTSIDE, width / 2 + 100, 0);

  // mastahatch = new Hatch(A1, A2, color("#363636"), "", hatchSystem.buffer);
  // hatchSystem.add(mastahatch);
  // mastahatch2 = new Hatch(B1, B2, color("#181818"), "", hatchSystem.buffer);
  // hatchSystem.add(mastahatch2);

  backgroundTexture = new BackgroundTexture();

  // triangleSystem = new TriangleSystem();

  let hatchColor = color(red(color(PALETTE.background)) - 40, green(color(PALETTE.background)) - 40, blue(color(PALETTE.background)) - 40);
  hatchSystem = new hatchSystem(0, 0, width, height, DOMINANTSIDE * 0.015, hatchColor);
  while (hatchSystem.check_all_complete() == false) {
    hatchSystem.show();
  }


}


function draw() {

  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);

    showArt();
    fxpreview();

    let endTime = performance.now()
    console.log(`It took ${(endTime - startTime) / 1000} seconds.`)
    // background(170);
  }


  if (ANIMATIONSTATE) {
    showArt();
  }
  // image(textureEx.buffer, 0, 0);

}

function mousePressed() {
}

function showArt() {
  background(PALETTE.background);
  image(backgroundTexture.buffer, 0, 0);
  image(hatchSystem.buffer, 0, 0);
  // triangleSystem.show();
}
