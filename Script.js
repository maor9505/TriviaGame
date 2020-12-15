let questionsArray = []; // this is a global array that will contain the questions you asked form the mock db function. 
let urlHelper = [];
var type;
var amount;
var catagor;
var difficulty;
var answers = [];
var gameDiv;
var pDiv;
var posQuestion=0;
var score = 0;
var timer = 30;
var countdownTimer;
 var corect;

$(document).ready(function () { 
	getCategories($("#categories"));
	$("#score").hide();
	$("#reset").hide();
	$("#timer").hide();
	$("#question-number").hide();
});

// function start get all the values from the user
async function start(){ 
	$("#option").hide();
	$("#back-btn").hide();
	$("#start-btn").hide();
	amount = document.getElementById("amount").value; 
	catagory = document.getElementById("categories").value;
	difficulty = document.getElementById("level").value;
	type = document.getElementById("type").value;
	if (!checkFills(amount, catagory, difficulty, type))
	{
		questionsArray = await getQuestion(amount, catagory, difficulty, type);
		console.log(questionsArray);
		if (questionsArray.length > 0) 
		{
			createGame();
			$("#score").show();
			$("#reset").show();
			$("#timer").show();
			$("#question-number").show();
		}
		else 
		{
			catagoryTypeInvaild();
		}
	}
}

// function checkFills will check if the user inputs a vaild values
function checkFills(amount,catagory,difficulty,type)
{
	if (amount <= 0 || amount > 20) 
	{
		amountIncorrect();
		return true;
	}
	if (catagory == "null" || difficulty == "null" || type == "null")
	{
		noFill();
		return true;
	}
	return false;
}


// function createGame will create the game from value types
function createGame(){
	var questionBoard = document.getElementById("game");
	//create p for show question
	if (type == "multiple")
	{
		var p = document.createElement("p1");
		p.innerText = "Q";
		p.className="p1";
		questionBoard.appendChild(p);
		// create 4 buttom && p- question 
		for (let i = 0; i < 4; i++) 
		{
			var btn = document.createElement("button");
			btn.innerHTML ="";
			btn.className="btn-answers";
			questionBoard.appendChild(btn);
		}
	}
	else if (type =="boolean")
	{
		var p = document.createElement("p1");
		p.innerText = "Q";
		p.className="p1";
		questionBoard.appendChild(p);
		var btn = document.createElement("button");
		btn.innerHTML = "True";
		questionBoard.appendChild(btn);
		btn.className="btn-answers";
		var btn = document.createElement("button");
		btn.innerHTML = "False";
		questionBoard.appendChild(btn);
		btn.className="btn-answers";
	}
	showQuestion();
}


//function showQuestion handle the questions view
function showQuestion() {
	document.getElementById("question-number").innerText = (posQuestion+1) + "/" + questionsArray.length;
	clearInterval(countdownTimer);
	if (posQuestion == questionsArray.length ) 
	{
		alertNotWin();
	}
	else
	{
		Timer();
	}
	gameDiv = document.getElementById("game").querySelectorAll("button");
	pDiv = document.getElementById("game").querySelectorAll("p1");
	answers=[];
	answers.push(questionsArray[posQuestion].correct_answer);
	for (let i = 0; i < questionsArray[posQuestion].incorrect_answers.length;i++)
	{
		answers.push(questionsArray[posQuestion].incorrect_answers[i]);
	}
	shuffleArrayAnswer(answers);
	pDiv[0].innerHTML = questionsArray[posQuestion].question;
	for (let i = 0; i < answers.length; i++)
	{
		gameDiv[i].innerHTML = answers[i];
		gameDiv[i].setAttribute("onclick", "checkQuestion(" + i + ");");
	}
}

// functions paint... answers 
function paintIfWrong() {
	for (let i = 0; i < answers.length; i++) 
	{
		if (answers[i] == questionsArray[posQuestion].correct_answer)
		{
			return i;
		}
	}
	return -1;
}

function paintCorrectAnswer(i)
{
	gameDiv[i].style.backgroundColor = "green";
	
}

function paintWrongAnswer(i,j)
{
	gameDiv[i].style.backgroundColor = "red";
	gameDiv[j].style.backgroundColor = "green";
}

function clearColor(i,j)
{
	if(corect==true)
	{
		gameDiv[i].style.backgroundColor = "white";
	}
	else
	{
	gameDiv[i].style.backgroundColor = "white";
	gameDiv[j].style.backgroundColor = "white";
	}
}

// function buttonToNull will update arrtibutes of buttons
function buttonToNull()
{
	for(let i=0;i<gameDiv.length;i++)
	{
		gameDiv[i].removeAttribute("onclick");
	}
}

// function checkQuestion will check if the user answer correct or not
 function checkQuestion(i){
	 buttonToNull();
	 console.log(answers[i] );
	 console.log(questionsArray[posQuestion].correct_answer);
	 if (answers[i] == questionsArray[posQuestion].correct_answer)
	 {
		 score += 10;
		 document.getElementById("score").innerText= "Score: " + score;
		 console.log(score);
		 paintCorrectAnswer(i);
		 corect=true;
	 }
	 else
	 {
		 corect=false;
		 paintWrongAnswer(i, paintIfWrong());
	 }
	// delay between answer
	wait(2000).then(() => {
		if (posQuestion+1  == questionsArray.length)
		{
			if (ifWin() == true)
			{
				alertWin();
			}
			else
			{
				alertNotWin();
			}
		}
		else
		{
			clearColor(i, paintIfWrong());
			posQuestion++;
			showQuestion();
		}
		 
	 });
 }

 //function delay program
function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

//function ifWin will check if the user win the game
function  ifWin(){
	  var sumscore = amount*10;
	console.log("score=" + score);

	  console.log("sumscore="+sumscore);
	if(score==sumscore)
	{
		return true;
	}
	return false;
	 
}

//function shuffleArrayAnswer will do random between answers
function shuffleArrayAnswer(array) {
	var currentIndex = array.length, tempvalue, randomIndex;
	while (0 !== currentIndex)
	{
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		tempvalue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = tempvalue;
	}
	return array;
}

// functions alerts... START
function gamerules(rules){
	var btn = document.createElement("BUTTON");
	swal({
		title: "Game Rules:",
		text: "When you ready press set a new game and fill the options and try to beat the challenge\nGood Luck :)",
		icon: "info",
		button: "Back to menu",
	});
}

function catagoryTypeInvaild() {
	var btn = document.createElement("BUTTON");
	swal({
		title: "Missing fields",
		text: "Catagory Type INVAILD\n Try diffrent Type",
		icon: "error",
		button: "Back",
	})
		.then((willDelete) => {
			if (willDelete)
			{
				window.location.replace('game.html');
			}
		});
}

function noFill(){
	var btn = document.createElement("BUTTON");
	swal({
		title: "Missing fields",
		text: "There is one or more empty fields\nPlease fill them all to start a game",
		icon: "error",
		button: "Back",
	})
	.then((willDelete) => {
		if (willDelete)
		{
			window.location.replace('game.html');
		}
	  });
}

function alertWin(){
	var btn = document.createElement("BUTTON");
	swal({
		title: "Win",
		text: "You Are Winner!\nGreat job!",
		icon: "success",
		buttons: ["New Game", "Exit"],
		dangerMode: true,
	})
	.then((willDelete) => {
		if (willDelete) {
			window.location.replace('index.html');
		} else {
			window.location.replace('game.html');
		}
	  });
}


function alertNotWin(){
	var btn = document.createElement("BUTTON");
	swal({
		title: "Try Again!",
		text: "" + score + "/" + (amount * 10)+"",
		icon: "error",
		buttons: ["New Game", "Exit"],
		dangerMode: true,
	})
	.then((willDelete) => {
		if (willDelete) {
			window.location.replace('index.html');
		} else {
			window.location.replace('game.html');

		}
	  });
}

function amountIncorrect(){
	var btn = document.createElement("BUTTON");
	swal({
		title: "ERROR!",
		text: "Amount out of range\nPlease input amount between 1-20",
		icon: "error",
		button: "Back",
	})
	.then((willDelete) => {
		if (willDelete)
		{
			window.location.replace('game.html');
		}
	  });
}
// functions alerts... END

//function Reset will restart the game
 function Reset(){
	 score=0;
	 posQuestion=0;
	 questionsArray = [];
	 $("#score").hide();
	 $("#reset").hide();
	 window.location.replace('game.html');
 }


// function Timer will count down 
function Timer(){
	timer = 30;
    countdownTimer = setInterval(function() {
		document.getElementById('timer').innerText = "Timer:  " + timer;
        timer = timer - 1;
		if (timer <= 0)
		{
			posQuestion += 1;
			showQuestion();
        }
	}, 1000);
}

function getCategories(select) {
    $.ajax({
        url: "https://opentdb.com/api_category.php",
        context: document.body
    }).done(function (data) {
        categories = data.trivia_categories;
        for (i in categories) {
            let cat = categories[i];
            let option = "<option value=" + cat.id + ">" + cat.name + "</option>"
            select.append(option);
		}
		
    });
}
function editUrl(amount, category , difficulty,type){
	urlHelper["amount"]='amount=' + amount;
	urlHelper["category"]='category=' + category;
	urlHelper["difficulty"]='difficulty=' + difficulty;
	urlHelper["type"]='type=' + type;
}
   
async function getQuestion(amount, category , difficulty,type) {
	editUrl(amount, category , difficulty,type);
	var arr= [] ;
    var url = 'https://opentdb.com/api.php?' + urlHelper.amount
            + '&' + urlHelper.category
            + '&' + urlHelper.difficulty
            + '&' + urlHelper.type
			
	var res = await fetch(url);
	var data = await res.json();
	return data.results;
}
