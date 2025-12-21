import { Student } from "../classes.js";
import { showError, clearErrors } from "../helperFunctions.js";
const user_storage_key = "student";
const registrationForm = document.getElementById("registration-form");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const gradeInput = document.getElementById("grade");
const phoneInput = document.getElementById("mobile");
const pictureInput = document.getElementById("profilePicture");

registrationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors(registrationForm);
  let isValid = true;

  const students = localStorage.getItem(user_storage_key)
    ? JSON.parse(localStorage.getItem(user_storage_key))
    : [];
  const isUsernameTaken = students.some(
    (user) => user.username === usernameInput.value
  );

  if (isUsernameTaken) {
    showError(
      usernameInput,
      "This username is already taken. Please choose another one."
    );
    isValid = false;
  }

  if (passwordInput.value.length < 8) {
    showError(passwordInput, "Password must be at least 8 characters long.");
    isValid = false;
  }

  const validGrades = ["1", "2", "3"];
  if (!validGrades.includes(gradeInput.value)) {
    showError(gradeInput, "Please select a valid grade (1, 2, or 3).");
    isValid = false;
  }

  const phoneValue = phoneInput.value;
  if (phoneValue.length !== 11 || !phoneValue.startsWith("01")) {
    showError(phoneInput, "Mobile number must be 11 digits and start with 01.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const imageUrl = document.getElementById("profileImageUrl").value;
  saveUser(imageUrl || null);
  alert("Successfull signup");
});

const saveUser = (pictureData) => {
  const student = new Student(
    usernameInput.value,
    passwordInput.value,
    gradeInput.value,
    phoneInput.value,
    pictureData
  );
  student.signup();
};
