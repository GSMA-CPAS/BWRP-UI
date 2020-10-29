<template>
  <currency-selector v-model="currency" />
</template>
<script>
export default {
  name: "currency-for-all-discounts",
  description: "description",
  data() {
    return { currency: null };
  },
};
</script>