 $(document).ready(function()
 {

 // Initialize Firebase
  var config = 
  {
    apiKey: "AIzaSyB98JWkP6KSKrNNnM1hESj7Zi4Hn3aCyEA",
    authDomain: "rockpaperscissors-2c194.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-2c194.firebaseio.com",
    projectId: "rockpaperscissors-2c194",
    storageBucket: "rockpaperscissors-2c194.appspot.com",
    messagingSenderId: "707482523752"
  };
  firebase.initializeApp(config);

  //Create a variable to reference the database
  //This creates multiple roots/subroots in Firebase/database
  var database = firebase.database();

//firebase references
  //This creates multiple roots/subroots in Firebase/database
  var database = firebase.database();
  var data = database.ref('data');            //Root[data]
  var turn = data.child('turn');              //child Root of (data)-->[turn]
  var playersRef = data.child('players');     //child Root of (data)-->[players]
  var player1Ref = playersRef.child('1');     //child Root of (players)-->[1]
  var player2Ref = playersRef.child('2');     //child Root of (players)-->[2]


//Global Variables

//Used for 3 div boxes (Player 1 div) (Winner Div)  (Player2 div)
var playerDiv;
var player1Exists;
var player2Exists;
var changeDOM;
var name;


//Create an object in order to have 2 serperate screens.
//in other words we want to display 2 seperate screens for each player
var gameObject =
{
	//Player1 Instance Variables with values
	userId: "",
	name: "",
	pick: "",
	wins: 0,
	losses: 0,
	ties: 0,

	//Player 2 
	name2: "",
	pick2: "",
	wins2: 0,
	losses2: 0,
	ties2: 0,

	//Used to determin which players turn or Which player DOM (chooses rock, paper, scissors) we're on
	turn: 0
};

//create 3 divs Player1, Winner is, Player 2
for(var i = 1; i <= 2; i++)
{
	//create an empty div each with a distinct id
	playerDiv = $("<div id='box" + i + "'>");

	//give each player a class
	//playerDiv.addClass("playerContainer");

	//give each player an wins & loses attribute
	//playerDiv.attr("Wins", totalWins);
	//playerDiv.attr("Losses", totalLosses);

	//Use id's so we can display certain data inside our div container at the right moment
	//NOTE: use (animate.show() ) to unhide data inside div container.
	var p = $("<p>");
	p.html("<p class='header" + i + "'> Waiting for player" + (i) + "</p>");



	//Dispaly name that was entered in the textbox as soon ass we hit (submit)
	var p2 = $("<p>");
	p2.html("<p class='name" + i + "'>  </p>");



	//PAPER
	var paper = $("<p>");

	//This allows us to know which paper we clicked on since we have 2 palyers that contain
	//paper choice so using class will help us know which player selected that choice.
	//paper.addClass("paperClass");
	paper.addClass("choice")

	//give (paper) div a value which is used to display on screen player1 or player2's choice	
	paper.attr("pick", "paper");

	//Use index so when we select paper we know which index or player we're on so we hide only the other
	//choices(rock, and scissors) to display only paper for that particular player(on his turn)
	paper.attr("index", i);

	//display choice that we click on
	paper.html("<p class='paper" + i + "'> Paper </p>");



	//ROCK
	var rock = $("<p>");

	//This allows us to know which paper we clicked on since we have 2 palyers that contain
	//rock choice so using class will help us know which player selected that choice.
	//rock.addClass("rockClass");
	rock.addClass("choice")

	//give (rock) div a value which is used to display on screen player1 or player2's choice	
	rock.attr("pick", "rock");

	//Use index so when we select paper we know which index or player we're on so we hide only the other
	//choices(paper, and scissors) to display only paper for that particular player(on his turn)
	rock.attr("index", i);

	//Display choice that we click on
	rock.html("<p class='rock" + i + "'> Rock </p>");



	//SCISSORS
	var scissors = $("<p>");

	//This allows us to know which paper we clicked on since we have 2 palyers that contain
	//scissors choice so using class will help us know which player selected that choice.
	//scissors.addClass("scissorsClass");
	scissors.addClass("choice")

	//give (scissors) div a value which is used to display on screen player1 or player2's choice	
	scissors.attr("pick", "scissors");

	//Use index so when we select paper we know which index or player we're on so we hide only the other
	//choices(paper, and scissors) to display only paper for that particular player(on his turn)
	scissors.attr("index", i);

	//display choice that we click on
	scissors.html("<p  class='scissors" + i + "'> Scissors </p>");




	//Display Each player wins & loses
	var totalWinsLoses = $("<p>");
	totalWinsLoses = ("<p class='win_lose" + i + "'> Wins: <span class='totalWin" + i + "'>  </span> Loses: <span class='totalLose" + i + "'> </span> Ties: <span class='totalTies" + i + "'>   </span> </p>");


	//append data inside playerDiv
	playerDiv.append(p);
	playerDiv.append(p2);			  //hide
	playerDiv.append(paper); 		  //hide
	playerDiv.append(rock);  		  //hide
	playerDiv.append(scissors); 	  //hide
	playerDiv.append(totalWinsLoses); //hide
	


	//Display data onto page
	$("#playerContainers").append(playerDiv);


	//Display winner Div
	if(i === 1)
	{
		displayWinnerDiv();
	}
	

}


//Set the turn to 0 whenever a player disconnects
data.onDisconnect().update(
{
	turn: 0
});

//reset the chat if player disconnects
data.child("chat").onDisconnect().set(
{

});

//Keeps global variables in sync with firebase on changes to firebase
//NOTE: (player1Exist) & (player2Exist) update to (true) each time we add the 
//		corresponding player
data.on("value", function(snapshot)
{
	//from data(root) go to players(child root) and see if there exist a child root of (players) called (1)
	//if exists player1Exist = true; else players1Exist = false
	//As soon as (player1) clicks [submit[ to enter his name then player1Exist = true
	//because of ( player1Ref.set( }); ) at assignPlayer() function
	player1Exists = snapshot.child("players").child("1").exists();	//player1Ref

	//from data(root) go to players(child root) and see if there exists a child root of (players) called (2)
	//if exists player2Exists = true; else player2Exist = false
	player2Exists = snapshot.child("player").child("2").exists();	//player2Ref


});

//Keeps the gameObject.turn variable in sync with firebase
//This will execute each time we update firebase: turn: 1 or 2 or 3
turn.on("value", function(snapshot)
{
	//turn = 1 when player1(Allen) chooses Rock, Paper or Scissors
	if(snapshot.val() == 1)
	{
		//set gameObject: instance variable (turn = 1)
		gameObject.turn = 1;
		user1Choose();
	}
	//turn = 2 when player2(Bob) chooses Rock, Paper or Scissors
	else if(snapshot.val() == 2)
	{
		gameObject.turn = 2;
		user2Choose();
	}
	//turn = 3 when both player1(Allen) and player2(Bob) both made a choice
	else if(snapshot.val() == 3)
	{
		gameObject.turn = 3;
		checkWinner();
	}
	//snapshot.val() = turn = 0 at initial run or if player disconnects
	//Try console.log(snapshot.val());
	else if(snapshot.val() == 0)
	{
		gameObject.turn = 0;
	}

});

//checks to see if changeDOM is true in firebase
//We come here on player2(Bob) submit name button or
//assignPlayer()/else if() {}
data.child("changeDOM").on("value", function(snapshot)
{
	//snapshot.val() = true, as soon as player 2 submits name("Bob")
	//console.log(snapshot.val()) SAME AS: changeDOM);
	if(snapshot.val() == true)
	{
		changeDOM1();
	}
	else
	{
		//Do Nothing
		return;
	}

});

//on click function for when a user submits name
$("#submit-button").on("click", function(event)
{
	
	//Do not refresh
	event.preventDefault();

	name = $("#name").val();

	//Call this function in order to add Player1 root and update gameObject values
	assignPlayer(name);

	//Hide (Name) textbox
	$("#name").hide();

	//Hide (submit) name button
	$("#submit-button").hide();

	return false;

});

//function to assign player to player1 or player2
function assignPlayer()
{
	//if (player1) does Not exist assign as (player1) and set (player1) as new firebase object
	if(!player1Exists)
	{
		gameObject.userId = 1;
		gameObject.name = name;

		//add data in firebase/database
		player1Ref.set(
		{
			name: name,
			pick: "",
			wins: 0,
			losses: 0,
			ties: 0
		});

		//change the DOM for player 1

		//Instruct player1
		$("#instructions").text("Hi " + name + " you are player 1.");
		//Use CSS to center the instuctinos
		$("#instructions").css("margin-left", "450px");
		$("#instructions").css("margin-right", "20px");
		$("#instructions").css("margin-top", "20px");

		//chat window textfield
		$("#exampleFormControlTextarea1").html("You can chat with your opponent here when they join the game.")


		//Hide Waiting for player1
		$(".header1").hide();

		//Display Player1's name and append name
		$(".name1").show();
		$(".name1").text(name);

		//Display wins and loses and append total wins and total loses
		$(".win_lose1").show();
		$(".totalWin1").text(gameObject.wins);
		$(".totalLose1").text(gameObject.losses);
		$(".totalTies1").text(gameObject.ties);

		//check to see if player 2 exists in the databaase in case there is already a player 2 waiting for a new plaeyr1, if player 2 does not exist set the turn to 1
		playersRef.once("value", function(snapshot)
		{
			//As soon as changeDOM is updated in firebase this will execute
			if(player2Exists)
			{
				data.update(
				{
					changeDOM: true
				});

				data.update(
				{
					turn: 1
				});
			}
		});

		//erases player 1 on disconnect
		player1Ref.onDisconnect().remove();

	}
	else if(player1Exists && !player2Exists)
	{
		//if (player1) exists but (player2) does Not exist, assign (player2) and set (player2) as a new firebase object

		gameObject.userId = 2;
		gameObject.name2 = name;

		//Add data inside Firebase/database
		player2Ref.set(
		{
			name: name,
			pick: "",
			wins: 0,
			losses: 0,
			ties: 0
		});

		//get Player1 info from firebase and set it in gameObject
		player1Ref.once("value", function(snapshot)
		{
			gameObject.name = snapshot.val().name;
			gameObject.wins = snapshot.val().wins;
			gameObject.losses = snapshot.val().losses;
			gameObject.ties = snapshot.val().ties;

			//Change the DOM for player 2
			$("#instructions").text("Hi " + name + ". You are Player2");
			$("#instructions2").text("Waiting for " + gameObject.name + " to choose");
			//Applay CSS to center instructions1 & 2
			$("#instructions").css("margin-left", "450px");
			$("#instructions").css("margin-right", "20px");
			$("#instructions").css("margin-top", "20px");

			$("#instructions2").css("margin-left", "450px");
			$("#instructions2").css("margin-right", "20px");
			$("#instructions2").css("margin-top", "20px");

			//Display in Textarea
			$("#exampleFormControlTextarea1").text("you are playing against" + gameObject.name + "you can chat here.");

			//Hide waiting for player2
			$(".header2").hide();
			


			//Display Player2's name and append name
			$(".name2").show();
			$(".name2").text(name);

			//Display wins and loses and append total wins and total loses
			$(".win_lose2").show();
			$(".totalWin2").text(gameObject.wins);
			$(".totalLose2").text(gameObject.losses);
			$(".totalTies2").text(gameObject.ties);

			//From Player2's screen hide player1's header show player1's (Name, wins, losses, ties)
			$(".header1").hide();
			$(".name1").show();
			$(".name1").text(gameObject.name);
			$(".win_lose1").show();
			$(".totalWin1").text(gameObject.wins);
			$(".totalLose1").text(gameObject.losses);
			$(".totalTies1").text(gameObject.ties);

		});

		//Update Firebase. Set the turn to 1 so player 1 can pick
		//when turn: 1 we immediately go back to turn.on("value", function(snapshot){}
		data.update(
		{
			turn: 1

		});

		//Update Firebase. THis will cause DOM to change and execute if(snapshot.val() == true) above at
		//data.child("changeDOM").on("value", function(snapshot){ });
		data.update(
		{
			changeDOM: true
		});

		//erases player 2 on disconnect
		player2Ref.onDisconnect().remove();


	}
	else	//both player1 && player2 exist, already full
	{
		alert("sorry the game is full. Try again shortly");
	}

}

//Function for player1 to chooose rock, paper, or scissors
function changeDOM1()
{

	//double check this will only work for player 1 and it is player 1 turn
	if(gameObject.userId == "1")
	{
		player2Ref.once("value", function(snapshot)
		{
			//Obtain the values of the variables in the database
			gameObject.name2 = snapshot.val().name;
			gameObject.wins2 = snapshot.val().wins;
			gameObject.losses2 = snapshot.val().losses;
			gameObject.ties2 = snapshot.val().losses;

			$("#name2").text(gameObject.name2);

			$("#instructions2").text("It is your turn");
			//Use CSS to center 2nd pair of instructions
			$("#instructions2").css("margin-left", "450px");
			$("#instructions2").css("margin-right", "20px");
			$("#instructions2").css("margin-top", "20px");

			$("#exampleFormControlTextarea1").empty()
			$("#exampleFormControlTextarea1").text("you are playing against" + gameObject.name2 + "you can chat here.");
			$("#wins2").text("Wins: " + snapshot.val().wins);
			$("losses2").text("Losses: " + snapshot.val().losses);
			$("#ties2").text("Ties: " + snapshot.val().ties);

		});

		data.update(
		{
			changeDOM: false
		});
	}
}

//function for player1 to choose rock, paper, or scissors
function user1Choose()
{
	//double check this will only work for player 1 and it is player 1 turn
	if(gameObject.userId == "1" && gameObject.turn == 1)
	{
		$("#instructions2").text("It is your turn");
		//Use CSS to center instructions
		$("#instructions2").css("margin-left", "450px");
		$("#instructions2").css("margin-right", "20px");
		$("#instructions2").css("margin-top", "20px");


		//Show Player1's options
		$(".paper1").show();
		$(".rock1").show();
		$(".scissors1").show();
	

		$(".choice").on("click", function()
		{
			//Store click value(rock, paper, or scissors) in player1 gameObject.pick
			gameObject.pick = $(this).attr("pick");
		
			//Update Firebase with player1's pick
			player1Ref.update(
			{
				pick: gameObject.pick

			});

			//update to turn 2 for player 2 to choose rock, paper or scissors
			data.update(
			{
				turn: 2
			});

			//change DOM for player 1
			$("#instructions2").text("Waiting for " + gameObject.name2 + " to choose");
			//Use CSS to center instructions
			$("#instructions2").css("margin-left", "450px");
			$("#instructions2").css("margin-right", "20px");
			$("#instructions2").css("margin-top", "20px");

			//Hide player1 other choices so that only his pick gets displayed
			if(gameObject.pick === "paper")
			{
				$(".rock1").hide();
				$(".scissors1").hide()

				//make choice bold and centered
				$(this).css("font-size", "30px");
        		$(this).css("font-weight", "bold");
        		$(this).css("text-align", "center");

			}
			else if(gameObject.pick === "rock")
			{
				$(".paper1").hide();
				$(".scissors1").hide()

				//make choice bold and centered
				$(this).css("font-size", "30px");
        		$(this).css("font-weight", "bold");
        		$(this).css("text-align", "center");

			}
			else if(gameObject.pick === "scissors")
			{
				$(".paper1").hide();
				$(".rock1").hide()

				//make choice bold and centered
				$(this).css("font-size", "30px");
        		$(this).css("font-weight", "bold");
        		$(this).css("text-align", "center");
			}



	});

    }

}





//Winner Div
function displayWinnerDiv()
{
	var theWinner = $("<div id='winnerContainer'>");
	theWinner.html("<p id='winnerMsg'> <span id='winnerName'> </span> Is the Winner! </p>");

	

	$("#playerContainers").append(theWinner);

}



});	//end of document ready