document.onload = function(){
	var color = [255, 0, 0];
	var circleSixth = 60;

	var l = ["hey", "hi", "hello", "howdy", "hay there"];
	var myRotor = new Rotor("#meinRotor", l, function(){
		var data = this.getData();
		var degree = data.degree;
		if(degree < 0){
			degree = 360+degree;
		}

		if(degree >=0 && degree < 60){
			color[0] = 255;
			color[1] = 255*degree/60;
			color[2] = 0;
		} else if(degree >=60 && degree < 120){
			color[0] = 255 - (255*(degree-60)/60);
			color[1] = 255;
			color[2] = 0;
		} else if(degree >=120 && degree < 180){
			color[0] = 0;//255 - (255*(degree-60)/60);
			color[1] = 255;
			color[2] =255*(degree-120)/60;
		} else if(degree >= 180 && degree < 240){
			color[0] = 0;
			color[1] = 255 - (255*(degree-180)/60);
			color[2] = 255;
		} else if(degree >= 240 && degree < 300){
			color[0] = 255*(degree-240)/60;
			color[1] = 0;
			color[2] = 255;
		} else if(degree >= 300 && degree < 360){
			color[0] = 255;
			color[1] = 0;
			color[2] = 255 - (255*(degree-300)/60);
		}
		//console.log("rgb("+color[0]+","+color[1]+","+color[2]+")");
		$(".selector").css({"background-color": "rgb("+Math.floor(color[0])+","+Math.floor(color[1])+","+Math.floor(color[2])+")"});

		$("#message").html(data.currentItem);

	}, 90);
}();