<template>
    <div>		
        <v-row class="mt-0 mb-0 mx-0">
            <v-col cols="2" >
                <div class="my-0 mx-1">Preference</div>
                <v-select
                    class="mr-5"
                    :items="preferenceList"								
                    :error="state.preferenceErr"
                    @input="state.preferenceErr=false"
                    label="Preference"
                    v-model="flightOption.preference"								
                    solo />
            </v-col>
            
            <v-col cols="10" >
                <v-card color="#FAFAFA" style="border:2px solid #AACCFF !important;">
                    <v-row class="mt-1 mx-2">
                        <b>COST:</b> <b class="ml-2">$ {{flightOption.cost}}</b>
                    </v-row>
                    <div class="px-1" v-for="flightSegment,inx in flightOption.flightSegments" :key="'segment-'+flightSegment.flightSegmentID+'-'+inx">
                        <table style="width:100%; margin-top:1rem;">
                            <tbody > 
                                <tr style="line-height:1rem;">
                                    <td colspan="3">{{flightSegment.flightNumber}}</td>                                
                                </tr>                           
                                <tr style="background:#F9F9F9;">
                                    <td style="width:16%;" >Departure:</td>
                                    <td style="width:30%;" >{{flightSegment.departDate | beautifyDateTime}}</td>
                                    <td style="width:50%;" >{{flightSegment.departLocation}}</td>
                                </tr>
                                <tr style="line-height:1rem;">
                                    <td style="width:16%;" >Arrival:</td>
                                    <td style="width:30%;" >{{flightSegment.arriveDate | beautifyDateTime}}</td>
                                    <td style="width:50%;" >{{flightSegment.arriveLocation}}</td>
                                </tr>
                                <tr style="background:#F9F9F9;">
                                    <td style="width:16%;" >Duration</td>
                                    <td style="width:30%;" >{{flightSegment.duration}}</td>
                                    <td style="width:50%;" ></td>
                                </tr>                                
                            </tbody>
                        </table>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    // import Vue from "vue";

    export default {		
        name: "FlightOptionCard",
        props: {			
            flightOption: {},
            preferenceList: {}
        },
        data() {
            return {
                
                readonly: false,				

                state: {
                    preferenceErr: false,				
                },

            };
        },
        mounted() {			
        },
        methods: {			
            checkFields() {
                // this.state.pickUpCityErr = this.carRequest.pickUpCity? false:true;
                // this.state.pickUpLocationErr = this.carRequest.pickUpLocation? false:true;
                // this.state.pickUpLocOtherErr = this.carRequest.pickUpLocation=="Other" && !this.carRequest.pickUpLocOther? true: false;				

                // for (const key of Object.keys(this.state)) {
                // 	if (this.state[key]) return false;
                // }
                return true;
            },

        }
    };
</script>

<style scoped>

::v-deep .v-text-field.v-text-field .v-input__control{
    min-height: 5px;
}

</style>