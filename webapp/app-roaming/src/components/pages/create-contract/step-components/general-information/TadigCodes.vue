<template>
  <v-combobox
    :items="codeNames"
    multiple
    v-model="value.codes"
    rows="2"
    auto-grow
    label="TADIG Codes"
    @change="removeSearchTerm"
    :search-input.sync="groupCodeSearchTerm"
  />
  <!-- <v-checkbox
      v-model="value.includeContractParty"
      auto-grow
      label="also contract party"
    /> -->
</template>
<script>
import {mapActions, mapState} from 'vuex';
import Vue from 'vue';

export default {
  name: 'tadig-codes',
  description: 'description',
  props: {
    value: Object,
  },
  data: () => ({
    groupCodeSearchTerm: null,
  }),
  methods: {
    ...mapActions('workspace-config/tadig-groups', ['loadGroupCodes']),
    removeSearchTerm(e) {
      this.groupCodeSearchTerm = null;
      this.groupCodeRemovalSearchTerm = null;
    },
  },
  watch: {
    value: {
      async handler(val) {
        let newVal = [];
        let changed = false;
        for (const code of val.codes) {
          if (this.groupNames.indexOf(code) !== -1) {
            const codeId = this.groups[this.groupNames.indexOf(code)].id;
            await this.loadGroupCodes(codeId);
            for (const c of this.groupCodes) {
              newVal.push(c.code);
            }
            changed = true;
          } else {
            newVal.push(code);
          }
        }

        newVal = [...new Set(newVal)];
        if (changed) {
          Vue.nextTick(() => {
            this.value.codes = newVal;
          });
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState('workspace-config/tadig-codes', ['codes']),
    ...mapState('workspace-config/tadig-groups', ['groups', 'groupCodes']),
    groupNames() {
      return this.groups.map((x) => x.name);
    },
    codeNames() {
      return [].concat(
        this.groupNames,
        this.codes.map((x) => x.code),
      );
    },
  },
};
</script>
