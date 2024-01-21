function fillTool(){
    this.icon = "assets/fillTool.png";
    this.cursor = loadImage("assets/fillToolCursor.png")
    this.name = "fill";
    let self = this;

	this.draw = function () {
        //sets the colour we are trying to fill to
        //there is no opacity value, so we keep it at 1 for now.
        //however, it can be changed if needed easily.
        self.colour = self.hsbToRgb(h, s, b, 1);

		if (mouseIsPressed) {

            //checks and creates the currentDraw array as needed to avoid errors.
            if(currentDraw.length==0){
				currentDraw[0] = [[],[]];
			}if(currentDraw[0].length != 2){
				currentDraw[0] = [[],[]];
			}

			filler(mouseX, mouseY); // activates fill function when mouse is pressed

            currentDraw[0][0] = ["fill"];

            currentDraw[0][1] = [Uint8ClampedArray.from(pixels)]; // a copy of the pixels array, not a reference
		}
        else{
            //pushes to buffer if there is anything to draw
            if(currentDraw.length>0){
				bufferDraw.push(currentDraw.pop())
			}

            //the little animation that shows the color selected for the fill and acts as a sort of indicator for when the fill is done.
            //the fill can take a little bit of time and i find that this helps make it feel a little more responsive.
            push()
                noStroke()
                //background rect to ensure visibility on darker surfaces
                fill(255,255)
                rect(10,245, 50, 50)
                //rect with a crude representation of the selected color (due to changed alpha value), sufficient for its purpose
                fill(h,s,b,0.5)
                rect(10,245, 50, 50)
                colorMode(RGB)
                image(self.cursor,
                      30-map(sin(frameCount*0.2%180), -1, 1, 33, 43)+20,    //x
                      235-map(sin(frameCount*0.2%180), -1, 1, 23, 33)+40,   //y
                      map(sin(frameCount*0.2%180), -1, 1, 45, 55),          //width
                      map(sin(frameCount*0.2%180),-1, 1, 45, 55)            //height
                )
            pop()

            //the pointer
            push()
                strokeWeight(1)
                stroke("white")
                fill(h,s,b)
                rect(mouseX-5, mouseY-5, 10, 10)
		    pop()
        }

        //Gets the colour of the pixel with the position 'pos' and then returns if its colour matches the previous color we are changing
        function matchColour(pos, prevColour) {
            var current = getPixelData(pos.x, pos.y);
            return current.every((value, index) => value === prevColour[index]);
        }

        function getKey (pos) {
            return ""+pos.x+"_"+pos.y; // Accepts the position of a pixel and returns the given key in the pixelList object
        }

        function filler(xPos, yPos) {
            var stack = [];
            var pixelList = new Set(); // Use a Set to store unique pixel positions

            var first = { x: xPos, y: yPos };
            stack.push(first);
            pixelList.add(getKey(first)); // Use Set's add method to store the first pixel position

            loadPixels();
            var firstColour = getPixelData(xPos, yPos);

            while (stack.length > 0) {
                var pos1 = stack.pop();
                setPixelData(pos1.x, pos1.y, self.colour);

                var directions = [       // all the pixel directions to check and change their color pixel value
                    { x: pos1.x, y: pos1.y - 1 },
                    { x: pos1.x, y: pos1.y + 1 },
                    { x: pos1.x - 1, y: pos1.y },
                    { x: pos1.x + 1, y: pos1.y }
                ];

                for (var i = 0; i < directions.length; i++) {
                    var pos = directions[i];
                    if (0 <= pos.y && pos.y < height && 0 <= pos.x && pos.x < width &&
                    matchColour(pos, firstColour) && !pixelList.has(getKey(pos))){
                        stack.push(pos);
                        pixelList.add(getKey(pos)); // Use Set's add method to store unique pixel positions
                    }
                }
            }
            updatePixels();
        }

        //It accepts x, y coordinates of a pixel on the canvas and it returns the pixels colour as a RGBA array
        //Requires loadPixels() to be called at some point before being used
        function getPixelData(x, y) {
            var d = pixelDensity();
            var idx = 4 * ((y * d) * width * d + (x * d));
            var pixelData = pixels.subarray(idx, idx + 4); // Use the subarray method to extract the pixel data

            // Convert the pixel data from Uint8ClampedArray to a regular array
            var colour = Array.from(pixelData);

            return colour;
        }

        //It will change the colour of a pixel (from x, y coordinates) in the pixel array
        //Requires loadPixels() to be called at some point before being used
        function setPixelData(x, y, colour) {
            var pixelData = getPixelData(x, y);
            pixelData[0] = colour[0];
            pixelData[1] = colour[1];
            pixelData[2] = colour[2];
            pixelData[3] = colour[3];
            var d = pixelDensity();
            //finds the pixels index with the help of the x, y coordinates and multiplying them by pixel density
            //Higher pixel density = more pixels in the array to change. That is why it is a for loop
            for (var i = 0; i < d; ++i) {
                for (var j = 0; j < d; ++j) {
                    var idx = 4 * ((y * d + j) * width * d + (x * d + i));
                    pixels[idx] = pixelData[0];
                    pixels[idx + 1] = pixelData[1];
                    pixels[idx + 2] = pixelData[2];
                    pixels[idx + 3] = pixelData[3];
                }
            }
        }
    }

    //this is a  function that converts hsb-a values to rgb-a.
    //this function was copied form a source and then modified to fit the purposes of this tool.
    //since it only really uses hardcoded value as an expression to convert the numbers, reusing it makes sense.
    //this function, with a few changes, is also used in the colourPalette.js file
    this.hsbToRgb = function (h, s, b, alphaVal) {
        this.h = h;
        this.s = s;
        this.b = b;
        this.alphaVal = alphaVal;

        //converting the values
        this.s /= 100;
        this.b /= 100;
        let k = n => (n + this.h / 60) % 6;
        let f = n => this.b * (1 - this.s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));

        //returning [r,g,b,a]
        return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255), map(this.alphaVal, 0, 1, 0, 255)];
    }

    this.populateOptions = function(){
		new ToolProperties("fill");
	}
}