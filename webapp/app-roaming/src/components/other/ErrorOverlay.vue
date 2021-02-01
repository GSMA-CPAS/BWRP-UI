<template>
  <v-overlay v-if="errorResponse" opacity="0.5" v-model="showError">
    <v-card width="750" class="pa-2" light>
      <v-card-title>
        {{ errorResponse.title }}
        <v-spacer />
        <v-icon color="dark" @click="setErrorVisibility(false)">
          mdi-close
        </v-icon>
      </v-card-title>
      <v-card-text class="title error--text">{{
        `${errorResponse.body}`
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
