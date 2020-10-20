<template>
  <fragment>
    <app-dialog
      v-if="!signatures"
      outlined
      hide-icon
      title="Are you sure you want to sign this contract?"
      label="Sign"
    >
      <template #actions="{ cancel }">
        <app-button @button-pressed="cancel" outlined label="Cancel" />
        <app-button
          @button-pressed="
            onSign();
            cancel();
          "
          label="Confirm"
        />
      </template>
    </app-dialog>
    <v-icon v-else color="success" x-large>mdi-check-circle-outline</v-icon>
  </fragment>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "sign-button",
  description: "description",
  mixins: [],
  components: {},
  props: {},
  watch: {},
  methods: {
    ...mapActions("document", ["signDocument"]),
    onSign() {
      this.signDocument();
    },
  },
  computed: { ...mapGetters("document", ["signatures"]) },
};
</script>