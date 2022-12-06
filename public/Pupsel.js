class PupselGrid {

    constructor(data) {
        this.margin = 0;
        this.brushSize = DOMINANTSIDE * 0.01;
        this.brushNumber = 15;
        this.pupselNumber = DOMINANTSIDE / 5;
        this.pupselSize = (DOMINANTSIDE - 2 * this.margin) / this.pupselNumber;
        this.pupselColors = PALETTE.pixelColors;
        // console.log("blocksize: " + this.blockSize);

        this.pupsels = [];
        var brushstrokes;

        for (var pupselX = this.margin; pupselX < (width - this.margin); pupselX += this.pupselSize) {

            for (var pupselY = this.margin; pupselY < (height - this.margin); pupselY += this.pupselSize) {

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

        for (var i = 0; i < this.pupsels.length; i++) {
            // push();
            // stroke('black');
            // strokeWeight(0.5);
            // point(this.pupsels[i].pos.x, this.pupsels[i].pos.y);
            // pop();

            for (var v = 0; v < this.pupsels[i].brushstrokes.length; v++) {
                push();
                // brushBuffer.translate(-width / 2, -height / 2);
                // console.log(this.elements);
                strokeWeight(0.5);
                // paintBroBuffer.stroke(distortColorNew(this.strokeColor, this.strokeColorDistort, false))
                // paintBroBuffer.stroke(distortColorNew(this.strokeColorTemp, this.strokeColorDistort, false))
                // paintBroBuffer.noFill();
                // fill(this.strokeColorTemp);

                line(this.pupsels[i].brushstrokes[v].pos.x, this.pupsels[i].brushstrokes[v].pos.y, this.pupsels[i].brushstrokes[v].posB.x, this.pupsels[i].brushstrokes[v].posB.y);

                pop();
            }
        }

    }
}