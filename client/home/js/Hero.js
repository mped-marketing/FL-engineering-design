const getUrlParameter = (window) => {
  const array = window.split('/');
  return array[array.length - 1];
};

const id = getUrlParameter(window.location.href);
if (!id) {
  window.location = '/';
}
if (!isNaN(id)) {
  fetch(`/api/v2/hero/${id}`).then(result => result.json().then((result) => {
    document.getElementById(
      'Hero-top',
    ).innerHTML = `<h1 class="page-title__title">${result.title}</h1>`;
    const meta = document.createElement('meta');
    const metadesc = document.createElement('meta');
    const metaKey = document.createElement('meta');

    document.getElementById('pageTitle').innerText = `FL Engineering | ${result.title}`;
    meta.name = 'title';
    meta.content = result.title;
    metadesc.name = 'description';
    metadesc.content = result.description.slice(0, 160);
    metaKey.name = ' keywords';
    metaKey.content = result.tags;
    document.getElementsByTagName('head')[0].appendChild(meta);
    document.getElementsByTagName('head')[0].appendChild(metadesc);
    if (result.tags.length) {
      document.getElementsByTagName('head')[0].appendChild(metaKey);
    }

    document.getElementById(
      'hero-image',
    ).style.backgroundImage = `url(/api/v2/getFile/${result.image})`;
    document.getElementById('hero-body').innerHTML = `<b>${result.description}</b> <br> <br> <br>${result.body}`;
  })).catch((error) => {
    window.location = '/';
  });
} else {
  window.location = '/';
}
