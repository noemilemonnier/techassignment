<template>
    <div>
        <v-row class="mt-5 mb-5">
            <v-col cols="12" md="6" lg="6">
                        <v-card class="ma-4" elevation="3" style="width: 400px;" shaped outlined>
                            <form>
                                <v-card-title class="justify-center"><h3>Nearby Services</h3></v-card-title>
                                <v-card-text>
                                    <p class="caption mx-3">Enter an address in Helsinki, Finland and it will display near by services available.</p>
                                    <v-row class="ma-1">
                                        <vuetify-google-autocomplete id="id" class="mx-3" :v-model="inputAddress" placeholder="Enter an address" v-on:placechanged="getAddressData" v-on:no-results-found="noResultsFound" country="fi"/>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions class="ma-2 pa-1">
                                    <v-btn class="mx-2" color="primary" :disabled="hasSearch" type="submit" @click.prevent="searchButtonPressed">Search</v-btn>
                                    <v-btn class="mx-2" color="primary" :disabled="hasReset" @click.prevent="reset">Reset</v-btn>
                                </v-card-actions>
                            </form>
                        </v-card>
            </v-col>
            <v-col v-if="hasResults" cols="12" md="6" lg="6">
                        <v-card class="justify-center ma-4 ">
                            <GmapMap id="map" ref="map" :center="{lat, lng}" :zoom="14" style="height: 300px;">
                                <GmapInfoWindow :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false"></GmapInfoWindow>
                                <GmapMarker ref="myMarker" v-for="(u, index) in units" :key="index" :position="google && new google.maps.LatLng(u.position.lat, u.position.lng)" :clickable="true" @click="toggleInfoWindow(u,index)"></GmapMarker>
                                <GmapMarker :icon="icon"  :position="google && new google.maps.LatLng(lat, lng)" :clickable="true" @click="toggleHereWindow()"></GmapMarker>
                            </GmapMap>
                        </v-card>
                </v-col>
                <h4 v-if="hasNoResults">No Services Nearby</h4>
        </v-row>
        <v-row v-if="hasLoaded" class="ma-4">
                <v-row class="mx-4">
                    <v-text-field clearable label="Searching..." v-model="filters.search" ></v-text-field>
                </v-row>
                <v-row class="mx-4">
                    <v-card outlined>
                        <client-only>
                                    <v-data-table :headers="tableHeaders" :items="formattedUnits" :search="filters.search" :items-per-page="40">
                                        <template v-slot:[`item.name`]="{ item }">
                                            {{ item.name }}
					                    </template>
                                        <template v-slot:[`item.www`]="{ item }">
						                    {{ item.www  }}
					                    </template>
					                    <template v-slot:[`item.street_address`]="{ item }">
						                    {{ item.street_address  }}
					                    </template>
                                        <template v-slot:[`item.distance`]="{ item }">
						                    {{ item.distance  }}
					                    </template>
                                        <template v-slot:[`item.description`]="{ item }">
						                    {{ item.description  }}
					                    </template>
				                    </v-data-table>
			            </client-only>
		            </v-card>
                </v-row>
        </v-row>
    </div>
</template>

<script>
import axios from "axios";
import {gmapApi} from 'vue2-google-maps'
import apis from "../api/index"

export default {
    head: () => ({
        title: "Resources"
    }),
    data: () => ({
        inputAddress: '',
        map: null,
        count: 0,
        hasResults: false,
        hasNoResults: false,
        hasLoaded: false,
        hasSearch: false,
        hasReset: true,
        radius: 100,
        units: [],
        lat: 0,
        lng: 0,
        filters: {
			search: ""
        },
        tableHeaders: [
            { text: "Name", value: "name" },
            { text: "Website", value: "www", sortable: false },
            { text: "Street Address", value: "street_address"},
            { text: "Distance", value: "distance"},
            { text: "Description", value: "description" , sortable: false }
        ],
        icon: {
            url: "https://icon-library.com/images/maps-pin-icon/maps-pin-icon-13.jpg",
            scaledSize: {width: 28, height: 28},
            labelOrigin: {x: 16, y: -10}
        },
        infoWindowPos: null,
        infoWinOpen: false,
        currentMidx: null,
        infoOptions: {
        	content: '',
            pixelOffset: {
              width: 0,
              height: -35
            }
        },
    }),
    computed:{
        google: gmapApi,
		formattedUnits(){
			return this.units.map(unit => {
                const u = {...unit};
				return u;
			});
        }
    },
    methods: {
        //Stores the coordinates of the inputed address
        getAddressData(addressData) {
            if (addressData !== null) {
                this.lat = addressData.latitude;
                this.lng = addressData.longitude;
            }
        },
        noResultsFound() {
           return "Result not found";
        },
        //Resets the fields
        reset(){
            this.hasSearch = false;
            this.hasReset = true;
            this.count = 0;
            this.inputAddress = '';
            this.units = null;
            this.hasResults=  false;
            this.hasNoResults= false;
            this.hasLoaded= false;
        },
        //Caculates the amount of results for the request and set the page_size field so all results can be shown
        async searchButtonPressed() {
            await apis.getUnitsWithDistance(this.lat, this.lng, this.radius)
            .then(
                response => {
                    this.count = response.data.count;
                    this.hasSearch = true;
                    this.hasReset = false;
                    this.retrieveUnits();
                })
            .catch(error => {
                console.error("There was an error in retrieving units!", error.message);
            });
        },
        //Get the list of units according to the location, radius and page_size
        async retrieveUnits(){
            if(this.count > 0 ){
                await apis.getUnitsAll(this.lat, this.lng, this.radius, this.count)
                .then(
                    response => {
                        if(response.data.results !== null){
                            response.data.results.forEach(unit => {
                                //To check if any field is null as many are and randomly
                                let website = null;
                                let address = null;
                                let nm = null;
                                let descr = null;
                                if(unit.www !== null) website = unit.www.fi;
                                if(unit.description !== null) descr = unit.description.fi;
                                if(unit.street_address !== null) address = unit.street_address.fi;
                                if(unit.name !== null) nm = unit.name.fi;
                                //Store information field desired in array
                                this.units.push({
                                    id: unit.id,
                                    is_active: unit.is_active,
                                    department: unit.department,
                                    description: unit.description,
                                    name: nm,
                                    street_address: address,
                                    description: descr,
                                    www: website,
                                    position: {
                                        lat: unit.location.coordinates[1],
                                        lng: unit.location.coordinates[0]
                                    },
                                    distance: this.getDistanceFromLatLonInKm(this.lat, this.lng, unit.location.coordinates[1], unit.location.coordinates[0])
                                });
                            });
                            this.hasNoResults = false; //do not load the no result message
                            this.hasLoaded = true; //load the map
                        }
                        else{
                            this.hasNoResults = true;
                            this.hasResults = false;
                            this.hasLoaded = false;
                        }
                    }
                ).catch(error => {
                    console.error("There was an error in retrieving units!", error.message);
                });
            }
            else{
                this.hasNoResults = true;
                this.hasResults = false;
                this.hasLoaded = false;
            }
             this.hasResults = true; //load the table
        },
        //This will give a information window for each unit of the list
        toggleInfoWindow(unit, idx) {
            this.infoWindowPos = unit.position;
            this.infoOptions.content = this.getInfoWindowContent(unit);

            //check if its the same marker that was selected if yes toggle
            if (this.currentMidx == idx) {
              this.infoWinOpen = !this.infoWinOpen;
            }
            //if different marker set infowindow to open and reset current place index
            else {
              this.infoWinOpen = true;
              this.currentMidx = idx;

            }
        },
        //This is what each unit information window contains
        getInfoWindowContent(unit) {
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
        },
        //This is the window for the input address
        toggleHereWindow() {
            const p1 = new google.maps.LatLng(this.lat, this.lng);
            this.infoWindowPos = p1;
            this.infoOptions.content = this.getHereContent();

            //check if its the same marker that was selected if yes toggle
            if (this.currentMidx == idx) {
              this.infoWinOpen = !this.infoWinOpen;
            }
            //if different marker set infowindow to open and reset current place index
            else {
              this.infoWinOpen = true;
              this.currentMidx = idx;

            }
        },
        //This is what the input address window
        getHereContent() {
            return (
                `<div>
                    <div>
                        <div>
                            <div style="margin: 3px; color: rgb(190, 50, 35);">
                                <h2> You are here </h2>
                            </div>
                        </div>
                    </div>
                </div>`
            );
        },
        // To calculate the distance between two coordinates in KM
        // Solution from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula?rq=1
         getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
            const R = 6371; // Radius of the earth in km
            let dLat = this.deg2rad(lat2-lat1);
            let dLon = this.deg2rad(lon2-lon1);
            let a = (
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2))
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            let d = R * c; // Distance in km
            return d.toFixed(2);
        },
        deg2rad(deg) {
            return deg * (Math.PI/180)
        }
    }
}
</script>

<style scoped>
.scroll {
   overflow-y: scroll
}
#map{
    height: 100%;
}
#h2{
    font-weight: bold;
    color:rgb(143, 210, 248);
}
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>