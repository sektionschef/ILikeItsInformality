const NOISESEED = hashFnv32a(fxhash);
// console.log("Noise seed: " + NOISESEED);

// resolution difference

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
let BRUSHSIZE = 0.006;  // 0.01, 0.006, 0.005, 0.003, 0.001
let TRIANGLECOUNT = 200; // 300, 400 cool - 1200 for full bodies
let GEARBUFFERCOUNT = 20;

let canvas;
let rescaling_width;
let rescaling_height;

let backgroundTexture;

let ANIMATIONSTATE = false;
let PALETTE;
let PALETTE_LABEL;
let ALLDONE = false;
let DOMINANTSIDE;  // side which is the limiting factor

let MARGIN;  // ??
let RESCALINGCONSTANT = 800;  // the width the painting was designed in
let FRAMEDWIDTH = 800;
let FRAMED = false;
let SPOT = false;

let TITLE = "I like its informality";
let ARTIST = "Stefan Schwaha, @sektionschef";
let DESCRIPTION = "Javascript on html canvas";
let URL = "https://digitalitility.com";
let YEAR = "2022";
let PRICE = "ꜩ 1";
let EDITIONS = "50 editions";

let CURRENTPIXELDENS = 1;

// let GRAINAMOUNT = 0.03;  // shader


const PALETTESYSTEM = {
  // "Boom": {
  //   "background": "#aaaaaa",
  //   "pixelColors": ["#303030", "#606060", "#909090", "#bbbbbb", "#eeeeee"],
  // },
  // "Fillitz": {
  //   // "background": "#ffffff",
  //   "pixelColors": ["#ffffff", "#cfcfcf", "#d6d6d6", "#c4c4c4", "#b3b3b3"],
  // },
  // "Color": {
  //   // "background": "#aaaaaa",
  //   "pixelColors": ["#ffe58e", "#dabd3c", "#896e8f", "#9b69a0", "#3f1241"],
  // },
  "ok": {
    "background": "#cfcfcf",
    "pixelColors": ["#303030", "#5c5c5c", "#adadad", "#eeeeee"],
  },
}

choosePalette();

function preload() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has('highres')) {
    CURRENTPIXELDENS = parseInt(urlParams.get('highres'));
  }
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

  if (urlParams.has('spot')) {
    if (urlParams.get("spot") === "true") {
      SPOT = true;
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
  } else if (SPOT) {
    setSpotHTML();
  } else {
    setPlainHTML();
  }
  setTagsHTML();


}

function setup() {

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
  } else if (SPOT) {
    canvas.parent("fullscreen");
  } else {
    canvas.parent("canvasHolderPlain");
  }

  triangleSystem = new TriangleSystem();

  // TEXTURE EXAMPLE
  // textureEx = new PopselTexture({
  //   "color": color(150),
  //   "coords": [[0, 0], [width, 0], [width, height], [0, height]],
  //   "A": createVector(0, 0),
  //   "B": createVector(0, 0),
  //   "C": createVector(0, 0),
  // });

  // LINES EXAMPLE
  STROKE_SIZE = 1;
  // STROKE_COLOR = color("black");
  STROKE_COLOR = color(PALETTE.background);
  STROKE_NOISE = 0;
  STROKE_NOISE_2 = 0;
  STROKE_DISTORT = 0;
  SCALING_FACTOR = 1;
  linesEx = new Lines(0, 0, width, height, 0, 0, DOMINANTSIDE * 0.01);

  for (var i = 0; i < 4000; i++) {
    // while (linesEx.all_lines_complete == false) {
    linesEx.show();
  }

  backgroundTexture = createGraphics(width, height);
  var stepSize = DOMINANTSIDE * 0.003;
  for (var y = 0; y <= height; y += stepSize) {
    for (var x = 0; x <= width; x += stepSize) {

      backgroundTexture.fill(distortColorSuperNew(PALETTE.background, 5))
      // backgroundTexture.noFill();
      backgroundTexture.strokeWeight(DOMINANTSIDE * 0.0005);
      backgroundTexture.stroke(distortColorSuperNew(PALETTE.background, 10));
      backgroundTexture.rect(x, y, stepSize, stepSize);
    }
  }



}


function draw() {

  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);

    showArt();
    fxpreview();
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
  image(backgroundTexture, 0, 0);
  image(linesEx.buffer, 0, 0);
  triangleSystem.show();
}
