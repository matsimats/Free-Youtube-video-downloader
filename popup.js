document.addEventListener("DOMContentLoaded", function () {
    // Referencje do elementów DOM
    const downloadBtn = document.getElementById("downloadBtn");
    const videoUrlInput = document.getElementById("videoUrl");
    const loaderContainer = document.getElementById("loader-container");

    // Handler dla przycisku "Download Video"
    downloadBtn.addEventListener("click", function () {
        const videoUrl = videoUrlInput.value;
        loaderContainer.style.display = "flex"; // Pokazanie loadera

        // Walidacja URL
        if (!videoUrl || !isValidURL(videoUrl)) {
            alert("Please enter a valid YouTube URL.");
            loaderContainer.style.display = "none";;  // Ukrycie loadera
            return;
        }

        // Tworzenie obiektu XMLHttpRequest
        const xhr = new XMLHttpRequest();

        // Konfiguracja i otwarcie zapytania
        xhr.open("GET", `http://localhost:5000/download?url=${encodeURIComponent(videoUrl)}`, true);
        xhr.responseType = "blob";  // Odpowiedź jako blob (binarny plik)

        // Handler dla odpowiedzi
        xhr.onload = function () {
            loaderContainer.style.display = "none"; // Ukrycie loadera
            if (this.status === 200) {
                // Utworzenie obiektu URL dla bloba
                const blob = new Blob([this.response], { type: "video/mp4" });
                const url = window.URL.createObjectURL(blob);

                // Symulacja kliknięcia w link, aby pobrać wideo
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = "video.mp4";  // Możesz zmienić nazwę pliku
                document.body.appendChild(a);
                a.click();

                // Zwolnienie obiektu URL
                window.URL.revokeObjectURL(url);
            } else {
                alert("Could not download the video. Please try again.");
            }
        };

        // Handler dla błędów
        xhr.onerror = function () {
            loaderContainer.style.display = "none";  // Ukrycie loadera
            alert("An error occurred. Please try again.");
        };

        // Wysyłanie zapytania
        xhr.send();
    });

    // Funkcja do walidacji URL
    function isValidURL(url) {
        const pattern = /^https?:\/\/((www\.)?youtube.com\/watch\?v=[a-zA-Z0-9_-]+|youtu.be\/[a-zA-Z0-9_-]+)(\&.*)?$/;
        return pattern.test(url);
    }
});
