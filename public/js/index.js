const arrOfLinkTab = Array.from(document.querySelectorAll('.main-nav-link'));

arrOfLinkTab.forEach(tab => {
  const currentTab = tab.innerHTML.toLowerCase();
  console.log(window.location.pathname);
  console.log(tab.innerHTML);
  if (
    window.location.pathname === `/${currentTab}`
  ) {
    tab.classList.add('active-tab');
  } else if (window.location.pathname === '/') {
    if (tab.innerHTML === 'Home') {
      tab.classList.add('active-tab')
    }
  }
})