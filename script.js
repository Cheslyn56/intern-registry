// Replace this with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAX2tc6DHQJXiACDW8W_QY17hcF0n8Zb-w",
  authDomain: "internship-registry.firebaseapp.com",
  projectId: "internship-registry",
  storageBucket: "internship-registry.firebasestorage.app",
  messagingSenderId: "451396459592",
  appId: "1:451396459592:web:ab21c95311bba790810c7d",
  measurementId: "G-QB384DYCTC"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Form submit event
document.getElementById("studentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let requiredInputs = document.querySelectorAll("input[required]");
    let empty = false;
    requiredInputs.forEach(input => {
        if (!input.value.trim()) empty = true;
    });

    if (empty) {
        alert("Please fill in all required fields (email is optional).");
        return;
    }

    checkDuplicateAndSave();
});

// ✅ NEW: Check if index number already exists
function checkDuplicateAndSave() {
    let indexNumber = document.getElementById("indexNumber").value.trim();

    db.collection("Interns")
        .where("indexNumber", "==", indexNumber)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                alert("Your details have already been submitted.");
            } else {
                saveToDatabase();
            }
        })
        .catch((error) => {
            console.error("Error checking duplicates: ", error);
        });
}

// Save data to Firestore
function saveToDatabase() {
    let studentName = document.getElementById("studentName").value;
    let indexNumber = document.getElementById("indexNumber").value;
    let studentTel = document.getElementById("studentTel").value;
    let companyName = document.getElementById("companyName").value;
    let companyLocation = document.getElementById("companyLocation").value;
    let supervisorName = document.getElementById("supervisorName").value;
    let supervisorTel = document.getElementById("supervisorTel").value;
    let supervisorEmail = document.getElementById("supervisorEmail").value; // optional

    db.collection("Interns").add({
        studentName,
        indexNumber,
        studentTel,
        companyName,
        companyLocation,
        supervisorName,
        supervisorTel,
        supervisorEmail
    })
    .then(() => {
        alert("Data saved successfully!");
        document.getElementById("studentForm").reset();
    })
    .catch(error => {
        console.error("Error saving data: ", error);
    });
}
    doc.text(`${programSelect.value} ${yearSelect.value} Interns`, 14, 10);
    doc.autoTable({ html: '#studentTable', startY: 20 });
    doc.save(`${programSelect.value}-${yearSelect.value}-interns.pdf`);
});

