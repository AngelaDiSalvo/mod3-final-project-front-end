let map
const searchCity = document.querySelector("#yelp_form")
const inputLocation = document.querySelector("#location_input")
const inputSearchTerm = document.querySelector("#search_input")
const businessDiv = document.querySelector('#data-business-name')

searchCity.addEventListener('submit', e => {
  e.preventDefault()
  businessDiv.innerHTML = ``
  let city = inputLocation.value
  let term = inputSearchTerm.value
  fetch('http://localhost:3000/yelp_fetches', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"},
    body: JSON.stringify({
      "location": city,
      "search_term": term
    })
  })
    .then(re => re.json())
  initMap(city, term)
})

function initMap(city="Houston", searchTerm="pizza") {
  fetch("http://localhost:3000/yelp_fetches/search", {
    method: "POST",
    credentials: 'same-origin',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      location: city,
      search_term: searchTerm
    })
  })
      .then(resp => resp.json())
      .then(ratingGreaterThanThree)
}


  // let url = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${searchTerm}&location=${city}&limit=10`
  // fetch(url, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${yelpApiKey}`
  //     }
  //   })
  //   .then(res => res.json())
  //   .then(ratingGreaterThanThree)

  function ratingGreaterThanThree(data) {
    const lat = data.businesses[0].coordinates.latitude
    const lng = data.businesses[0].coordinates.longitude
    var highRatings = data.businesses.filter(business => {
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

      google.maps.event.addListener(marker, 'click', (function(marker, i, highRatings) {
        return function() {
          infowindow.setContent(locations[i][0])
          infowindow.open(map, marker);
          const businessName = infowindow.content
          passSongName(businessName)
        }
      })(marker, i, highRatings))
    }
  }

  function passSongName(business) {
    businessDiv.innerHTML = `<h3>${business}</h3>`
    const businessFirst = business.split(" ")[0]
    const spotUrl = `https://api.spotify.com/v1/search?q=${businessFirst}&type=track&market=US&limit=20&offset=5`

    // window.location.replace('https://accounts.spotify.com/authorize?' +
    //     serializeURL({
    //       response_type: 'code',
    //       client_id: client_id,
    //       scope: 'user-read-private user-read-email',
    //       redirect_uri: 'http://d929434c.ngrok.io'
    //     })
    // )
    // function serializeURL(obj){
    //   let str = "";
    // 	for (let key in obj) {
    //     if (str != "") {
    //         str += "&";
    //    	}
    //     str += key + "=" + encodeURIComponent(obj[key]);
    // 	}
    //   return str
    // }


    fetch(spotUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer BQD5zuRrJVO21_cwJ6y5cPTN4rrbmBW-BMfcrEYbXqnaTlFfTABmCsUaKKkgjqRLOLIkcRK69V03TKaD1RkWwsJiVVgZqUT4j064VSo8Aag2b2S8dKWOpvd7PY2l7IvHQZuPbuK_ty2b0rnL"
      }
    })
    .then(res => res.json())
    .then(filterTracks)
  }


function filterTracks(data){
  const iterateOVer = data.tracks.items
  const notExplicit = iterateOVer.filter(function(track){
    return track.explicit == false
  })
  function compare(a,b){
    const popA = a.popularity
    const popB = b.popularity
    let comparison = 0
    if (popA > popB) {
      comparison = 1
    } else if (popA < popB) {
      comparison = -1
    }
    return comparison * -1
  }
  notExplicit.sort(compare)
  businessDiv.innerHTML += `
    <p>${notExplicit[0].artists[0].name}</p>
    <p>${notExplicit[0].name}</p>
    <p>${notExplicit[0].preview_url}</p>`
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
