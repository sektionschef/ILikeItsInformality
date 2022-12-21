class paintBro {

    constructor(data) {

        this.buffer = data.buffer;
        this.elementSizeMin = data.elementSizeMin;
        this.elementSizeMax = data.elementSizeMax;
        this.noStroke = data.noStroke;
        this.strokeColor = data.strokeColor;
        this.strokeWeight = data.strokeWeight;
        this.numberQuantisizer = data.numberQuantisizer;
        this.brushLength = data.brushLength;
        this.distortionFactor = data.distortionFactor;
        this.stepSize = data.stepSize;

        var currentPolygon;
        let posX;
        let posY;
        var elementFillColor;
        var elementStrokeColor;
        var insidePolygonSwitchA;
        var insidePolygonSwitchB;
        var insidePolygonSwitchC;
        var sunPolygonSwitch;
        var colorNumber;  // which color to choose first or second
        var elementLayer;
        var orientation;
        var distort;
        var step;
        let posBX;
        let posBY;
        let specialColor;

        this.elements = [];

        this.area = Math.round(Math.round(this.buffer.width / DOMINANTSIDE * 100) * Math.round(this.buffer.height / DOMINANTSIDE * 100)) / 100;
        // console.log("area: " + this.area);
        this.shapeNumber = Math.round(this.area * this.numberQuantisizer);  // relative to size
        // console.log("this.shapeNumber:" + this.shapeNumber); // 250 / 500 - quantisizer ist 20

        // this.buffer.background(color(PALETTE.background));
        // console.warn(Math.round(fxrand() * 1000) / 1000);

        for (var i = 0; i < this.shapeNumber; i++) {

            posX = getRandomFromInterval(0, this.buffer.width);
            posY = getRandomFromInterval(0, this.buffer.height);
            step = getRandomFromList([-this.stepSize, this.stepSize]);  // movement of element

            // which colors to choose
            // colorNumber = getRandomFromList(["first", "second", "special"]);

            if (fxrand() < ROUGHYPUFFY) { // 0.1, 0.2, 0.3
                colorNumber = "special";
                specialColor = getRandomFromList([
                    // color(PALETTE.base.fillFirst),
                    color(PALETTE.aLevel.fillFirst),
                    color(PALETTE.bLevel.fillFirst),
                    color(PALETTE.cLevel.fillFirst),
                ]);
            } else if (fxrand() < 0.6) {
                colorNumber = "first";
            } else {
                colorNumber = "second";
            }
            // direction of brush stroke
            if (fxrand() < BRUSHDIRECTION) { // [0.25, 0.5, 0.75]
                orientation = "vertical";
            } else {
                orientation = "horizontal";
            }

            // if (i == 722) {
            //     console.warn("d i: " + i + " - " + Math.round(fxrand() * 1000) / 1000);
            // }

            // console.warn("i: " + i + " - " + Math.round(fxrand() * 1000) / 1000);


            for (var b = 0; b < this.brushLength; b++) {

                insidePolygonSwitchA = false;
                insidePolygonSwitchB = false;
                insidePolygonSwitchC = false;
                sunPolygonSwitch = false;

                distort = getRandomFromList([-this.distortionFactor, this.distortionFactor]);

                // horizontal or vertical movement
                if (orientation == "horizontal") {
                    posBX = posX + b * step + distort * b;
                    posBY = posY + distort * b;
                } else {
                    posBX = posX + distort * b;
                    posBY = posY + b * step + distort * b;
                }
                // console.log(posBX);


                // default case - base Level
                elementLayer = "base";
                if (colorNumber == "first") {
                    elementFillColor = color(PALETTE.base.fillFirst);
                    elementStrokeColor = color(PALETTE.base.strokeFirst);
                } else if (colorNumber == "special") {
                    elementFillColor = specialColor;
                    elementStrokeColor = color("#00000000");
                } else {
                    elementFillColor = color(PALETTE.base.fillSecond);
                    elementStrokeColor = color(PALETTE.base.strokeSecond);
                }

                // C Level
                for (var p = 0; p < dotSystem.polygonsC.length; p++) {

                    currentPolygon = [
                        [dotSystem.polygonsC[p][0].x, dotSystem.polygonsC[p][0].y,],
                        [dotSystem.polygonsC[p][1].x, dotSystem.polygonsC[p][1].y,],
                        [dotSystem.polygonsC[p][2].x, dotSystem.polygonsC[p][2].y,],
                        [dotSystem.polygonsC[p][3].x, dotSystem.polygonsC[p][3].y,],
                    ]

                    if (pointInPolygon(currentPolygon, [posX, posY])) {
                        insidePolygonSwitchC = true;
                        elementLayer = "cLevel";
                    }
                }

                if (insidePolygonSwitchC) {
                    if (colorNumber == "first") {
                        elementFillColor = color(PALETTE.cLevel.fillFirst);
                        elementStrokeColor = color(PALETTE.cLevel.strokeFirst);
                    } else if (colorNumber == "special") {
                        elementFillColor = specialColor;
                        elementStrokeColor = color(PALETTE.base.strokeFirst);
                    } else {
                        elementFillColor = color(PALETTE.cLevel.fillSecond);
                        elementStrokeColor = color(PALETTE.cLevel.strokeSecond);
                    }
                }

                // B Level
                for (var p = 0; p < dotSystem.polygonsB.length; p++) {

                    currentPolygon = [
                        [dotSystem.polygonsB[p][0].x, dotSystem.polygonsB[p][0].y,],
                        [dotSystem.polygonsB[p][1].x, dotSystem.polygonsB[p][1].y,],
                        [dotSystem.polygonsB[p][2].x, dotSystem.polygonsB[p][2].y,],
                        [dotSystem.polygonsB[p][3].x, dotSystem.polygonsB[p][3].y,],
                    ]
                    if (pointInPolygon(currentPolygon, [posX, posY])) {
                        insidePolygonSwitchB = true;
                        elementLayer = "bLevel";
                    }
                }
                if (insidePolygonSwitchB) {
                    if (colorNumber == "first") {
                        elementFillColor = color(PALETTE.bLevel.fillFirst);
                        elementStrokeColor = color(PALETTE.bLevel.strokeFirst);
                    } else if (colorNumber == "special") {
                        elementFillColor = specialColor;
                        elementStrokeColor = color(PALETTE.base.strokeFirst);
                    } else {
                        elementFillColor = color(PALETTE.bLevel.fillSecond);
                        elementStrokeColor = color(PALETTE.bLevel.strokeSecond);
                    }
                }


                // A Level
                for (var p = 0; p < dotSystem.polygonsA.length; p++) {

                    currentPolygon = [
                        [dotSystem.polygonsA[p][0].x, dotSystem.polygonsA[p][0].y,],
                        [dotSystem.polygonsA[p][1].x, dotSystem.polygonsA[p][1].y,],
                        [dotSystem.polygonsA[p][2].x, dotSystem.polygonsA[p][2].y,],
                        [dotSystem.polygonsA[p][3].x, dotSystem.polygonsA[p][3].y,],
                    ]
                    // console.warn(fxrand());
                    if (pointInPolygon(currentPolygon, [posX, posY])) {
                        insidePolygonSwitchA = true;
                        elementLayer = "aLevel";
                    }
                }
                if (insidePolygonSwitchA) {
                    if (colorNumber == "first") {
                        elementFillColor = color(PALETTE.aLevel.fillFirst);
                        elementStrokeColor = color(PALETTE.aLevel.strokeFirst);
                    } else if (colorNumber == "special") {
                        elementFillColor = specialColor;
                        elementStrokeColor = color(PALETTE.base.strokeFirst);
                    } else {
                        elementFillColor = color(PALETTE.aLevel.fillSecond);
                        elementStrokeColor = color(PALETTE.aLevel.strokeSecond);
                    }
                }

                // // S Level

                if (pointInPolygon(sunny.coordsList, [posBX, posBY])) {
                    sunPolygonSwitch = true;
                }

                if (sunPolygonSwitch) {
                    elementFillColor = highlightColor(elementFillColor, 30);
                    elementStrokeColor = highlightColor(elementStrokeColor, 30);
                }

                this.elements.push({
                    elementLayer: elementLayer,
                    elementFillColor: elementFillColor,
                    widthShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                    heightShape: getRandomFromInterval(this.elementSizeMin, this.elementSizeMax),
                    // widthShape: Math.round(map(i , 0, this.shapeNumber, this.elementSizeMax, this.elementSizeMin)),  // STATIC
                    // heightShape: Math.round(map(i, 0, this.shapeNumber, this.elementSizeMax, this.elementSizeMin)),  // STATIC
                    strokeSize: this.strokeWeight,
                    elementStrokeColor: elementStrokeColor, // distortColorNew(this.strokeColor, this.strokeColorNoise),
                    posBX: posBX,
                    posBY: posBY,
                    angle: getRandomFromInterval(0, 2 * PI),
                })
            }
        }
        // console.log(this.elements);
    }

    show(layer) {

        // translate(-width / 2, -height / 2);

        for (var e = 0; e < this.elements.length; e++) {

            // console.error((e) + ": " + this.elements[e].elementLayer);  // 326

            // draw only specific layer
            if ((this.elements[e].elementLayer == layer)) {

                this.buffer.push();
                this.buffer.fill(this.elements[e].elementFillColor);
                // console.log(this.elements[e].elementFillColor);
                this.buffer.rectMode(CENTER);

                this.buffer.strokeWeight(this.strokeWeight);
                this.buffer.stroke(this.elements[e].elementStrokeColor);
                // console.error((e) + ": " + Math.round(fxrand() * 1000) / 1000);  // 326
                this.buffer.translate(this.elements[e].posBX, this.elements[e].posBY)
                this.buffer.rotate(this.elements[e].angle);
                this.buffer.rect(0, 0, this.elements[e].widthShape, this.elements[e].heightShape);

                // this.buffer.image(gan.buffer, 0, 0, this.elements[e].widthShape, this.elements[e].heightShape);

                this.buffer.pop();
            }
        }
    }
}
