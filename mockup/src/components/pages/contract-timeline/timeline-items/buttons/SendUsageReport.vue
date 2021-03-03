<template>
  <fragment>
    <app-button v-if="active"
                label="send"
                @button-pressed="active=false;upgradeContractState();upgradeContractState();upgradeContractState();"/>
    <v-icon v-else color="primary" x-large>mdi-check-circle-outline</v-icon>
  </fragment>
</template>

<script>
import AppButton from "@/components/global-components/Button";
import {timelineMixin} from "@/utils/mixins/component-specfic";
export default {
  name: "SendUsageReport",
  components: {AppButton},
  data() {
    return {
      active:true
    }
  },
  mixins: [timelineMixin]
}
</script>

<style scoped>

</style>