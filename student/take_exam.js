document.addEventListener("DOMContentLoaded", () => {
  const examTitleEl = document.getElementById("exam-title");
  const questionTextEl = document.getElementById("question-text");
  const questionImageEl = document.getElementById("question-image");
  const questionCounterEl = document.getElementById("question-counter");
  const optionsContainerEl = document.getElementById("options-container");
  const nextBtn = document.getElementById("next-btn");
  const timerBarEl = document.getElementById("timer-bar");
  const examContainer = document.getElementById("exam-container");
  const resultContainer = document.getElementById("result-container");
  const finalScoreEl = document.getElementById("final-score");

  const exams = JSON.parse(localStorage.getItem("exams")) || [];
  const student = JSON.parse(localStorage.getItem("logged_in_student"));
  const studentExams = JSON.parse(localStorage.getItem("student_exam")) || [];

  const urlParams = new URLSearchParams(window.location.search);
  const examId = parseInt(urlParams.get("examId"));
  const exam = exams.find((e) => e.examId === examId);

  if (!student) {
    alert("You are not logged in. Please login first.");
    window.location.href = "../auth/login.html";
    return;
  }

  if (!exam) {
    alert("Exam not found.");
    window.location.href = "student_dashboard.html";
    return;
  }

  const hasTakenExam = studentExams.some(
    (se) => se.studentId === student.id && se.examId === exam.examId
  );
  if (hasTakenExam) {
    alert("You have already taken this exam.");
    window.location.href = "student_dashboard.html";
    return;
  }

  let currentQuestionIndex = 0;
  let score = 0;
  let questionTimer;
  let randomizedQuestions;

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function startExam() {
    examTitleEl.textContent = exam.name;
    randomizedQuestions = shuffleArray([...exam.questions]);
    renderQuestion();
  }

  function renderQuestion() {
    if (currentQuestionIndex >= randomizedQuestions.length) {
      endExam();
      return;
    }

    const question = randomizedQuestions[currentQuestionIndex];
    questionTextEl.textContent = question.text;
    questionCounterEl.textContent = `Question ${currentQuestionIndex + 1} / ${
      randomizedQuestions.length
    }`;

    if (question.imageUrl) {
      questionImageEl.src = question.imageUrl;
      questionImageEl.style.display = "block";
    } else {
      questionImageEl.style.display = "none";
    }

    optionsContainerEl.innerHTML = "";
    nextBtn.disabled = true;

    const randomizedOptions = shuffleArray(
      question.options.map((option, index) => ({ option, index }))
    );

    randomizedOptions.forEach(({ option, index }) => {
      const button = document.createElement("button");
      button.className = "btn btn-outline-primary";
      button.textContent = option;
      button.addEventListener("click", () => selectAnswer(button, index));
      optionsContainerEl.appendChild(button);
    });

    startQuestionTimer();
  }

  function startQuestionTimer() {
    const questionTime = (exam.examDuration * 60) / exam.totalQuestions;
    let timeLeft = questionTime;
    timerBarEl.style.width = "100%";
    timerBarEl.classList.remove("bg-danger");

    clearInterval(questionTimer);
    questionTimer = setInterval(() => {
      timeLeft--;
      const percentage = (timeLeft / questionTime) * 100;
      timerBarEl.style.width = `${percentage}%`;

      if (timeLeft <= 10) {
        timerBarEl.classList.add("bg-danger");
      }

      if (timeLeft <= 0) {
        clearInterval(questionTimer);
        // Mark as incorrect and move to next question
        handleAnswer(false);
      }
    }, 1000);
  }

  function selectAnswer(selectedButton, selectedOptionIndex) {
    clearInterval(questionTimer);
    const question = randomizedQuestions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === question.correctAnswer;

    Array.from(optionsContainerEl.children).forEach((button, index) => {
      button.disabled = true;
      const optionIndex = randomizedQuestions[
        currentQuestionIndex
      ].options.indexOf(button.textContent);
      if (optionIndex === question.correctAnswer) {
        button.classList.add("correct");
      } else {
        button.classList.add("incorrect");
      }
    });

    if (isCorrect) {
      score += question.score;
    }

    nextBtn.disabled = false;
  }

  function handleAnswer(isCorrect) {
    if (isCorrect) {
      const question = randomizedQuestions[currentQuestionIndex];
      score += question.score;
    }

    Array.from(optionsContainerEl.children).forEach((button) => {
      button.disabled = true;
    });

    nextBtn.disabled = false;
    nextBtn.click();
  }

  function endExam() {
    const finalPercentage = (score / 100) * 100;
    finalScoreEl.textContent = finalPercentage.toFixed(2);
    examContainer.style.display = "none";
    resultContainer.style.display = "block";

    const newResult = {
      id: Date.now(),
      studentId: student.id,
      examId: exam.examId,
      score: finalPercentage,
      dateTaken: new Date().toISOString(),
      answers: [], // Can be extended to store answers
    };

    studentExams.push(newResult);
    localStorage.setItem("student_exam", JSON.stringify(studentExams));
  }

  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    renderQuestion();
  });

  startExam();
});
