<template>
  <v-app>
    <Header></Header>
     <v-main>
      <SheetApps></SheetApps>
     </v-main>
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