const folderList = document.querySelector(".folder-list");
const wordList = document.querySelector(".word-list");
const mainTitle = document.querySelector(".content h1");

// Завантажити структуру папок з JSON
fetch("wordStructure.json")
    .then(response => response.json())
    .then(structure => {
        buildFolderTree(structure, folderList, true);
    })
    .catch(err => console.error("Помилка завантаження структури:", err));

fetch("imageStructure.json")
    .then(response => response.json())
    .then(structure => {
        buildFolderTree(structure, folderList, false);
    })
    .catch(err => console.error("Помилка завантаження структури:", err));

function buildFolderTree(structure, parentElement, areWords, level = 0) {
    for (const key in structure) {
        const item = document.createElement("li");
        item.classList.add("folder");
        if (level === 1) item.classList.add("subfolder");
        if (level === 2) item.classList.add("subsubfolder");

        const arrow = document.createElement("span");
        arrow.classList.add("arrow");
        arrow.textContent = typeof structure[key] === "object" ? "▸" : "";

        const label = document.createElement("span");
        label.classList.add("label");
        label.textContent = (areWords ? "📄 " : "🖼 ") + key;

        item.appendChild(arrow);
        item.appendChild(label);
        parentElement.appendChild(item);

        if (typeof structure[key] === "string") {
            item.dataset.file = structure[key];
            item.dataset.areWords = areWords;
            item.addEventListener("click", () => {
                const isWords = item.dataset.areWords === "true";
                loadElements(item, isWords);
            });
                
        }

        if (typeof structure[key] === "object") {
            const subList = document.createElement("ul");
            subList.classList.add("folder-list", "hidden");
            parentElement.appendChild(subList);
            buildFolderTree(structure[key], subList, areWords, level + 1);

            item.addEventListener("click", (e) => {
                e.stopPropagation();
                subList.classList.toggle("hidden");
                item.classList.toggle("expanded");

                const arrowEl = item.querySelector(".arrow");
                if (arrowEl) {
                    arrowEl.textContent = item.classList.contains("expanded") ? "▼" : "▸";
                }
            });
        }
    }
}

const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebar = document.querySelector(".sidebar");

hamburgerBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

const startGameButton = document.getElementById("startGameButton");
let selectedFilePath = null;
let currentFolderType = "Words";

function loadElements(folderItem, areWords) {
    currentFolderType = areWords ? "Words" : "Images";

    document.querySelector(".folder.selected")?.classList.remove("selected");
    folderItem.classList.add("selected");

    const filePath = folderItem.dataset.file;
    selectedFilePath = filePath;
    startGameButton.classList.add("enabled");
    startGameButton.disabled = false;

    mainTitle.textContent = folderItem.textContent;
    wordList.innerHTML = "";

    fetch(`${currentFolderType}/${filePath}`)
        .then(response => response.text())
        .then(text => {
            const lines = text.trim().split("\n").slice(1); // Пропускаємо заголовок
            const pairs = lines.map(line => {
                const [first, second] = line.split("/").map(x => x.trim());
                return { first, second };
            });

            if (areWords == true)
            {
                pairs.forEach(entry => {
                    const div = document.createElement("div");
                    div.className = "word-card";
                    div.innerHTML = `${entry.first} \n— \n<strong>${entry.second}</strong>`;
                    wordList.appendChild(div);
            });
            }
            else 
            {
                pairs.forEach(entry => {
                    const div = document.createElement("div");
                    div.className = "word-card";
                    div.innerHTML = `<img src="Photos/${entry.second}" alt="${entry.first}"><strong>${entry.first}</strong>`;
                    wordList.appendChild(div);
                });
            }
            })
        .catch(err => console.error("Помилка завантаження файлу:", err));
}

startGameButton.addEventListener("click", () => {
    if (selectedFilePath) {
        const fileUrl = encodeURIComponent(`https://styasik.github.io/LinkItTemplates/${currentFolderType}/${selectedFilePath}`);
        const deeplink = `linkitwords://loadfile?path=${fileUrl}`;
        window.location.href = deeplink;
    } else {
        alert("Будь ласка, виберіть файл!");
    }
});

