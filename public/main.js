const messages = document.getElementById("messages");
const socket = io.connect("190.74.252.21:4000/", {
  forceNew: true,
});

const form = document.getElementById("form");
const audio = document.getElementById("alert");
const isPauseAudio = document.getElementById("pause-sound");

const renderMessage = ({ id, text, author } = {}) => {
  const tpl = `
    <div id="${id}" class="message">
      <img src="./anon.jpg" width="40" height="40" class="message-perfil"/>
      <div class="message-content">
        <strong class="author">${author}</strong>
        <p>${text}</p>
      </div>
    </div>
`;

  return tpl;
};

const render = (messages) => {
  return messages
    .map((message) => {
      return renderMessage(message);
    })
    .join(" ");
};

const sendMessage = () => {
  const text = tinymce.activeEditor.getContent();
  const payload = {
    author: form.author.value,
    text,
    id: 300,
  };

  socket.emit("new-message", payload);
  form.text.value = "";
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

form.text.addEventListener("keydown", (e) => {
  if (e.keyCode == 13 && form.text.value !== "" && form.author.value !== "") {
    sendMessage();
  }
});

form.author.addEventListener("blur", (e) => {
  const name = e.target.value;
  localStorage.setItem("author", name);
});

document.addEventListener("DOMContentLoaded", () => {
  form.author.value = localStorage.getItem("author") || "Anónimo";
  isPauseAudio.checked = !!localStorage.getItem("isPauseAudio");
});

isPauseAudio.addEventListener("change", (e) => {
  localStorage.setItem("isPauseAudio", e.target.checked);
});

window.addEventListener("focus", () => {
  document.title = "ch4t.html";
});

socket.on("messages", (message) => {
  messages.innerHTML = render(message);
  messages.scrollTop = messages.scrollHeight;

  if (!isPauseAudio.checked) {
    audio.play();
  }

  document.title = "● ch4t.html";
});
