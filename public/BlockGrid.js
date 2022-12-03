class BlockGrid {

    constructor(data) {
        this.margin = MARGIN;
        this.blockNumber = 30;
        this.blockSize = (DOMINANTSIDE - 2 * this.margin) / this.blockNumber;
        this.blockColors = PALETTE.pixelColors;
        // console.log("blocksize: " + this.blockSize);
        this.incX = 0.5;
        this.incY = 0.5;

        this.blocks = [];

        var pickNumber;
        var gain = 3;  // 4 natures

        this.noiseOffX = 0;
        for (var blockX = this.margin; blockX < (width - this.margin); blockX += this.blockSize) {
            this.noiseOffX += this.incX;
            // console.log(blockX);
            this.noiseOffY = 0;
            for (var blockY = this.margin; blockY < (height - this.margin); blockY += this.blockSize) {
                this.noiseOffY += this.incY;

                // var noiseB = noise(this.noiseOffX, this.noiseOffY);
                // var _gain_ = Math.round(noiseB * gain);
                // var _gain_ = Math.round(randomGaussian(1.5, 0.5));
                var _gain_ = Math.round(getRandomFromInterval(0, 3));

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
                if (_gain_ == 0) {
                    this.nature = 0
                    this.color = color("#fafafa")
                } else if (_gain_ == 1) {
                    this.nature = 1;
                    this.color = color("#d1d1d1")
                } else if (_gain_ == 2) {
                    this.nature = 2;
                    // this.color = color("#cacaca")
                    this.color = color("#af7777")
                } else if (_gain_ == 3) {
                    this.nature = 3;
                    this.color = color("#a8a8a8")
                } else {
                    // this.nature = 4;
                }

                this.blocks.push(new Block({
                    "x": blockX,
                    "y": blockY,
                    "blockCenter": this.center,
                    "blocksize": this.blockSize,
                    "color": this.color, // getRandomFromList(this.blockColors),
                    "nature": this.nature,
                }));
            }
        }
    }
}