function eraserTool(c){
	//set an icon and a name for the object
	this.icon = "assets/eraserTool.png";
	this.name = "eraser";
	let self = this

    //function to draw currentDraw array contents before committing to buffer
	this.drawTemp = function(){
        for(let draw of currentDraw){
			noFill();
			for(let i=0; i<draw[0].length; i++){
				stroke(draw[3][i]);
				strokeWeight(draw[4][i])
				line(draw[1][i].x, draw[1][i].y, draw[2][i].x, draw[2][i].y)
			}
        }
	}

	this.controls = function(){
		strokeWeight(size.value());
		sizeInp.value(size.value());
		strokeSize = size.value();

		size.mouseMoved(function(){
			if(mouseIsPressed){
				if(select("#marker") != null){
					select("#marker").remove();
				}
				createDiv("").parent(select("#content"))
				.position(width/2-strokeSize/2, height/2-strokeSize/2).id("marker")
				.style("background-color", "#fff000").size(strokeSize,strokeSize)
				.style("borderRadius", `${strokeSize}px`)
			}
		})

		opacityInp.value(opacity.value())
		alphaVal = opacity.value()
		stroke(h, s, b, alphaVal);
		fill(h, s, b, alphaVal); //updates the current stroke/fill with new alpha val
	}

	//to smoothly draw we'll draw a line from the previous mouse location
	//to the current mouse location. The following values store
	//the locations from the last frame. They are -1 to start with because
	//we haven't started drawing yet.
	var previousMouseX = -1;
	var previousMouseY = -1;
	this.draw = function(){
		if(select("#marker") != null){
			select("#marker").remove();
		}
		this.controls()

		//if the mouse is pressed
		if(mouseIsPressed){
			// draw the circle with the calculated diameter and position it at the mouse cursor
			//circle(mouseX, mouseY, diameter);
			if(currentDraw.length==0){
				currentDraw[0] = ([[],[],[],[],[]]);
			}if(currentDraw[0].length != 5){
				currentDraw[0] = ([[],[],[],[],[]]);
			}

			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.
			if(previousMouseX == -1){
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}

			else{
				//if we already have values for previousX and Y we can draw a line from
				//there to the current mouse location
				currentDraw[0][0].push("eraser")
				currentDraw[0][1].push(createVector(previousMouseX,previousMouseY))
				currentDraw[0][2].push(createVector(mouseX,mouseY))
				currentDraw[0][3].push([0,0,100,alphaVal])
				currentDraw[0][4].push([strokeSize])
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
			this.drawTemp();
		}

		else{
			//if the user has released the mouse we want to set the previousMouse values
			//back to -1.
			previousMouseX = -1;
			previousMouseY = -1;

			if(currentDraw.length>0){
				bufferDraw.push(currentDraw.pop())
			}
		}

		//mouse pointer
		push()
			strokeWeight(strokeSize*0.1)
			stroke(0,100,100)
			fill(0,0,100,alphaVal)
	 		ellipse(mouseX, mouseY, strokeSize);
		pop()
	};

	this.populateOptions = function(){
		new ToolProperties();
	}
}