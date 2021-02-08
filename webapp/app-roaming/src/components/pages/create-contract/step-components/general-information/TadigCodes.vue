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
import Vue from 'vue';

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
    ...mapActions('workspace-config/tadig-groups', [
        'loadGroups', 'loadGroupCodes'
    ])
  },
  watch: {
    value: {
      async handler(val) {
        let newVal = [];
        let changed = false;
        for ( const code of val.codes ) {
          if ( this.groupNames.indexOf(code) !== -1) {
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
        if ( changed ) {
          Vue.nextTick(() => {
            this.value.codes = newVal;
          });
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState('workspace-config/tadig-codes', ['codes']),
    ...mapState('workspace-config/tadig-groups', ['groups', 'groupCodes']),
    groupNames() {
      return this.groups.map((x) => x.name);
    },
    codeNames() {
      return [].concat(this.groupNames, this.codes.map((x) => x.code));
    }
  },
  mounted() {
    this.loadCodes();
    this.loadGroups();
  },
};
</script>
