<template>
  <div class="component-wber-phone country-container"
    :class="{ 'list-open': isShowCountries }">
    <div class="e_input_control phone-show"
      @click="toggleCountries"
      v-on:click.stop>
      <div class="e_input_field">
        <input
          id="country-code"
          :value="phoneCountry"
          :data-value="phoneCountry"
          growing-ignore="true"
          name="country-code"
          maxlength="11"
          class="e_input"
          type="text"
        >
        <label for="country-code" class="e_label">{{ $t('TEXT_CODE') }}</label>
        <div class="icon">
          <i class="hb_icon_arrow_down"/>
        </div>
      </div>
    </div>
    <div :class="{ 'e_input_error': !error.isValid }" class="e_input_control">
      <div class="e_input_field">
        <input
          id="phone"
          v-model="phoneNumber"
          :data-value="phoneNumber"
          growing-ignore="true"
          name="phone"
          maxlength="11"
          class="e_input"
          type="text"
          autocomplete="tel-national"
          required
          @blur="isFirstLoad = !1"
        >
        <label for="phone" class="e_label">{{ $t('TEXT_PHONE_NUMBER') }}</label>
      </div>
      <div v-if="!error.isValid" class="e_input_bottom_message">
        <span class="error_message" v-html="error.msg"/>
      </div>
    </div>
    <div class="clearfix"/>
    <dd class="country-select">
      <div class="search-box" v-click-outside="closeSelection">
        <div class="search">
          <i class="hb_icon_search"/>
          <input placeholder="Search" tabIndex="-1" v-on:click.stop v-model="searchTxt">
        </div>
      </div>
      <div class="country-list-container">
        <dl class="country-li">
          <dt>{{ $t('TEXT.SERIES') }}</dt>
          <dd>
            <ul class="country-item">
              <li
                v-for="c in filteredFrequentlyCountry"
                :key="c.id"
                :data-key="c.code"
                :data-code="c.phoneCode"
                :data-name="c.name"
                :class="{'active':countryId === c.id}"
                @click="countryId = c.id"
              >
                <img :src="'/assets/images/flags/' + c.code.toLowerCase() + '.svg'" :alt="c.name" />
                <span class="country-name">{{ c.name }}</span>
                <span class="code">+{{ c.phoneCode }}</span>
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
                :class="{'active':countryId === c.id}"
                @click="countryId = c.id"
              >
                <img :src="'/assets/images/flags/' + c.code.toLowerCase() + '.svg'" :alt="c.name" />
                <span class="country-name">{{ c.name }}</span>
                <span class="code">+{{ c.phoneCode }}</span>
              </li>
            </ul>
          </dd>
        </dl>
        <dl>
          <dd class="no-data">Sorry, no matching area code found.</dd>
        </dl>
      </div>
    </dd>
  </div>
</template>

<script>
import _ from 'lodash'
import ClickOutside from '@/directives/VueClickOutside'
export default {
  props: {
    propCountry: {
      type: String,
      default: ''
    },
    propError: {
      type: Object,
      default () {
        return {
          isValid: true,
          msg: ''
        }
      }
    },
    value: {
      type: String,
      default: ''
    }
  },
  directives: {
    ClickOutside
  },
  data () {
    return {
      countryId: this.propCountry,
      phoneNumber: '',
      isFirstLoad: !0,
      isShowCountries: false,
      searchTxt: ''
    }
  },
  computed: {
    error () {
      var err = {
        isValid: this.propError.isValid,
        msg: this.propError.msg
      }
      if (!this.isFirstLoad && (!this.phoneNumber || !this.countryId)) {
        err.isValid = false
        err.msg = this.$t('MSG_FIELD_REQUIRED')
      }

      return err
    },
    filteredCountries () {
      let result = []
      result = this.countries.filter(temp => {
        return !this.searchTxt ? true : temp.name.toLocaleLowerCase().indexOf(this.searchTxt) !== -1
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
        return temp.name.toLocaleLowerCase().indexOf(this.searchTxt) !== -1
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
    phoneCountry () {
      var code = ''
      if (this.countries) {
        var _countryId = this.countryId
        const country = _.filter(this.countries, function (c) {
          return c.id === _countryId
        })
        if (country.length > 0) {
          code = country[0].phoneCode
        }
      }
      return code
    },
    phone () {
      return this.phoneCountry && this.phoneNumber
        ? this.phoneCountry + ' ' + this.phoneNumber
        : ''
    }
  },
  watch: {
    phone (val) {
      this.$emit('input', val)
    },
    propCountry (val) {
      this.countryId = val
    }
  },
  created () {
    if (this.value) {
      const code = this.value.substr(0, this.value.indexOf(' '))
      this.phoneNumber = this.value.substr(this.value.indexOf(' ') + 1)
      const country = _.filter(this.countries, function (c) {
        return c.phoneCode === code
      })
      if (country.length > 0) {
        this.countryId = country[0].id
      }
    }
  },
  methods: {
    closeSelection () {
      if (this.isShowCountries) this.isShowCountries = false
    },
    toggleCountries () {
      this.isShowCountries = !this.isShowCountries
    }
  }
}
</script>
