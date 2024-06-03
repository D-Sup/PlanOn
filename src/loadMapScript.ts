const loadMapScript = () => {
  return new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = () => {
      resolve();
    };
  });
};

export default loadMapScript;