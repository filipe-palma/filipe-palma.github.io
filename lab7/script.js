document.addEventListener("DOMContentLoaded", () => {

    // 1. Mouse Over Event - Change Text
    const hoverText = document.getElementById("hoverText");
    hoverText.addEventListener("mouseover", () => {
        hoverText.textContent = "1. Obrigado por passares!";
    });
    hoverText.addEventListener("mouseout", () => {
        hoverText.textContent = "1. Passa por aqui!";
    });

    // 2. Color Change Event - Change Text Color for "2. Pinta-me!"
    const colorText = document.getElementById("colorText");
    document.getElementById("redBtn").addEventListener("click", () => {
        colorText.style.color = "red";
    });
    document.getElementById("greenBtn").addEventListener("click", () => {
        colorText.style.color = "green";
    });
    document.getElementById("blueBtn").addEventListener("click", () => {
        colorText.style.color = "blue";
    });

    // 3. Typing Event - Change Input Box Color on Key Press
    const textInput = document.getElementById("textInput");
    const colors = ["#FFDDC1", "#C1FFD7", "#C1D8FF", "#FFC1DD", "#D8FFC1"];
    let colorIndex = 0;

    textInput.addEventListener("input", () => {
        // Change to the next color in the array each time a character is typed
        textInput.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length; // Cycle through colors
    });

    // 4. Submit Color - "Escolha uma cor em inglês"
    document.querySelector("#submitColor").onclick = function () {
        document.querySelector("body").style.backgroundColor = colorInput.value;
    };

    // 5. Counter - "Conta!"
    let count = 0;
    const countDisplay = document.getElementById("countDisplay");
    const counterBtn = document.getElementById("counterBtn");
    counterBtn.addEventListener("click", () => {
        count += 1;
        countDisplay.textContent = count;
    });
});
