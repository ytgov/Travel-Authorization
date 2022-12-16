<template>
    <v-card class="px-5 pb-15"> 
        <v-toolbar
            title="OK"
            class=""                        
            height="100px"
            flat         
            >
            <v-toolbar-title>Pre-Approved Travel</v-toolbar-title>
            <template v-slot:extension>
                <v-tabs v-model="tabs" active-class="primary--text teal lighten-5">
                    <v-tab>Requests</v-tab>
                    <v-tab>Submissions</v-tab>
                </v-tabs>
            </template>
        </v-toolbar>

        <v-tabs-items v-model="tabs">
            <v-tab-item>
                <v-card flat>
                   <preapproved-requests />
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat>
                   <submissions />
                </v-card>
            </v-tab-item>
        </v-tabs-items>        
    </v-card>
</template>

<script>
import PreapprovedRequests from "./Requests/PreapprovedRequests.vue"
import Submissions from "./Submissions/Submissions.vue"

export default {
    name: "Preapproved",
    components:{
        PreapprovedRequests,
        Submissions
    },
    data () {
        return {
           tabs: null,
        }
    },
    mounted() {
        
    },
    methods: { 
        
    }
};
</script>
