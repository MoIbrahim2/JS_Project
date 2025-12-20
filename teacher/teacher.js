import { createNewExam } from "./create_exam.js";
const manageExamsTabButton = document.getElementById("manage-exams-tab");
const studentResultTabButton = document.getElementById("student-results-tab");

const students = JSON.parse(localStorage.getItem("student"));
const teacher = JSON.parse(localStorage.getItem("logged_in_teacher"));
const exams = JSON.parse(localStorage.getItem("exams")) || [];

if (!teacher) {
  alert("You are not logged in, please login first");
  window.location.href = "../auth/login.html";
}
const createExamForm = document.getElementById("create-exam-form");
createExamForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createNewExam();
});

const assignStudentModal = new bootstrap.Modal(
  document.getElementById("assignStudentModal")
);
const studentSelect = document.getElementById("student-select");
const assignExamIdInput = document.getElementById("assign-exam-id");
const assignStudentForm = document.getElementById("assign-student-form");

assignStudentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const studentId = studentSelect.value;
  const examId = assignExamIdInput.value;

  if (!studentId) {
    alert("Please select a student.");
    return;
  }

  const studentUpcomingExams =
    JSON.parse(localStorage.getItem("student_upcoming_exams")) || [];

  const assignmentExists = studentUpcomingExams.some(
    (assignment) =>
      assignment.studentId === studentId && assignment.examId === examId
  );

  if (assignmentExists) {
    alert("This exam is already assigned to this student.");
    return;
  }

  studentUpcomingExams.push({ studentId, examId });
  localStorage.setItem(
    "student_upcoming_exams",
    JSON.stringify(studentUpcomingExams)
  );

  alert("Exam assigned successfully!");
  assignStudentModal.hide();
});

const addExam = (exam) => {
  const tableBody = document.getElementById("exams-table-body");
  if (!tableBody) return;

  const row = document.createElement("tr");
  row.setAttribute("data-exam-id", exam.examId); // Set an attribute for easy selection

  row.innerHTML = `
    <td>${exam.name}</td>
    <td>${exam.examDuration}</td>
    <td>${exam.totalQuestions}</td>
    <td>${exam.grade}</td>
    <td>
      <button class="btn btn-sm btn-info update-btn me-2">Update</button>
      <button class="btn btn-sm btn-danger delete-btn me-2">Delete</button>
      <button class="btn btn-sm btn-success assign-btn">Assign</button>
    </td>
  `;

  const updateButton = row.querySelector(".update-btn");
  updateButton.addEventListener("click", () => {
    localStorage.setItem("currentExamForUpdate", JSON.stringify(exam));
    window.location.href = "fill_questions.html";
  });

  const assignButton = row.querySelector(".assign-btn");

  assignButton.addEventListener("click", () => {
    const examGrade = exam.grade;
    const filteredStudents = students.filter(
      (student) => student.grade == examGrade
    );

    studentSelect.innerHTML =
      '<option value="" selected disabled>Select a student</option>';
    filteredStudents.forEach((student) => {
      const option = document.createElement("option");
      option.value = student.id;
      option.textContent = student.username;
      studentSelect.appendChild(option);
    });

    assignExamIdInput.value = exam.examId;
    assignStudentModal.show();
  });

  const deleteButton = row.querySelector(".delete-btn");
  deleteButton.addEventListener("click", () => {
    if (confirm(`Are you sure you want to delete the exam "${exam.name}"?`)) {
      let exams = JSON.parse(localStorage.getItem("exams")) || [];
      exams = exams.filter((e) => e.examId !== exam.examId);
      localStorage.setItem("exams", JSON.stringify(exams));

      row.remove();
    }
  });

  tableBody.appendChild(row);
};

const renderTeacherExams = () => {
  const tableBody = document.getElementById("exams-table-body");
  const noExamsMessage = document.getElementById("no-exams-message");
  const examsTable = document.getElementById("exams-table");

  if (tableBody) {
    tableBody.innerHTML = "";
  }

  const teacherExams = exams.filter((exam) => exam.teacherId === teacher.id);

  if (teacherExams.length === 0) {
    noExamsMessage.style.display = "block";
    examsTable.style.display = "none";
  } else {
    noExamsMessage.style.display = "none";
    examsTable.style.display = "table";
    teacherExams.forEach((exam) => {
      addExam(exam);
    });
  }
};

const addResult = (result) => {
  const tableBody = document.getElementById("results-table-body");
  if (!tableBody) return;
  const student = students.find((st) => st.id === result.studentId);

  const exam = exams.find((exam) => exam.examId === result.examId);
  const row = document.createElement("tr");

  // Format the date for better readability
  const dateTaken = new Date(result.dateTaken).toLocaleDateString();
  const score = result.score;

  row.innerHTML = `
    <td>${student.username}</td>
    <td>${exam.name}</td>
    <td>${score}</td>
    <td>${dateTaken}</td>
    <td>
      <button class="btn btn-sm btn-outline-primary review-btn" data-result-id="${result.id}">View Answers</button>
    </td>
  `;

  tableBody.appendChild(row);
};

const renderStudentResults = () => {
  const results = JSON.parse(localStorage.getItem("student_exam")) || [];
  const tableBody = document.getElementById("results-table-body");

  if (tableBody) {
    tableBody.innerHTML = ""; // Clear existing rows
  }

  const teacherResults = results.filter((result) =>
    exams.some((exam) => {
      return exam.examId === result.examId && exam.teacherId === teacher.id;
    })
  );
  teacherResults.forEach((result) => {
    addResult(result);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  renderTeacherExams();
  renderStudentResults();
});

// Dark Mode Toggle
const darkModeSwitch = document.getElementById("darkModeSwitch");
darkModeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  // Save preference
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.removeItem("darkMode");
  }
});

// Check for saved dark mode preference
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  darkModeSwitch.checked = true;
}

manageExamsTabButton.addEventListener("click", (e) => {
  e.preventDefault();
  renderTeacherExams();
});
studentResultTabButton.addEventListener("click", (e) => {
  e.preventDefault();
  renderStudentResults();
});

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("logged_in_teacher");
  window.location.href = "../auth/login.html";
});
