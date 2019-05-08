const address1 = document.getElementById('address');
const phone = document.getElementById('phone');
const mail = document.getElementById('email');
const twitter1 = document.getElementById('twitter');
const facebook1 = document.getElementById('facebook');
const youtube1 = document.getElementById('youtube');
const instagram1 = document.getElementById('instagram');
const background = document.getElementById('image');
const mainTitle = document.getElementById('title');
const contactOffice = document.getElementById('contactOffice');
const contactQuote = document.getElementById('contactQuote');
const subTitle = document.getElementById('subTitle');
fetch('/api/v2/getoptions').then(result => result.json().then((result) => {
  const {
    whats, email, facebook, twitter, youtube, instagram, address,
  } = result[0];
  phone.textContent = whats;
  mail.textContent = email;
  address1.textContent = address;
  if (facebook1) { facebook1.setAttribute('href', addHttp(facebook)); } else { return null; }
  if (twitter1) { twitter1.setAttribute('href', addHttp(twitter)); } else { return null; }
  if (youtube1) { youtube1.setAttribute('href', addHttp(youtube)); } else { return null; }
  if (instagram1) { instagram1.setAttribute('href', addHttp(instagram)); } else { return null; }
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

const nameinput = document.getElementById('name');
const emailinput = document.getElementById('email2');
const subjectinput = document.getElementById('subject');
const messageinput = document.getElementById('message');

document.getElementById('contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameinput.value;
  const email = emailinput.value;
  const subject = subjectinput.value;
  const message = messageinput.value;

  const data = {
    name, email, subject, message,
  };
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  fetch('/api/v2/contact', {
    credentials: 'same-origin',
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }).then(response => response.json()).then((res) => {
    const { message } = res;
    if (res.err) {
      return Toast.fire({
        type: 'error',
        title: 'error',
      });
    }
    Toast.fire({
      type: 'success',
      title: message,
    });
    nameinput.value = '';
    emailinput.value = '';
    subjectinput.value = '';
    messageinput.value = '';
  }).catch(err => Toast.fire({
    type: 'error',
    title: 'error',
  }));
});

fetch('/api/v2/contact/getAll').then(result => result.json().then((result) => {
  const {
    image, title, office, quote, sub_title, tags,
  } = result[0];
  background.style = `background-image: url(/api/v2/getFile/${image})`;
  const metaKey = document.createElement('meta');
  metaKey.name = ' keywords';
  metaKey.content = tags;
  if (tags.length) {
    document.getElementsByTagName('head')[0].appendChild(metaKey);
  }
  mainTitle.textContent = title;
  contactOffice.textContent = office;
  contactQuote.textContent = quote;
  subTitle.textContent = sub_title;
}));
