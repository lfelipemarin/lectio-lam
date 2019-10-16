<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col cols="12">
        <template>
          <v-card class="mx-auto" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">Santo del día</div>
                <v-list-item-title class="headline mb-1 text-wrap">{{saintInfo.name}}</v-list-item-title>
                <v-list-item-subtitle>{{saintInfo.date_displayed}}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar v-if="showImage(saintInfo.image_links)[0]" tile size="80" color="grey">
                <v-img :src="showImage(saintInfo.image_links)[0]"></v-img>
              </v-list-item-avatar>
            </v-list-item>
            <v-list-item>
              <v-list-item-content v-html="cleanText(saintInfo.bio)">
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </v-container>
  <v-container fill-height v-else>
    <v-layout align-center>
      <v-flex xs12 text-center>
        <v-progress-circular :size="70" :width="7" color="amber" indeterminate></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import lectioService from "../services/LectioService";
import _ from 'lodash'

export default {
  data () {
    return {
      saintInfo: null,
      loading: true
    };
  },
  mounted () {
    this.loading = true
    lectioService.getSaintById(this.$route.params.id).then((saint) => {
      this.saintInfo = saint.data.data
      this.loading = false
    })
  },
  methods: {
    cleanText (text) {
      let regex = /([</].*?>)/gm
      let subst = ''
      let result = text.replace(regex, subst)

      regex = /(\s)+/gm
      subst = ' '
      result = result.replace(regex, subst)

      regex = /(&nbsp;)+/gm
      result = result.replace(regex, subst)

      return result
    },
    showImage (imgObj) {
      return _.map(imgObj, (img) => {
        if (img) {
          return img
        }
      })
    }
  }
};
</script>