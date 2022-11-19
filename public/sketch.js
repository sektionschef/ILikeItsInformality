const MODE = 1  // "FINE ART";
// const MODE = 2  // DEBUG MESSAGES
// const MODE = 5 // all debug messages

const NOISESEED = hashFnv32a(fxhash);
if (MODE > 1) {
  console.log("Noise seed: " + NOISESEED);
}

let canvas;
let rescaling_width;
let rescaling_height;

let PALETTE;
let PALETTE_LABEL;
let ALLDONE = false;
let DOMINANTSIDE;  // side which is the limiting factor

let RESCALINGCONSTANT = 800;  // the width the painting was designed in
let FRAMEDWIDTH = 800;
let FRAMED = false;

let TITLE = "Oida";
let ARTIST = "Stefan Schwaha, @sektionschef";
let DESCRIPTION = "Javascript on html canvas";
let URL = "https://digitalitility.com";
let YEAR = "2022";
let PRICE = "ꜩ 1";
let EDITIONS = "50 editions";

let CURRENTPIXELDENS = 1;

// let GRAINAMOUNT = 0.03;  // shader
// let TIMINGSTATE = "Start";

// let BRUSHFULLSPEEDMIN = 2;
// let BRUSHFULLSPEEDMAX = 6;
// let BRUSHFULLSPEED = Math.round(getRandomFromInterval(BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX) * 100) / 100;
// let BRUSHFULLSPEEDLABEL = label_feature(BRUSHFULLSPEED, BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX);

// let ROUGHYPUFFYRANGE = [0.1, 0.2, 0.3];
// let ROUGHYPUFFY = getRandomFromList(ROUGHYPUFFYRANGE);
// console.log("ROUGHYPUFFY:" + ROUGHYPUFFY);
// let ROUGHYPUFFYLABEL = label_feature(ROUGHYPUFFY, Math.min(...ROUGHYPUFFYRANGE), Math.max(...ROUGHYPUFFYRANGE));

// let BRUSHDIRECTIONLABEL;
// let BRUSHDIRECTION = getRandomFromList([0.25, 0.5, 0.75]);
// console.log("BRUSHDIRECTION:" + BRUSHDIRECTION);
// if (BRUSHDIRECTION == 0.25) {
//   BRUSHDIRECTIONLABEL = "horizontal";
// } else if (BRUSHDIRECTION == 0.5) {
//   BRUSHDIRECTIONLABEL = "both";
// } else {
//   BRUSHDIRECTIONLABEL = "vertical";
// };

const PALETTESYSTEM = {
  "Boom": {
    "background": "#8181BB",
    "line": "#17171d4f",
    "base": {
      fillFirst: "#9D9DCD15",
      fillSecond: "#9D9DCD15",
      strokeFirst: "#7f7fda9f",
      strokeSecond: "#7d7dc7a8",
      grainColorFirst: "#9c9cd8",  // 7d7dcc
      grainColorSecond: "#8989c4",
    },
    "cLevel": {
      fillFirst: "#4F4F8D15",
      fillSecond: "#45458515",
      strokeFirst: "#03031a15",
      strokeSecond: "#01010815",
      grainColorFirst: "#5555944f",
      grainColorSecond: "#4f4f8067",
    },
    "bLevel": {
      fillFirst: "#B9B9DF15",
      fillSecond: "#aeaed315",
      strokeFirst: "#5a5a6b15",
      strokeSecond: "#4f4f6615",
      grainColorFirst: "#8080af38",
      grainColorSecond: "#b6b6da59",
    },
    "aLevel": {
      fillFirst: "#6666A915",
      fillSecond: "#59599115",
      strokeFirst: "#2b2b5215",
      strokeSecond: "#42428815",
      grainColorFirst: "#40404b38",
      grainColorSecond: "#1a1a2059",
    }
  },
}

choosePalette();

function preload() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has('highres')) {
    CURRENTPIXELDENS = parseInt(urlParams.get('highres'));
  }
  if (MODE > 1) {
    console.log("CURRENTPIXELDENS: " + CURRENTPIXELDENS);
  }

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

  if (FRAMED) {
    setFrameHTML();
    setLabelHTML();
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

  scaleDynamically();

  // canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  canvas = createCanvas(rescaling_width, rescaling_height);

  canvas.id('badAssCanvas');
  if (FRAMED) {
    canvas.parent("canvasHolderFrame");
  } else {
    canvas.parent("canvasHolderPlain");
  }

  // camM = createCamera();
  // cam1 = createCamera();
  // cam1.perspective();
  // cam1.ortho();

  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  // cam1.lookAt(-100, 0, 0);
  // cam1.setPosition(1200, 200, 500);

  // setCamera(cam1);

  if (MODE > 1) {
    console.log("Display density: " + displayDensity());
    // console.log("Pixel density: " + pixelDensity())
  }

  gridly_background = new Gridly({
    countX: 50,
    countY: 100,
    marginX: width * 0.03,
    marginY: height * 0.03,
    distortX: width * 0.01,
    distortY: height * 0.01, // 0.04
    once: false,
  });
  gridly_foreground = new Gridly({
    countX: 20,
    countY: 50,
    marginX: width * 0.08,
    marginY: height * 0.08,
    distortX: width * 0.02,
    distortY: height * 0.02, // 0.04
    once: true,
  });

  // BRUSH example
  // A1 = createVector(0.2 * DOMINANTSIDE, width / 2, 0);
  // A2 = createVector(0.6 * DOMINANTSIDE, width / 2, 0);
  // B1 = createVector(0.2 * DOMINANTSIDE, height / 2 - 100, 0);
  // B2 = createVector(0.6 * DOMINANTSIDE, width / 2 + 100, 0);

  // mastaBrush = new Brush(A1, A2, color("#f55442"));
  // brushSystem.add(mastaBrush);
  // mastaBrush2 = new Brush(B1, B2, color("#f55442"));
  // brushSystem.add(mastaBrush2);

  // GRID WITH LINES
  // for (var i = 0; i < 150; i += 5) {
  //   // console.log(i);
  //   line(0, Math.round(i / 3), 130, i)
  //   brushSystem.add(new Brush(createVector(100, 500 + Math.round(i / 3), 0), createVector(230, 500 + i, 0), color("#f55442")));
  // }

  // EXAMPLES for DEV
  // brushX = new Brush(createVector(150, 200), createVector(350, 200), color("black"));
  // brushXY = new Brush(createVector(400, 450), createVector(560, 600), color("black"));
  // brushY = new Brush(createVector(300, 400), createVector(300, 800), color("black"));
  // brushYX = new Brush(createVector(400, 600), createVector(560, 450), color("black"));

  // brushBug = new Brush(createVector(807, 50), createVector(807, 898));

  // hatchesHigh = new Hatches("yx", createVector(100, 300), createVector(250, 600), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(300, 300), createVector(650, 400), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesHigh = new Hatches("yx", createVector(100, 100), createVector(450, 900), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
  // hatchesLong = new Hatches("yx", createVector(100, 100), createVector(750, 300), color(30), 0, 0, DISTANCE_BETWEEN_LINES);

  // hatchesBug = new Hatches("y", createVector(717, 50), createVector(898, 898), color(30), 0, 0, DISTANCE_BETWEEN_LINES);
}


function draw() {

  smooth();

  // orbitControl();
  // cam1.move(mastaBrush.vel.x, mastaBrush.vel.y, 0);
  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  // if (MODE == 5) {
  //   camera(0, 800, 0, 0, 0, 0, 0, 0, 1); // debug - on top view
  //   // camera(-1500, 0, 0, 0, 0, 0, 0, -1, 0); // debug -- side view
  // } else {
  //   camera(0, 700, 0, 0, 0, 0, 0, 0, 1);
  // }


  // ambientLight(255, 255, 255);
  // directionalLight(200, 200, 200, 1, -1, 0);
  // pointLight(155, 155, 155, 20 * conv, 0 * conv, -30 * conv)
  // ambientMaterial(255);
  // specularMaterial(255);

  if (MODE == 5) {
    background(230);
  }

  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);
    // cam1.setPosition(0, 0, 200);
    // cam1.lookAt(-100, 0, 0);
    background(255);
  }


  gridly_foreground.show();
  gridly_background.show();

  // hatchesHigh.show();
  // hatchesLong.show();
  // hatchesBug.show();

  // brush examples
  // brushX.update();
  // brushX.show();
  // brushXY.update();
  // brushXY.show();
  // brushY.update();
  // brushY.show();
  // brushYX.update();
  // brushYX.show();

  // brushBug.update();
  // brushBug.show();

  if (frameCount == 50) {
    if (gridly_background.done == true) {
      ALLDONE = true;
    }
  }


  if (ALLDONE == true) {
    console.log("All done");
    noLoop();
    fxpreview();
    console.warn(Math.round(fxrand() * 1000) / 1000);
  }

}

function mousePressed() {
  // console.log("frameCount; " + frameCount);
}
