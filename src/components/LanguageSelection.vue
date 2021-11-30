<template>
  <div ref="selectLang" class="web-language" :class="{ 'active': isShow }" @mouseover="isShow = true" @mouseleave="isShow = true">
    <a href="javascript:void(0)" v-if="current" class="item-current">
      <img :src="`/assets/images/flags/${current.flag.toLowerCase()}.svg`" />
     <!-- <span>{{ current.name | capitalize }}</span> -->
      <i class="arrow-down"/>
    </a>
    <ul class="sub-menu">
      <li v-for="lang in language" :key="lang.code" class="item" :class="{ 'selected': lang.code === $i18n.locale }">
        <a href="javascript:void(0)" @click="handleSetLanguage(lang.code, true, $event)"
          class="display-flex-start">
          <img :src="`/assets/images/flags/${lang.flag.toLowerCase()}.svg`" />
          <span>
            {{ lang.name }}
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShow: true
    }
  },
  computed: {
    currentLang () {
      return this.$store.getters.currentLang
    },
    current () {
      let result = this.language.find(temp => {
        return temp.code === this.currentLang
      })
      return result
    },
    configs () {
      return this.$store.getters.configs
    },
    language () {
      return this.$store.getters.configs.languages || []
    }
  },
  methods: {
    handleSetLanguage (lang, isShowToast, evt) {
      this.openPop = false
      if (lang === this.$i18n.locale) return
      this.$store.dispatch('setLanguage', lang)
      this.isShow = false
    }
  }
}
</script>
