//spray can object literal
function sprayCanTool() {
    this.name = "sprayCanTool";
    this.icon = "assets/sprayCan.jpg";
    this.framesLow = false
    let self = this;

    //this function is required to create the controls and link them to their corresponding variables.
	this.controls = function(){
		sizeInp.value(size.value()); //pull size value
		strokeSize = size.value(); //global variable strokeSize is set to current size
		strokeWeight(size.value());

		//this is a little indicator that displays the current stroke size when adjusting it.
		size.mouseMoved(function(){
			if(mouseIsPressed){
				if(select("#marker") != null){ //removes previous marker if it exists
					select("#marker").remove();
				}
				createDiv("").parent(select("#content")) //creates new marker with update size value
					.position(width/2-strokeSize/2, height/2-strokeSize/2).id("marker")
					.style("background-color", "#fff000").size(strokeSize,strokeSize) //colour yellow
			}
		})

        //here we repeat the above steps but with opacity controls. the global variable here is alphaVal
		opacityInp.value(opacity.value())
		alphaVal = opacity.value()
		stroke(h, s, b, alphaVal);
		fill(h, s, b, alphaVal); //updates the current stroke/fill with new alpha val

        //again, nozzleVal is updated and linked to the corresponding control
        nozzleVal = round(map(nozzle.value(), 1, 100, 200, 5))
        nozzleInp.value(nozzle.value()); //set the value of the input field
    }

    //we create an offscreen canvas
    var spray = createGraphics(width, height)
    spray.colorMode(RGB)
    spray.background(0, 0) //the canvas is set to have a transparent background.
    spray.strokeWeight(1)

    this.draw =  function(){
        //removes the marker once user hovers canvas
		if(select("#marker") != null){
			select("#marker").remove();
		}

        //updates the values changed by the tool controls by calling function above
        this.controls();

        //spread, the size of the spray
        this.spread = strokeSize,
        //points, the number of dots per frame, or intensity/pressure
        this.points = this.spread*this.spread/nozzleVal

        //next executes only if mouseispressed and if frames are above a certain value
        //this is done to ensure that the program does not crash from lack of memory
        //this implementation was required for an older implementation of the spray tool, where A LOT more canvases were created.
        //now it is just left in for added security.
        if(mouseIsPressed && !self.framesLow){
            //overrides mousePress and allows buffer to pop once
            if(frameRate() < 10){
                self.framesLow = true;
            }

            //setting up array that will be added to the buffer
            if(currentDraw.length==0){
                currentDraw[0] = ([[],[]]);
            }if(currentDraw[0].length != 2){
                currentDraw[0] = ([[],[]]);
            }

            //setting color values on spray canvas
            spray.colorMode(HSB)
            spray.stroke(h,s,b,alphaVal)
            for(var i = 0; i < this.points; i++){
                spray.point(
                random(mouseX-(this.spread/2), mouseX+(this.spread/2)),//x //spread/2 sub and add to mouseCoordinate, creates a boxed range
                random(mouseY-this.spread/2,   mouseY+this.spread/2)); //y
            }

            //draws the spray canvas, allowing the user to see the stroke before it is drawn into buffer
            image(spray, 0, 0)

            //this will ensure the latest version of the canvas is sent to buffer.
            //adding tag to array
            currentDraw[0][0] =  ["spraycan"]
            //setting spray canvas graphic to [1], use of get() to create a copy instead of just a reference to the object.
            currentDraw[0][1] = [spray.get()];
        }
        else{
            //reset the trigger
            self.framesLow = false;

            //draw a representation of the spray tool to use as a cursor, cool graphic
            push()
                stroke(h,s,b, 1)
                strokeWeight(2)
                rectMode(CENTER)
                noFill()
                rect(mouseX, mouseY, strokeSize, strokeSize)
                for(var i = 0; i < this.points; i++){
                    point(random(mouseX-(this.spread/2), mouseX+(this.spread/2)),
                    random(mouseY-this.spread/2, mouseY+this.spread/2));
                }
            pop()

            //finally, the spray is added to the buffer
            if(currentDraw[0]!=undefined){
				bufferDraw.push(currentDraw.pop())
			}

            //clearing the canvas
            spray.clear()
        }
    }

    this.populateOptions = function(){
        //populate options, with spraycan tag to create specific controls
		new ToolProperties("spraycan");
	}
};