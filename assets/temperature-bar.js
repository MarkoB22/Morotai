document.addEventListener('DOMContentLoaded', function() {
  updateTemperatureBar();
});
function updateTemperatureBar() {
  const temperatureElement = document.querySelector('.temperature-bar');
  const temperatureValue = parseFloat(temperatureElement.dataset.temperature || 0);

  const temperatureRange = "-10-30°C";
  const temperatureValues = temperatureRange.split('-');
  const startTemperature = parseFloat(temperatureValues[0]);
  const endTemperature = parseFloat(temperatureValues[1]);

  const difference = temperatureValue - startTemperature;
  const range = endTemperature - startTemperature;
  const rawPercentage = (difference / range) * 100;

  const adjustedPercentage = Math.min(100, Math.max(0, rawPercentage));

  temperatureElement.style.background = `linear-gradient(90deg, #F4F4F4 ${adjustedPercentage}%, #000 ${adjustedPercentage}%, #000 ${100 - adjustedPercentage}%, #F4F4F4 ${100 - adjustedPercentage}%)`;
}
