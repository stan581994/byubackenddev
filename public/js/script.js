document
  .getElementById("toggle-password")
  .addEventListener("click", function () {
    var togglePassword = document.getElementById("toggle-password");
    var passwordField = document.getElementById("password");
    var retypePasswordContainer = document.getElementById(
      "retype-password-container"
    );
    var togglePasswordImg = document.getElementById("toggle-password-img");

    togglePassword.addEventListener("click", function () {
      var passwordFieldType = passwordField.getAttribute("type");
      if (passwordFieldType === "password") {
        passwordField.setAttribute("type", "text");
        togglePasswordImg.setAttribute("src", "/images/buttons/hide_eye.png");
        togglePasswordImg.setAttribute("alt", "Hide Password");
        retypePasswordContainer.classList.add("hidden");
      } else {
        passwordField.setAttribute("type", "password");
        togglePasswordImg.setAttribute("src", "/images/buttons/show_eye.png");
        togglePasswordImg.setAttribute("alt", "Show Password");
        retypePasswordContainer.classList.remove("hidden");
      }
    });
  });
