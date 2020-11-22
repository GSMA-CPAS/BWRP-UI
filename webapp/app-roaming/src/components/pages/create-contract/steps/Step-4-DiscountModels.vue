<template>
  <fragment>
    <form-container>
      <parties label="Deal Conditions" />
      <v-row>
        <condition-form />
        <v-divider vertical />
        <condition-form />
      </v-row>
      <v-row>
        <!-- Spacer row for visual space --><br><br>
      </v-row>

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
import Parties from "../step-components/Parties.vue";
import { validationMixin } from "@/utils/mixins/component-specfic";
import DiscountForm from "../step-components/DiscountForm.vue";
import ConditionForm from "../step-components/ConditionForm";
export default {
  name: "step-4",
  description: "Discount Models",
  mixins: [validationMixin],
  components: {
    Parties,
    DiscountForm,
    ConditionForm,
  },
};
</script>