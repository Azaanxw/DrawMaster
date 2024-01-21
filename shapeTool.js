function shapeTool(){
    //set an icon and a name for the object
	this.icon = "assets/shapeTool.jpeg";
	this.name = "shape";

	let self = this
    this.selection = "Rectangle"; //defaults to rectangle shape

    this.x1 = null;
    this.y1 = null;
    this.coords = []
    this.header = select(".header")

    //creates a temp graphic canvas on which the shape will be drawn on, and sets it up
    var temp = createGraphics(width, height);
    temp.background(255, 0) //transparent background
    temp.colorMode(HSB)

	//this function is required to create the options and link them to their corresponding variables.
	this.controls = function(){
		sizeInp.value(size.value()); //pull size value
		strokeSize = size.value(); //global variable strokeSize is set to current size
		temp.strokeWeight(size.value());

		//this is a little indicator that displays the current stroke size when adjusting it.
		size.mouseMoved(function(){
			if(mouseIsPressed){
				if(select("#marker") != null){ //removes previous marker if it exists
					select("#marker").remove();
				}
				createDiv("").parent(select("#content")) //creates new marker with update size value
					.position(width/2-strokeSize/2, height/2-strokeSize/2).id("marker")
					.style("background-color", "#fff000").size(strokeSize,strokeSize) //colour yellow
					.style("borderRadius", `${strokeSize}px`) //border-radius to turn into circle
			}
		})

		opacityInp.value(opacity.value())
		alphaVal = opacity.value()
		temp.stroke(h, s, b, alphaVal);
		temp.fill(h, s, b, alphaVal); //updates the current stroke/fill with new alpha val
	}

	this.draw = function(){
		//removes the marker once user hovers canvas
		if(select("#marker") != null){
			select("#marker").remove();
		}

		this.controls()

        //if mouse is pressed, or while the smartShape is selected, the code will run
        //smartShape requires user to draw the corners of the shape onto the screen
        //this means it may require multiple mouse presses over a period of time, hence the if function
		if(mouseIsPressed || this.selection == "SmartShape"){
            //checks and creates the currentDraw array as needed to avoid errors.
			if(currentDraw.length==0){
				currentDraw[0] = ([[],[]]);
			}if(currentDraw[0].length != 2){
				currentDraw[0] = ([[],[]]);
			}

            //clears temp graphic canvas
            temp.clear()

            push()
                //if x1,y1 aren't defined, define them
                if(self.x1 == null || self.y1 == null){
                    self.x1 = mouseX;
                    self.y1 = mouseY;
                }else{
                    switch(self.selection){

                        case "Rectangle":
                            temp.noFill()
                            temp.rectMode(CORNERS)
                            //x1 y1 are the top left corner. x2 y2 are the opposite corner
                            temp.rect(self.x1, self.y1, mouseX, mouseY);
                        break;

                        case "Ellipse":
                            temp.noFill()
                            temp.ellipseMode(CORNERS)
                            //x1 y1 are the top point. x2 y2 are the opposite point
                            temp.ellipse(self.x1, self.y1, mouseX, mouseY);
                        break;

                        case "Triangle":
                            temp.noFill()
                            //depending on which side of the original x value the mouse is on i.e < or >
                            //the triangle is sized the same way thanks to the if, else
                            if(mouseX>self.x1){

                                //the top corner is the x1 y1.
                                //bottom corners are calculated from the dist between the y values and the x values
                                temp.triangle(
                                    self.x1, self.y1,                                                      //x1, y1
                                    self.x1 - dist(mouseX+dist(self.x1,0,mouseX,0),0, self.x1,0), mouseY,  //x2, y2
                                    mouseX+dist(self.x1,0,mouseX,0), mouseY,                               //x3, y3
                                )
                            }else{
                                //same thing as above but to make sure it works the same way even if the mouse is moving right or left
                                temp.triangle(
                                    self.x1, self.y1,
                                    mouseX-dist(self.x1,0,mouseX,0), mouseY,
                                    self.x1 + dist(mouseX-dist(self.x1,0,mouseX,0),0, self.x1,0), mouseY
                                )
                            }
                        break;

                        case "SmartShape":
                            //adds a button to serve as an indicator/notification while drawing smartShape
                            temp.strokeWeight(1)
                            select("#clearButton").mouseClicked(function(){self.coords = [];})
                            if(select("#smartShapeAlert") == undefined){
                                createButton("Draw a shape by simply drawing its corners. Press RETURN to save SmartShape")
                                .parent(self.header).id("smartShapeAlert").style("background", "wheat")
                            }
                            //if mouse pressed, coords are pushed to array coords[]
                            if(mouseIsPressed){
                                self.coords.push({x: mouseX, y: mouseY})
                            }

                            //drawing the shape to temp canvas
                            temp.beginShape()
                            for(coord of self.coords){
                                temp.vertex(coord.x, coord.y);
                            }
                            temp.endShape()
                        break;
                    }
                }
            pop()

            //drawing the temp graphic canvas for user to see
            image(temp, 0, 0)
            console.log(self.selection);
			currentDraw[0][0] = ["shape"];
			currentDraw[0][1] = [temp.get()];

            //once user is done with smartShape, pressing RETURN saves the shape to the buffer by allowing the code
            //to execute the else block.
            if(keyIsDown(RETURN)){
                if(select("#smartShapeAlert") != undefined){
                    select("#smartShapeAlert").remove()
                    select("#smartShapeOption").style("background", "white")
                    self.coords = []; //array is reset for next shape
                    this.selection = null //selection is removed so that else is executed
                }
            }
		}
        else{
            //pushes to buffer if needed
			if(currentDraw.length>0){
				bufferDraw.push(currentDraw.pop())
			}

            //resets start coords
            self.x1 = null;
            self.y1 = null;

            //if user simply switches selection, the button.notif is autmoatically removed
            if(select("#smartShapeAlert") != undefined){
                select("#smartShapeAlert").remove()
                self.coords = []; //coords are reset in case shape was started but not saved
            }
		}

        //mouse pointer
		push()
            strokeWeight(2)
			stroke(h,s,b, alphaVal)
            fill(255, 150)
			ellipse(mouseX, mouseY, 8)
		pop()

        //different pointer for this selection
        if(this.selection == "SmartShape"){
            strokeWeight(2)
			stroke(h,s,b, alphaVal)
            fill(255,0,0, 150)
			ellipse(mouseX, mouseY, 8)
        }
	};

	this.populateOptions = function(){
		new ToolProperties();

        //creating the different buttons needed to switch between selections
        parent = createDiv().parent(select(".options")).style("marginTop", "20px");
        var rectangleOption  = createButton("▢ Rectangle").parent(parent).style("fontSize", "20px").style("background", "wheat")
        var ellipseOption = createButton("◉ Ellipse").parent(parent).style("fontSize", "20px")
        var triangleOption = createButton("△ Triangle").parent(parent).style("fontSize", "21.5px")
        var smartShapeOption = createButton("▱ SmartShape").parent(parent).style("fontSize", "20px").id("smartShapeOption")

        //attaching listeners to change this.selection and some style properties.
        rectangleOption.mouseClicked(function(){
            self.selection = "Rectangle"

            rectangleOption.style("background", "wheat")
            ellipseOption.style("background", "white")
            triangleOption.style("background", "white")
            smartShapeOption.style("background", "white")
        })
        ellipseOption.mouseClicked(function(){
            self.selection = "Ellipse"

            rectangleOption.style("background", "white")
            ellipseOption.style("background", "wheat")
            triangleOption.style("background", "white")
            smartShapeOption.style("background", "white")
        })
        triangleOption.mouseClicked(function(){
            self.selection = "Triangle"

            rectangleOption.style("background", "white")
            ellipseOption.style("background", "white")
            triangleOption.style("background", "wheat")
            smartShapeOption.style("background", "white")
        })
        smartShapeOption.mouseClicked(function(){
            self.selection = "SmartShape"

            rectangleOption.style("background", "white")
            ellipseOption.style("background", "white")
            triangleOption.style("background", "white")
            smartShapeOption.style("background", "wheat")
        })
	}
}