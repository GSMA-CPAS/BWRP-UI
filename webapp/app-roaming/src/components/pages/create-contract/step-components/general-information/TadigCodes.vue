<template>
  <div>
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
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex';
import Vue from 'vue';

export default {
  name: 'tadig-codes',
  description: 'description',
  props: {
    includeOnly: Array,
    excludeTadigs: Array,
    value: Object,
  },
  data: () => ({
    groupCodeSearchTerm: null,
  }),
  methods: {
    ...mapActions('workspace-config/tadig-groups', ['loadGroupCodes']),
    removeSearchTerm(codes) {
      this.value.codes = codes.reduce((res, curVal) => {
        const splitCode = curVal.split(',');
        splitCode.forEach((code) => code.length > 0 && res.push(code.trim()));
        return res;
      }, []);
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
              if (this.excludeTadigs) {
                !this.excludeTadigs.includes(c.code) && newVal.push(c.code);
              } else if (this.includeOnly) {
                this.includeOnly.includes(c.code) && newVal.push(c.code);
              } else {
                newVal.push(c.code);
              }
            }
            changed = true;
          } else {
            code
              .split(',')
              .forEach((code) => code.length > 0 && newVal.push(code.trim()));
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
      const tadigCodes = this.includeOnly
        ? this.includeOnly
        : this.codes
            .filter(({code}) =>
              this.excludeTadigs ? !this.excludeTadigs.includes(code) : true,
            )
            .map((x) => x.code);
      return [].concat(this.groupNames, tadigCodes);
    },
  },
};
</script>
