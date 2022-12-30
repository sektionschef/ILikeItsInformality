const NOISESEED = hashFnv32a(fxhash);
// console.log("Noise seed: " + NOISESEED);

let TRIANGLECOUNT = getRandomFromList([200, 250, 300]); // 100- 300 - enough, 300, 400 cool - 1200 for full bodies
// points, pupsel, plain, naked
console.log("trianglecount: " + TRIANGLECOUNT);
let PICKER = getRandomFromList([[0.2, 0.5, 0.8], [0.1, 0.5, 0.9], [0, 0, 1]]);
console.log("Picker: " + PICKER);
// let PICKER = [0, 0, 1];  // only plain

let GEARBUFFERCOUNT = 20;  // how many buffers for rotation
let startTime, endTime;
let canvas;
let rescaling_width;
let rescaling_height;

let backgroundTexture;

let ANIMATIONSTATE = true;
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
let YEAR = "2023";
let PRICE = "ꜩ 1";
let EDITIONS = "100 editions";

let CURRENTPIXELDENS = 1;


const PALETTESYSTEM = {
  "by the power of greyscale": {
    "background": ["#adadad", "#707070"],
    "pixelColors": ["#303030", "#6b6b6b", "#eeeeee"],
  },
  "the admiral duo": {
    "background": ["#DE5B34", "#312A3C"],
    "pixelColors": ["#16202b", "#0f447c", "#5a84bb", "#91c6f5"],
  },
  "the admiral": {
    "background": ["#a3b2c4", "#808d9c"],
    "pixelColors": ["#16202b", "#0f447c", "#5a84bb", "#91c6f5"],
  },
  "the smokol": {
    "background": ["#96a1b3ff", "#595f69ff"],
    "pixelColors": ["#242f40ff", "#cca43bff", "#7e7e7eff", "#ddddddff"],
  },
  "jeunesse": { // andrea
    "background": ["#bd4d3eff", "#993f33ff"],
    "pixelColors": ["#cfa83bff", "#0f9ba0ff", "#242424ff"],
  },
  "chocolata": {
    "background": ["#211103", "#3f2107"],
    "pixelColors": ["#3D1308", "#d3305b"],  // "#7B0D1E", 
  },
  "Vota": {
    "background": ["#364652", "#465a69"],
    "pixelColors": ["#0C1618", "#bea0c2", "#B5BEC6"],  //  "#D1AC00"
  },
  "Lorelei": {
    "background": ["#212f61", "#31458d"],
    "pixelColors": ["#030027", "#F2F3D9", "#DC9E82"],
  },
  "Idefix": {
    "background": ["#35363a", "#4f5157"],
    "pixelColors": ["#CF5C36", "#523e31", "#EEE5E9"],
  },
  "357": {
    "background": ["#55868C", "#41666b"],
    "pixelColors": ["#C8AB83", "#EEC584", "#CACAAA"],
  },
  "Bonbon": {
    "background": ["#fd9090", "#dd7d7d"],
    "pixelColors": ["#386a7c", "#58b1a8", "#fabc5a"],
  },
  "Advent": {
    "background": ["#282A3A", "#7e6134"],
    "pixelColors": ["#000000", "#735F32", "#C69749"],
  },
  "Erli": {
    "background": ["#E7DFD5", "#bdccce"],
    "pixelColors": ["#84A9AC", "#3B6978", "#204051"],
  },
  "Bärli": {
    "background": ["#5d5866", "#524c5a"],
    "pixelColors": ["#D5CEA3", "#3C2A21", "#1A120B"],  // "#1A120B"
  },
  "Vorarlberg": {
    "background": ["#9db3a2", "#7e9483"],
    "pixelColors": ["#5F7161", "#EFEAD8", "#b4a898"],
  },
  "Unicorn": {
    "background": ["#BF5CAA", "#a54f92"],
    "pixelColors": ["#EADADA", "#D59DC5", "#4D3A4D"],
  },
  "Hader im Keller": {
    "background": ["#c4a475", "#d6b27d"],
    "pixelColors": ["#24252e", "#50577A", "#8c98ca"],
  },
  "International": {
    "background": ["#cac7b6", "#9b998e"],
    "pixelColors": ["#EAE1E1", "#03051E", "#0B5269"],
  },
  "Kinetics": {
    "background": ["#f8d3d3", "#ffc4c4"],
    "pixelColors": ["#4a46b4", "#413C69", "#A7C5EB"],
  },
  "Korridor": {
    "background": ["#424242", "#303030"],
    "pixelColors": ["#b19c83", "#64c2bc", "#a73a3a"],
  },
  "Jumbo": {
    "background": ["#638dc9", "#5a81b8"],
    "pixelColors": ["#1d2949", "#ddcfb4", "#C4DDFF"],
  },
  "Brutus": {
    "background": ["#dac289", "#bea977"],
    "pixelColors": ["#8ad1f7", "#0778C2", "#034370"],
  },
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

  backgroundTexture = new BackgroundTexture(color(PALETTE.background[0]));
  hatchSystem = new hatchSystem(0, 0, width, height, DOMINANTSIDE * 0.015, color(PALETTE.background[1]));

  triangleSystem = new TriangleSystem();
}


function draw() {

  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);

    showArt();
    fxpreview();

    let endTime = performance.now()
    // console.log(`It took ${(endTime - startTime) / 1000} seconds.`)
    // background(170);

    // exportCanvas(canvas, true);
  }


  if (ANIMATIONSTATE) {
    showArt();
  }
  // image(textureEx.buffer, 0, 0);

}

function mousePressed() {
}

function showArt() {
  background(PALETTE.background[0]);
  image(backgroundTexture.buffer, 0, 0);
  image(hatchSystem.buffer, 0, 0);
  triangleSystem.show();
}
