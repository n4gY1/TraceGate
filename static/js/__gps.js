let gpsWatchId = null;
let lastPosition = null;
let lastSendTime = 0;


function sendLocation(url_id, tracker_id) {

    if (!navigator.geolocation) {
        sendError("Geolocation nem támogatott");
        return;
    }


    // ha már fut egy tracker, ne indítsunk újat
    if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
    }


    gpsWatchId = navigator.geolocation.watchPosition(

        async (position) => {

            const coords = position.coords;

            console.log("GPS OK:", coords.latitude, coords.longitude, coords.accuracy);


            // ne küldje ugyanazt másodpercenként
            const now = Date.now();

            if (lastPosition &&
                now - lastSendTime < 10000) {
                return;
            }


            // túl pontatlan pozíció eldobása
            // mobilon eleinte lehet 100-500 méter
            if (coords.accuracy > 5000) {
                console.log(
                    "Pontatlan GPS:",
                    coords.accuracy + "m"
                );
                return;
            }


            lastPosition = coords;
            lastSendTime = now;


            const data = {

                latitude: coords.latitude,
                longitude: coords.longitude,
                accuracy: coords.accuracy,

                altitude: coords.altitude,
                speed: coords.speed,
                heading: coords.heading,

                timestamp: position.timestamp,

                url_id: url_id,
                tracker_id: tracker_id
            };


            try {

                await fetch("/save_gps/", {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(data)
                });


                console.log("GPS elküldve");


            } catch(err) {

                sendError(err);

            }


        },


        (error)=>{

            console.error(
                "GPS hiba:",
                error.code,
                error.message
            );


            sendError({
                code:error.code,
                message:error.message
            });

        },


        {

            // trackerhez jobb
            enableHighAccuracy:true,

            // lassú GPS esetén várunk
            timeout:120000,

            // 5 perces régi pozíció is elfogadható
            maximumAge:300000
        }

    );
}



function stopLocationTracking(){

    if(gpsWatchId !== null){

        navigator.geolocation.clearWatch(gpsWatchId);
        gpsWatchId=null;

        console.log("GPS tracker leállítva");
    }
}



function sendError(error){

    fetch("/error/", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            message:
                typeof error === "string"
                ? error
                : JSON.stringify(error),

            timestamp:new Date().toISOString()

        })

    }).catch(()=>{});

}