
class Pixies {

    constructor(data) {
        this.incX = data.incX;
        this.incY = data.incY;
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
    }

    show() {

        var _density_ = this.density;
        var backgroundTemp = getRandomFromList(PALETTE.pixelColors);

        var currentBlock;

        this.buffer.push();
        this.buffer.loadPixels();
        let yoff = 0;

        var blockColor = getRandomFromList(PALETTE.pixelColors);

        for (let y = 0; y < this.buffer.height; y++) {
            yoff += this.incY;
            let xoff = 0;
            for (let x = 0; x < this.buffer.width; x++) {
                xoff += this.incX;

                let index = (x + y * this.buffer.width) * 4;
                var noiseF = noise(xoff, yoff);
                var _gain_ = noiseF * this.gain;
                // if (this.softNoiseFeature == true) {
                //     var _soft_gain_ = _gain_ / 2;
                // } else {
                //     var _soft_gain_ = _gain_;
                // }

                // draw the background
                // if (typeof this.colorBackground != "undefined") {
                //     this.buffer.pixels[index + 0] = red(this.colorBackground);
                //     this.buffer.pixels[index + 1] = green(this.colorBackground);
                //     this.buffer.pixels[index + 2] = blue(this.colorBackground);
                //     this.buffer.pixels[index + 3] = alpha(this.colorBackground);
                // }

                // margin
                // if (
                //     (index % (this.buffer.width * 4) > this.margin * 4) &&  // horizontal left
                //     (index % (this.buffer.width * 4) < ((this.buffer.width - (this.margin)) * 4)) &&  // horizontal right
                //     (index > (this.buffer.width * (this.margin)) * 4) && // vertical top
                //     (index < (this.totalPixels - this.buffer.width * (this.margin) * 4))  // vertical bottom
                // ) {

                // SIMPLE COLOR
                // this.showColor(index, color("#60608b"), 3)

                // if (pointInPolygon(sunnybunny.coordsList, [x, y])) {
                //     this.showColor(index, color("#8e8ee7"), 5)
                //     this.showGradient(index);
                // }

                // fields
                // this.gradientLineShow(x, y, index);

                // for (var i = 0; i < (blockGrid.blocks.length); i++) {
                //     currentBlock = blockGrid.blocks[i];
                //     currentBlock.pixelate(x, y, index);
                // }
                // }

                // Moritz und Emma

                if (this.corrodedBlock(x, y, index, blockColor)) {
                    continue;
                };

                // show gain noise file
                // this.buffer.pixels[index + 0] = _gain_;
                // this.buffer.pixels[index + 1] = _gain_;
                // this.buffer.pixels[index + 2] = _gain_;
                // this.buffer.pixels[index + 3] = 255;

                var noisePaletteSwitch = fxrand();
                if (noisePaletteSwitch > 0.5) {
                    var colorNoise = color(_gain_, _gain_, _gain_, 255);
                    var coldiff = [];
                    for (var colory of PALETTE.pixelColors) {
                        coldiff.push(abs(Math.round(brightness(colorNoise) - brightness(colory))));
                    }
                    // console.log(_gain_ - brightness(colory));
                    // console.log(coldiff);
                    var min = Math.min(...coldiff);
                    // console.log(min);
                    var match = coldiff.indexOf(min);
                    // console.log(PALETTE.pixelColors[match]);

                    this.showColor(index, PALETTE.pixelColors[match], 25)

                    // random pixelcolor
                } else if (noisePaletteSwitch <= 0.5) {
                    var pick = getRandomFromList(PALETTE.pixelColors);

                    this.showColor(index, pick, 25)

                } else {
                    // this.showColor(index, backgroundTemp, 5);
                }
                // // GRID TEXTURE
                // if (index % _density_ == 0) {
                //     this.changeColor(index, abs(Math.round(randomGaussian(0, 35))))
                // }
            }
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

    blendColors(x, y, index, blockPosX, blockPosY, blockSize, colorObject, orientation) {
        // var startX = this.currentBlock.blockPos.x;
        // var startY = this.currentBlock.blockPos.y;
        // var blockSize = blockSize
        // var colorObject = this.currentBlock.color;

        var distanceMax = 0.75;

        if (orientation == "d") {
            var stopX = blockPosX + blockSize / 2;
            var stopY = blockPosY + blockSize;

            var difference = abs(blockPosX - x);
            if (fxrand() >= map(difference, 0, abs(stopX - blockPosX) * distanceMax, 0, 1)) {
                this.showColor(index, colorObject, 20);
            }
        } else if (orientation == "b") {
            var stopX = blockPosX + blockSize;
            var stopY = blockPosY + blockSize / 2;

            var difference = abs(blockPosY - y);
            if (fxrand() >= map(difference, 0, abs(stopY - blockPosY) * distanceMax, 0, 1)) {
                this.showColor(index, colorObject, 20);
            }
        }
        if (orientation == "a") {
            var stopX = blockPosX + blockSize / 2;
            var stopY = blockPosY + blockSize / 2;

            var difference = abs(blockPosX - x) + abs(blockPosY - y);
            if (fxrand() >= map(difference, 0, blockSize / 2 * distanceMax, 0, 1)) {
                this.showColor(index, colorObject, 20);
            }
        }
    }

    corrodedBlock(x, y, index, blockColor) {
        // try out something
        var pointy = createVector(400, 500);
        var distAX = 30;
        var distAY = 30;
        var distBX = 20;
        var distBY = 20;
        var distCX = 10;
        var distCY = 10;
        var distDX = 5;
        var distDY = 5;

        if (abs(x - pointy.x) <= distDX && abs(y - pointy.y) <= distDY) {
            if (fxrand() >= 0.1) {
                this.showColor(index, blockColor, 5)
                return true;
            }
        } else if (abs(x - pointy.x) <= distCX && abs(y - pointy.y) <= distCY) {
            if (fxrand() >= 0.25) {
                this.showColor(index, blockColor, 5)
                return true;
            }
        } else if (abs(x - pointy.x) <= distBX && abs(y - pointy.y) <= distBY) {
            if (fxrand() >= 0.5) {
                this.showColor(index, blockColor, 5)
                return true;
            }
        } else if (abs(x - pointy.x) <= distAX && abs(y - pointy.y) <= distAY) {
            if (fxrand() >= 0.75) {
                this.showColor(index, blockColor, 5)
                return true;
            }
        }
    }
}