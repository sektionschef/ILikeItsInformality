class PupselGrid {

    constructor(data) {
        this.margin = 0;
        this.pupselNumber = RESOLUTION // DOMINANTSIDE / RESOLUTION;  // 20 - 
        this.pupselSize = (DOMINANTSIDE - 2 * this.margin) / this.pupselNumber;
        this.pupselColors = PALETTE.pixelColors;
        // console.log("blocksize: " + this.blockSize);

        this.pupsels = [];
        var brushstrokes;

        // CREATE SPRITES
        // console.log(PALETTE.pixelColors);
        this.sprites = {};

        // for (var c = 0; c < PALETTE.pixelColors.length; c++) {
        //     var spritesColor = []
        //     for (var i = 0; i < 20; i++) {
        //         spritesColor.push(PupselBrush.createPupselSprite(getRandomFromList(PALETTE.pixelColors)));
        //     }
        //     this.sprites[PALETTE.pixelColors[c]] = spritesColor;
        // }
        // console.log(this.sprites);

        for (var pupselY = this.margin; pupselY < (height - this.margin); pupselY += this.pupselSize) {
            for (var pupselX = this.margin; pupselX < (width - this.margin); pupselX += this.pupselSize) {

                // if (blockX < 100 && blockX > (width - 100) && blockY < 100 && blockY > (height - 100)) {

                this.center = createVector(pupselX + this.pupselSize / 2, pupselY + this.pupselSize / 2);

                // brushstrokes = [];

                this.pupsels.push({
                    "pos": createVector(pupselX, pupselY),
                    "center": this.center,
                    "pupselsize": this.pupselSize,
                    "color": this.color,
                    // "brushstrokes": brushstrokes,
                });

            }

            // console.log(this.pupsels);
        }
    }

    show() {

        var x;
        var y;
        var sprite;
        var colorString;

        for (var i = 0; i < this.pupsels.length; i++) {

            x = (i % this.pupselNumber) * this.pupselSize;
            y = Math.floor(i / this.pupselNumber) * this.pupselSize;

            // default color
            this.pupsels[i].color = color('#ffffff');

            var newColor = triangles.insidePolygon(x, y, i);
            // console.log(oida);
            if (newColor) {
                this.pupsels[i].color = newColor.color;
                this.pupsels[i].rank = newColor.rank;
            }

            // stripes
            // if (i % 3 == 0) {
            //     this.color = color('#3d3d3d');
            // }

            // distort color
            this.pupsels[i].color = distortColorSuperNew(this.pupsels[i].color, 15);

            // PupselBrush.showPoints(this.pupsels[i]);
            // PupselBrush.showBrushStrokes(this.pupsels[i]);


            colorString = this.pupsels[i].color.toString('#rrggbb');

            if (this.sprites[colorString] === undefined) {
                var spritesColor = []
                for (var i = 0; i < 5; i++) {
                    spritesColor.push(PupselBrush.createPupselSprite(colorString));
                }
                this.sprites[colorString] = spritesColor;
            }

            push();
            // console.log(colorString);
            // console.log(this.sprites[colorString]);
            // console.log(this.sprites);

            sprite = getRandomFromList(this.sprites[colorString])
            image(sprite, x - sprite.width / 2, y - sprite.height / 2);  // draws in center;
            pop();
        }

    }
}


class PupselBrush {

    constructor() {
    }

    static showPoints(pupsel) {

        push();
        stroke(pupsel.color);
        strokeWeight(10);
        point(pupsel.pos.x, pupsel.pos.y);
        pop();
    }

    static showBrushStrokes(pupsel) {

        this.brushNumber = 15;
        this.brushSize = DOMINANTSIDE * 0.001;  // 0.01, 0.005, 0.003, 0.004

        // this.brushSize = map(pupsel.rank, 1200, 0, DOMINANTSIDE * 0.0003, DOMINANTSIDE * 0.01);

        for (var i = 0; i < this.brushNumber; i++) {

            push();
            // stroke(pupsel.color);
            stroke(distortColorSuperNew(pupsel.color, 30));
            // strokeWeight(0.5);
            strokeWeight(1);

            line(
                pupsel.pos.x,
                pupsel.pos.y,
                pupsel.pos.x + getRandomFromInterval(-this.brushSize, this.brushSize),
                pupsel.pos.y + getRandomFromInterval(-this.brushSize, this.brushSize)
            );

            pop();

        }

    }

    static createPupselSprite(colorObject) {
        this.brushNumber = 15;
        this.brushSize = DOMINANTSIDE * 0.001;  // 0.01, 0.005, 0.003, 0.001

        var buffer = createGraphics(this.brushSize * 2, this.brushSize * 2);

        for (var i = 0; i < this.brushNumber; i++) {

            buffer.push();
            // stroke(pupsel.color);
            buffer.stroke(distortColorSuperNew(colorObject, 30));
            // strokeWeight(0.5);
            buffer.strokeWeight(1);

            buffer.line(
                buffer.width / 2,
                buffer.height / 2,
                buffer.width / 2 + getRandomFromInterval(-this.brushSize, this.brushSize),
                buffer.height / 2 + getRandomFromInterval(-this.brushSize, this.brushSize)
            );

            buffer.pop();


        }
        return buffer;
    }
}