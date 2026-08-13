import { initPageListModal } from './pageListModal.js';

window.addEventListener('DOMContentLoaded', () => {
  const counter = document.getElementById('page-counter');
  if (counter) {
    initPageListModal({ mode: 'modal', showUnvisitedTitle: false, pageHref: '' });
  }
});
