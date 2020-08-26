<template>
  <app-dialog title="Signatures" label="View Signatures">
    <template #content>
      <parties />
      <row
        v-for="signatureIndex in longestArray(allSignatures)"
        :key="signatureIndex"
        :label="`Signature ${signatureIndex}`"
      >
        <fragment v-for="(signatureArr, arrIndex) in allSignatures" :key="arrIndex">
          <v-col>{{parseSignature(signatureArr[signatureIndex -1]) | isNil}}</v-col>
          <v-col cols="1">
            <progress-icon
              v-if="signatureArr[signatureIndex -1]"
              :state="signatureArr[signatureIndex -1].hasSigned ?'success' :'error'"
            />
          </v-col>
          <v-divider v-if="arrIndex===0" vertical></v-divider>
        </fragment>
      </row>
    </template>
  </app-dialog>
</template>
<script>
import Parties from "./contract-tabs/Parties.vue";
import { utilsMixin } from "../../utils/mixins/handle-data";
import ProgressIcon from "../other/icons/ProgressIcon.vue";
export default {
  components: {
    ProgressIcon,
    Parties,
  },
  name: "signatures",
  description: "This is the dialog to view the signatures.",
  mixins: [utilsMixin],
  methods: {
    parseSignature(signature) {
      return signature && `${signature.name}, ${signature.role}`;
    },
  },
  computed: {
    allSignatures() {
      return [
        [
          {
            name: "name1",
            role: "someRole",
            hasSigned: true,
          },
          {
            name: "name2",
            role: "someRole",
            hasSigned: false,
          },
          {
            name: "name3",
            role: "someRole",
            hasSigned: true,
          },
        ],
        [
          {
            name: "name1",
            role: "someName",
            hasSigned: true,
          },
          {
            name: "name2",
            role: "someName",
            hasSigned: true,
          },
        ],
      ];
    },
  },
};
</script>