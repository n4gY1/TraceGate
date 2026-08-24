function sendLocation(url_id, tracker_id) {
    return new Promise((resolve) => {

        if (!navigator.geolocation) {
            resolve();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {

                const data = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                    url_id: url_id,
                    tracker_id: tracker_id
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
                    console.error(err);
                }

                resolve();
            },

            (error) => {
                console.error(
                    "Helymeghatározási hiba:",
                    error.message
                );

                resolve();
            },

            {
                enableHighAccuracy: true,
                timeout: 60000,
                maximumAge: 300000
            }
        );
    });
}