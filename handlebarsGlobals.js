/* eslint-disable max-len */
const globalVars = {};


globalVars['headerFooter']= {
  links: [
    {
      title: 'Home',
      current: false,
      link: '/',
    },
    {
      title: 'About',
      current: false,
      link: '/about',
    },
    {
      title: 'Map',
      current: false,
      link: '/map',
    },
    {
      title: 'Profile',
      current: false,
      link: '/profile',

    },
    {
      title: 'Data Dashboard',
      current: false,
      link: '/reports',

    },
  ],
  footerContact: [
    {
      fas: '<i class="fa-solid fa-building"></i>',
      value: 'Tallahassee, Florida',
    },
    {
      fas: '<i class="fa-solid fa-envelope"></i>',
      value: '<a role="button" class="btn btn-secondary" href="mailto:supportBirdApp@proton.me"> Email Us</a>',
    },
  ],
  footerUsefulLinks: [
    {
      title: 'Institute for Bird Populations',
      link: 'https://www.birdpop.org/',
    },
    {
      title: 'National Audubon Society',
      link: 'https://www.audubon.org/',
    },
  ],
  footerHelpLinks: [
    {
      title: 'About',
      link: '/about',
    },
    {
      title: 'Help',
      link: '/help',
    },
    {
      title: 'Support',
      link: '/help',
    },
  ],
};

globalVars['accordion'] = [
  {
    id: 'faq-1_id',
    data_bs_target: 'faq-1_target',
    heading: 'What are these codes?',
    body: '<p class="faqText">Bird codes, also known as banding codes or alpha codes,'+' are abbreviations for bird names used ' +
            'by bird banders, ornithologists, and birdwatchers in North and Central America.'+
            ' The codes are written in capital letters, and look like, e.g., MODO for mourning dove.</p>' +
            '<p class="faqText">The first set contains four-letter codes based on English names while the second set ' +
            'contains six-letter codes based on the scientific names.</p>' +
            '<p class="faqText" >Source: <a href= "https://www.birdpop.org/pages/birdSpeciesCodes.php"> Institute for Bird Populations</a></p>',
  },
  {
    id: 'faq-2_id',
    data_bs_target: 'faq-2_target',
    heading: 'The map isn\'t working',
    body: '<p> Birdr needs to be able to access your current location.' +
          ' If your browser asks you grant Birdr permission to use your current location be sure to accept this request.' +
          ' If the map is still not working check your location settings on your browser or phone.',
  },
  {
    id: 'faq-3_id',
    data_bs_target: 'faq-3_target',
    heading: 'I\'m logged in but get a "bad request" error when I try to access the map or my profile',
    body: 'Click this <a href = "https://birdr-app.herokuapp.com/logout">link </a> and then log in again.',
  },
  // {
  //     id: 'faq-4_id',
  //     data_bs_target: 'faq-4_target',
  //     heading: 'Question 4',
  //     body: 'This is the answer to the question'
  // }
],

module.exports = {globalVars};

