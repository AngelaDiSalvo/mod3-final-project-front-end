const clientId = 'FrCY6KN0RweTEp68H5FMrg'
const apiKey = 'SPEaM7_pa22el3cgbiZUoZ2VuCQRKVG18ypiidtkwxtJ0ipsIbF0YwhO71mXifhqVmD31qLler2IYPypwsD8E1xNNNV4gdC2G2ehTUCGOTc8MLYVJxyX9bIkKACXW3Yx'

document.addEventListener('DOMContentLoaded', function() {
  fetch('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=coffee&location=houston', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer SPEaM7_pa22el3cgbiZUoZ2VuCQRKVG18ypiidtkwxtJ0ipsIbF0YwhO71mXifhqVmD31qLler2IYPypwsD8E1xNNNV4gdC2G2ehTUCGOTc8MLYVJxyX9bIkKACXW3Yx"
    }
  })
    .then(res => res.json())
    .then(console.log)
})

function  tipGreaterThanZero(data){
  const x = data.response.venues.filter(venue => {
    // debugger
    return venue.stats.tipCount > 0
  })
  debugger
}
