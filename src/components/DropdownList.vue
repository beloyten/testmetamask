<template>
  <dl
    v-click-outside="onClickOutside"
    :class="{ 'list-open': isOpened }"
    class="country-container wber-dropdown-list">
    <dt class="country-show" @click="onFocus">
      <div class="loading-icon"/>
      <p v-if="currentItem">
        <span>{{ currentItem.name }}</span>
      </p>
      <div class="icon">
        <i class="hb_icon_arrow_down"/>
      </div>
    </dt>
    <dd class="country-select">
      <div v-show="!search" class="search-box">
        <div class="search">
          <i class="hb_icon_search"/>
          <input
            ref="inputRef"
            autocomplete="false"
            type="text"
            placeholder="Search"
            tabindex="-1"
            onfocus="this.removeAttribute('readonly');"
          >
        </div>
      </div>
      <div class="country-list-container">
        <dl class="country-li">
          <dd>
            <ul>
              <li
                v-for="(item, index) in localList"
                :key="index"
                :data-name="item.name"
                :data-id="item.id"
                :class="{'active':currentItem.id === item.id}"
                @click="select(item)"
              >
                <span>{{ item.name }}</span>
              </li>
            </ul>
          </dd>
        </dl>
        <dl v-if="!localList.length">
          <dd class="no-data">{{ $t('MESSAGE.SEARCH_DATA_EMPTY') }}</dd>
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
  props: ['current', 'lists', 'disableSearch'],
  data  () {
    return {
      itemActive: this.current,
      searchTxt: '',
      localList: this.lists,
      isOpened: false,
      search: this.disableSearch || false
    }
  },
  computed: {
    currentItem () {
      var temp = null
      if (this.itemActive) {
      }
      this.itemActive && (temp = this.getItemById(this.itemActive))
      !temp && this.lists.length && (temp = this.lists[0])
      temp && temp.id && this.$emit('input', temp)
      return temp
    }
  },
  watch: {
    searchTxt (val) {
      if (!val) this.localList = this.lists
      const temp = _.filter(this.localList, (item) => {
        return item.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
      })
      this.localList = temp
    }
  },
  methods: {
    onFocus () {
      this.isOpened = !this.isOpened
    },
    getItemById (current) {
      const id = current.id
      const temp = _.find(this.lists, (item) => {
        return item.id === id
      })
      return temp
    },
    onClickOutside (e) {
      this.isOpened = false
    },
    select (item) {
      this.itemActive = item
      this.isOpened = false
    }
  }
}
</script>
