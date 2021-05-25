<template>
  <v-col>
    <br />
    <b>TADIGs</b>
    <row label="Home TADIGs">
      <v-col>
        <tadig-codes
          select-box
          :include-only="homeTadigOptions"
          v-model="homeTadigs"
        />
      </v-col>
    </row>
    <row label="Visitor TADIGs">
      <v-col>
        <tadig-codes
          select-box
          :include-only="visitorTadigOptions"
          v-model="visitorTadigs"
        />
      </v-col>
    </row>
    <br />
    <b>Services</b>
    <div v-for="(service, index) in chosenServices" :key="`service${index}`">
      <service
        ref="service"
        v-model="chosenServices[index]"
        :service-key="`Group-${groupIndex} | Service ${index}`"
        :group-index="groupIndex"
        :from="from"
        @add="addService"
        @remove="removeService(index)"
        :remove-disabled="isDisabled"
      />
    </div>
    <v-col>
      <v-row @click="addService" style="cursor: pointer" class="no-gutters">
        <v-col cols="1">
          <v-icon>{{ `mdi-${icons.add}` }}</v-icon>
        </v-col>
        <v-col>Add additional service</v-col>
      </v-row>
    </v-col>
  </v-col>
</template>
<script>
import {mapMutations, mapState} from 'vuex';
import {duplicateMixin} from '@mixins/component-specfic';
import Vue from 'vue';
import TadigCodes from '@pages/create-contract/step-components/general-information/TadigCodes';
import Service, {service} from './discount-form-components/Service.vue';
export default {
  name: 'service-group-form',
  description: 'description',
  mixins: [duplicateMixin],
  props: [
    'from',
    'homeTadigOptions',
    'visitorTadigOptions',
    'value',
    'groupIndex',
  ],
  components: {
    Service,
    TadigCodes,
  },
  data() {
    return {
      homeTadigs: {codes: []},
      visitorTadigs: {codes: []},
      chosenServices: [{...service}],
    };
  },
  watch: {
    value() {
      this.visitorTadigs = this.value.visitorTadigs;
      this.homeTadigs = this.value.homeTadigs;
      if (this.value.condition) {
        this.condition = this.value.condition;
      }
      if (this.value.chosenServices) {
        this.chosenServices = this.value.chosenServices;
      }
    },
    chosenServices: {
      handler() {
        // Set default units if missing
        for (const s of this.chosenServices) {
          if (this.serviceConfiguration[s.name]) {
            if (
              this.serviceConfiguration[s.name].unit &&
              s.unit !== this.serviceConfiguration[s.name].unit &&
              (s.unit === '' ||
                s.unit === undefined ||
                s.unit === null ||
                s.unit === s.prevDefaultUnit)
            ) {
              Vue.nextTick(() => {
                s.unit = this.serviceConfiguration[s.name].unit;
                this.$forceUpdate();
              });
            }
            s.prevDefaultUnit = this.serviceConfiguration[s.name].unit;
          }

          if (
            this.serviceConfiguration[s.name] &&
            this.serviceConfiguration[s.name].access
          ) {
            if (
              this.serviceConfiguration[s.name].accessUnit &&
              s.accessPricingUnit !==
                this.serviceConfiguration[s.name].accessUnit &&
              (s.accessPricingUnit === '' ||
                s.accessPricingUnit === undefined ||
                s.accessPricingUnit === null ||
                s.accessPricingUnit === s.prevDefaultAccessUnit)
            ) {
              Vue.nextTick(() => {
                s.accessPricingUnit = this.serviceConfiguration[
                  s.name
                ].accessUnit;
                this.$forceUpdate();
              });
            }
            s.prevDefaultAccessUnit = this.serviceConfiguration[
              s.name
            ].accessUnit;
          }
        }

        this.$emit('input', this.$data);
      },
      deep: true,
    },
    homeTadigs: {
      handler() {
        this.$emit('input', this.$data);
      },
      deep: true,
    },
    visitorTadigs: {
      handler() {
        this.$emit('input', this.$data);
      },
      deep: true,
    },
    condition: {
      handler() {
        this.$emit('input', this.$data);
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations('document/new', ['removeValidation']),
    addService() {
      this.chosenServices.push({
        // id: `service-${this.chosenServices.length}`,
        name: null,
        includedInCommitment: true,
      });
      this.$nextTick(() => {
        const element = this.$refs.service[
          this.chosenServices.length - 1
        ].$el.getElementsByTagName('input')[0];

        element.focus();
        element.scrollIntoView({
          behavior: 'smooth',
        });
      });
    },
    removeService(index) {
      this.chosenServices.splice(index, 1);
      this.removeValidation({
        key: `Group-${this.groupIndex} | Service ${index}-${this.from}`,
        from: this.from,
        groupIndex: this.groupIndex,
        step: 'Discount Services',
      });
    },
  },
  computed: {
    ...mapState(['serviceConfiguration']),
    isDisabled() {
      return this.chosenServices.length === 1;
    },
  },
  beforeMount() {
    if (this.value) {
      this.visitorTadigs = this.value.visitorTadigs;
      this.homeTadigs = this.value.homeTadigs;
      if (this.value.condition) {
        this.condition = this.value.condition;
      }
      if (this.value.chosenServices) {
        this.chosenServices = this.value.chosenServices;
      }
    }

    // Initialize the tadigs so we don't get undefined errors
    if (this.homeTadigs === undefined) {
      this.homeTadigs = {
        codes: [],
      };
    }

    if (this.visitorTadigs === undefined) {
      this.visitorTadigs = {
        codes: [],
      };
    }
  },
};
</script>
