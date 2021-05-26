<template>
  <timeline-item backgroundColor='background'>
    <template #content>
      <v-card :class="cardTextStyle" color="#fafafa">
        <v-card-text>
          <div class="font-weight-bold text-uppercase mb-3">Signatures</div>
          <v-row class="mb-1">
            <div>
              {{
                `Signed ${totalSignatures[selfMsp]} out of ${minSignaturesSelf} times by ${selfMsp}`
              }}
            </div>
            <v-spacer />
            <v-icon
              v-if="totalSignatures[selfMsp] === minSignaturesSelf"
              color="success"
            >
              mdi-check-circle-outline
            </v-icon>
            <v-progress-circular
              size="23"
              v-else
              :value="(totalSignatures[selfMsp] / minSignaturesSelf) * 100"
              color="success"
            />
          </v-row>
          <v-row>
            <div>
              {{
                `Signed ${totalSignatures[partnerMsp]} out of ${minSignaturesPartner}  times by ${partnerMsp}`
              }}
            </div>
            <v-spacer />
            <v-icon
              v-if="totalSignatures[partnerMsp] === minSignaturesPartner"
              color="success"
            >
              mdi-check-circle-outline
            </v-icon>

            <v-progress-circular
              size="23"
              v-else
              :value="
                (totalSignatures[partnerMsp] / minSignaturesPartner) * 100
              "
              color="success"
            />
          </v-row>
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
