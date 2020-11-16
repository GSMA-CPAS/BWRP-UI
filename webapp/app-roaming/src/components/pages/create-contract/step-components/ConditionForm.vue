<template>
  <v-col>
      <condition-picker />
  </v-col>
</template>
<script>
import ConditionPicker from "./discount-form-components/ConditionPicker";
export default {
  name: "condition-form",
  description: "description",
  components: {
    ConditionPicker,
  },
};
</script>