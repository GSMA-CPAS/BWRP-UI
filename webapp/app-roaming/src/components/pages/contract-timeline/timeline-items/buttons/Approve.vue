<template>
  <div>
    <app-button
      v-if="active"
      @button-pressed="change"
      outlined
      label="Approve"
    />
    <v-icon v-else color="success" x-large>mdi-check-circle-outline</v-icon>
  </div>
</template>
<script>
export default {
  name: 'approve-button',
  description: 'description',
  mixins: [],
  data() {
    return {active: true};
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
