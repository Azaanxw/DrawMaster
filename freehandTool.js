function freehandTool(c){
	//set an icon and a name for the object
	this.icon = "assets/freehand.jpg";
	this.name = "freehand";
	let self = this

    //function to draw currentDraw array contents before committing to buffer
	this.drawTemp = function(){
        for(let draw of currentDraw){
			noFill();
			beginShape()
			for(let i=0; i<draw[0].length; i++){
				curveVertex(draw[1][i].x, draw[1][i].y)
			}
			endShape()
        }
	}

	//this function is required to create the options and link them to their corresponding variables.
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
					.style("borderRadius", `${strokeSize}px`) //border-radius to turn into circle
			}
		})

		opacityInp.value(opacity.value())
		alphaVal = opacity.value()
		stroke(h, s, b, alphaVal);
		fill(h, s, b, alphaVal); //updates the current stroke/fill with new alpha val
	}

	this.draw = function(){
		//removes the marker once user hovers canvas
		if(select("#marker") != null){
			select("#marker").remove();
		}
		this.controls()

		if(mouseIsPressed){
			//checks and creates the currentDraw array as needed to avoid errors.
			if(currentDraw.length==0){
				currentDraw[0] = ([[],[],[],[]]);
			}if(currentDraw[0].length != 4){
				currentDraw[0] = ([[],[],[],[]]);
			}

			//pushes the information required to draw the stroke so that it can be used by different functions later
			currentDraw[0][0].push("freehand")
			currentDraw[0][1].push(createVector(mouseX,mouseY))
			currentDraw[0][2].push([h,s,b,alphaVal])
			currentDraw[0][3].push([strokeSize])

			//draws the stroke before its in the buffer to allow user to see the drawing.
			//this is one of the unnecessary steps that can be removed if we use the createGraphics approach
			//seen used with the sprayCan tool.
			this.drawTemp();
		}

		else{
			//pops currentDraw, pushing the element [0] into the the buffer as a drawing
			if(currentDraw.length>0){
				bufferDraw.push(currentDraw.pop())
			}
		}

		//draw the pointer. drawn in else statement as it does not need to be drawn once mouse is pressed
		push()
			stroke(h,s,b, alphaVal)
			point(mouseX, mouseY)
		pop()
	};

	this.populateOptions = function(){
		new ToolProperties();
	}
}
