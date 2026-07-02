const newTripFormEl = document.getElementsByTagName("form")[0];
const dateInputEl = document.getElementById("date");
const fuelInputEl = document.getElementById("fuelConsumed");
const distanceInputEl = document.getElementById("distanceTravelled");
const STORAGE_KEY = "mileageTracker";
const pastTripsContainer = document.getElementById("pastTrips");


// Listen to form submissions. On each submit, new event happens
newTripFormEl.addEventListener("submit", (event) => {
    // Prevent the form from submitting to the server
    // since everything is client-side.
    event.preventDefault();

    const date = dateInputEl.value;
    const fuel = fuelInputEl.value;
    const distance = distanceInputEl.value;

    // Check if the dates are invalid
    if (checkDatesInvalid(date)) {
        // If the dates are invalid, exit.
        return;
    }

    // Store the new trip in our client-side storage.
    storeTrip(date, fuel, distance);

    // Refresh the UI.
    renderPastTrips();

    // Reset the form.
    newTripFormEl.reset();
});

function checkDatesInvalid(date) {
  // Check that end date is after start date and neither is null.
  if (!date) {
    // To make the validation robust we could:
    // 1. add error messaging based on error type
    // 2. Alert assistive technology users about the error
    // 3. move focus to the error location
    // instead, for now, we clear the dates if either
    // or both are invalid
    newTripFormEl.reset();
    // as dates are invalid, we return true
    return true;
  }
  // else
  return false;
}

function storeTrip(date, fuel, distance) {
    // Get data from storage.
    const trips = getAllStoredTrips();

    // Add the new trip object to the end of the array
    trips.push({date, fuel, distance});

    // Sort the array so that periods are ordered by date, from newest
    // to oldest.
    trips.sort((a, b) => new Date(b.date) - new Date(a.date)); // this seems failable

    // Store the updated array back in the storage.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

function getAllStoredTrips() {
    // Get the string of period data from localStorage
    const data = window.localStorage.getItem(STORAGE_KEY);

    // If no periods were stored, default to an empty array
    // otherwise, return the stored data as parsed JSON
    let trips = [];
    if(data){
        trips = JSON.parse(data);
    }

    return trips;
}

function renderPastTrips() {
    // get the parsed string of periods, or an empty array.
    const trips = getAllStoredTrips();

    // exit if there are no periods
    if (trips.length === 0) {
        return;
    }

    // Clear the list of past periods, since we're going to re-render it.
    pastTripsContainer.textContent = "";

    const pastTripsHeader = document.createElement("h2");
    pastTripsHeader.textContent = "Past trips";

    const pastTripsList = document.createElement("ul");

    // Loop over all periods and render them.
    trips.forEach((trip) => {
        const tripEl = document.createElement("li");
        tripEl.textContent = `${formatDate(trip.date)} : ${trip.fuel} Gallons, ${trip.distance} Miles`;
        pastTripsList.appendChild(tripEl);
    });

    pastTripsContainer.appendChild(pastTripsHeader);
    pastTripsContainer.appendChild(pastTripsList);
}

function formatDate(dateString) {
  // Convert the date string to a Date object.
  const date = new Date(dateString);

  // Format the date into a locale-specific string.
  // include your locale for better user experience
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

// Start the app by rendering the past trips.
renderPastTrips();
