export const showError = (input, message) => {
  const formControl = input.parentElement;
  const errorDiv = formControl.querySelector(".invalid-feedback");
  input.classList.add("is-invalid");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
};

// Helper function to clear all error messages for a given form
export const clearErrors = (form) => {
  const errorFields = form.querySelectorAll(".is-invalid");
  errorFields.forEach((field) => field.classList.remove("is-invalid"));
  const errorMessages = form.querySelectorAll(".invalid-feedback");
  errorMessages.forEach((msg) => {
    // Only hide the field-specific messages, not the main login error div
    if (msg.parentElement.classList.contains("mb-3")) {
      msg.style.display = "none";
    }
  });
};
