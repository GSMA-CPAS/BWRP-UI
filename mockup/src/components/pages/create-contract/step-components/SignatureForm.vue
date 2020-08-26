<template>
  <fragment>
    <v-col>
      <v-row v-for="(signature,index) in signatures" :key="signature.id">
        <v-col>
          <v-text-field :error-messages="nameErrors(index)" v-model="signature.name" label="Name"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field :error-messages="roleErrors(index)" v-model="signature.role" label="Role"></v-text-field>
        </v-col>
        <v-col align-self="center" class="mr-3" cols="1">
          <app-button
            :disabled="isDisabled"
            @button-pressed="removeSignature(index)"
            :svg="icons.remove"
            icon
          />
        </v-col>
      </v-row>
      <app-button @button-pressed="addSignature" :svg="icons.add" icon />
    </v-col>
  </fragment>
</template>
<script>
import { required, minLength } from "vuelidate/lib/validators";
import {
  duplicateMixin,
  validationMixin,
} from "../../../../utils/mixins/component-specfic";
export default {
  name: "signature-form",
  description: "description",
  mixins: [duplicateMixin, validationMixin],
  data() {
    return {
      signatures: [
        {
          id: "signature-0",
          name: null,
          role: null,
        },
      ],
    };
  },
  validations: {
    signatures: {
      required,
      $each: {
        name: { required, minLength: minLength(2) },
        role: { required, minLength: minLength(2) },
      },
    },
  },
  components: {},
  props: { data: Array },
  watch: {},
  methods: {
    addSignature() {
      this.signatures.push({
        id: `signature-${this.signatures.length}`,
        name: null,
        role: null,
      });
    },
    removeSignature(index) {
      this.signatures.splice(index, 1);
    },
    nameErrors(index) {
      const errors = [];
      const { $dirty, name } = this.$v.signatures.$each.$iter[index];
      if (!$dirty) return errors;
      !name.required && errors.push(`Please enter name`);
      !name.minLength && errors.push(`Name must have at least 2 letters.`);
      return errors;
    },
    roleErrors(index) {
      const errors = [];
      if (!this.$v.signatures.$each.$iter[index].$dirty) return errors;
      !this.$v.signatures.$each.$iter[index].role.required &&
        errors.push(`Please enter role`);
      !this.$v.signatures.$each.$iter[index].role.minLength &&
        errors.push(`Role must have at least 2 letters.`);
      return errors;
    },
  },
  computed: {
    isDisabled() {
      return this.signatures.length === 1;
    },
  },
  beforeMount() {
    this.data && (this.signatures = this.data);
  },
};
</script>