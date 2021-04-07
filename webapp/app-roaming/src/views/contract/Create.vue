<template>
  <stepper />
</template>
<script>
import {PATHS} from '@/utils/Enums';
import Stepper from '@pages/create-contract/Stepper.vue';
import {mapActions} from 'vuex';
export default {
  name: 'create-page',
  text: 'New',
  description: 'On this page, the contract is created.',
  path: PATHS.createContract,
  components: {
    Stepper,
  },
  methods: {
    ...mapActions('workspace-config/tadig-codes', ['loadCodes']),
    ...mapActions('workspace-config/tadig-groups', ['loadGroups']),
  },
  beforeMount() {
    // load required data
    this.loadCodes();
    this.loadGroups();
  },
};
</script>
