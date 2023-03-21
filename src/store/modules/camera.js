import axios from "axios";
export const namespaced = true;

let domain = 'http://127.0.0.1:5000'

export const state = {
  listApps: {},
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
    console.log(queryInfo)
    let listApps = {}
    try{
      const allAppsList = await axios.get(`${queryInfo.domain}/vapps`)
      // const allAppsList = await axios.get(`${domain}/vapps`)
      listApps = allAppsList.data.Installed
    }catch(error){
      console.error(error)
      return
    }


    let res = {}
    for (let appName of listApps){
      try {
        const currentApp = await axios.get(`${queryInfo.domain}/vapps/${appName}`)
        // const currentApp = await axios.get(`${domain}/vapps/${appName}`)
        
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
      const currentApp = await axios.get(`${queryInfo.domain}/vapps/${queryInfo.appName}`)
      // const currentApp = await axios.get(`${domain}/vapps/${queryInfo}`)
      commit("SET_APP", currentApp.data)
    }catch(e){
      console.error(e)
    }
  },


  async activateVApp({commit, dispatch, getters}, queryInfo){
    try{
      const response = await axios.put(`${queryInfo.domain}/vapps/activated/${queryInfo.appName}`, {})
      // const response = await axios.put(`${domain}/vapps/activated/${queryInfo.appName}`, {})
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
      // const response = await axios.delete(`${domain}/vapps/activated/${queryInfo.appName}`)
      await dispatch('getVAppInfo', queryInfo)
      commit('ADD_OR_UPDATE_APP', getters.app)
    }
    catch(e){
      console.error(e)
    }
  },


  async installVApp({commit, dispatch, getters}, queryInfo){
    console.log(queryInfo)
    try{
      const response = await axios.put(`${queryInfo.domain}/vapps/${queryInfo.appName}`, {neueVApp: queryInfo.file})
      // const response = await axios.put(`${domain}/vapps/${queryInfo.appName}`, {neueVApp: queryInfo.file})
      
      // await dispatch('getVAppInfo', queryInfo)
      // // const installedApp = getters.app
      // // await commit('ADD_OR_UPDATE_APP', installedApp)

      await dispatch('getListOfAllApps', queryInfo)
    }
    catch(e){
      console.error(e)
    }
  },

  async deleteApp({commit}, queryInfo){
    console.log(queryInfo)
    try{
      const response = await axios.put(`${queryInfo.domain}/vapps/${queryInfo.appName}`, {})
      // const response = await axios.put(`${domain}/vapps/${queryInfo.appName}`, {})
      commit('DELETE_APP', queryInfo.appName)
    }
    catch(e){
      console.error(e)
    }
  },
}