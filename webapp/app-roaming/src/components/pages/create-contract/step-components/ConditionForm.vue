<template>
  <v-col>
      <condition-picker v-model="condition" />
  </v-col>
</template>
<script>
import ConditionPicker from './discount-form-components/ConditionPicker';
export default {
  name: 'condition-form',
  description: 'description',
  components: {
    ConditionPicker,
  },
  data() {
    return {
      condition: null,
    };
  },
  watch: {
    condition: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true,
    },
  },
};
</script>
