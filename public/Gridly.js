class Gridly {

    constructor() {
        this.countX = 30;
        this.countY = 60;
        this.marginX = width * 0.03;
        this.marginY = height * 0.03;
        this.distortX = width * 0.01;
        this.distortY = height * 0.01; // 0.04

        this.stepX = (width - this.marginX * 2) / this.countX;
        this.stepY = (height - this.marginY * 2) / this.countY;

        // this.points = [];
        // var rowPoints;
        // for (var row = this.marginY; row < (height - this.marginY); row += this.stepY) {
        //     rowPoints = [];
        //     for (var column = this.marginX; column < (width - this.marginX); column += this.stepX) {
        //         rowPoints.push(createVector(
        //             column + getRandomFromInterval(-this.distortX, this.distortX),
        //             row + getRandomFromInterval(-this.distortY, this.distortY)
        //         ));
        //     }
        //     this.points.push(rowPoints);
        // }

        // stroke(color(50));
        // strokeWeight(getRandomFromInterval(0.2, 1.5));

        // console.log(this.points);
    }


    show() {

        this.points = [];
        var rowPoints;
        for (var row = this.marginY; row < (height - this.marginY); row += this.stepY) {
            rowPoints = [];
            for (var column = this.marginX; column < (width - this.marginX); column += this.stepX) {
                rowPoints.push(createVector(
                    column + getRandomFromInterval(-this.distortX, this.distortX),
                    row + getRandomFromInterval(-this.distortY, this.distortY)
                ));
            }
            this.points.push(rowPoints);
        }

        for (var i = 0; i < (this.points.length); i++) {
            for (var v = 0; v < (this.points[i].length - 1); v++) {
                // console.log(i);
                push();
                stroke(color(0, 20));
                strokeWeight(getRandomFromInterval(0.1, 0.5));

                line(this.points[i][v].x, this.points[i][v].y, this.points[i][v + 1].x, this.points[i][v + 1].y);
                pop();
            }
        }

        this.done = true;
    }
}