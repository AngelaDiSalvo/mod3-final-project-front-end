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
  // keepId(data)
  var styledMapType = new google.maps.StyledMapType(
            [
              {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
              {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
              {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
              {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{color: '#c9b2a6'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{color: '#dcd2be'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [{color: '#ae9e90'}]
              },
              {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#93817c'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [{color: '#a5b076'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#447530'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#f5f1e6'}]
              },
              {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{color: '#fdfcf8'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#f8c967'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#e9bc62'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [{color: '#e98d58'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [{color: '#db8555'}]
              },
              {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{color: '#806b63'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [{color: '#8f7d77'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#ebe3cd'}]
              },
              {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{color: '#b9d3c2'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#92998d'}]
              }
            ],
            {name: 'Styled Map'});

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

    nestedlocations.push(business.image_url)
    nestedlocations.push(business.display_phone)
    nestedlocations.push(business.url)

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

  map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');
        // marker.setMap(map);
  //       marker.addListener('click', toggleBounce);
  //
  //       function toggleBounce() {
  // if (marker.getAnimation() !== null) {
  //   marker.setAnimation(null);
  // } else {
  //   marker.setAnimation(google.maps.Animation.BOUNCE);
  // }
// }

  let infowindow = new google.maps.InfoWindow();
  let marker, i;
  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map
    });

    google.maps.event.addListener(marker, 'click', (function(marker, i, highRatings) {
      return function() {
        // infowindow.setContent(locations[i][0])
        infowindow.setContent(`${locations[i][0]}<p>${locations[i][4]}</p><p><img src=${locations[i][3]} width="150"></p>`)

        infowindow.open(map, marker);
        const businessName = infowindow.content
        passSongName(businessName)
        displaySearches()
      }
    })(marker, i, highRatings))
  }
}

function passSongName(business) {
  businessDiv.innerHTML = `<div><small>Business</small><h3 id="data-busi" >${business.split("<")[0]}</h3><div><hr>`
  const businessFirst = business.split(" ")[0]
  const spotUrl = `https://api.spotify.com/v1/search?q=${businessFirst}&type=track&market=US&limit=20&offset=5`
  // debugger

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

  postSpotifyDB(artistName, songName, fullUrl, prevUrl, albumCover, albumCoverSm, albumName, yelpSearchId)
}

function postSpotifyDB(artistName, songName, fullUrl, prevUrl, albumCover, albumCoverSm, albumName, yelpSearchId) {
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
      //debugger
      for (let i = 0; i < 10; i++) {
        displaySearchesDiv.innerHTML += `
        <strong>${search[i].yelp_fetch.location}: ${search[i].yelp_fetch.search_term}</strong>
      <table><tr>
      <th valign="top">Location: </th>
      <td>${search[i].business_name}<td>
      <th>Song: </th>
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
