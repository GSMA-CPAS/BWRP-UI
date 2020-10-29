<template>
  <traffic-form />
</template>
<script>
import TrafficForm from "./TrafficForm.vue";
export default {
  name: "tab-3",
  label: "Inbound Details",
  description:
    "In this tab the inbound details of a settlement are displayed. The tab is found in the contract timeline when clicking on 'View Settlement'",
  components: {
    TrafficForm,
  },
};
</script>