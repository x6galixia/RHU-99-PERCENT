document.addEventListener("DOMContentLoaded", function() {
    const openVitalsButtons = document.querySelectorAll(".openVitals");
    const openPrescribeButtons = document.querySelectorAll(".openPrescribe");
    const openLabReqButtons = document.querySelectorAll(".openLabReq");
    const openLabResButtons = document.querySelectorAll(".openLabRes");
  
    const vitalForm = document.getElementById("vitalForm");
    const prescribeForm = document.getElementById("prescribeForm");
    const labRequestForm = document.getElementById("labRequestForm");
    const labResultForm = document.getElementById("labResultForm");
  
    const closeVitalsBtn = document.getElementById("closeVitalsBtn");
    const closePrescribeBtn = document.getElementById("closePrescribeBtn");
    const closeLabRequestBtn = document.getElementById("closeLabRequestBtn");
    const closeLabResultBtn = document.getElementById("closeLabResultBtn");
  
    // Vitals
    openVitalsButtons.forEach(button => {
      button.addEventListener("click", function() {
        document.getElementById("unq_id").value = this.dataset.unqId;
        document.getElementById("full_name").value = this.dataset.fullName;
        document.getElementById("height").value = this.dataset.height;
        document.getElementById("weight").value = this.dataset.weight;
        document.getElementById("systolic").value = this.dataset.systolic;
        document.getElementById("diastolic").value = this.dataset.diastolic;
        document.getElementById("temperature").value = this.dataset.temperature;
        document.getElementById("pulse_rate").value = this.dataset.pulseRate;
        document.getElementById("respiratory_rate").value = this.dataset.respiratoryRate;
        document.getElementById("bmi").value = this.dataset.bmi;
        document.getElementById("comment").value = this.dataset.comment;
        vitalForm.style.display = "block";
      });
    });
  
    closeVitalsBtn.addEventListener("click", function() {
      vitalForm.style.display = "none";
    });
  
    // Prescribe
    openPrescribeButtons.forEach(button => {
      button.addEventListener("click", function() {
        prescribeForm.style.display = "block";
      });
    });
  
    closePrescribeBtn.addEventListener("click", function() {
      prescribeForm.style.display = "none";
    });
  
    // Lab Request
    openLabReqButtons.forEach(button => {
      button.addEventListener("click", function() {
        document.getElementById("req_unq_id").value = this.dataset.unqId;
        document.getElementById("req_full_name").value = this.dataset.fullName;
        document.getElementById("req_date_now").value = this.dataset.date;
        document.getElementById("req_age").value = this.dataset.age;
        document.getElementById("req_gender").value = this.dataset.gender;
        document.getElementById("req_birthdate").value = new Date(this.dataset.birthdate).toISOString().split("T")[0];
        document.getElementById("req_occupation").value = this.dataset.occupation;
        document.getElementById("req_guardian").value = this.dataset.guardian;
        labRequestForm.style.display = "block";
      });
    });
  
    closeLabRequestBtn.addEventListener("click", function() {
      labRequestForm.style.display = "none";
    });
  
    // Lab Result
    openLabResButtons.forEach(button => {
      button.addEventListener("click", function() {
        labResultForm.style.display = "block";
      });
    });
  
    closeLabResultBtn.addEventListener("click", function() {
      labResultForm.style.display = "none";
    });
  });
  