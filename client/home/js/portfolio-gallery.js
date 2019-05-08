function initMasonry() {
  const $masonry = jQuery('.masonry-grid');
  $masonry.imagesLoaded(() => {
    $masonry.isotope({
      itemSelector: '.masonry-item',
      layoutMode: 'masonry',
      percentPosition: true,
      resizable: false,
      isResizeBound: false,
      masonry: { columnWidth: '.masonry-item' },
    });
  });
}


fetch('/api/v2/services').then(result => result.json().then((result) => {
  if (result.length) {
    let text1 = '<a href="#" class="filter active" data-filter="*">All</a>';
    result.slice(0, 4).map((service) => {
      text1 += `<a href="#" class="filter" data-filter=".${service.title.replace(/\s/g, '')}">${service.title}</a>`;
      return text1;
    });

    fetch('/api/v2/portfolio').then(result => result.json().then((result) => {
      initMasonry();
      const $portfolioFilter = jQuery('.masonry-grid');
      jQuery('.masonry-filter').on('click', 'a', function (e) {
        e.preventDefault();
        const filterValue = jQuery(this).attr('data-filter');
        $portfolioFilter.isotope({ filter: filterValue });
        jQuery('.masonry-filter a').removeClass('active');
        jQuery(this).closest('a').addClass('active');
      });

      if (result.length) {
        let text2 = '';
        result.slice(0, 10).map((portfolio) => {
          text2 += `<div class="masonry-item col-lg-3 project hover-trigger ${portfolio.service.title.replace(/\s/g, '')}">
            <div class="project__container">
              <div class="project__img-holder">
                <a href="/portfolio/${portfolio.id}">
                  <img src="/api/v2/getFile/${portfolio.image}" alt="" class="project__img port_img">
                  <div class="hover-overlay">
                    <div class="project__description">
                      <h3 class="project__title">${portfolio.title}</h3>
                      <span class="project__date">${portfolio.date ? moment(portfolio.date).year() : ''}</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div> <!-- end project -->`;
          return text2;
        });
        document.getElementById('portfolio').innerHTML = text2;
      } else {
        document.getElementById('recent-work').style.display = 'none';
      }
    }));
    document.getElementById('masonry-filter').innerHTML = text1;
  } else { document.getElementById('services-container').style.display = 'none'; }
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
    const { tags_portfolio } = result[0];
    const metaKey = document.createElement('meta');
    metaKey.name = ' keywords';
    metaKey.content = tags_portfolio;
    document.getElementsByTagName('head')[0].appendChild(metaKey);
  }
}));
