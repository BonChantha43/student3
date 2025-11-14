// នេះគឺជាកន្លែងដែលអ្នកត្រូវដាក់ URL របស់ Google Apps Script របស់អ្នក
// សូមមើល ភាគ២ សម្រាប់របៀបបង្កើត URL នេះ
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzm8ENd2s3e2opknZu7_s2OYPKzVh9xPzAC3B8gL1e_Mvaqu7Zx3KPJaE9gadBLjoDF/exec";

// ចាប់យក Element នានា
const form = document.getElementById("registration-form");
const submitButton = document.getElementById("submit-button");
const buttonText = document.querySelector(".button-text");
const loader = document.querySelector(".loader");
const message = document.getElementById("message");

// បន្ថែម Event ពេល Form ត្រូវបាន Submit
form.addEventListener("submit", function (e) {
  // ឃាត់ Form មិនឱ្យ Reload Page
  e.preventDefault();

  // បង្ហាញ Loader និងបិទប៊ូតុង
  setLoading(true);

  // ប្រមូលទិន្នន័យពី Form
  const formData = new FormData(form);

  // បញ្ជូនទិន្នន័យទៅ Google Apps Script
  fetch(SCRIPT_URL, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result === "success") {
        // បើជោគជ័យ
        showMessage("success", "ការចុះឈ្មោះបានជោគជ័យ!");
        form.reset(); // សម្អាត Form
      } else {
        // បើមានបញ្ហា (Error)
        throw new Error(data.error || "មានបញ្ហាក្នុងការបញ្ជូនទិន្នន័យ");
      }
    })
    .catch((error) => {
      // បើមានបញ្ហា Network ឬ Error
      console.error("Error:", error);
      showMessage("error", `មានបញ្ហា៖ ${error.message}`);
    })
    .finally(() => {
      // នៅពេលចប់ (ទាំង Success ឬ Error)
      setLoading(false); // លាក់ Loader វិញ
    });
});

// Function ដើម្បីបង្ហាញ/លាក់ Loader
function setLoading(isLoading) {
  if (isLoading) {
    submitButton.disabled = true;
    buttonText.style.display = "none";
    loader.style.display = "block";
  } else {
    submitButton.disabled = false;
    buttonText.style.display = "inline";
    loader.style.display = "none";
  }
}

// Function ដើម្បីបង្ហាញសារ
function showMessage(type, text) {
  message.textContent = text;
  // លុប Class ចាស់ៗចេញសិន
  message.classList.remove("success", "error");

  if (type === "success") {
    message.classList.add("success");
  } else {
    message.classList.add("error");
  }

  // លាក់សារវិញបន្ទាប់ពី 5 វិនាទី
  setTimeout(() => {
    message.textContent = "";
    message.classList.remove("success", "error");
  }, 5000);
}
