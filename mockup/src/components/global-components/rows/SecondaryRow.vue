<template>
  <div class="secondary--text font-weight-medium h1">{{label}}</div>
</template>
<script>
export default {
  name: "secondary-row",
  description: "This is a custom secondary row",
  props: { label: { type: String, default: "Missing Row Label" } },
};
</script>
