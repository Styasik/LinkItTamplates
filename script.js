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

        // Створюємо елементи стрілки і тексту окремо
        const arrow = document.createElement("span");
        arrow.classList.add("arrow");
        arrow.textContent = typeof structure[key] === "object" ? "▸" : "";

        const label = document.createElement("span");
        label.classList.add("label");
        label.textContent = key;

        item.appendChild(arrow);
        item.appendChild(label);
        parentElement.appendChild(item);

        // Якщо це кінцева папка з файлом
        if (typeof structure[key] === "string") {
            item.dataset.file = structure[key];
            item.addEventListener("click", () => loadWords(item));
        }

        // Якщо це підпапка
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

function loadWords(folderItem) {
    // Змінюємо вибрану папку
    document.querySelector(".folder.selected")?.classList.remove("selected");
    folderItem.classList.add("selected");

    const filePath = folderItem.dataset.file;
    mainTitle.textContent = folderItem.textContent;
    wordList.innerHTML = ""; // Очищаємо попередній список слів

    // Завантажуємо файл, який відповідає вибраній папці
    fetch(`Words/${filePath}`)
        .then(response => response.text())
        .then(text => {
            const lines = text.trim().split("\n").slice(1);  // Пропускаємо перший рядок
            const wordPairs = lines.map(line => {
                const [term, def] = line.split("/").map(x => x.trim());
                return { term, def };
            });

            // Створюємо картки для кожного слова
            wordPairs.forEach(entry => {
                const div = document.createElement("div");
                div.className = "word-card";
                div.innerHTML = `<strong>${entry.term}</strong> — ${entry.def}`;
                wordList.appendChild(div);
            });
        })
        .catch(err => console.error("Помилка завантаження файлу:", err));
}
