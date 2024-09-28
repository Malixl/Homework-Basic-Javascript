const registrants = [];

class Registrant {
    constructor(name, age, sangu) {
        this.name = name;
        this.age = age;
        this.sangu = sangu;
    }
}

function openTab(evt, tabName) {
    const tabcontent = document.querySelectorAll(".tabcontent");
    tabcontent.forEach(tab => tab.classList.remove("active"));

    const tablinks = document.querySelectorAll(".tablinks");
    tablinks.forEach(link => link.classList.remove("active"));

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    if (tabName === "ListPendaftar") {
        updateTable();
    }
}

document.getElementById("Registrasi").classList.add("active");
document.querySelector(".tablinks").classList.add("active");

function validateInput(name, age, sangu) {
    let errors = {
        nameError: "",
        ageError: "",
        sanguError: ""
    };

    if (!name) {
        errors.nameError = "Nama wajib diisi.";
    } else if (name.length < 10) {
        errors.nameError = "Nama harus minimal 10 karakter.";
    }

    if (!age) {
        errors.ageError = "Umur wajib diisi.";
    } else if (age < 25) {
        errors.ageError = "Umur harus minimal 25 tahun.";
    }

    if (!sangu) {
        errors.sanguError = "Uang sangu wajib diisi.";
    } else if (sangu < 100000 || sangu > 1000000) {
        errors.sanguError = "Uang sangu harus antara 100 ribu hingga 1 juta.";
    }

    document.getElementById("name-error").textContent = errors.nameError;
    document.getElementById("age-error").textContent = errors.ageError;
    document.getElementById("sangu-error").textContent = errors.sanguError;

    return Object.values(errors).some(error => error !== "");
}

function updateTable() {
    const tableBody = document.querySelector("#registrantsTable tbody");
    tableBody.innerHTML = "";

    let totalSangu = 0;
    let totalAge = 0;

    registrants.forEach(registrant => {
        const row = document.createElement("tr");

        const cellName = document.createElement("td");
        cellName.textContent = registrant.name;

        const cellAge = document.createElement("td");
        cellAge.textContent = registrant.age;

        const cellSangu = document.createElement("td");
        cellSangu.textContent = `Rp ${registrant.sangu.toLocaleString('id-ID')}`;

        row.append(cellName, cellAge, cellSangu);
        tableBody.appendChild(row);

        totalSangu += registrant.sangu;
        totalAge += registrant.age;
    });

    if (registrants.length > 0) {
        const averageSangu = (totalSangu / registrants.length).toFixed(0);
        const averageAge = (totalAge / registrants.length).toFixed(0);
        document.getElementById("summary").textContent = `Rata-rata pendaftar memiliki uang sangu sebesar Rp ${Number(averageSangu).toLocaleString('id-ID')} dan rata-rata umur mereka adalah ${averageAge} tahun.`;
    } else {
        document.getElementById("summary").textContent = "Belum ada pendaftar.";
    }
}

document.getElementById("registrationForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const sangu = parseInt(document.getElementById("sangu").value);

    if (validateInput(name, age, sangu)) return;

    showModal("Sedang memproses...", true);

    const newRegistrant = new Registrant(name, age, sangu);

    await new Promise((resolve) => {
        setTimeout(() => {
            registrants.push(newRegistrant);
            resolve();
        }, 1000);
    });

    updateTable();

    showModal("Data telah ditambahkan!", false);

    document.getElementById("registrationForm").reset();
});

function showModal(message, isLoading) {
    const modal = document.getElementById("alertModal");
    const modalMessage = document.getElementById("modalMessage");
    const icon = document.getElementById("modalIcon");

    modalMessage.textContent = message;

    icon.classList.toggle("loading-icon", isLoading);
    icon.classList.toggle("check-icon", !isLoading);

    modal.style.display = "block";
    setTimeout(() => {
        modal.style.display = "none";
    }, 2000);
}

document.addEventListener('DOMContentLoaded', updateTable);