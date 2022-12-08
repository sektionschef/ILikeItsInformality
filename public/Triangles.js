class Triangle {

    constructor() {
        this.margin = DOMINANTSIDE * 0.1;

        // this.A = createVector(2400, 1300);
        this.A = createVector(
            getRandomFromInterval(this.margin, width - this.margin),
            getRandomFromInterval(this.margin, height - this.margin)
        );

        this.lengthB = 500;
        this.B = p5.Vector.fromAngle(radians(340), this.lengthB).add(this.A);

        this.lengthC = 700;
        this.C = p5.Vector.fromAngle(radians(30), this.lengthC).add(this.A);

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
    }
}

class TriangleSystem {

    constructor() {
        this.triangles = [];
        this.triangleCount = 55;

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
                return true;
            }
        }
        return false;
    }
}