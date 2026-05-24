import { initGenerator } from './generator.js';
import { initScanner } from './scanner.js';

// Setup orchestrator once the script executes
function initializeApp() {
  const btnModeGen = document.getElementById('btn-mode-gen');
  const btnModeScan = document.getElementById('btn-mode-scan');

  const viewGenerator = document.getElementById('view-generator');
  const viewScanner = document.getElementById('view-scanner');

  // Trigger high speed modes switching
  function switchAppMode(mode) {
    if (mode === 'generator') {
      btnModeGen.className = 'flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/10';
      btnModeScan.className = 'flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-all duration-200';
      viewGenerator.classList.remove('hidden');
      viewScanner.classList.add('hidden');
    } else {
      btnModeScan.className = 'flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/10';
      btnModeGen.className = 'flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 transition-all duration-200';
      viewScanner.classList.remove('hidden');
      viewGenerator.classList.add('hidden');
    }
  }

  // Bind event listeners for mode selection
  btnModeGen.addEventListener('click', () => switchAppMode('generator'));
  btnModeScan.addEventListener('click', () => switchAppMode('scanner'));

  // Initialize modular controllers
  initGenerator();
  initScanner();

  // Populate vector SVGs via Lucide CDN loading
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
