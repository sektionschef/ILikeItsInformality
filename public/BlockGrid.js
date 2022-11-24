class BlockGrid {

    constructor(data) {
        this.margin = MARGIN;
        this.blockNumber = 2;// 20;
        this.blockSize = (DOMINANTSIDE - 2 * this.margin) / this.blockNumber;
        this.blockColors = PALETTE.pixelColors;
        // console.log("blocksize: " + this.blockSize);

        this.blocks = [];

        for (var blockX = this.margin; blockX < (width - this.margin); blockX += this.blockSize) {
            // console.log(blockX);
            for (var blockY = this.margin; blockY < (height - this.margin); blockY += this.blockSize) {
                // console.log(blockY);
                this.blocks.push(new Block({
                    "x": blockX,
                    "y": blockY,
                    "blocksize": this.blockSize,
                    "color": getRandomFromList(this.blockColors),
                }));
            }
        }
    }
}