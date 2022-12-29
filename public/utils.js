// das vordere bleibt, das hintere filtert alles raus, wo im zweiten keine transparenz hat
function maskBuffers(textureBuffer, shapeBuffer) {
    var maskedBuffer;
    // (maskedBuffer = textureBuffer.get()).mask(shapeBuffer.get());

    // works
    (maskedBuffer = textureBuffer.get()).mask(shapeBuffer);
    return maskedBuffer
}

function getRandomFromInterval(min, max) {
    return fxrand() * (max - min) + min;
}

function getP5RandomFromInterval(min, max) {
    return random() * (max - min) + min;
}

function getRandomFromList(items) {
    return items[Math.floor(fxrand() * items.length)];
}

function getP5RandomFromList(items) {
    return items[Math.floor(random() * items.length)];
}

function distortColor(colorObject, max_diff) {
    if (typeof max_diff == "undefined") {
        max_diff = 10;
    }
    let red = (colorObject.levels[0] + getRandomFromInterval(-max_diff, max_diff));
    let green = (colorObject.levels[1] + getRandomFromInterval(-max_diff, max_diff));
    let blue = (colorObject.levels[2] + getRandomFromInterval(-max_diff, max_diff));
    let opacity = colorObject.levels[3];

    // not larger than 255 and not smaller than 0
    red = Math.min(Math.max(parseInt(red), 0), 255);
    green = Math.min(Math.max(parseInt(green), 0), 255);
    blue = Math.min(Math.max(parseInt(blue), 0), 255);

    return color(red, green, blue, opacity);
}

function distortColorNew(colorObject, diff, strict = true) {

    colorA = color(colorObject);
    colorMode(HSB, 360, 100, 100, 1);
    if (strict) {
        brightnessNew = brightness(colorA) + getRandomFromInterval(-diff, diff);
        saturationNew = saturation(colorA) + getRandomFromInterval(-diff, diff);
        hueNew = hue(colorA) + getRandomFromInterval(-diff / 4, diff / 4);
    } else {
        brightnessNew = brightness(colorA) + getP5RandomFromInterval(-diff, diff);
        saturationNew = saturation(colorA) + getP5RandomFromInterval(-diff, diff);
        hueNew = hue(colorA) + getP5RandomFromInterval(-diff / 4, diff / 4);
    }
    colorB = color(hueNew, saturationNew, brightnessNew, alpha(colorA));

    colorMode(RGB, 255, 255, 255, 255);
    resultingColor = color(red(colorB), green(colorB), blue(colorB), alpha(colorA)); // map(alpha(colorB), 0, 1, 0, 255));

    return resultingColor
}


function distortColorSuperNew(colorObject, gain) {
    var distort = + randomGaussian(0, gain);
    return color(
        red(colorObject) + distort,
        green(colorObject) + distort,
        blue(colorObject) + distort,
        alpha(colorObject)
    );
}

function brightenSuperNew(colorObject, gain) {
    return color(
        red(colorObject) + gain,
        green(colorObject) + gain,
        blue(colorObject) + gain,
        alpha(colorObject)
    );
}


function lessenColor(colorObject, diff) {
    let diff_constant = getRandomFromInterval(0, -diff)
    let red = colorObject.levels[0];
    let green = colorObject.levels[1];
    let blue = colorObject.levels[2];
    // let opacity = (colorObject.levels[3] - diff_constant);
    let opacity = constrain(colorObject.levels[3] + diff_constant, 0, 255);

    return color(red, green, blue, opacity);
}

function fromHSBtoRGB(colorObject) {
    colorMode(RGB);
    return color(red(colorObject), green(colorObject), blue(colorObject));
}

// calculate the scaling params - choose the limiting factor either height or width
function scaleDynamicallyPaper() {

    const GOAL = 4000;

    // scaleRatio = 1;
    dynamicWidthRatio = GOAL / windowWidth;
    dynamicHeightRatio = GOAL / windowHeight;

    if (dynamicWidthRatio > dynamicHeightRatio) {
        // console.log("Width is smaller than height. Width dominates")
        exportRatio = dynamicWidthRatio;
    } else {
        // console.log("width is larger than height. Height dominates.")
        exportRatio = dynamicHeightRatio;
    }
    // console.log("Display density: " + displayDensity());
    // console.log("Pixel density: " + pixelDensity())
    exportRatio /= pixelDensity();
    // console.log("exportRatio: " + exportRatio);

    rescaling_width = Math.floor(GOAL / exportRatio);
    rescaling_height = Math.floor(GOAL / exportRatio);
}

function scaleDynamically() {

    if (FRAMED == false) {
        if (windowHeight > windowWidth) {
            // console.log("Width is smaller than height. Width dominates")
            DOMINANTSIDE = Math.floor(windowWidth);
            rescaling_width = Math.floor(windowWidth);
            rescaling_height = Math.floor(windowWidth);
        } else {
            // console.log("width is larger than height. Height dominates.")
            DOMINANTSIDE = Math.floor(windowHeight);
            rescaling_width = Math.floor(windowHeight);
            rescaling_height = Math.floor(windowHeight);
        }

    } else {

        rescaling_width = FRAMEDWIDTH;
        rescaling_height = FRAMEDWIDTH;
        DOMINANTSIDE = FRAMEDWIDTH;

    }



}

// each time window.innerWidth changes
function windowResized() {
    // console.log("Window is resized.");
    // window.location.reload();
    // scaleDynamically();
}

function keyTyped() {
    if (key === 'e' || key == 'E') {
        // exportHighResolution();  // paper
        exportCanvas(canvas);  // webgl
    } else if (key === ' ') {
        if (ANIMATIONSTATE) {
            console.log("stop animation");
            noLoop();
            ANIMATIONSTATE = false;
        } else {
            console.log("restart animation")
            loop();
            ANIMATIONSTATE = true;
        }
    }
}


function label_feature(value, min, max) {
    let label;
    let third = (max - min) / 3

    // console.log("value: " + value);
    // console.log("min: " + min);
    // console.log("max: " + max);
    // console.log("third: " + third);
    // console.log("lower: " + (min + third));
    if (value < (min + third)) {
        label = "low"
    } else if (value > max - third) {
        label = "high"
    } else {
        label = "medium"
    }
    return label
}


function hashFnv32a(str, asString, seed) {
    /*jshint bitwise:false  https://www.codegrepper.com/code-examples/javascript/js+hash+string+to+number */
    var i, l, hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (asString) {
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
}


function exportHighResolution() {
    // scaleRatio = exportRatio;

    // Re-create buffer with exportRatio and re-draw
    buffer = createGraphics(exportRatio * width, exportRatio * height);

    draw();

    exportCanvas(buffer);

    // Reset scaleRation back to 1, re-create buffer, re-draw
    // scaleRatio = 1;
    buffer = createGraphics(width, height);
    draw();
}

function exportCanvas(canvasName, dev) {

    // window.location.reload();
    // Get timestamp to name the ouput file
    let timestamp = getTimestamp();
    let filename;

    if (dev) {
        filename = TRIANGLECOUNT + "_" + PICKER + "_" + PALETTE_LABEL;
    } else {
        filename = fxhash + "_" + timestamp;
    }
    save(canvasName, filename, 'png');
}

function getTimestamp() {
    // from: https://www.kindacode.com/article/javascript-get-current-date-time-in-yyyy-mm-dd-hh-mm-ss-format/

    const dateObj = new Date;
    // console.log(dateObj);

    let year = dateObj.getFullYear();

    let month = dateObj.getMonth();
    month = ('0' + month).slice(-2);
    // To make sure the month always has 2-character-format. For example, 1 => 01, 2 => 02

    let date = dateObj.getDate();
    date = ('0' + date).slice(-2);
    // To make sure the date always has 2-character-format

    let hour = dateObj.getHours();
    hour = ('0' + hour).slice(-2);
    // To make sure the hour always has 2-character-format

    let minute = dateObj.getMinutes();
    minute = ('0' + minute).slice(-2);
    // To make sure the minute always has 2-character-format

    let second = dateObj.getSeconds();
    second = ('0' + second).slice(-2);
    // To make sure the second always has 2-character-format

    // const timestamp = `${year}/${month}/${date} ${hour}:${minute}:${second}`;
    const timestamp = `${year}${month}${date} ${hour}${minute}${second}`;

    return timestamp
}

function choosePalette() {

    allPalettes = [];
    for (let palette in PALETTESYSTEM) {
        // console.log(palette)
        allPalettes.push(palette)
    }
    // console.log(allPalettes);
    PALETTE_LABEL = getRandomFromList(allPalettes);
    console.log("Palette: " + PALETTE_LABEL);
    PALETTE = PALETTESYSTEM[PALETTE_LABEL];
}


function setPlainHTML() {
    const badAssCanvasDiv = document.createElement("div");
    badAssCanvasDiv.setAttribute("id", "canvasHolderPlain");
    // const newContent = document.createTextNode("Hi there and greetings!");
    // badAssCanvasDiv.appendChild(newContent);
    document.body.insertBefore(badAssCanvasDiv, document.getElementById("Konkas"));
}


function setFrameHTML() {
    const framesUl = document.createElement("ul");
    framesUl.setAttribute("id", "Frames");
    const frameLi = document.createElement("li");
    frameLi.setAttribute("class", "Frame");
    const canvasHolderFrameDiv = document.createElement("div");
    canvasHolderFrameDiv.setAttribute("id", "canvasHolderFrame");
    frameLi.appendChild(canvasHolderFrameDiv);
    framesUl.appendChild(frameLi);
    document.body.insertBefore(framesUl, document.getElementById("Konkas"));
}

function setLabelHTML() {
    const labelDiv = document.createElement("div");
    labelDiv.setAttribute("id", "Label");
    const labelContentDiv = document.createElement("div");
    labelContentDiv.setAttribute("class", "label-content");

    const titleH1 = document.createElement("h1");
    titleH1.setAttribute("id", "title");
    const artistYearP = document.createElement("p");
    artistYearP.setAttribute("id", "artist_year");
    const descriptionP = document.createElement("p");
    descriptionP.setAttribute("id", "description");
    const priceEditionsP = document.createElement("p");
    priceEditionsP.setAttribute("id", "price_editions");

    labelContentDiv.appendChild(titleH1);
    labelContentDiv.appendChild(artistYearP);
    labelContentDiv.appendChild(descriptionP);
    labelContentDiv.appendChild(priceEditionsP);
    labelDiv.appendChild(labelContentDiv);
    document.body.insertBefore(labelDiv, document.getElementById("Konkas"));

    document.getElementById("title").innerHTML = TITLE;
    document.getElementById("artist_year").innerHTML = ARTIST + ", " + YEAR;
    document.getElementById("description").innerHTML = DESCRIPTION;
    document.getElementById("price_editions").innerHTML = PRICE + ", " + EDITIONS;
}

function setTagsHTML() {
    document.title = TITLE;
    document.querySelector('meta[name="description"]').setAttribute("content", DESCRIPTION);
    document.querySelector('meta[name="author"]').setAttribute("content", ARTIST);

    document.querySelector('meta[property="og:title"]').setAttribute("content", TITLE);
    document.querySelector('meta[property="og:type"]').setAttribute("content", "website");
    document.querySelector('meta[property="og:url"]').setAttribute("content", URL);
    document.querySelector('meta[property="og:description"]').setAttribute("content", DESCRIPTION);
}


function getSteep(A1, A2) {
    var k = (A1.y - A2.y) / (A1.x - A2.x);
    // console.log(k);
    var d = A1.y - k * A1.x;
    // console.log(d);

    return [k, d];
}

// get the intersection point with two lines defined by two points. the steep k and d are calculated. then where the two intersect.
function getIntersectionPoint(A1, A2, B1, B2) {

    ALine = getSteep(A1, A2);
    BLine = getSteep(B1, B2);

    Ak = ALine[0];
    Ad = ALine[1];
    Bk = BLine[0];
    Bd = BLine[1];

    var x = Math.round((Bd - Ad) / (Ak - Bk));
    var y = Math.round(Ak * x + Ad);

    // console.log(x);

    if (isNaN(x) && isNaN(x)) {
    } else {
        return createVector(x, y);
    }
}

function insidePolygon(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    // https://stackoverflow.com/questions/22521982/check-if-point-is-inside-a-polygon

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};


/**
 * Performs the even-odd-rule Algorithm (a raycasting algorithm) to find out whether a point is in a given polygon.
 * This runs in O(n) where n is the number of edges of the polygon.
 *
 * @param {Array} polygon an array representation of the polygon where polygon[i][0] is the x Value of the i-th point and polygon[i][1] is the y Value.
 * @param {Array} point   an array representation of the point where point[0] is its x Value and point[1] is its y Value
 * @return {boolean} whether the point is in the polygon (not on the edge, just turn < into <= and > into >= for that)
 * 
 * from: https://www.algorithms-and-technologies.com/point_in_polygon/javascript 
 */
const pointInPolygon = function (polygon, point) {
    //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
    let odd = false;
    //For each edge (In this case for each point of the polygon and the previous one)
    for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
        //If a line from the point into infinity crosses this edge
        if (((polygon[i][1] > point[1]) !== (polygon[j][1] > point[1])) // One point needs to be above, one below our y coordinate
            // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
            && (point[0] < ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]))) {
            // Invert odd
            odd = !odd;
        }
        j = i;

    }
    //If the number of crossings was odd, the point is in the polygon
    return odd;
};

// module.exports = {pointInPolygon}


// draw an arrow for a vector at a given base position - from: https://p5js.org/reference/#/p5.Vector/add
function drawArrow(base, vec, myColor) {
    let goal = p5.Vector.sub(vec, base);
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, goal.x, goal.y);
    rotate(goal.heading());
    let arrowSize = 7;
    translate(goal.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}

function getAngleBetweenPoints(start, end) {
    return atan2(end.y - start.y, end.x - start.x);
}

// find nearest point along a LINE: from https://editor.p5js.org/solub/sketches/JkjZA2ZOS
function orthogonalProjection1(a, b, p) {

    d1 = p5.Vector.sub(b, a).normalize()
    d2 = p5.Vector.sub(p, a)

    d1.mult(d2.dot(d1))

    return p5.Vector.add(a, d1)
}

function highlightColor(colorCode, gain) {

    return color(red(colorCode) + gain, green(colorCode) + gain, blue(colorCode) + gain, alpha(colorCode));
}