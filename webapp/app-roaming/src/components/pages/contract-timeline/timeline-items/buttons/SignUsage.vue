<template>
  <div class="mr-3">
    <app-dialog
      hide-icon
      title="Are you sure you want to sign this report?"
      label="Accept"
      label-min-width="180"
      :loading="loadingSpinner"
    >
      <!-- @on-open="loadIdentities" -->
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
          label="Ok"
        />
      </template>
    </app-dialog>
  </div>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import {mapGetters, mapState} from 'vuex';
export default {
  name: 'sign-usage-button',
  description: 'description',
  data() {
    return {
      selectedIdentity: null,
    };
  },
  mixins: [timelineMixin],
  computed: {
    ...mapGetters('usage', ['signedBySelf', 'isSigned']),
    ...mapState('app-state', ['loadingSpinner']),
  },
  methods: {
    async onSign() {
      if (this.selectedIdentity) {
        await this.signUsage(this.selectedIdentity);
      }
    },
  },
};
</script>
