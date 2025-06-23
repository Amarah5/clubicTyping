
// Matrix rain effect
const matrixRain = document.getElementById('matrix-rain');
const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

function createMatrixRain() {
  const columns = Math.floor(window.innerWidth / 20);
  matrixRain.innerHTML = '';
  
  for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.className = 'absolute top-0 text-matrix text-xs md:text-sm';
    column.style.left = `${i * 20}px`;
    column.style.animationDelay = `${Math.random() * 5}s`;
    column.style.animationDuration = `${5 + Math.random() * 10}s`;
    column.style.animationTimingFunction = 'linear';
    column.style.animationName = 'matrixFall';
    column.style.animationIterationCount = 'infinite';
    
    const length = 10 + Math.floor(Math.random() * 20);
    let content = '';
    for (let j = 0; j < length; j++) {
      content += chars[Math.floor(Math.random() * chars.length)];
    }
    column.textContent = content;
    
    matrixRain.appendChild(column);
  }
}

// Add CSS for matrix rain animation
const style = document.createElement('style');
style.textContent = `
  @keyframes matrixFall {
    0% {
      transform: translateY(-100%);
      opacity: 1;
    }
    80% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Typing animation for terminal
const typingText = document.getElementById('typing-text');
const textToType = 'ls';
let charIndex = 0;

function typeText() {
  if (charIndex < textToType.length) {
    typingText.textContent += textToType.charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 100 + Math.random() * 100);
  }
}

// Command validation
const input = document.getElementById("userInput");
const feedback = document.getElementById("feedback");
const submit = document.getElementById("submitBtn");
const nextMissionBtn = document.getElementById("nextMissionBtn");

submit.addEventListener("click", validateCommand);
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") validateCommand();
});

function validateCommand() {
  const value = input.value.trim();
  feedback.classList.remove('hidden');
  
  if (value === "ls") {
    feedback.className = "mt-4 p-3 rounded bg-green-900 bg-opacity-30 border border-green-500";
    feedback.innerHTML = `
      <p class="font-bold text-green-400 flex items-center">
        <i class="fas fa-check-circle mr-2"></i> Commande validée !
      </p>
      <p class="text-xs text-green-300 mt-1">Résultat: <span class="text-white">file1.txt file2.txt directory1</span></p>
    `;
    
    // Show next mission button
    nextMissionBtn.classList.remove('opacity-0', 'invisible');
    nextMissionBtn.classList.add('opacity-100', 'visible');
  } else {
    feedback.className = "mt-4 p-3 rounded bg-red-900 bg-opacity-30 border border-red-500";
    feedback.innerHTML = `
      <p class="font-bold text-red-400 flex items-center">
        <i class="fas fa-times-circle mr-2"></i> Erreur de commande
      </p>
      <p class="text-xs text-red-300 mt-1">Essaie encore. Astuce: tape juste "ls" sans autres caractères.</p>
    `;
  }
}

// Next mission button
nextMissionBtn.addEventListener('click', () => {
  // Animation before redirect
  document.body.classList.add('opacity-0', 'transition-opacity', 'duration-500');
  setTimeout(() => {
    window.location.href = 'mission2.html';
  }, 500);
});

// Initialize
window.addEventListener('load', () => {
  createMatrixRain();
  setTimeout(typeText, 1000);
  
  // Focus input field
  input.focus();
});

window.addEventListener('resize', createMatrixRain);
