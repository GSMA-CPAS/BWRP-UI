<template>
  <fragment>
    <form-container>
      <parties label="signatures" />
      <v-row>
        <signature-form :ref="msps.user" :data="signatures[msps.user]" />
        <v-divider vertical />
        <signature-form :ref="msps.partner" :data="signatures[msps.partner]" />
      </v-row>
    </form-container>
    <div class="float-right mt-3">
      <app-button label="previous" text @button-pressed="previousStep" />
      <app-button
        label="next"
        @button-pressed="twoFormsValidate('signatures')"
      />
    </div>
  </fragment>
</template>
<script>
import Parties from "../step-components/Parties.vue";
import SignatureForm from "../step-components/SignatureForm.vue";
import { validationMixin } from "@/utils/mixins/component-specfic";
export default {
  name: "step-3",
  description: "In this step, the signatures of the contract are drafted.",
  mixins: [validationMixin],
  components: {
    SignatureForm,
    Parties,
  },
  computed: {
    signatures() {
      return this.state("signatures") || { signatures: null };
    },
  },
};
</script>