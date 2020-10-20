<template>
  <v-overlay v-if="errorResponse" opacity="0.95" v-model="showError">
    <v-card width="750" class="pa-2" light>
      <v-card-title>
        {{ errorResponse.statusText }}
        <v-spacer />
        <app-button
          color="black"
          @button-pressed="setErrorVisibility(false)"
          icon
          svg="close"
        />
      </v-card-title>
      <v-card-text class="title error--text">{{
        `Status code ${errorResponse.status}`
      }}</v-card-text>
    </v-card>
  </v-overlay>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "error-overlay",
  description: "-",
  methods: {
    ...mapActions("app-state", ["setErrorVisibility"]),
  },
  computed: {
    ...mapState("app-state", ["showError"]),
    ...mapState("app-state", ["errorResponse", "showErrorMessage"]),
  },
  mounted() {},
};
</script>