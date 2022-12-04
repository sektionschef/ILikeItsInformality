
class Block {

    constructor(data) {
        this.blockPos = createVector(data.x, data.y);
        this.blockCenter = data.blockCenter;
        this.blockSize = data.blocksize;
        this.haloPos = createVector(this.blockPos.x - this.blockSize / 2, this.blockPos.y - this.blockSize / 2);
        this.haloBlockSize = this.blockSize * 2;
        this.color = data.color;
        this.nature = data.nature;

        this.highlight = false;

        if (this.nature == 0) {
            this.a = false;
            this.b = false;
            this.c = false;
            this.d = false;
            this.e = true;
            this.f = false;
            this.g = false;
            this.h = false;
            this.i = false;
            this.j = false;

            this.colorNoise = 20;
            this.highlight = true;
        } else if (this.nature == 10) {

            this.a = false;
            this.b = false;
            this.c = false;
            this.d = false;
            this.e = true;
            this.f = false;
            this.g = false;
            this.h = false;
            this.i = false;
            this.j = false;

            this.colorNoise = 20;
            this.highlight = true;

        } else if (this.nature == 11) {

            this.a = false;
            this.b = false;
            this.c = false;
            this.d = false;
            this.e = true;
            this.f = false;
            this.g = false;
            this.h = false;
            this.i = false;
            this.j = false;

            this.colorNoise = 20;
            this.highlight = true;

        } else if (this.nature == 1 || this.nature == 2) {
            this.a = true;
            this.b = true;
            this.c = false;
            this.d = true;
            this.e = true;
            this.f = false;
            this.g = false;
            this.h = false;
            this.i = false;
            this.j = false;

            this.colorNoise = 20;
        }
    }

    pixelate(x, y, index) {
        if (this.a) {
            this.pixelateA(x, y, index)
        }
        if (this.b) {
            this.pixelateB(x, y, index)
        }
        if (this.c) {
            this.pixelateC(x, y, index)
        }
        if (this.d) {
            this.pixelateD(x, y, index)
        }
        if (this.e) {
            this.pixelateE(x, y, index, this.highlight)
        }
        if (this.f) {
            this.pixelateF(x, y, index)
        }
        if (this.g) {
            this.pixelateG(x, y, index)
        }
        if (this.h) {
            this.pixelateH(x, y, index)
        }
        if (this.i) {
            this.pixelateI(x, y, index)
        }
    }

    pixelateA(x, y, index) {
        if (x >= this.haloPos.x && x < this.blockPos.x &&
            y >= this.haloPos.y && y < this.blockPos.y) {
            pixies.blendColors(x, y, index, this.blockPos.x, this.blockPos.y, this.blockSize, this.color, "a");
        }
    }

    pixelateB(x, y, index) {
        if (x >= this.blockPos.x && x < (this.blockPos.x + this.blockSize) &&
            y >= this.haloPos.y && y < this.blockPos.y) {
            pixies.blendColors(x, y, index, this.blockPos.x, this.blockPos.y, this.blockSize, this.color, "b");
        }
    }

    pixelateC(x, y, index) {
        if (x >= (this.blockPos.x + this.blockSize) && x < this.haloPos.x + this.haloBlockSize &&
            y >= this.haloPos.y && y < this.blockPos.y) {

        }
    }

    pixelateD(x, y, index) {
        if (x >= this.haloPos.x && x < this.blockPos.x &&
            y >= this.blockPos.y && y < (this.blockPos.y + this.blockSize)) {
            pixies.blendColors(x, y, index, this.blockPos.x, this.blockPos.y, this.blockSize, this.color, "d");
        }
    }

    // CENTER
    pixelateE(x, y, index, highlight = false) {
        if (x >= this.blockPos.x && x < (this.blockPos.x + this.blockSize) && y >= this.blockPos.y && y < (this.blockPos.y + this.blockSize)) {
            pixies.showColor(index, this.color, this.colorNoise);  // 10
        }

        if (highlight) {
            var gain = -50;
            var fraction = 20;
            // TESTING HIGHLIGHT
            if (x >= this.blockPos.x && x < (this.blockPos.x + this.blockSize / fraction) && y >= this.blockPos.y && y < (this.blockPos.y + this.blockSize)) {
                pixies.showColor(index, color(red(this.color) + gain, green(this.color) + gain, blue(this.color) + gain), this.colorNoise);  // 10
            }
        }
    }

    pixelateF(x, y, index) {
        if (x >= (this.blockPos.x + this.blockSize) && x < (this.haloPos.x + this.haloBlockSize) &&
            y >= this.blockPos.y && y < (this.blockPos.y + this.blockSize)) {
            pixies.blendColors(x, y, index, this.blockPos.x, this.blockPos.y, this.blockSize, this.color);
        }
    }
    pixelateG(x, y, index) {
        if (x >= this.haloPos.x && x < this.blockPos.x &&
            y >= (this.blockPos.y + this.blockSize) && y < (this.haloPos.y + this.haloBlockSize)) {
            // pixies.showColor(index, this.color, 10);
        }
    }
    pixelateH(x, y, index) {
        if (x >= this.blockPos.x && x < (this.blockPos.x + this.blockSize) &&
            y >= (this.blockPos.y + this.blockSize) && y < (this.haloPos.y + this.haloBlockSize)) {
            // pixies.showColor(index, this.color, 10);
        }
    }
    pixelateI(x, y, index) {
        if (x >= (this.blockPos.x + this.blockSize) && x < (this.haloPos.x + this.haloBlockSize) &&
            y >= (this.blockPos.y + this.blockSize) && y < (this.haloPos.y + this.haloBlockSize)) {
            // pixies.showColor(index, this.color, 10);
        }
    }


    showdebug() {

        push();
        fill(color(200, 100));
        rect(this.haloPos.x, this.haloPos.y, this.haloBlockSize, this.haloBlockSize);
        pop();

        push();
        rect(this.blockPos.x, this.blockPos.y, this.blockSize, this.blockSize);
        pop();

        this.debugZones();
    }

    debugZones() {

        push();
        if (mouseX >= this.haloPos.x && mouseX < this.blockPos.x &&
            mouseY >= this.haloPos.y && mouseY < this.blockPos.y) {
            // console.log("a");
            fill("red");
        } else if (mouseX >= this.blockPos.x && mouseX < (this.blockPos.x + this.blockSize) &&
            mouseY >= this.haloPos.y && mouseY < this.blockPos.y) {
            // console.log("b");
            fill("green");
        } else if (mouseX >= (this.blockPos.x + this.blockSize) && mouseX < this.haloPos.x + this.haloBlockSize &&
            mouseY >= this.haloPos.y && mouseY < this.blockPos.y) {
            // console.log("c");
            fill("purple");
        } else if (mouseX >= this.haloPos.x && mouseX < this.blockPos.x &&
            mouseY >= this.blockPos.y && mouseY < (this.blockPos.y + this.blockSize)) {
            // console.log("d");
            fill("blue");
        } else if (mouseX >= this.blockPos.x && mouseX < (this.blockPos.x + this.blockSize) &&
            mouseY >= this.blockPos.y && mouseY < (this.blockPos.y + this.blockSize)) {
            // console.log("e");
            fill("white");
        } else if (mouseX >= (this.blockPos.x + this.blockSize) && mouseX < (this.haloPos.x + this.haloBlockSize) &&
            mouseY >= this.blockPos.y && mouseY < (this.blockPos.y + this.blockSize)) {
            // console.log("f");
            fill("orange");
        } else if (mouseX >= this.haloPos.x && mouseX < this.blockPos.x &&
            mouseY >= (this.blockPos.y + this.blockSize) && mouseY < (this.haloPos.y + this.haloBlockSize)) {
            // console.log("g");
            fill("yellow");
        } else if (mouseX >= this.blockPos.x && mouseX < (this.blockPos.x + this.blockSize) &&
            mouseY >= (this.blockPos.y + this.blockSize) && mouseY < (this.haloPos.y + this.haloBlockSize)) {
            // console.log("h");
            fill("black");
        } else if (mouseX >= (this.blockPos.x + this.blockSize) && mouseX < (this.haloPos.x + this.haloBlockSize) &&
            mouseY >= (this.blockPos.y + this.blockSize) && mouseY < (this.haloPos.y + this.haloBlockSize)) {
            // console.log("i");
            fill("grey");
        } else {
            fill("white");
        }
        ellipse(mouseX, mouseY, 10, 10);
        pop();

    }
}