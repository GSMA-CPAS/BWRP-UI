<template>
    <v-app :style="{background: $vuetify.theme.themes['light'].background}">
        <router-view></router-view>
        <modal/>
    </v-app>
</template>

<script>

    export default {
        name: 'App'
    };

</script>
