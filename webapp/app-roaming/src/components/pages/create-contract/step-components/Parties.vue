<template>
  <fragment>
    <primary-row :label="label" />
    <v-divider />
    <v-row>
      <v-col>
        <primary-row :label="partyNames.user" />
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <primary-row :label="partyNames.partner" />
      </v-col>
    </v-row>
  </fragment>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "parties-row",
  description: "description",
  props: { label: String },
  computed: {
    ...mapGetters("document/new", ["partyNames"]),
  },
};
</script>