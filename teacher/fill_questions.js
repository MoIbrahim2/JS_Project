document.addEventListener("DOMContentLoaded", () => {
  const examTitleEl = document.getElementById("exam-title");
  const questionCounterEl = document.getElementById("question-counter");
  const questionForm = document.getElementById("question-form");
  const questionTextEl = document.getElementById("question-text");
  const optionsContainerEl = document.getElementById("options-container");
  const addOptionBtn = document.getElementById("add-option-btn");
  const correctAnswerEl = document.getElementById("correct-answer");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let currentQuestionIndex = 0;
  let examData = JSON.parse(localStorage.getItem("currentExamSetup"));

  if (!examData) {
    alert("No exam data found. Please create an exam first.");
    window.location.href = "teacher_dashboard.html";
    return;
  }

  // Initialize with at least two options
  addOption();
  addOption();

  function renderQuestion(index) {
    // Update titles and counters
    examTitleEl.textContent = `${examData.name}`;
    questionCounterEl.textContent = `Question ${index + 1} / ${
      examData.totalQuestions
    }`;

    // Clear previous state
    questionTextEl.value = "";
    optionsContainerEl.innerHTML = "";
    correctAnswerEl.innerHTML = "";
    addOption(); // Add first two default options
    addOption();

    const question = examData.questions[index];
    if (question) {
      questionTextEl.value = question.text;
      // Re-create the options for this question
      optionsContainerEl.innerHTML = "";
      question.options.forEach((opt, optIndex) => {
        addOption(opt, optIndex === question.correctAnswer);
      });
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

    if (!text || options.some((opt) => !opt) || correctAnswer === null) {
      alert("Please fill out all fields for the question.");
      return false;
    }

    examData.questions[currentQuestionIndex] = { text, options, correctAnswer };
    localStorage.setItem("currentExamSetup", JSON.stringify(examData));
    return true;
  }

  function updateNavigationButtons() {
    prevBtn.disabled = currentQuestionIndex === 0;
    if (currentQuestionIndex === examData.totalQuestions - 1) {
      nextBtn.textContent = "Finish Exam";
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
      const exams = JSON.parse(localStorage.getItem("exams")) || [];
      exams.push(examData);
      localStorage.setItem("exams", JSON.stringify(exams));

      localStorage.removeItem("currentExamSetup");
      alert("Exam created successfully!");
      window.location.href = "teacher_dashboard.html";
    }
  });

  renderQuestion(currentQuestionIndex);
});
