<template>
  <fragment>
    <parties />
    <row
      v-for="(signature, msp, i) in signatures"
      :label="`Signature ${i}`"
      :key="msp"
    >
      <fragment v-for="(msp, index) in parties" :key="msp">
        <v-col>{{ parseSignature(signatures[msp][i]) | isNil }}</v-col>
        <v-divider v-if="index === 0" vertical></v-divider>
      </fragment>
    </row>
  </fragment>
</template>
<script>
import { mapState } from "vuex";
import Parties from "./Parties";
import { utilsMixin } from "../../../utils/mixins/handle-data";
import { timelineMixin } from "../../../utils/mixins/component-specfic";
export default {
  name: "tab-3",
  label: "Signatures",
  description: "description",
  mixins: [utilsMixin, timelineMixin],
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
      return signature && `${signature?.name}, ${signature?.role}`;
    },
  },
  computed: {
    ...mapState("document", {
      signatures: (state) => state.document.data.signatures,
    }) /* 
    ...mapGetters("document", ["signatures"]), */,
  },
  mounted() {},
};
</script>