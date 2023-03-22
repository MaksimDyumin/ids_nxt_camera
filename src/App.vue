<template>
  <v-app>
    <v-container>
      <Header></Header>
      <SheetApps class="sheet-apps"></SheetApps>
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

<style>
.sheet-apps{
  margin-top: 70px;
}
</style>
