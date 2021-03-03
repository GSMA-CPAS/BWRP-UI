<template>
  <fragment>
    <v-icon v-if="generated" color="primary" x-large>mdi-check-circle-outline</v-icon>
    <app-button v-else @button-pressed="upgradeContractState(); generated = true" label="Generate Settlements"></app-button>
  </fragment>
</template>

<script>
import {timelineMixin} from "@/utils/mixins/component-specfic";

export default {
  name: "GenerateSettlements",
  mixins: [timelineMixin],
  data(){
    return {
      generated: false
    }
  }
}
</script>

<style scoped>

</style>