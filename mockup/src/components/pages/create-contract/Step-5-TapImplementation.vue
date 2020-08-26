// TODO: Move to steps folder if needed in the future
<template>
  <fragment>
    <primary-row :label="partyNames.user" />
    <tap-form />
    <primary-row :label="partyNames.partner" />
    <tap-form />
    <div class="float-right mt-3">
      <app-button label="previous" text @button-pressed="previousStep" />
      <app-button label="next" @button-pressed="validate" />
    </div>
  </fragment>
</template>
<script>
import { mapGetters } from "vuex";
import { validationMixin } from "../../../../utils/mixins/component-specfic";
import TapForm from "../step-components/TapForm.vue";
export default {
  name: "tap-implementation",
  description: "In this step, the TAPs are defined.",
  mixins: [validationMixin],
  data() {
    return {};
  },
  components: {
    TapForm,
  },
  props: {},
  watch: {},
  methods: {
    validate() {
      this.nextStep({
        key: "taps",
        data: "someData",
      });
    },
  },
  computed: { ...mapGetters("contract/new", ["partyNames"]) },
  mounted() {},
};
</script>