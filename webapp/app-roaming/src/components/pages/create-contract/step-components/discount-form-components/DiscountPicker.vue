<template>
  <div>
    <v-row>
      <v-col>
        <v-select
          v-model="selectedModel"
          :items="models"
          :label="service"
          placeholder="Select Model"
        />
      </v-col>
      <v-col>
        <v-select
          :disabled="disabledModel"
          :items="increments"
          placeholder="Select Increment"
        />
      </v-col>
    </v-row>
    <component v-if="!disabledModel" :is="model" />
  </div>
</template>
<script>
import BalancedUnbalanced from './models/BalancedUnbalanced.vue';
import RevenueCommit from './models/RevenueCommit.vue';
import UnlimitedCommit from './models/UnlimitedCommit.vue';
export default {
  name: 'discount-picker',
  description: 'description',
  data() {
    return {selectedModel: null};
  },
  components: {
    UnlimitedCommit,
    RevenueCommit,
    BalancedUnbalanced,
  },
  props: ['service', 'value'],
  methods: {
    checkModel(selectedModel) {
      return this.selectedModel === selectedModel;
    },
  },
  computed: {
    model() {
      let path = null;
      switch (this.selectedModel) {
        case 'Flat IOT':
          path = 'FlatIOT';
          break;
        case 'Baselines Incremental':
        case 'Baselines Non-Incremental':
          path = 'Baseline';
          break;
        default:
          path = this._.upperFirst(this._.camelCase(this.selectedModel));
      }
      const models = require.context(`./models/`, false, /.(vue)$/);
      return models(`./${path}.vue`).default;
    },
    disabledModel() {
      return (
        this.selectedModel === null || this.selectedModel === 'No Discount'
      );
    },
    models() {
      return [
        'Flat IOT',
        'Balanced / Unbalanced',
        'Baselines Incremental',
        'Baselines Non-Incremental',
        'Revenue Commit',
        'Unlimited Commit',
        'No Discount',
      ];
    },
    increments() {
      return ['1 sec', '60 sec', 'AA14'];
    },
  },
  beforeMount() {
    this.selectedModel = this.value;
  },
};
</script>
