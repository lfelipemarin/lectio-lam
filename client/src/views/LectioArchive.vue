<template>
  <v-container>
    <v-row>
      <v-col>
        <v-treeview v-model="tree" :open="open" :items="items" activatable item-key="name" open-on-click>
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="!item.file">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
              {{ files[item.file] }}
            </v-icon>
          </template>
        </v-treeview>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import lectioService from "../services/LectioService";
import moment from 'moment'
import _ from 'lodash'
moment.locale('es')

export default {
  data: () => ({
    lectios: [],
    open: ['public'],
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-json',
      md: 'mdi-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel',
    },
    tree: [],
    items: [],
    items1: [
      {
        name: '2019',
      },
      {
        name: '2020',
      },
      {
        name: 'public',
        children: [
          {
            name: 'static',
            children: [{
              name: 'logo.png',
              file: 'png',
            }],
          },
          {
            name: 'favicon.ico',
            file: 'png',
          },
          {
            name: 'index.html',
            file: 'html',
          },
        ],
      },
      {
        name: '.gitignore',
        file: 'txt',
      },
      {
        name: 'babel.config.js',
        file: 'js',
      },
      {
        name: 'package.json',
        file: 'json',
      },
      {
        name: 'README.md',
        file: 'md',
      },
      {
        name: 'vue.config.js',
        file: 'js',
      },
      {
        name: 'yarn.lock',
        file: 'txt',
      },
    ],
  }),
  async mounted () {
    this.lectios = (await this.getAllLectios()).data
    console.log(this.years())
  },
  methods: {
    getAllLectios () {
      return lectioService.getAllLectios({ UserId: this.$store.state.user.id })
    },
    years () {
      let uniqYears
      // let years = ''
      // let months = ''
      // let day = ''
      uniqYears = _.uniqBy((this.lectios), (lectio) => {
        return moment(lectio.createdAt).format('YYYY-MM')
      })
      console.log(uniqYears)
      _.map(uniqYears, (lectio) => {
        console.log('lectio', lectio)
        let obj = {}
        obj.name = moment(lectio.createdAt).format('YYYY')
        obj.children = [{ name: moment(lectio.createdAt).format('MMMM') }]
        this.items.push(obj)
      })
      

    },
  }
}
</script>