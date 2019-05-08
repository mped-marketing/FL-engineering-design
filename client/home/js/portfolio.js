const portfolioImage = document.getElementById('portfolioImage');
const portfolioBody = document.getElementById('portfolioBody');
const rightSide = document.getElementById('rightSide');
const meta = document.createElement('meta');
const metadesc = document.createElement('meta');
const metaKey = document.createElement('meta');
const getUrlParameter = (window) => {
  const array = window.split('/');
  return array[array.length - 1];
};

const id = getUrlParameter(window.location.href);
if (!id) {
  window.location = '/';
}
if (!isNaN(id)) {
  fetch(`/api/v2/portfolio/${id}`).then(result => result.json().then((result) => {
    const {
      image,
      body,
      title,
      client,
      date,
      location,
      tags,
    } = result;
    portfolioImage.src = `/api/v2/getFile/${image}`;
    meta.name = 'title';
    meta.content = title;
    metadesc.name = 'description';
    metaKey.name = ' keywords';
    metadesc.content = body.slice(0, 160);
    metaKey.content = tags;
    document.getElementsByTagName('head')[0].appendChild(meta);
    if (tags.length) {
      document.getElementsByTagName('head')[0].appendChild(metaKey);
    }
    let text = '';
    document.getElementById('pageTitle').innerText = `FL Engineering | ${title}`;
    text += `
          <h1>${title}</h1>`;
    text += body;
    portfolioBody.innerHTML = text;
    let rightText = '';
    rightText += `
      <li class="project__meta-item">
          <span class="project__meta-label">Client:</span>
          <span class="project__meta-value">${client}</span>
      </li>
      <li class="project__meta-item">
          <span class="project__meta-label">Date:</span>
          <span class="project__meta-value">${date ? moment(date).calendar() : ''}</span>
      </li>
      <li class="project__meta-item">
          <span class="project__meta-label">Location:</span>
          <span class="project__meta-value">${location}</span>
      </li>`;
    rightSide.innerHTML = rightText;
  }));
} else {
  window.location = '/';
}
