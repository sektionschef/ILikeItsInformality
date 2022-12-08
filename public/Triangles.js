class Triangle {

    constructor() {
        // this.A = createVector(getRandomFromInterval(DOMINANTSIDE * 0.4, DOMINANTSIDE * 0.6), getRandomFromInterval(DOMINANTSIDE * 0.4, DOMINANTSIDE * 0.6));
        this.A = createVector(2400, 1300);

        this.lengthB = 500;
        this.B = p5.Vector.fromAngle(radians(340), this.lengthB).add(this.A);

        this.lengthC = 700;
        this.C = p5.Vector.fromAngle(radians(30), this.lengthC).add(this.A);
    }

    show() {
        push();
        stroke("#4c8137");
        strokeWeight(50);
        point(this.A.x, this.A.y);

        stroke("#ad7f7f");
        point(this.B.x, this.B.y);

        stroke("#14195e");
        point(this.C.x, this.C.y);
        pop();
    }
}

class TriangleSystem {

    constructor() {
        this.triangles = [];

        this.triangles.push(new Triangle());
    }

    show() {
        for (var i = 0; i < this.triangles.length; i++) {
            this.triangles[i].show();
        }
    }
}