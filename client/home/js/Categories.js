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
  fetch(`/api/v2/categories/get/${id}`).then(result => result.json().then((result) => {
    document.getElementById(
      'category-top',
    ).innerHTML = `<h1 class="page-title__title">${result.title}</h1>
      <p class="page-title__subtitle">${result.sub_title}</p>`;
    document.getElementById(
      'category-image',
    ).style.backgroundImage = `url(/api/v2/getFile/${result.image})`;
    document.getElementById('category-body').innerHTML = result.body;
  })).catch((error) => {
    window.location = '/';
  });
} else {
  window.location = '/';
}
