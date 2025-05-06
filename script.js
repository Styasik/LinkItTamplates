const wordsData = {
    "Київська Русь": [
        { term: "Аскольд", def: "князь Києва" },
        { term: "Олег", def: "об'єднав північ і південь" },
        { term: "Ігор", def: "наступник Олега" },
        { term: "Ольга", def: "перша правителька" }
    ],
    "Історія України": [
        { term: "Б. Хмельницький", def: "гетьман, лідер визвольної війни" },
        { term: "УНР", def: "Українська Народна Республіка" },
        { term: "ЗУНР", def: "Західноукраїнська Народна Республіка" }
    ],
    "Словниковий запас": [
        { term: "Ерудит", def: "дуже обізнана людина" },
        { term: "Імпульсивний", def: "той, що діє раптово, не обдумуючи" },
        { term: "Інтуїція", def: "здатність відчувати без логіки" }
    ],
    "Англійські слова": [
        { term: "Apple", def: "яблуко" },
        { term: "Run", def: "бігати" },
        { term: "Blue", def: "синій" }
    ]
};

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

        // Додати нові слова
        wordsData[folderName].forEach(entry => {
            const div = document.createElement("div");
            div.className = "word-card";
            div.innerHTML = `<strong>${entry.term}</strong> — ${entry.def}`;
            wordList.appendChild(div);
        });
    });
});
