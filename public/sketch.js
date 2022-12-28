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

// let BRUSHSIZE = 0.007;  // 0.01, 0.006, 0.005, 0.003, 0.001
let TRIANGLECOUNT = getRandomFromList([200, 300]); // 100- 300 - enough, 300, 400 cool - 1200 for full bodies
// points, pupsel, plain, naked
let PICKER = [0.2, 0.5, 0.8];
// let PICKER = [0, 0, 1];  // only plain
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
    "background": ["#adadad", "#707070"],
    "pixelColors": ["#303030", "#6b6b6b", "#eeeeee"],
  },
  // "the admiral duo": {
  //   "background": ["#DE5B34", "#312A3C"],
  //   "pixelColors": ["#16202b", "#0f447c", "#5a84bb", "#91c6f5"],
  // },
  // "Augenarzt": {
  //   "background": ["#DE5B34", "#312A3C"],
  //   "pixelColors": ["#DE5B34", "#312A3C", "#A92D0F", "#4C475D", "#F97D54", "#292233"],
  // },
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
  // "chocolata": {
  //   "background": "#211103",
  //   "pixelColors": ["#3D1308", "#7B0D1E", "#be2a51"],  //  "#242424ff", "#99409cff"
  // },
  // "vota": {
  //   "background": "#364652",
  //   "pixelColors": ["#0C1618", "#BFB1C1", "#B5BEC6"],  //  "#D1AC00"
  // },
  // "Lorelei": {
  //   "background": "#212f61",
  //   "pixelColors": ["#030027", "#F2F3D9", "#DC9E82"],
  // },
  // "Idefix": {
  //   "background": "#35363a",
  //   "pixelColors": ["#CF5C36", "#7C7C7C", "#EEE5E9"],
  // },
  // "357": {
  //   "background": "#55868C",
  //   "pixelColors": ["#C8AB83", "#EEC584", "#CACAAA"],
  // },
  // "Bonbon": {
  //   "background": "#FEF9EF",
  //   "pixelColors": ["#227C9D", "#17C3B2", "#FFCB77"],
  // },
  // "Advent": {
  //   "background": "#282A3A",
  //   "pixelColors": ["#000000", "#735F32", "#C69749"],
  // },
  // "Erli": {
  //   "background": "#E7DFD5",
  //   "pixelColors": ["#84A9AC", "#3B6978", "#204051"],
  // },
  // "Erli": {
  //   "background": "#E5E5CB",
  //   "pixelColors": ["#1A120B", "#D5CEA3", "#3C2A21"],
  // },
  // "Vorarlberg": {
  //   "background": "#9db3a2",
  //   "pixelColors": ["#5F7161", "#EFEAD8", "#b4a898"],
  // },
  // "Unicorn": {
  //   "background": "#BF5CAA",
  //   "pixelColors": ["#EADADA", "#D59DC5", "#4D3A4D"],
  // },
  // "Poncho": {
  //   "background": "#F32424",
  //   "pixelColors": ["#9772FB", "#F2F2F2", "#764AF1"],
  // },
  // "Hader im Keller": {
  //   "background": "#474E68",
  //   "pixelColors": ["#404258", "#50577A", "#6B728E"],
  // },
  // "International": {
  //   "background": "#c9bb79",
  //   "pixelColors": ["#EAE1E1", "#03051E", "#0B5269"],
  // },
  // "Kinetics": {
  //   "background": "#709FB0",
  //   "pixelColors": ["#4A47A3", "#413C69", "#A7C5EB"],
  // },
  // "Korridor": {
  //   "background": "#424242",
  //   "pixelColors": ["#b19c83", "#81f3eb", "#a73a3a"],
  // },
  // "Brutus": {
  //   "background": "#ECDBBA",
  //   "pixelColors": ["#c55b46", "#3e5883", "#191919"],
  // },
  // "Jumbo": {
  //   "background": "#638dc9",
  //   "pixelColors": ["#1d2949", "#fff0d4", "#C4DDFF"],
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
