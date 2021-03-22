  <template>
  <v-container fill-height fluid v-if="isLoading">
    <v-row no-gutters align="center" justify="center">
      <v-progress-circular :size="50" color="primary" indeterminate />
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'app',
  props: ['isLoading'],
};
</script>

