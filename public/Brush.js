class Brush {
    constructor(start, end, colorObject, category, buffer) {
        this.buffer = buffer;
        this.fullspeed = 5; // BRUSHFULLSPEED // 2-5;
        this.opacityLevel = 30;
        this.radiusMin = 0.003 * DOMINANTSIDE; // BRUSHSIZEMIN; // 1;
        this.radiusMax = 0.004 * DOMINANTSIDE; //BRUSHSIZEMAX; // 2;
        // this.brushShape = "Ellipse";
        // this.brushShape = "Line";
        this.brushShape = "Triangle"; //BRUSHSHAPE;
        this.distanceBoost = 4; // 4 faster, 8 slower, but thicker - where the points are
        // this.noiseYzoom = 0.007;  // zoom on noise
        // this.amplitudeNoiseY = 3.5;  // up and down on Y axis
        this.OkLevel = 40;  // some offset is ok.
        // this.fillColor = colorObject;
        this.fillColor = color(red(colorObject), green(colorObject), blue(colorObject), this.opacityLevel);
        // this.strokeColor = colorObject;
        this.strokeColor = color(red(colorObject), green(colorObject), blue(colorObject), this.opacityLevel);
        this.strokeSize = 0.2; // BRUSHFIBRESIZE;  // good one
        this.strokeColorDistort = 10; // BRUSHFIBRECOLORNOISE;

        this.start = start;
        this.end = end;
        this.category = category;

        this.alive = true;
        this.passedA = false;
        this.passedB = false;

        this.pos = this.start.copy();
        this.elementCount = 5;  // per step
        this.elements = [];

        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
        this.Distance = p5.Vector.sub(this.end, this.start);
        this.DistanceLength = this.Distance.mag();

        this.distAccSlo = this.DistanceLength / this.distanceBoost;  // distance for acceleration and slow down
        this.boost = this.fullspeed / this.distAccSlo;
        this.checkpointA = p5.Vector.add(this.start, p5.Vector.div(this.Distance, this.distanceBoost));  // distance for full speed
        this.checkpointB = p5.Vector.sub(this.end, p5.Vector.div(this.Distance, this.distanceBoost));  // distance for full speed

        // console.log("accdist: " + this.distAccSlo);
        // console.log("boost: " + this.boost);
        // console.log("step: " + this.distAccSlo / this.boost);

        this.accBoost = p5.Vector.mult(p5.Vector.normalize(this.Distance), this.boost);
        this.sloBoost = p5.Vector.mult(this.accBoost, -1);

        // this.makeSomeNoise();

        this.get_orientation();

        // trying to get scalar projection - create a 90 degrees finish line for the brush
        this.anglePath = atan2(this.end.y - this.start.y, this.end.x - this.start.x);
        // console.log(this.anglePath);
        this.endOrtho = p5.Vector.add(this.end, p5.Vector.fromAngle(this.anglePath - PI / 2, 100));
        // console.log(this.endOrtho)

    }

    // makeSomeNoise() {
    //     this.noisesY = {};

    //     let ioff = getRandomFromInterval(0, 200);  // start at different location for each line

    //     // Iterate over horizontal pixels
    //     for (let i = this.start; i <= this.end; i++) {
    //         // Calculate a y value according to noise, map to

    //         // console.log(i);
    //         this.noisesY[i] = map(noise(ioff), 0, 1, -this.amplitudeNoiseY, this.amplitudeNoiseY);

    //         // Increment x dimension for noise
    //         ioff += this.noiseYzoom;
    //     }
    // }

    get_orientation() {
        // needed for hatching

        this.acceptanceLevel = PI / 12

        this.angle = p5.Vector.sub(this.end, this.start).heading();

        if (this.angle > -this.acceptanceLevel && this.angle < this.acceptanceLevel) {
            // this.strokeColor = "red";
            this.orientation = "left-right";
        } else if (this.angle > (PI / 4 - this.acceptanceLevel) && this.angle < (PI / 4 + this.acceptanceLevel)) {
            // this.strokeColor = "purple";
            this.orientation = "top/left-bottom/right";
        } else if (this.angle > (PI / 2 - this.acceptanceLevel) && this.angle < (PI / 2 + this.acceptanceLevel)) {
            // this.strokeColor = "green";
            this.orientation = "top-bottom";
        } else if (this.angle < -(PI / 4 - this.acceptanceLevel) && this.angle > -(PI / 4 + this.acceptanceLevel)) {
            // this.strokeColor = "blue";
            this.orientation = "left/bottom-top/right";
        } else {
            if (MODE > 1) {
                console.warn("some noise with this.angle: " + this.angle);
            }
            // throw "no orientation"
            // this.alive = false;
            this.orientation = "unkown";
        }
    }

    get_status() {
        // get the point in orthogonal line to the end point.
        this.orthoProjectionPoint = orthogonalProjection1(this.end, this.endOrtho, this.pos);

        if (this.pos.dist(this.orthoProjectionPoint) <= this.OkLevel) {
            this.alive = false;  // reaching the goal of one axis is enough (xy & yx case)
            this.acc = createVector(0, 0, 0);
            this.vel = createVector(0, 0, 0);
            // console.log("stop");
        }
        if (this.pos.dist(this.checkpointA) <= 2) {
            this.passedA = true;
        }
        if (this.pos.dist(this.checkpointB) <= 2) {
            this.passedB = true;
        }

    }

    savePath() {

        this.brushSize = this.radius;

        this.elements = [];  // remove history

        if (this.brushShape == "Line") {

            for (var i = 0; i < this.elementCount; i++) {
                this.elements.push({
                    shape: "Line",
                    posX: this.pos.x + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posY: this.pos.y + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posBX: this.pos.x + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posBY: this.pos.y + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                })
            }
        } else if (this.brushShape == "Ellipse") {

            for (var i = 0; i < this.elementCount; i++) {
                this.elements.push({
                    shape: "Ellipse",
                    posX: this.pos.x + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posY: this.pos.y + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    width: getP5RandomFromInterval(0, this.brushSize / 2),
                    height: getP5RandomFromInterval(0, this.brushSize / 2),
                })
            }
        } else if (this.brushShape == "Triangle") {
            for (var i = 0; i < this.elementCount; i++) {
                this.elements.push({
                    shape: "Triangle",
                    posX: this.pos.x + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posY: this.pos.y + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posBX: this.pos.x + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posBY: this.pos.y + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posCX: this.pos.x + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                    posCY: this.pos.y + getP5RandomFromInterval(-this.brushSize, this.brushSize),
                })
            }
        } else {
            console.warn("No brush shape specified, oida!")
        }
    }


    update() {

        if (this.alive) {
            this.get_status();

            if (this.passedA == false) {
                // console.log("accelerate");
                this.acc = this.accBoost;
            } else if (this.passedA == true && this.passedB == false) {
                // console.log("full speed");
                this.acc = createVector(0, 0, 0);
                // this.acc = createVector(getRandomFromInterval(-0.001, 0.001), getRandomFromInterval(-0.001, 0.001), 0);
            } else if (this.passedA == true && this.passedB == true) {
                // console.log("slow down");
                this.acc = this.sloBoost;
            } else if (this.alive == false) {
                // console.log("stop");
            }

            this.vel.add(this.acc);
            this.pos.add(this.vel);

            if (this.acc.x < 0 || this.acc.x < 0 || this.acc.x < 0) {
                // this.vel = createVector(0, 0, 0);
            }

            // if (this.orientation == "x") {
            // this.pos.y = this.start2 + this.noisesY[Math.round(mover)];
            // } else if (this.orientation == "y") {
            // this.pos.x = this.start2 + this.noisesY[Math.round(mover)];
            // } else if (this.orientation == "xy") {
            // }
            // MISSING THE NOISE


            if (this.vel.x > 0) {
                // this.radius = map(this.vel.x, 0, 3, 1, 0.3)
                this.radius = Math.round(map(this.vel.x, BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX, this.radiusMax, this.radiusMin) * 100) / 100
            } else if (this.vel.y > 0) {
                // this.radius = map(this.vel.y, 0, 3, 1, 0.3)
                this.radius = Math.round(map(this.vel.y, BRUSHFULLSPEEDMIN, BRUSHFULLSPEEDMAX, this.radiusMax, this.radiusMin) * 100) / 100
            }

            this.savePath();

        }

    }

    show() {

        let MODE = 1
        if (MODE >= 5) {
            // scalar
            push();
            translate(-width / 2, -height / 2);
            // ellipse(this.endOrtho.x, this.endOrtho.y, 10);
            drawArrow(this.end, this.endOrtho, "orange");  // not working
            translate(this.orthoProjectionPoint.x, this.orthoProjectionPoint.y);
            // ellipse(0, 0, 30);
            pop();


            // start
            push();
            translate(-width / 2, -height / 2);
            translate(this.start);
            noStroke();
            fill("blue");
            ellipse(0, 0, 10);
            pop();

            // accA
            push();
            translate(-width / 2, -height / 2);
            translate(this.checkpointA);
            noStroke();
            fill("red");
            ellipse(0, 0, 5);
            stroke(5);
            pop();


            // accB
            push();
            translate(-width / 2, -height / 2);
            translate(this.checkpointB);
            noStroke();
            fill("red");
            ellipse(0, 0, 5);
            pop();


            // end
            push();
            translate(-width / 2, -height / 2);
            translate(this.end);
            noStroke();
            fill("purple");
            ellipse(0, 0, 10);
            pop();
        }

        // if (this.alive) {

        // with moving circle
        if (MODE >= 5) {
            push();
            translate(-width / 2, -height / 2);
            translate(this.pos);
            noStroke();
            fill("black");
            ellipse(0, 0, this.radius * 3, this.radius * 3);
            pop();
        } else {
            this.drawBrush();
        }
        // }
    }

    drawBrush() {

        if (this.alive) {

            for (var i = 0; i < this.elements.length; i++) {
                this.buffer.push();
                // brushBuffer.translate(-width / 2, -height / 2);
                // console.log(this.elements);
                this.buffer.strokeWeight(this.strokeSize);
                // this.buffer.stroke(distortColorNew(this.strokeColor, this.strokeColorDistort, false))
                // this.buffer.stroke(distortColorNew(this.strokeColorTemp, this.strokeColorDistort, false))
                this.buffer.stroke("black");
                // this.buffer.noFill();
                // this.buffer.fill(this.strokeColorTemp);
                this.buffer.fill(color("pink"));
                if (this.brushShape == "Line") {
                    this.buffer.line(this.elements[i].posX, this.elements[i].posY, this.elements[i].posBX, this.elements[i].posBY);
                } else if (this.brushShape == "Ellipse") {
                    this.buffer.ellipse(this.elements[i].posX, this.elements[i].posY, this.elements[i].width, this.elements[i].height);
                } else if (this.brushShape == "Triangle") {
                    this.buffer.triangle(this.elements[i].posX, this.elements[i].posY, this.elements[i].posBX, this.elements[i].posBY, this.elements[i].posCX, this.elements[i].posCY);
                } else {
                    console.warn("No brush shape specified, oida!")
                }
                this.buffer.pop();
            }
        }
    }


}

class BrushSystem {
    constructor() {
        this.brushes = [];
        this.buffer = createGraphics(width, height);
    }

    add(brush) {
        this.brushes.push(brush);
    }

    show() {
        for (var brush of this.brushes) {
            brush.update();
            brush.show();
        }
    }

    check_all_complete(category) {

        // skip if not needed at all
        if (this.all_lines_complete == false || this.brushes.length > 0) {

            this.brushes_alive_status = [];
            for (var brush of this.brushes) {

                if (brush.category == category) {
                    this.brushes_alive_status.push(brush.alive);
                    // console.log(this.brushes_alive_status)
                }

            }

            return this.brushes_alive_status.every(element => element === false);
        } else {
            return false;
        }

    }
}