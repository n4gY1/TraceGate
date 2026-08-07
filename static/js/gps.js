async function sendLocation(url_id,tracker_id) {

    if (!navigator.geolocation) {
        return;
    }

    try {
        // Engedély állapot lekérdezése
        //const permission = await navigator.permissions.query({
        //    name: "geolocation"
        //});

        // Ha tiltva van
        //if (permission.state === "denied") {
            //console.error("A GPS hozzáférés tiltva van.");
        //    return;
        //}

        // Ez automatikusan felugrasztja az engedélykérést,
        // ha még nincs eldöntve
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const data = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                    url_id: url_id,
                    tracker_id:tracker_id
                };

                try {
                    await fetch("/save_gps/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });
                } catch (err) {
                    fetch("/error/", {
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify({
                            message:err.message,
                            stack:err.stack
                        })
                    });

                }
            },
            (error) => {
                console.error("Helymeghatározási hiba:", error.message);
                fetch("/error/", {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        message:error.message,
                        stack:error.stack
                    })
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 60000,
                maximumAge: 300000
            }
        );
    } catch (err) {
        fetch("/error/", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                message:err.message,
                stack:err.stack
            })
        });
    }
}