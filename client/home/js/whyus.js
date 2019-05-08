const whyusImage = document.getElementById('portfolioImage');
const whyusBody = document.getElementById('portfolioBody');

fetch('/api/v2/whyus/getAll').then(result => result.json().then((result) => {
  const {
    icon,
    body,
    title,
    tags,
  } = result[0];
  const metaKey = document.createElement('meta');
  metaKey.name = ' keywords';
  metaKey.content = tags;
  if (tags.length) {
    document.getElementsByTagName('head')[0].appendChild(metaKey);
  }
  whyusImage.src = `/api/v2/getFile/${icon}`;
  let text = '';
  text += `
          <h1>${title}</h1>`;
  text += body;
  whyusBody.innerHTML = text;
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
