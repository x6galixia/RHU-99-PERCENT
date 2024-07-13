function hideUserType(value) {
  document.getElementById("user_type_input").value = value;
  document.getElementById("user_type").style.display = "none";
  document.getElementById("login-form").style.display = "block";
}
