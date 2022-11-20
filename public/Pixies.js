
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

        this.show();
    }

    show() {

        var _density_ = this.density;

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

                    this.showNoise(index, randomGaussian(0, 5));

                    if (index % _density_ == 0) {
                        this.showNoise(index, randomGaussian(0, 15))
                    }

                    if (pointInPolygon(sunnybunny.coordsList, [x, y])) {
                        this.showNoise(index, randomGaussian(0, 25));
                    }

                    // if (random() > 0.75) {
                    //     this.draw_big_dot(index, _soft_gain_);
                    // } else {
                    //     this.draw_small_dot(index, _gain_);
                    // }
                    // _density_ = this.density + Math.round(this.density * getP5RandomFromInterval(-this.distortion, this.distortion));
                }
                xoff += this.inc;
            }
            yoff += this.inc;
        }
        this.buffer.updatePixels();
        this.buffer.pop();

    }

    showNoise(index, gain) {
        // this pixel
        this.buffer.pixels[index + 0] = red(this.colorForeground) + gain;
        this.buffer.pixels[index + 1] = green(this.colorForeground) + gain;
        this.buffer.pixels[index + 2] = blue(this.colorForeground) + gain;
        this.buffer.pixels[index + 3] = alpha(this.colorForeground);
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