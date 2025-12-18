const profilePicture = document.getElementById("profile-picture");
const studentUsername = document.getElementById("student-username");
const logoutButton = document.getElementById("logout");

const student = JSON.parse(localStorage.getItem("logged_in_student"));
if (!student) {
  alert("You are not logged in, please login first");
  window.location.href = "../auth/login.html";
}
const fillProfile = () => {
  profilePicture.src = student.picture;
  studentUsername.innerText = student.username;
};

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("logged_in_student");
});

fillProfile();
