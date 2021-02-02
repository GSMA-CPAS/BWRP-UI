<template>
  <fragment>
    <v-combobox :items="codeNames" multiple v-model="value.codes" rows="2" auto-grow label="TADIG Codes" />
    <!-- <v-checkbox
      v-model="value.includeContractParty"
      auto-grow
      label="also contract party"
    /> -->
  </fragment>
</template>
<script>
import {mapActions, mapState} from 'vuex';

export default {
  name: 'tadig-codes',
  description: 'description',
  props: {
    value: Object,
  },
  methods: {
    ...mapActions('workspace-config/tadig-codes', [
      'loadCodes',
    ]),
  },
  computed: {
    ...mapState('workspace-config/tadig-codes', ['codes']),
    codeNames() {
      return this.codes.map((x) => x.code);
    }
  },
  mounted() {
    this.loadCodes();
  },
};
</script>
