document.onload = function(){
	var color = [255, 0, 0];
	var circleSixth = 60;
	var playing;
	var currPlayer;

	var Song = function(mp3, info, img){

		this.data = mp3;
		this.title = info.title;
		this.image = img;

	}
	//One day break this of into a JSON file
	var s1 = new Song("../music/Prime-Numbers.MP3", {title: "OMG MUSIC!"}, "../img/puppies1.jpg");
	var s2 = new Song("../music/Wings-Of-Steel.mp3", {title: "And further, music!"}, "../img/puppy_kitty.jpg");
	var s3 = new Song("../music/Utah-Has-The-Answers.mp3", {title: "WOLOLOLOLOLO"}, "../img/puppy_yawning.jpg");
	var s4 = new Song("../music/Transfer-Cant-Live-Without-It.mp3", {title: "welp"}, "../img/puppy_stahp.jpg");
	var songArray = [s1, s2, s3, s4];

	for(var i = 0; i < songArray.length; i++){
		//TO DO
		//add individual audio module for each song
		var newPlayer = document.createElement("audio");
		newPlayer.src = songArray[i].data;
		newPlayer.id = i;

		$("#audioContainer").append(newPlayer);
	}

	var l = [0,1,2,3];
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

		$("#message").html(songArray[data.currentItem].title);
		var player = $("audio#"+data.index)[0];

		console.log(player);

		if(playing != data.index){
			player.volume = 0.2;

			$(".songImg").animate({opacity: 0}, 100, function(){
				$(this).css({"background" : "url('"+songArray[data.currentItem].image+"') center center no-repeat"});
				$(this).animate({opacity: 1}, 300);
			})
			$("#container").css({"background" : "url('"+songArray[data.currentItem].image+"') center center no-repeat",
				"background-size" : "cover"});
			
			playing = data.index;
			if(currPlayer != undefined){
				currPlayer.pause();
			}
			player.play();
			currPlayer = player;

		}

	}, -1, 0);
}();