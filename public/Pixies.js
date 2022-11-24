
class Pixies {

    constructor(data) {
        this.inc = data.inc;
        this.gain = data.gain;
        this.colorBackground = data.colorBackground;
        this.colorForeground = data.colorForeground;
        this.distortion = data.distortion;
        this.density = data.density;
        this.margin = data.margin;

        this.buffer = createGraphics(rescaling_width, rescaling_height);
        this.totalPixels = this.buffer.width * this.buffer.height * 4;
        this.totalDots = Math.round(this.totalPixels / this.density);

        this.softNoiseFeature = true;

        this.foglyPoints = [];

        // gradientLine
        // this.gradientLineDefine(gridly_foreground.points[0][0], gridly_foreground.points[0][1]);

        this.show();
    }

    show() {

        var _density_ = this.density;

        var currentBlock;

        this.buffer.push();
        this.buffer.loadPixels();
        let yoff = 0;
        for (let y = 0; y < this.buffer.height; y++) {
            let xoff = 0;
            for (let x = 0; x < this.buffer.width; x++) {

                let index = (x + y * this.buffer.width) * 4;
                // var noiseF = noise(xoff, yoff);
                // var _gain_ = noiseF * this.gain;
                // if (this.softNoiseFeature == true) {
                //     var _soft_gain_ = _gain_ / 2;
                // } else {
                //     var _soft_gain_ = _gain_;
                // }

                // draw the background
                if (typeof this.colorBackground != "undefined") {
                    this.buffer.pixels[index + 0] = red(this.colorBackground);
                    this.buffer.pixels[index + 1] = green(this.colorBackground);
                    this.buffer.pixels[index + 2] = blue(this.colorBackground);
                    this.buffer.pixels[index + 3] = alpha(this.colorBackground);
                }

                // margin
                if (
                    // (index % _density_ == 0) &&
                    (index % (this.buffer.width * 4) > this.margin * 4) &&  // horizontal left
                    (index % (this.buffer.width * 4) < ((this.buffer.width - (this.margin)) * 4)) &&  // horizontal right
                    (index > (this.buffer.width * (this.margin)) * 4) && // vertical top
                    (index < (this.totalPixels - this.buffer.width * (this.margin) * 4))  // vertical bottom
                ) {

                    // SIMPLE COLOR
                    // this.showColor(index, color("#60608b"), 3)

                    // if (pointInPolygon(sunnybunny.coordsList, [x, y])) {
                    //     this.showColor(index, color("#8e8ee7"), 5)
                    //     this.showGradient(index);
                    // }

                    // fields
                    // this.gradientLineShow(x, y, index);

                    // this.showFatPixle(x, y, index);


                    for (var i = 0; i < (blockGrid.blocks.length); i++) {
                        this.currentBlock = blockGrid.blocks[i];

                        if (x >= this.currentBlock.blockPos.x && x < (this.currentBlock.blockPos.x + this.currentBlock.blockSize) && y >= this.currentBlock.blockPos.y && y < (this.currentBlock.blockPos.y + this.currentBlock.blockSize)) {
                            this.showColor(index, this.currentBlock.color, 10)
                        }

                        this.blendColors(x, y, index);
                    }



                    // if (random() > 0.75) {
                    //     this.draw_big_dot(index, _soft_gain_);
                    // } else {
                    //     this.draw_small_dot(index, _gain_);
                    // }
                    // _density_ = this.density + Math.round(this.density * getP5RandomFromInterval(-this.distortion, this.distortion));

                    // GRID TEXTURE
                    if (index % _density_ == 0) {
                        this.changeColor(index, abs(Math.round(randomGaussian(0, 35))))
                    }
                } else {
                    this.showColor(index, PALETTE.background, 4);
                }
                xoff += this.inc;
            }
            yoff += this.inc;
        }
        this.buffer.updatePixels();
        this.buffer.pop();

    }

    // change existing color
    changeColor(index, gain) {
        this.buffer.pixels[index + 0] += gain;
        this.buffer.pixels[index + 1] += gain;
        this.buffer.pixels[index + 2] += gain;
        // this.buffer.pixels[index + 3] = 
    }

    // Farbe mit Distort anzeigen
    showColor(index, colorObject, gain) {
        var distort = + randomGaussian(0, gain);
        this.buffer.pixels[index + 0] = red(colorObject) + distort;
        this.buffer.pixels[index + 1] = green(colorObject) + distort;
        this.buffer.pixels[index + 2] = blue(colorObject) + distort;
        this.buffer.pixels[index + 3] = alpha(colorObject);
    }

    showGradient(index) {
        // not everywhere
        if (index % abs(Math.round(randomGaussian(0, 10))) == 0) {
            var grain = map(index / (this.buffer.width * 4), 0, this.buffer.height, -60, 60)

            this.buffer.pixels[index + 0] += grain;
            this.buffer.pixels[index + 1] += grain;
            this.buffer.pixels[index + 2] += grain;
        }
    }

    gradientLineDefine(A, B) {

        var noiseLoops = 10;
        var noiseDistance = 10;

        // widthy = sunnybunny.coordsList[1][0] - sunnybunny.coordsList[0][0];
        // heighty = sunnybunny.coordsList[1][1] - sunnybunny.coordsList[0][1];

        // widthy = gridly_foreground.points[0][1].x - gridly_foreground.points[0][0].x;
        // heighty = gridly_foreground.points[0][1].y - gridly_foreground.points[0][0].y;

        var widthy = B.x - A.x;
        var heighty = B.y - A.y;

        var stepy = heighty / widthy;

        for (var v = 0; v < noiseLoops; v++) {
            for (var i = 0; i < widthy; i++) {
                // console.log(i);
                this.foglyPoints.push(createVector(
                    // Math.round(sunnybunny.coordsList[0][0] + i),
                    // Math.round(sunnybunny.coordsList[0][1] + stepy * i + abs(randomGaussian(0, 10)))

                    Math.round(A.x + i),
                    Math.round(A.y + stepy * i + abs(randomGaussian(0, noiseDistance)))
                ))
            }
        }
    }

    gradientLineShow(x, y, index) {
        for (var i = 0; i < this.foglyPoints.length; i++) {
            // console.log(foglyPoints[i].x)
            if (x == this.foglyPoints[i].x && y == this.foglyPoints[i].y) {
                this.showColor(index, color("#63a724"), 0);
            }
        }
    }

    blendColors(x, y, index) {
        // var currentBlock = blockGrid.blocks[30];
        var startX = this.currentBlock.blockPos.x;
        var startY = this.currentBlock.blockPos.y;
        var stopX = startX + this.currentBlock.blockSize / 2;
        var stopY = startY + this.currentBlock.blockSize;
        var colorObject = this.currentBlock.color;

        // console.log("asfa");
        if (x < startX && y > startY && y < stopY) {
            var difference = abs(startX - x);
            if (fxrand() >= map(difference, 0, abs(stopX - startX) * 0.75, 0, 1)) {
                this.showColor(index, colorObject, 20);
            }
        }

        // var startX = 60;
        // var startY = 54;
        // var stopX = 0;
        // var stopY = 95;

        // if (x < startX && y > startY && y < stopY) {
        //     var difference = (startX - x);
        //     if (fxrand() >= map(difference, 0, abs(stopX - startX) * 0.75, 0, 1)) {
        //         this.showColor(index, currentBlock.color, 20);
        //     }
        // }
    }

    // draw_small_dot(index, gain) {
    //     // this pixel
    //     this.buffer.pixels[index + 0] = red(this.colorForeground) + gain;
    //     this.buffer.pixels[index + 1] = green(this.colorForeground) + gain;
    //     this.buffer.pixels[index + 2] = blue(this.colorForeground) + gain;
    //     this.buffer.pixels[index + 3] = alpha(this.colorForeground);
    // }

    // draw_big_dot(index, gain) {
    //     // this pixel
    //     this.buffer.pixels[index + 0] = red(this.colorForeground) + gain;
    //     this.buffer.pixels[index + 1] = green(this.colorForeground) + gain;
    //     this.buffer.pixels[index + 2] = blue(this.colorForeground) + gain;
    //     this.buffer.pixels[index + 3] = alpha(this.colorForeground);

    //     // preceding pixel, the pixel left
    //     this.buffer.pixels[index - 4] = red(this.colorForeground) + gain;
    //     this.buffer.pixels[index - 3] = green(this.colorForeground) + gain;
    //     this.buffer.pixels[index - 2] = blue(this.colorForeground) + gain;
    //     this.buffer.pixels[index - 1] = alpha(this.colorForeground);

    //     // pixel above on y axis
    //     this.buffer.pixels[index - this.buffer.width * 4] = red(this.colorForeground) + gain;
    //     this.buffer.pixels[index - this.buffer.width * 4 + 1] = green(this.colorForeground) + gain;
    //     this.buffer.pixels[index - this.buffer.width * 4 + 2] = blue(this.colorForeground) + gain;
    //     this.buffer.pixels[index - this.buffer.width * 4 + 3] = alpha(this.colorForeground);

    //     // pixel above on y axis
    //     this.buffer.pixels[index - this.buffer.width * 4 - 4] = red(this.colorForeground) + gain;
    //     this.buffer.pixels[index - this.buffer.width * 4 - 3] = green(this.colorForeground) + gain;
    //     this.buffer.pixels[index - this.buffer.width * 4 - 2] = blue(this.colorForeground) + gain;
    //     this.buffer.pixels[index - this.buffer.width * 4 - 1] = alpha(this.colorForeground);
    // }
}