
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


fetch('/api/v2/hero/getall').then(result => result.json().then((result) => {
  jQuery(document).ready(() => {
    jQuery('#slider-1').revolution({
      sliderLayout: 'fullscreen',
      delay: 12000,
      responsiveLevels: [4096, 1024, 778, 420],
      gridwidth: [1200, 1024, 778, 410],
      gridheight: 600,
      hideThumbs: 10,
      fullScreenAutoWidth: 'on',
      fullScreenOffsetContainer: '.nav, .rev-offset',

      navigation: {
        onHoverStop: 'off',

        touch: {
          touchenabled: 'on',
          swipe_threshold: 75,
          swipe_min_touches: 1,
          swipe_direction: 'horizontal',
          drag_block_vertical: false,
        },
        arrows: {
          enable: true,
          style: 'hermes',
          tmp:
              '<div class="tp-arr-allwrapper">  <div class="tp-arr-imgholder"></div> <div class="tp-arr-titleholder">{{title}}</div> </div>',
          left: {
            h_align: 'left',
            v_align: 'center',
            h_offset: 0,
            v_offset: 0,
          },
          right: {
            h_align: 'right',
            v_align: 'center',
            h_offset: 0,
            v_offset: 0,
          },
        },
        bullets: {
          style: '',
          enable: false,
          hide_onmobile: false,
          hide_onleave: true,
          hide_delay: 200,
          hide_delay_mobile: 1200,
          hide_under: 0,
          hide_over: 9999,
          direction: 'horizontal',
          space: 12,
          h_align: 'center',
          v_align: 'bottom',
          h_offset: 0,
          v_offset: 30,
          tmp: '',
        },
      },

      parallax: {
        type: 'scroll',
        levels: [
          5,
          10,
          15,
          20,
          25,
          30,
          35,
          40,
          45,
          50,
          55,
          60,
          65,
          70,
          75,
          80,
          85,
        ],
        origo: 'enterpoint',
        speed: 400,
        bgparallax: 'on',
        disable_onmobile: 'on',
      },

      spinner: 'spinner4',
    });
  });
  if (result.length) {
    let text = '';
    const meta = document.createElement('meta');
    const metadesc = document.createElement('meta');
    const metaKey = document.createElement('meta');


    result.map((element) => {
      meta.name = 'title';
      meta.content = element.title;
      metadesc.name = 'description';
      metadesc.content = element.description.slice(0, 160);
      metaKey.name = ' keywords';
      metaKey.content = element.tags;
      if (element.cta) {
        text += ` <li data-fstransition="fade"
        data-transition="fade"
        data-easeout="default"
        data-slotamount="1"
        data-masterspeed="1200"
        data-delay="8000"
        data-title="Next"
        >
        <!-- MAIN IMAGE -->
        <img src="/api/v2/getFile/${element.image}"
          alt="content"
          data-bgrepeat="no-repeat"
          data-bgfit="cover"
          data-bgparallax="7"
          class="rev-slidebg"
          >
        
        <!-- HERO TITLE -->
        <div class="tp-caption hero-text"
          data-x="40"
          data-y="center"
          data-voffset="[-70,-90,-120,-120]"
          data-fontsize="[56,56,52,40]"
          data-lineheight="[72,62,52,40]"
          data-width="[none, none, none, 300]"
          data-whitespace="[nowrap, nowrap, nowrap, normal]"
          data-frames='[{
            "delay":1000,
            "speed":900,
            "frame":"0",
            "from":"y:150px;opacity:0;",
            "ease":"Power3.easeOut",
            "to":"o:1;"
            },{
            "delay":"wait",
            "speed":1000,
            "frame":"999",
            "to":"opacity:0;","ease":"Power3.easeOut"
          }]'
          data-splitout="none">${element.title}<span class="hero-dot">.</span>
          </div>
        
        <!-- HERO SUBTITLE -->
        <div class="tp-caption small-text"
          data-x="45"
          data-y="center"
          data-voffset="[30,10,-30,30]"
          data-fontsize="[21,21,21,21]"
          data-lineheight="34"
          data-width="[200, 200, 200, 300]"
          data-whitespace="[nowrap, nowrap, nowrap, normal]"
          data-frames='[{
            "delay":1100,
            "speed":900,
            "frame":"0",
            "from":"y:150px;opacity:0;",
            "ease":"Power3.easeOut",
            "to":"o:1;"
            },{
            "delay":"wait",
            "speed":1000,
            "frame":"999",
            "to":"opacity:0;","ease":"Power3.easeOut"
          }]'
          >${element.description.slice(0, 80)} ...
        </div>
        
        <!-- BUTTON -->
        <div class="tp-caption"
            data-x="45"
            data-y="center"
            data-voffset="[130,110,70,160]"
            data-lineheight="55"
            data-hoffset="0"
            data-frames='[{
              "delay":1200,
              "speed":900,
              "frame":"0",
              "from":"y:150px;opacity:0;",
              "ease":"Power3.easeOut",
              "to":"o:1;"
              },{
              "delay":"wait",
              "speed":1000,
              "frame":"999",
              "to":"opacity:0;","ease":"Power3.easeOut"
            }]'
            ><a href='${element.cta}' class='btn btn--lg btn--color'>See More</a>
        </div>
        
        </li> 
        `;
      } else {
        text += ` <li data-fstransition="fade"
  data-transition="fade"
  data-easeout="default"
  data-slotamount="1"
  data-masterspeed="1200"
  data-delay="8000"
  data-title="Next"
  >
  <!-- MAIN IMAGE -->
  <img src="/api/v2/getFile/${element.image}"
    alt=""
    data-bgrepeat="no-repeat"
    data-bgfit="cover"
    data-bgparallax="7"
    class="rev-slidebg"
    >
  
  <!-- HERO TITLE -->
  <div class="tp-caption hero-text"
    data-x="40"
    data-y="center"
    data-voffset="[-70,-90,-120,-120]"
    data-fontsize="[56,56,52,40]"
    data-lineheight="[72,62,52,40]"
    data-width="[none, none, none, 300]"
    data-whitespace="[nowrap, nowrap, nowrap, normal]"
    data-frames='[{
      "delay":1000,
      "speed":900,
      "frame":"0",
      "from":"y:150px;opacity:0;",
      "ease":"Power3.easeOut",
      "to":"o:1;"
      },{
      "delay":"wait",
      "speed":1000,
      "frame":"999",
      "to":"opacity:0;","ease":"Power3.easeOut"
    }]'
    data-splitout="none">${element.title}<span class="hero-dot">.</span>
    </div>
  
  <!-- HERO SUBTITLE -->
  <div class="tp-caption small-text"
    data-x="45"
    data-y="center"
    data-voffset="[30,10,-30,30]"
    data-fontsize="[21,21,21,21]"
    data-lineheight="34"
    data-width="[200, 200, 200, 300]"
    data-whitespace="[nowrap, nowrap, nowrap, normal]"
    data-frames='[{
      "delay":1100,
      "speed":900,
      "frame":"0",
      "from":"y:150px;opacity:0;",
      "ease":"Power3.easeOut",
      "to":"o:1;"
      },{
      "delay":"wait",
      "speed":1000,
      "frame":"999",
      "to":"opacity:0;","ease":"Power3.easeOut"
    }]'
    >${element.description.slice(0, 80)} ...
  </div>
  
  <!-- BUTTON -->
  <div class="tp-caption"
      data-x="45"
      data-y="center"
      data-voffset="[130,110,70,160]"
      data-lineheight="55"
      data-hoffset="0"
      data-frames='[{
        "delay":1200,
        "speed":900,
        "frame":"0",
        "from":"y:150px;opacity:0;",
        "ease":"Power3.easeOut",
        "to":"o:1;"
        },{
        "delay":"wait",
        "speed":1000,
        "frame":"999",
        "to":"opacity:0;","ease":"Power3.easeOut"
      }]'
      ><a href='/Hero/${element.id}' class='btn btn--lg btn--color'>See More</a>
  </div>
  </li> 
  `;
      }
      return text;
    });
    const slider = document.getElementById('slider-1').firstElementChild;
    slider.innerHTML = text;
    document.getElementsByTagName('head')[0].appendChild(meta);
    document.getElementsByTagName('head')[0].appendChild(metadesc);
    if (metaKey.content !== 'null') { document.getElementsByTagName('head')[0].appendChild(metaKey); }
  }
}));
const addHttp = (link) => {
  let newLink = '';
  if (!link.match(/^[a-zA-Z]+:\/\//)) {
    newLink = `https://${link}`;
    return newLink;
  }
  return link;
};
fetch('/api/v2/getoptions').then(result => result.json().then((result) => {
  const {
    facebook, twitter, instagram, youtube, google, logo, email, whats, tags, header,
  } = result[0];
  document.getElementById('hidden').textContent = header;
  const metaKey = document.createElement('meta');
  metaKey.name = ' keywords';
  metaKey.content = tags;
  if (tags.length) {
    document.getElementsByTagName('head')[0].appendChild(metaKey);
  }
  document.getElementById(
    'top-whatsapp',
  ).innerHTML = `${whats ? `<i class='top-bar__icon ui-whatsapp'></i><a href='tel:${whats}' class='top-bar__phone-number'> ${whats}</a>` : ''}`;
  document.getElementById(
    'header-logo',
  ).innerHTML = `<img src="/api/v2/getFile/${logo}" alt="logo" class="logo header--logo">`;
  Array.from(document.getElementsByClassName('socialsTop')).map((element) => {
    element.innerHTML = `${facebook ? `<a href=${facebook} class="social social-facebook" title='facebook'><i class='ui-facebook'></i> </a>` : ''}`
        + `${twitter ? `<a href=${twitter} class="social social-twitter" title='twitter'><i class='ui-twitter'></i> </a>` : ''}`
        + `${youtube ? `<a href=${youtube} class="social social-youtube" title='youtube'><i class='ui-youtube'></i> </a>` : ''}`
        + `${instagram ? `<a href=${instagram} class="social social-instagram" title='instagram'><i class='ui-instagram'></i> </a>` : ''}`;
  });
  Array.from(document.getElementsByClassName('top-email')).map((element) => {
    element.innerHTML = `${email ? `<i class="top-bar__icon ui-email"></i>
    <a href="mailto:${email}" class="top-bar__email"
      >${email}</a
    >` : ''}`;
  });
}));

fetch('/api/v2/core').then(result => result.json().then((result) => {
  if (result.length) {
    const threeElement = result.slice(0, 3);
    let text = '';
    threeElement.map((element) => {
      text += `<div class="col-md-4">
        <div class="benefit">
        <img src="/api/v2/getFile/${element.icon}" class="icon--spec" />
          <h4 class="benefit__title">${element.title}</h4>
          <p class="benefit__text">${element.desc}</p>
        </div>
      </div>`;
      return text;
    });
    document.getElementById('core').innerHTML = text;
  }
}));


fetch('/api/v2/getTitle').then(result => result.json().then((result) => {
  const {
    teamtitle,
    teamsub,
    teamdesc,
    featurestitle,
    testimonialstitle,
    testimonialssub,
    featuressub,
    background,
  } = result[0];
  // document.getElementById('features-title').innerText = featurestitle;
  // document.getElementById('features-subtitle').innerText = featuressub;
  document.getElementById('testimonials-title').innerText = testimonialstitle;
  document.getElementById(
    'testimonials-subtitle',
  ).innerText = testimonialssub;
  document.getElementById('testimonials-background').style.background = `url('/api/v2/getFile/${background}')`;

  const team_title = document.getElementById('teamtitle');
  const team_sub = document.getElementById('teamsub');
  const team_desc = document.getElementById('teamdesc');
  const slider_team = document.getElementById('slider-team');
  // team_title.textContent = teamtitle;
  // team_sub.textContent = teamsub;
  // team_desc.textContent = teamdesc;
  fetch('/api/v2/team/getAll').then(data => data.json().then((data) => {
    jQuery(document).ready(() => {
      jQuery('.slick-team').slick({
        slidesToShow: 1,
        variableWidth: true,

        dots: true,
        arrows: false,
        centerMode: false,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              variableWidth: false,
            },
          },
        ],
      });
    });
    let textTeam = '';
    data.map((element) => {
      textTeam += `
      <div class="team-col">
    <div class="team hover-trigger">
      <div class="team__img-holder">
        <img src="/api/v2/getFile/${element.image}" alt="" class="team__img" />
        <div class="hover-overlay">
          <div class="team__details text-center">
            <div class="socials socials--white">
            ${
  element.facebook
    ? `<a
            href="${addHttp(element.facebook)}"
            id="facebook"
            class="social social-facebook"
            aria-label="facebook"
            title="facebook"
            target="_blank"
            ><i class="ui-facebook"></i
            ></a>`
    : ''
}
${
  element.twitter
    ? `              <a
href="${addHttp(element.twitter)}"
id="twitter"
class="social social-twitter"
aria-label="twitter"
title="twitter"
target="_blank"
><i class="ui-twitter"></i
></a>`
    : ''
}

${
  element.youtube
    ? `              <a
href="${addHttp(element.youtube)}"
id="youtube"
class="social social-youtube"
aria-label="youtube"
title="youtube"
target="_blank"
><i class="ui-youtube"></i
></a>`
    : ''
}
${
  element.instagram
    ? `              <a
href="${addHttp(element.instagram)}"
id="instagram"
class="social social-instagram"
aria-label="instagram"
title="instagram"
target="_blank"
><i class="ui-instagram"></i
></a>`
    : ''
}
            </div>
          </div>
        </div>
        </div>
        <h5 id="teamName" class="team__name">${element.name}</h5>
        <span id="teamTitle" class="team__occupation">${element.title}</span>
    </div>
  </div>`;
      return textTeam;
    });
    // slider_team.innerHTML = textTeam;
  }));
}));

fetch('/api/v2/clients/getAll').then(result => result.json().then((result) => {
  const testDiv = document.getElementById('testimonial');
  jQuery(document).ready(() => {
    jQuery('.slick-testimonials').slick({});
  });
  let text = '';
  if (result.length) {
    result.map((element) => {
      text += `<div class="testimonial clearfix">
      <div class="testimonial__body">
        <p class="testimonial__text">
${element.description}
        </p>
      </div>
      <div class="testimonial__info">
        <span class="testimonial__author">${element.name}</span>
        <span class="testimonial__company">${element.jobTitle}</span>
      </div>
    </div>`;
      return text;
    });
    testDiv.innerHTML = text;
  } else {
    document.getElementById('testimonials-background').style.display = 'none';
  }
}));


fetch('/api/v2/services').then(result => result.json().then((result) => {
  if (result.length) {
    let text = '';
    result.slice(0, 3).map((service) => {
      text += ` <div class="col-xl-4 col-lg-6">
              <div class="service-1">
                <a href="/service/${service.seo}" class="service-1__url hover-scale service-image">
                  <img src="/api/v2/getFile/${service.icon}" class="service-1__img" alt="">
                </a>
                <div class="service-1__info">
                  <h3 class="service-1__title">${service.title}</h3>
                  <p class="service--description">${service.desc}</p>
                  <a href="/service/${service.seo}" class="read-more">
                    <span class="read-more__text">Read More</span>
                    <i class="ui-arrow-right read-more__icon"></i>
                  </a>
                </div>
              </div>
            </div>`;
      return text;
    });
    let text1 = '<a href="#" class="filter active" data-filter="*">All</a>';
    result.slice(0, 5).map((service) => {
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
        result.slice(0, 6).map((portfolio) => {
          text2 += `<div class="masonry-item col-lg-4 project hover-trigger ${portfolio.service.title.replace(/\s/g, '')}">
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
    document.getElementById('services--row').innerHTML = text;
    document.getElementById('masonry-filter').innerHTML = text1;
  } else { document.getElementById('services-container').style.display = 'none'; }
}));

fetch('/api/v2/about').then(result => result.json().then((result) => {
  const { title, image, desc } = result;
  document.getElementById('about-title').innerText = title;
  document.getElementById('about-desc').innerText = desc;
  document.getElementById('about-img').setAttribute('src', `/api/v2/getFile/${image}`);
  fetch('/api/v2/about/getItems').then(result => result.json().then((result) => {
    let text = '';
    result.map((item) => {
      text += `  <div class="col-sm-4 about__items">
  <div class="feature">
<img src="/api/v2/getFile/${item.image}" class="icon--spec" />
  <h4 class="feature__title">${item.title}</h4>
  </div>
</div>`;
      return text;
    });
    document.getElementById('about-items').innerHTML = text;
  }));
}));
fetch('/api/v2/posts/getAllPosts').then(result => result.json().then((result) => {
  if (result.length) {
    let text = '';
    result.slice(0, 3).map((blog) => {
      text += `
      <div class="col-lg-4 col-md-6">
              <article class="entry">
                <div class="entry__img-holder">
                  <a href="/blog/${blog.seo}">
                    <img src="/api/v2/getFile/${blog.header_media[0]}" class="entry__img" alt="">
                  </a>
                </div>
                <div class="entry__body">
                  <ul class="entry__meta">
                    <li class="entry__meta-date">
                      <span>${moment(blog.createdAt).calendar()}</span>
                    </li>
                  </ul>
                  <h2 class="entry__title">
                    <a href="/blog/${blog.seo}">${blog.title}</a>
                  </h2>
                  <a href="/blog/${blog.seo}" class="read-more">
                    <span class="read-more__text">Read More</span>
                    <i class="ui-arrow-right read-more__icon"></i>
                  </a>
                </div>
              </article>
            </div>`;
      return text;
    });
    document.getElementById('blogs--row').innerHTML = text;
  } else {
    document.getElementById('blogs-container').style.display = 'none';
  }
}));


fetch('/api/v2/whyUs/getAll').then(result => result.json().then((result) => {
  if (result.length) {
    let text = '';
    result.slice(0, 3).map((whyus) => {
      text += `          
            <div class="project-1__container">
            <div class="project__img-holder hover-scale">
              <a href="/whyus">
                <img src="/api/v2/getFile/${whyus.icon}" alt="" class="project__img">
              </a>
            </div>
          </div>

          <div class="project-1__description-holder">
            <div class="project-1__description">
              <h3 class="project-1__title">${whyus.title}</h3>
              <p class="project-1__text">${whyus.desc}.</p>
              <a href="/whyus" class="read-more">
                <span class="read-more__text">${whyus.call_Action}</span>
                <i class="ui-arrow-right read-more__icon"></i>
              </a>
            </div>
          </div>
            `;
      return text;
    });
    document.getElementById('why--Us').innerHTML = text;
  } else {
    document.getElementById('why-us-container').style.display = 'none';
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

const nameinput = document.getElementById('name');
const emailinput = document.getElementById('email');
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
