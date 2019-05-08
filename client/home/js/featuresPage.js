fetch('/api/v2/features/getAll').then(result => result.json().then((result) => {
  if (result.length) {
    let text = '';
    result.map((feature) => {
      text += `<div class="col-xl-4 col-lg-6">
          <div class="service-1">
              <a href="/feature?id=${feature.id}" class="service-1__url hover-scale">
                  <img src="/api/v2/getFile/${feature.image}" class="service-1__img" alt="">
              </a>
              <div class="service-1__info">
                  <h3 class="service-1__title">${feature.title}</h3>
                  <p>${feature.desc}</p>
              </div>
          </div>
      </div>
  `;
      return text;
    });
    document.getElementById('features-container').innerHTML = text;
  }
}));
fetch('/api/v2/getTitle').then(result => result.json().then((result) => {
  if (result.length) {
    const { featuressub } = result[0];
    document.getElementById('features-subtitle').innerText = featuressub;
  }
}));
