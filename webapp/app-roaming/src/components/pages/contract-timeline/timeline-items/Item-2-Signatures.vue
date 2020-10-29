<template>
  <timeline-item>
    <template #content>
      <v-card class="ml-4" color="#fafafa">
        <v-card-text>
          {{ `Signed ${signatures.length} times.` }}
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
import SignButton from "./buttons/Sign.vue";
import Signatures from "@/components/dialogs/Signatures.vue";
import { timelineMixin } from "@/utils/mixins/component-specfic";
export default {
  name: "item-3",
  description: "description",
  mixins: [timelineMixin],
  components: {
    Signatures,
    SignButton,
  },
};
</script>