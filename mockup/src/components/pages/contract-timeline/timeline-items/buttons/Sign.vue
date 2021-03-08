<template>
  <fragment>
    <v-icon v-if="isSigned" color="primary" x-large>mdi-check-circle-outline</v-icon>
    <app-button v-else @button-pressed="onSign()" outlined label="Sign"></app-button>
    <!-- <v-icon class="pl-8" v-else color="success" x-large>mdi-timeline-check-outline</v-icon> -->
  </fragment>
</template>
<script>
import {timelineMixin} from "@/utils/mixins/component-specfic";

export default {
  name: "sign-button",
  description: "description",
  mixins: [timelineMixin],
  components: {},
  props: {},
  watch: {},
  methods: {
    async onSign() {
      await this.signContract();
    },
  },
  computed: {},
  mounted() {},
};
</script>