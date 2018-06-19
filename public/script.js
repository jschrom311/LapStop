console.log('clientsidejs')

function ping(){
    fetch('/ping')
    .then(function(response) {
        //return response.json();
  })
    .then(function(myJson) {
        //console.log(myJson);
  });
}

var videoElement = document.getElementById("videoElement");
console.log(videoElement)
// Autoplay the video if application is visible
if (document.visibilityState == "visible") {
  videoElement.play();
}

// Handle page visibility change events
function handleVisibilityChange() {
    console.log(document.visibilityState)
  if (document.visibilityState == "hidden") {
      ping();
      socket.emit('close')
    videoElement.pause();
  } else {
    videoElement.play();
  }
}


document.addEventListener('visibilitychange', handleVisibilityChange, false);

//setInterval(function(){ ping() },2000)
