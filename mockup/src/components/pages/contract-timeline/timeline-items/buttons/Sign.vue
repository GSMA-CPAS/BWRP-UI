<template>
  <fragment>
    <app-button v-if="active" @button-pressed="change" outlined label="Sign"></app-button>
    <v-icon v-else color="success" x-large>mdi-check-circle-outline</v-icon>
    <!-- <v-icon class="pl-8" v-else color="success" x-large>mdi-timeline-check-outline</v-icon> -->
  </fragment>
</template>
<script>
export default {
  name: "sign-button",
  description: "description",
  mixins: [],
  data() {
    return { active: true };
  },
  components: {},
  props: {},
  watch: {},
  methods: {
    change() {
      this.active = false;
    },
  },
  computed: {},
  mounted() {},
};
</script>