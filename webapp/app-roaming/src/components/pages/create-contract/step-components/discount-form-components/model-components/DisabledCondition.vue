<template>
  <v-col cols="6">
    <v-text-field label="Condition" :placeholder="placeholder" disabled />
  </v-col>
</template>
<script>
export default {
  name: 'disabled-commitment',
  props: ['placeholder'],
};
</script>
