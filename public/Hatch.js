class Hatch {
    constructor(start, end, colorObject, buffer) {
        // this.hatchfullspeedmin = 1;
        // this.hatchfullspeedmax = 2;
        // this.hatchfullspeed = // Math.round(getRandomFromInterval(this.hatchfullspeedmin, this.hatchfullspeedmax) * 100) / 100;
        this.fullspeed = 5; // hatchFULLSPEED // 2-5;
        this.opacityLevel = 255;
        this.radiusMin = 0.001 * DOMINANTSIDE; // 0.001;
        this.radiusMax = 0.002 * DOMINANTSIDE; // 0.002;
        this.distanceBoost = 4; // 4 faster, 8 slower, but thicker - where the points are

        this.buffer = buffer;
        // this.noiseYzoom = 0.007;  // zoom on noise
        // this.amplitudeNoiseY = 3.5;  // up and down on Y axis
        this.OkLevel = 40;  // some offset is ok.
        // this.fillColor = colorObject;
        this.fillColor = color(red(colorObject), green(colorObject), blue(colorObject), this.opacityLevel);
        // this.strokeColor = colorObject;
        this.strokeColor = color(red(colorObject), green(colorObject), blue(colorObject), this.opacityLevel);
        // this.strokeSize = 0.5; // hatchFIBRESIZE;  // good one
        this.strokeColorDistort = 10; // hatchFIBRECOLORNOISE;

        this.start = start;
        this.end = end;

        this.alive = true;
        this.passedA = false;
        this.passedB = false;

        this.pos = this.start.copy();
        this.elementCount = 1;  // per step
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

        // trying to get scalar projection - create a 90 degrees finish line for the hatch
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
            console.warn("some noise with this.angle: " + this.angle);
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

            // if (this.acc.x < 0 || this.acc.x < 0 || this.acc.x < 0) {
            // this.vel = createVector(0, 0, 0);
            // }

            // if (this.orientation == "x") {
            // this.pos.y = this.start2 + this.noisesY[Math.round(mover)];
            // } else if (this.orientation == "y") {
            // this.pos.x = this.start2 + this.noisesY[Math.round(mover)];
            // } else if (this.orientation == "xy") {
            // }
            // MISSING THE NOISE

            this.strokeSize = Math.round(map(this.vel.mag(), 1, 3, 15, 5) * 100) / 100


            // if (this.vel.x > 0) {
            //     // this.radius = map(this.vel.x, 0, 3, 1, 0.3)
            //     this.radius = Math.round(map(this.vel.x, this.hatchfullspeedmin, this.hatchfullspeedmax, this.radiusMax, this.radiusMin) * 100) / 100
            //     this.strokeSize = Math.round(map(this.vel.x, 0, 5, 3, 5) * 100) / 100
            // } else if (this.vel.y > 0) {
            //     // this.radius = map(this.vel.y, 0, 3, 1, 0.3)
            //     // console.log(this.vel);
            //     this.radius = Math.round(map(this.vel.y, this.hatchfullspeedmin, this.hatchfullspeedmax, this.radiusMax, this.radiusMin) * 100) / 100
            //     this.strokeSize = Math.round(map(this.vel.y, 0, 0.01, 3, 5) * 100) / 100
            // }

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
            this.drawHatch();
        }
    }

    drawHatch() {

        if (this.alive) {
            // this.strokeSize = 5;

            this.buffer.push();
            this.buffer.strokeWeight(this.strokeSize);
            this.buffer.stroke(this.strokeColor);
            this.buffer.noFill();
            this.buffer.point(this.pos.x, this.pos.y);
            this.buffer.pop();
        }
    }


}

class hatchSystem {
    constructor(x_start, y_start, x_stop, y_stop, distance_between_lines, colorObject) {
        this.color = colorObject;// color("black");

        this.x_start = x_start;
        this.y_start = y_start;
        this.x_stop = x_stop;
        this.y_stop = y_stop;
        this.distance_between_lines = distance_between_lines;

        this.hatches = [];
        this.buffer = createGraphics(width, height);

        // this.chosen_axis = getRandomFromList(["x", "y", "xy", "yx", "blank"])
        // this.chosen_axis = getRandomFromList(["x", "y", "xy", "yx"])
        this.chosen_axis = getRandomFromList(["yx", "xy", "x&y"])
        // console.log("chosen axis: " + this.chosen_axis);

        this.createHatches();
        this.show();
    }

    createHatches() {
        if (this.chosen_axis == "x") {
            this.count_lines = (this.y_stop - this.y_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        this.x_start,
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    createVector(
                        this.x_stop,
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    this.color,
                    this.buffer,
                ));
            }
        } else if (this.chosen_axis == "y") {
            this.count_lines = (this.x_stop - this.x_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        (this.x_start + this.distance_between_lines * i),
                        (this.y_start),
                    ),
                    createVector(
                        (this.x_start + this.distance_between_lines * i),
                        this.y_stop,
                    ),
                    this.color,
                    this.buffer,
                ));
            }
        } else if (this.chosen_axis == "xy") {
            this.count_lines = (this.x_stop - this.x_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        (this.x_start + this.distance_between_lines * i),
                        (this.y_start),
                    ),
                    createVector(
                        this.x_stop,
                        (this.y_stop - this.distance_between_lines * i),
                    ),
                    this.color,
                    this.buffer
                ));
            }
            this.count_lines = (this.y_stop - this.y_start) / this.distance_between_lines;
            // skip first one
            for (let i = 1; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        (this.x_start),
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    createVector(
                        this.x_stop - this.distance_between_lines * i,
                        (this.y_stop),
                    ),
                    this.color,
                    this.buffer,));
            }
        } else if (this.chosen_axis == "yx") {
            this.count_lines = (this.x_stop - this.x_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        this.x_start + this.distance_between_lines * i,
                        (this.y_stop),
                    ),
                    createVector(
                        (this.x_stop),
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    this.color,
                    this.buffer,
                )
                );
            }
            this.count_lines = (this.y_stop - this.y_start) / this.distance_between_lines;

            for (let i = 1; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        this.x_start,
                        (this.y_stop - this.distance_between_lines * i),
                    ),
                    createVector(
                        (this.x_stop - this.distance_between_lines * i),
                        (this.y_start),
                    ),
                    this.color,
                    this.buffer,
                )
                );
            }
        } else if (this.chosen_axis == "blank") {

        } else if (this.chosen_axis == "x&y") {
            this.count_lines = (this.y_stop - this.y_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        this.x_start,
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    createVector(
                        this.x_stop,
                        (this.y_start + this.distance_between_lines * i),
                    ),
                    this.color,
                    this.buffer,
                ));
            }

            this.count_lines = (this.x_stop - this.x_start) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.hatches.push(new Hatch(
                    createVector(
                        (this.x_start + this.distance_between_lines * i),
                        (this.y_start),
                    ),
                    createVector(
                        (this.x_start + this.distance_between_lines * i),
                        this.y_stop,
                    ),
                    this.color,
                    this.buffer,
                ));
            }
        }
    }

    add(hatch) {
        this.hatches.push(hatch);
    }

    show() {
        while (this.check_all_complete() == false) {
            for (var hatch of this.hatches) {
                hatch.update();
                hatch.show();
            }
        }
    }

    check_all_complete() {

        // skip if not needed at all
        if (this.all_lines_complete == false || this.hatches.length > 0) {

            this.hatches_alive_status = [];
            for (var hatch of this.hatches) {

                this.hatches_alive_status.push(hatch.alive);
                // console.log(this.hatches_alive_status)

            }

            return this.hatches_alive_status.every(element => element === false);
        } else {
            return false;
        }

    }

}