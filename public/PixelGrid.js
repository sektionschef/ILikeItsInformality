
class PixelGrid {

    constructor(data) {
        this.margin = MARGIN;
        this.blockSize = Math.round((DOMINANTSIDE - 2 * this.margin) * 0.05);
        this.blockColors = [color(20), color(70), color(130), color(160), color(200), color(230)];
        console.log("blocksize: " + this.blockSize);

        this.leftUpperCorners = [];

        for (var blockX = this.margin; blockX < (width - this.margin); blockX += this.blockSize) {
            // console.log(blockX);
            for (var blockY = this.margin; blockY < (height - this.margin); blockY += this.blockSize) {
                // console.log(blockY);
                this.leftUpperCorners.push({
                    "posStart": createVector(blockX, blockY),
                    "posStop": createVector(blockX + this.blockSize, blockY + this.blockSize),
                    "color": getRandomFromList(this.blockColors)
                });
            }
        }

        console.log(this.leftUpperCorners[0]);
        console.log(this.leftUpperCorners[1]);

    }
}