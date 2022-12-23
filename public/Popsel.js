class PopselTexture {

    constructor(shape) {
        this.pupselNumber = getRandomFromList([400, 300, 200]); // RESOLUTION; 
        this.brushNumber = 15;
        this.brushSize = DOMINANTSIDE * BRUSHSIZE;
        this.brushStrokeWeight = 1; // 1, 2

        this.lowDist = 3;
        this.medDist = 6;
        this.highDist = 12;
        this.spriteCount = 7;

        this.shape = shape;
        this.pupselSize = DOMINANTSIDE / this.pupselNumber;
        this.pupselColors = PALETTE.pixelColors;

        this.pattern = getRandomFromList([0, 0, 3, 7]);

        this.pupsels = [];
        this.sprites = {};

        // SHOULD BE DYNAMIC
        this.buffer = createGraphics(DOMINANTSIDE * 0.3, DOMINANTSIDE * 0.3);

        // this.buffer.image(shape.buffer, 0, 0);

        // this.drawShape();

        var pupselColor;
        var i = 0;
        for (var pupselY = 0; pupselY <= height; pupselY += this.pupselSize) {
            for (var pupselX = 0; pupselX <= width; pupselX += this.pupselSize) {

                this.center = createVector(pupselX + this.pupselSize / 2, pupselY + this.pupselSize / 2);

                // transparent
                // pupselColor = color('#4c539600');

                // DEMO
                // pupselColor = color('#ec0000');

                // ANTI DEMO
                if (insidePolygon([pupselX, pupselY], this.shape.coords)) {
                    pupselColor = this.shape.color;
                } else {
                    continue;
                }

                // Contour - deprecated
                // if (insidePolygon([x, y], this.shape.lines)) {
                //     colorDyn = color('#424242');
                // }


                // HATCHES
                if (this.pattern > 0) {
                    if (i % this.pattern == 0) {  // vertical
                        pupselColor = color(red(pupselColor) - 80, green(pupselColor) - 80, blue(pupselColor) - 80);
                    }
                }

                // distort color - generates more sprites
                // pupselColor = distortColorSuperNew(pupselColor, 30);

                // GRADIENT
                pupselColor = brightenSuperNew(pupselColor, map(
                    pupselY,
                    0,
                    this.buffer.height,
                    -50,
                    50
                ));

                // DISTORT Color
                // pupselColor = getRandomFromList([
                //     pupselColor = color(red(pupselColor) - this.lowDist, green(pupselColor) - this.lowDist, blue(pupselColor) - this.lowDist),
                //     pupselColor = color(red(pupselColor) - this.medDist, green(pupselColor) - this.medDist, blue(pupselColor) - this.medDist),
                //     // pupselColor = color(red(pupselColor) - this.highDist, green(pupselColor) - this.highDist, blue(pupselColor) - this.highDist),
                //     pupselColor = pupselColor,
                //     pupselColor = color(red(pupselColor) + this.lowDist, green(pupselColor) + this.lowDist, blue(pupselColor) + this.lowDist),
                //     pupselColor = color(red(pupselColor) + this.medDist, green(pupselColor) + this.medDist, blue(pupselColor) + this.medDist),
                //     // pupselColor = color(red(pupselColor) + this.highDist, green(pupselColor) + this.highDist, blue(pupselColor) + this.highDist),
                // ]);


                // this.showPoints(pupselX, pupselY, pupselColor);
                // this.showBrushStrokes(pupselX, pupselY, pupselColor);
                this.createBrushTiles(pupselX, pupselY, pupselColor);

                i += 1;
            }
        }

    }


    drawShape() {
        this.bufferShape = createGraphics(this.buffer.width, this.buffer.height);

        // fill polygon!!
        this.bufferShape.push();
        this.bufferShape.drawingContext.filter = 'blur(12px)';  // `blur(${this.blur * blurFeature}px)`
        // this.bufferShape.blendMode(BURN);
        // this.bufferShape.stroke("#323232");
        // this.bufferShape.strokeWeight(3);
        this.bufferShape.noStroke();
        // this.bufferShape.fill(shape.color);
        // this.bufferShape.fill(color(red(shape.color), green(shape.color), blue(shape.color), 100));
        // this.bufferShape.fill("#2525257c");
        this.bufferShape.fill(color(red(this.shape.color) - 100, green(this.shape.color) - 100, blue(this.shape.color) - 100, 180));

        this.bufferShape.beginShape();
        this.bufferShape.vertex(this.shape.A.x, this.shape.A.y);
        this.bufferShape.vertex(this.shape.B.x, this.shape.B.y);
        this.bufferShape.vertex(this.shape.C.x, this.shape.C.y);
        this.bufferShape.endShape(CLOSE);
        this.bufferShape.pop();

        this.buffer.image(this.bufferShape, 0, 0);

    }

    // showPoints(x, y, colorObject) {
    //     this.buffer.push();
    //     this.buffer.stroke(colorObject);
    //     this.buffer.strokeWeight(20);
    //     this.buffer.point(x, y);
    //     this.buffer.pop();
    // }


    // showBrushStrokes(x, y, colorObject) {
    //     this.brushNumber = 15;
    //     this.brushSize = DOMINANTSIDE * 0.001;  // 0.01, 0.005, 0.003, 0.004

    //     // this.brushSize = map(pupsel.rank, 1200, 0, DOMINANTSIDE * 0.0003, DOMINANTSIDE * 0.01);

    //     for (var i = 0; i < this.brushNumber; i++) {

    //         push();
    //         // stroke(pupsel.color);
    //         stroke(distortColorSuperNew(colorObject, 30));
    //         // strokeWeight(0.5);
    //         strokeWeight(1);

    //         line(
    //             x,
    //             y,
    //             x + getRandomFromInterval(-this.brushSize, this.brushSize),
    //             y + getRandomFromInterval(-this.brushSize, this.brushSize)
    //         );

    //         pop();
    //     }

    // }

    createBrushTiles(x, y, colorObject) {
        var colorString;
        var sprite;

        colorString = colorObject.toString('#rrggbb');

        // create it if it isn't there yet
        if (this.sprites[colorString] === undefined) {
            var spritesColor = []
            for (var sp = 0; sp < this.spriteCount; sp++) {
                spritesColor.push(this.createPupselSprite(colorString, this.pupselSize));
            }
            this.sprites[colorString] = spritesColor;
        }

        push();
        sprite = getRandomFromList(this.sprites[colorString])
        imageMode(CENTER);
        // this.buffer.image(sprite, x - sprite.width / 2, y - sprite.height / 2);  // draws in center;
        this.buffer.image(sprite, x, y);  // draws in center;
        pop();
        // console.log(i + ": " + x + "," + y);
    }

    createPupselSprite(colorObject, pupselSize) {

        var buffer = createGraphics(this.brushSize * 2, this.brushSize * 2);
        // let buffer = createGraphics(pupselSize, pupselSize);

        for (var i = 0; i < this.brushNumber; i++) {

            buffer.push();
            // buffer.blendMode(OVERLAY);
            // stroke(colorObject);
            buffer.stroke(distortColorSuperNew(colorObject, 30));
            // buffer.stroke(distortColorSuperNew(
            //     color(red(colorObject), green(colorObject), blue(colorObject), 100)
            //     , 30));

            // INTERESTING HERE
            buffer.strokeWeight(this.brushStrokeWeight); // 1,2

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

