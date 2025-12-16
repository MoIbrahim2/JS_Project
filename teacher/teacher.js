import { createNewExam } from "./create_exam.js";
const teacher = JSON.parse(localStorage.getItem("logged_in_teacher"));
if (!teacher) {
  alert("You are not logged in, please login first");
  window.location.href = "../auth/login.html";
}
const createExamForm = document.getElementById("create-exam-form");
createExamForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createNewExam();
});

const renderTeacherExams = () => {
  const exams = JSON.parse(localStorage.getItem("exams"));
  exams.forEach((exam) => {
    if (exam.teacherId === teacher.id) {
      addExam(exam);
    }
    return;
  });
};
renderTeacherExams();
