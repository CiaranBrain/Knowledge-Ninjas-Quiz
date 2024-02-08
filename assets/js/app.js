const startBtn = document.getElementById('start-btn');
const difficultySelect = document.getElementById('difficulty');
const quizContainer = document.getElementById('quiz-container');
const quizContent = document.getElementById('quiz-content');
const questionNumber = document.getElementById('question-number');
const scoreContainer = document.getElementById('score-container');
const resultsPage = document.getElementById('results-page');
const finalScore = document.getElementById('final-score');

// api array for quiz questions at all difficulties 
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
async function fetchData(difficulty) {
  try {
    const url = apiArray[difficulty].url;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    quizData = data.results;
    displayCurrentQuestion();
  } catch (error) {
    console.error("Could not fetch quiz data:", error);
  }
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
  resetQuiz()
  const difficulty = document.getElementById('difficulty').value;
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
  // Hide quiz content and start section
  document.getElementById("quiz-content").style.display = "none";
  document.getElementById("start-section").style.display = "none";
  
  // Show the results page
  document.getElementById("results-page").style.display = "block";
  
  // Update final score display
  document.getElementById("final-score").innerHTML = `Your final score = ${score}/${quizData.length}`;
}


  // Reset Quiz Function
function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  updateScore();
  document.getElementById("question-number").textContent = "";
}

// fetchData("easy");
// fetchData("medium");
// fetchData("hard");