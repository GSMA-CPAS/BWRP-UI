<template>
  <div class="dark--text text-uppercase headline pa-2">{{ title }}</div>
</template>

<script>
export default {
  name: "app-headline",
  props: { title: { type: String, default: "Missing Title" } },
};
</script>