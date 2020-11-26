<template>
  <v-form class="background pa-2">
    <v-container>
      <slot />
    </v-container>
  </v-form>
</template>
<script>
export default {
  name: 'form-container',
  description: 'This is a custom form container.'
};
</script>
