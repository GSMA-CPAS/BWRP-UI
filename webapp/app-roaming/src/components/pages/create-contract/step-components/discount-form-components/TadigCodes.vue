<template>
  <fragment>
    <v-textarea v-model="codes" rows="2" auto-grow label="TADIG Codes" />
    <v-checkbox
      v-model="includeContractParty"
      auto-grow
      label="also contract party"
    />
  </fragment>
</template>
<script>
export default {
  name: "tadig-codes",
  description: "description",
  data() {
    return { codes: null, includeContractParty: false };
  },
};
</script>