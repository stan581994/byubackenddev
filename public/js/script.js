document.addEventListener("DOMContentLoaded", function () {
  var togglePassword = document.getElementById("toggle-password");
  var passwordField = document.getElementById("password_field");
  var retypePasswordContainer = document.getElementById(
    "retype-password-container"
  );
  var togglePasswordImg = document.getElementById("toggle-password-img");
  var form = document.getElementById("registration-form");

  if (
    togglePassword &&
    passwordField &&
    retypePasswordContainer &&
    togglePasswordImg &&
    form
  ) {
    togglePassword.addEventListener("click", function () {
      var passwordFieldType = passwordField.getAttribute("type");
      if (passwordFieldType === "password") {
        passwordField.setAttribute("type", "text");
        togglePasswordImg.setAttribute("src", "/images/buttons/hide_eye.png"); // Update with the path to your hide icon
        togglePasswordImg.setAttribute("alt", "Hide Password");
        retypePasswordContainer.classList.add("hidden");
      } else {
        passwordField.setAttribute("type", "password");
        togglePasswordImg.setAttribute("src", "/images/buttons/show_eye.png");
        togglePasswordImg.setAttribute("alt", "Show Password");
        retypePasswordContainer.classList.remove("hidden");
      }
    });

    form.addEventListener("submit", function (event) {
      var password = passwordField.value;
      var retypePassword = document.getElementById("retype-password").value;

      // Custom validation for password requirements
      var passwordRequirements =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;
      if (!passwordRequirements.test(password)) {
        alert(
          "Password must be at least 12 characters long, contain at least 1 capital letter, 1 number, and 1 special character."
        );
        event.preventDefault();
        return;
      }

      // Check if passwords match
      if (
        !retypePasswordContainer.classList.contains("hidden") &&
        password !== retypePassword
      ) {
        alert("Passwords do not match.");
        event.preventDefault();
        return;
      }
    });
  } else {
    console.error("One or more elements not found in the DOM.");
  }
});

document
  .getElementById("classificationForm")
  .addEventListener("submit", function (event) {
    const classificationName =
      document.getElementById("classificationName").value;
    const pattern = /^[a-zA-Z0-9]+$/;

    if (!pattern.test(classificationName)) {
      alert("Classification name cannot contain spaces or special characters.");
      event.preventDefault(); // Prevent form submission
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const makeInput = document.getElementById("make");
  const modelInput = document.getElementById("model");

  form.addEventListener("submit", function (event) {
    let isValid = true;

    if (makeInput.value.length < 3) {
      makeInput.style.color = "red";
      isValid = false;
    } else {
      makeInput.style.color = "green";
    }

    if (modelInput.value.length < 3) {
      modelInput.style.color = "red";
      isValid = false;
    } else {
      modelInput.style.color = "green";
    }

    if (!isValid) {
      event.preventDefault();
    }
  });
});
