const correctScoreElement = document.getElementById('correct-score');
const totalQuestionsElement = document.getElementById('total-questions');
const questionElement = document.getElementById('Question');
const answerButtons = document.querySelectorAll('.btn');
const checkAnswerButton = document.getElementById('check-answer');
const playAgainButton = document.getElementById('play-again');

let correctAnswer ="", correctScore =askedCount =0, totalQuestion =20;
const apiArray = {
    easy: {
      url: "https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple",
     
    },
    medium: {
      url: "https://opentdb.com/api.php?amount=20&category=9&difficulty=medium&type=multiple",
    
    },
    hard: {
      url: "https://opentdb.com/api.php?amount=20&category=9&difficulty=hard&type=multiple",
      
    },
  };
  
  function fetchData(difficulty) {
    const url = apiArray[difficulty].url;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else if (response.status === 429) {
          console.log("You've made too many requests in a short period.");
          return;
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // Process your data and update the DOM here
        displayQuiz(data);
      })
      .catch((error) => console.error("Could not fetch quiz data:", error));
  }
  function displayQuiz(data) {
    const quizContent = document.getElementById("quiz-content");
    quizContent.innerHTML = ""; // Clear previous contents
    // Example: Display the questions or data in 'quiz-content' div
    // This is a very basic way to display the questions. Adjust according to your needs.
    data.results.forEach((item, index) => {
      quizContent.innerHTML += `<p>Q${index + 1}: ${item.question}</p>`;
    });
  }
  
  fetchData("easy");
  fetchData("medium");
  fetchData("hard");

  // event listeners
function eventListeners(){
  _checkBtn.addEventListener('click', checkAnswer);
  _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
  loadQuestion();
  eventListeners();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});


// display question and options
function showQuestion(data){
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);


  
  _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
  _options.innerHTML = `
      ${optionsList.map((option, index) => `
          <li> ${index + 1}. <span>${option}</span> </li>
      `).join('')}
  `;
  selectOption();
}


// options selection
function selectOption(){
  _options.querySelectorAll('li').forEach(function(option){
      option.addEventListener('click', function(){
          if(_options.querySelector('.selected')){
              const activeOption = _options.querySelector('.selected');
              activeOption.classList.remove('selected');
          }
          option.classList.add('selected');
      });
  });
}

// answer checking
function checkAnswer(){
  _checkBtn.disabled = true;
  if(_options.querySelector('.selected')){
      let selectedAnswer = _options.querySelector('.selected span').textContent;
      if(selectedAnswer == HTMLDecode(correctAnswer)){
          correctScore++;
          _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
      } else {
          _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
      }
      checkCount();
  } else {
      _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
      _checkBtn.disabled = false;
  }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}


function checkCount(){
  askedCount++;
  setCount();
  if(askedCount == totalQuestion){
      setTimeout(function(){
          console.log("");
      }, 5000);


      _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
      _playAgainBtn.style.display = "block";
      _checkBtn.style.display = "none";
  } else {
      setTimeout(function(){
          loadQuestion();
      }, 300);
  }
}

function setCount(){
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}


function restartQuiz(){
  correctScore = askedCount = 0;
  _playAgainBtn.style.display = "none";
  _checkBtn.style.display = "block";
  _checkBtn.disabled = false;
  setCount();
  loadQuestion();
}


  