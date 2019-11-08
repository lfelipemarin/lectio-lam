<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col>
        <v-list-item>
          <v-icon left>mdi-calendar-month</v-icon>
          <v-list-item-content>
            <v-list-item-title class="headline text-capitalize text-wrap">{{beautyDate}}
            </v-list-item-title>
            <!-- <v-list-item-subtitle>{{evgDetails.data.liturgic_title}}</v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="6" order="2" order-sm="2" order-md="1">
        <v-list width="100%" subheader>
          <v-subheader>SANTOS DEL DÍA</v-subheader>

          <v-list-item v-for="(saint, index) in saints.data" :key="index" @click="openSaintView(saint)">
            <v-list-item-avatar>
              <v-img v-if="showSaintAvatar(saint.image_links)[0]" :src="showSaintAvatar(saint.image_links)[0]">
              </v-img>
              <v-icon v-else>mdi-account-heart</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="saint.name"></v-list-item-title>
            </v-list-item-content>

            <!-- <v-list-item-icon>
              <v-icon :color="item.active ? 'deep-purple accent-4' : 'grey'">chat_bubble</v-icon>
            </v-list-item-icon> -->
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12" sm="12" md="6" order="1" order-sm="1" order-md="2">
        <p>¿Quienes son los santos? Son esa multitud innumerable de hombres y mujeres, de toda raza, edad y condición,
          que se desvivieron por los demás, que vencieron el egoísmo, que perdonaron siempre. Santos son los que han
          hecho de su vida una epifanía de los valores trascendentes; por eso quienes buscan a Dios lo encuentran con
          facilidad humanizado en los santos.
        </p>
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
        <p>
          Fuente: <br>
          <v-btn text small color="primary" target="_blank" class="text-wrap"
                 href="//es.catholic.net/op/articulos/67197/cat/1069/quienes-son-los-santos.html">¿Quienes son los
            santos? - Catholic.net</v-btn>

        </p>
      </v-col>
    </v-row>
  </v-container>
  <v-container fill-height v-else>
    <v-layout align-center>
      <v-flex xs12 text-center>
        <v-progress-circular :size="70" :width="7" color="accent" indeterminate></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from 'lodash';

export default {
  async mounted () {
    // await this.getTodaysSaints();
    this.loading = false;
  },
  data () {
    return {
      saints: this.$store.state.saints,
      loading: true,
    };
  },
  computed: {
    beautyDate () {
      return `${this.$moment().format('dddd D')} de ${this.$moment().format('MMMM')} de ${this.$moment().format('YYYY')}`
    }
  },
  methods: {
    showSaintAvatar (imgObj) {
      return _.map(imgObj, (img) => {
        if (img) {
          return img
        }
      })
    },
    openSaintView (saint) {
      if (saint.has_bio) {
        this.$router.push({ path: '/saints', name: "saint", params: { id: saint.id } })
      }
    }
  }
};
</script>
<style lang="sass" scoped>
ul 
  padding: 0

.v-avatar 
  i
    border: 4px solid

</style>