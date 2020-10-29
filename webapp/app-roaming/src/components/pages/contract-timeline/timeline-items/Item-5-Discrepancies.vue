<template>
  <timeline-item>
    <template #content>
      <v-card color="#fafafa">
        <v-card-text>DISCREPANCIES COMPUTED</v-card-text>
        <v-card-actions>
          <v-spacer />
          <discrepancies />
        </v-card-actions>
      </v-card>
    </template>
  </timeline-item>
</template>
<script>
import Discrepancies from "@/components/dialogs/Discrepancies.vue";
import { timelineMixin } from "@/utils/mixins/component-specfic";
export default {
  name: "item-1",
  description: "description",
  mixins: [timelineMixin],
  components: { Discrepancies },
};
</script>