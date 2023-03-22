<template>
  <v-container>
    <TransitionGroup name="list" mode="out-in" tag="div">
      <v-row justify="space-around" v-for="app in listApps" :key="app.Name">
        <v-col cols="12" md="12">
          <v-sheet class="pa-2 d-flex flex-column flex-md-row align-center" color="grey lighten-3">
            <img class="avtar-img ml-2" :src="`${domain}/vapps/${app.Name}/avatar`" alt="">
            <h3 class="app-info ml-7">{{ app.Title }}({{ app.Version }})</h3>
            <v-spacer></v-spacer>
            <div class="btn-menu-container">
              <v-btn @click="switchCamera(app)" class="ml-5 mb-5 mb-md-0 btn-menu" :color="app.Activated ? 'warning' : null"
                elevation="2">
                {{ app.Activated ? 'Deactivate' : 'Activate' }}
              </v-btn>

              <v-btn class="ml-5 mb-5 mb-md-0 btn-menu" color="warning" @click="DeleteModelDialog(app)">
                Uninstall
              </v-btn>

              <v-btn :href="app.Website" target="_blank" v-if="app.Website" class="ml-5 btn-menu" style="min-width: 127px;" elevation="2">
                Website
              </v-btn>
            </div>
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
import { mapActions, mapGetters } from 'vuex';
const production = 'http://' + window.location.hostname
const dev = 'http://127.0.0.1:5000'

export default {

  data: () => {
    return {
      domain: dev,
      dialog: false,
      cameraNames: [],
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
  .btn-menu-container{
    width: 100%;
    flex-direction: column;
  }
}

.btn-menu{
  min-width: 127px!important;
}


</style>