document.getElementById("birthdayForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the form data
  const name = document.getElementById("name").value;
  const presence = document.getElementById("presence").value;

  // Create an object with the form data
  const formData = {
    "entry.1234567890": name, // Replace "1234567890" with the actual entry ID from your Google Form
    "entry.0987654321": presence // Replace "0987654321" with the actual entry ID from your Google Form
  };

  // Send the form data to the Google Form
  fetch("https://docs.google.com/forms/d/e/your-form-id/formResponse", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(formData).toString()
  })
  .then(function(response) {
    // Handle the form submission success
    console.log("Form submitted successfully!");
    // You can perform any additional actions here, such as showing a success message to the user
  })
  .catch(function(error) {
    // Handle the form submission error
    console.error("Form submission error:", error);
    // You can display an error message to the user or take any other appropriate action
  });
});
