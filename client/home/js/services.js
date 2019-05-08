fetch('/api/v2/services').then(result => result.json().then((result) => {
  if (result.length) {
    let text = '';
    result.map((service) => {
      text += ` <div class="col-xl-4 col-lg-6">
              <div class="service-1">
                <a href="/service/${service.seo}" class="service-1__url hover-scale service-image">
                  <img src="/api/v2/getFile/${service.icon}" class="service-1__img" alt="">
                </a>
                <div class="service-1__info">
                  <h3 class="service-1__title">${service.title}</h3>
                  <p class="service--description">${service.desc}</p>
                  <a href="/service/${service.seo}" class="read-more">
                    <span class="read-more__text">Read More</span>
                    <i class="ui-arrow-right read-more__icon"></i>
                  </a>
                </div>
              </div>
            </div>`;
      return text;
    });
    document.getElementById('services--row').innerHTML = text;
  }
}));

fetch('/api/v2/getTitle').then(result => result.json().then((result) => {
  if (result.length) {
    const { servicesub, tags_services } = result[0];
    const metaKey = document.createElement('meta');
    metaKey.name = ' keywords';
    metaKey.content = tags_services;
    console.log(tags_services);
    
    document.getElementById('services-subtitle').innerText = servicesub;
    document.getElementsByTagName('head')[0].appendChild(metaKey);
  }
}));


const meta = document.createElement('meta');
const metadesc = document.createElement('meta');
meta.name = 'title';
meta.content = 'Sedona';
metadesc.name = 'description';
fetch('/api/v2/about').then(result => result.json().then((result) => {
  const {
    desc,
  } = result;
  metadesc.content = desc.slice(0, 160);
  document.getElementsByTagName('head')[0].appendChild(meta);
  document.getElementsByTagName('head')[0].appendChild(metadesc);
}));
