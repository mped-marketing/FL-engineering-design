
const addHttp = (link) => {
  let newLink = '';
  if (!link.match(/^[a-zA-Z]+:\/\//)) {
    newLink = `https://${link}`;
    return newLink;
  }
  return link;
};
fetch('/api/v2/getoptions').then(result => result.json().then((result) => {
  const {
    facebook, twitter, instagram, youtube, google, mobile, logo,
  } = result[0];
  Array.from(document.getElementsByClassName('herder-icons')).map((element) => {
    element.innerHTML = `${facebook ? `<a href=${addHttp(facebook)} class="social social-facebook" title='facebook'><i class='ui-facebook'></i> </a>` : ''}`
    + `${twitter ? `<a href=${addHttp(twitter)} class="social social-twitter" title='twitter'><i class='ui-twitter'></i> </a>` : ''}`
    + `${youtube ? `<a href=${addHttp(youtube)} class="social social-youtube" title='youtube'><i class='ui-youtube'></i> </a>` : ''}`
    + `${instagram ? `<a href=${addHttp(instagram)} class="social social-instagram" title='instagram'><i class='ui-instagram'></i> </a>` : ''}`;
  });
  Array.from(document.getElementsByClassName('header-tel')).map((element) => {
    element.innerHTML = `${mobile ? `<a href="tel:${mobile}" class="nav__phone-number">Call us : ${mobile}</a>` : ''}`;
  });
  document.getElementById('header-logo').innerHTML = `<img src="/api/v2/getFile/${logo}" alt="logo" class="logo header--logo">`;
}));
