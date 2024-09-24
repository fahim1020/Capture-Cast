document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const play = document.getElementById("play");
  // const pause = document.getElementById("pause");
  const stop = document.getElementById("stop");
  const video = document.getElementById("video");
  const switchIcon = document.getElementById("switchIcon");

  let mediaRecorder;
  let recordedChunks = [];
  let recordingStarted = false; // Track recording state

  // Functions
  const startRecording = async () => {
    const constraints = {
      video: { mediaSource: "screen" },
      audio: switchIcon.src.includes("switchOff.png") ? false : true,
    };

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      if (constraints.audio) {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const combinedStream = new MediaStream([
          ...stream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);
        video.srcObject = combinedStream;
        mediaRecorder = new MediaRecorder(combinedStream, {
          mimeType: "video/webm",
        });
      } else {
        video.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "recording.webm";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Reset recording state and enable switchIcon after recording stops
        recordingStarted = false;
        switchIcon.style.pointerEvents = "auto";
        switchIcon.readOnly = true; // Set audio toggle to read-only
        audio.classList.remove("cursor-pointer");
      };

      mediaRecorder.start();
      play.classList.add("hidden");
      // pause.classList.remove("hidden");
      stop.classList.remove("hidden");
      video.classList.remove("hidden");

      // Disable switchIcon once recording starts
      switchIcon.style.pointerEvents = "none";
      switchIcon.readOnly = false; // Set audio toggle back to editable
      recordingStarted = true;
    } catch (err) {
      console.error("Error: " + err);
    }
  };

  const stopRecording = () => {
    try {
      // Stop all tracks in the video stream
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());

      // Stop mediaRecorder and clear recordedChunks
      mediaRecorder.stop();
      recordedChunks = [];

      // Reset elements
      play.classList.remove("hidden");
      // pause.classList.add("hidden");
      stop.classList.add("hidden");
      video.classList.add("hidden");
      audio.classList.add("cursor-pointer");

      // Enable switchIcon after stopping recording
      switchIcon.style.pointerEvents = "auto";
      switchIcon.readOnly = true; // Set audio toggle to read-only
      recordingStarted = false;
    } catch (err) {
      console.error("Error stopping recording: " + err);
    }
  };

  const switchAudio = () => {
    if (!recordingStarted) {
      // Allow toggling only if recording has not started
      if (switchIcon.src.includes("switchOff.png")) {
        switchIcon.src = "../assets/switchOn.png";
      } else {
        switchIcon.src = "../assets/switchOff.png";
      }
    }
  };

  // Event Listeners
  play.addEventListener("click", startRecording);
  stop.addEventListener("click", stopRecording);
  switchIcon.addEventListener("click", switchAudio);

  // Credit Toast
  Toastify({
    text: "Developed By 'Istiak Rahman'",
    duration: 5000,
    gravity: "bottom",
    position: "left",
    stopOnFocus: true,
    style: {
      background: "#3498db",
      color: "#fff",
      fontWeight: "bold",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      borderRadius: "8px",
      padding: "16px",
      width: "300px",
      overflow: "hidden",
      position: "absolute",
      zIndex: "50",
    },
    onClick: function () {},
  }).showToast();
});

// User is offline
window.addEventListener("offline", () => {
  Toastify({
    text: "You are offline",
    duration: -1, // Set duration to -1 to prevent auto-closing
    close: true, // Enable the close button
    gravity: "bottom", // top or bottom
    position: "left", // left, center or right
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#ff6347",
      color: "#fff",
      fontWeight: "bold",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      borderRadius: "8px",
      padding: "16px",
      width: "300px",
      overflow: "hidden",
      position: "absolute",
      zIndex: "50",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
});

// User is online
window.addEventListener("online", () => {
  Toastify({
    text: "Welcome Back!",
    duration: 4000,
    close: true,
    gravity: "bottom", // top or bottom
    position: "left", // left, center or right
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
      color: "#fff",
      fontWeight: "bold",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      borderRadius: "8px",
      padding: "16px",
      width: "300px",
      overflow: "hidden",
      position: "absolute",
      zIndex: "50",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
});
