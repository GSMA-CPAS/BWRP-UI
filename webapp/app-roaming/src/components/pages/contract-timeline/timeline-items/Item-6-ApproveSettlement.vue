<template>
  <timeline-item>
    <template #content>
      <v-card class="ml-7" color="#fafafa">
        <v-card-text>
          <div>Approved...</div>
          <br />
          <div>
            ...awaiting from {Party}
            <v-icon color="error">mdi-close-circle-outline</v-icon>
          </div>
          <div>
            ...awaiting from {Party}
            <v-icon color="error">mdi-close-circle-outline</v-icon>
          </div>
        </v-card-text>
      </v-card>
    </template>
    <template #icon>
      <approve-button />
    </template>
  </timeline-item>
</template>
<script>
import ApproveButton from "./buttons/Approve.vue";
export default {
  name: "item-1",
  description: "description",
  components: { ApproveButton },
};
</script>