<template>
  <timeline-item>
    <template #content>
      <v-card class="ml-4" color="#fafafa">
        <v-card-text>
          <div
            v-for="({ requiredNumberOfSignaturesLeft, state }, key) in states"
            :key="key"
          >
            {{
              requiredNumberOfSignaturesLeft === 0
                ? `Signed by all parties`
                : `Require ${requiredNumberOfSignaturesLeft} more signatures`
            }}
            {{ ` from ${key}` }}
            <progress-icon :state="state" />
          </div>
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
import ProgressIcon from "../../../other/icons/ProgressIcon.vue";
import Signatures from "../../../dialogs/Signatures.vue";
export default {
  name: "item-3",
  description: "description",
  data() {
    return {
      states: {
        DTAG: { requiredNumberOfSignaturesLeft: 0, state: "success" },
        TMUS: { requiredNumberOfSignaturesLeft: 1, state: "progress" },
      },
    };
  },
  components: {
    Signatures,
    SignButton,
    ProgressIcon,
  },
};
</script>