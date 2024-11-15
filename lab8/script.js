document.addEventListener("DOMContentLoaded", () => {
    const hoverText = document.getElementById("hoverText");
    hoverText.addEventListener("mouseover", () => {
        hoverText.textContent = "1. Obrigado por passares!";
    });
    hoverText.addEventListener("mouseout", () => {
        hoverText.textContent = "1. Passa por aqui!";
    });

    const colorText = document.getElementById("colorText");
    document.querySelectorAll(".color-buttons button").forEach(button => {
        button.addEventListener("click", () => {
            colorText.style.color = button.dataset.color;
        });
    });

    const textInput = document.getElementById("textInput");
    const colors = ["#FFDDC1", "#C1FFD7", "#C1D8FF", "#FFC1DD", "#D8FFC1"];
    let colorIndex = 0;

    textInput.addEventListener("input", () => {
        textInput.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    });

    document.querySelector("#colorSelect").onchange = function () {
        document.querySelector("body").style.backgroundColor = this.value;
    };

    let count = localStorage.getItem("counter") ? parseInt(localStorage.getItem("counter")) : 0;
    const countDisplay = document.getElementById("countDisplay");
    countDisplay.textContent = count;

    document.getElementById("counterBtn").addEventListener("click", () => {
        count += 1;
        localStorage.setItem("counter", count);
        countDisplay.textContent = count;
    });

    document.querySelector("#userForm").onsubmit = (e) => {
        e.preventDefault();
        const name = document.querySelector("#userName").value;
        const age = document.querySelector("#userAge").value;
        const messageElement = document.querySelector("#formMessage");
        messageElement.textContent = `Olá, o ${name} tem ${age}!`;
    };    

    let autoCount = 0;
    const autoCounter = document.getElementById("autoCounter");

    setInterval(() => {
        autoCount += 1;
        autoCounter.textContent = autoCount;
    }, 1000);
});
