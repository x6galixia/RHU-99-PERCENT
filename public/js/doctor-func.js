document.addEventListener("DOMContentLoaded", function() {
    const openVitalsButtons = document.querySelectorAll(".openVitals");
    const openPrescribeButtons = document.querySelectorAll(".openPrescribe");
    const openLabReqButtons = document.querySelectorAll(".openLabReq");
    const openLabResButtons = document.querySelectorAll(".openLabRes");
    const openDiagnoseButtons = document.querySelectorAll(".openDiagnose");
    const openFindingsButtons = document.querySelectorAll(".openFindings");
  
    const vitalForm = document.getElementById("vitalForm");
    const prescribeForm = document.getElementById("prescribeForm");
    const labRequestForm = document.getElementById("labRequestForm");
    const labResultForm = document.getElementById("labResultForm");
    const diagnoseForm = document.getElementById("diagnoseForm");
    const findingsForm = document.getElementById("findingsForm");
  
    const closeVitalsBtn = document.getElementById("closeVitalsBtn");
    const closePrescribeBtn = document.getElementById("closePrescribeBtn");
    const closeLabRequestBtn = document.getElementById("closeLabRequestBtn");
    const closeLabResultBtn = document.getElementById("closeLabResultBtn");
    const closeDiagnoseBtn = document.getElementById("closeDiagnoseBtn");
    const closeFindingsBtn = document.getElementById("closeFindingsBtn");
  
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
        document.getElementById("pres_unq_id").value = this.dataset.unqId;
        document.getElementById("pres_full_name").value = this.dataset.fullName;
        document.getElementById("pres_date_now").value = this.dataset.date;
        document.getElementById("pres_age").value = this.dataset.age;
        document.getElementById("pres_gender").value = this.dataset.gender;
        document.getElementById("pres_birthdate").value = new Date(this.dataset.birthdate).toISOString().split("T")[0];
        document.getElementById("pres_occupation").value = this.dataset.occupation;
        document.getElementById("pres_guardian").value = this.dataset.guardian;
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
        document.getElementById("res_unq_id").value = this.dataset.unqId;
        document.getElementById("res_full_name").value = this.dataset.fullName;
        document.getElementById("res_date_now").value = this.dataset.date;
        document.getElementById("res_age").value = this.dataset.age;
        document.getElementById("res_gender").value = this.dataset.gender;
        document.getElementById("res_birthdate").value = new Date(this.dataset.birthdate).toISOString().split("T")[0];
        document.getElementById("res_occupation").value = this.dataset.occupation;
        document.getElementById("res_guardian").value = this.dataset.guardian;
        labResultForm.style.display = "block";
      });
    });
  
    closeLabResultBtn.addEventListener("click", function() {
      labResultForm.style.display = "none";
    });

        // Diagnose
        openDiagnoseButtons.forEach(button => {
          button.addEventListener("click", function() {
            document.getElementById("dia_unq_id").value = this.dataset.unqId;
            document.getElementById("dia_full_name").value = this.dataset.fullName;
            document.getElementById("dia_date_now").value = this.dataset.date;
            document.getElementById("dia_age").value = this.dataset.age;
            document.getElementById("dia_gender").value = this.dataset.gender;
            document.getElementById("dia_birthdate").value = new Date(this.dataset.birthdate).toISOString().split("T")[0];
            document.getElementById("dia_occupation").value = this.dataset.occupation;
            document.getElementById("dia_guardian").value = this.dataset.guardian;
            diagnoseForm.style.display = "block";
          });
        });
      
        closeDiagnoseBtn.addEventListener("click", function() {
          diagnoseForm.style.display = "none";
        });


        // Findings
        openFindingsButtons.forEach(button => {
          button.addEventListener("click", function() {
            document.getElementById("fin_unq_id").value = this.dataset.unqId;
            document.getElementById("fin_full_name").value = this.dataset.fullName;
            document.getElementById("fin_date_now").value = this.dataset.date;
            document.getElementById("fin_age").value = this.dataset.age;
            document.getElementById("fin_gender").value = this.dataset.gender;
            document.getElementById("fin_birthdate").value = new Date(this.dataset.birthdate).toISOString().split("T")[0];
            document.getElementById("fin_occupation").value = this.dataset.occupation;
            document.getElementById("fin_guardian").value = this.dataset.guardian;
            findingsForm.style.display = "block";
          });
        });
      
        closeFindingsBtn.addEventListener("click", function() {
          findingsForm.style.display = "none";
        });
  });
  

  function toggleDropdown() {
    document.getElementById("dropdownContent").classList.toggle("show");
  }
  
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  
  function logout() {
    alert("Logging out...");
    // Perform logout actions here, such as redirecting to a logout endpoint
  }
  