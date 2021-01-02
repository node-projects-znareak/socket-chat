const messages = document.getElementById("messages");
const socket = io.connect("190.74.252.21:4000/", {
  forceNew: true,
});

const form = document.getElementById("form");
const audio = document.getElementById("alert");
const isPauseAudio = document.getElementById("pause-sound");
const perfilImage = document.getElementById("perfil-image");
const fr = new FileReader();

const renderMessage = ({ id, text, author, perfilImage } = {}) => {
  const tpl = `
    <div id="${id}" class="message">
      <img src="${
        perfilImage ? perfilImage : "./anon.jpg"
      }" class="message-perfil"/>
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
    perfilImage: localStorage.getItem("perfil_image") || fr.result || null,
  };

  socket.emit("new-message", payload);
};

document.addEventListener("DOMContentLoaded", () => {
  form.author.value = localStorage.getItem("author") || "Anónimo";
  isPauseAudio.checked = !!localStorage.getItem("isPauseAudio");
});

window.addEventListener("focus", () => {
  document.title = "ch4t.html";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
  tinyMCE.activeEditor.setContent('');
});

form.text.addEventListener("keydown", (e) => {
  if (e.keyCode == 13 && form.text.value !== "" && form.author.value !== "") {
    sendMessage();
  }
});

form.author.addEventListener("blur", (e) => {
  const name = e.target.value;

  if (name.match(/zNareak/gi)) {
    alert("Ese nombre no está permitido como usuario...");
    form.author.value = "Anónimo";
    return;
  }

  localStorage.setItem("author", name);
});

isPauseAudio.addEventListener("change", (e) => {
  localStorage.setItem("isPauseAudio", e.target.checked);
});

perfilImage.addEventListener("change", (e) => {
  const imageFile = e.target.files[0];
  fr.readAsDataURL(imageFile);
});

fr.addEventListener("load", () => {
  localStorage.setItem("perfil_image", fr.result);
});

socket.on("messages", (message) => {
  messages.innerHTML = render(message);
  messages.scrollTop = messages.scrollHeight;

  if (!isPauseAudio.checked) {
    audio.play();
  }

  document.title = "● ch4t.html";
});
