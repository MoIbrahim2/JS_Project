export const createNewExam = () => {
  const key_word_local_storage = "currentExamSetup";
  const examName = document.getElementById("exam-name").value;
  const examDuration = document.getElementById("exam-duration").value;
  const numQuestions = document.getElementById("num-questions").value;
  const examGrade = document.getElementById("exam-grade").value;
  const teacherId = JSON.parse(localStorage.getItem("logged_in_user")).id;

  const examSetup = {
    name: examName,
    examDuration,
    totalQuestions: numQuestions * 1,
    grade: examGrade,
    teacherId,
    questions: [],
  };
  localStorage.setItem(key_word_local_storage, JSON.stringify(examSetup));
  window.location.href = "fill_questions.html";
};
