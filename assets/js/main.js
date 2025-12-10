// ====== TERMINAL LOGIC (COMPLETE) ======

const bodyEl = document.getElementById("terminal-body");
let isProcessing = false;
let history = [];
let historyIndex = -1;
let currentInputSpan = null;

const COMMANDS = {
  help: `
Available commands:
  about           - Learn about me
  projects        - View my projects
  skills          - See my technical skills
  experience      - My work experience / internships
  education       - My educational background
  certifications  - View my certifications
  contact         - How to reach me
  clear           - Clear the terminal
`,
  about: `
  Hi, I’m Aashish S, a Computer Science Engineering student at GEC Wayanad,
  focused on web development, core system concepts, and building impactful software solutions.
  I love exploring new technologies, taking on creative challenges, and growing as a developer through hands-on projects.
`,
  projects: `
Projects:
  • Facebook Login Page Clone(Older version) : <a href="https://github.com/Aashish79947/Facebook-Old-Login-Page-Clone" target="_blank">https://github.com/Aashish79947/Facebook-Old-Login-Page-Clone</a><br>
  • Simple Web Calculator     : <a href="https://github.com/Aashish79947/Web-Calculator" target="_blank">https://github.com/Aashish79947/Web-Calculator</a><br>
  • Static portfolio websites : <a href="https://github.com/Aashish79947/Aashish-s-website" target="_blank">https://github.com/Aashish79947/Aashish-s-website</a>
  • Movie Ticket Reservation System : <a href="https://github.com/Aashish79947/Movie_Reservation" target="_blank">https://github.com/Aashish79947/Movie_Reservation</a>
`,
  skills: `
Skills:
  • Languages: C, C++, JavaScript
  • Frontend: HTML, CSS, Bootstrap
  • Backend Learning: Node.js (Basic)
  • Databases: MySQL
  • Tools & Platforms: Git, GitHub, VS Code, Windows + Linux CLI
  • Concepts: DBMS, OS, Networking basics
`,
  experience: `
Experience:
  • Class Representative, GEC Wayanad  
    - Coordinated class activities, managed communication, and organized academic workflows.

  • Web Development Projects  
    - Built multiple frontend projects including a Facebook Login Clone, Web Calculator, and portfolio sites.

  • DBMS & Lab Work  
    - Hands-on experience with MySQL, schema design, CRUD operations, and DBMS lab projects.

`,
  education: `
Education:
  • B.Tech in Computer Science & Engineering
    Government Engineering College, Wayanad
    (2023 – 2027)

`,
  certifications: `
Certifications:
  
`,
  contact: `
Contact:
  • Email: <a href="mailto:aashishpravitha@gmail.com">aashishpravitha@gmail.com</a>
  • GitHub: <a href="https://github.com/Aashish79947" target="_blank">github.com/Aashish79947</a><br>
  • Instagram: <a href="https://www.instagram.com/aah.shyy/?igsh=MXRsNWNobnptcmE2eQ%3D%3D" target="_blank">instagram.com/aah.shyy</a>
`
};

function scrollToBottom() {
  bodyEl.scrollTop = bodyEl.scrollHeight;
}

function typeLine(text, className = "") {
  return new Promise((resolve) => {
    const p = document.createElement("p");
    if (className) p.classList.add(className);
    bodyEl.appendChild(p);

    // If the line contains HTML (like <a> or <br>), don't animate char-by-char.
    // Just render it as HTML.
    if (text.includes("<a ") || text.includes("<br") || text.includes("</")) {
      p.innerHTML = text;
      scrollToBottom();
      resolve();
      return;
    }

    let i = 0;

    function step() {
      p.textContent = text.slice(0, i);
      scrollToBottom();
      if (i <= text.length) {
        i++;
        setTimeout(step, 12);
      } else resolve();
    }

    step();
  });
}


async function typeBlock(text, className = "") {
  const lines = text.trim().split("\n");
  for (const line of lines) {
    await typeLine(line, className);
  }
}

async function runCommand(command) {
  if (!command.trim()) return;

  if (command === "clear") {
    bodyEl.innerHTML = "";
    return;
  }

  if (COMMANDS[command]) {
    await typeBlock(COMMANDS[command], "output-text");
  } else {
    await typeLine(`bash: ${command}: command not found`, "error");
  }
}

function createInputLine(initial = "") {
  const line = document.createElement("div");
  line.className = "terminal-line";

  const prompt = document.createElement("span");
  prompt.className = "prompt";
  prompt.textContent = "aashish@portfolio:~$";

  const input = document.createElement("span");
  input.className = "input-area";
  input.contentEditable = "true";
  input.spellcheck = false;
  input.textContent = initial;

  line.append(prompt, " ", input);
  bodyEl.appendChild(line);

  currentInputSpan = input;
  attachInputEvents(input);
  focusAtEnd(input);
  scrollToBottom();
}

function focusAtEnd(node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function attachInputEvents(input) {
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isProcessing) return;

      const cmd = input.textContent.trim();
      input.contentEditable = "false";
      input.parentElement.classList.add("command-line");

      if (cmd) {
        history.push(cmd);
        historyIndex = history.length;
      }

      isProcessing = true;
      await runCommand(cmd);
      isProcessing = false;

      createInputLine();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      historyIndex = Math.max(0, historyIndex - 1);
      input.textContent = history[historyIndex];
      focusAtEnd(input);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.textContent = historyIndex === history.length ? "" : history[historyIndex];
      focusAtEnd(input);
    }
  });
}

async function showWelcome() {
  await typeLine(
    "help | about | projects | skills | experience | contact | education | certifications ",
    "menu-line"
  );
  await typeLine("");

  await typeLine("welcome", "soft-text");

  await typeBlock(
    `
Hi, I'm Aashish S.
Welcome to my interactive terminal portfolio.
Type 'help' to get started.
`,
    "output-text"
  );
}

(async function init() {
  await showWelcome();
  createInputLine();
})();

// ========== HOVER TILT (ONLY EFFECT LEFT) ==========

const card = document.querySelector(".id-card");

if (card) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 10; 
    const rotateX = ((y / rect.height) - 0.5) * -10;

    card.style.setProperty("--tilt-x", `${rotateX}deg`);
    card.style.setProperty("--tilt-y", `${rotateY}deg`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--tilt-x", `0deg`);
    card.style.setProperty("--tilt-y", `0deg`);
  });
}
