<template>
  <nav aria-label="Breadcrumbs">
    <v-breadcrumbs large :items="items"></v-breadcrumbs>
  </nav>
</template>

<script>
export default {
  name: 'breadcrumb',
  props: {
    items: Object
  }
};
</script>
