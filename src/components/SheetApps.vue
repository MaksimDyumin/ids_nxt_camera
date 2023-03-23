<template>
  <v-container style="overflow: auto;" id="container-scroll">
    <v-data-table
      :headers="headers"
      :items="listApps"
      
      class="elevation-1">
      <template v-slot:item.Name="{ item }">
        <v-img 
        :src="`${domain}/vapps/${item}/avatar`"
        width="70"
        height="70"
        class="pa-1"
        ></v-img>
      </template>

      <template v-slot:item.Title="{ item }">
        <h3>{{ item.Title }}({{ item.Version }})</h3>
      </template>

      <template v-slot:item.Type="{ item }">
        <v-btn @click="switchCamera(item)" class="ml-5 mb-5 mb-md-0 btn-menu" :color="item.Activated ? 'warning' : null"
          elevation="2">
          {{ item.Activated ? 'Deactivate' : 'Activate' }}
        </v-btn>

        <v-btn class="ml-5 mb-5 mb-md-0 btn-menu" color="warning" @click="DeleteModelDialog(item)">
          Uninstall
        </v-btn>

        <v-btn :href="item.Website" target="_blank" v-if="item.Website" class="ml-5 btn-menu" style="min-width: 127px;" elevation="2">
          Website
        </v-btn>
      </template>
      
    </v-data-table>

    

    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-card-title>
          Are you sure you want to delete {{ cameraToDelete.Name }}?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="dialog = false">
            Cancel
          </v-btn>

          <v-btn color="red darken-1" text @click="deleteApp(cameraToDelete)">
            Delete
          </v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
const production = 'http://' + window.location.hostname
const dev = 'http://127.0.0.1:5000'

export default {

  data: () => {
    return {
      domain: production,
      dialog: false,
      headers: [
        { title: 'Name', text:'Name', value: 'Name' },
        { title: 'Title', text:'Title', value: 'Title' },
        { title: 'Actions', text: 'Actions', value: 'Type' },
      ],
      cameraToDelete: {}
    }
  },
  async mounted() {
    await this.getListOfAllApps({ domain: this.domain })
  },
  methods: {
    ...mapActions({
      deleteAppVuex: 'camera/deleteApp',
      activateVApp: 'camera/activateVApp',
      deactivateVApp: 'camera/deactivateVApp',
      getListOfAllApps: 'camera/getListOfAllApps'
    }),
    DeleteModelDialog(camera) {
      this.cameraToDelete = camera
      this.dialog = true
    },
    async deleteApp(camera) {
      this.dialog = false
      const queryInfo = { domain: this.domain, appName: camera.Name }
      await this.deleteAppVuex(queryInfo)
    },
    switchCamera(camera) {
    if (camera.Activated) {
      this.deactivateVApp({ domain: this.domain, appName: camera.Name })
    }
    else {
      this.activateVApp({ domain: this.domain, appName: camera.Name })
    }
  }
},
computed: {
    ...mapGetters({
  listApps: 'camera/listApps',
}),
  },
}
</script>

<style scoped>
.avtar-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.app-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}


.btn-menu-container {
  width: 460px;
  padding: 12px;
  margin-right: auto;
  margin-left: auto;
  display: flex;
}

@media screen and (max-width: 959px) {
  .btn-menu-container {
    width: 100%;
    flex-direction: column;
  }
}

.btn-menu {
  min-width: 127px !important;
}
</style>