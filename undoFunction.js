function undoFunction(){

    this.display = function (){
        push()
            noFill();
            for(let buffer of bufferDraw){ //loops through buffer array
                beginShape()	//required to  make the freehand and line tool function correctly.
                for(let i=0; i<buffer[0].length; i++){ //loops through the arrays inside the buffer array
                    switch(buffer[0][i]) {
                        case "freehand":
                            //this function is drawn slightly differently to all the following functions (except the next ones)
                            //this was the original method i used to store strokes, however it can become hard to keep track of.
                            //this method is not very resource heavy, just unnecessarily confusing.
                            stroke(buffer[2][i]); //sets the stroke color
                            strokeWeight(buffer[3][i]) //sets the stroke weight
                            curveVertex(buffer[1][i].x, buffer[1][i].y) //draws the vertex
                            //all of these values are stored in the buffer array. the methods used later cut down on these extra elements
                            break;

                        case "line":
                            stroke(buffer[3][0]);
                            strokeWeight(buffer[4][0])
                            vertex(buffer[1][0].x, buffer[1][0].y)
                            vertex(buffer[2][0].x, buffer[2][0].y)
                            break;

                        case "fill":
                            //this function stores pixels array, and then requires updatePixels() to work.
                            //this can be really resource heavy.
                            pixels.set(buffer[1][i])
                            updatePixels()
                            break;

                        case "blur":
                            //for every stroke, there are dozens of graphics to display.
                            //this function can be very resource heavy.
                            //this is so that the blur effect stacks while mouse is pressed
                            image(buffer[1][i], buffer[2][i], buffer[3][i])
                            break;

                        case "eraser":
                            //this function does not use the graphic object technique
                            //instead, it used a similar approach to the original freehand tool.
                            noFill();
                            stroke(buffer[3][i]);
                            strokeWeight(buffer[4][i])
                            line(buffer[1][i].x, buffer[1][i].y, buffer[2][i].x, buffer[2][i].y)
                            break;

                        default:    //for all the ones that work the same, only a single line of code is needed
                            //spray-can tool, mirror tool and shape tool.
                            image(buffer[1][i], 0, 0)
                            break;
                    }
                }
                endShape();
            }
	    pop();
    }

    this.bufferManager = function(){
        push()
            //this code will execute once the buffer array hits the popCap. It will shift the array
            //left by 1 index each time it is run.
            //before that happens, it will draw the oldest element in the buffer to the backdrop graphic/canvas.
            if(bufferDraw.length > popCap){
                backdrop.noFill();
                let buffer = bufferDraw[0]; //instead of lopping through the whole array, we just want to look at the first element this time.
                //same thing as before, but this time directly to "backdrop"
                backdrop.beginShape()
                    for(let i=0; i<buffer[0].length; i++){
                        switch(buffer[0][i]) {
                            case "freehand":
                                backdrop.stroke(buffer[2][i]);
                                backdrop.strokeWeight(buffer[3][i]);
                                backdrop.curveVertex(buffer[1][i].x, buffer[1][i].y);
                                break;

                            case "line":
                                backdrop.stroke(buffer[3][0]);
                                backdrop.strokeWeight(buffer[4][0]);
                                backdrop.vertex(buffer[1][0].x, buffer[1][0].y);
                                backdrop.vertex(buffer[2][0].x, buffer[2][0].y);
                                break;

                            case "fill":
                                backdrop.pixels.set(buffer[1][i]);
                                backdrop.updatePixels();
                                break;

                            case "blur":
                                backdrop.image(buffer[1][i], buffer[2][i], buffer[3][i]);
                                break;

                            case "eraser":
                                backdrop.noFill();
                                backdrop.stroke(buffer[3][i]);
                                backdrop.strokeWeight(buffer[4][i]);
                                backdrop.line(buffer[1][i].x, buffer[1][i].y, buffer[2][i].x, buffer[2][i].y);
                                break;

                            default:
                                backdrop.image(buffer[1][i], 0, 0);
                                break;
                        }
                    }
                backdrop.endShape()

                //shift all elements in array left once, first element now discarded and is written permanently to backdrop
                bufferDraw.shift()
            }
        pop()
    }
}