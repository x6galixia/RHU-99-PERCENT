document.addEventListener("DOMContentLoaded", async () => {
  // Function to get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Set current date in the check_date input field on page load
  const date_now_check = getCurrentDate();
  document.getElementById("check_date").value = new Date(date_now_check)
    .toISOString()
    .split("T")[0];

  // Check if there's a QR code result in localStorage
  const qrResult = localStorage.getItem("qrResult");
  if (qrResult) {
    try {
      // Parse QR code result assuming it contains JSON with last_name, first_name, middle_name
      const { last_name, first_name, middle_name } = JSON.parse(qrResult);
      await fetchAndPopulateFormData(`/api/citizen/${last_name}/${first_name}/${middle_name}`);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    // Remove the QR code result from localStorage once processed
    localStorage.removeItem("qrResult");
  }

  // Elements for generating and searching ID
  const idInput = document.getElementById("idInput");
  const generateButton = document.getElementById("generateButton");
  const searchButton = document.getElementById("searchButton");

  // Event listener for Generate ID button
  generateButton.addEventListener("click", () => {
    const generatedId = generateId(); // Function to generate ID
    idInput.value = generatedId;
  });

  // Event listener for Search ID button
  searchButton.addEventListener("click", async () => {
    const searchValue = idInput.value.trim(); // Get the input value

    if (searchValue) {
      try {
        await fetchAndPopulateFormData(`/api/search/${searchValue}`);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      alert("Please enter an ID to search.");
    }
  });

  function generateId() {
    let result = '';
    while (result.length < 12) {
        result += Math.floor(Math.random() * 10);
    }
    return `RHU-${result}-ver`;
  }

  // Function to fetch citizen data and populate form fields
  async function fetchAndPopulateFormData(url) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        populateFormFields(data);
      } else if (response.status === 404) {
        console.error("User not found");
      } else {
        console.error("Failed to fetch user data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Function to populate form fields with retrieved data
  function populateFormFields(data) {
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
  }
});
