class BlockGrid {

    constructor(data) {
        this.margin = MARGIN;
        this.blockNumber = 20;
        this.blockSize = (DOMINANTSIDE - 2 * this.margin) / this.blockNumber;
        this.blockColors = PALETTE.pixelColors;
        // console.log("blocksize: " + this.blockSize);

        this.blocks = [];

        this.spot = createVector(400, 600);

        for (var blockX = this.margin; blockX < (width - this.margin); blockX += this.blockSize) {
            // console.log(blockX);
            for (var blockY = this.margin; blockY < (height - this.margin); blockY += this.blockSize) {
                // console.log(createVector((blockX + this.blockSize / 2), (blockY + this.blockSize / 2)));

                this.center = createVector(blockX + this.blockSize / 2, blockY + this.blockSize / 2)
                this.distance = this.center.dist(createVector(this.spot.x, this.spot.y));
                // console.log(this.distance);
                if (this.distance < DOMINANTSIDE * 0.08) {
                    this.nature = "pure";
                } else if (this.distance < DOMINANTSIDE * 0.3) {
                    this.nature = "obscure";
                } else {
                    this.nature = "premature"
                }

                this.blocks.push(new Block({
                    "x": blockX,
                    "y": blockY,
                    "blockCenter": this.center,
                    "blocksize": this.blockSize,
                    "color": getRandomFromList(this.blockColors),
                    // "nature": getRandomFromList(["pure", "obscure", "premature", "manure"])
                    "nature": this.nature,
                }));
            }
        }
    }
}