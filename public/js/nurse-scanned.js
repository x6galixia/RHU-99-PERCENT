document.addEventListener("DOMContentLoaded", async () => {
  const qrResult = localStorage.getItem("qrResult");

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const date_now_check = getCurrentDate();

  console.log("Formatted Date:", date_now_check);

  document.getElementById("check_date").value = new Date(date_now_check).toISOString().split("T")[0];

  if (qrResult) {
    document.getElementById("qrResultInput").value = qrResult;

    try {
      const response = await fetch(`/api/citizen/${qrResult}`);

      if (response.ok) {
        const data = await response.json();
        document.getElementById("last_name").value = data.last_name;
        document.getElementById("first_name").value = data.first_name;
        document.getElementById("middle_name").value = data.middle_name;
        document.getElementById("address").value = data.address;
        document.getElementById("barangay").value = data.barangay;
        document.getElementById("town").value = data.town;
        document.getElementById("birthdate").value = new Date(data.birthdate)
          .toISOString()
          .split("T")[0];
        document.getElementById("gender").value = data.gender;
        document.getElementById("phone").value = data.phone;
        document.getElementById("email").value = data.email;
        document.getElementById("philhealth_no").value = data.philhealth_no;
        document.getElementById("occupation").value = data.occupation;
        document.getElementById("guardian").value = data.guardian;
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    localStorage.removeItem("qrResult");
  }
});