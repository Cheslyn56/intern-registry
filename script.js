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

const programSelect = document.getElementById("program");
const yearSelect = document.getElementById("year");
const tableBody = document.querySelector("#studentTable tbody");
let unsubscribe = null;

// Add Student
document.getElementById("addStudent").addEventListener("click", () => {
    const program = programSelect.value;
    const year = yearSelect.value;
    if (!program || !year) return alert("Select Program and Year");

    const student = {
        name: document.getElementById("name").value,
        index: document.getElementById("index").value,
        studentTel: document.getElementById("studentTel").value,
        company: document.getElementById("company").value,
        location: document.getElementById("location").value,
        supervisor: document.getElementById("supervisor").value,
        supervisorTel: document.getElementById("supervisorTel").value,
        supervisorEmail: document.getElementById("supervisorEmail").value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    const collectionName = `${program} ${year}`;
    db.collection(collectionName).add(student).then(() => {
        alert("Student Added Successfully!");
        document.querySelectorAll("input").forEach(i => i.value = "");
    });
});

// Live table update
function startRealtimeListener() {
    tableBody.innerHTML = "";
    const program = programSelect.value;
    const year = yearSelect.value;
    if (!program || !year) return;

    const collectionName = `${program} ${year}`;
    if (unsubscribe) unsubscribe();

    unsubscribe = db.collection(collectionName)
        .orderBy("name")
        .onSnapshot(snapshot => {
            tableBody.innerHTML = "";
            snapshot.forEach(doc => {
                const s = doc.data();
                tableBody.innerHTML += `
                    <tr>
                        <td>${s.name}</td>
                        <td>${s.index}</td>
                        <td>${s.studentTel}</td>
                        <td>${s.company}</td>
                        <td>${s.location}</td>
                        <td>${s.supervisor}</td>
                        <td>${s.supervisorTel}</td>
                        <td>${s.supervisorEmail}</td>
                    </tr>
                `;
            });
        });
}

programSelect.addEventListener("change", startRealtimeListener);
yearSelect.addEventListener("change", startRealtimeListener);

// PDF Download
document.getElementById("downloadPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(`${programSelect.value} ${yearSelect.value} Interns`, 14, 10);
    doc.autoTable({ html: '#studentTable', startY: 20 });
    doc.save(`${programSelect.value}-${yearSelect.value}-interns.pdf`);
});