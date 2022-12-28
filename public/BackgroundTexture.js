class BackgroundTexture {
    constructor(colorObject) {
        this.buffer = createGraphics(width, height);

        this.stepSize = DOMINANTSIDE * 0.003;

        for (var y = 0; y <= height; y += this.stepSize) {
            for (var x = 0; x <= width; x += this.stepSize) {

                this.buffer.fill(distortColorSuperNew(colorObject, 5))
                // this.buffer.noFill();
                this.buffer.strokeWeight(DOMINANTSIDE * 0.0005);
                this.buffer.stroke(distortColorSuperNew(colorObject, 10));
                this.buffer.rect(x, y, this.stepSize, this.stepSize);
            }
        }
    }
}