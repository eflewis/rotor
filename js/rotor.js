/*
	Welcome to rotor.js!!!     by Eleanor Lewis

	Rotor.js is a lightweight, style-agnostic way to make a dial selector UI element for your website.
	How do you use it? Simple!

	1) Create your html document. Add a div that you want to make your rotary selector.
	2) Give this div a unique id, say "happySpinner".
	3) Create a new Rotor object, documented below. 

	And that's as much set-up as it takes! Your div is now a rotary selector.

	But, of course, you'll want to get data out of this selector. To do this, you can use the Rotor.getData()
	function to return an object containing all the information you need. Use this in the Rotor's callback 
	or anywhere else in your code. 

*/


/*
	Params:

	rotorId: A selector for a div which is going to be a rotor. This should be the full selector, so for
			<div id="happySpinner"></div>
			you would pass in rotorId="#happySpinner"

	options: A list or array of the options from which the rotor will select. Where length is the length of 
			the options list, you should ensure:
					0 <= length <= 360

	callback: A function to be called every time a rotation occurs.

	maxDegree: An upper bound on the rotation of your rotor. Including a maxDegree will keep the degree of
				rotation between 0 and your maxDegree. If no maximum is desired, pass in maxDegree=360
				CURRENTLY THIS DOES NOTHING
*/
var Rotor = function(rotorId, options, callback, maxDegree){

	this.rotorId = rotorId;
	this.options = options;
	this.maxDegree = maxDegree;
	this.numOptions = options.length;
	this.selected = 0;
	this.skipRatio = 360/this.numOptions;
	this.selectDegree = 0;
	this.selecting = false;
	this.radius = $(this.rotorId).innerWidth()/2;
	
	this.offset = [$(this.rotorId).offset().left, $(this.rotorId).offset().top];
	this.centerPos = [$(this.rotorId).innerWidth()/2 + this.offset[0], $(this.rotorId).innerHeight()/2 + this.offset[1]];
	this.touch = undefined;

	this.oldAngle, this.newAngle = 0;
	
	this.init();

	this.callback = callback;

	

}

/*
	Using the position of the mouse/touch, rotate the selector and update what item is selected.
	newX and newY are passed from handleMouseMove() or handleTouchMove()
*/
Rotor.prototype.rotate = function(newX, newY){

	var a = this.radius;
	var b = Math.sqrt( Math.pow(this.centerPos[0] - newX, 2) + Math.pow(this.centerPos[1] - newY, 2));
	var c = Math.sqrt( Math.pow(newX - (this.radius + this.offset[0]), 2) + Math.pow(newY - this.offset[1], 2));
	var cosine = ((c*c) - (a*a) - (b*b))/(-1*2*a*b);
	var x = 180/Math.PI;
	this.newAngle = Math.acos(cosine)*x; 

	

	console.log(this.newAngle);

	if(newX <= this.radius + this.offset[0]){
		this.newAngle = -1 * this.newAngle;
	}

	var changeAngle = this.newAngle - this.oldAngle;

	/*if(newX <= this.radius + this.offset[0]){
		this.newAngle = Math.abs(180+(180 - this.newAngle));
	}*/



	this.selectDegree = this.selectDegree + changeAngle;

	if(this.maxDegree != -1){
		if(this.selectDegree > this.maxDegree){
			this.selectDegree = this.maxDegree;
		} else if(this.selectDegree <= 1){
			this.selectDegree = 0;
		}
	}

	if(this.selectDegree < 0){
		this.selectDegree = 360 + this.selectDegree;
	}
	if(this.selectDegree >= 360 || this.selectDegree <= -360){
		this.selectDegree = 0;
	}

	this.selected = Math.floor(this.selectDegree/this.skipRatio);
	if(this.selected < 0){
		this.selected = this.numOptions + this.selected;
	}

	$(this.rotorId).css({WebkitTransform: 'rotate(' + this.selectDegree+ 'deg)', MozTransform: 'rotate(' + this.selectDegree+ 'deg)'});	

	this.oldAngle = this.newAngle;

	this.callback();
}

/*
	Find the center of the rotor and update Rotor.centerPos	
*/
Rotor.prototype.findCenter = function(){
	this.radius = $(this.rotorId).innerWidth()/2;
	
	this.offset = [$(this.rotorId).offset().left, $(this.rotorId).offset().top];
	this.centerPos = [$(this.rotorId).innerWidth()/2 + this.offset[0], $(this.rotorId).innerHeight()/2 + this.offset[1]];
}

/*
	Return an object containing the current index selected, the current item selected, and the current
	degree of rotation.
*/
Rotor.prototype.getData = function(){
	var toReturn = {
		index: this.selected,
		currentItem: this.options[this.selected],
		degree: this.selectDegree
	}

	return toReturn;
}

/*
	Update the list of options from which the rotor selects
*/
Rotor.prototype.setOptions = function(newOptions){
	this.options = newOptions;
	this.numOptions = this.options.length;
	this.skipRatio = 360/this.numOptions;
}


Rotor.prototype.handleMouseDown = function(event){
	event.preventDefault();

	this.selecting = true;
	var newX = event.pageX;
	var newY = event.pageY;



	var a = this.radius;
	var b = Math.sqrt( Math.pow(this.centerPos[0] - newX, 2) + Math.pow(this.centerPos[1] - newY, 2));
	var c = Math.sqrt( Math.pow(newX - (this.radius + this.offset[0]), 2) + Math.pow(newY - this.offset[1], 2));
	var cosine = ((c*c) - (a*a) - (b*b))/(-1*2*a*b);
	var x = 180/Math.PI;


	this.oldAngle = Math.acos(cosine)*x; 

	if(newX <= this.radius + this.offset[0]){
		this.oldAngle = -1 * this.oldAngle;
	}
}

Rotor.prototype.handleMouseUp = function(){
	this.selecting = false;
	this.oldAngle = 0;
}

Rotor.prototype.handleMouseMove = function(event){
	if(this.selecting === false){
		return;
	}
		var newX = event.pageX;
		var newY = event.pageY;

		this.rotate(newX, newY);
}

Rotor.prototype.handleTouchStart = function(evt){
	evt.preventDefault();
	this.selecting = true;

	if(!this.touch){
		var t = evt.changedTouches;
		this.touch = t[0];
	}

	var newX = this.touch.pageX;
	var newY = this.touch.pageY;



	var a = this.radius;
	var b = Math.sqrt( Math.pow(this.centerPos[0] - newX, 2) + Math.pow(this.centerPos[1] - newY, 2));
	var c = Math.sqrt( Math.pow(newX - (this.radius + this.offset[0]), 2) + Math.pow(newY - this.offset[1], 2));
	var cosine = ((c*c) - (a*a) - (b*b))/(-1*2*a*b);
	var x = 180/Math.PI;


	this.oldAngle = Math.acos(cosine)*x; 
	console.log(this.oldAngle);

	if(newX <= this.radius + this.offset[0]){
		this.oldAngle = -1 * this.oldAngle;
	}	
}

Rotor.prototype.handleTouchEnd = function(evt){

	evt.preventDefault();
	var t = evt.targetTouches;
	var found = false;
	for(var i=0; i < t.length; i++){
		if(this.touch.identifier == t[i].identifier){
			found = true;
		}
	}

	if(!found){
		this.touch = undefined;
		this.selecting = false;
	}
}

Rotor.prototype.handleTouchMove = function(evt){

	evt.preventDefault();
	var t = evt.changedTouches;

	if(!this.touch){
		this.touch = t[0];
		this.selecting = true;
	}

	if(!this.selecting){
		return;
	}

	for(var i=0; i<t.length; i++){
		if(t[i].identifier == this.touch.identifier){
			this.touch = t[i];
		}
	}

	var newX = this.touch.pageX;
	var newY = this.touch.pageY;

	this.rotate(newX, newY);

}

Rotor.prototype.init = function(){
	var ctx = this;

	//$(this.rotorId).css({WebkitTransform: 'rotate(' + initialRotation + 'deg)', MozTransform: 'rotate(' + initialRotation + 'deg)'});	
	
	$(this.rotorId).mousedown(function(event){
		ctx.handleMouseDown(event);
	});

	$(this.rotorId).mouseup(function(){
		ctx.handleMouseUp();
	});

	/*$(this.rotorId).mouseout(function(){
		ctx.handleMouseUp();
	});*/

	$(this.rotorId).mousemove(function(event){
		ctx.handleMouseMove(event);
	});

	$(this.rotorId)[0].addEventListener("touchstart", function(evt){ctx.handleTouchStart(evt);}, false);

	$(this.rotorId)[0].addEventListener('touchend', function(evt){ctx.handleTouchEnd(evt);}, false);

	$(this.rotorId)[0].addEventListener('touchmove', function(evt){ctx.handleTouchMove(evt);}, false);

	$(window).resize(function(){
		ctx.findCenter();
	});

}
