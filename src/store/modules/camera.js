import axios from "axios";
export const namespaced = true;

const installConfig = {
    headers: {
        'Content-Type': 'application/vapp',
    }
}

export const state = {
  listApps: [],
  app: {},
}

export const getters = {
  listApps(state){
    return state.listApps
  },
  app(state){
    return state.app
  }
}

export const mutations = {
  SET_APPS(state, apps){
    state.listApps = apps
  },
  DELETE_APP(state, appName){
    delete state.listApps[appName]
  },
  ADD_OR_UPDATE_APP(state, app){
    state.listApps[app.Name] = app
  },
  SET_APP(state, app){
    state.app = app
  },
  SET_STAUS_APP(state, appName){

  }
}

export const actions = {
  async getListOfAllApps({commit}, queryInfo){
    let listApps = {}
    try{
      const allAppsList = await axios.get(`${queryInfo.domain}/vapps`)
      listApps = allAppsList.data.Installed
    }catch(error){
      console.error(error)
      return
    }


    let res = {}
    for (let appName of listApps){
      try {
        const currentApp = await axios.get(`${queryInfo.domain}/vapps/${appName}`)

        res[appName] = currentApp.data
      } catch (error) {
        console.error(error)
      }
    }
    commit('SET_APPS', res)
  },


  async getVAppInfo({commit}, queryInfo){
    try{
      console.log(queryInfo)
      const currentApp = await axios.get(`/${queryInfo.domain}/vapps/${queryInfo.appName}`)
      commit("SET_APP", currentApp.data)
    }catch(e){
      console.error(e)
    }
  },


  async activateVApp({commit, dispatch, getters}, queryInfo){
    try{
      const response = await axios.put(`${queryInfo.domain}/vapps/activated/${queryInfo.appName}`, {})
      await dispatch('getVAppInfo', queryInfo)
      commit('ADD_OR_UPDATE_APP', getters.app)
    }
    catch(e){
      console.log(e)
    }
  },


  async deactivateVApp({commit, dispatch, getters}, queryInfo){
    console.log(queryInfo)
    try{
      const response = await axios.delete(`${queryInfo.domain}/vapps/activated/${queryInfo.appName}`)
      await dispatch('getVAppInfo', queryInfo)
      commit('ADD_OR_UPDATE_APP', getters.app)
    }
    catch(e){
      console.error(e)
    }
  },


  async installVApp({commit, dispatch}, queryInfo){
    console.log(queryInfo)
    try {
      let data = new File([ queryInfo.file ], queryInfo.file.name, { type: 'application/octet-stream' })

      // Use filename to build an identifier.
      // The identifier must start with a letter. Supported characters are lower case letters, numbers and "_".
      let appname = queryInfo.file.name;
      appname = appname.replace(" ", "_").replace(/[^A-Za-z0-9|_]/g, "")

      const response = await axios.put(`${queryInfo.domain}/vapps/${appname}`, data, installConfig)

      // await dispatch('getVAppInfo', queryInfo)
      // // const installedApp = getters.app
      // // await commit('ADD_OR_UPDATE_APP', installedApp)

      // ap: The camera need some time to complete the installation
      // It is better to poll i.e. /vapps/appname for some time until it becomes alive
      // and then update the list of apps.
      await new Promise(r => setTimeout(r, 5000))

      await dispatch('getListOfAllApps', queryInfo)
    }
    catch(e){
      console.error(e)
    }
  },

  async deleteApp({commit}, queryInfo){
    console.log(queryInfo)
    try{
      const response = await axios.put(`${queryInfo.domain}/vapps/${queryInfo.appName}`, {}, installConfig)
      commit('DELETE_APP', queryInfo.appName)
    }
    catch(e){
      console.error(e)
    }
  },
}