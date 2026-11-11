/* =========================================================
   chatbot.js
   This makes the "Ask the assistant" chat box work.

   How it works (no real AI):
   1. You type a question.
   2. The code looks for keywords in it (like "price" or "battery").
   3. It shows the prepared answer that matches.
   ========================================================= */


/* ---------- 1. The answers the chatbot knows ----------
   Each answer has:
   - keywords: words to look for in the question
   - reply:    what the chatbot says back
   The bot checks them from top to bottom and uses the FIRST match,
   so specific topics (battery, camera) come before general ones (help).
   To teach the bot something new, copy one block and edit it. */
const answers = [
  {
    keywords: ["price", "cost", "how much", "expensive", "cheap"],
    reply: "Designing your phone is free. Every phone starts at a $199 base, plus the parts you choose. Our builds cost $534, $894 or $1,444 (CAD)."
  },
  {
    keywords: ["essential"],
    reply: "The Essential build is $534: a 6.1\" screen, dual camera, 5,000 mAh battery and 128 GB of storage. Great for calls, messages and social media."
  },
  {
    keywords: ["everyday"],
    reply: "The Everyday build is $894: a smooth 120 Hz screen, triple camera with 3x zoom, 5,000 mAh battery and 256 GB. Our most popular choice."
  },
  {
    keywords: ["pro build"],
    reply: "The Pro build is $1,444: a 6.8\" screen, Pro camera with 5x zoom, 6,000 mAh battery and 512 GB. Made for photography and gaming."
  },
  {
    keywords: ["battery", "mah"],
    reply: "A bigger battery lasts longer, but a bigger battery adds weight. The 6,000 mAh battery adds 16 g compared to the 5,000 mAh one."
  },
  {
    keywords: ["camera", "photo", "zoom"],
    reply: "The dual camera is great in daylight. The triple camera adds 3x zoom. The Pro camera is best at night with 5x zoom, but it costs $140 more."
  },
  {
    keywords: ["storage", "gb", "space"],
    reply: "128 GB is fine if your photos are saved in the cloud. 256 GB suits most people. 512 GB is for lots of video."
  },
  {
    keywords: ["choose", "recommend", "which", "help"],
    reply: "Tell me your budget! Under $700: the Essential build ($534). $700 to $1,100: the Everyday build ($894). Over $1,100: the Pro build ($1,444)."
  },
  {
    keywords: ["how does", "how it works", "work"],
    reply: "You answer a few questions about how you use your phone, what matters most and your budget. I recommend a camera, battery, storage, screen and design. Then you review the price and change anything you like."
  },
  {
    keywords: ["team", "who made", "who built", "phonedation"],
    reply: "PhoneBuilder is made by Team Phonedation: Ouassim Bendahmane, Joshua El-Chibani, Nsasso Mbia Eweba Yves, Ben Huszagh, Sylviane Metchom Nguepeing and E-J Qendro."
  },
  {
    keywords: ["hello", "hi", "hey"],
    reply: "Hi! Ask me about prices, phone parts, or how PhoneBuilder works."
  },
  {
    keywords: ["thank"],
    reply: "You're welcome!"
  }
];

// What the bot says when it doesn't find any keyword
const defaultReply = "Sorry, I'm not sure about that. Try asking about prices, the battery, the camera, storage or our team.";


/* ---------- 2. Find the parts of the page we need ----------
   document.getElementById finds an element by its id="..." in the HTML. */
const chatButton   = document.getElementById("chat-button");
const chatWindow   = document.getElementById("chat-window");
const closeButton  = document.getElementById("chat-close");
const messagesBox  = document.getElementById("chat-messages");
const chatForm     = document.getElementById("chat-form");
const chatInput    = document.getElementById("chat-input");


/* ---------- 3. Open and close the chat window ---------- */
function openChat() {
  chatWindow.classList.add("open");   // style.css shows the window when it has the "open" class
  chatButton.style.display = "none";  // hide the round button while the chat is open
  chatInput.focus();                  // put the cursor in the text box
}

function closeChat() {
  chatWindow.classList.remove("open");
  chatButton.style.display = "block";
}

chatButton.addEventListener("click", openChat);
closeButton.addEventListener("click", closeChat);


/* ---------- 4. Show a message in the chat ----------
   sender is either "bot" or "user" (it decides the colour). */
function addMessage(text, sender) {
  const message = document.createElement("div");  // make a new <div>
  message.className = "message " + sender;
  message.textContent = text;
  messagesBox.appendChild(message);               // put it in the chat
  messagesBox.scrollTop = messagesBox.scrollHeight; // scroll to the newest message
}


/* ---------- 5. Choose the right answer ---------- */
function getReply(question) {
  const lowerCaseQuestion = question.toLowerCase();  // "PRICE" and "price" count the same

  // Go through every answer, one by one
  for (const answer of answers) {
    // Go through every keyword of that answer
    for (const keyword of answer.keywords) {
      if (lowerCaseQuestion.includes(keyword)) {
        return answer.reply;   // found one! stop and send this reply
      }
    }
  }
  return defaultReply;         // no keyword found
}


/* ---------- 6. Ask a question ---------- */
function askQuestion(question) {
  addMessage(question, "user");          // show what you asked

  // wait 0.4 seconds so it feels like the bot is thinking
  setTimeout(function () {
    addMessage(getReply(question), "bot");
  }, 400);
}

// When you press Enter or click Send
chatForm.addEventListener("submit", function (event) {
  event.preventDefault();               // stops the page from reloading
  const question = chatInput.value.trim();
  if (question === "") return;          // ignore empty messages
  askQuestion(question);
  chatInput.value = "";                 // empty the text box
});


/* ---------- 7. Buttons that ask a question for you ----------
   Any button with data-question="..." in the HTML opens the chat
   and asks that question. Used for the quick-question buttons in
   the chat and the "Choose" buttons on the Pricing page. */
const questionButtons = document.querySelectorAll("[data-question]");

for (const button of questionButtons) {
  button.addEventListener("click", function () {
    openChat();
    askQuestion(button.dataset.question);
  });
}

// Buttons with the class "open-chat" just open the chat
const openButtons = document.querySelectorAll(".open-chat");
for (const button of openButtons) {
  button.addEventListener("click", openChat);
}


/* ---------- 8. First message when the page loads ---------- */
addMessage("Hi! I'm the PhoneBuilder assistant. Ask me anything, or tap a question below.", "bot");
