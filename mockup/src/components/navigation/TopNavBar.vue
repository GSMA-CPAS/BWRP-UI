<template>
  <v-app-bar app class="dark">
    <router-link to="/" class="d-flex align-center">
      <v-img
        alt="Logo"
        class="shrink mr-2"
        contain
        :src="logo"
        transition="scale-transition"
        width="45"
      />
    </router-link>
    <v-spacer />
    <app-button to="/contracts" outlined color="white" label="Return to Contracts Overview" />
  </v-app-bar>
</template>

<script>
import logo from "../../assets/logo.png";

export default {
  name: "top-nav-bar",
  data: () => ({
    logo
  })
};
</script>
