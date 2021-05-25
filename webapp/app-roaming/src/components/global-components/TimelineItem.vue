<template>
  <v-timeline-item :left=left :right=right color="background" fill-dot v-bind="timelineItemProps">
    <template #icon>
      <slot name="icon">
        <v-icon color="primary" x-large> mdi-check-circle-outline </v-icon>
      </slot>
    </template>
    <slot name="content">
      <v-card>
        <v-card-title>Missing Content</v-card-title>
      </v-card>
    </slot>
  </v-timeline-item>
</template>
<script>
export default {
  name: 'timeline-item',
  description: 'description',
  props: {
    left: {
      default: false
    },
    right: {
      default: false
    }
  },
  computed: {
    timelineItemProps() {
      return {
        color: 'transparent',
        class: `hide-dot`,
        large: true,
      };
    },
  },
};
</script>
