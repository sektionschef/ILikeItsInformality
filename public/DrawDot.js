class DrawDots {
    constructor(dotCount, startLeft = true) {
        this.margin = 0.05;
        this.dotCount = dotCount; // 3;

        this.dots = []
        this.startLeft = startLeft

        this.randomPoolXstartLeft = -DOMINANTSIDE * this.margin * 5;
        this.randomPoolXstopLeft = -DOMINANTSIDE * this.margin;
        this.randomPoolXstartRight = width + DOMINANTSIDE * this.margin;
        this.randomPoolXstopRight = width + DOMINANTSIDE * this.margin * 5;
        this.randomPoolYstart = -DOMINANTSIDE * this.margin;
        this.randomPoolYstop = height + DOMINANTSIDE * this.margin;
        this.Ystep = (this.randomPoolYstop - this.randomPoolYstart) / this.dotCount;

        var dotX;
        var dotY;
        var dotZ;

        for (var i = 0; i < this.dotCount; i++) {
            if (i % 2 == 0 || i == 0) {
                if (this.startLeft) {
                    dotX = getRandomFromInterval(this.randomPoolXstartLeft, this.randomPoolXstopLeft);
                } else {
                    dotX = getRandomFromInterval(this.randomPoolXstartRight, this.randomPoolXstopRight);
                }
            } else {
                if (this.startLeft) {
                    dotX = getRandomFromInterval(this.randomPoolXstartRight, this.randomPoolXstopRight);
                } else {
                    dotX = getRandomFromInterval(this.randomPoolXstartLeft, this.randomPoolXstopLeft);
                }
            }
            dotY = getRandomFromInterval(this.randomPoolYstart + this.Ystep * i, this.randomPoolYstart + this.Ystep * (i + 1));
            dotZ = 0;

            this.dots.push(createVector(dotX, dotY, dotZ));
        }

        // console.log(this.dots);

        // this.addBrushsystem(brushSystem);
    }

    addBrushsystem(system, category) {
        var currentPointX;
        var currentPointY;
        var currentPointZ;

        var nextPointX;
        var nextPointY;
        var nextPointZ;

        for (var i = 0; i < (this.dots.length - 1); i++) {

            currentPointX = this.dots[i].x / width * DOMINANTSIDE;
            currentPointY = this.dots[i].y / height * DOMINANTSIDE;
            currentPointZ = this.dots[i].z;

            nextPointX = this.dots[i + 1].x / width * DOMINANTSIDE;
            nextPointY = this.dots[i + 1].y / height * DOMINANTSIDE;
            nextPointZ = this.dots[i + 1].z;

            system.add(new Brush(
                createVector(currentPointX, currentPointY, currentPointZ),
                createVector(nextPointX, nextPointY, nextPointZ),
                // color(PALETTE.line),
                color(getRandomFromList([
                    // color(PALETTE.base.fillFirst),
                    color(PALETTE.aLevel.fillFirst),
                    color(PALETTE.bLevel.fillFirst),
                    color(PALETTE.cLevel.fillFirst),
                ])),
                category
            ))
        }

    }

    show() {

        var currentPointX;
        var currentPointY;
        var currentPointZ;

        var nextPointX;
        var nextPointY;
        var nextPointZ;

        for (var i = 0; i < (this.dots.length - 1); i++) {

            currentPointX = this.dots[i].x / width * DOMINANTSIDE;
            currentPointY = this.dots[i].y / height * DOMINANTSIDE;
            currentPointZ = this.dots[i].z;

            nextPointX = this.dots[i + 1].x / width * DOMINANTSIDE;
            nextPointY = this.dots[i + 1].y / height * DOMINANTSIDE;
            nextPointZ = this.dots[i + 1].z;

            push();
            translate(-width / 2, -height / 2);

            if (this.startLeft) {
                stroke("blue");
            } else {
                stroke("red");
            }

            line(currentPointX, currentPointY, currentPointZ, nextPointX, nextPointY, nextPointZ)
            if (this.startLeft) {
                fill("blue");
            } else {
                fill("red");
            }
            noStroke();
            ellipse(currentPointX, currentPointY, 10)
            pop();
        }
    }
}


class drawDotsSystem {

    constructor() {
        // A Level
        this.dotsA1 = new DrawDots(3);
        this.dotsA2 = new DrawDots(3, false);

        this.intersectionPointsA = this.getIntersections(this.dotsA1, this.dotsA2);
        this.polygonsA = this.createPolygons(this.dotsA1, this.dotsA2, this.intersectionPointsA);

        // B Level
        this.dotsB1 = new DrawDots(4);
        this.dotsB2 = new DrawDots(4, false);

        this.intersectionPointsB = this.getIntersections(this.dotsB1, this.dotsB2);
        this.polygonsB = this.createPolygons(this.dotsB1, this.dotsB2, this.intersectionPointsB);

        // C Level
        this.dotsC1 = new DrawDots(5);
        this.dotsC2 = new DrawDots(5, false);

        this.intersectionPointsC = this.getIntersections(this.dotsC1, this.dotsC2);
        this.polygonsC = this.createPolygons(this.dotsC1, this.dotsC2, this.intersectionPointsC);
    }

    getIntersections(dotsA, dotsB) {

        var intersectionPoints = [];
        var pointCount = dotsA.dotCount - 1;

        var A1;
        var A2;
        var B1;
        var B2;

        for (var i = 0; i < pointCount; i++) {

            A1 = dotsA.dots[i];
            A2 = dotsA.dots[i + 1];
            B1 = dotsB.dots[i];
            B2 = dotsB.dots[i + 1];

            intersectionPoints.push(getIntersectionPoint(A1, A2, B1, B2));
        }

        // console.log(this.intersectionPoints);
        return intersectionPoints;
    }

    createPolygons(dotsA, dotsB, intersectionPoints) {
        var pointCount = dotsA.dotCount - 1;
        var polygons = [];

        // skip first and last
        for (var i = 1; i < (pointCount); i++) {
            polygons.push(
                [
                    intersectionPoints[i - 1],
                    dotsA.dots[i],
                    intersectionPoints[i],
                    dotsB.dots[i],
                ]
            )
        }
        // console.log(this.polygons);
        return polygons;
    }

    showIntersectionPoint(intersectionPoints) {

        // console.log(this.I1.x);
        // console.log(this.I1.y);

        for (var i = 0; i < (intersectionPoints.length); i++) {
            push();
            translate(-width / 2, -height / 2);
            translate(intersectionPoints[i].x, intersectionPoints[i].y);
            fill("green");
            noStroke();
            ellipse(0, 0, 10)
            pop();
        }
    }

    showPolygons(polygons) {

        for (var i = 0; i < (polygons.length); i++) {

            push();
            translate(-width / 2, -height / 2);
            noFill();
            beginShape();
            vertex(polygons[i][0].x, polygons[i][0].y);
            vertex(polygons[i][1].x, polygons[i][1].y);
            vertex(polygons[i][2].x, polygons[i][2].y);
            vertex(polygons[i][3].x, polygons[i][3].y);
            endShape(CLOSE);

            pop();
        }
    }

    show() {
        this.dotsA1.show();
        this.dotsA2.show();

        this.dotsB1.show();
        this.dotsB2.show();

        this.dotsC1.show();
        this.dotsC2.show();

        this.showIntersectionPoint(this.intersectionPointsA);
        this.showIntersectionPoint(this.intersectionPointsB);
        this.showIntersectionPoint(this.intersectionPointsC);

        this.showPolygons(this.polygonsA);
        this.showPolygons(this.polygonsB);
        this.showPolygons(this.polygonsC);
    }

    fireBrush(level) {

        if (level == "cLevel") {
            this.dotsC1.addBrushsystem(brushSystem, "cLevel");
            this.dotsC2.addBrushsystem(brushSystem, "cLevel");
        }

        if (level == "bLevel") {
            this.dotsB1.addBrushsystem(brushSystem, "bLevel");
            this.dotsB2.addBrushsystem(brushSystem, "bLevel");
        }

        if (level == "aLevel") {
            this.dotsA1.addBrushsystem(brushSystem, "aLevel");
            this.dotsA2.addBrushsystem(brushSystem, "aLevel");
        }
    }
}
