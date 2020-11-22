<template>
  <fragment>
    <v-textarea v-model="value.codes" rows="2" auto-grow label="TADIG Codes" />
    <v-checkbox
      v-model="value.includeContractParty"
      auto-grow
      label="also contract party"
    />
  </fragment>
</template>
<script>
export default {
  name: "tadig-codes",
  description: "description",
  props: {
    value: Object,
  },
};
</script>