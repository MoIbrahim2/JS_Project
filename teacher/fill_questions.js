document.addEventListener("DOMContentLoaded", () => {
  const examTitleEl = document.getElementById("exam-title");
  const questionCounterEl = document.getElementById("question-counter");
  const questionForm = document.getElementById("question-form");
  const questionTextEl = document.getElementById("question-text");
  const optionsContainerEl = document.getElementById("options-container");
  const addOptionBtn = document.getElementById("add-option-btn");
  const correctAnswerEl = document.getElementById("correct-answer");
  const questionScoreEl = document.getElementById("question-score");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let currentQuestionIndex = 0;
  let isUpdate = false;
  let examData;

  const examForUpdate = JSON.parse(
    localStorage.getItem("currentExamForUpdate")
  );

  if (examForUpdate) {
    isUpdate = true;
    examData = examForUpdate;
    // To prevent issues on reload, we'll work with a temporary setup item
    localStorage.setItem("currentExamSetup", JSON.stringify(examData));
    localStorage.removeItem("currentExamForUpdate");
  } else {
    examData = JSON.parse(localStorage.getItem("currentExamSetup"));
  }

  if (!examData) {
    alert("No exam data found. Please create an exam first.");
    window.location.href = "teacher_dashboard.html";
    return;
  }

  // Ensure questions array exists and has the correct length
  if (!examData.questions) {
    examData.questions = [];
  }
  // This ensures that we can fill questions up to the total number, even if they don't exist yet.
  while (examData.questions.length < examData.totalQuestions) {
    examData.questions.push({});
  }

  // Initialize with at least two options
  addOption();
  addOption();

  function renderQuestion(index) {
    examTitleEl.textContent = `${examData.name}`;
    questionCounterEl.textContent = `Question ${index + 1} / ${
      examData.totalQuestions
    }`;

    // Clear previous state
    questionTextEl.value = "";
    optionsContainerEl.innerHTML = "";
    correctAnswerEl.innerHTML = "";
    questionScoreEl.value = "";
    addOption(); // Add first two default options
    addOption();

    const question = examData.questions[index];
    if (question) {
      questionTextEl.value = question.text || "";
      questionScoreEl.value = question.score || "";
      // Re-create the options for this question
      optionsContainerEl.innerHTML = "";
      if (question.options && question.options.length > 0) {
        question.options.forEach((opt, optIndex) => {
          addOption(opt, optIndex === question.correctAnswer);
        });
      } else {
        addOption();
        addOption();
      }
      correctAnswerEl.value = question.correctAnswer;
    } else {
      // If no question data exists at all, just show empty fields
      addOption();
      addOption();
    }

    updateNavigationButtons();
  }

  function addOption(value = "", isCorrect = false) {
    const optionIndex = optionsContainerEl.children.length;
    const optionId = `option-${optionIndex}`;

    const newOption = document.createElement("div");
    newOption.className = "input-group mb-2";
    newOption.innerHTML = `
            <span class="input-group-text">${optionIndex + 1}</span>
            <input type="text" class="form-control" id="${optionId}" value="${value}" required>
        `;
    optionsContainerEl.appendChild(newOption);
    updateCorrectAnswerDropdown();
  }

  function updateCorrectAnswerDropdown() {
    correctAnswerEl.innerHTML = "";
    const options = optionsContainerEl.querySelectorAll('input[type="text"]');
    options.forEach((opt, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `Option ${index + 1}`;
      correctAnswerEl.appendChild(option);
    });
  }

  function saveCurrentQuestion() {
    const text = questionTextEl.value;
    const options = Array.from(
      optionsContainerEl.querySelectorAll('input[type="text"]')
    ).map((input) => input.value);
    const correctAnswer = parseInt(correctAnswerEl.value, 10);
    const score = parseInt(questionScoreEl.value, 10);

    if (
      !text ||
      options.some((opt) => !opt) ||
      correctAnswer === null ||
      !score
    ) {
      alert(
        "Please fill out all fields for the question, including the score."
      );
      return false;
    }

    examData.questions[currentQuestionIndex] = {
      text,
      options,
      correctAnswer,
      score,
    };
    localStorage.setItem("currentExamSetup", JSON.stringify(examData));
    return true;
  }

  function updateNavigationButtons() {
    prevBtn.disabled = currentQuestionIndex === 0;
    if (currentQuestionIndex === examData.totalQuestions - 1) {
      nextBtn.textContent = isUpdate ? "Update Exam" : "Finish Exam";
      nextBtn.classList.remove("btn-primary");
      nextBtn.classList.add("btn-success");
    } else {
      nextBtn.textContent = "Next";
      nextBtn.classList.remove("btn-success");
      nextBtn.classList.add("btn-primary");
    }
  }

  addOptionBtn.addEventListener("click", () => addOption());

  optionsContainerEl.addEventListener("input", updateCorrectAnswerDropdown);

  prevBtn.addEventListener("click", () => {
    if (saveCurrentQuestion()) {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion(currentQuestionIndex);
      }
    }
  });

  nextBtn.addEventListener("click", () => {
    if (!saveCurrentQuestion()) return;

    if (currentQuestionIndex < examData.totalQuestions - 1) {
      currentQuestionIndex++;
      renderQuestion(currentQuestionIndex);
    } else {
      const totalScore = examData.questions.reduce(
        (total, q) => total + (q.score || 0),
        0
      );
      if (totalScore !== 100) {
        alert(
          `The total score for all questions must be 100. The current total is ${totalScore}.`
        );
        return;
      }

      const exams = JSON.parse(localStorage.getItem("exams")) || [];
      if (isUpdate) {
        const examIndex = exams.findIndex((e) => e.examId === examData.examId);
        if (examIndex !== -1) {
          exams[examIndex] = examData;
        }
        alert("Exam updated successfully!");
      } else {
        examData.examId = Date.now();
        exams.push(examData);
        alert("Exam created successfully!");
      }
      localStorage.setItem("exams", JSON.stringify(exams));
      localStorage.removeItem("currentExamSetup");
      window.location.href = "teacher_dashboard.html";
    }
  });

  renderQuestion(currentQuestionIndex);
});
