<template>
  <v-overlay v-if="errorResponse" opacity="0.5" v-model="showError">
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
import {appStateMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'error-overlay',
  description:
    'This is the overlay which appears when an api call returns an error.',
  mixins: [appStateMixin],
};
</script>
