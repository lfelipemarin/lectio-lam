<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col v-for="(reading, index) in readings" :key="index" cols="12">
        <v-card>
          <v-img src="//placehold.it/800x200" class="white--text" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
            <v-card-title class="fill-height align-end" v-text="title"></v-card-title>
          </v-img>
          <v-card-text>
            <p>{{reading.text}}</p>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>

            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-bookmark</v-icon>
            </v-btn>

            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-flex xs12>
      <vue-context ref="menu">
        <template slot-scope="child" v-if="child.data">
          <li>
            <a href="#" @click.prevent="alertName(child.data)">
              Agregar a Lectio de hoy
            </a>
          </li>
        </template>
      </vue-context>
    </v-flex>
  </v-container>
  <v-container fill-height v-else>
    <v-layout align-center>
      <!-- Horizontal: text-xs-center -->
      <v-flex xs12 text-center>
        <v-progress-circular :size="70" :width="7" color="amber" indeterminate></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { VueContext } from 'vue-context'
import _ from 'lodash'
import evgService from '../services/EvangelizoService'

export default {
  components: { VueContext },
  async mounted () {
    console.log(this.loading)
    await this.getTodaysGospel()
    this.addListeners()
    this.loading = false
  },

  data () {
    return {
      evgDetails: {},
      readings: [],
      loading: true
    }
  },
  computed: {
    // showReset () {
    //   return this.items.length < items.length
    // }
  },
  watch: {

  },

  methods: {
    // getSelection () {
    //   const para = document.querySelector('p')

    //   para.addEventListener('pointerup', (event) => {
    //     console.log('Pointer down event')
    //     alert(window.getSelection())
    //   })
    // },
    async getTodaysGospel () {
      const response = await evgService.getTodaysGospel()
      this.evgDetails = response.data
      this.readings = response.data.data.readings
      this.addListeners()
    },
    addListeners () {
      const para = document.querySelectorAll('p')
      this.textSelection = window.getSelection()
      let tEvents = ['mouseup']

      _.each(para, (par) => {
        _.each(tEvents, (tEvent) => {
          par.addEventListener(tEvent, (e) => {
            console.log(e.type)
            var selection

            if (window.getSelection) {
              selection = window.getSelection()
            } else if (document.selection) {
              selection = document.selection.createRange()
            }

            if (selection.toString() !== '') {
              setTimeout(() => {
                this.$refs.menu.open(e, selection.toString())
              }, 0)
            }

          })
        })
      })
    },
    alertName (name) {
      alert(`You clicked on "${name}"!`)
    },

    remove (index) {
      this.$delete(this.items, index)
    }
  }
}
</script>
<style lang="scss" scoped>
ul {
  padding: 0;
}
</style>