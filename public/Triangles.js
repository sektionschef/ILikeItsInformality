class Triangle {

    constructor() {
        this.marginCorrect = DOMINANTSIDE * 0.05;  // center for the margin
        this.margin = DOMINANTSIDE * 0.1 - this.marginCorrect;

        this.color = getRandomFromList(PALETTE.pixelColors);
        this.center = createVector(width / 2, height / 2);

        // this.A = createVector(2400, 1300);
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
        this.lengthB = DOMINANTSIDE * getRandomFromInterval(0.1, 0.2);
        this.lengthC = DOMINANTSIDE * getRandomFromInterval(0.1, 0.2);

        this.B = p5.Vector.fromAngle(this.theta, this.lengthB).add(this.A);

        this.C = p5.Vector.fromAngle(this.gamma, this.lengthC).add(this.A);

        this.coords = [[this.A.x, this.A.y], [this.B.x, this.B.y], [this.C.x, this.C.y]];

    }

    debug() {
        // debug
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
}

class TriangleSystem {

    constructor() {
        this.triangles = [];
        this.triangleCount = 3555;

        for (var i = 0; i < this.triangleCount; i++) {
            this.triangles.push(new Triangle());
        }
    }

    debug() {
        for (var i = 0; i < this.triangles.length; i++) {
            this.triangles[i].debug();
        }
    }

    insidePolygon(x, y) {
        // ATTENTION FOR OVERLAPPING ELEMENTS - WHICH ONE CAN BE SEEN?
        for (var i = 0; i < this.triangles.length; i++) {
            // if one is found, enough - end the loop
            if (insidePolygon([x, y], this.triangles[i].coords)) {
                // return true;
                return this.triangles[i].color;
            }
        }
        // return false;
    }

}