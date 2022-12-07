class PupselGrid {

    constructor(data) {
        this.margin = 0;
        this.brushSize = DOMINANTSIDE * 0.01;
        this.brushNumber = 15;
        this.pupselNumber = DOMINANTSIDE / 100;  // 20
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

        var x;
        var y;
        console.log(this.pupselNumber * 0.2);

        for (var i = 0; i < this.pupsels.length; i++) {

            x = i % width;
            y = Math.floor(i / this.pupselNumber);

            // push();
            // stroke('black');
            // strokeWeight(0.5);
            // point(this.pupsels[i].pos.x, this.pupsels[i].pos.y);
            // pop();

            // density
            // if (i % 13 == 0) {
            //     this.color = color('#d43838');
            // } else {
            //     this.color = color('#575757');
            // }

            console.log(x);
            if (x >= this.pupselSize * 1 && x < this.pupselSize * 6) {
                // if (x >= this.pupselSize * 1 && y >= this.pupselSize * 1) {
                // if (x >= this.pupselNumber * 0.2 && x < this.pupselNumber * 0.4 && y >= this.pupselNumber * 0.3 && y < this.pupselNumber * 0.6) {
                this.color = color('#d43838');
            } else {
                this.color = color('#575757');
            }

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