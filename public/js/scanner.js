const scanner = new Html5QrcodeScanner("reader", {
  qrbox: {
    width: 250,
    height: 250,
  },
  fps: 20,
});

scanner.render(success, error);

function success(result) {
  try {
    // Parse the JSON data
    const parsedResult = JSON.parse(result);

    // Store parsed result in localStorage
    localStorage.setItem("qrResult", JSON.stringify(parsedResult));

    // Display the parsed data on the page
    document.getElementById("result").innerHTML = `
      <h2>Success!</h2>
      <p>Last Name: ${parsedResult.last_name}</p>
      <p>First Name: ${parsedResult.first_name}</p>
      <p>Middle Name: ${parsedResult.middle_name}</p>
    `;

    // Clear the scanner and remove it from the page
    scanner.clear();
    document.getElementById("reader").remove();

    // Redirect after a delay (1 second in this example)
    setTimeout(() => {
      window.location.href = "nurse"; // Change to your desired URL
    }, 1000); // 1000 milliseconds = 1 second
  } catch (e) {
    console.error("Error processing QR code:", e);
    document.getElementById("result").innerHTML = `
      <h2>Error!</h2>
      <p>Invalid QR Code</p>
    `;
  }
}

function error(err) {
  console.error(err);
}
