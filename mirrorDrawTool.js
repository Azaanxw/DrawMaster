function mirrorDrawTool() {
	this.name = "mirrorDraw";
	this.icon = "assets/mirrorDraw.jpg";
	var temp = createGraphics(width, height)

	//function to draw currentDraw array contents before committing to buffer
	this.drawTemp = function(){
		//ere we setup a new offscreen graphic buffer where we draw the user's stroke
		temp = createGraphics(width, height)
		temp.colorMode(RGB)
		temp.background(0,0)
		temp.colorMode(HSB)
		temp.stroke(h,s,b,alphaVal)
		temp.strokeWeight(strokeSize)

		if(currentDraw.length>0){ //the strokes are in the current draw array an are being read through this for loop
			for(let draw of currentDraw){
				temp.noFill();
				temp.beginShape()
				for(let i=0; i<draw[1].length; i++){
					temp.curveVertex(draw[0][i].x, draw[0][i].y)
				}
				temp.endShape()
				temp.beginShape()
				for(let i=0; i<draw[0].length; i++){
					temp.curveVertex(draw[1][i].x, draw[1][i].y)
				}
				temp.endShape()
			}
		}
		return temp
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
					//.style("borderRadius", `${strokeSize}px`) //border-radius to turn into circle
			}
		})

		opacityInp.value(opacity.value())
		alphaVal = opacity.value()
		stroke(h, s, b, alphaVal);
		fill(h, s, b, alphaVal); //updates the current stroke/fill with new alpha val
	}

	//which axis is being mirrored (x or y) x is default
	this.axis = "x";
	//line of symmetry is halfway across the screen
	this.lineOfSymmetry = width / 2;

	// `this` changes in the click handler. So storing it as a
	// variable `self` now means we can still access it in the handler

	var self = this;

	//where was the mouse on the last time draw was called.
	//set it to -1 to begin with
	var previousMouseX = -1;
	var previousMouseY = -1;

	//mouse coordinates for the other side of the Line of symmetry
	var previousOppositeMouseX = -1;
	var previousOppositeMouseY = -1;

	this.draw = function() {
		//removes the marker once user hovers canvas
		if(select("#marker") != null){
			select("#marker").remove();
		}

		this.controls()

		//do the drawing if the mouse is pressed
		if (mouseIsPressed) {
			//checks and creates the currentDraw array as needed to avoid errors.
			if(currentDraw.length==0){
				currentDraw[0] = [[],[]];
			}if(currentDraw[0].length != 2){
				currentDraw[0] = [[],[]];
			}

			//if the previous values are -1 set them to the current mouse location
			//and mirrored positions
			if (previousMouseX == -1) {
				previousMouseX = mouseX;
				previousMouseY = mouseY;
				previousOppositeMouseX = this.calculateOpposite(mouseX, "x");
				previousOppositeMouseY = this.calculateOpposite(mouseY, "y");
			}

			//if there are values in the previous locations
			//draw a line between them and the current positions
			else {
				//line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;

				//these are for the mirrored drawing the other side of the
				//line of symmetry
				var oX = this.calculateOpposite(mouseX, "x");
				var oY = this.calculateOpposite(mouseY, "y");

				previousOppositeMouseX = oX;
				previousOppositeMouseY = oY;

				//pushes stroke to draw to the temp graphic
				currentDraw[0][0].push(createVector(previousMouseX,previousMouseY))
				currentDraw[0][1].push(createVector(oX,oY))

				//stroke is drawn, and graphic is displayed
				this.drawTemp();
				image(temp, 0, 0);
			}
		}
		//if the mouse isn't pressed reset the previous values to -1
		else {
			previousMouseX = -1;
			previousMouseY = -1;

			previousOppositeMouseX = -1;
			previousOppositeMouseY = -1;

			//once clicking is stopped, if the currentDraw was populated, we will push the required information to the buffer
			if(currentDraw.length>0){
				currentDraw[0][0] = ["mirror"]
				currentDraw[0][1] = [temp]
				bufferDraw.push(currentDraw.pop());
			}

			//mouse pointer
			push()
				stroke(h,s,b, alphaVal)
				point(mouseX, mouseY)
			pop()
		}

		//push the drawing state so that we can set the stroke weight and colour
		push();
			strokeWeight(3);
			stroke("red");
			//draw the line of symmetry
			if (this.axis == "x") {
				line(width / 2, 0, width / 2, height);
			} else {
				line(0, height / 2, width, height / 2);
			}
			//return to the original stroke
		pop();

	};

	/*calculate an opposite coordinate the other side of the
	 *symmetry line.
	 *@param n number: location for either x or y coordinate
	 *@param a [x,y]: the axis of the coordinate (y or y)
	 *@return number: the opposite coordinate
	 */
	this.calculateOpposite = function(n, a) {
		//if the axis isn't the one being mirrored return the same
		//value
		if (a != this.axis) {
			return n;
		}

		//if n is less than the line of symmetry return a coorindate
		//that is far greater than the line of symmetry by the distance from
		//n to that line.
		if (n < this.lineOfSymmetry) {
			return this.lineOfSymmetry + (this.lineOfSymmetry - n);
		}

		//otherwise a coordinate that is smaller than the line of symmetry
		//by the distance between it and n.
		else {
			return this.lineOfSymmetry - (n - this.lineOfSymmetry);
		}
	};


	//when the tool is deselected update the pixels to just show the drawing and
	//hide the line of symmetry. Also clear options
	this.unselectTool = function() {
		updatePixels();
		//clear options
		select(".options").html("");
	};

	//adds a button and click handler to the options area. When clicked
	//toggle the line of symmetry between horizonatl to vertical
	this.populateOptions = function() {
		new ToolProperties();
		createButton("Make Horizontal").parent(select(".options")).style("float", "right")
		.mouseClicked(function() {
			var button = this
			if (self.axis == "x") {
				self.axis = "y";
				self.lineOfSymmetry = height / 2;
				button.html('Make Vertical');
			} else {
				self.axis = "x";
				self.lineOfSymmetry = width / 2;
				button.html('Make Horizontal');
			}
		});
	};
}
