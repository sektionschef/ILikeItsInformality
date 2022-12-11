class PupselGrid {

    constructor(data) {
        this.margin = 0;
        this.pupselNumber = DOMINANTSIDE / RESOLUTION;  // 20
        this.pupselSize = (DOMINANTSIDE - 2 * this.margin) / this.pupselNumber;
        this.pupselColors = PALETTE.pixelColors;
        // console.log("blocksize: " + this.blockSize);

        this.pupsels = [];
        var brushstrokes;

        for (var pupselY = this.margin; pupselY < (height - this.margin); pupselY += this.pupselSize) {
            for (var pupselX = this.margin; pupselX < (width - this.margin); pupselX += this.pupselSize) {

                // if (blockX < 100 && blockX > (width - 100) && blockY < 100 && blockY > (height - 100)) {

                this.center = createVector(pupselX + this.pupselSize / 2, pupselY + this.pupselSize / 2);

                // brushstrokes = [];

                this.pupsels.push({
                    "pos": createVector(pupselX, pupselY),
                    "center": this.center,
                    "pupselsize": this.pupselSize,
                    "color": this.color,
                    // "brushstrokes": brushstrokes,
                });

            }

            // console.log(this.pupsels);
        }
    }

    show() {

        var x;
        var y;

        for (var i = 0; i < this.pupsels.length; i++) {

            x = (i % this.pupselNumber) * this.pupselSize;
            y = Math.floor(i / this.pupselNumber) * this.pupselSize;

            // default color
            this.pupsels[i].color = color('#ffffff');

            var newColor = triangles.insidePolygon(x, y, i);
            // console.log(oida);
            if (newColor) {
                this.pupsels[i].color = newColor;
            }

            // stripes
            // if (i % 3 == 0) {
            //     this.color = color('#3d3d3d');
            // }

            // distort color
            this.pupsels[i].color = distortColorSuperNew(this.pupsels[i].color, 15);

            // PupselBrush.showPoints(this.pupsels[i]);
            PupselBrush.showBrushStrokes(this.pupsels[i], x, y);

        }

    }
}


class PupselBrush {

    constructor() {
    }

    static showPoints(pupsel) {

        push();
        stroke(pupsel.color);
        strokeWeight(15);
        point(pupsel.pos.x, pupsel.pos.y);
        pop();
    }

    static showBrushStrokes(pupsel, x, y) {

        this.brushNumber = 15;
        // this.brushSize = DOMINANTSIDE * 0.003;  // 0.01, 0.005, 0.003

        this.brushSize = map(x, 0, width / 2, DOMINANTSIDE * 0.003, DOMINANTSIDE * 0.01);

        for (var i = 0; i < this.brushNumber; i++) {

            push();
            stroke(pupsel.color);
            // strokeWeight(0.5);
            strokeWeight(1);

            line(
                pupsel.pos.x,
                pupsel.pos.y,
                pupsel.pos.x + getRandomFromInterval(-this.brushSize, this.brushSize),
                pupsel.pos.y + getRandomFromInterval(-this.brushSize, this.brushSize)
            );

            pop();

        }

    }
}