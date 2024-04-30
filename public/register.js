if ("serviceWorker" in navigator) {
  // declaring scope manually
  navigator.serviceWorker.register("/sw.js", { scope: "./" }).then(
    (registration) => {
    },
    (error) => {
      console.error(`Service worker registration failed: ${error}`);
    },
  );
} else {
  console.error("Service workers are not supported.");
}