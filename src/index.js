let map;

function initMap() {
  fetch('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=coffee&location=houston&limit=10', {
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
      return business.rating > 3
    })

    let locations = []
    let ids = []
    let busName = []
    highRatings.forEach(function(business, i) {

      let nestedlocations = []
      nestedlocations.push(business.name)
      nestedlocations.push(business.coordinates.latitude)
      nestedlocations.push(business.coordinates.longitude)
      nestedlocations.push(++i)
      locations.push(nestedlocations)
      ids.push(business.id)
      busName.push(business.name)
    })

    let searchCity = "miami"
    let geocoder =  new google.maps.Geocoder()
    geocoder.geocode( { 'address': searchCity}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        const lat = results[0].geometry.location.lat()
        const lng = results[0].geometry.location.lng()
      } else {
        alert("Something got wrong " + status)
      }
    })

    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: new google.maps.LatLng(lat, lng),
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
          const businessName = infowindow.content
          passSongName(businessName)
        }
      })(marker, i));
    }

  }
}

// function initSong(ids) {
//   let commentsArray=[]
//   const fetches = ids.map(id => {
//     return fetch("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + id + "/reviews", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${yelpApiKey}`
//         }
//       })
//       .then(res => res.json())
//     })
//     reviewArray = Promise.all(fetches).then(comments)
//
//     function comments(reviewArray) {
//       const reviewss = reviewArray.map(review => {
//         return review.reviews
//       })
//       const blaj = reviewss.map(review => {
//         review.map(revie => {
//           revie.text
//         })
//       })
//
//
//       // data.reviews.forEach(review => {
//       //   commentsArray.push(review.text)
//       // })
//
//       let reserve = ["I", "to"]
//       let result
//       reserve.forEach(rWord => {
//         commentsArray.join().split(" ").filter(cWord => {
//           cWord !== rWord
//         })
//       })
//     }
//     console.log(commentsArray)
// }

function passSongName(business) {
  debugger

}
