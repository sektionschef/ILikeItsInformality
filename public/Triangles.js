class Triangle {

    constructor(rank) {
        this.rank = rank;
        // this.angle = 0 // mountain;
        this.angleSpeed = getRandomFromInterval(-0.001, 0.001);// 0.001;

        if (fxrand() < 0.3) {
            this.pattern = true;
        }

        this.marginCorrect = DOMINANTSIDE * 0.05;  // correct for the body size, for the margin
        this.margin = DOMINANTSIDE * 0.1 - this.marginCorrect;
        this.lengthB = DOMINANTSIDE * getRandomFromInterval(0.1, 0.3);  // 0.1 -0.3
        this.lengthC = DOMINANTSIDE * getRandomFromInterval(0.1, 0.3); // 0.1 -0.3

        this.color = getRandomFromList(PALETTE.pixelColors);
        this.colorStroke = color("#323232"); // getRandomFromList(PALETTE.pixelColors);

        this.center = createVector(
            width / 2 + getRandomFromInterval(-DOMINANTSIDE * 0.1, DOMINANTSIDE * 0.1),
            height / 2 + getRandomFromInterval(-DOMINANTSIDE * 0.1, DOMINANTSIDE * 0.1)
        );

        this.A = createVector(
            getRandomFromInterval(this.margin, width - this.margin),
            getRandomFromInterval(this.margin, height - this.margin)
        );

        this.radius = p5.Vector.dist(this.center, this.A)
        this.startAngle = p5.Vector.sub(this.A, this.center).heading();  // static
        this.angle = this.startAngle;
        this.update();
    }

    update() {

        //   convert polar coordinates to cartesian coordinates
        //   var x = r * sin(angle);
        //   var y = r * cos(angle);
        // https://editor.p5js.org/ftobon@heartofla.org/sketches/SkBy9XP97

        this.Adyn = p5.Vector.add(createVector(this.radius * sin(this.angle), this.radius * cos(this.angle)), this.center);

        this.angleCenter = p5.Vector.sub(this.Adyn, this.center).heading();

        // this.theta = radians(getRandomFromInterval(300, 355));
        this.theta = this.angleCenter - PI / 18;
        // this.gamma = radians(getRandomFromInterval(10, 60));
        this.gamma = this.angleCenter + PI / 18;

        this.B = p5.Vector.fromAngle(this.theta, this.lengthB).add(this.Adyn);
        this.C = p5.Vector.fromAngle(this.gamma, this.lengthC).add(this.Adyn);

        this.distanceB = p5.Vector.dist(this.Adyn, this.B);
        this.distanceC = p5.Vector.dist(this.Adyn, this.C);

        if (this.distanceB > this.distanceC) {
            this.distance = this.distanceB;
        } else {
            this.distance = this.distanceC;
        }

        this.coords = [[this.Adyn.x, this.Adyn.y], [this.B.x, this.B.y], [this.C.x, this.C.y]];

        // this.createLines();
    }

    createLines() {
        this.spotLengthy = DOMINANTSIDE * 0.003;  // 0.001 // draw line range, strokeWeight of line

        // create the lines
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

        push();
        stroke("#ff1bff");
        strokeWeight(50);
        point(this.center.x, this.center.y);
        pop();
    }

    show() {

        this.update();

        push();
        stroke("#323232");
        strokeWeight(3);
        fill(this.color);
        beginShape();
        // vertex(this.A.x, this.A.y);
        vertex(this.Adyn.x, this.Adyn.y);
        vertex(this.B.x, this.B.y);
        vertex(this.C.x, this.C.y);
        endShape(CLOSE);
        pop();

        this.angle += this.angleSpeed;
    }
}

class TriangleSystem {

    constructor() {
        this.triangles = [];
        // this.triangleCount = 5;
        this.triangleCount = TRIANGLECOUNT;
        // this.triangleCount = 1200;  // 1200
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
                // if (insidePolygon([x, y], this.triangles[i].lines)) {
                //     colorDyn = color('#424242');
                // }

                // return colorDyn;
                return {
                    color: colorDyn,
                    rank: i
                }
            }
        }
    }

}