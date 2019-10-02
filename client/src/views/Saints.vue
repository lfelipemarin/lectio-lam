<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col>
        <v-list-item>
          <v-icon left>mdi-calendar-month</v-icon>
          <v-list-item-content>
            <v-list-item-title class="headline">{{moment().format('dddd MMMM DD, YYYY')}}
            </v-list-item-title>
            <!-- <v-list-item-subtitle>{{evgDetails.data.liturgic_title}}</v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="6" order-sm="2" order-md="1">
        <v-list width="100%" subheader>
          <v-subheader>Santos del día</v-subheader>

          <v-list-item v-for="(saint, index) in saints.data" :key="index" @click="">
            <v-list-item-avatar>
              <v-img :src="showSaintAvatar(saint.image_links)"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="saint.name"></v-list-item-title>
            </v-list-item-content>

            <!-- <v-list-item-icon>
              <v-icon :color="item.active ? 'deep-purple accent-4' : 'grey'">chat_bubble</v-icon>
            </v-list-item-icon> -->
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-snackbar v-model="snackbar" multi-line color="info" :timeout=4000>
          Por favor selecciona una parte del texto
          <v-btn color="white" text @click="snackbar = false">
            Cerrar
          </v-btn>
        </v-snackbar>
      </v-col>
      <v-col cols="12" sm="12" md="6" order-sm="1" order-md="2">
        <p>¿Quienes son los santos? Son esa multitud innumerable de hombres y mujeres, de toda raza, edad y condición,
          que se desvivieron por los demás, que vencieron el egoísmo, que perdonaron siempre. Santos son los que han
          hecho de su vida una epifanía de los valores trascendentes; por eso quienes buscan a Dios lo encuentran con
          facilidad humanizado en los santos.</p>

        <p>
          Me parece que es Bernanos el que ha escrito lo siguiente: "He perdido la infancia y no la puedo reconquistar
          sino por medio de la santidad". ¿Qué es, pues, la santidad? La santidad es la totalidad del espíritu de las
          Bienaventuranzas, que se leen en el evangelio de la Misa. La totalidad es pobreza, mansedumbre, justicia,
          pureza, paz, misericordia. Es apertura y donación que tienen como símbolo la confianza de un niño.
        </p>
        <p>
          Santidad es tener conciencia efectiva de ser hijo de Dios. Este sentido de filiación debe ser acrecentado a
          través de la purificación interior y así alcanzar la meta plena de nuestra conformación con Dios. Santidad es
          pluralidad. Cada uno debe seguir a Cristo desde su propia circunstancia y talante; desde su nación, raza y
          lengua, en los días felices y cuando la tribulación arranca lágrimas del corazón; en la soledad del claustro o
          en el vértigo de la ciudad; en la buena y en la mala salud.
        </p>
        <p>Fuente: https://es.catholic.net/op/articulos/67197/cat/1069/quienes-son-los-santos.html</p>
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
// import _ from "lodash";
import lectioService from "../services/LectioService";
import moment from 'moment';
moment.locale('es')

export default {
  async mounted () {
    await this.getTodaysSaints();
    this.loading = false;
  },
  data () {
    return {
      saints: [],
      loading: true,
      snackbar: false,
      moment: moment
    };
  },
  computed: {
  },
  watch: {

  },

  methods: {
    async getTodaysSaints () {
      let date = moment().format()
      const response = await lectioService.getSaintsByDate(date);
      this.saints = response.data;
    },

    showSaintAvatar (imageLinks) {
      return (imageLinks && imageLinks.ico) ? imageLinks.ico : require("@/assets/heart-circle-outline.svg")
    },

    cleanText (text) {
      const regex = /\[{2}.*?\]{2}/gm;
      const subst = ``;

      // The substituted value will be contained in the result variable
      const result = text.replace(regex, subst);

      return result
    }
  }
};
</script>
<style lang="scss" scoped>
ul {
  padding: 0;
}
</style>