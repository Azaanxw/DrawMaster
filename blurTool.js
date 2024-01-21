function blurTool(){
    this.icon = "assets/blurTool.png";
    this.name = "blur";
    let self = this;

    //function to draw currentDraw array contents before committing to buffer
	this.drawTemp = function(){
        for(let draw of currentDraw){
            noFill();
            for(let i=0; i<draw[0].length; i++){
                image(draw[1][i], draw[2][i], draw[3][i])
            }
        }
	}

    this.controls = function(){
        //manage strokeSize
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
			}
		})

        //manage blurVal
        blurInp.value(blurSlider.value())
        blurVal = blurInp.value()
	}

	this.draw = function () {
        //removes the marker once user hovers canvas
		if(select("#marker") != null){
			select("#marker").remove();
		}

        if(mouseIsPressed){
            //checks and creates the currentDraw array as needed to avoid errors.
            if(currentDraw.length==0){
                currentDraw[0] = [[],[],[],[]];
            }if(currentDraw[0].length != 4){
                currentDraw[0] = [[],[],[],[]];
            }

            // blur function is called when mouse gets pressed
            //blur() returns an array [string, graphic buffer, x, y]
            let temp = blur()

            currentDraw[0][0].push(temp[0]); //"blur"
            currentDraw[0][1].push(temp[1]); //graphic
            currentDraw[0][2].push(temp[2]); //x
            currentDraw[0][3].push(temp[3]); //y

            //temporarily draws the blur before it is sent to buffer array
            self.drawTemp()
        }
        else{
            //sent to buffer array
            if(currentDraw.length>0){
                bufferDraw.push(currentDraw.pop())
            }
        }

        //mouse pointer
        push()
            noFill()
            stroke(0)
            strokeWeight(1)
            rectMode(CENTER)
            rect(mouseX, mouseY, strokeSize+20)
        pop()

		function blur(){
            noStroke()
			// Sizes of the brush are defined here
			let brushSize = strokeSize;
			let bSH = brushSize/2

			// create a p5 graphic
			let pg = createGraphics(brushSize,brushSize);

			// get a copy of the mouse's close area as an image
			let img = get(mouseX - bSH, mouseY - bSH, brushSize, brushSize)

			//paste the image to rhe graphic
			pg.image(img,0,0)
			//apply filter on the graphic
			pg.filter(BLUR, blurVal)

            //place the graphic over the original area
			return ["blur", pg, mouseX - bSH, mouseY - bSH]
		}
	}

    this.populateOptions = function(){
		new ToolProperties("blur");
	}
}