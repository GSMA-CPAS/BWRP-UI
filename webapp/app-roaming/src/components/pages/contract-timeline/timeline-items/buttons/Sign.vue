<template>
  <div>
    <v-icon v-if="signedBySelf" x-large>mdi-progress-check </v-icon>
    <v-icon v-else-if="isSigned" x-large>mdi-check-circle-outline </v-icon>
    <app-dialog
      v-else
      outlined
      hide-icon
      title="Are you sure you want to sign this contract?"
      label="Sign"
      label-min-width="90"
      :loading="loadingSpinner"
      @on-open="loadIdentities"
    >
      <template #content>
        <v-select
          :loading="loadingSpinner"
          v-model="selectedIdentity"
          :items="identities"
          item-text="name"
          item-value="name"
          label="Select identity"
          outlined
          no-data-text="No signing identity"
        ></v-select>
      </template>
      <template #actions="{cancel}">
        <app-button @button-pressed="cancel" plain label="Cancel" />
        <app-button
          :disabled="selectedIdentity === null"
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
import {mapGetters, mapState} from 'vuex';
export default {
  name: 'sign-button',
  description: 'description',
  data() {
    return {
      selectedIdentity: null,
    };
  },
  mixins: [timelineMixin],
  computed: {
    ...mapGetters('document', ['signedBySelf', 'isSigned']),
    ...mapState('app-state', ['loadingSpinner']),
  },
  methods: {
    async onSign() {
      if (this.selectedIdentity) {
        await this.signDocument(this.selectedIdentity);
      }
    },
  },
};
</script>
