<template>
  <timeline-item left>
    <template #content>
      <v-card :class="cardTextStyle" color="#fafafa">
        <v-card-text>
          <div class="font-weight-bold text-uppercase mb-3">Signatures</div>
          <v-row class="mb-1">
            <div>
              {{
                `Signed ${totalUsageSignatures[selfMsp]} out of 1 times by ${selfMsp}`
              }}
            </div>
            <v-spacer />
            <v-icon
                v-if="totalUsageSignatures[selfMsp] === 1"
                color="success"
            >
              mdi-check-circle-outline
            </v-icon>
            <v-progress-circular
                size="23"
                v-else
                :value="(totalUsageSignatures[selfMsp]) * 100"
                color="success"
            />
          </v-row>
          <v-row>
            <div>
              {{
                `Signed ${totalUsageSignatures[partnerMsp]} out of 1 times by ${partnerMsp}`
              }}
            </div>
            <v-spacer />
            <v-icon
                v-if="totalUsageSignatures[partnerMsp] === 1"
                color="success"
            >
              mdi-check-circle-outline
            </v-icon>

            <v-progress-circular
                size="23"
                v-else
                :value="
                (totalUsageSignatures[partnerMsp]) * 100
              "
                color="success"
            />
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <usage-signatures />
        </v-card-actions>
      </v-card>
    </template>
    <template #icon>
      <v-icon color="primary" x-large>mdi-check-circle-outline</v-icon>
    </template>
  </timeline-item>
</template>

<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import UsageSignatures from '@/components/dialogs/UsageSignatures.vue';
export default {
  name: 'Item-9-Result',
  mixins: [timelineMixin],
  components: {
    UsageSignatures,
  },
};
</script>

<style scoped>

</style>
