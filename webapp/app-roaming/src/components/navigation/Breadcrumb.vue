<template>
  <v-row class="flex-grow-0 ma-0 pa-0">
    <v-col>
      <v-breadcrumbs large :items="items"></v-breadcrumbs>
    </v-col>
    <v-col
      v-if="refreshActive"
      align-self="center"
      class="text-center"
      cols="1"
    >
      <app-button
        icon-size="35"
        icon
        svg="refresh"
        @button-pressed="refreshPage"
      />
    </v-col>
  </v-row>
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
    refreshPage() {
      this.$store.dispatch("document/loadData", this.$route.params.cid);
    },
    addBreadcrumb(text, to) {
      this.items.push({ text, to });
    },
    removeLastBreacrumb() {
      this.isHome && this.items.pop();
    },
  },
  computed: {
    refreshActive() {
      return this.$route.name === "timeline-page";
    },
    isHome() {
      return this.items.length > 1;
    },
  },
  watch: {
    $route(to, from) {
      const { name, meta, params, path } = to;
      name === "contracts-overview" && this.removeLastBreacrumb();
      console.log(from);
      if (from.name === "contracts-overview") {
        to.name === "timeline-page"
          ? this.addBreadcrumb(params.cid, path)
          : this.addBreadcrumb(meta.name, path);
      }
    },
  },
  beforeMount() {
    const { name, meta, path, params } = this.$route;
    if (name === "timeline-page") {
      this.addBreadcrumb(params.cid, path);
    } else {
      name !== "contracts-overview" && this.addBreadcrumb(meta.text, path);
    }
  },
};
</script>
