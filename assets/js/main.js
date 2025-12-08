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
Hi, I'm Aashish MK, a Computer Science engineering student from
GEC Wayanad. I enjoy building web apps, learning OS, and creating
useful tools.
`,
  projects: `
Projects:
  • JSON-based Dynamic Portfolio Builder
  • Community Skill Trading Platform (concept)
  • IV Fund Management Sheet
`,
  skills: `
Skills:
  • C, C++, JavaScript
  • HTML, CSS, Bootstrap
  • Git, GitHub, VS Code
  • DBMS Lab (MySQL)
`,
  experience: `
Experience:
  • CS Student at GEC Wayanad
  • Class Representative
  • Web dev & DBMS lab work
`,
  education: `
Education:
  • B.Tech CSE, GEC Wayanad (2023–2027)
`,
  certifications: `
Certifications:
  • (Add yours)
`,
  contact: `
Contact:
  • Email: your.email@example.com
  • GitHub: github.com/YourName
  • LinkedIn: linkedin.com/in/yourprofile
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
