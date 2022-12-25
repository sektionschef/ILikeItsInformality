class Line {
    constructor(orientation, x, y, limit_x, limit_y, buffer) {
        this.orientation = orientation;
        this.x = x;
        this.y = y;
        this.limit_x = limit_x;
        this.limit_y = limit_y;
        this.buffer = buffer;
        this.history = [];
        this.line_color = distortColor(color(STROKE_COLOR), STROKE_NOISE);
        this.line_color_second = distortColor(color(STROKE_COLOR), STROKE_NOISE_2);

        this.run_complete = false;
        this.stroke_size_dynamic = STROKE_SIZE;
        // this.stroke_speed = STROKE_SPEED
        this.stroke_speed = getRandomFromInterval(1, 1.5);
    }

    show() {

        if (this.run_complete == false) {

            if (this.orientation == "x") {
                if (this.x <= this.limit_x) {
                    this.x += this.stroke_speed;
                    this.y = this.y + getRandomFromInterval(-1 * STROKE_DISTORT, STROKE_DISTORT);
                    // if (frameCount % STROKE_RESOLUTION == 0) {
                    //     this.history.push(createVector(this.x, this.y));
                    // }
                } else {
                    this.run_complete = true;
                }
            } else if (this.orientation == "y") {
                if (this.y <= this.limit_y) {
                    this.y += this.stroke_speed;
                    this.x = this.x + getRandomFromInterval(-1 * STROKE_DISTORT, STROKE_DISTORT);
                    // if (frameCount % STROKE_RESOLUTION == 0) {
                    //     this.history.push(createVector(this.x, this.y));
                    // }
                } else {
                    this.run_complete = true;
                }
            } else if (this.orientation == "xy") {
                if (this.x <= this.limit_x && this.y <= this.limit_y) {
                    this.x += this.stroke_speed;
                    this.y += this.stroke_speed;
                    this.x = this.x + getRandomFromInterval(-1 * STROKE_DISTORT, STROKE_DISTORT);
                    this.y = this.y + getRandomFromInterval(-1 * STROKE_DISTORT, STROKE_DISTORT);
                    // if (frameCount % STROKE_RESOLUTION == 0) {
                    //     this.history.push(createVector(this.x, this.y));
                    // }
                } else {
                    this.run_complete = true;
                }
            } else if (this.orientation == "yx") {
                if (this.x <= this.limit_x && this.y >= this.limit_y) {
                    this.x += this.stroke_speed;
                    this.y -= this.stroke_speed;
                    this.x = this.x + getRandomFromInterval(-1 * STROKE_DISTORT, STROKE_DISTORT);
                    this.y = this.y + getRandomFromInterval(-1 * STROKE_DISTORT, STROKE_DISTORT);
                    // if (frameCount % STROKE_RESOLUTION == 0) {
                    //     this.history.push(createVector(this.x, this.y));
                    // }
                } else {
                    this.run_complete = true;
                }
            }

            // traces with history
            // push();
            // strokeWeight(STROKE_SIZE);
            // stroke(this.line_color);
            // noFill();
            // beginShape();
            // for (let i = 0; i < this.history.length; i++) {
            //     vertex(this.history[i].x * SCALING_FACTOR, this.history[i].y * SCALING_FACTOR);
            // }
            // endShape();
            // pop();

            // NEW
            if (frameCount % 5 == 0) {
                // STROKE_SIZE = getRandomFromInterval(1, 3);
                this.stroke_size_dynamic += this.stroke_size_dynamic * getRandomFromInterval(-0.05, 0.05);
            }

            // brush
            this.buffer.push();
            this.buffer.noStroke();
            this.buffer.fill(this.line_color);
            this.buffer.circle(this.x * SCALING_FACTOR, this.y * SCALING_FACTOR, this.stroke_size_dynamic);
            this.buffer.fill(this.line_color_second);
            this.buffer.circle(this.x * SCALING_FACTOR, this.y * SCALING_FACTOR, 1);
            this.buffer.pop()
        }
    }
}

class Lines {
    constructor(x_start, y_start, x_stop, y_stop, padding_x, padding_y, distance_between_lines) {
        this.x_start = x_start;
        this.y_start = y_start;
        this.x_stop = x_stop;
        this.y_stop = y_stop;
        this.padding_x = padding_x;
        this.padding_y = padding_y;
        this.distance_between_lines = distance_between_lines;

        this.buffer = createGraphics(width, height);

        this.bodies = [];
        this.all_lines_complete = false;

        // let chosen_axis = getRandomFromList(["x", "y", "xy", "yx", "blank"])
        let chosen_axis = getRandomFromList(["y", "yx"])
        console.log("chosen axis: " + chosen_axis);

        if (chosen_axis == "x") {
            this.count_lines = ((this.y_stop - this.y_start) - 2 * this.padding_y) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.bodies.push(new Line(
                    chosen_axis,
                    (this.x_start + this.padding_x),
                    (this.y_start + this.padding_y + this.distance_between_lines * i),
                    (this.x_stop - this.padding_x),
                    this.y_stop - this.padding_y),
                    this.buffer,
                );
            }
        } else if (chosen_axis == "y") {
            this.count_lines = ((this.x_stop - this.x_start) - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.bodies.push(new Line(
                    chosen_axis,
                    (this.x_start + this.padding_x + this.distance_between_lines * i),
                    (this.y_start + this.padding_y),
                    this.x_stop - this.padding_x,
                    (this.y_stop - this.padding_x),
                    this.buffer,
                ));
            }
        } else if (chosen_axis == "xy") {
            this.count_lines = ((this.x_stop - this.x_start) - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.bodies.push(new Line(
                    chosen_axis,
                    (this.x_start + this.padding_x + this.distance_between_lines * i),
                    (this.y_start + this.padding_y),
                    this.x_stop - this.padding_x,
                    (this.y_stop - this.padding_y)));
            }
            this.count_lines = ((this.y_stop - this.y_start) - 2 * this.padding_y) / this.distance_between_lines;
            // skip first one
            for (let i = 1; i < this.count_lines; i++) {
                this.bodies.push(new Line(
                    chosen_axis,
                    (this.x_start + this.padding_x),
                    (this.y_start + this.padding_y + this.distance_between_lines * i),
                    this.x_stop - this.padding_x,
                    (this.y_stop - this.padding_y),
                    this.buffer,));
            }
        } else if (chosen_axis == "yx") {
            this.count_lines = ((this.x_stop - this.x_start) - 2 * this.padding_x) / this.distance_between_lines;

            for (let i = 0; i < this.count_lines; i++) {
                this.bodies.push(new Line(
                    chosen_axis,
                    this.x_start + this.padding_x + this.distance_between_lines * i,
                    (this.y_stop - this.padding_y),
                    (this.x_stop - this.padding_x),
                    (this.y_start + this.padding_y),
                    this.buffer,
                )
                );
            }
            this.count_lines = ((this.y_stop - this.y_start) - 2 * this.padding_y) / this.distance_between_lines;

            for (let i = 1; i < this.count_lines; i++) {
                this.bodies.push(new Line(
                    chosen_axis,
                    this.x_start + this.padding_x,
                    (this.y_stop - this.padding_y - this.distance_between_lines * i),
                    (this.x_stop - this.padding_x),
                    (this.y_start + this.padding_y),
                    this.buffer,
                )
                );
            }
        } else if (chosen_axis == "blank") {
        }
    }

    show() {
        for (var line of this.bodies) {
            line.show();
        }
    }

    check_all_complete() {
        // skip if already complete
        if (this.all_lines_complete == false) {
            this.all_lines_complete = true;
            for (var line of this.bodies) {
                if (line.run_complete == false) {
                    this.all_lines_complete = false;
                }
            }
        }
    }
}