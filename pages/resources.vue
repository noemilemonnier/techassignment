<template>
    <div>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" lg="6">
                        <v-card elevation="3" style="width: 100%;" height="100%" shaped outlined>
                            <form>
                                <v-card-title class="justify-center"><h3>Nearby Services</h3></v-card-title>
                                <v-card-text>
                                    <p class="caption mx-3">Enter an address in Helsinki, Finland and it will display near by services available.</p>
                                    <v-row class="ma-1">
                                        <gmap-autocomplete class="mx-3" style="width: 100%; border-bottom-style: dotted;" :disabled="!isValid" :v-model="inputAddress" placeholder="Enter an address" @place_changed="getAddressData" :options="autocompleteOptions"> </gmap-autocomplete>                                    </v-row>
                                </v-card-text>
                                <v-card-actions class="ma-2 pa-1">
                                    <v-btn class="mx-2" color="primary" :disabled="hasSearch" type="submit" @click.prevent="searchButtonPressed">Search</v-btn>
                                    <v-btn class="mx-2" color="primary" :disabled="hasReset" @click.prevent="reset">Reset</v-btn>
                                </v-card-actions>
                            </form>
                        </v-card>
            </v-col>
            <v-col v-if="hasResults" cols="12" md="6" lg="6">
                        <v-card class="justify-center" height="100%" tile>
                            <GmapMap id="map" ref="map" :center="{lat, lng}" :zoom="14" style="height: 300px;">
                                <GmapInfoWindow :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false"></GmapInfoWindow>
                                <GmapMarker ref="myMarker" v-for="(u, index) in units" :key="index" :position="google && new google.maps.LatLng(u.position.lat, u.position.lng)" :clickable="true" @click="toggleInfoWindow(u,index)"></GmapMarker>
                                <GmapMarker :icon="icon"  :position="google && new google.maps.LatLng(lat, lng)" :clickable="true" @click="toggleHereWindow()"></GmapMarker>
                            </GmapMap>
                        </v-card>
                        <h4 v-if="hasNoResults">No Services Nearby</h4>
            </v-col>
        </v-row>
    </v-container>
    <v-container>
        <v-row align="center" justify="center">
            <v-col class="ma-1" v-if="hasLoaded" cols="12" md="" lg="6">
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
            </v-col>
        </v-row>
    </v-container>
    </div>
</template>

<script>
import axios from "axios";
import {gmapApi} from 'vue2-google-maps'
import apis from "../api/index"
import functions from "../app/functions"

export default {
    head: () => ({
        title: "Resources"
    }),
    data: () => ({
        inputAddress: '',
        map: null,
        isValid: true,
        count: 0,
        autocompleteOptions: {
            componentRestrictions: {
                country: ['fi']
            }
        },
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
                this.lat = addressData.geometry.location.lat();
                this.lng = addressData.geometry.location.lng();
            }
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
            this.isValid = true;
        },
        //When no results are found
        noResults(){
            this.hasNoResults = true;
            this.hasResults = false;
            this.hasLoaded = false;
        },
        //Caculates the amount of results for the request and set the page_size field so all results can be shown
        async searchButtonPressed() {
            await apis.getUnitsWithDistance(this.lat, this.lng, this.radius)
            .then(
                response => {
                    this.count = response.data.count;
                    this.hasSearch = true;
                    this.isValid = false;
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
                                    distance: functions.getDistanceFromLatLonInKm(this.lat, this.lng, unit.location.coordinates[1], unit.location.coordinates[0])
                                });
                            });
                            this.hasNoResults = false; //do not load the no result message
                            this.hasLoaded = true; //load the map
                        }
                        else{
                            this.noResults()
                        }
                    }
                ).catch(error => {
                    console.error("There was an error in retrieving units!", error.message);
                });
            }
            else{
                this.noResults()
            }
             this.hasResults = true; //load the table
        },
        //This will give a information window for each unit of the list
        toggleInfoWindow(unit, idx) {
            this.infoWindowPos = unit.position;
            this.infoOptions.content = functions.getInfoWindowContent(unit);

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
        //This is the window for the input address
        toggleHereWindow() {
            const p1 = new google.maps.LatLng(this.lat, this.lng);
            this.infoWindowPos = p1;
            this.infoOptions.content = functions.getHereContent();

            //check if its the same marker that was selected if yes toggle
            if (this.currentMidx == 'mylocation') {
              this.infoWinOpen = !this.infoWinOpen;
            }
            //if different marker set infowindow to open and reset current place index
            else {
              this.infoWinOpen = true;
              this.currentMidx = "mylocation";

            }
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