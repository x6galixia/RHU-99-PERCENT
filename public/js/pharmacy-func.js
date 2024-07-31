document.addEventListener("DOMContentLoaded", function () {
  const alertMessage = document.getElementById("alertMessage");
  const closeAlertBtn = document.getElementById("closeAlertBtn");
  
  // Show the alert
  alertMessage.style.display = "block";
  closeAlertBtn.style.display = "block";
  
  // Add event listener to close button
  closeAlertBtn.addEventListener("click", function () {
    alertMessage.style.display = "none";
    closeAlertBtn.style.display = "none";
  });
});

