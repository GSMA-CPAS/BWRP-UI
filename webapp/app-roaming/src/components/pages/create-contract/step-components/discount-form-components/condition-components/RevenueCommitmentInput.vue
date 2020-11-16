<template>
  <v-row>
      <v-col>
        <v-text-field v-model="value" label="Value" placeholder="0" />
      </v-col>
      <v-col>
        <v-text-field v-model="currency" label="Currency" placeholder="" />
      </v-col>
      <v-col>
        <v-checkbox label="Including Taxes?" v-model="includingTaxes" v-on="on" />
      </v-col>
    </v-row>
</template>
<script>
export default {
  name: "revenue-commitment-input",
  description: "description",
};
</script>