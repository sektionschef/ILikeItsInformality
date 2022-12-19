class Triangle {

    constructor(rank, totalCenter) {
        this.maxLength = 0.3;
        this.minLength = 0.1;

        this.rank = rank;
        this.totalCenter = totalCenter;

        // this.angle = 0 // mountain;
        this.angleSpeed = getRandomFromInterval(-0.001, 0.001);// 0.001;

        this.buffer = createGraphics(DOMINANTSIDE * this.maxLength, DOMINANTSIDE * this.maxLength);

        if (fxrand() < 0.3) {
            this.pattern = true;
        }

        this.lengthB = DOMINANTSIDE * getRandomFromInterval(this.minLength, this.maxLength);  // 0.1 -0.3
        this.lengthC = DOMINANTSIDE * getRandomFromInterval(this.minLength, this.maxLength); // 0.1 -0.3

        this.color = getRandomFromList(PALETTE.pixelColors);
        this.colorStroke = color("#323232"); // getRandomFromList(PALETTE.pixelColors);

        this.center = createVector(
            this.buffer.width / 2,
            this.buffer.height / 2,
        )

        // RANDOM PLACEMENT - total Position
        this.pos = createVector(
            getRandomFromInterval(0, width),
            getRandomFromInterval(0, height)
        );
        this.radius = p5.Vector.dist(this.totalCenter, this.pos);
        this.angleTotalCenter = p5.Vector.sub(this.totalCenter, this.pos).heading();
        this.angleDyn = this.angleTotalCenter;

        this.A = createVector(
            this.buffer.width / 2,
            this.buffer.height,
        );

        this.angle = p5.Vector.sub(this.center, this.A).heading();  // static

        this.theta = this.angle - PI / 18;
        this.gamma = this.angle + PI / 18;

        this.B = p5.Vector.fromAngle(this.theta, this.lengthB).add(this.A);
        this.C = p5.Vector.fromAngle(this.gamma, this.lengthC).add(this.A);

        this.coords = [[this.A.x, this.A.y], [this.B.x, this.B.y], [this.C.x, this.C.y]];

        // this.createLines();
        this.create();
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

        this.buffer.push();
        this.buffer.stroke("#4c8137");
        this.buffer.strokeWeight(50);
        this.buffer.point(this.A.x, this.A.y);

        this.buffer.stroke("#ad7f7f");
        this.buffer.point(this.B.x, this.B.y);

        this.buffer.stroke("#14195e");
        this.buffer.point(this.C.x, this.C.y);

        this.buffer.push();
        this.buffer.stroke("#ff1bff");
        this.buffer.strokeWeight(50);
        this.buffer.point(this.center.x, this.center.y);
        this.buffer.pop();
    }

    update() {

        //   convert polar coordinates to cartesian coordinates
        //   var x = r * sin(angle);
        //   var y = r * cos(angle);
        // https://editor.p5js.org/ftobon@heartofla.org/sketches/SkBy9XP97

        this.angleDyn += this.angleSpeed;
        this.pos = p5.Vector.add(createVector(this.radius * sin(this.angleDyn), this.radius * cos(this.angleDyn)), this.totalCenter);
        this.angleTotalCenter = p5.Vector.sub(this.totalCenter, this.pos).heading();

        // this.angleCenter = p5.Vector.sub(this.Adyn, this.center).heading();


    }

    create() {

        this.buffer.push();
        this.buffer.stroke("#323232");
        this.buffer.strokeWeight(3);
        this.buffer.fill(this.color);
        this.buffer.beginShape();
        this.buffer.vertex(this.A.x, this.A.y);
        // this.buffer.vertex(this.Adyn.x, this.Adyn.y);
        this.buffer.vertex(this.B.x, this.B.y);
        this.buffer.vertex(this.C.x, this.C.y);
        this.buffer.endShape(CLOSE);
        this.buffer.pop();

        // this.debug();
    }
}

class TriangleSystem {

    constructor() {
        // this.triangleCount = 5;
        // this.triangleCount = 1200;  // 1200
        // this.triangleCount = 3555;
        this.triangleCount = TRIANGLECOUNT;

        this.pupselGridCount = 4;

        this.triangles = [];
        this.pupselGrids = [];
        this.pupselGridsPixel = [];

        // RANDOM CENTER
        this.totalCenter = createVector(
            width / 2 + getRandomFromInterval(-DOMINANTSIDE * 0.1, DOMINANTSIDE * 0.1),
            height / 2 + getRandomFromInterval(-DOMINANTSIDE * 0.1, DOMINANTSIDE * 0.1)
        );


        for (var i = 0; i < this.pupselGridCount; i++) {
            // this.triangles.push(new Triangle(i));
            var pupselGrid_ = new PupselGrid()
            this.pupselGrids.push(pupselGrid_.buffer);
            this.pupselGridsPixel.push(pupselGrid_.buffer.get());
        }

        for (var i = 0; i < this.triangleCount; i++) {
            this.triangles.push(new Triangle(i, this.totalCenter));
            // if (fxrand() > 0.8) {
            var shapeBuffer = this.triangles[i].buffer;
            var textureBuffer = getRandomFromList(this.pupselGridsPixel);

            // this.triangles[i].buffer = textureBuffer;
            this.triangles[i].buffer = maskBuffers(textureBuffer, shapeBuffer);
            // }
        }
    }

    debug() {
        for (var i = 0; i < this.triangles.length; i++) {
            //     this.triangles[i].debug();

            // DEBUG ANGLE
            // push();
            // fill("pink");
            // noStroke();

            // translate(this.triangles[i].pos.x, this.triangles[i].pos.y)
            // rotate(this.triangles[i].angleTotalCenter - PI / 2);
            // triangle(
            //     0, 0,
            //     100, 0,
            //     50, 150
            // );
            // pop();
        }

        push()
        stroke("black");
        strokeWeight(50);
        point(this.totalCenter.x, this.totalCenter.y);
        pop()
    }

    show() {

        for (var i = 0; i < this.triangles.length; i++) {

            this.triangles[i].update();

            push();
            imageMode(CENTER);
            translate(this.triangles[i].pos.x, this.triangles[i].pos.y)
            rotate(this.triangles[i].angleTotalCenter - PI / 2);

            image(this.triangles[i].buffer, 0, 0);
            pop();
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