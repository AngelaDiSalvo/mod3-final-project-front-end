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
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "location": city,
        "search_term": term
      })
    })
    .then(re => re.json())
    .then(keepId)
  initMap(city, term)
})

function keepId(data) {
  yelpSearchId = data.id
  // debugger
}

function initMap(city = "Houston", searchTerm = "pizza") {
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
        displaySearches()
      }
    })(marker, i, highRatings))
  }
}

function passSongName(business) {

  businessDiv.innerHTML = `<div><h3 id="data-busi" >${business}</h3><div>`
  const businessFirst = business.split(" ")[0]
  const spotUrl = `https://api.spotify.com/v1/search?q=${businessFirst}&type=track&market=US&limit=20&offset=5`

  fetch(spotUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${passedInToken}`
      }
    })
    .then(res => res.json())
    .then(filterTracks)

}

// onload this call is made
fetch('http://localhost:3000', {
    credentials: 'include'
  })
  .then(r => r.json())
  // .then(console.log)
  .then(token => {
    if (token.spotify_access_token == null) {
      // debugger
      getToken()
    } else {
      console.log(token)
      passedInToken = token.spotify_access_token
    }
  })

// tell spotify who we are with client id
// spotify does a get request to the redirect
function getToken() {
  window.location.replace('https://accounts.spotify.com/authorize?' +
    serializeURL({
      response_type: 'code',
      client_id: client_id,
      scope: 'user-read-private user-read-email',
      redirect_uri: 'http://localhost:3000/authorization'
    })
  )

  function serializeURL(obj) {
    let str = "";
    for (let key in obj) {
      if (str != "") {
        str += "&";
      }
      str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str
  }
}

function filterTracks(data) {
  // debugger
    const iterateOVer = data.tracks.items
    const notExplicit = iterateOVer.filter(function(track) {
    return track.explicit == false
  })
  function compare(a, b) {
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
  notExplicit.sort(compare);

  const artistName = notExplicit[0].artists[0].name
  const songName = notExplicit[0].name
  const fullUrl = `https://open.spotify.com/embed/track/${notExplicit[0].id}`
  let prevUrl = notExplicit[0].preview_url
  const albumCover = notExplicit[0].album.images[1].url
  const albumCoverSm = notExplicit[0].album.images[2].url
  const albumName = notExplicit[0].album.name
    businessDiv.innerHTML += `
    <div>
    <h4>${artistName}</h4>
    <h5>${songName}</h5>
    <img src="${albumCover}"/>
    <audio controls>
      <source src=\"${prevUrl}\" type="audio/mpeg"/>
      <source src=\"${prevUrl}\" type="audio/ogg"/>
    </audio>
    </div>
    `;
  postSpotifyDB(artistName, songName, fullUrl, prevUrl, albumCover, albumCoverSm, albumName)
}

function postSpotifyDB(artistName, songName, fullUrl, prevUrl, albumCover, albumCoverSm, albumName) {
  const busiName = document.getElementById('data-busi').innerText

  fetch('http://localhost:3000/spotify_fetches', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "business_name": busiName,
        "artist_name": artistName,
        "song_name": songName,
        "full_url": fullUrl,
        "prev_url": prevUrl,
        "album_cover": albumCover,
        "album_cover_sm": albumCoverSm,
        "album_name": albumName,
        "yelp_fetch_id": yelpSearchId
      })
    })
    .then(re => re.json())
    // .then(displaySearches)
}

function displaySearches() {
  const displaySearchesDiv = document.getElementById("displaySearches")
  fetch('http://localhost:3000/spotify_fetches')
    .then(re => re.json())
    .then(data => {
      const search = data.reverse()
      // debugger
      for (let i = 0; i < 10; i++) {
        displaySearchesDiv.innerHTML += `
        <strong>${search[i].yelp_fetch.location}: ${search[i].yelp_fetch.search_term}</strong>
      <table><tr>
      <td>${search[i].business_name}<td>
      <td>${search[i].artist_name}<td>
      <td><a target="_blank" href="${search[i].full_url}">${search[i].song_name}</a><td>
      <td><img src="${search[i].album_cover_sm}" /></td>
      <td>${search[i].album_name}<td>
      </tr></table>`
      }
    })
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
