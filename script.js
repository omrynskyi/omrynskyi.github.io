var firebaseConfig = {
    apiKey: "AIzaSyCGqa-UqWc1piwR6dcdi_2GFH_59JCqUbc",
    authDomain: "fucktaps-5b81b.firebaseapp.com",
    projectId: "fucktaps-5b81b",
    storageBucket: "fucktaps-5b81b.appspot.com",
    messagingSenderId: "493483922119",
    appId: "1:493483922119:web:6964c571b3f37d311e24e2",
    measurementId: "G-QLJX7LFVBB",
};
firebase.initializeApp(firebaseConfig);

async function init() {
    const userCredential = await firebase.auth().signInAnonymously();
}
init();

var db = firebase.firestore();
let allSightings = [];
let showingAll = false;
var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const now = new Date();
let currentDay = days[now.getDay()];
document.getElementById(currentDay).style.backgroundColor = "#3797F0";
document.getElementById("now_show").innerHTML=currentDay;
var map;
let dropped = false;
var forecastMap;
var markers = [];
var colleges = [
    { name: "Cowell Lot 106", lat: 36.99828, lng: -122.053877 },
    { name: "Cowell Lot 107", lat: 36.997918, lng: -122.053193 },
    { name: "Cowell Lot 108", lat: 36.997613, lng: -122.052994 },
    { name: "Cowell Circle", lat: 36.997705, lng: -122.053444 },

    { name: "Stevenson Lot 109", lat: 36.998219, lng: -122.052683 },
    { name: "Stevenson Lot 110", lat: 36.99822, lng: -122.051618 },
    { name: "Stevenson Circle", lat: 36.99822, lng: -122.051618 },

    { name: "Gym Lot 103", lat: 36.99498, lng: -122.055254 },
    { name: "East Remote", lat: 36.991035, lng: -122.053164 },
    { name: "West Remote", lat: 36.98855, lng: -122.065901 },
    { name: "The Village Lot 168", lat: 36.985349, lng: -122.055505 },
    { name: "Baytree Bookstore Lot 102", lat: 36.997399, lng: -122.055595 },

    { name: "McHenry Library Lot 101", lat: 36.995104, lng: -122.057185 },
    { name: "McHenry Library Lot 120", lat: 36.996277, lng: -122.059167 },

    { name: "Music Building Lot 126", lat: 36.993388, lng: -122.061556 },

    { name: "Merrill Lot 119", lat: 36.999681, lng: -122.051747 },
    { name: "Merrill Circle", lat: 6.999544, lng: -122.052738 },

    { name: "Porter Lot 124", lat: 36.99437, lng: -122.06415 },
    { name: "Porter Lot 125", lat: 36.9938, lng: -122.064738 },

    { name: "Rachel Carson Lot 146", lat: 36.992282, lng: -122.064506 },
    { name: "Rachel Carson Lot 160", lat: 36.990212, lng: -122.06478 },
    { name: "Rachel Carson Lot 161", lat: 36.990005, lng: -122.064874 },
    { name: "Rachel Carson Lot 162", lat: 36.990049, lng: -122.065698 },

    { name: "Family Housing Lot 129", lat: 36.991003, lng: -122.067091 },
    { name: "Family Housing Lot 130", lat: 36.990828, lng: -122.067578 },
    { name: "Family Housing Lot 131", lat: 36.991186, lng: -122.067705 },
    { name: "Family Housing Lot 132", lat: 36.990828, lng: -122.068376 },
    { name: "Family Housing Lot 133", lat: 36.991198, lng: -122.068438 },
    { name: "Family Housing Lot 134", lat: 36.990586, lng: -122.068785 },
    { name: "Family Housing Lot 135", lat: 36.991865, lng: -122.067683 },
    { name: "Family Housing Lot 136", lat: 36.99258, lng: -122.067582 },

    { name: "Kresge Lot 142", lat: 36.99919, lng: -122.066422 },
    { name: "Kresge Lot 143", lat: 36.997061, lng: -122.067064 },
    { name: "Kresge Lot 145", lat: 36.997276, lng: -122.067244 },
    { name: "Kresge Lot 147", lat: 36.996812, lng: -122.065315 },

    { name: "West Parking Garage", lat: 36.999068, lng: -122.063678 },
    { name: "West Charging Station", lat: 36.999126, lng: -122.063343 },

    { name: "Jack Baskin Lot 157", lat: 36.999126, lng: -122.063343 },
    { name: "Jack Baskin Lot 138", lat: 37.000204, lng: -122.063897 },

    { name: "Thimann Lot 138", lat: 36.998152, lng: -122.062603 },

    { name: "Redwood Grove Lot 158", lat: 36.998293, lng: -122.064609 },
    { name: "Redwood Grove Lot 159", lat: 36.997111, lng: -122.063948 },

    { name: "Oakes Circle", lat: 36.990163, lng: -122.063304 },

    { name: "College 10 Lot 114", lat: 37.000129, lng: -122.058957 },
    { name: "College 10 Lot 164", lat: 37.000826, lng: -122.059137 },
    { name: "College 10 Lot 165", lat: 37.001753, lng: -122.059404 },
    { name: "College 10 Lot 165", lat: 37.001753, lng: -122.059404 },
    { name: "College 10 Lot 167", lat: 37.003277, lng: -122.058957 },

    { name: "College 9 Lot 166", lat: 37.001763, lng: -122.057817 },
    { name: "College 9 Lot 166", lat: 37.001763, lng: -122.057817 },
];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(36.995412, -122.060783),
        gestureHandling: 'greedy'
    });
    forecastMap = new google.maps.Map(document.getElementById("forecastMap"), {
        zoom: 14.5,
        center: new google.maps.LatLng(36.995412, -122.060783),
        gestureHandling: 'greedy'
    });

    for (let i = 0; i < colleges.length; i++) {
        let college = colleges[i];
        let marker = new google.maps.Marker({
            position: { lat: college.lat, lng: college.lng },
            map: map,
            title: college.name,
        });
        marker.addListener("click", function () {
            reportSighting(college.name);
        });
        markers.push(marker);
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    alert(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    map.setCenter(pos);
}

function reportSighting(collegeName, markerPosition) {
    const confirmation = window.confirm(
        `Do you want to report a TAPS sighting at ${collegeName}?`
    );
    if (confirmation) {
        const userId = firebase.auth().currentUser.uid;
        db.collection("sightings").add({
            uid: userId,
            college: collegeName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        fetchSightings();
    }
}

function days_dropdown(){
    let elem = document.getElementById("days_show");
    if(dropped){
        elem.style.display = "none";
    }else{
        elem.style.display = "block";
    }
    dropped = !dropped;
    
}

function displaySightings() {
    let displayed_colleges = [];
    const container = document.getElementById("sightings");
    container.innerHTML = "";
    let data = allSightings.slice(0, 20);
    data.forEach((sighting) => {
        if (sighting.time == currentDay) {
            if (
                displayed_colleges.find((element) => element > sighting.college) ==
                undefined
            ) {
                let div = document.createElement("div");
                div.className = "item";
                div.innerHTML = `<div class="sighting-location">${sighting.college}</div><div>${sighting.time_exact}</div>`;
                displayed_colleges.push(sighting.college);
                const result = colleges.find(({ name }) => name === sighting.college);

                let marker = new google.maps.Marker({
                    position: { lat: result.lat, lng: result.lng },
                    map: forecastMap,
                    title: result.name,
                });

                container.appendChild(div);
            }
        }
    });
    if(displayed_colleges.length==0){
        let div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `<div class="sighting-location">No Data Avalible</div>`;
        container.appendChild(div);
    }
}

function toggleSightings() {
    showingAll = !showingAll;
    displaySightings();
    document.querySelector("button").textContent = showingAll
        ? "Show less"
        : "Show more";
}
function changeDay(day) {
    document.getElementById(currentDay).style.backgroundColor = "white";
    currentDay = day;
    document.getElementById(day).style.backgroundColor = "#3797F0";
    document.getElementById("now_show").innerHTML=currentDay;
    forecastMap = new google.maps.Map(document.getElementById("forecastMap"), {
        zoom: 15.5,
        center: new google.maps.LatLng(36.995412, -122.060783),
    });

    displaySightings();
}
function fetchSightings() {
    
    db.collection("sightings")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
            allSightings = [];
            querySnapshot.forEach((doc) => {
                const sightingData = doc.data();
                if (sightingData.timestamp) {
                    const time = sightingData.timestamp.toDate();
                    allSightings.push({
                        college: sightingData.college,
                        time: days[time.getDay()],
                        time_exact: time.toLocaleString(),
                    });
                }
            });
            displaySightings();
        });
}
function rad(x) {return x*Math.PI/180;}

function findNearby(position){
    let smallest = [];
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var R = 6371; // radius of earth in km
    var distances = [];
    var closest = -1;
    for( i=0;i<colleges.length; i++ ) {
        var mlat = colleges[i].lat;
        var mlng = colleges[i].lng;
        var dLat  = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
        smallest[i]= {d: d, obj: colleges[i]};
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }
    smallest.sort((a,b) => a.d - b.d);
    console.log(smallest);
    displayLocation(smallest);
}


function displayLocation(smallest){
    
    for (let i = 0; i < 5; i++){
        let div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `<div class="sighting-location">${smallest[i].obj.name}</div>`;
        document.getElementById("locations").appendChild(div);
    }
}
function error(errorObj){
    alert(errorObj.code + ": " + errorObj.message); 
}
function currentLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(findNearby,error,{enableHighAccuracy: true, maximumAge: 10000});
      } else {
        let div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `<div class="sighting-location">Geolocation not supportet</div>`;
        document.getElementById("locations").appendChild(div);
      }
}

fetchSightings();
