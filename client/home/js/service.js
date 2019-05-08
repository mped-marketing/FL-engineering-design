const serviceTitle = document.getElementById('service--title');
const serviceImage = document.getElementById('service--image');
const serviceBody = document.getElementById('service--body');
const meta = document.createElement('meta');
const metadesc = document.createElement('meta');
const metaKey = document.createElement('meta');

const getUrlParameter = (window) => {
  const array = window.split('/');
  return array[array.length - 1];
};

const seo = getUrlParameter(window.location.href);
if (!seo) {
  window.location = '/';
}
fetch(`/api/v2/serviceId/${seo}`).then(result => result.json().then((result) => {
  const {
    title, icon, body, desc,
  } = result;
  serviceTitle.textContent = title;
  document.getElementById('pageTitle').innerText = `FL Engineering | ${title}`;

  meta.name = 'title';
  meta.content = title;
  metadesc.name = 'description';
  metaKey.name = ' keywords';
  metaKey.content = result.tags;
  metadesc.content = desc.slice(0, 160);
  document.getElementsByTagName('head')[0].appendChild(meta);
  document.getElementsByTagName('head')[0].appendChild(metadesc);
  document.getElementsByTagName('head')[0].appendChild(metaKey);


  if (result.tags.length) {
    document.getElementsByTagName('head')[0].appendChild(metaKey);
  }
  serviceImage.style = `background-image: url(/api/v2/getFile/${icon})`;
  serviceBody.innerHTML = body;
})).catch((error) => {
  window.location = '/';
});
