<template>
  <v-breadcrumbs large :items="items"></v-breadcrumbs>
</template>

<script>
export default {
  name: "breadcrumb",
  data: () => ({
    items: [
      {
        text: "Contracts",
        to: "/contracts",
      },
    ],
  }),
  methods: {
    addBreadcrumb(text, to) {
      this.items.push({ text, to });
    },
    removeLastBreacrumb() {
      this.isHome && this.items.pop();
    },
  },
  computed: {
    isHome() {
      return this.items.length > 1;
    },
  },
  watch: {
    $route(to, from) {
      const { name, meta, path } = to;
      name === "contracts-overview" && this.removeLastBreacrumb();

      from.name === "contracts-overview" && this.addBreadcrumb(meta.text, path);
    },
  },
  beforeMount() {
    const { name, meta, path } = this.$route;
    name !== "contracts-overview" && this.addBreadcrumb(meta.text, path);
  },
};
</script>
