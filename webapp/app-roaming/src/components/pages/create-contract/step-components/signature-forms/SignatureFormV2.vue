<template>
  <v-col>
    <v-select
      :items="items"
      v-model="minSignatures"
      label="Required signatures (minimum)"
    />
  </v-col>
</template>
<script>
import {duplicateMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'signature-form-v2',
  description: 'Second version of signature form.',
  mixins: [duplicateMixin],
  data: () => ({minSignatures: null}),
  components: {},
  props: {value: Number},
  watch: {
    minSignatures(val) {
      this.$emit('input', val);
    },
  },
  computed: {
    items() {
      return Array.from({length: 10}, (_, i) => i + 1);
    },
  },
  beforeMount() {
    // console.log([...Array(10).keys()]);
    this.minSignatures = this.value;
  },
};
</script>
