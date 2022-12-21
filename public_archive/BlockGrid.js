class BlockGrid {

    constructor(data) {
        this.margin = MARGIN;
        this.marginNew = DOMINANTSIDE * 0.07;
        this.blockNumber = 30;
        this.blockSize = (DOMINANTSIDE - 2 * this.margin) / this.blockNumber;
        this.blockColors = PALETTE.pixelColors;
        // console.log("blocksize: " + this.blockSize);
        this.incX = 0.5;
        this.incY = 0.5;

        this.blocks = [];

        var pickNumber;
        var gain = 3;  // 4 natures
        var _gain_;

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

                // if (blockX < 100 && blockX > (width - 100) && blockY < 100 && blockY > (height - 100)) {
                // console.log(blockX);
                if (blockX < this.marginNew || blockX > (width - this.marginNew) || blockY < this.marginNew || blockY > (height - this.marginNew)) {
                    _gain_ = Math.round(getRandomFromList([2, 3, 4]));
                } else {
                    _gain_ = Math.round(getRandomFromList([0, 1, 2, 3, 10, 11]));
                }

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
                    this.color = color("#f1f1f1")
                } else if (_gain_ == 1) {
                    this.nature = 1;
                    this.color = color("#8b8b8b")
                } else if (_gain_ == 2) {
                    this.nature = 2;
                    this.color = color("#979797")
                } else if (_gain_ == 3) {
                    this.nature = 3;
                    // this.color = color("#bebebe");
                    this.color = getRandomFromList([color("#707070"), color("#8b8b8b"), color("#979797")])
                } else if (_gain_ == 10) {
                    this.nature = 10;
                    this.color = color("#707070");
                } else if (_gain_ == 11) {
                    this.nature = 11;
                    this.color = color("#b8b8b8");
                } else {
                    this.nature = 4;
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