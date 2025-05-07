const folderList = document.querySelector(".folder-list");
const wordList = document.querySelector(".word-list");
const mainTitle = document.querySelector(".content h1");

// Завантажити структуру папок з JSON
fetch("structure.json")
    .then(response => response.json())
    .then(structure => {
        buildFolderTree(structure, folderList);
    })
    .catch(err => console.error("Помилка завантаження структури:", err));

function buildFolderTree(structure, parentElement, level = 0) {
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
        label.textContent = key;

        item.appendChild(arrow);
        item.appendChild(label);
        parentElement.appendChild(item);

        if (typeof structure[key] === "string") {
            item.dataset.file = structure[key];
            item.addEventListener("click", () => loadWords(item));
        }

        if (typeof structure[key] === "object") {
            const subList = document.createElement("ul");
            subList.classList.add("folder-list", "hidden");
            parentElement.appendChild(subList);
            buildFolderTree(structure[key], subList, level + 1);

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

startGameButton.addEventListener("click", () => {
    if (selectedFilePath) {
        const fileName = encodeURIComponent(mainTitle.textContent.trim());
        const fileUrl = encodeURIComponent(`https://yourhost.com/Words/${selectedFilePath}`);
        const deeplink = `linkitwords://loadfile?path=${fileUrl}`;
        window.location.href = deeplink;
    } else {
        alert("Будь ласка, виберіть файл!");
    }
});