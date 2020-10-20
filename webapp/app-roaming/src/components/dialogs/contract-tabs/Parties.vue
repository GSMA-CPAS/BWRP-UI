<template>
  <fragment>
    <v-row>
      <v-col cols="3" />
      <v-divider vertical></v-divider>
      <fragment v-for="(name, index) in parties" :key="name">
        <v-col>
          <primary-row :label="name" />
        </v-col>
        <v-divider v-if="index === 0" vertical></v-divider>
      </fragment>
    </v-row>
    <v-divider></v-divider>
  </fragment>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "parties",
  description: "description",
  computed: {
    ...mapGetters("document", ["parties"]),
  },
};
</script>