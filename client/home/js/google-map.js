$(document).ready(() => {
  const gmapDiv = $('#google-map');
  const gmapMarker = gmapDiv.attr('data-address');

  gmapDiv.gmap3({
    zoom: 16,
    address: gmapMarker,
    oomControl: true,
    navigationControl: true,
    scrollwheel: false,
    styles: [
      {
        featureType: 'all',
        elementType: 'all',
        stylers: [
          { saturation: '-50' },
        ],
      }],
  })
    .marker({
      address: gmapMarker,
      icon: 'img/map_pin.png',
    })
    .infowindow({
      content: 'V Tytana St, Manila, Philippines',
    })
    .then(function (infowindow) {
      const map = this.get(0);
      const marker = this.get(1);
      marker.addListener('click', () => {
        infowindow.open(map, marker);
      });
    });
});
