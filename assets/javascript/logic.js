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
	player2Exists = snapshot.child("players").child("2").exists();	//player2Ref


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
			$("#exampleFormControlTextarea1").text("you are playing against " + gameObject.name + " you can chat here.");

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

			//Display Player2's name from Player1's screen as soon as Player1 can make a choice
			$(".name2").show();
			$(".name2").text(gameObject.name2);

			$("#instructions2").text("It is your turn");
			//Use CSS to center 2nd pair of instructions
			$("#instructions2").css("margin-left", "450px");
			$("#instructions2").css("margin-right", "20px");
			$("#instructions2").css("margin-top", "20px");

			$("#exampleFormControlTextarea1").empty()
			$("#exampleFormControlTextarea1").text("you are playing against " + gameObject.name2 + " you can chat here.");
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
//Executes when turn: 1 / gameObject1.turn = 1
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


		//Hide waiting for player2 from player1's DOM
		$(".header2").hide();

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

//Functino for player 2 to choose rock, paper, or scissors,. Called from turn.on() function
function user2Choose()
{


	//double check this will only work for player 2 and it is player2's turn
	if(gameObject.userId == "2" && gameObject.turn == 2)
	{
		$("#instructions2").text("It is your turn");
		//Use CSS to center instructions
		$("#instructions2").css("margin-left", "450px");
		$("#instructions2").css("margin-right", "20px");
		$("#instructions2").css("margin-top", "20px");

		//Show Player1's options
		$(".paper2").show();
		$(".rock2").show();
		$(".scissors2").show();

		$(".choice").on("click", function()
		{
			//Store click value(rock, paper, or scissors) in player2 gameObject.pick2
			gameObject.pick2 = $(this).attr("pick");
			console.log(gameObject.pick2);

			//update Firebase with Player2's pick
			player2Ref.update(
			{
				pick: gameObject.pick2

			});

			//change the turn to 3 to trigger the logic funciton
			data.update(
			{
				turn: 3

			});

			//Hide player2 other choices so that only his pick gets displayed
			if(gameObject.pick2 === "paper")
			{
				$(".rock2").hide();
				$(".scissors2").hide()

				//make choice bold and centered
				$(this).css("font-size", "30px");
        		$(this).css("font-weight", "bold");
        		$(this).css("text-align", "center");

			}
			else if(gameObject.pick2 === "rock")
			{
				$(".paper2").hide();
				$(".scissors2").hide()

				//make choice bold and centered
				$(this).css("font-size", "30px");
        		$(this).css("font-weight", "bold");
        		$(this).css("text-align", "center");

			}
			else if(gameObject.pick2 === "scissors")
			{
				$(".paper2").hide();
				$(".rock2").hide()

				//make choice bold and centered
				$(this).css("font-size", "30px");
        		$(this).css("font-weight", "bold");
        		$(this).css("text-align", "center");
			}


		});
	}
}

//Check for winner
function checkWinner()
{
	//ensure it is turn 3
	if(gameObject.turn == 3)
	{

		//player1 changes the turn to 0 so the function only runs once
		//only user1 does this because if both users do it , then would mess up the order
		if(gameObject.userId == "1")
		{
			data.update
			{
				turn: 0
			}
		}

		playersRef.once("value", function(snapshot)
		{
			//obtain values from Firebase
			var p1 = snapshot.child("1").val().pick;
			var p2 = snapshot.child("2").val().pick;

			//9 possible combinations of 2 player choices
			if(p1 == "paper" && p2 == "paper" )			//Tie
    		{

    			//Display Tie inside WiinderDiv
    			$("#winnerMsg").show();
    			$("#winnerMsg").text("Tie");

    			//increment tie for player1
    			gameObject.ties++;

    			//store Player1 ties inside Firebase
    			player1Ref.update(
    			{
    				ties: gameObject.ties
    			});

    			//increment tie for player2
    			gameObject.ties2++;

    			//store Player2 ties inside Firebase
    			player2Ref.update(
    			{
    				ties: gameObject.ties2
    			});

    		
    		}
    		else if(p1 == "paper" && p2 == "rock")
    		{
    	    	//Player1 wins
    			$("#winnerMsg").show();
    			$("#winnerMsg").text(snapshot.child("2").val().name + " Wins!");

    			//increment player1 wins
    			gameObject.wins++;

    			//Update firebase
    			player1Ref.update(
    			{
    				wins: gameObject.wins
    			});

    			//increment player2 losses
    			gameObject.losses2++;

    			//Update firebase
    			player2Ref.update(
    			{
    				losses: gameObject.losses2
    			});
    		}
    		else if(p1 == "paper" && p2 == "scissors")
    		{
    			//Player 2 Wins
    			$("#winnerMsg").show();
    			$("#winnerMsg").text(snapshot.child("2").val().name + " Wins!");				//Retrives Player 2 info from Firebase

    			//increment player1 losses
    			gameObject.losses++;

    			//Update firebase
    			player1Ref.update(
    			{
    				losses: gameObject.losses
    			});

    			//increment player2 wins
    			gameObject.wins2++;

    			//Update firebase
    			player2Ref.update(
    			{
    				wins: gameObject.wins2
    			});

    		}
    		else if(p1 == "rock" && p2 == "rock")
    		{
    			//Tie
    			$("#winnerMsg").show();
    			$("#winnerMsg").text("Tie");

    			//increment tie for player1
    			gameObject.ties++;

    			//store Player1 ties inside Firebase
    			player1Ref.update(
    			{
    				ties: gameObject.ties
    			});

    			//increment tie for player2
    			gameObject.ties2++;

    			//store Player2 ties inside Firebase
    			player2Ref.update(
    			{
    				ties: gameObject.ties2
    			});

    			
    		}
    		else if(p1 == "rock" && p2 == "paper")
    		{
    			//Player2 Wins
    			$("#winnerMsg").show();
    			$("#winnerMsg").text(snapshot.child("2").val().name + " Wins!");

    			//increment player1 losses
    			gameObject.losses++;

    			//Update firebase
    			player1Ref.update(
    			{
    				losses: gameObject.losses
    			});

    			//increment player2 wins
    			gameObject.wins2++;

    			//Update firebase
    			player2Ref.update(
    			{
    				wins: gameObject.wins2
    			});
    		}
    		else if(p1 == "rock" && p2 == "scissors")
    		{
    			//Player1 wins
    			$("#winnerMsg").show();
    			$("#winnerMsg").text(snapshot.child("1").val().name + " Wins!");

    			//increment player1 wins
    			gameObject.wins++;

    			//Update firebase
    			player1Ref.update(
    			{
    				wins: gameObject.wins
    			});

    			//increment player2 losses
    			gameObject.losses2++;

    			//Update firebase
    			player2Ref.update(
    			{
    				losses: gameObject.losses2
    			});
    		}
    		else if(p1 == "scissors" && p2 == "rock")
    		{
    			//Player 2 Wins
    			$("#winnerMsg").show();
    			$("#winnerMsg").text(snapshot.child("2").val().name + " Wins!");				//Retrives Player 2 info from Firebase

    			//increment player1 losses
    			gameObject.losses++;

    			//Update firebase
    			player1Ref.update(
    			{
    				losses: gameObject.losses
    			});

    			//increment player2 wins
    			gameObject.wins2++;

    			//Update firebase
    			player2Ref.update(
    			{
    				wins: gameObject.wins2
    			});
    		}
    		else if(p1 == "scissors" && p2 == "paper")
    		{
    			
    			//Player1 wins
    			$("#winnerMsg").show();
    			$("#winnerMsg").text(snapshot.child("1").val().name + " Wins!");

    			//increment player1 wins
    			gameObject.wins++;

    			//Update firebase
    			player1Ref.update(
    			{
    				wins: gameObject.wins
    			});

    			//increment player2 losses
    			gameObject.losses2++;

    			//Update firebase
    			player2Ref.update(
    			{
    				losses: gameObject.losses2
    			});
    		}
    		else if(p1 == "scissors" && p2 == "scissors")
    		{
    			//Tie
    			$("#winnerMsg").show();
    			$("#winnerMsg").text("Tie");

    			//increment tie for player1
    			gameObject.ties++;

    			//store Player1 ties inside Firebase
    			player1Ref.update(
    			{
    				ties: gameObject.ties
    			});

    			//increment tie for player2
    			gameObject.ties2++;

    			//store Player2 ties inside Firebase
    			player2Ref.update(
    			{
    				ties: gameObject.ties2
    			});
    		
    		}

    		//Change Dom for Both Players which displays current (Wins, Losses, Ties)
    		//for both Player1 && Player2
    		
    		//Player1
    		$(".totalWin1").text(gameObject.wins);
    		$(".totalLose1").text(gameObject.losses);
    		$(".totalTies1").text(gameObject.ties);

    		//Player2
    		$(".totalWin2").text(gameObject.wins2);
    		$(".totalLose2").text(gameObject.losses2);
    		$(".totalTies2").text(gameObject.ties2);

    		//Wait 3 seconds and reset game so Player 1 can choose
    		setTimeout(reset, 3000)


		});
	}


}

//resets everything so that we go back to Player1 to make a choice but maintain current score
function reset()
{
										//Player1(Reset Choice Selection)
	//PAPER(Player1): Unbold choice "paper" and realign to the left when user makes choice again
	$(".paper1").css("font-size", "20px");
    $(".paper1").css("font-weight", "normal");
    $(".paper1").css("text-align", "left");

    //Rock(Player1): Unbold choice "rock" and realign to the left when user makes choice again
	$(".rock1").css("font-size", "20px");
    $(".rock1").css("font-weight", "normal");
    $(".rock1").css("text-align", "left");

    //Rock(Player1): Unbold choice "scissors" and realign to the left when user makes choice again
	$(".scissors1").css("font-size", "20px");
    $(".scissors1").css("font-weight", "normal");
    $(".scissors1").css("text-align", "left");


    									//Player2(Reset Choice Selection)
	//PAPER(Player2): Unbold choice "paper" and realign to the left when user makes choice again
	$(".paper2").css("font-size", "20px");
    $(".paper2").css("font-weight", "normal");
    $(".paper2").css("text-align", "left");

    //Rock(Player1): Unbold choice "rock" and realign to the left when user makes choice again
	$(".rock2").css("font-size", "20px");
    $(".rock2").css("font-weight", "normal");
    $(".rock2").css("text-align", "left");

    //Rock(Player1): Unbold choice "scissors" and realign to the left when user makes choice again
	$(".scissors2").css("font-size", "20px");
    $(".scissors2").css("font-weight", "normal");
    $(".scissors2").css("text-align", "left");

	//Changes turn = 1 for both paler 1 and player2 so gameObject.turn = 1 on both DOMS
	data.update(
	{
		turn: 1

	});

	//Clear Winner Div and hide
	$("#winnerMsg").hide();
    $("#winnerMsg").text("");

    //Changes the DOM for Player 2, Player 1's DOM is changed by the user1Choose function which is called since the turn is set back to 1
    if(gameObject.userId == "2")
    {
    	//clear choices (Rock, Paper, Scissors) for Player 2 since it's player1's turn
    	$(".paper2").hide();
		$(".rock2").hide();
		$(".scissors2").hide();

		//change DOM for player 1
		$("#instructions2").text("Waiting for " + gameObject.name + " to choose");
		//Use CSS to center instructions
		$("#instructions2").css("margin-left", "450px");
		$("#instructions2").css("margin-right", "20px");
		$("#instructions2").css("margin-top", "20px");
    }

    //ensures that neither player disconnects during the timeout, if one does the turn is set to 0 until a new player is added so that the user1Choose function is not called
    playersRef.once("value", function(snapshot)
    {

    	//Checks the total number of current players and 
    	//ensures that we still have 2 players in the game
    	if(snapshot.numChildren() != 2)
    	{
    		data.update(
    		{
    			turn: 0
    		});
    	}
    });
}

//on click for the chat submit button that runs sendChat function
$("#send-button").on("click", function()
{
	var chat = $("#exampleFormControlInput1").val();

	//function
	sendChat(chat);

	$("#chat").val('');		//clear textfield each time we click [Submit]

	return false;
});

//fucntion to send chat to firebase, only works if two users are present
function sendChat(chat)
{
	if(player1Exists && player2Exists)
	{
		//Player1 sends a message
		if(gameObject.userId == "1")
		{
			//Firebase
			//NOTE: data.child("chat) creates a new child root called "chat" derived from parent root(data)
			data.child("chat").push(
			{
				message: gameObject.name + ": " + chat
			});

			//refer to textarea for chat
			var log = $("#exampleFormControlTextarea1");

			//add scroll bar to ("#exampleFormControlTextarea1") when text between Player1 & 2 we reached the bottom
			log.animate(
			{
				scrollTop: log.prop("scrollHeight")
			}, 1000);
		}
		else if(gameObject.userId == "2")
		{

			//Firebase
			//NOTE: data.child("chat) creates a new child root called "chat" derived from parent root(data)
			data.child("chat").push(
			{
				message: gameObject.name2 + ": " + chat
			});

			//refer to textarea for chat
			var log = $("#exampleFormControlTextarea1");

			//add scroll bar to ("#exampleFormControlTextarea1") when text between Player1 & 2 we reached the bottom
			log.animate(
			{
				scrollTop: log.prop("scrollHeight")
			}, 1000);

		}
		else
		{
			return;
		}
	}

}

//updates the chat-window(#exampleFormControlTextarea1) each time a new child is pushed to firebase
data.child("chat").on("value", function(snapshot)
{
	//Prevents displaying previous message or prevents duplicats displaying in Textarea(chat window)
	$("#exampleFormControlTextarea1").empty();

	//For EAch player screen display message on both player DOM or screen
	snapshot.forEach(function(childSnap)
	{
		if(gameObject.userId == "1" || gameObject.userId == "2")
		{
			//This actually appends messages on the screen by obtaining
			//The (message) firebase variable and displaying it in (#exampleFormControlTextarea1)
			var p = $("<p>");
			p.text(childSnap.val().message);	//obtain from Firebase
			$("#exampleFormControlTextarea1").append(p);
		}
	});
});


//Winner Div
function displayWinnerDiv()
{
	var theWinner = $("<div id='winnerContainer'>");
	theWinner.html("<p id='winnerMsg'> <span id='winnerName'> </span> Is the Winner! </p>");

	

	$("#playerContainers").append(theWinner);

}



});	//end of document ready