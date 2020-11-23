<template>
  <fragment>
    <form-container>
      <parties label="Discount Models" />
      <v-row>
        <discount-form :ref="msps.user" />
        <v-divider vertical />
        <discount-form :ref="msps.partner" />
      </v-row>
    </form-container>
    <div class="float-right mt-3">
      <app-button label="previous" text @button-pressed="previousStep" />
    </div>
  </fragment>
</template>
<script>
import Parties from '../step-components/Parties.vue';
import {validationMixin} from '@/utils/mixins/component-specfic';
import DiscountForm from '../step-components/DiscountForm.vue';
export default {
  name: 'step-4',
  description: 'Discount Models',
  mixins: [validationMixin],
  components: {
    Parties,
    DiscountForm,
  },
};
</script>
