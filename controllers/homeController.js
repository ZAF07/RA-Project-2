export const home = (req, res) => {
  res.render('homePage/home', {
    title: 'home',
    instructions: 'Create Home Page. Describe what this page is about.',
  });
};

export const register = (req, res) => {
  res.render('homePage/register', {
    title: 'home',
    instructions: 'Create Home Page. Describe what this page is about.',
  });
};
