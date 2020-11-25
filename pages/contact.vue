<template>
    <div>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6">
                <v-card class="mt-10" style="width: 100%; height=100%" flat outlined>
                    <v-card-title class="headline">
                        <h2 class="my-4 primary--text">To Contact</h2>
                    </v-card-title>
                    <v-card-text class="mx-4">
                        <p ><v-icon class="mx-2" size="32px">{{$i.mdiLinkedin}}</v-icon><a style="text-decoration: none;font-size: 15px;" href="https://www.linkedin.com/in/noemilemonnier/" target="_blank" rel="noopener noreferrer"> By LinkedIn </a> </p>
                        <p><v-icon class="mx-2" size="32px">{{$i.mdiEmail}}</v-icon> <a style="text-decoration: none; font-size: 15px;" href="mailto:noemilemonnier@gmail.com" target="_blank" rel="noopener noreferrer"> By Email </a> </p>
                        <p><v-icon class="mx-2" size="32px">{{$i.mdiGithub}}</v-icon> <a style="text-decoration: none; font-size: 15px;" href="https://github.com/noemilemonnier/" target="_blank" rel="noopener noreferrer"> By GitHub </a> </p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
<script>
export default {
    head: () => ({
        title: "Contact"
    }),
}
</script>