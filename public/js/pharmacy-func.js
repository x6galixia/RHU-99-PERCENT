document.addEventListener("DOMContentLoaded", function () {
  const alertMessage = document.getElementById("alertMessage");
  const closeAlertBtn = document.getElementById("closeAlertBtn");

  // Check if the alert has been shown in this session
  if (!sessionStorage.getItem("alertShown")) {
    // Show the alert
    alertMessage.style.display = "block";
    closeAlertBtn.style.display = "block";

    // Add event listener to close button
    closeAlertBtn.addEventListener("click", function () {
      alertMessage.style.display = "none";
      closeAlertBtn.style.display = "none";
      // Set the alert as shown in sessionStorage
      sessionStorage.setItem("alertShown", "true");
    });
  } else {
    // Hide the alert if it has been shown in this session
    alertMessage.style.display = "none";
    closeAlertBtn.style.display = "none";
  }
});

