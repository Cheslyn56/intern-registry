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
document.getElementById("addStudent").addEventListener("click", async () => {
    const program = programSelect.value;
    const year = yearSelect.value;
    if (!program || !year) return alert("Select Program and Year");

    const student = {
        name: document.getElementById("name").value.trim(),
        index: document.getElementById("index").value.trim(),
        studentTel: document.getElementById("studentTel").value.trim(),
        company: document.getElementById("company").value.trim(),
        location: document.getElementById("location").value.trim(),
        supervisor: document.getElementById("supervisor").value.trim(),
        supervisorTel: document.getElementById("supervisorTel").value.trim(),
        supervisorEmail: document.getElementById("supervisorEmail").value.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    const collectionName = `${program} ${year}`;
    const studentsRef = db.collection(collectionName);

    try {
        // 🔹 Check if index already exists
        const dupCheck = await studentsRef.where("index", "==", student.index).get();
        if (!dupCheck.empty) {
            alert("❌ A student with this index number already exists!");
            return;
        }

        // If no duplicate, add new record
        await studentsRef.add(student);
        alert("✅ Student Added Successfully!");
        document.querySelectorAll("input").forEach(i => i.value = "");
    } catch (err) {
        console.error("Error adding student:", err);
        alert("Error adding student. See console.");
    }
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

        const seenIndexes = new Set(); // ✅ track seen indexes
        let i = 0; // numbering

        snapshot.forEach(doc => {
            const s = doc.data();

            if (seenIndexes.has(s.index)) {
                // 🔴 skip duplicate index
                return;
            }
            seenIndexes.add(s.index);

            i++;
            tableBody.innerHTML += `
                <tr>
                    <td>${i}</td>
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