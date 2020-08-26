<template>
  <fragment>
    <parties />
    <row
      v-for="signatureIndex in longestArray(signatures)"
      :key="signatureIndex"
      :label="`Signature ${signatureIndex}`"
    >
      <fragment v-for="(signatureArr, arrIndex) in signatures" :key="arrIndex">
        <v-col>{{parseSignature(signatureArr[signatureIndex -1]) | isNil}}</v-col>
        <v-divider v-if="arrIndex===0" vertical></v-divider>
      </fragment>
    </row>
  </fragment>
</template>
<script>
import { mapGetters } from "vuex";
import Parties from "./Parties";
import { utilsMixin } from "../../../utils/mixins/handle-data";
export default {
  name: "tab-3",
  label: "Signatures",
  description: "description",
  mixins: [utilsMixin],
  data() {
    return {};
  },
  components: {
    Parties,
  },
  props: {},
  watch: {},
  methods: {
    parseSignature(signature) {
      return signature && `${signature.name}, ${signature.role}`;
    },
  },
  computed: {
    ...mapGetters("contract", ["signatures"]),
  },
  mounted() {},
};
</script>