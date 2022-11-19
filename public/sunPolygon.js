class sunPolygon {

    constructor() {

        // sunPolygon = [
        //   createVector(-0.05 * DOMINANTSIDE, 0.05 * DOMINANTSIDE),
        //   createVector(0.05 * DOMINANTSIDE, -0.05 * DOMINANTSIDE),
        //   createVector(width + 0.05 * DOMINANTSIDE, height - 0.05 * DOMINANTSIDE),
        //   createVector(width - 0.05 * DOMINANTSIDE, height + 0.05 * DOMINANTSIDE),
        // ]

        this.coords = [
            createVector(getRandomFromInterval(0.15, 0.40) * DOMINANTSIDE, getRandomFromInterval(-0.2, 0.3) * DOMINANTSIDE),
            createVector(getRandomFromInterval(0.50, 0.70) * DOMINANTSIDE, getRandomFromInterval(-0.2, 0.3) * DOMINANTSIDE),
            createVector(width - getRandomFromInterval(0.15, 0.40) * DOMINANTSIDE, height - getRandomFromInterval(-0.2, 0.3) * DOMINANTSIDE),
            createVector(width - getRandomFromInterval(0.50, 0.70) * DOMINANTSIDE, height - getRandomFromInterval(-0.2, 0.3) * DOMINANTSIDE),
        ]

        // check polygon script manually
        this.coordsList = [
            [this.coords[0].x, this.coords[0].y],
            [this.coords[1].x, this.coords[1].y],
            [this.coords[2].x, this.coords[2].y],
            [this.coords[3].x, this.coords[3].y]
        ]
    }

    show() {
        push();
        translate(-width / 2, -height / 2);
        noFill();
        beginShape();
        vertex(this.coords[0].x, this.coords[0].y);
        vertex(this.coords[1].x, this.coords[1].y);
        vertex(this.coords[2].x, this.coords[2].y);
        vertex(this.coords[3].x, this.coords[3].y);
        endShape(CLOSE);

        // console.log(mouseX)
        pop();

        // check polygon script manually
        push();
        translate(-width / 2, -height / 2);
        translate(mouseX, mouseY);
        ellipse(0, 0, 30)
        console.log(pointInPolygon(this.coordsList, [mouseX, mouseY]));
        pop();
    }
}