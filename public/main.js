const messages = document.getElementById("messages");
const socket = io.connect("http://201.242.175.188:4000/", {
  forceNew: true,
});

const form = document.getElementById("form");
const audio = document.getElementById("alert");

const renderMessage = ({ id, text, author } = {}) => {
  const tpl = `<div id="${id}" class="message">
   <strong class="author">${author}</strong>
   <p>${text}</p>
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
  const payload = {
    author: form.author.value,
    text: form.text.value,
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

socket.on("messages", (message) => {
  messages.innerHTML = render(message);
  messages.scrollTop = messages.scrollHeight;
  audio.play();
});
