import Vue from 'vue'
import CONSTANT from '@/configs/constant'
export default new Vue({
  methods: {
    getItem (name) {
      return localStorage.getItem(name)
    },
    setItem (name, value) {
      return localStorage.setItem(name, value)
    },
    removeItem (name) {
      return localStorage.removeItem(name)
    },
    getToken () {
      try {
        return JSON.parse(localStorage.getItem(CONSTANT.JWT))
      } catch (error) {
        return localStorage.getItem(CONSTANT.JWT)
      }
    },
    setToken (token) {
      return localStorage.setItem(CONSTANT.JWT, JSON.stringify(token))
    },
    removeToken () {
      return this.removeItem(CONSTANT.JWT)
    },
    removeRemember () {
      return this.removeItem(CONSTANT.REMEMBER)
    }
  }
})
