const correctScoreElement = document.getElementById('correct-score');
const totalQuestionsElement = document.getElementById('total-questions');
const questionElement = document.getElementById('Question');
const answerButtons = document.querySelectorAll('.btn');
const checkAnswerButton = document.getElementById('check-answer');
const playAgainButton = document.getElementById('play-again');

let correctAnswer ="", correctScore =askedCount =0, totalQuestion =20;
const apiArray = {
  easy: {
    url: "https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple"
  },
  medium: {
    url: "https://opentdb.com/api.php?amount=20&category=9&difficulty=medium&type=multiple"
  },
  hard: {
    url: "https://opentdb.com/api.php?amount=20&category=9&difficulty=hard&type=multiple"
  },
};

//Variables which change
let currentQuestionIndex = 0;
let quizData;
let score = 0;

// fetching difficulty function (might need to use async b4 function and try after)
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
      quizData = data.results;
      displayCurrentQuestion();
    })
    .catch((error) => console.error("Could not fetch quiz data:", error));
}

// Display current question function (should have broken into more smaller functions)
function displayCurrentQuestion() {
  const quizContent = document.getElementById("quiz-content");
  const questionNumber = document.getElementById("question-number");

  // Clear previous contents
  quizContent.innerHTML = "";
  const currentQuestion = quizData[currentQuestionIndex];
  questionNumber.textContent = `Question ${currentQuestionIndex + 1}`;

  // Displays question and answer options
  const questionContainer = document.createElement('div');
  const questionParagraph = document.createElement('p');
  questionParagraph.textContent = currentQuestion.question;

  const optionsList = document.createElement('ul');
  optionsList.classList.add('options-list');

  // Function to handle answer selection
  function handleAnswerSelection(answer) {
    selectAnswer(answer);
    // Move to the next question (change 500 to slow now clicking)
    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizData.length) {
        displayCurrentQuestion();
      } else {
        endQuiz();
      }
    }, 500);
  }

  currentQuestion.incorrect_answers.forEach(incorrectAnswer => {
    const optionItem = document.createElement('li');
    optionItem.textContent = incorrectAnswer;
    optionItem.addEventListener('click', () => handleAnswerSelection(incorrectAnswer));
    optionsList.appendChild(optionItem);
  });

  const correctAnswerItem = document.createElement('li');
  correctAnswerItem.textContent = currentQuestion.correct_answer;
  correctAnswerItem.addEventListener('click', () => {
    handleAnswerSelection(currentQuestion.correct_answer);

    score++
    updateScore();
  });
  optionsList.appendChild(correctAnswerItem);
  questionContainer.appendChild(questionParagraph);
  questionContainer.appendChild(optionsList);
  quizContent.appendChild(questionContainer);
}
//end of display current question function!!!

// Function to handle answer selection - doesnt allow you to continue without this?
function selectAnswer(selectedAnswer) {
  console.log(`Selected answer: ${selectedAnswer}`);
}

// start quiz function
function startQuiz() {
  restetQuiz()
  const difficulty = document.getElementById('difficulty').ariaValueMax;
  fetchData(difficulty);
  //removes difficulty selector from the window once clicked
  document.getElementById('start-section').style.display = 'none';
}

// update scoring here
function updateScore() {
  const scoreContainer = document.getElementById('score-container');
  scoreContainer.textContent = `Score: ${score}`;
}

// End Quiz function --- needs changed!!
function endQuiz() {
  alert(`Quiz Finsined! Your Final Score was ${score}/${quizData.length}`);
}

// fetchData("easy");
// fetchData("medium");
// fetchData("hard");