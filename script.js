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

// 🔹 2. Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🔹 3. Handle form submit
document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let requiredInputs = document.querySelectorAll("input[required]");
    let empty = false;
    requiredInputs.forEach(input => {
        if (!input.value.trim()) empty = true;
    });
    if (empty) {
        alert("Please fill in all required fields (email optional).");
        return;
    }
    checkDuplicateAndSave();
});

// 🔹 4. Prevent duplicate submissions (Index Number unique)
function checkDuplicateAndSave() {
    let indexNumber = document.getElementById("indexNumber").value.trim();
    db.collection("Interns").where("indexNumber", "==", indexNumber).get()
    .then(snapshot => {
        if (!snapshot.empty) {
            alert("This student has already submitted.");
        } else {
            saveToDatabase();
        }
    });
}

// 🔹 5. Save to database
function saveToDatabase() {
    let data = {
        studentName: document.getElementById("studentName").value,
        indexNumber: document.getElementById("indexNumber").value,
        studentTel: document.getElementById("studentTel").value,
        classYear: document.getElementById("classYear").value,
        companyName: document.getElementById("companyName").value,
        companyLocation: document.getElementById("companyLocation").value,
        supervisorName: document.getElementById("supervisorName").value,
        supervisorTel: document.getElementById("supervisorTel").value,
        supervisorEmail: document.getElementById("supervisorEmail").value
    };
    db.collection("Interns").add(data).then(() => {
        alert("Submitted successfully!");
        document.getElementById("studentForm").reset();
    });
}

// 🔹 6. Real-time table updates
db.collection("Interns").onSnapshot(snapshot => {
    let tableBody = document.querySelector("#studentsTable tbody");
    tableBody.innerHTML = "";
    snapshot.forEach(doc => {
        let s = doc.data();
        let row = `<tr>
            <td>${s.studentName}</td>
            <td>${s.indexNumber}</td>
            <td>${s.studentTel}</td>
            <td>${s.classYear}</td>
            <td>${s.companyName}</td>
            <td>${s.companyLocation}</td>
            <td>${s.supervisorName}</td>
            <td>${s.supervisorTel}</td>
            <td>${s.supervisorEmail || ""}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
});

// 🔹 7. Download table as PDF
document.getElementById("downloadPdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    doc.text("Internship List", 10, 10);
    let rows = [];
    document.querySelectorAll("#studentsTable tbody tr").forEach(tr => {
        let row = [];
        tr.querySelectorAll("td").forEach(td => row.push(td.innerText));
        rows.push(row);
    });
    doc.autoTable({
        head: [["Name", "Index No", "Tel", "Class & Year", "Company", "Location", "Supervisor", "Sup. Tel", "Sup. Email"]],
        body: rows
    });
    doc.save("Internship_List.pdf");
});
