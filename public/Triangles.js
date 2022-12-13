class Triangle {

    constructor(rank) {
        this.rank = rank;

        if (fxrand() < 0.3) {
            this.pattern = true;
            // console.log(this.pattern);
        }
        this.spotLengthy = DOMINANTSIDE * 0.001;  // draw line range, strokeWeight of line

        this.marginCorrect = DOMINANTSIDE * 0.05;  // center for the margin
        this.margin = DOMINANTSIDE * 0.1 - this.marginCorrect;
        this.lengthB = DOMINANTSIDE * getRandomFromInterval(0.1, 0.3);  // 0.1 -0.2
        this.lengthC = DOMINANTSIDE * getRandomFromInterval(0.1, 0.3); // 0.1 -0.2

        this.color = getRandomFromList(PALETTE.pixelColors);
        this.colorStroke = getRandomFromList(PALETTE.pixelColors);
        this.centerFuzzynessX = getRandomFromInterval(DOMINANTSIDE * 0.1);
        this.centerFuzzynessY = getRandomFromInterval(DOMINANTSIDE * 0.1);
        this.center = createVector(
            width / 2 + getRandomFromInterval(-DOMINANTSIDE * 0.1, DOMINANTSIDE * 0.1),
            height / 2 + getRandomFromInterval(-DOMINANTSIDE * 0.1, DOMINANTSIDE * 0.1)
        );

        // this.A = createVector(900, 900);
        this.A = createVector(
            getRandomFromInterval(this.margin, width - this.margin),
            getRandomFromInterval(this.margin, height - this.margin)
        );

        this.angleCenter = p5.Vector.sub(this.A, this.center).heading();
        // console.log(this.angleCenter);

        // this.theta = radians(getRandomFromInterval(300, 355));
        this.theta = this.angleCenter - PI / 18;
        // this.gamma = radians(getRandomFromInterval(10, 60));
        this.gamma = this.angleCenter + PI / 18;

        this.B = p5.Vector.fromAngle(this.theta, this.lengthB).add(this.A);
        this.C = p5.Vector.fromAngle(this.gamma, this.lengthC).add(this.A);

        this.distanceB = p5.Vector.dist(this.A, this.B);
        this.distanceC = p5.Vector.dist(this.A, this.C);

        if (this.distanceB > this.distanceC) {
            this.distance = this.distanceB;
        } else {
            this.distance = this.distanceC;
        }

        this.coords = [[this.A.x, this.A.y], [this.B.x, this.B.y], [this.C.x, this.C.y]];

        this.ABAngle = p5.Vector.sub(this.B, this.A).heading();
        this.ACAngle = p5.Vector.sub(this.C, this.A).heading();

        this.ABSpot1 = p5.Vector.add(this.A, p5.Vector.fromAngle((this.ABAngle + PI / 2), this.spotLengthy));
        this.ABSpot2 = p5.Vector.sub(this.A, p5.Vector.fromAngle((this.ABAngle + PI / 2), this.spotLengthy));
        this.ABSpot3 = p5.Vector.add(this.B, p5.Vector.fromAngle((this.ABAngle + PI / 2), this.spotLengthy));
        this.ABSpot4 = p5.Vector.sub(this.B, p5.Vector.fromAngle((this.ABAngle + PI / 2), this.spotLengthy));

        this.ACSpot1 = p5.Vector.add(this.A, p5.Vector.fromAngle((this.ACAngle + PI / 2), this.spotLengthy));
        this.ACSpot2 = p5.Vector.sub(this.A, p5.Vector.fromAngle((this.ACAngle + PI / 2), this.spotLengthy));
        this.ACSpot3 = p5.Vector.add(this.C, p5.Vector.fromAngle((this.ACAngle + PI / 2), this.spotLengthy));
        this.ACSpot4 = p5.Vector.sub(this.C, p5.Vector.fromAngle((this.ACAngle + PI / 2), this.spotLengthy));

        this.lines = [
            [this.ABSpot1.x, this.ABSpot1.y],
            [this.ABSpot2.x, this.ABSpot2.y],
            [this.ABSpot3.x, this.ABSpot3.y],
            [this.ABSpot4.x, this.ABSpot4.y],
            [this.ACSpot1.x, this.ACSpot1.y],
            [this.ACSpot2.x, this.ACSpot2.y],
            [this.ACSpot3.x, this.ACSpot3.y],
            [this.ACSpot4.x, this.ACSpot4.y],
        ];
    }

    debug() {

        push();
        stroke("#4c8137");
        strokeWeight(50);
        point(this.A.x, this.A.y);

        stroke("#ad7f7f");
        point(this.B.x, this.B.y);

        stroke("#14195e");
        point(this.C.x, this.C.y);
        pop();

        push();
        noFill();
        stroke("black");
        strokeWeight(10);
        rect(this.margin, this.margin, width - this.margin * 2, height - this.margin * 2)
        pop();
    }

    show() {

        push();
        stroke("#323232");
        strokeWeight(3);
        fill(this.color);
        beginShape();
        vertex(this.A.x, this.A.y);
        vertex(this.B.x, this.B.y);
        vertex(this.C.x, this.C.y);
        endShape(CLOSE);
        pop();
    }
}

class TriangleSystem {

    constructor() {
        this.triangles = [];
        this.triangleCount = 1200;
        // this.triangleCount = 3555;

        for (var i = 0; i < this.triangleCount; i++) {
            this.triangles.push(new Triangle(i));
        }
    }

    debug() {
        for (var i = 0; i < this.triangles.length; i++) {
            this.triangles[i].debug();
        }
    }

    show() {
        for (var i = 0; i < this.triangles.length; i++) {
            this.triangles[i].show();
        }
    }

    insidePolygon(x, y, v) {  // v is the index
        // ATTENTION FOR OVERLAPPING ELEMENTS - WHICH ONE CAN BE SEEN?
        var colorDyn;

        for (var i = 0; i < this.triangles.length; i++) {
            // if one is found, enough - end the loop
            if (insidePolygon([x, y], this.triangles[i].coords)) {
                // return true;
                // return this.triangles[i].color;

                colorDyn = brightenSuperNew(this.triangles[i].color, map(
                    p5.Vector.dist(createVector(x, y), this.triangles[i].A),
                    0,
                    this.triangles[i].distance,
                    -50,
                    50
                ));


                // PATTERN
                if (this.triangles[i].pattern) {
                    // console.log("ioad")
                    if (v % 3 == 0) {
                        colorDyn = color('#424242');
                    }
                }

                // Contour
                if (insidePolygon([x, y], this.triangles[i].lines)) {
                    colorDyn = color('#1b1b1b');
                }

                // return colorDyn;
                return {
                    color: colorDyn,
                    rank: i
                }
            }
        }
    }

}