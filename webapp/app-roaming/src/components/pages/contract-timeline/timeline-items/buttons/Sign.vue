<template>
  <fragment>
    <app-dialog
      outlined
      hide-icon
      title="Are you sure you want to sign this contract?"
      label="Sign"
      :loading="signing"
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
  </fragment>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "sign-button",
  description: "description",
  methods: {
    ...mapActions("document", ["signDocument"]),
    async onSign() {
      await this.signDocument();
    },
  },
  computed: {
    ...mapGetters("document", ["signatures"]),
    ...mapState("app-state", ["signing"]),
  },
};
</script>