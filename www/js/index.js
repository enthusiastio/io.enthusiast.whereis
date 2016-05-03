if (typeof(Number.prototype.toRadians) === "undefined") {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }
}

var app = {

    compassWatchID:0,
    needleRef:null,
    rigaLat:56.9515156,
    rigaLong:24.113354,
    distanceCalculated:false,

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
       navigator.geolocation.getCurrentPosition(app.onGPSSuccess, app.onGPSError, {timeout: 10000, enableHighAccuracy: true});
       app.compassWatchID = navigator.compass.watchHeading(app.onCompassSuccess, app.onCompassError, { frequency: 500 });
       needleRef = document.getElementById('needle');
    },



    onGPSSuccess: function(position){
        if(app.distanceCalculated == false) 
        {
            var distance = app.calculateDistance(position.coords.latitude, position.coords.longitude, app.rigaLat, app.rigaLong);
            app.distanceCalculated = true;
            $("#distance").text(distance + " KM");
        }
        

       /* alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');*/
    },

    onGPSError:function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    },

    onCompassSuccess:function(heading) {
        var deg = Math.round(360-heading.magneticHeading);
       $('#needle').animate({  borderSpacing: deg }, {
            step: function(now,fx) {
              $(this).css('transform','rotate('+now+'deg)');  
            },
            duration:500
        });
    },

    // onError: Failed to get the heading
    //
    onCompassError:function(compassError) {
        alert('Compass error: ' + compassError.code);
    },

    calculateDistance:function(lat1, lon1, lat2, lon2) {
        var R = 6371000; // metres
        var φ1 = lat1.toRadians();
        var φ2 = lat2.toRadians();
        var Δφ = (lat2-lat1).toRadians();
        var Δλ = (lon2-lon1).toRadians();

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var d = R * c;

        return Math.round(d/1000);
    }

};
