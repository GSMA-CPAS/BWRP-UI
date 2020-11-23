<template>
  <fragment>
    <v-row>
      <v-col>
        <v-text-field v-model="amount" label="Total Amount" />
      </v-col>
      <v-col>
        <currency-selector v-model="currency" />
      </v-col>
    </v-row>
  </fragment>
</template>
<script>
export default {
  name: 'overall-revenue-commitment',
  description: 'description',
  data() {
    return {amount: null, currency: null};
  },
};
</script>
