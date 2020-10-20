<template>
  <v-col align-self="center" cols="1">
    <tooltip tooltipText="Revenue Commitment">
      <template #activator="{on}">
        <v-checkbox v-model="checked" v-on="on" />
      </template>
    </tooltip>
  </v-col>
</template>
<script>
export default {
  name: "revenue-commitment-checkbox",
  description: "description",
  props: { value: Boolean },
  computed: {
    checked: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>