const messages = document.getElementById("messages");
const socket = io.connect("http://localhost:8080", {
  forceNew: true,
});

const form = document.getElementById("form");
const renderMessage = ({ id, text, author } = {}) => {
  const tpl = `<div id="${id}" class="message">
   <strong>${author}</strong> <br />
   <p>${text}</p>
</div>
`;

  return tpl;
};

const render = (messages) => {
  return messages.map((message) => {
    return renderMessage(message);
  }).join(" ")
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const payload = {
    author: form.author.value,
    text: form.text.value,
    id: 300,
  };

  socket.emit("new-message", payload);
});

socket.on("messages", (message) => {
  messages.innerHTML = render(message);
});
