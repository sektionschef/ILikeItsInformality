class PopselTexture {

    constructor(shape) {
        this.pupselNumber = getRandomFromList([500, 400, 300, 200]); // RESOLUTION; 
        this.brushNumber = 15;
        this.brushSize = shape.brushSize;
        this.brushStrokeWeight = 1; // 1, 2

        this.spriteCount = 10;

        this.shape = shape;
        this.pupselSize = DOMINANTSIDE / this.pupselNumber;
        this.pupselColors = PALETTE.pixelColors;

        this.pattern = getRandomFromList([0, 0, 3, 4, 5]);

        this.pupsels = [];
        this.sprites = {};

        // SHOULD BE DYNAMIC
        this.buffer = createGraphics(DOMINANTSIDE * 0.3, DOMINANTSIDE * 0.3);

        // if something was drawn
        // this.buffer.image(shape.buffer, 0, 0);

        // DEBUG - show buffer edges
        // this.buffer.rect(0, 0, width, height);

        if (this.shape.nature == "pupsel" || this.shape.nature == "plain") {
            this.drawShape();
        } else if (this.shape.nature == "naked") {
            this.drawNakedShape();
        } else {

        }

        if (this.shape.nature == "pupsel" || this.shape.nature == "points") {

            let colorboost;
            var pupselColor;
            var i = 0;
            for (var pupselY = 0; pupselY <= (this.buffer.height); pupselY += this.pupselSize) {
                for (var pupselX = 0; pupselX <= (this.buffer.width); pupselX += this.pupselSize) {

                    i += 1;

                    // this.center = createVector(pupselX + this.pupselSize / 2, pupselY + this.pupselSize / 2);

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
                        // if (i % this.pattern == 0 || (i - 1) % this.pattern == 0) {
                        if (i % this.pattern == 0) {
                            // if (brightness(pupselColor) > 50) {
                            //     colorboost = -50;
                            // } else {
                            //     colorboost = 50
                            // }
                            // pupselColor = color(red(pupselColor) + colorboost, green(pupselColor) + colorboost, blue(pupselColor) + colorboost);
                            pupselColor = this.shape.colorB;
                        }
                    }

                    // distort color - generates more sprites
                    // pupselColor = distortColorSuperNew(pupselColor, 30);

                    // GRADIENT
                    pupselColor = brightenSuperNew(pupselColor, map(
                        pupselX,
                        this.shape.B.x,
                        this.shape.C.x,
                        -25, // -10
                        25  // 10
                    ));


                    if (this.shape.nature == "points") {
                        this.showPoints(pupselX, pupselY, pupselColor);
                        // this.showBrushStrokes(pupselX, pupselY, pupselColor);
                    } else {
                        this.createBrushTiles(pupselX, pupselY, pupselColor);
                    }

                    // break;
                }
                // break;
            }
        }

        // this.buffer.push();
        // this.buffer.blendMode(OVERLAY);
        // this.buffer.noStroke();
        // this.buffer.fill("#ffa0f7");
        // for (var i = 0; i < 3; i++) {
        //     this.buffer.triangle(
        //         this.shape.A.x, this.shape.A.y,
        //         this.shape.B.x, this.shape.B.y,
        //         this.shape.C.x, this.shape.C.y,
        //         // getRandomFromInterval(this.shape.A.x, this.shape.B.x), getRandomFromInterval(this.shape.A.y, this.shape.B.y),
        //         // getRandomFromInterval(this.shape.B.x, this.shape.C.x), getRandomFromInterval(this.shape.B.y, this.shape.C.y),
        //         // getRandomFromInterval(this.shape.C.x, this.shape.A.x), getRandomFromInterval(this.shape.C.y, this.shape.A.y),
        //     );
        // }
        // this.buffer.pop();
    }


    drawShape() {

        this.strokeWeight = 1 // 8, 18;
        this.blurSize = 2 // 10, 20;

        this.bufferShape = createGraphics(this.buffer.width, this.buffer.height);

        this.bufferShape.push();
        this.bufferShape.drawingContext.filter = `blur(${this.blurSize}px)` //- 'blur(10px)'

        // this.bufferShape.blendMode(BURN);
        // this.bufferShape.stroke("#323232");
        if (brightness(this.shape.color) > 50) {
            this.strokeColor = color(red(this.shape.color) - 100, green(this.shape.color) - 100, blue(this.shape.color) - 100);
        } else {
            this.strokeColor = color(red(this.shape.color) + 100, green(this.shape.color) + 100, blue(this.shape.color) + 100);
        }
        this.bufferShape.stroke(this.strokeColor);
        this.bufferShape.strokeWeight(this.strokeWeight); // 18
        // this.bufferShape.noFill();

        // this.bufferShape.noStroke();
        // this.bufferShape.fill(this.shape.color);
        this.bufferShape.fill(color(red(this.shape.color), green(this.shape.color), blue(this.shape.color), 150));
        // this.bufferShape.fill("#2525257c");
        // this.bufferShape.fill(color(red(this.shape.color) - 100, green(this.shape.color) - 100, blue(this.shape.color) - 100, 180));

        this.bufferShape.beginShape();
        this.bufferShape.vertex(this.shape.A.x, this.shape.A.y);
        this.bufferShape.vertex(this.shape.B.x, this.shape.B.y);
        this.bufferShape.vertex(this.shape.C.x, this.shape.C.y);
        this.bufferShape.endShape(CLOSE);
        this.bufferShape.pop();

        this.buffer.image(this.bufferShape, 0, 0);

    }

    drawNakedShape() {

        this.strokeWeight = 7 // 8, 18;
        this.blurSize = 2 // 10, 20;

        this.bufferShape = createGraphics(this.buffer.width, this.buffer.height);

        this.bufferShape.push();
        this.bufferShape.drawingContext.filter = `blur(${this.blurSize}px)` //- 'blur(10px)'

        // if (brightness(this.shape.color) > 50) {
        //     this.strokeColor = color(red(this.shape.color) - 100, green(this.shape.color) - 100, blue(this.shape.color) - 100);
        // } else {
        //     this.strokeColor = color(red(this.shape.color) + 100, green(this.shape.color) + 100, blue(this.shape.color) + 100);
        // }
        this.strokeColor = this.shape.color;
        this.bufferShape.stroke(this.strokeColor);
        this.bufferShape.strokeWeight(this.strokeWeight); // 18
        this.bufferShape.noFill();

        this.bufferShape.beginShape();
        this.bufferShape.vertex(this.shape.A.x, this.shape.A.y);
        this.bufferShape.vertex(this.shape.B.x, this.shape.B.y);
        this.bufferShape.vertex(this.shape.C.x, this.shape.C.y);
        this.bufferShape.endShape(CLOSE);
        this.bufferShape.pop();

        this.buffer.image(this.bufferShape, 0, 0);

    }

    showPoints(x, y, colorObject) {
        this.buffer.push();
        this.buffer.stroke(colorObject);
        this.buffer.strokeWeight(8);
        this.buffer.point(x, y);
        this.buffer.pop();
    }


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
                spritesColor.push(this.createPupselSprite(colorString));
            }
            this.sprites[colorString] = spritesColor;
        }

        // console.log("x:" + x + " y:" + y);

        push();
        sprite = getRandomFromList(this.sprites[colorString])
        this.buffer.imageMode(CENTER)
        // this.buffer.image(sprite, x - sprite.width / 2, y - sprite.height / 2); 
        this.buffer.image(sprite, x, y);
        pop();
    }

    createPupselSprite(colorObject) {

        let buffer = createGraphics(this.brushSize * 2, this.brushSize * 2);

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
        // DEBUG
        // buffer.push();
        // buffer.noFill();
        // buffer.strokeWeight(1);
        // buffer.stroke(color("black"));
        // buffer.rect(0, 0, buffer.width, buffer.height);  // cool effect

        // buffer.stroke(color("red"));
        // buffer.point(buffer.width / 2, buffer.height / 2);
        // buffer.pop();

        return buffer;
    }

}

