const form = document.getElementById("apiForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Get the form data
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  // Create an object with the form data
  const formData = {
    "entry.1234567890": name, // Replace "1234567890" with the actual entry ID from your Google Form
    "entry.0987654321": email, // Replace "0987654321" with the actual entry ID from your Google Form
  };

  // Send the form data to the Google Form
  await fetch("https://docs.google.com/forms/d/1yf4hq-zEQYdbWz4gMJJrYZsWgvOApszpqBjxOJbNpxw/formResponse", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(formData).toString(),
  })
    .then(function (response) {
      // Handle the form submission success
      console.log("Form submitted successfully!");
      // You can perform any additional actions here, such as showing a success message to the user
    })
    .catch(function (error) {
      // Handle the form submission error
      console.error("Form submission error:", error);
      // You can display an error message to the user or take any other appropriate action
    });
});

function getTimeRemaining(endTime) {
  const total = Date.parse(endTime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

function initializeClock(endTime) {
  const daysSpan = document.getElementById('days');
  const hoursSpan = document.getElementById('hours');
  const minutesSpan = document.getElementById('minutes');
  const secondsSpan = document.getElementById('seconds');

  function updateClock() {
    const timeRemaining = getTimeRemaining(endTime);

    daysSpan.textContent = ('0' + timeRemaining.days).slice(-2);
    hoursSpan.textContent = ('0' + timeRemaining.hours).slice(-2);
    minutesSpan.textContent = ('0' + timeRemaining.minutes).slice(-2);
    secondsSpan.textContent = ('0' + timeRemaining.seconds).slice(-2);

    if (timeRemaining.total <= 0) {
      clearInterval(timeInterval);
    }
  }

  updateClock();
  const timeInterval = setInterval(updateClock, 1000);
}

const countdownDate = new Date('June 24, 2023 00:00:00');
initializeClock(countdownDate);

