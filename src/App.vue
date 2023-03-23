<template>
  <v-app>
    <v-container>
      <Header></Header>
      <SheetApps class="mt-15"></SheetApps>
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
};
</script>