// Global variables that will store the toolbox colour palette
// and the helper functions.
var toolbox = null;
var colourP = null;
var helpers = null;

var c = null;

var alphaVal = 1;		//opacity
var nozzleVal = 50;		//spray-can pressure
var strokeSize = 20;	//stroke weight
var blurVal = 2.5;		//blur strength

var bufferDraw = [];	//Stores anything not permanently drawn to canvas yet
var currentDraw = [];	//An array that stores things that will be committed to the buffer array
var backdrop = null;	//offscreen canvas where all permanent strokes are drawn to

const defaultPopCap = 10; 	//The default number of undo(s) (value to pop buffer array at)
var popCap = defaultPopCap; //popCap not set directly as we may want to change it depending on other factors during run time, and then return to a default
//END OF GLOBAL VARIABLES

function setup() {
	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	c.parent("content");

	//setting canvas colorMode
	colorMode(HSB)

	//create helper functions and the colour palette
    helpers = new HelperFunctions();
	colourP =  new ColorPalette(c)

	//create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new freehandTool(c));
	toolbox.addTool(new lineToTool());
	toolbox.addTool(new sprayCanTool());
	toolbox.addTool(new mirrorDrawTool());
	toolbox.addTool(new fillTool());
	toolbox.addTool(new blurTool());
	toolbox.addTool(new shapeTool());
	toolbox.addTool(new eraserTool());

	//adding the undo tool
	undo = new undoFunction()

	//backdrop canvas properties
	backdrop = createGraphics(width, height)
	backdrop.background(255)
	backdrop.colorMode(HSB)

	//load pixels arrays
	loadPixels()
	backdrop.loadPixels()
}

function draw() {
	//draw backdrop first, akin to background() resetting a canvas every frame
	image(backdrop, 0, 0, width, height);

	//loops through buffer array and draws items
	undo.display();

	//this code will execute once the buffer array hits the popCap. It will shift the array
	//left by 1 index each time it is run.
	//before that happens, it will draw the oldest element in the buffer to the backdrop graphic/canvas.
	undo.bufferManager();

	//call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
	////console.log(mouseX, mouseY)
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		if(-10<mouseX && mouseX<c.width+10 && -10<mouseY && mouseY<c.height+10){
			toolbox.selectedTool.draw();
		}
		else{
			if (toolbox.selectedTool.hasOwnProperty("controls")) {
				toolbox.selectedTool.controls();
			}
			if (toolbox.selectedTool.hasOwnProperty("drawTemp")) {
				toolbox.selectedTool.drawTemp();
			}
		}

	} else {
		alert("it doesn't look like your tool has a draw method!");
	}
}

// control-z, simply pops the buffer when pressed.
//shift-z also works
function keyPressed() {
	if ((keyCode === 90 && keyIsDown(SHIFT)) || (keyCode === 90 && keyIsDown(CONTROL))) {
	  bufferDraw.pop();
	}
  }