function lineToTool(){
	this.icon = "assets/lineTo.jpg";
	this.name = "LineTo";
	let self = this;

	var startMouseX = null;
	var startMouseY = null;
	var drawing = false;

	//function to draw currentDraw array contents before committing to buffer
	this.drawTemp = function(){
		for(let draw of currentDraw){
			noFill();
			beginShape()
			for(let i=0; i<draw[0].length; i++){
				stroke(draw[3][0]);
				strokeWeight(draw[4][0])
				vertex(draw[1][0].x, draw[1][0].y)
				vertex(draw[2][0].x, draw[2][0].y)
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
		//removes the size marker once user hovers canvas
		if(select("#marker") != null){
			select("#marker").remove();
		}
		this.controls();

		if(mouseIsPressed){
			//checks and creates the currentDraw array as needed to avoid errors.
			if(currentDraw.length==0){
				currentDraw[0] = ([[],[],[],[],[]]);
			}if(currentDraw[0].length != 5){
				currentDraw[0] = ([[],[],[],[],[]]);
			}
	
			//if there are no start coordinates, we initialize them as mouseX,mouseX
			if(startMouseX == null){
				startMouseX = mouseX;
				startMouseY = mouseY;

				//drawing set to true, this means that once mouse is no longer pressed, the start coordinates will be removed
				drawing = true;

				//saving the information need to draw the line from buffer
				currentDraw[0][0].push("line")
				currentDraw[0][3].push([h,s,b,alphaVal])
				currentDraw[0][4].push([strokeSize])
				currentDraw[0][1].push(createVector(startMouseX,startMouseY))
			}else{
				//saving end coordinates
				currentDraw[0][2][0] = createVector(mouseX,mouseY);
				//drawing from currentDraw array to show preview of line
				this.drawTemp();
			}
		}

		//resetting some variables based on whether a line was drawn or not
		else if(drawing){
			drawing = false;
			startMouseX = null;
			startMouseY = null;
		}

		else{
			if(currentDraw.length>0){ //if the array does have a line
				//pushing line to buffer
				bufferDraw.push(currentDraw.pop())
			}

			//mouse pointer
			push()
				stroke(h,s,b, alphaVal)
				point(mouseX, mouseY)
			pop()
		}
	};

	this.populateOptions = function(){
		new ToolProperties();
	};
}
