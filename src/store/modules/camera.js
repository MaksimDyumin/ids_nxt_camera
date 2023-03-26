import axios from "axios";
export const namespaced = true;
import {retryOperation} from '@/common/retry'
import { unzip } from 'unzipit'

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
  SET_APP(state, app){
    state.app = app
  },
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


    let res = []
    for (let appName of listApps){
      try {
        const currentApp = await axios.get(`${queryInfo.domain}/vapps/${appName}`)

        res.push(currentApp.data)
      } catch (error) {
        console.error(error)
      }
    }
    commit('SET_APPS', res)
  },


  async getVAppInfo({commit}, queryInfo){
    try{
      const currentApp = await axios.get(`${queryInfo.domain}/vapps/${queryInfo.appName}`)
      commit("SET_APP", currentApp.data)
    }catch(e){
      console.error(e)
    }
  },


  async activateVApp({commit, dispatch, getters}, queryInfo){
    try{
      const response = await axios.put(`${queryInfo.domain}/vapps/activated/${queryInfo.appName}`, {})
      await dispatch('getListOfAllApps', queryInfo)
    }
    catch(e){
      console.log(e)
    }
  },


  async deactivateVApp({dispatch}, queryInfo){
    console.log(queryInfo)
    try{
      const response = await axios.delete(`${queryInfo.domain}/vapps/activated/${queryInfo.appName}`)
      await dispatch('getListOfAllApps', queryInfo)
    }
    catch(e){
      console.error(e)
    }
  },


  async installVApp({commit, dispatch}, queryInfo){
    console.log(queryInfo)
    try {
      let data = new File([ queryInfo.file ], queryInfo.file.name, { type: 'application/octet-stream' })

      // Fallback: use filename to build an identifier.
      // The identifier must start with a letter. Supported characters are lower case letters, numbers and "_".
      let appname = queryInfo.file.name;
      appname = appname.replace(" ", "_").replace(/[^A-Za-z0-9|_]/g, "")

      // Try to extract appname from the archive
      try {
            const enc = new TextDecoder("utf-8")
            const {entries} = await unzip(queryInfo.file)
            const infoBuffer = await entries["vapp.info"].arrayBuffer()
            const info = JSON.parse(enc.decode(infoBuffer))
            appname = info.Description.Identifier
      }
      catch (e) {
        console.log('Failed to extract vapp.info from the archive', e)
      }

      console.log('VApp identifier: ' + appname)

      const response = await axios.put(`${queryInfo.domain}/vapps/${appname}`, data, installConfig)

      let url = `${queryInfo.domain}/vapps/${appname}`
      await retryOperation(axios.get, url, 5)
      await dispatch('getListOfAllApps', queryInfo)
    }
    catch(e){
      console.error(e)
    }
  },

  async deleteApp({dispatch}, queryInfo){
    console.log(queryInfo)
    try{
      const response = await axios.put(`${queryInfo.domain}/vapps/${queryInfo.appName}`, {}, installConfig)
      dispatch('getListOfAllApps', queryInfo)
    }
    catch(e){
      console.error(e)
    }
  },
}