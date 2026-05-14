(function () {

  const style = document.createElement("style");

  style.innerHTML = `

  .rio-chat-button{
    position:fixed;
    bottom:20px;
    right:20px;
    width:60px;
    height:60px;
    border-radius:50%;
    background:#10b981;
    color:white;
    border:none;
    font-size:28px;
    cursor:pointer;
    z-index:9999;
    box-shadow:0 5px 20px rgba(0,0,0,0.2);
  }

  .rio-chat-container{
    position:fixed;
    bottom:90px;
    right:20px;
    width:360px;
    height:650px;
    background:white;
    border-radius:20px;
    overflow:hidden;
    display:none;
    flex-direction:column;
    box-shadow:0 5px 20px rgba(0,0,0,0.2);
    z-index:9999;
    font-family:Arial;
  }

  .rio-header{
    background:#10b981;
    color:white;
    padding:20px;
    display:flex;
    gap:15px;
    align-items:center;
  }

  .rio-avatar{
    width:50px;
    height:50px;
    border-radius:50%;
    background:white;
  }

  .rio-chat-box{
    flex:1;
    padding:20px;
    overflow-y:auto;
    background:#f8fafc;
  }

  .rio-message{
    margin-bottom:15px;
    display:flex;
  }

  .rio-user{
    justify-content:flex-end;
  }

  .rio-bot{
    justify-content:flex-start;
  }

  .rio-bubble{
    max-width:75%;
    padding:12px 16px;
    border-radius:15px;
    line-height:1.5;
  }

  .rio-user .rio-bubble{
    background:#10b981;
    color:white;
  }

  .rio-bot .rio-bubble{
    background:white;
    box-shadow:0 2px 5px rgba(0,0,0,0.1);
  }

  .rio-input-area{
    padding:15px;
    display:flex;
    gap:10px;
    border-top:1px solid #ddd;
  }

  .rio-input{
    flex:1;
    padding:15px;
    border:none;
    outline:none;
    border-radius:30px;
    background:#f1f5f9;
  }

  .rio-send{
    width:50px;
    height:50px;
    border:none;
    border-radius:50%;
    background:#10b981;
    color:white;
    cursor:pointer;
    font-size:20px;
  }

  `;

  document.head.appendChild(style);

  const button = document.createElement("button");
  button.className = "rio-chat-button";
  button.innerHTML = "💬";

  const container = document.createElement("div");
  container.className = "rio-chat-container";

  container.innerHTML = `

    <div class="rio-header">

      <div class="rio-avatar"></div>

      <div>
        <h2>Rio AI</h2>
        <p>Online</p>
      </div>

    </div>

    <div class="rio-chat-box" id="rioChatBox">

      <div class="rio-message rio-bot">
        <div class="rio-bubble">
          Hello 👋 <br>
          How can I help you today?
        </div>
      </div>

    </div>

    <div class="rio-input-area">

      <input
        class="rio-input"
        id="rioInput"
        placeholder="Type message..."
      >

      <button
        class="rio-send"
        id="rioSend"
      >
        ➤
      </button>

    </div>

  `;

  document.body.appendChild(button);
  document.body.appendChild(container);

  button.onclick = () => {

    if (container.style.display === "flex") {
      container.style.display = "none";
    } else {
      container.style.display = "flex";
    }

  };

  async function sendMessage() {

    const input =
      document.getElementById("rioInput");

    const message =
      input.value.trim();

    if (!message) return;

    const chatBox =
      document.getElementById("rioChatBox");

    chatBox.innerHTML += `
      <div class="rio-message rio-user">
        <div class="rio-bubble">
          ${message}
        </div>
      </div>
    `;

    input.value = "";

    const res = await fetch("https://portfolio-chatbot-cqyd.onrender.com/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: message
      })

    });

    const data = await res.json();

    // IMAGE
    if (data.image) {

      chatBox.innerHTML += `
        <div class="rio-message rio-bot">
          <div class="rio-bubble">
            <img
              src="data:image/png;base64,${data.image}"
              style="width:100%; border-radius:10px;"
            >
          </div>
        </div>
      `;

    }

    /    // TEXT
    if (data.reply) {

      const botMessage =
        document.createElement("div");

      botMessage.className =
        "rio-message rio-bot";

      botMessage.innerHTML = `
        <div class="rio-bubble">
          <span class="typing"></span>
        </div>
      `;

      chatBox.appendChild(botMessage);

      const typingElement =
        botMessage.querySelector(".typing");

      let index = 0;

      const typingInterval =
        setInterval(() => {

          typingElement.innerHTML +=
            data.reply.charAt(index);

          index++;

          chatBox.scrollTop =
            chatBox.scrollHeight;

          if (
            index >= data.reply.length
          ) {

            clearInterval(
              typingInterval
            );

          }

        }, 20);

    }

    chatBox.scrollTop =
      chatBox.scrollHeight;

  }

  document
    .getElementById("rioSend")
    .onclick = sendMessage;

  // SEND BUTTON + ENTER KEY

const rioInput =
  document.getElementById("rioInput");

const rioSend =
  document.getElementById("rioSend");

rioSend.onclick = sendMessage;

rioInput.addEventListener(
  "keydown",
  async function (e) {

    if (e.key === "Enter") {

      e.preventDefault();

      await sendMessage();

    }

  }
);
})();