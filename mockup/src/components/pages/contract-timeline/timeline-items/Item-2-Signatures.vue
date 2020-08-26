<template>
  <v-card class="ml-4" color="#fafafa">
    <v-card-text>
      <!-- <div>SIGNED...</div>
      <br />-->
      <div v-for="({requiredNumberOfSignaturesLeft,state},key) in states" :key="key">
        {{ requiredNumberOfSignaturesLeft === 0 ? `Signed by all parties`
        : `Require ${requiredNumberOfSignaturesLeft} more signatures`}} {{` from ${key}`}}
        <progress-icon :state="state" />
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <signatures />
    </v-card-actions>
  </v-card>
</template>
<script>
import SignVue from "./buttons/Sign.vue";
import ProgressIcon from "../../../other/icons/ProgressIcon.vue";
import Signatures from "../../../dialogs/Signatures.vue";
export default {
  name: "item-3",
  description: "description",
  button: SignVue,
  mixins: [],
  data() {
    return {
      states: {
        DTAG: { requiredNumberOfSignaturesLeft: 0, state: "success" },
        TMUS: { requiredNumberOfSignaturesLeft: 1, state: "progress" },
      },
      // allSignatures: {
      //   p1: [
      //     { name: "..1", role: "...", hasSigned: true, isLoggedIn: true },
      //     { name: "..2", role: "...", hasSigned: false, isLoggedIn: false },
      //     { name: "..3", role: "...", hasSigned: false, isLoggedIn: false },
      //   ],
      //   p2: [
      //     { name: "..1", role: "...", hasSigned: true, isLoggedIn: false },
      //     { name: "..2", role: "...", hasSigned: false, isLoggedIn: false },
      //   ],
      // },
    };
  },
  components: {
    Signatures,
    ProgressIcon,
  },
  props: {},
  watch: {},
  methods: {
    // renderState(signatures) {
    //   const requiredNumberOfSignatures = signatures.length;
    //   var count = 0;
    //   for (const signature in signatures) {
    //     const hasSigned = signatures[signature].hasSigned;
    //     hasSigned && count++;
    //   }
    //   return count === requiredNumberOfSignatures
    //     ? `Signed by all parties`
    //     : `Require ${requiredNumberOfSignatures - count} more signatures`;
    // },
  },
  computed: {},
  mounted() {},
};
</script>