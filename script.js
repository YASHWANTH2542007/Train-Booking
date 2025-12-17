// ==========================
// Dummy Train Data
// ==========================
const trains = [
  { name: "Express 101", time: "09:00 AM", fare: 450 },
  { name: "SuperFast 202", time: "01:00 PM", fare: 600 },
  { name: "Shatabdi 303", time: "06:00 PM", fare: 1200 }
];

// ==========================
// Train Selection (selecttrain.html)
// ==========================
function selectTrain(name, time, fare) {
  let journey = JSON.parse(localStorage.getItem("journey")) || {};
  journey.trainName = name;
  journey.trainTime = time;
  journey.trainFare = fare;

  localStorage.setItem("journey", JSON.stringify(journey));
  window.location.href = "../P-7/passenger.html";
}

// ==========================
// Booking Form (booking.html)
// ==========================
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const date = document.getElementById("date").value;
    const travelClass = document.getElementById("class").value;

    // Save journey details
    localStorage.setItem("journey", JSON.stringify({ from, to, date, travelClass }));

    // Show trains list
    let trainHTML = "<h3>Available Trains</h3>";
    trains.forEach((train) => {
      trainHTML += `
        <p><b>${train.name}</b> - ${train.time} - Fare: ₹${train.fare}
        <button class="btn btn-primary btn-sm ms-2" 
          onclick="bookTicket('${from}','${to}','${date}','${travelClass}','${train.name}','${train.time}','${train.fare}')">
          Book
        </button></p>
      `;
    });

    document.getElementById("trainList").style.display = "block";
    document.getElementById("trainList").innerHTML = trainHTML;
  });
}

// ==========================
// Book Ticket Function
// ==========================
function bookTicket(from, to, date, travelClass, trainName, trainTime, trainFare) {
  localStorage.setItem(
    "journey",
    JSON.stringify({ from, to, date, travelClass, trainName, trainTime, trainFare })
  );

  document.getElementById("ticketConfirm").style.display = "block";
  document.getElementById("ticketConfirm").innerHTML = `
    <h3>✅ Booking Selected!</h3>
    <p><b>Train:</b> ${trainName} (${trainTime})</p>
    <p><b>From:</b> ${from}</p>
    <p><b>To:</b> ${to}</p>
    <p><b>Date:</b> ${date}</p>
    <p><b>Class:</b> ${travelClass}</p>
    <p><b>Fare:</b> ₹${trainFare}</p>
    <a href="../P-7/passenger.html" class="btn btn-success mt-3">Continue →</a>
  `;
}

// ==========================
// PNR Form (pnr.html)
// ==========================
const pnrForm = document.getElementById("pnrForm");
if (pnrForm) {
  pnrForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const pnr = document.getElementById("pnrInput").value;

    const statusList = ["Confirmed ✅", "RAC (Half Berth) ⚠️", "Waiting List ❌"];
    const randomStatus = statusList[Math.floor(Math.random() * statusList.length)];

    document.getElementById("pnrResult").style.display = "block";
    document.getElementById("pnrResult").innerHTML = `
      <h3>PNR Status</h3>
      <p><b>PNR:</b> ${pnr}</p>
      <p><b>Status:</b> ${randomStatus}</p>
    `;
  });
}

// ==========================
// Passenger Form (passenger.html)
// ==========================
const passengerForm = document.getElementById("passengerForm");
if (passengerForm) {
  passengerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;

    localStorage.setItem("passenger", JSON.stringify({ name, age, gender }));

    // Redirect to payment
    window.location.href = "../P-7/payment.html";
  });
}

// ==========================
// Payment Form (payment.html)
// ==========================
const paymentForm = document.getElementById("paymentForm");
if (paymentForm) {
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const card = e.target.querySelector("#card").value;

    localStorage.setItem("payment", JSON.stringify({ card }));

    // Generate random OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
    localStorage.setItem("otp", otp);

    alert("Your OTP is: " + otp);

    // Redirect to OTP verification
    window.location.href = "../P-7/otp.html";
  });
}

// ==========================
// OTP Verification (otp.html)
// ==========================
const otpForm = document.getElementById("otpForm");
if (otpForm) {
  otpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredOtp = document.getElementById("otpInput").value;
    const storedOtp = localStorage.getItem("otp");

    if (enteredOtp === storedOtp) {
      localStorage.removeItem("otp"); // clear OTP after use
      window.location.href = "../P-7/sucess.html";
    } else {
      document.getElementById("otpMsg").textContent = "❌ Invalid OTP. Please try again.";
    }
  });
}

// ==========================
// Success Page (sucess.html)
// ==========================
if (window.location.pathname.includes("sucess.html")) {
  const passenger = JSON.parse(localStorage.getItem("passenger")) || {};
  const journey = JSON.parse(localStorage.getItem("journey")) || {};

  // Generate PNR
  const pnr = Math.floor(Math.random() * 9000000000) + 1000000000;
  document.getElementById("pnr").textContent = "#" + pnr;

  // Passenger Info
  document.getElementById("pname").textContent = passenger.name || "N/A";
  document.getElementById("page").textContent = passenger.age || "N/A";
  document.getElementById("pgender").textContent = passenger.gender || "N/A";

  // Journey Info
  document.getElementById("pfrom").textContent = journey.from || "N/A";
  document.getElementById("pto").textContent = journey.to || "N/A";
  document.getElementById("pdate").textContent = journey.date || "N/A";
  document.getElementById("ptrain").textContent =
    journey.trainName ? `${journey.trainName} (${journey.trainTime || "N/A"}) - ₹${journey.trainFare}` : "N/A";

  // QR Code with full info
  const qrData = `PNR:${pnr}, Name:${passenger.name}, From:${journey.from}, To:${journey.to}, Date:${journey.date}, Train:${journey.trainName}, Time:${journey.trainTime}, Class:${journey.travelClass}, Fare:${journey.trainFare}`;
  document.getElementById("qrCode").src =
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
}
