/*
* This file regroups all functions used throughout the web app
*/

// To calculate the distance between two coordinates in KM
// Solution from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula?rq=1
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    const R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);
    let dLon = deg2rad(lon2-lon1);
    let a = (
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2))
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d.toFixed(2);
}
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

//This is the "You are here" window display
function getHereContent() {
    return (
        `<div>
            <div>
                <div>
                    <div style="color: rgb(190, 50, 35);">
                        <h2> You are here </h2>
                    </div>
                </div>
            </div>
        </div>`
    );
}
 //This is the unit information window display
 function getInfoWindowContent(unit) {
    return (
        `<div>
            <div>
                <div>
                    <div style="margin: 3px; color: rgb(190, 50, 35);">
                        <h2> ${unit.name} </h2>
                    </div>
                </div>
                <div v-if="unit.www !== null" style="margin: 3px;">
                    <span style="font-weight: bold;">Website:  </span>
                        ${unit.www}
                    <br>
                </div>
                <div style="margin: 3px;">
                    <span style="font-weight: bold;">Distance:  </span>
                    ${unit.distance}
                    <span>km</span>
                    <br>
                </div>
                <div v-if="unit.street_address !== null" style="margin: 3px;">
                    <span style="font-weight: bold;">Address:  </span>
                    ${unit.street_address}
                    <span>km</span>
                    <br>
                </div>
                <div v-if="unit.description !== null" style="margin: 3px;">
                    <span style="font-weight: bold;">Description:  </span>
                    ${unit.description}
                    <br>
                </div>
            </div>
        </div>`
    );
}

const functions = {
    getDistanceFromLatLonInKm,
    getHereContent,
    getInfoWindowContent,

}

export default functions