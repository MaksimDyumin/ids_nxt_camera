<template>
  <v-app>
    <v-container fluid>
      <Header></Header>
      <SheetApps></SheetApps>
    </v-container>
  </v-app>
</template>

<script>
import Header from '@/components/Header.vue';
import SheetApps from '@/components/SheetApps.vue';

export default {
  name: 'App',
  components: {
    Header, SheetApps
  },

  data: () => ({
    //
  }),
};
</script>
