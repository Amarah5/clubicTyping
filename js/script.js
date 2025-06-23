// DOM Elements
const timerEl = document.getElementById("timer");
const input = document.getElementById("input");
const startBtnDiv = document.getElementById("startBtnDiv");
const startBtn = document.getElementById("startBtn");
const result = document.getElementById("result");
const textDisplay = document.getElementById("textDisplay");
const themeToggle = document.getElementById("themeToggle");
const progressBar = document.getElementById("progressBar");
const wordsCountEl = document.getElementById("wordsCount");
const liveWpm = document.getElementById("liveWpm");
const liveAccuracy = document.getElementById("liveAccuracy");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalScore = document.getElementById("finalScore");
const speedRating = document.getElementById("speedRating");
const precisionRating = document.getElementById("precisionRating");
const consistencyRating = document.getElementById("consistencyRating");
const restartBtn = document.getElementById("restartBtn");
const playerIdEl = document.getElementById("playerId");
const missionBrief = document.getElementById("missionBrief");

const typingSound = document.getElementById("typingSound");
const completeSound = document.getElementById("completeSound");
const errorSound = document.getElementById("errorSound");
const terminalLoop = document.getElementById("terminalLoop");

let time = 60;
let interval;
let isRunning = false;
let currentText = "";
let charSpans = [];
let currentCharIndex = 0;
let correctCharsCount = 0;
let totalTypedChars = 0;
let wpmHistory = [];
let accuracyHistory = [];
let currentStep = "command"; // ou 'explanation'

const commands = [
  {
    command: "sudo nmap -sS 192.168.1.1",
    mission: "Scanner la machine cible pour les ports ouverts (NMAP)",
    explanation:
      "Lance un scan SYN (Stealth Scan) sur l'adresse IP 192.168.1.1 pour identifier les ports ouverts sans établir une connexion complète.",
  },
  {
    command: "ssh root@target-machine -p 2222",
    mission: "Connexion SSH au port personnalisé",
    explanation:
      "Établit une connexion sécurisée (SSH) en tant qu'utilisateur 'root' à une machine cible via le port TCP 2222, au lieu du port SSH standard (22).",
  },
  {
    command: "cat /etc/passwd | grep admin",
    mission: "Lister les utilisateurs contenant 'admin'",
    explanation:
      "Affiche le contenu du fichier '/etc/passwd' (qui contient les informations sur les utilisateurs du système) et filtre les lignes contenant le mot 'admin' pour trouver des comptes pertinents.",
  },
  {
    command: "ls -la /var/www/html",
    mission: "Afficher les fichiers du serveur web",
    explanation:
      "Liste tous les fichiers et dossiers (y compris cachés) dans le répertoire '/var/www/html', qui est le chemin par défaut pour les fichiers web sur de nombreux serveurs Apache, avec des détails sur leurs permissions.",
  },
  {
    command:
      "curl -X POST -d 'username=admin&password=1234' http://localhost/login",
    mission: "Effectuer une injection HTTP avec CURL",
    explanation:
      "Envoie une requête HTTP POST à l'adresse 'http://localhost/login' avec les données 'username=admin' et 'password=1234', simulant une tentative de connexion, souvent utilisée pour tester des injections ou des vulnérabilités.",
  },
  {
    command: "sudo systemctl restart apache2",
    mission: "Redémarrer le service Apache",
    explanation:
      "Redémarre le service du serveur web Apache (apache2) avec des privilèges superutilisateur (sudo). Utile après avoir modifié les fichiers de configuration ou pour résoudre des problèmes de service.",
  },
];

/**
 * Loads text into the display area, creating span elements for each character.
 * Resets the current character index and input field.
 * @param {string} content The text to be displayed.
 */
function loadText(content) {
  charSpans = content.split("").map((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.id = `char-${index}`; // Ensure the ID is added for consistency
    span.classList.add("char-untouched");
    return span;
  });
  textDisplay.innerHTML = "";
  charSpans.forEach((span) => textDisplay.appendChild(span));
  currentCharIndex = 0; // Reset typing position
  input.value = ""; // Clear input field
}

/**
 * Initializes a new game round. Selects a random command, sets up the display,
 * and resets all game-related variables.
 */
function initGame() {
  currentStep = "command";
  isRunning = false;
  clearInterval(interval); // Clear any running timer

  const selection = commands[Math.floor(Math.random() * commands.length)];
  currentText = selection.command;
  missionBrief.textContent = `MISSION : ${selection.mission}`;

  // Use the new loadText function to set up the display
  loadText(currentText);

  input.disabled = true; // Disable input until test starts
  input.placeholder = "Terminal d’infiltration actif...";
  startBtnDiv.style.display = "block"; // Show the start button
  result.style.display = "none"; // Hide final results

  timerEl.textContent = `01:00`; // Reset timer display
  time = 60; // Reset game time
  correctCharsCount = 0;
  totalTypedChars = 0;
  wpmHistory = [];
  accuracyHistory = [];
  wordsCountEl.textContent = `0/${currentText.split(" ").length}`;
  progressBar.style.width = "0%";
  updateLiveStats(); // Update live stats display to initial state
}

/**
 * Starts the typing test. Enables input, starts the timer, and plays sounds.
 */
function startTest() {
  if (isRunning) return; // Prevent starting multiple tests

  // Re-initialize game state for a fresh start in case restartTest calls it
  initGame();

  isRunning = true;
  input.disabled = false;
  input.focus(); // Focus on input for immediate typing
  startBtnDiv.style.display = "none"; // Hide the start button
  terminalLoop.play(); // Play background terminal sound

  interval = setInterval(() => {
    time--;
    timerEl.textContent = `00:${time < 10 ? "0" + time : time}`; // Format time display
    updateLiveStats(); // Update WPM and accuracy live
    if (time <= 0 || currentCharIndex >= currentText.length) endTest(); // End test if time runs out or text is fully typed
  }, 1000);

  typingSound.currentTime = 0; // Rewind and play typing sound
  typingSound.play();
}

/**
 * Ends the typing test. Stops the timer, calculates final metrics, and displays results.
 */
function endTest() {
  if (!isRunning) return; // Prevent ending test if not running
  clearInterval(interval); // Stop the timer
  isRunning = false;
  input.disabled = true; // Disable input
  startBtnDiv.style.display = "block"; // Show start/restart button
  terminalLoop.pause(); // Pause background sound
  terminalLoop.currentTime = 0; // Rewind background sound

  const elapsedSeconds = 60 - time;
  const elapsedMinutes = elapsedSeconds / 60;
  let finalWpmValue = 0;
  if (elapsedMinutes > 0)
    finalWpmValue = Math.round(correctCharsCount / 5 / elapsedMinutes); // Calculate WPM

  const finalAccuracyValue =
    totalTypedChars > 0
      ? Math.round((correctCharsCount / totalTypedChars) * 100)
      : 0; // Calculate Accuracy

  const finalScoreValue = Math.round(
    finalWpmValue * (finalAccuracyValue / 100)
  ); // Calculate overall score

  finalWpm.textContent = finalWpmValue;
  finalAccuracy.textContent = `${finalAccuracyValue}%`;
  finalScore.textContent = finalScoreValue;

  speedRating.textContent = getRating(finalWpmValue, [30, 60, 90]);
  precisionRating.textContent = getRating(finalAccuracyValue, [70, 85, 95]);

  // Calculate consistency based on WPM history variance
  const avgWpm =
    wpmHistory.reduce((a, b) => a + b, 0) / (wpmHistory.length || 1);
  const variance =
    wpmHistory.reduce((a, b) => a + Math.pow(b - avgWpm, 2), 0) /
    (wpmHistory.length || 1);
  const consistency = Math.max(
    0,
    Math.round(100 - (Math.sqrt(variance) / (avgWpm || 1)) * 100)
  );
  consistencyRating.textContent = getRating(consistency, [70, 85, 95]);

  result.style.display = "block"; // Show final results section
  completeSound.currentTime = 0;
  completeSound.play(); // Play completion sound
}

/**
 * Determines a star rating based on a value and predefined thresholds.
 * @param {number} value The value to rate.
 * @param {number[]} thresholds An array of three thresholds for star ratings (e.g., [low, medium, high]).
 * @returns {string} The star rating string (e.g., "★★★").
 */
function getRating(value, thresholds) {
  if (value >= thresholds[2]) return "★★★★★";
  if (value >= thresholds[1]) return "★★★★";
  if (value >= thresholds[0]) return "★★★";
  return "★★";
}

/**
 * Updates the live WPM and Accuracy displays.
 */
function updateLiveStats() {
  if (!isRunning) {
    liveWpm.textContent = `-- WPM`;
    liveAccuracy.textContent = `--%`;
    return;
  }
  const elapsedSeconds = 60 - time;
  const elapsedMinutes = elapsedSeconds / 60;
  let currentWpm = 0;
  if (elapsedMinutes > 0)
    currentWpm = Math.round(correctCharsCount / 5 / elapsedMinutes);
  const currentAccuracy =
    totalTypedChars > 0
      ? Math.round((correctCharsCount / totalTypedChars) * 100)
      : 0;
  liveWpm.textContent = `${currentWpm} WPM`;
  liveAccuracy.textContent = `${currentAccuracy}%`;
  // Only push to history if elapsedSeconds is positive to avoid initial 0/0 scenarios
  if (elapsedSeconds > 0 && currentWpm > 0) {
    wpmHistory.push(currentWpm);
    accuracyHistory.push(currentAccuracy);
  }
}

// --- Event Listeners ---

input.addEventListener("input", (e) => {
  if (!isRunning) return; // Only process input if test is running
  const typedText = input.value;
  totalTypedChars = typedText.length;
  correctCharsCount = 0; // Reset correct count for recalculation
  typingSound.currentTime = 0;
  typingSound.play(); // Play typing sound with each input

  charSpans.forEach((charSpan, index) => {
    const targetChar = currentText[index];
    const typedChar = typedText[index];
    charSpan.className = ""; // Clear existing classes

    if (index < totalTypedChars) {
      // Character has been typed
      if (typedChar === targetChar) {
        charSpan.classList.add("char-correct");
        correctCharsCount++;
      } else {
        charSpan.classList.add("char-incorrect");
        errorSound.currentTime = 0;
        errorSound.play(); // Play error sound on incorrect character
      }
    } else if (index === totalTypedChars) {
      // Current character to be typed
      charSpan.classList.add("char-current");
    } else {
      // Untouched characters
      charSpan.classList.add("char-untouched");
    }
  });

  currentCharIndex = totalTypedChars; // Update current typing position
  progressBar.style.width = `${(currentCharIndex / currentText.length) * 100}%`; // Update progress bar

  // Calculate completed words
  let completedWords = 0;
  let currentWordIndexInText = 0;
  currentText.split(" ").forEach((word) => {
    // Check if the current typing position has passed the end of the word
    if (currentCharIndex >= currentWordIndexInText + word.length) {
      const typedSubstring = typedText.substring(
        currentWordIndexInText,
        currentWordIndexInText + word.length
      );
      if (typedSubstring === word) completedWords++; // If the typed part matches the word, it's completed
    }
    currentWordIndexInText += word.length + 1; // Move to the start of the next word (plus space)
  });
  wordsCountEl.textContent = `${completedWords}/${
    currentText.split(" ").length
  }`;

  if (currentCharIndex >= currentText.length) endTest(); // End test if all characters are typed
  updateLiveStats(); // Update live stats after processing input
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = themeToggle.querySelector("i");
  const text = themeToggle.querySelector("span");
  if (document.body.classList.contains("dark")) {
    icon.classList.replace("fa-moon", "fa-sun");
    text.textContent = "Light Mode";
    document.body.style.backgroundColor = "#121212"; // Example dark mode background
    document.body.style.color = "#ffffff"; // Example dark mode text color
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
    text.textContent = "Dark Mode";
    document.body.style.backgroundColor = "#ffffff"; // Example light mode background
    document.body.style.color = "#000000"; // Example light mode text color
  }
});

startBtn.addEventListener("click", startTest);
restartBtn.addEventListener("click", startTest); // Both buttons now call startTest to re-initialize and begin

document.addEventListener("DOMContentLoaded", () => {
  initGame(); // Initialize the game when the DOM is fully loaded
  playerIdEl.textContent = Math.floor(Math.random() * 9000 + 1000); // Generate a random player ID
});
