<template>
  <v-app>
    <Header></Header>
     <v-content>
      <SheetApps></SheetApps>
     </v-content>
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
};
</script>