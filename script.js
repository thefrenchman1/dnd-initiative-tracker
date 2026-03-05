let characters = [];
let permanentCharacters = [];
let currentTurnIndex = 0;
let round = 1;
let conditionsMap = {}; // key = index of character in combat

// Load permanent characters from browser storage
window.onload = function () {
    const saved = localStorage.getItem("permanentCharacters");
    if (saved) {
        permanentCharacters = JSON.parse(saved);
        renderPermanentList();
    }
};

// --------------------
// Combat Characters
// --------------------

function addCharacter() {
    const name = document.getElementById("nameInput").value;
    const initiative = parseInt(document.getElementById("initiativeInput").value);

    if (!name || isNaN(initiative)) {
        alert("Enter a name and initiative!");
        return;
    }

    characters.push({ name, initiative });
    sortCharacters();
    renderList();

    document.getElementById("nameInput").value = "";
    document.getElementById("initiativeInput").value = "";
}

function addFromPermanent(name) {
    const initiative = parseInt(prompt(`Enter initiative for ${name}`));

    if (isNaN(initiative)) return;

    characters.push({ name, initiative });
    sortCharacters();
    renderList();
}

function sortCharacters() {
    characters.sort((a, b) => b.initiative - a.initiative);
    currentTurnIndex = 0;
}

function nextTurn() {
    if (characters.length === 0) return;

    currentTurnIndex++;

    if (currentTurnIndex >= characters.length) {
        currentTurnIndex = 0;
        round++;
    }

    renderList();
}

function renderList() {
    const list = document.getElementById("initiativeList");
    list.innerHTML = "";

    characters.forEach((character, index) => {
        const li = document.createElement("li");

        // Character name + initiative
        const textSpan = document.createElement("span");
        textSpan.textContent = `${character.name} - ${character.initiative}`;
        li.appendChild(textSpan);

        // ===== Conditions =====
        const conditionsSpan = document.createElement("span");
        conditionsSpan.style.marginLeft = "10px";

        const conds = conditionsMap[index] || [];

        // Display each condition
        conds.forEach((cond, condIndex) => {
            const condTag = document.createElement("span");
            condTag.textContent = cond;
            condTag.style.backgroundColor = "#ffcc00";
            condTag.style.color = "black";
            condTag.style.padding = "2px 5px";
            condTag.style.marginRight = "5px";
            condTag.style.borderRadius = "4px";
            condTag.style.fontSize = "0.8em";
            condTag.style.cursor = "pointer";
            condTag.title = "Click to remove condition";
            condTag.onclick = () => removeCondition(index, condIndex);
            conditionsSpan.appendChild(condTag);
        });

        // Button to add a new condition
        const addCondButton = document.createElement("button");
        addCondButton.textContent = "+Condition";
        addCondButton.style.marginLeft = "5px";
        addCondButton.onclick = () => addCondition(index);

        li.appendChild(conditionsSpan);
        li.appendChild(addCondButton);

        // ===== Death button at the very end =====
        const removeButton = document.createElement("button");
        removeButton.textContent = "💀 Ded";
        removeButton.classList.add("remove-btn");
        removeButton.style.marginLeft = "10px";
        removeButton.onclick = () => removeCharacter(index);
        li.appendChild(removeButton);

        // Highlight current turn
        if (index === currentTurnIndex) {
            li.style.backgroundColor = "#4CAF50";
            li.style.fontWeight = "bold";
        }

        list.appendChild(li);
    });

    // Update round display
    document.getElementById("roundDisplay").textContent = `Round: ${round}`;
}

// --------------------
// Permanent Characters
// --------------------

function addPermanentCharacter() {
    const name = document.getElementById("permanentNameInput").value;

    if (!name) return;

    permanentCharacters.push(name);
    localStorage.setItem("permanentCharacters", JSON.stringify(permanentCharacters));

    renderPermanentList();

    document.getElementById("permanentNameInput").value = "";
}

function renderPermanentList() {
    const list = document.getElementById("permanentList");
    list.innerHTML = "";

    permanentCharacters.forEach((name, index) => {
        const li = document.createElement("li");

        const nameSpan = document.createElement("span");
        nameSpan.textContent = name;

        const addButton = document.createElement("button");
        addButton.textContent = "Add to Combat";
        addButton.style.marginLeft = "10px";
        addButton.onclick = () => addFromPermanent(name);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.style.marginLeft = "5px";
        removeButton.onclick = () => removePermanentCharacter(index);

        li.appendChild(nameSpan);
        li.appendChild(addButton);
        li.appendChild(removeButton);

        list.appendChild(li);
    });
}

function removePermanentCharacter(index) {
    permanentCharacters.splice(index, 1);
    localStorage.setItem("permanentCharacters", JSON.stringify(permanentCharacters));
    renderPermanentList();
}

function clearPermanentCharacters() {
    if (!confirm("Are you sure you want to delete all permanent characters?")) return;

    permanentCharacters = [];
    localStorage.removeItem("permanentCharacters");
    renderPermanentList();
}

function removeCharacter(index) {
    characters.splice(index, 1);

    if (index < currentTurnIndex) {
        currentTurnIndex--;
    }

    if (currentTurnIndex >= characters.length) {
        currentTurnIndex = 0;
    }

    renderList();
}

function addCondition(charIndex) {
    const condition = prompt("Enter condition (e.g., Poisoned, Paralyzed):");
    if (!condition) return;

    if (!conditionsMap[charIndex]) conditionsMap[charIndex] = [];
    conditionsMap[charIndex].push(condition);

    renderList();
}

function removeCondition(charIndex, condIndex) {
    if (!conditionsMap[charIndex]) return;

    conditionsMap[charIndex].splice(condIndex, 1);
    renderList();
}

// Keyboard Shortcut for Next Turn
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight") {
        event.preventDefault();
        nextTurn();
    }
});