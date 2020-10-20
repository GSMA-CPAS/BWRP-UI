<template>
  <stepper />
</template>
<script>
import { PATHS } from "../../utils/Enums";
import Stepper from "../../components/pages/create-contract/Stepper.vue";
export default {
  name: "create-page",
  text: "New",
  description: "On this page, the contract is created.",
  path: PATHS.createContract,
  components: { Stepper },
};
</script>