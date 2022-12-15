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

let RESOLUTION = 500; // how many dots per dominantside length, 200 - 700, 800 top
let BRUSHSIZE = 0.005;  // // 0.01, 0.005, 0.003, 0.001

let foglyPoints = [];
let pixies;

let PALETTE;
let PALETTE_LABEL;
let ALLDONE = false;
let DOMINANTSIDE;  // side which is the limiting factor

let MARGIN;
let RESCALINGCONSTANT = 800;  // the width the painting was designed in
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
    "background": "#aaaaaa",
    "pixelColors": ["#303030", "#909090", "#eeeeee"],
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

  // scaleDynamically();

  rescaling_width = 4000;
  rescaling_height = 4000;
  DOMINANTSIDE = 4000;

  // canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  canvas = createCanvas(rescaling_width, rescaling_height);

  canvas.id('badAssCanvas');
  if (FRAMED) {
    canvas.parent("canvasHolderFrame");
  } else {
    canvas.parent("canvasHolderPlain");
  }

  MARGIN = 0 // Math.round(0.1 * DOMINANTSIDE);

  // camM = createCamera();
  // cam1 = createCamera();
  // cam1.perspective();
  // cam1.ortho();

  // camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);  // default
  // cam1.lookAt(-100, 0, 0);
  // cam1.setPosition(1200, 200, 500);

  // setCamera(cam1);

  // STATIC
  // for (var v = 0; v < 5; v++) {
  //   for (var i = 0; i < (width * 0.45 - width * 0.25); i++) {
  //     // console.log(i);
  //     foglyPoints.push(createVector(
  //       Math.round(width * 0.25 + i),
  //       Math.round(height * 0.25 + abs(randomGaussian(0, 10)))
  //     ))
  //   }
  // }


  // gridly_background = new Gridly({
  //   countX: 50,
  //   countY: 100,
  //   marginX: DOMINANTSIDE * 0.03,
  //   marginY: DOMINANTSIDE * 0.03,
  //   distortX: width * 0.01,
  //   distortY: height * 0.01, // 0.04
  //   once: false,
  // });
  // gridly_foreground = new Gridly({
  //   countX: 10,
  //   countY: 40,
  //   marginX: DOMINANTSIDE * 0.08,
  //   marginY: DOMINANTSIDE * 0.08,
  //   distortX: width * 0.02,
  //   distortY: height * 0.04, // 0.04
  //   once: true,
  // });


  // blockGrid = new BlockGrid({});

  // pixies = new Pixies({
  //   incX: 0.03,
  //   incY: 0.008,
  //   colorBackground: undefined, // color(colors[PALETTE].background),  // drawn pixels for background
  //   colorForeground: color(130), // drawn pixels for noise
  //   distortion: 0.2,  // random misplacement of the boxes
  //   // density: Math.round(DOMINANTSIDE * 0.017),
  //   density: Math.round(DOMINANTSIDE * 0.05),
  //   margin: MARGIN, // distance to the edge
  // });

  // sunnybunny = new sunPolygon();



  if (MODE > 1) {
    console.log("Display density: " + displayDensity());
    // console.log("Pixel density: " + pixelDensity())
  }

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

  pupselGrid = new PupselGrid();

  triangles = new TriangleSystem();
  pupselGrid.show();  // needs triangle - RENAME SHOW
}


function draw() {

  // smooth();

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


  if (frameCount == 1) {
    pixelDensity(CURRENTPIXELDENS);
    // cam1.setPosition(0, 0, 200);
    // cam1.lookAt(-100, 0, 0);

    // background(170);
    // background(55);

    // triangles.show();
    // pupselGrid.show();

    // triangles.debug();

    // pixies.show();
    // image(pixies.buffer, 0, 0);

  }

  background(170);
  // triangles.show();
  image(pupselGrid.pupselBuffer, 0, 0);

  // blockA.show();
  // blockB.show();

  // gridly_foreground.show();

  // console.log(foglyPoints);

  // sunnybunny.show();

  // gridly_background.show();

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


  if (frameCount == 20) {
    // if (gridly_background.done == true) {
    // ALLDONE = true;
    // }
  }

  // show line sunnybunny
  // line(sunnybunny.coordsList[0][0], sunnybunny.coordsList[0][1], sunnybunny.coordsList[1][0], sunnybunny.coordsList[1][1])

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

