//Displays and handles the colour palette.
var h;
var s;
var b;

function ColorPalette(){
	var self = this;

	//canvas dimensions
	this.width = 410;
	this.height = 160

	//center color palette dimensions
	this.paletteWidth = this.width-50
	this.paletteHeight = this.height-50

	//relative x,y
	this.x = this.width/2;
	this.y = this.height/2;

	//parent div for graphic canvas
	this.parent = select(".colourPalette");

	//graphic canvas displayed as block element inside of colourPalette div
	this.palette = createGraphics(this.width, this.height)
	this.palette.parent(this.parent)

	//creating input box function
	this.inputContainer = select(".inputBoxes")
	this.createInput = function(n){
		this.inputTemp = createInput(n, 'number');
		this.inputTemp.size(60);
		this.inputTemp.style('fontSize', '25px');
		return this.inputTemp;
	}

	//hue input
	this.hInput = this.createInput(0, 'number');
	this.hInput.parent(select(".box1"))

	//saturation input
	this.sInput = this.createInput(100, 'number');
	this.sInput.parent(select(".box2"))

	//saturation quick controls. a white and black button that simply goes from either 0 to 100 sat on a click.
	this.whiteButton = createButton("").parent(select(".box2")).style("display", "inline").style("height", "25px").size(20)
	.mouseClicked(function(){
		self.sInput.value(0)
		s = self.sInput.value()
		self.genPalette(); //regenerates pallette with updated saturation
		self.drawPalette();
		self.picker();
	});
	this.blackButton = createButton("").parent(select(".box2")).style("display", "inline").style("height", "25px").size(20).style("backgroundColor", "#000").
	mouseClicked(function(){
		self.sInput.value(100)
		s = self.sInput.value()
		self.genPalette();
		self.drawPalette();
		self.picker();
	});

	//brightness input
	this.bInput = this.createInput(0, 'number');
	this.bInput.parent(select(".box3"))

	this.expand = select("#expand")

	//initiate h,s,b
	h = 0;
	s = 100;
	b = 0;

	//the color palette displayed, is generated and stored in array. this is allows me to
	//draw a more accurate color palette with more colors while keeping the computational load low.
	this.colorPallette = []
	this.genPalette = function(){
		//empty the array
		self.colorPallette = []
		//loop for every pixel in palette region of canvas and draw a rect
		//with position related color.
		for(let x = -this.paletteWidth/2; x<this.paletteWidth/2; x++){
			for(let y = -this.paletteHeight/2; y<this.paletteHeight/2; y++){
					//map pixel range to hue range. repeated for brightness
					h = map(x, -this.paletteWidth/2, this.paletteWidth/2, 0, 360);
					b = map(y, -this.paletteHeight/2, this.paletteHeight/2, 0, 100);
					//storing all variables required to draw palette in array.
					self.colorPallette.push([x+this.x, y+this.y, this.paletteHeight/2 , this.paletteHeight/2, h, s, b])
			}
		}
	}

	//drawing palette by simply looping over the palette array
	this.drawPalette = function(){
		for(let i=0; i<self.colorPallette.length;  i+=15){
			h = self.colorPallette[i][4]
			b = self.colorPallette[i][6]
			this.palette.noStroke();
			this.palette.fill(h, self.colorPallette[i][5], b);
			this.palette.rect(self.colorPallette[i][0], self.colorPallette[i][1], self.colorPallette[i][2], self.colorPallette[i][3]);
		}
	}

	//initializing picker coords, will alter initial position of picker square on palette.
	this.pickerX = 0; //0 to 360
	this.pickerY = 0; //0 to 110

	//these next 2 functions are important to discern regular clicks from
	// clicks and drags on the palette
	this.paletteClicked = function(){
		//finding position of palette relative to the webpage.
		self.getCursor(event)
		//drawing picker
		self.picker()
		//applying selected color.
		stroke(h, s, b, alphaVal);
		fill(h, s, b, alphaVal);
	}

	//listener to make sure document width/height is always known
	this.doc = document.querySelector(".colourPalette").getBoundingClientRect();
	window.addEventListener("resize", function(){
		self.doc = document.querySelector(".colourPalette").getBoundingClientRect();
	});

	//checking for when the mouse is dragged
	this.movingClick = function(){
		//makes it harder to accidentally change the colour when drawing near the palette.
		if(self.doc.top-10 < mouseY){
			if(mouseIsPressed){
				self.paletteClicked();
			}
		}
	}

	//finding relative position in document, 25 is the width of the border of the palette
	this.getCursor = function(event) {
		let mousex = event.clientX + scrollX; //offset page scroll
		let mousey = event.clientY + scrollY;
		self.pickerX = mousex - 25;
		self.pickerY = mousey - self.doc.top - 25;
	}

	//making sure all cases are covered for types of mouse inputs
	this.palette.mouseClicked(this.paletteClicked)
	this.palette.mouseMoved(self.movingClick)

	//draws and handles picker
	this.picker = function(){
		//draws palette to hide old picker
		self.drawPalette()

		self.palette.stroke("white")
		self.palette.strokeWeight(5)
		self.palette.noFill()

		//constrain the values in the palette width range and map it to the hue range, repeated for bright.
		self.pickerX = constrain((self.pickerX), 0, self.paletteWidth)
		h = Math.round(map(self.pickerX, 0, self.paletteWidth, 0, 360));

		self.pickerY = constrain((self.pickerY), 0,  self.paletteHeight)
		b = Math.round(map(self.pickerY, 0, self.paletteHeight, 0, 100));


		console.log("H: "+ h,  " B: " + b)
		//drawing picker
		self.palette.rectMode(CENTER)
		self.palette.rect(self.pickerX+25, self.pickerY+25, 10, 10);
		self.palette.rectMode(CORNER)
		console.log("pickerX: "+self.pickerX)
		console.log("pickerY: "+self.pickerY)

		//drawing responsive border
		self.palette.stroke(h,s,b)
		self.palette.strokeWeight(50)
		self.palette.rect(0, 0, self.width, self.height)

		//updating values in input fields.
		self.hInput.value(h)
		self.bInput.value(b)
		self.sInput.value(s)
		console.log(s)

		stroke(h, s, b, alphaVal);
		fill(h, s, b, alphaVal);
	}

	//this is where the palette is first drawn
	this.setup = function(){
		this.palette.colorMode(HSB)
		this.palette.background(150)
		this.palette.fill(0)
		this.palette.rect(0, 0, 90, 90)
		this.palette.style("display", "block")

		//generate and draw the palette. this needs to be
		//re-run every time the saturation is changed
		this.genPalette();
		this.drawPalette()
		//draw the color picker, start at (0,100,0)
		this.picker()
		//change the color mode for the main canvas
		colorMode(HSB);
		//set the beginning color
		stroke(h, s, b, alphaVal);
		fill(h, s, b, alphaVal);
	}
	this.setup()

	//listeners for the input boxes
	//h and b inputs are very similar, so b is not commented
	this.hInput.input(function() {
		//constraining value in input field
		self.hInput.value(constrain(self.hInput.value(), 0, 360))
		console.log('Input changed: ', this.value());
		//setting picker x by mapping the hue to the expected range based on width
		self.pickerX = map(self.hInput.value(), 0, 360, 0, self.paletteWidth);
		console.log('pickerX: ', self.pickerX);
		//running picker to update hue value adn draw picker in corresponding loc.
		self.picker()
	});

	this.sInput.input(function() {
		//constraining value in input field
		self.sInput.value(constrain(self.sInput.value(), 0, 100))
		console.log('Input changed: ', this.value());
		//setting the sat value to value in input field
		s = self.sInput.value();
		//generating palette again with updated saturation
		self.genPalette();
		self.drawPalette();
		self.picker();
	});

	this.bInput.input(function() {
		self.bInput.value(constrain(self.bInput.value(), 0, 100))
		console.log('Input changed: ', this.value());
		self.pickerY = map(self.bInput.value(), 0, 100, 0, self.paletteHeight);
		console.log('pickerY: ', self.pickerY);
		self.picker();
	});

	//this code is to ensure that the swatches save colour and apply correctly.
	this.swatches = []
	this.previousHTML;
	this.expand.mouseClicked(function(){ //expand is the palette opener
		if(self.expand.html() == "P<br>A<br>L<br>E<br>T<br>T<br>E"){	//if this is the name, it was close when clicked
			self.expand.html("C<br>O<br>L<br>L<br>A<br>P<br>S<br>E")	//changes it to this
			self.previousHTML = select(".options").html()				//clears any previous html and saves it to previousHTML
			select(".options").html("");

			self.populateOptions("saveColour", "Save current colour to swatch?")	//populates options box with a button
			select("#saveColour").style("display", "none")							//styles it

			self.populateOptions("applyColour", "Colour applied!")					//another button
			select("#applyColour").style("display", "none")

			self.populateOptions("readMe", "*To save current colour, select a swatch <br> *To apply colour to brush, double-click swatch")
			this.swatchBox = createDiv().parent(select(".options"));
			this.swatchBox.style("marginTop", "5px")
			this.swatchBox.style("backgroundColor", "#444")
			this.swatchBox.style("display", "inlineBlock")

			//creates the swatches with all respective colours
			current = this;
			if(self.swatches.length == 0){
				for(let i = 0; i < 20; i++){
					self.swatches.push([h, s, b]);
					current.swatch = createDiv().parent(current.swatchBox);
					current.swatch.class(`colourSwatches swatch${i}`)
					self.hsbToRgb(self.swatches[i][0], self.swatches[i][1], self.swatches[i][2], current.swatch)
				}
			}//this else executes the first time the palette is opened. it initially generates the swatches, later they are stored and redrawn
			else{
				for(let i = 0; i < self.swatches.length; i++){
					current.swatch = createDiv().parent(current.swatchBox);
					current.swatch.class(`colourSwatches swatch${i}`)
					self.hsbToRgb(self.swatches[i][0], self.swatches[i][1], self.swatches[i][2], current.swatch)
				}
			}

			//single click executes this function
			this.single = function(){
				for(let i = 0; i < self.swatches.length; i++){ //removes previous outline on swatch
					current.swatch = select(`.colourSwatches.swatch${i}`)
					current.swatch.style("outline", "none")
				}
				this.style("outline", "5px solid red") //styles swatch again
				dthis = this							//makes reference to swatch
				select("#readMe").style("display", "none")	//hides some buttons, shows another one
				select("#applyColour").style("display", "none")
				select("#saveColour").style("display", "inline").mouseClicked(function(){ //if clicked, swatch save colour by setting it as its id
					select("#saveColour").style("display", "none")
					select("#readMe").style("display", "inline")
					dthis.style("outline", "5px solid white")
					this.id = dthis.class().split("colourSwatches swatch")[1]
					self.swatches[this.id] = [h, s, b];
					self.hsbToRgb(h, s, b, dthis); //converting the hsb values to rgb
				})
			}

			//runs when a double click is executed
			//follows the same structure as single, but this time applies the colour to brush
			this.double = function(){
				for(let i = 0; i < self.swatches.length; i++){
					current.swatch = select(`.colourSwatches.swatch${i}`)
					current.swatch.style("outline", "none")
				}
				sthis = this
				this.style("outline", "5px solid white")
				select("#applyColour").style("display", "inline")
				select("#saveColour").style("display", "none")
				select("#readMe").style("display", "none")
				this.id = sthis.class().split("colourSwatches swatch")[1]
				self.pickerX = map(self.swatches[this.id][0], 0, 100, 0, self.paletteHeight);
				s = self.swatches[this.id][1];
				self.pickerY = map(self.swatches[this.id][2], 0, 100, 0, self.paletteHeight);
				self.genPalette();
				self.picker()
			}

			//click manager
			for(let i = 0; i < self.swatches.length; i++){
				current.swatch = select(`.colourSwatches.swatch${i}`)
				current.swatch.doubleClicked(current.double)
				current.swatch.mouseClicked(current.single)
			}

		}else{
			//if palette button is clicked again, it'll close
			self.expand.html("P<br>A<br>L<br>E<br>T<br>T<br>E")
			select(".options").html("");
			if (toolbox.selectedTool.hasOwnProperty("populateOptions")) {
				toolbox.selectedTool.populateOptions();
			} else {
				select(".options").html(self.previousHTML);
			}
		}
	})

	//populates options box with a button with the passed in id and html
	this.populateOptions = function(id, html) {
		this.button = select(".options").child(createButton(html).id(id));

		this.button.style("fontSize", "25px")
		return this.button;
	};

	//converts rgb to this.hsbToRgb, found ononline, more info in the fill tool
	this.hsbToRgb = function (h, s, b, thing) {
		s /= 100;
		b /= 100;
		let k = n => (n + h / 60) % 6;
		let f = n => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
		this.array = [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
		thing.style("backgroundColor", `rgb(${this.array[0]}, ${this.array[1]}, ${this.array[2]})`);
	}
}