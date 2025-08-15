// 🔹 1. Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX2tc6DHQJXiACDW8W_QY17hcF0n8Zb-w",
  authDomain: "internship-registry.firebaseapp.com",
  projectId: "internship-registry",
  storageBucket: "internship-registry.firebasestorage.app",
  messagingSenderId: "451396459592",
  appId: "1:451396459592:web:ab21c95311bba790810c7d",
  measurementId: "G-QB384DYCTC"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function checkDuplicateAndSave() {
    let program = document.getElementById("program").value;
    let year = document.getElementById("year").value;
    let indexNumber = document.getElementById("indexNumber").value;

    if (!program || !year) {
        alert("Please select Program and Year.");
        return;
    }

    let collectionName = `${program} ${year} Interns`;

    db.collection(collectionName)
        .where("indexNumber", "==", indexNumber)
        .get()
        .then(snapshot => {
            if (!snapshot.empty) {
                alert("This index number has already submitted details for this program/year.");
            } else {
                saveToDatabase(collectionName);
            }
        })
        .catch(error => {
            console.error("Error checking duplicate: ", error);
        });
}

function saveToDatabase(collectionName) {
    let studentName = document.getElementById("studentName").value;
    let indexNumber = document.getElementById("indexNumber").value;
    let studentTel = document.getElementById("studentTel").value;
    let companyName = document.getElementById("companyName").value;
    let companyLocation = document.getElementById("companyLocation").value;
    let supervisorName = document.getElementById("supervisorName").value;
    let supervisorTel = document.getElementById("supervisorTel").value;
    let supervisorEmail = document.getElementById("supervisorEmail").value;
    let program = document.getElementById("program").value;
    let year = document.getElementById("year").value;

    if (!studentName || !indexNumber || !studentTel || !companyName || !companyLocation || !supervisorName || !supervisorTel) {
        alert("Please fill all required fields.");
        return;
    }

    db.collection(collectionName).add({
        studentName,
        indexNumber,
        studentTel,
        companyName,
        companyLocation,
        supervisorName,
        supervisorTel,
        supervisorEmail,
        program,
        year
    })
    .then(() => {
        alert("✅ Data saved successfully!");
        document.getElementById("studentForm").reset();
    })
    .catch(error => {
        console.error("Error saving data: ", error);
    });
}
