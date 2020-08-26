<template>
  <fragment>
    <form-container>
      <parties label="signatures" />
      <v-row>
        <signature-form :ref="partyMspids.user" :data="signatures[partyMspids.user]" />
        <v-divider vertical />
        <signature-form :ref="partyMspids.partner" :data="signatures[partyMspids.partner]" />
      </v-row>
    </form-container>
    <div class="float-right mt-3">
      <app-button label="previous" text @button-pressed="previousStep" />
      <app-button label="next" @button-pressed="validate" />
    </div>
  </fragment>
</template>
<script>
import Parties from "../step-components/Parties.vue";
import SignatureForm from "../step-components/SignatureForm.vue";
import { validationMixin } from "../../../../utils/mixins/component-specfic";
export default {
  name: "step-3",
  description: "In this step, the signatures of the contract are drafted.",
  mixins: [validationMixin],
  components: {
    SignatureForm,
    Parties,
  },
  methods: {
    validate() {
      var valid = false;
      var data = {};
      for (const key in this.$refs) {
        const { $v, _data } = this.$refs[key];
        data[key] = _data.signatures;
        const { $touch, $invalid } = $v;
        $touch();
        valid = !$invalid;
      }
      valid &&
        this.nextStep({
          key: "signatures",
          data,
        });
    },
  },
  computed: {
    signatures() {
      return this.state("signatures") || { signatures: null };
    },
  },
  beforeMount() {
    //  const generalInformation = this.state("signatures");
  },
};
</script>