document.documentElement.classList.add('js');
document.addEventListener("visibilitychange", function () { document.hidden ? document.title = "On hold..." : document.title = "Amira's Portfolio"; }); // added last minute to change the title on idle because the example page I was referencing did it and it kept grabbing my attention 
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, {
    rootMargin: '-8% 0px -8% 0px', // thanks again stackoverflow for scroll reveal logic LOL
    threshold: 0.12,
  });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const previewSizes = ['size-desktop', 'size-tablet', 'size-mobile'];

const creativeToggle = document.getElementById('creativeMode');

const setCreativeMode = () => {
  document.body.classList.toggle('creative', creativeToggle.checked);
  localStorage.setItem('amiraPortfolioMode', creativeToggle.checked ? 'creative' : 'minimal');
};

creativeToggle.checked = localStorage.getItem('amiraPortfolioMode') === 'creative'; // honestly this is just here so i didnt need to keep toggling it for testing LOL
setCreativeMode();
creativeToggle.addEventListener('change', setCreativeMode);

document.querySelectorAll('[data-project][data-size]').forEach((button) => { // referenced stackoverflow threads once more for iframe embedding. never done it before and it's finicky
  button.addEventListener('click', () => {
    const { project, size } = button.dataset;
    const frame = document.querySelector(`[data-preview="${project}"] .frame`);
    if (!frame) return;
    document
      .querySelectorAll(`[data-project="${project}"]`)
      .forEach((projectButton) => {
        projectButton.classList.toggle('active', projectButton === button);
      });
    frame.classList.remove(...previewSizes);
    frame.classList.add(`size-${size}`);
  });
});