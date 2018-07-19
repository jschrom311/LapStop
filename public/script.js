console.log('clientsidejs')
var armed = false
function ping(){
    fetch('/ping')
    .then(function(response) {
  })
    .then(function(myJson) {
  });
}

$("#arm_button").click(function(){
  armed = !armed;
  $(this).toggleClass('armed')
  getLocation()
  console.log(this)
})

// Handle page visibility change events
var videoElement = document.getElementById("videoElement");
function handleVisibilityChange() {
    console.log(document.visibilityState)
  if (document.visibilityState == "hidden" && armed) {
    console.log("sendemail")
      socket.emit('close')
      //take_snapshot()
  } else {
  }
}

var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        navigator.geolocation.getCurrentPosition(saveLocation);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

$('button.delete').click(function(){
  console.log($(this).data("locationid"))
  $.ajax({
    url: '/deletelocation',
    type: 'DELETE',
    data: {locationid: $(this).data("locationid")},
    success: function(result) {
        console.log(result)
        $(`*[data-locationid="${result.deleted}"]`).parent().parent().remove()
    }
});
})

console.log(loc)  

var markers = []

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 5
  });
}

function drop() {
  clearMarkers();
  for (var i = 0; i < loc.length; i++) {
    addMarkerWithTimeout(loc[i], i * 200);
  }
}

function addMarkerWithTimeout(position, timeout) {
  //window.setTimeout(function() {
    markers.push(new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    }));
  //}, timeout);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

initMap()
drop()

var bounds = new google.maps.LatLngBounds();
for (var i = 0; i < markers.length; i++) {
 bounds.extend(markers[i].getPosition());
}

map.fitBounds(bounds);

function saveLocation(position){
  var data = {
    timestamp: position.timestamp,
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  console.log(position)
  fetch("/saveLocation", {  
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',    
     body: JSON.stringify(data)
})
.then(function (data) {  
  console.log('Request success: ', data);  
})  
.catch(function (error) {  
  console.log('Request failure: ', error);  
});
  console.log(typeof position)
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
}

document.addEventListener('visibilitychange', handleVisibilityChange, false);

//setInterval(function(){ ping() },2000)
