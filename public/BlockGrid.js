class BlockGrid {

    constructor(data) {
        this.margin = MARGIN;
        this.blockNumber = 20;
        this.blockSize = (DOMINANTSIDE - 2 * this.margin) / this.blockNumber;
        this.blockColors = PALETTE.pixelColors;
        // console.log("blocksize: " + this.blockSize);

        this.blocks = [];

        this.spot = createVector(400, 600);

        var pickNumber;
        var gain = 6;  // 4 natures

        let noiseOff = 0;
        for (var blockX = this.margin; blockX < (width - this.margin); blockX += this.blockSize) {
            // console.log(blockX);
            for (var blockY = this.margin; blockY < (height - this.margin); blockY += this.blockSize) {

                var noiseB = noise(blockX, blockY);
                var _gain_ = Math.round(noiseB * gain);

                this.center = createVector(blockX + this.blockSize / 2, blockY + this.blockSize / 2);

                // this.distance = this.center.dist(createVector(this.spot.x, this.spot.y));
                // if (this.distance < DOMINANTSIDE * 0.08) {
                //     this.nature = "pure";
                // } else if (this.distance < DOMINANTSIDE * 0.3) {
                //     this.nature = "obscure";
                // } else {
                //     this.nature = "premature"
                // }

                // pickNumber = fxrand();

                // if (pickNumber < 0.1) {
                //     this.nature = "pure";
                // } else if (pickNumber < 0.3) {
                //     this.nature = "obscure";
                // } else if (pickNumber < 0.5) {
                //     this.nature = "premature";
                // } else {
                //     this.nature = "dissolved";
                // }

                // console.log(_gain_);
                if (_gain_ == 1) {
                    this.nature = "pure";
                } else if (_gain_ == 2) {
                    this.nature = "obscure";
                } else if (_gain_ == 3) {
                    this.nature = "premature";
                } else {
                    this.nature = "dissolved";
                }

                this.blocks.push(new Block({
                    "x": blockX,
                    "y": blockY,
                    "blockCenter": this.center,
                    "blocksize": this.blockSize,
                    "color": getRandomFromList(this.blockColors),
                    "nature": this.nature,
                }));
            }
        }
    }
}