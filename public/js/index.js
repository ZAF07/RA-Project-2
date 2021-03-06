// JS for active nav links

const arrOfLinkTab = Array.from(document.querySelectorAll('.main-nav-link'));

arrOfLinkTab.forEach(tab => {
  const currentTab = tab.innerHTML.toLowerCase();
  console.log(window.location.pathname);
  console.log('tab name --> ',tab.innerHTML);
  if (window.location.pathname === `/${currentTab}`) {
    tab.classList.add('active-tab');
  } else if (window.location.pathname === '/') {
    if (tab.innerHTML === 'Home') {
      tab.classList.add('active-tab');
    }
  } else if (window.location.pathname === '/jobs') {
    if (tab.innerHTML === 'View Jobs') {
      tab.classList.add('active-tab');
    }
  } else if (
    window.location.pathname === '/log-in') {
    if (tab.innerHTML === 'Log In') {
      tab.classList.add('active-tab');
    }
  }
})