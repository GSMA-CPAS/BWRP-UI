<template>
  <app-dialog
    :title="signatures ? 'Signatures' : 'No existing signatures'"
    label="View Signatures"
  >
    <template v-if="signatures" #content>
      <!-- <parties /> -->
      <row
        v-for="(signature, signatureIndex) in signatures"
        :key="signatureIndex"
        :label="`Signature ${signatureIndex}`"
      >
        <v-col cols="8"> {{ signature }}</v-col>
        <!-- <fragment
          v-for="(signatureArr, arrIndex) in allSignatures"
          :key="arrIndex"
        >
          <v-col>{{
            parseSignature(signatureArr[signatureIndex - 1]) | isNil
          }}</v-col>
          <v-col cols="1">
            <progress-icon
              v-if="signatureArr[signatureIndex - 1]"
              :state="
                signatureArr[signatureIndex - 1].hasSigned ? 'success' : 'error'
              "
            />
          </v-col>
          <v-divider v-if="arrIndex === 0" vertical></v-divider>
        </fragment> -->
      </row>
    </template>
  </app-dialog>
</template>
<script>
import { timelineMixin } from "../../utils/mixins/component-specfic";
// import Parties from "./contract-tabs/Parties.vue";
// import ProgressIcon from "../other/icons/ProgressIcon.vue";
export default {
  components: {
    // ProgressIcon,
    // Parties,
  },
  name: "signatures",
  description: "This is the dialog to view the signatures.",
  mixins: [timelineMixin],
};
</script>