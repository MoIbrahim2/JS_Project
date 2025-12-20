const profilePicture = document.getElementById("profile-picture");
const studentUsername = document.getElementById("student-username");
const logoutButton = document.getElementById("logout");
const upcomingExamsList = document.getElementById("upcoming-exams-list");
const noUpcomingExams = document.getElementById("no-upcoming-exams");
const completedExamsBody = document.getElementById("completed-exams-body");
const noCompletedExams = document.getElementById("no-completed-exams");

const allExams = JSON.parse(localStorage.getItem("exams")) || [];
const allUpcomingExams =
  JSON.parse(localStorage.getItem("student_upcoming_exams")) || [];
console.log(allUpcomingExams);
const completedExams = JSON.parse(localStorage.getItem("student_exam")) || [];
const student = JSON.parse(localStorage.getItem("logged_in_student"));

if (!student) {
  alert("You are not logged in, please login first");
  window.location.href = "../auth/login.html";
} else {
  fillProfile();
  renderUpcomingExams();
  renderCompletedExams();
}

function fillProfile() {
  if (student.picture) {
    profilePicture.src = student.picture;
  }
  studentUsername.innerText = student.username;
}

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("logged_in_student");
});

function renderUpcomingExams() {
  const studentUpcomingExams = allUpcomingExams.filter((exam) => {
    return exam.studentId == student.id;
  });
  if (studentUpcomingExams.length === 0) {
    noUpcomingExams.style.display = "block";
    upcomingExamsList.style.display = "none";
  } else {
    noUpcomingExams.style.display = "none";
    upcomingExamsList.style.display = "block";
    upcomingExamsList.innerHTML = "";

    studentUpcomingExams.forEach((upcomingExam) => {
      const examDetails = allExams.find(
        (exam) => exam.examId == upcomingExam.examId
      );
      if (examDetails) {
        const examItem = document.createElement("a");
        examItem.href = `take_exam.html?examId=${examDetails.examId}`;
        examItem.className =
          "list-group-item list-group-item-action d-flex justify-content-between align-items-center";

        examItem.innerHTML = `
          <div>
            <h6 class="mb-1">${examDetails.name}</h6>
            <small class="text-muted">Duration: ${examDetails.examDuration} minutes</small>
          </div>
          <button class="btn btn-primary btn-sm">Start Exam</button>
        `;
        upcomingExamsList.appendChild(examItem);
      }
    });
  }
}

function renderCompletedExams() {
  const studentCompletedExams = completedExams.filter(
    (exam) => exam.studentId === student.id
  );

  if (studentCompletedExams.length === 0) {
    noCompletedExams.style.display = "block";
    completedExamsBody.parentElement.parentElement.style.display = "none";
  } else {
    noCompletedExams.style.display = "none";
    completedExamsBody.parentElement.parentElement.style.display = "block";
    completedExamsBody.innerHTML = "";

    studentCompletedExams.forEach((completedExam) => {
      const examDetails = allExams.find(
        (exam) => exam.examId === completedExam.examId
      );
      if (examDetails) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${examDetails.name}</td>
          <td>${completedExam.score.toFixed(2)}%</td>
          <td>${new Date(completedExam.dateTaken).toLocaleDateString()}</td>
        `;
        completedExamsBody.appendChild(row);
      }
    });
  }
}
