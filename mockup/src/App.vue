<template>
  <v-app>
    <v-snackbar color="error" :value="showErrorMessage">
      {{errorMessage}}
      <app-button color="white" @button-pressed="closeErrorMessage" icon svg="close" />
    </v-snackbar>
    <navigation-bar />
    <v-main>
      <v-overlay :value="isLoading">
        Loading, please wait...
        <v-progress-circular indeterminate></v-progress-circular>
      </v-overlay>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import TopNavBarVue from "./components/navigation/TopNavBar.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "app",
  components: { NavigationBar: TopNavBarVue },
  methods: {
    ...mapActions("app-state", ["loading", "loadError", "closeErrorMessage"]),
  },
  computed: {
    ...mapState("app-state", ["isLoading", "errorMessage", "showErrorMessage"]),
  },
  beforeMount() {
    this.axios.interceptors.request.use(
      (config) => {
        this.loading(true);
        return config;
      },
      (error) => {
        this.loadError(error);
        this.loading(false);
        return Promise.reject(error);
      }
    );
    this.axios.interceptors.response.use(
      (response) => {
        this.loading(false);
        return response;
      },
      (error) => {
        this.loadError(error);
        this.loading(false);
        return Promise.reject(error);
      }
    );
  },
};
</script>
<style lang="scss">
@import "./styles/app.scss";
</style>
