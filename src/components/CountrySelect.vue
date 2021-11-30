<template>
  <dl class="country-container"
    :class="{ 'list-open': isShowCountries }" @click="toggleCountries"
    v-on:click.stop>
    <dt class="country-show">
      <div class="loading-icon"/>
      <label>{{ $t('TEXT_NATIONALITY') }}</label>
      <div class="item-current" v-if="current">
        <img :src="'/assets/images/flags/' + current.code.toLowerCase() + '.svg'" :alt="current.name" />
        <span>{{ current.name }}</span>
      </div>
      <div class="icon">
        <i class="hb_icon_arrow_down"/>
      </div>
    </dt>
    <dd class="country-select">
      <div class="search-box" v-click-outside="closeSelection">
        <div class="search">
          <i class="hb_icon_search"/>
          <input class="input-country-search" placeholder="Search" tabindex="-1" v-on:click.stop
            v-model="searchTxt">
        </div>
      </div>
      <div class="country-list-container">
        <dl class="country-li">
          <dt>{{ $t('TEXT.SERIES') }}</dt>
          <dd>
            <ul>
              <li
                v-for="c in filteredFrequentlyCountry"
                :key="c.id"
                :data-key="c.code"
                :data-code="c.phoneCode"
                :data-name="c.name"
                :class="{'active':current.id === c.id}"
                @click="countryId = c.id"
              >
                <img :src="'/assets/images/flags/' + c.code.toLowerCase() + '.svg'" :alt="c.name" />
                <span>{{ c.name }}</span>
              </li>
            </ul>
          </dd>
        </dl>
        <dl class="country-li">
          <dt>{{ $t('TEXT_ALL') }}</dt>
          <dd>
            <ul>
              <li
                v-for="c in filteredCountries"
                :key="c.id"
                :data-key="c.code"
                :data-code="c.phoneCode"
                :data-name="c.name"
                :class="{'active':current.id === c.id}"
                @click="countryId = c.id"
              >
                <img :src="'/assets/images/flags/' + c.code.toLowerCase() + '.svg'" :alt="c.name" />
                <span>{{ c.name }}</span>
              </li>
            </ul>
          </dd>
        </dl>
        <dl v-if="!filteredCountries.length && !filteredFrequentlyCountry.length">
          <dd class="no-data">{{ $t('MSG_SEARCH_COUNTRY_NOT_FOUND') }}</dd>
        </dl>
      </div>
    </dd>
  </dl>
</template>

<script>
import _ from 'lodash'
import ClickOutside from '@/directives/VueClickOutside'
export default {
  directives: {
    ClickOutside
  },
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      countryId: this.value,
      isShowCountries: false,
      searchTxt: ''
    }
  },
  computed: {
    filteredCountries () {
      let result = []
      result = this.countries.filter(temp => {
        return !this.searchTxt ? true : _.toLower(temp.name).indexOf(this.searchTxt) !== -1
      })
      return result
    },
    countries () {
      var countries = []
      if (this.$store.getters.configs) {
        countries = this.$store.getters.configs.countries
      }
      return countries || []
    },
    filteredFrequentlyCountry () {
      let result = []
      result = this.frequentlyCountry.filter(temp => {
        return _.toLower(temp.name).indexOf(this.searchTxt) !== -1
      })
      return result
    },
    frequentlyCountry () {
      var frequentlyList = []
      if (this.countries) {
        this.countries.forEach(c => {
          if (c.isFrequently === 1) {
            frequentlyList.push(c)
          }
        })
      }
      return frequentlyList || []
    },
    current () {
      var curr = null
      if (this.countryId) {
        curr = this.getCountryById(this.countryId)
      } else {
        if (this.frequentlyCountry.length > 0) {
          curr = this.frequentlyCountry[0]
        } else if (this.countries && this.countries.length > 0) {
          curr = this.countries[0]
        }
        if (curr) {
          this.$emit('input', curr.id)
        }
      }
      return curr
    }
  },
  watch: {
    current (val) {
      this.$emit('input', val.id)
    },
    value (val) {
      this.countryId = val
    }
  },
  methods: {
    closeSelection () {
      console.log('111')
      if (this.isShowCountries) this.isShowCountries = false
    },
    toggleCountries () {
      this.isShowCountries = !this.isShowCountries
    },
    getCountryById (id) {
      var curr = null
      _.forEach(this.countries, function (c, index) {
        if (c.id === id) {
          curr = c
        }
      })
      return curr
    }
  }
}
</script>
