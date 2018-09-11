let map;

function initMap() {

  fetch('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=coffee&location=houston', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${yelpApiKey}`
      }
    })
    .then(res => res.json())
    .then(ratingGreaterThanThree)

  function ratingGreaterThanThree(data) {
    const highRatings = data.businesses.filter(business => {
      // debugger
      return business.rating > 3
    })
    debugger

    let locations = []

    highRatings.forEach(function(business, i) {
      //grab the name
      // debugger
      let nestedlocations = []
      nestedlocations.push(business.name)
      nestedlocations.push(business.coordinates.latitude)
      nestedlocations.push(business.coordinates.longitude)
      nestedlocations.push(++i)
      locations.push(nestedlocations)

      // create local const for the event listener to create a function to post
      // nestedlocations.push(business.image_url)

    })



    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: new google.maps.LatLng(29.7590441, -95.3635909),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    let infowindow = new google.maps.InfoWindow();

    let marker, i;

    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }

  }
}

// function initSong () {
//
//   fetch('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=coffee&location=houston', {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${yelpApiKey}`
//       }
//     })
//     .then(res => res.json())
//     .then(comments)
//
//     function comments(data) {
//       console.log(data)
//
//     }
//
//
// }
