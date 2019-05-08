const aboutTitle = document.getElementById('about--title');
const aboutDesc = document.getElementById('about--desc');
const aboutImage = document.getElementById('about--image');
const aboutBody = document.getElementById('about--body');
const statistics = document.getElementById('statistics');
const meta = document.createElement('meta');
const metadesc = document.createElement('meta');
const metaKey = document.createElement('meta');

meta.name = 'title';
meta.content = 'Sedona';
metadesc.name = 'description';
metaKey.name = ' keywords';
fetch('/api/v2/about').then(result => result.json().then((result) => {
  const {
    title, desc, image, body, sub_title, tags,
  } = result;
  metadesc.content = desc.slice(0, 160);
  metaKey.content = tags;
  aboutTitle.textContent = title;
  document.getElementsByTagName('head')[0].appendChild(meta);
  document.getElementsByTagName('head')[0].appendChild(metadesc);
  if (tags.length) {
    document.getElementsByTagName('head')[0].appendChild(metaKey);
  }
  aboutDesc.textContent = sub_title;
  aboutImage.style = `background-image: url(/api/v2/getFile/${image})`;
  aboutBody.innerHTML = body;
}));

fetch('/api/v2/getTitle').then(result => result.json().then((result) => {
  const team_title = document.getElementById('teamtitle');
  const team_sub = document.getElementById('teamsub');
  const team_desc = document.getElementById('teamdesc');
  const slider_team = document.getElementById('slider-team');
  const {
    teamtitle,
    teamsub,
    teamdesc,
  } = result[0];
  team_title.textContent = teamtitle;
  team_sub.textContent = teamsub;
  team_desc.textContent = teamdesc;
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
  element.facebook
    ? `              <a
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
    slider_team.innerHTML = textTeam;
  }));
}));

fetch('/api/v2/statistics').then(result => result.json().then((result) => {
  let text = '';
  if (result.length) {
    result.slice(0, 4).map((statistic) => {
      text += `
      <div class="col-md-3">
        <div class="statistic">
          <span class="statistic__number">${statistic.count}</span>
          <h5 class="statistic__title">${statistic.title}</h5>
        </div>
      </div>`;
      return text;
    });
    statistics.innerHTML = text;
  } else {
    document.getElementById('statistic-container').style.display = 'none';
  }
}));
