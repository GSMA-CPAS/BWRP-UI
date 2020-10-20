<template>
  <v-app>
    <error-overlay />
    <breadcrumb />
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
import { mapState, mapActions } from "vuex";
import Breadcrumb from "./components/navigation/Breadcrumb.vue";
import ErrorOverlay from "./components/other/ErrorOverlay.vue";

export default {
  components: {
    ErrorOverlay,
    Breadcrumb,
  },
  name: "app",
  methods: {
    ...mapActions(["setup", "loadDocuments"]),
  },
  computed: {
    ...mapState(["user"]),
    ...mapState("app-state", ["isLoading"]),
  },
  watch: {
    async $route(to, from) {
      if (from.name === "create-page") {
        await this.loadDocuments();
      }
    },
  },
  async created() {
    await this.setup();
  },
};
</script>
<style lang="scss">
@import "./styles/app.scss";
</style>
