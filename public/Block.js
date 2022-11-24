
class Block {

    constructor(data) {
        this.blockPos = createVector(data.x, data.y);
        this.blockSize = data.blocksize;
        this.haloPos = createVector(this.blockPos.x - this.blockSize / 2, this.blockPos.y - this.blockSize / 2);
        this.haloBlockSize = this.blockSize * 2;
    }


    show() {

        push();
        fill("white")
        rect(this.haloPos.x, this.haloPos.y, this.haloBlockSize, this.haloBlockSize);
        rect(this.blockPos.x, this.blockPos.y, this.blockSize, this.blockSize);
        pop();

        this.debugZones();
    }

    debugZones() {

        push();
        if (mouseX >= this.haloPos.x && mouseX < this.blockPos.x &&
            mouseY >= this.haloPos.y && mouseY < this.blockPos.y) {
            console.log("a");
            fill("red");
        } else if (mouseX >= this.blockPos.x && mouseX < (this.blockPos.x + this.blockSize) &&
            mouseY >= this.haloPos.y && mouseY < this.blockPos.y) {
            console.log("b");
            fill("green");
        } else if (mouseX >= (this.blockPos.x + this.blockSize) && mouseX < this.haloPos.x + this.haloBlockSize &&
            mouseY >= this.haloPos.y && mouseY < this.blockPos.y) {
            console.log("c");
            fill("purple");
        } else if (mouseX >= this.haloPos.x && mouseX < this.blockPos.x &&
            mouseY >= this.blockPos.y && mouseY < (this.blockPos.y + this.blockSize)) {
            console.log("d");
            fill("blue");
        } else if (mouseX >= this.blockPos.x && mouseX < (this.blockPos.x + this.blockSize) &&
            mouseY >= this.blockPos.y && mouseY < (this.blockPos.y + this.blockSize)) {
            console.log("e");
            fill("white");
        } else if (mouseX >= (this.blockPos.x + this.blockSize) && mouseX < (this.haloPos.x + this.haloBlockSize) &&
            mouseY >= this.blockPos.y && mouseY < (this.blockPos.y + this.blockSize)) {
            console.log("f");
            fill("orange");
        } else if (mouseX >= this.haloPos.x && mouseX < this.blockPos.x &&
            mouseY >= (this.blockPos.y + this.blockSize) && mouseY < (this.haloPos.y + this.haloBlockSize)) {
            console.log("g");
            fill("yellow");
        } else if (mouseX >= this.blockPos.x && mouseX < (this.blockPos.x + this.blockSize) &&
            mouseY >= (this.blockPos.y + this.blockSize) && mouseY < (this.haloPos.y + this.haloBlockSize)) {
            console.log("h");
            fill("black");
        } else if (mouseX >= (this.blockPos.x + this.blockSize) && mouseX < (this.haloPos.x + this.haloBlockSize) &&
            mouseY >= (this.blockPos.y + this.blockSize) && mouseY < (this.haloPos.y + this.haloBlockSize)) {
            console.log("i");
            fill("grey");
        } else {
            fill("white");
        }
        ellipse(mouseX, mouseY, 10, 10);
        pop();

    }
}