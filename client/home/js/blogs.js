fetch('/api/v2/posts/getAllPosts').then(result => result.json().then((result) => {
  if (result.length) {
    let text = '';
    result.map((post) => {
      text += `<div class="col-lg-4 col-md-6">
        <article class="entry">
            <div class="entry__img-holder">
                <a href="/blog/${post.seo}">
                    <img src="/api/v2/getFile/${post.header_media[0]}" class="entry__img" alt="">
                </a>
            </div>
            <div class="entry__body">
                <ul class="entry__meta">
                    <li class="entry__meta-date">
                        <span>${moment(post.createdAt).calendar()}</span>
                    </li>
                </ul>
                <h2 class="entry__title">
                    <a href="/blog/${post.seo}">${post.title}</a>
                </h2>
                <a href="/blog/${post.seo}" class="read-more">
                    <span class="read-more__text">Read More</span>
                    <i class="ui-arrow-right read-more__icon"></i>
                </a>
            </div>
        </article>
    </div>`;
      return text;
    });
    document.getElementById('blogs-container').innerHTML = text;
  }
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


fetch('/api/v2/getTitle').then(result => result.json().then((result) => {
  if (result.length) {
    const { tags_blogs } = result[0];
    const metaKey = document.createElement('meta');
    metaKey.name = ' keywords';
    metaKey.content = tags_blogs;
    if (tags_blogs.length) {
      document.getElementsByTagName('head')[0].appendChild(metaKey);
    }
  }
}));
