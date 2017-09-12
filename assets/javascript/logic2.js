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

  var data = database.ref("data");		//player
  var turn = data.child("turn");
  var playersRef = data.child("data");
  var player1Ref = playersRef.child("1");
  var player2Ref = playersRef.child("2");


//Global Variables
var playerDiv;
var totalWins = 0;
var totalLosses = 0;

var player1Exists;
var player2Exists;
var changeDOM;
var name;

var click = 100;

//Used as index tecnique to know <div> container to show player name when obtaining
//the name from the textbox.
var playerPos = 0;


//store player 1 & player 2 choice in database
var choice;









//create 3 divs Player1, Winner is, Player 2
for(var i = 0; i < 2; i++)
{
	//create an empty div each with a distinct id
	playerDiv = $("<div id='box" + i + "'>");

	//give each player a class
	playerDiv.addClass("playerContainer");

	//give each player an wins & loses attribute
	playerDiv.attr("Wins", totalWins);
	playerDiv.attr("Losses", totalLosses);

	//Use id's so we can display certain data inside our div container at the right moment
	//NOTE: use (animate.show() ) to unhide data inside div container.
	var p = $("<p>");
	p.html("<p class='header" + i + "'> Waiting for player" + (i+1) + "</p>");



	//Dispaly name that was entered in the textbox as soon ass we hit (submit)
	var p2 = $("<p>");
	p2.html("<p class='name name" + i + "'>  </p>");



	//PAPER
	var paper = $("<p>");

	//This allows us to know which paper we clicked on since we have 2 palyers that contain
	//paper choice so using class will help us know which player selected that choice.
	paper.addClass("paperClass");

	//give (paper) div a value which is used to display on screen player1 or player2's choice	
	paper.attr("value", "paper");

	//Use index so when we select paper we know which index or player we're on so we hide only the other
	//choices(rock, and scissors) to display only paper for that particular player(on his turn)
	paper.attr("index", i);

	//display choice that we click on
	paper.html("<p class='paper" + i + "'> Paper </p>");



	//ROCK
	var rock = $("<p>");

	//This allows us to know which paper we clicked on since we have 2 palyers that contain
	//rock choice so using class will help us know which player selected that choice.
	rock.addClass("rockClass");

	//give (rock) div a value which is used to display on screen player1 or player2's choice	
	rock.attr("value", "rock");

	//Use index so when we select paper we know which index or player we're on so we hide only the other
	//choices(paper, and scissors) to display only paper for that particular player(on his turn)
	rock.attr("index", i);

	//Display choice that we click on
	rock.html("<p class='rock" + i + "'> Rock </p>");



	//SCISSORS
	var scissors = $("<p>");

	//This allows us to know which paper we clicked on since we have 2 palyers that contain
	//scissors choice so using class will help us know which player selected that choice.
	scissors.addClass("scissorsClass");

	//give (scissors) div a value which is used to display on screen player1 or player2's choice	
	scissors.attr("value", "scissors");

	//Use index so when we select paper we know which index or player we're on so we hide only the other
	//choices(paper, and scissors) to display only paper for that particular player(on his turn)
	scissors.attr("index", i);

	//display choice that we click on
	scissors.html("<p  class='scissors" + i + "'> Scissors </p>");




	//Display Each player wins & loses
	var totalWinsLoses = $("<p>");
	totalWinsLoses = ("<p class='win_lose" + i + "'> Wins: <span id = 'totalWin" + i + "'>  </span> Loses: <span id='totalLose" + i + "'>  </span> </p>");


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
	if(i === 0)
	{
		displayWinnerDiv();
	}
	

}

//Winner Div
function displayWinnerDiv()
{
	var theWinner = $("<div id='winnerContainer'>");
	theWinner.html("<p id='winnerMsg'> <span id='winnerName'> </span> Is the Winner! </p>");

	

	$("#playerContainers").append(theWinner);

}



//Paper: Where Player 1 or player 2 selects a choice: PAPER which gets display on the screen and we hide the 2 remaining choices
//NOTE: we use class(paperClass) to know which player div we are inside of. Hide rest of choices once player makes selectoin.
$(".paperClass").on("click", function()
{

		//use global variable so we can store what player selected in database
		 choice = $(this).attr("value");
		 				//OR
		 //use attr for $(box0) && $(box1)

		//use index value so we only hide choices of a particular player div
		var index = $(this).attr("index");

        //Hide the other choices through attr(Index) to know which player or player div we are
        //currently on. This will Display Paper only
        $(".rock" + index).hide();
        $(".scissors" + index).hide();

        //Make player's choice font size bigger, bolded, and centered
        $(this).css("font-size", "30px");
        $(this).css("font-weight", "bold");
        $(this).css("text-align", "center");


});

//Rock: Where Player 1 or player 2 selects a choice: ROCK which gets display on the screen and we hide the 2 remaining choices
//NOTE: we use class(paperClass) to know which player div we are inside of. Hide rest of choices once player makes selectoin.
$(".rockClass").on("click", function()
{

		//use global variable so we can store what player selected in database
		 choice = $(this).attr("value");

		//use index value so we only hide choices of a particular player div
		var index = $(this).attr("index");

        //Hide the other choices through attr(Index) to know which player or player div we are
        //currently on. This will Display Paper only
        $(".paper" + index).hide();
        $(".scissors" + index).hide();

        //Make player's choice font size bigger, bolded, and centered
        $(this).css("font-size", "30px");
        $(this).css("font-weight", "bold");
        $(this).css("text-align", "center");


});

//Scissors: Where Player 1 or player 2 selects a choice: SCISSORS which gets display on the screen and we hide the 2 remaining choices
//NOTE: we use class(paperClass) to know which player div we are inside of. Hide rest of choices once player makes selectoin.
$(".scissorsClass").on("click", function()
{

		//use global variable so we can store what player selected in database
		 choice = $(this).attr("value");

		//use index value so we only hide choices of a particular player div
		var index = $(this).attr("index");

        //Hide the other choices through attr(Index) to know which player or player div we are
        //currently on. This will Display Paper only
        $(".paper" + index).hide();
        $(".rock" + index).hide();

        //Make player's choice font size bigger, bolded, and centered
        $(this).css("font-size", "30px");
        $(this).css("font-weight", "bold");
        $(this).css("text-align", "center");


});


//Click [Start] button hide both (waiting for player 1/2), then display player name for
//each player (div) box, meaning dipslaying player1 name & player2 name
$("#button1").on("click", function()
{
	//Prevent refresh
	event.preventDefault();

	//Giv playerDiv attribute name & obtain value in textbox and store in playerName
	$("#box" + playerPos).attr("playerName", $("#inputPlayer").val().trim());
	


	//Give playerDiv attribute anme & obtain value in textbox and sotre in "playerName"
	//We use global Var(playerPos) to know which player's name to display at a particular div.
	//Also cneter each name inside player div
	var currentPlayerName = $("#box" + playerPos).attr("playerName");
	$(".name" + playerPos).text(currentPlayerName);
	$(".name" + playerPos).css("text-align", "center");


	//now hide waiting for player 1 & 2 and display each player's name
	$(".header" + playerPos).hide();
	$(".name" + playerPos).show();

	

	//Show current Win: Loses: for particular player
	$(".win_lose" + playerPos).show();
	$(".win_lose" + playerPos).css("text-align", "center");



	//Store Data inside (player/ 1) && (player / 2) database
	database.ref("players/" + (playerPos+1)).set( 
  	{

    	totalLosses: $("#box" + playerPos).attr("Losses"),
    	totalWins: $("#box" + playerPos).attr("Wins"),
    	name: currentPlayerName
    	

  	});



	//reset variable once reached player2 since we don't want player3 to have a turn
	if(playerPos === 1)
	{
		//call reset function
		resetPlayerPos();
	}
	else
	{
		//incrmeent (playerPos) for player2 div
		playerPos++;
	}

	

});




//Reset playerPos variable when we've reached index 1 or player 2 in order to continue to 
//use it for player 1 and 2. 0 = player1 	1 = player2
function resetPlayerPos()
{

	playerPos = 0;


}




