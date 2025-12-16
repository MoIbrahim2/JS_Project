import { Student, Teacher } from "../classes.js";
import { showError, clearErrors } from "../helperFunctions.js";

const loginForm = document.getElementById("login-form");
const loginErrorDiv = document.getElementById("login-error");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent the form from reloading the page

  // Clear previous errors using the helper function
  clearErrors(loginForm);
  loginErrorDiv.classList.add("d-none");

  // Get the current values from the form fields
  const roleInput = document.getElementById("role");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const role = roleInput.value;
  const username = usernameInput.value;
  const password = passwordInput.value;

  let isValid = true;

  // Basic validation
  if (!role) {
    showError(roleInput, "Please select a role.");
    isValid = false;
  }
  if (!username) {
    showError(usernameInput, "Please enter your username.");
    isValid = false;
  }
  if (!password) {
    showError(passwordInput, "Please enter your password.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  let user;
  if (role === "student") {
    user = new Student(username, password);
  } else {
    user = new Teacher(username, password);
  }

  const loginResult = user.login();

  if (loginResult.success) {
    // On success, redirect to the correct dashboard
    window.location.href = `../${role}/${role}_dashboard.html`;
  } else {
    // On failure, show a specific error message
    if (loginResult.reason === "username") {
      showError(usernameInput, "No user found with this username.");
    } else if (loginResult.reason === "password") {
      showError(passwordInput, "Incorrect password. Please try again.");
    } else {
      // Fallback for any other errors
      loginErrorDiv.textContent = "An unknown error occurred.";
      loginErrorDiv.classList.remove("d-none");
    }
  }
});
