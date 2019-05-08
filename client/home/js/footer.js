fetch('/api/v2/getoptions').then(result => result.json().then((result) => {
  const {
    footer_logo,
    copyrights,
    facebook,
    twitter,
    logo,
    youtube,
    instagram,
    color,
    name,
    google,
    linkedin,
    footer,
    active,
    whats,
  } = result[0];
  if (active) {
    document.body.innerHTML = `
    <div class="layout-minimal main--div" style="background: url(https://i.ibb.co/BPnN55B/image-13.jpg) no-repeat">
      <div class="global-overlay shadow-9">
        <div class="overlay-inner bg-white opacity-70"></div>
        <div class="frame">
          <div class="frame-inner frame-inner-a bg-primary"></div>
          <div class="frame-inner frame-inner-b bg-primary"></div>
        </div>
      </div>
      <div class="container">

        <header class="site-header">
          <a href="/" class="logo mx-auto">
            <img class="logo" src="/api/v2/getFile/${logo}" alt="logo" />
          </a>
        </header>

        <div class="home-block">
          <div class="home-block-inner">

            <div id="home" class="d-flex min-vh--100 section">
              <div class="container align-self-center">
                <h1 class="mb-3 h1">We bulid beautiful digital experiences.</h1>
                <p class="lead mb-5 p">Our website is under construction. Well be here soon with our new awesome site</p>
                <div class="row">
                  <div class="col-12 col-md-8 col-lg-7"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    `;
  }
  if (footer_logo) {
    document.getElementById('footer-logo').innerHTML = `<img
    class="logo"
    src="/api/v2/getFile/${footer_logo}"
    alt="logo"
  />`;
  } else {
    document.getElementById('footer-logo').innerHTML = `<img
    class="logo"
    src="/api/v2/getFile/${logo}"
    alt="logo"
  />`;
  }
  document.getElementById('copyright').innerHTML = `&copy; ${copyrights}`;
  document.documentElement.style.setProperty('--main-color', color);
  document.getElementById('hidden--foter').textContent = footer;
  document.title = name;
  document.getElementById(
    'social-footer',
  ).innerHTML = `${facebook ? `<a href=${addHttp(facebook)} class="social social-facebook" title='facebook'><i class='ui-facebook'></i> </a>` : ''}`
  + `${twitter ? `<a href=${addHttp(twitter)} class="social social-twitter" title='twitter'><i class='ui-twitter'></i> </a>` : ''}`
  + `${youtube ? `<a href=${addHttp(youtube)} class="social social-youtube" title='youtube'><i class='ui-youtube'></i> </a>` : ''}`
  + `${instagram ? `<a href=${addHttp(instagram)} class="social social-instagram" title='instagram'><i class='ui-instagram'></i> </a>` : ''}`
  + `${google ? `<a href=${addHttp(google)} class="social social-google" title='google'><i class='ui-google'></i> </a>` : ''}`
  + `${linkedin ? `<a href=${addHttp(linkedin)} class="social social-linkedin" title='linkedin'><i class='ui-linkedin'></i> </a>` : ''}`
  + `${whats ? `<a href='tel:${whats}' class="social social-whatsapp" title='whatsapp'><i class='ui-whatsapp'></i> </a>` : ''}`;
}));
