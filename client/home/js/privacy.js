const aboutTitle = document.getElementById('about--title');
const aboutImage = document.getElementById('about--image');
const aboutBody = document.getElementById('about--body');
const meta = document.createElement('meta');
const metadesc = document.createElement('meta');
meta.name = 'title';
meta.content = 'Sedona';
metadesc.name = 'description';
fetch('/api/v2/privacy').then(result => result.json().then((result) => {
  const {
    title, description, header_media,
  } = result[0];
  aboutTitle.textContent = title;
  document.getElementsByTagName('head')[0].appendChild(meta);
  document.getElementsByTagName('head')[0].appendChild(metadesc);

  aboutImage.style = `background-image: url(/api/v2/getFile/${header_media})`;
  aboutBody.innerHTML = description;
}));
