<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
        <div>
          <p v-for="(reading, index) in readings" :key="index">
            {{reading.text}}
          </p>

          <div class="my-4 text-right" v-show="showReset">
            <button type="button" @click="reset" class="button is-info rounded-full text-base">
              Reset Demo
            </button>
          </div>

          <vue-context ref="menu">
            <template slot-scope="child" v-if="child.data">
              <li>
                <a href="#" @click.prevent="alertName(child.data)">
                  Alert name
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="remove(child.data.index)">
                  Delete "{{ child.data.name }}"
                </a>
              </li>
            </template>
          </vue-context>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { VueContext } from 'vue-context'
import _ from 'lodash'
import evgService from '../services/evangelizoService'

const items = [
  'Cras justo odio',
  'Dapibus ac facilisis in',
  'Morbi leo risus',
  'Porta ac consectetur ac',
  'Vestibulum at eros'
];

export default {
  components: { VueContext },
  async mounted () {
    let loading = true
    await this.getTodaysReadings()
    this.addListeners()
    loading = false
  },

  data () {
    return {
      items: [...items],
      textSelection: window.getSelection(),
      evgDetails: {},
      readings: []
    }
  },
  computed: {
    showReset () {
      return this.items.length < items.length;
    }
  },
  watch: {

  },

  methods: {
    async getTodaysReadings () {
      const response = await evgService.getTodaysReadings()
      this.evgDetails = response.data
      this.readings = response.data.data.readings
      this.addListeners()
    },
    addListeners () {
      const para = document.querySelectorAll('p');
      this.textSelection = window.getSelection()
      let tEvents = ['mouseup']

      _.each(para, (par) => {
        _.each(tEvents, (tEvent) => {
          par.addEventListener(tEvent, (e) => {
            var selection;

            if (window.getSelection) {
              selection = window.getSelection();
            } else if (document.selection) {
              selection = document.selection.createRange();
            }

            if (selection.toString() !== '') {
              setTimeout(() => {
                this.$refs.menu.open(e, selection.toString())
              }, 0);
            }

          });
        })
      })
    },
    alertName (name) {
      alert(`You clicked on "${name}"!`);
    },

    remove (index) {
      this.$delete(this.items, index);
    },

    reset () {
      this.items = [...items];
    }
  }
};
</script>