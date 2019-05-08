const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  const results = regex.exec(location.search);
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
const id = getUrlParameter('id');
if (!id) {
  window.location = '/';
}
if (!isNaN(id)) {
  fetch(`/api/v2/features/${id}`).then(result => result.json().then((result) => {
    if (result) {
      document.getElementById(
        'features-top',
      ).innerHTML = `<h1 class="page-title__title">${result.title}</h1>
    <p class="page-title__subtitle">${result.sub_title}</p>`;
      document.getElementById(
        'features-image',
      ).style.backgroundImage = `url(/api/v2/getFile/${result.image})`;
      document.getElementById('features-body').innerHTML = `<b>${result.desc}</b> <br> <br> <br>${result.body}`;
    } else {
      window.location = '/';
    }
  })).catch((error) => {
    window.location = '/';
  });
} else {
  window.location = '/';
}
