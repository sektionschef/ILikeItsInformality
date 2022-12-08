class PupselGrid {

    constructor(data) {
        this.margin = 0;
        this.brushSize = DOMINANTSIDE * 0.01;
        this.brushNumber = 15;
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

                brushstrokes = [];

                for (var i = 0; i < this.brushNumber; i++) {
                    brushstrokes.push({
                        // shape: "Line",
                        pos: createVector(pupselX, pupselY),
                        posB: createVector(pupselX + getRandomFromInterval(-this.brushSize, this.brushSize), pupselY + getRandomFromInterval(-this.brushSize, this.brushSize)),
                    })
                }

                this.pupsels.push({
                    "pos": createVector(pupselX, pupselY),
                    "center": this.center,
                    "pupselsize": this.pupselSize,
                    "color": this.color,
                    "brushstrokes": brushstrokes,
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
            this.color = color('#575757');

            // density
            // if (i % 13 == 0) {
            //     this.color = color('#d43838');
            // } else {
            //     this.color = color('#575757');
            // }

            // if (x >= DOMINANTSIDE * 0.2 && x < DOMINANTSIDE * 0.8 && y >= DOMINANTSIDE * 0.3 && y < DOMINANTSIDE * 0.7) {
            //     this.color = color('#d43838');
            // }

            // if (triangles.insidePolygon(x, y)) {
            //     this.color = color('#d43838');
            // }
            var oida = triangles.insidePolygon(x, y);
            // console.log(oida);
            if (oida) {
                this.color = oida;
            }

            // distort color
            this.color = distortColorSuperNew(this.color, 55);

            // points
            // push();
            // stroke(this.color);
            // strokeWeight(15);
            // point(this.pupsels[i].pos.x, this.pupsels[i].pos.y);
            // pop();

            // brushstrokes
            for (var v = 0; v < this.pupsels[i].brushstrokes.length; v++) {

                push();
                stroke(this.color);
                strokeWeight(0.5);

                line(this.pupsels[i].brushstrokes[v].pos.x, this.pupsels[i].brushstrokes[v].pos.y, this.pupsels[i].brushstrokes[v].posB.x, this.pupsels[i].brushstrokes[v].posB.y);
                pop();

            }
        }

    }
}