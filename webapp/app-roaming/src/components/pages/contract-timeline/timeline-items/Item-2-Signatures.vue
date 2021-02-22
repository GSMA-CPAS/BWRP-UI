<template>
  <timeline-item>
    <template #content>
      <v-card :class="cardTextStyle" color="#fafafa">
        <v-card-text>
          <b class="text-uppercase">Signatures</b>
          <v-row>
            {{ `Signed ${totalSignatures[selfMsp]} times by ${selfMsp}` }}
          </v-row>
          <v-row>
            {{
              `Signed ${totalSignatures[partnerMsp]} times by ${partnerMsp}`
            }}</v-row
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <signatures />
        </v-card-actions>
      </v-card>
    </template>
    <template #icon>
      <sign-button />
    </template>
  </timeline-item>
</template>
<script>
import SignButton from './buttons/Sign.vue';
import Signatures from '@/components/dialogs/Signatures.vue';
import {timelineMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'item-3',
  description: 'description',
  mixins: [timelineMixin],
  components: {
    Signatures,
    SignButton,
  },
};
</script>
