
<template>
  <v-container>
    <app-headline :title="`Contract ${name}`" />
    <v-divider />
    <v-timeline reverse>
      <v-timeline-item
        v-for="(timelineItem,index) in timelineItems"
        :key="index"
        v-bind="timelineItemProps"
      >
        <template #icon>
          <component v-if="timelineItem.button" :is="timelineItem.button" />
          <v-icon v-else color="primary" x-large>mdi-check-circle-outline</v-icon>
        </template>
        <component :is="timelineItem" />
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "timeline",
  description: "Component: Timeline",
  props: {},
  watch: {},
  methods: {
    ...mapActions("app-state", ["loadError"]),
    ...mapActions("contract", ["loadContract"]),
  },
  computed: {
    ...mapGetters("contract", ["name"]),
    timelineItemProps() {
      return {
        color: "transparent",
        class: `hide-dot`,
        large: true,
      };
    },
    timelineItems() {
      const timelineItems = require.context(
        "./timeline-items/",
        true,
        /(Item-)\d-*.*.(vue|js)$/
      );
      return timelineItems.keys().map((x) => timelineItems(x).default);
    },
  },
  mounted() {},
  beforeMount() {
    const _cid = this.$route.params.cid;
    this.loadContract(_cid);
    // TODO: REDIRECT to 'Couldn't find.... Page' instead
    !this.name && this.loadError(`Couldn't find contract with id '${_cid}'`);
  },
};
</script>