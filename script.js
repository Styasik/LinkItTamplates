const folderItems = document.querySelectorAll(".folder");
const wordList = document.querySelector(".word-list");
const mainTitle = document.querySelector(".content h1");

folderItems.forEach(item => {
    item.addEventListener("click", () => {
        // Змінити активну папку
        document.querySelector(".folder.selected")?.classList.remove("selected");
        item.classList.add("selected");

        const folderName = item.textContent;
        mainTitle.textContent = folderName;

        // Очистити список
        wordList.innerHTML = "";

        // Завантажити файл, що відповідає вибраній папці
        fetch(`Words/${folderName}.txt`)
            .then(response => response.text())
            .then(text => {
                // Розбиваємо вміст файлу на рядки
                const lines = text.trim().split('\n');
                const title = lines[0];  // перший рядок — назва
                const wordPairs = lines.slice(1).map(line => {
                    const [term, def] = line.split("—").map(x => x.trim());
                    return { term, def };
                });

                // Додаємо нові слова в список
                wordPairs.forEach(entry => {
                    const div = document.createElement("div");
                    div.className = "word-card";
                    div.innerHTML = `<strong>${entry.term}</strong> — ${entry.def}`;
                    wordList.appendChild(div);
                });
            })
            .catch(err => console.error('Помилка завантаження файлу:', err));
    });
});
