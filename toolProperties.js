function ToolProperties(type) {
    //clearing the options area
    select(".options").html("")

    //a function that creates a slider, an input field and a span. parameters are passed in order explained below to easily create these commonly used options
    //this is also useful as it requires no extra time on styling each of the elements, as the function already does that
    this.createOption = function(spanText, parent, valToControl, sMin, sMax, sInitial, sStep, sWidth, iInitial, iType, iStep, iWidth){
        let that = this;
        createSpan(spanText).parent(parent);

        this.thisInput = createInput(iInitial, iType, iStep).parent(parent).style("marginRight", "10px").style("fontSize", "20px");
        this.thisInput.size(iWidth)

        this.thisSlider = createSlider(sMin, sMax, sInitial, sStep).parent(parent);
        this.thisSlider.size(sWidth);

        //attaching a listener to the input field, helpful later in the corresponding tool's "control" function
        this.thisInput.input(function(){
            that.thisSlider.value(that.thisInput.value());
            valToControl = that.thisInput.value();
        })
        return [this.thisSlider, this.thisInput];

        // This is a guide to the parameters needed. s = slider, i = input field
        // this.createOption(
        //     spanText, parent, valToControl,
        //     sMin, sMax, sInitial, sStep, sWidth,
        //     iInitial, iType, iStep, iWidth
        // )
    }

    // the next two options will be created for all tools, unless if the type is (x)
    container1 = createSpan().style("display", "inline-block").parent(select(".options")); //containers are spans, in case u want to add columns instead of just rows of options
    parent = createDiv().parent(container1).style("display", "block");
    if(type != "fill"){
        //stroke size controls
        sizeOptions = this.createOption(
            "Size (px): ", parent, strokeSize,
            1, 200, strokeSize, 1, 200,
            1, "number", 1, 50
        );
        size = sizeOptions[0];
        sizeInp = sizeOptions[1];
    }

    if(type != "blur" && type != "fill"){
        //opacity/alpha controls
        parent = createDiv().style("marginTop", "20px").parent(container1).style("display", "block");
        opacityOptions = this.createOption(
            "Opacity: ", parent, alphaVal,
            0, 1, alphaVal, 0.01, 200,
            1, "number", 0.01, 60
        );
        opacity = opacityOptions[0];
        opacityInp = opacityOptions[1];
    }

    // the next 2 options are ones that are unique to only tools with type x.
    parent = createDiv().parent(select(".options"));
    if(type == "spraycan"){
        //spraycan nozzle/pressure controls
        parent = createDiv().style("marginTop", "20px").parent(container1).style("display", "block");
        nozzleOptions = this.createOption(
            "Pressure: &nbsp", parent, nozzleVal,
            1, 100, nozzleVal, 1, 200,
            1, "number", 1, 50
        );
        nozzle = nozzleOptions[0];
        nozzleInp = nozzleOptions[1];
        //container2 = createSpan().style("display", "inline-block").parent(select(".options")).style("marginLeft", "20px");
    }else if(type == "blur"){
        //blur strength controls
        parent = createDiv().style("marginTop", "20px").parent(container1).style("display", "block");
        blurOptions = this.createOption(
            "Blur Strength: ", parent, blurVal,
            0, 5, blurVal, 0.01, 200,
            blurVal, "number", 0.01, 60
        )
        blurSlider = blurOptions[0]
        blurInp = blurOptions[1]
    }
}
