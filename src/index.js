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
    // debugger

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

    //

    let searchCity = "miami, us"
    let lat = 0
    let lng = 0
    let myLatlng = {lat: lat, lng: lng}

        let geocoder =  new google.maps.Geocoder()
        geocoder.geocode( { 'address': searchCity}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            lat = parseInt(results[0].geometry.location.lat())
            lng = parseInt(results[0].geometry.location.lng())
            myLatlng = {lat: lat, lng: lng}
            centerMap(myLatlng)
            // debugger
          } else {
            alert("Something got wrong " + status)
          }
        })
    //
    // pass in the values from Angela's code

    // debugger
    function centerMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    }

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

// $("#btn").click(function(){
//             var geocoder =  new google.maps.Geocoder();
//     geocoder.geocode( { 'address': 'miami, us'}, function(results, status) {
//           if (status == google.maps.GeocoderStatus.OK) {
//             alert("location : " + results[0].geometry.location.lat() + " " +results[0].geometry.location.lng());
//           } else {
//             alert("Something got wrong " + status);
//           }
//         });
// });

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
