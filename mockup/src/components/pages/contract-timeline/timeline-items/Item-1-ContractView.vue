<template >
  <timeline-item :isSuccess="true">
    <template #content>
      <v-card :class="cardTextStyle" color="#fafafa">
        <v-card-text>CREATED at {date} by {party}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <contract />
        </v-card-actions>
      </v-card>
    </template>
  </timeline-item>
</template>
<script>
import Contract from "../../../dialogs/Contract.vue";
import TimelineItem from "@/components/global-components/TimelineItem";
import {timelineMixin} from "@/utils/mixins/component-specfic";
export default {
  name: "item-1",
  description: "description",
  mixins: [timelineMixin],
  data() {
    return {};
  },
  components: {TimelineItem, Contract },
  props: {},
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>