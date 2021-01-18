<template>
  <v-data-table :items="items" :headers="headers">
    <template v-slot:top>
      <v-row>
        <v-col align-self="center" class="text-end">
          <app-button label="Add Group" outlined svg="plus" />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>
<script>
export default {
  name: 'tadig-groups',
  description: 'Groups',
  mixins: [],
  data: () => ({items: []}),
  components: {},
  props: {},
  watch: {},
  methods: {},
  computed: {
    headers() {
      return [
        {text: 'ID', value: 'id'},
        {text: 'Group', value: 'Group'},
      ];
    },
  },
  mounted() {},
};
</script>
