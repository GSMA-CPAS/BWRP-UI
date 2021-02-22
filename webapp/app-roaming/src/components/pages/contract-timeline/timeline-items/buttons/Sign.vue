<template>
  <div>
    <v-icon v-if="isSigned" color="success" x-large>
      mdi-check-circle-outline
    </v-icon>
    <app-dialog
      v-else
      outlined
      hide-icon
      title="Are you sure you want to sign this contract?"
      label="Sign"
      label-min-width="90"
      :loading="signing"
    >
      <template #actions="{cancel}">
        <app-button @button-pressed="cancel" plain label="Cancel" />
        <app-button
          @button-pressed="
            onSign();
            cancel();
          "
          label="Confirm"
        />
      </template>
    </app-dialog>
  </div>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'sign-button',
  description: 'description',
  mixins: [timelineMixin],
  methods: {
    async onSign() {
      await this.signDocument();
    },
  },
};
</script>
