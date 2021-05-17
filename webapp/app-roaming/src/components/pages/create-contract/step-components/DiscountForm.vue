<template>
  <v-col>
    <row type="secondary" label="Condition" />
    <v-divider />
    <condition-picker
      :from="from"
      v-model="condition"
      :default-currency="defaultCurrency"
    />
    <v-row> <br /><br /> </v-row>
    <row type="secondary" label="Service Groups" />
    <v-divider />
    <div v-for="(serviceGroup, index) in serviceGroups" :key="serviceGroup.id">
      <v-row>
        <v-col>
          <b>Group {{ index + 1 }}</b>
        </v-col>
        <v-col align-self="center" class="mr-3" cols="1">
          <v-icon @click="removeServiceGroup(index)" :disabled="isDisabled">
            {{ `mdi-${icons.remove}` }}
          </v-icon>
        </v-col>
        <v-col align-self="center" class="mr-3" cols="1">
          <v-icon @click="addServiceGroup">
            {{ `mdi-${icons.add}` }}
          </v-icon>
        </v-col>
      </v-row>
      <service-group-form
        ref="serviceGroup"
        v-model="serviceGroups[index]"
        :group-index="index"
        :from="from"
        :home-tadig-options="homeTadigs"
        :visitor-tadig-options="visitorTadigs"
      />
      <v-divider />
    </div>
    <v-row> <br /><br /> </v-row>
    <v-row>
      <app-button @click="doCopyOtherSide" label="Copy to other side" />
    </v-row>
  </v-col>
</template>
<script>
import ConditionPicker from './discount-form-components/ConditionPicker';
import {duplicateMixin} from '../../../../utils/mixins/component-specfic';
import ServiceGroupForm from './ServiceGroupForm';
import {mapMutations} from 'vuex';

export default {
  name: 'discount-form',
  description: 'description',
  mixins: [duplicateMixin],
  props: ['from', 'homeTadigs', 'visitorTadigs', 'value', 'defaultCurrency'],
  components: {
    ConditionPicker,
    ServiceGroupForm,
  },
  data() {
    return {
      condition: null,
      serviceGroups: [
        {
          id: 'service-group-0',
        },
      ],
    };
  },
  watch: {
    serviceGroups: {
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
    ...mapMutations('document/new', ['removeValidationsOfGroup']),
    addServiceGroup() {
      this.serviceGroups.push({
        id: `service-group-${this.serviceGroups.length}`,
      });
      this.$nextTick(() => {
        const element = this.$refs.serviceGroup[this.serviceGroups.length - 1]
          .$el;
        element.scrollIntoView({
          behavior: 'smooth',
        });
      });
    },
    removeServiceGroup(index) {
      this.removeValidationsOfGroup({
        index,
        from: this.from,
        step: 'Discount Services',
      });
      this.serviceGroups.splice(index, 1);
    },
    doCopyOtherSide() {
      this.$emit('copy-other-side', this.$data);
    },
  },
  computed: {
    isDisabled() {
      return this.serviceGroups.length === 1;
    },
  },
  beforeMount() {
    this.condition = this.value.condition;
    this.serviceGroups = this.value.serviceGroups;
  },
};
</script>
