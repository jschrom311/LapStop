console.log('clientsidejs')

function ping(){
    fetch('/ping')
    .then(function(response) {
        return response.json();
  })
    .then(function(myJson) {
        console.log(myJson);
  });
}

//setInterval(function(){ ping() },2000)
