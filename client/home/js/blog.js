const blogTitle = document.getElementById('blog--title');
const blogImage = document.getElementById('blog--image');
const blogBody = document.getElementById('blog--body');
const commentList = document.getElementById('comment-list');
const commentCount = document.getElementById('comment-count');
const comment = document.getElementById('comment');
const form = document.getElementById('form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const getUrlParameter = (window) => {
  const array = window.split('/');
  return array[array.length - 1];
};
const meta = document.createElement('meta');
const metadesc = document.createElement('meta');
const seo = getUrlParameter(window.location.href);
if (!seo) {
  window.location = '/';
}
fetch(`/api/v2/postId/${seo}`).then(result => result.json().then((result) => {
  const {
    postResult: {
      title, header_media, description, post_intro, tags,
    }, commentsResult,
  } = result;
  if (commentsResult.length) {
    commentCount.textContent = `${commentsResult.length} comments`;

    let text1 = '';
    commentsResult.map((comment) => {
      text1 += `
  <li class="comment">
    <div class="comment-body">
      <div class="comment-text">
        <h6 class="comment-author">${comment.name}</h6>
        <div class="comment-metadata">
          <a href="#" class="comment-date">${moment(comment.createdAt).calendar()}</a>
        </div>
        <p>${comment.body}</p>
      </div>
    </div>
  </li>
    `;
      return text1;
    });
    commentList.innerHTML = text1;
  } else {
    commentCount.textContent = '0 comment';
  }
  meta.name = 'title';
  document.getElementById('pageTitle').innerText = `FL Engineering | ${title}`;
  meta.content = title;
  const metaKey = document.createElement('meta');
  metaKey.name = ' keywords';
  metaKey.content = tags;
  metadesc.name = 'description';
  metadesc.content = post_intro.slice(0, 160);
  document.getElementsByTagName('head')[0].appendChild(meta);
  document.getElementsByTagName('head')[0].appendChild(metadesc);
  if (tags.length) {
    document.getElementsByTagName('head')[0].appendChild(metaKey);
  } blogTitle.textContent = title;
  blogImage.style = `background-image: url(/api/v2/getFile/${
    header_media[0]
  })`;
  blogBody.innerHTML = description;
})).catch((error) => {
  window.location = '/';
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
  });
  const obj = {
    body: comment.value,
    name: name.value,
    email: email.value,
    seo,
  };
  fetch('/api/v2/comments/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  }).then(result => result.json().then(result => Toast.fire({
    type: 'success',
    title: result.message,
  }))).catch(error => Toast.fire({
    type: 'error',
    title: 'error',
  }));
});
