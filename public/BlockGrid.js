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
                this.blocks.push(new Block({
                    "x": blockX,
                    "y": blockY,
                    "blockCenter": createVector(blockX + this.blockSize / 2, blockY + this.blockSize / 2),
                    "blocksize": this.blockSize,
                    "color": getRandomFromList(this.blockColors),
                    // "nature": getRandomFromList(["pure", "obscure", "premature", "manure"])
                    "nature": getRandomFromList(["pure", "obscure", "premature"])
                }));
            }
        }
    }
}