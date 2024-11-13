// Evento de clique
document.getElementById("clickButton").addEventListener("click", function () {
    document.getElementById("message").textContent = "Você clicou no botão!";
});

// Evento de duplo clique
document.getElementById("dblClickButton").addEventListener("dblclick", function () {
    document.getElementById("message").textContent = "Você deu um duplo clique!";
});

// Evento mouseover, mouseout e mousemove
const mouseOverButton = document.getElementById("mouseOverButton");
mouseOverButton.addEventListener("mouseover", function () {
    document.getElementById("message").style.color = "blue";
    document.getElementById("message").textContent = "O mouse está sobre o botão!";
});
mouseOverButton.addEventListener("mouseout", function () {
    document.getElementById("message").style.color = "#333";
    document.getElementById("message").textContent = "O mouse saiu do botão!";
});
mouseOverButton.addEventListener("mousemove", function (event) {
    document.getElementById("message").textContent = `Posição do Mouse - X: ${event.clientX}, Y: ${event.clientY}`;
});

// Eventos de teclado (keydown e keyup)
const textInput = document.getElementById("textInput");
textInput.addEventListener("keydown", function () {
    document.getElementById("message").textContent = "Você pressionou uma tecla.";
});
textInput.addEventListener("keyup", function () {
    document.getElementById("message").textContent = "Você liberou a tecla.";
});

// Evento change no campo de entrada do formulário
document.getElementById("inputField").addEventListener("change", function () {
    document.getElementById("message").textContent = "O campo foi alterado.";
});

// Evento submit do formulário
document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o envio real do formulário
    document.getElementById("message").innerHTML = "<strong>Formulário enviado!</strong>";
    document.getElementById("message").style.color = "green";
});