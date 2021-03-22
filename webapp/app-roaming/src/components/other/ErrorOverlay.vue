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
      <v-card-text class="subtitle-1">
        <div v-if="errorResponse.code">{{ `${errorResponse.code}` }}</div>
        <div v-else-if="!isArray">Please verify your input</div>
        <div
          v-else
          v-for="({step, message, from}, i) in errorResponse.body"
          :key="i"
        >
          <v-row>
            <v-col class="pl-0">{{ `[${step}] ${message}` }}</v-col>
            <v-col cols="2" v-if="from">{{ from }}</v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <app-button label="Ok" @button-pressed="setErrorVisibility(false)" />
      </v-card-actions>
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
  computed: {
    isArray() {
      return this.errorResponse.body instanceof Array;
    },
  },
};
</script>
