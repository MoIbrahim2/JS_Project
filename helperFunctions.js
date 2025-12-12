export const showError = (input, message) => {
  const formControl = input.parentElement;
  const errorDiv = formControl.querySelector(".invalid-feedback");
  input.classList.add("is-invalid");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
};

// Helper function to clear all error messages
export const clearErrors = () => {
  const errorFields = registrationForm.querySelectorAll(".is-invalid");
  errorFields.forEach((field) => field.classList.remove("is-invalid"));
  const errorMessages = registrationForm.querySelectorAll(".invalid-feedback");
  errorMessages.forEach((msg) => (msg.style.display = "none"));
};
