<template>
  <v-container>
  <TransitionGroup name="list" mode="out-in" tag="div">
    <v-row justify="space-around" v-for="cameraName in cameraNames" :key="cameraName">
      <v-col cols="12" md="12">
        <v-sheet class="pa-2 d-flex flex-column flex-md-row align-center" color="grey lighten-3">
          <img class="avtar-img ml-2" :src="`${domain}/vapps/${listApps[cameraName].Name}/avatar`" alt="">
          <h3 class="app-info ml-7">{{ listApps[cameraName].Title }}({{ listApps[cameraName].Version }})</h3>
          <v-spacer></v-spacer>
          <v-container class="d-flex flex-column flex-md-row">
            <v-btn @click="switchCamera(listApps[cameraName])" class="ml-5 mb-5 mb-md-0"
              elevation="2">{{ listApps[cameraName].Activated ? 'Deactivated' : 'Activated' }}
            </v-btn>

            <v-btn class="ml-5 mb-5 mb-md-0" color="primary" @click="openDeleteModelDialog(listApps[cameraName])">
              Uninstall
            </v-btn>

            <v-btn :href="listApps[cameraName].Website" target="_blank" v-if="listApps[cameraName].Website" class="ml-5" elevation="2">
              Website
            </v-btn>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </TransitionGroup>

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
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  
  data: () => {
    return {
      domain: window.location.hostname,  //window?.location?.hostname 'http://127.0.0.1:5000'
      dialog: false,
      cameraNames: [],
      cameraToDelete: {}
    }
  },
  async mounted() {
    await this.getListOfAllApps({domain: this.domain})
    this.cameraNames = Object.keys(this.listApps)
    console.log(this.listApps)
  },
  methods: {
    ...mapActions({
      deleteAppVuex: 'camera/deleteApp',
      activateVApp: 'camera/activateVApp',
      deactivateVApp: 'camera/deactivateVApp',
      getListOfAllApps: 'camera/getListOfAllApps'
    }),
    openDeleteModelDialog(camera) {
      this.cameraToDelete = camera
      this.dialog = true
    },
    async deleteApp(camera) {
      this.dialog = false
      const queryInfo = {domain: this.domain, appName: camera.Name}
      await this.deleteAppVuex(queryInfo)
      this.cameraNames = Object.keys(this.listApps)
    },
    switchCamera(camera) {
      if (camera.Activated) {
        this.deactivateVApp({domain: this.domain, appName: camera.Name})
      }
      else {
        this.activateVApp({domain: this.domain, appName: camera.Name})
      }
    }
  },
  watch: {
    listApps:{
      handler(newValue, oldValue) {
        console.log('newValue',newValue)
        this.cameraNames = Object.keys(newValue)
        console.log('this.cameraNames', this.cameraNames)
      },
      deep: true 
    }
  },
  computed: {
    ...mapGetters({
      listApps: 'camera/listApps',
    }),
  },
}
</script>

<style>
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
</style>