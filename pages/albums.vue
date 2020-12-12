<template>
  <div>
    <v-card>
      <v-toolbar v-show="cardAlbums">
        <v-toolbar-title>albums</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="toggle">
          <span v-if="toolbarCreateAlbum"><v-icon>mdi-minus</v-icon></span>
          <span v-if="!toolbarCreateAlbum"
            ><v-icon>mdi-application</v-icon></span
          >
        </v-btn>
        <v-toolbar-title />
        <v-btn icon color="error" @click="closeAlbums">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-toolbar v-show="toolbarCreateAlbum">
        <v-form class="d-flex align-baseline" @submit.prevent="">
          <v-text-field
            v-model="newAlbum"
            autofocus
            autocomplete="off"
            placeholder="Que cal fer?"
            @keyup.enter="addAlbum"
          ></v-text-field>
          <v-btn class="ml-2" color="primary" @click="addAlbum">Afegir</v-btn>
        </v-form>
      </v-toolbar>
      <v-list v-show="toolbarCreateAlbum">
        <div v-for="album in filteredAlbums" :key="album.id">
          <v-list-item>
            <v-list-item-action>
              <!--              v-model -> SYNTAX SUGAR-->
              <v-switch v-model="album.listened"></v-switch>
              <!--              // DATA BINDING: One way || Two way-->
              <!--              <v-switch-->
              <!--                :value="album.listened"-->
              <!--                @change="album.listened = $event.target.value"-->
              <!--              ></v-switch>-->
            </v-list-item-action>
            <v-list-item-title>
              <v-text-field
                v-if="editing.id === album.id"
                v-model="editing.title"
                autofocus
                @keydown.enter="editAlbum"
              ></v-text-field>
              <span v-else @dblclick="initEditingProcess(album)">{{
                album.title
              }}</span>
            </v-list-item-title>
            <v-list-item-action>
              <v-btn color="success" icon @click="initEditingProcess(album)">
                <v-icon>mdi-account</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn color="error" icon @click="initDeleteProcess(album)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
        </div>
      </v-list>
      <v-toolbar>
        <v-toolbar-title v-show="toolbarCreateAlbum" qa="footer_title">
          <span v-show="remaining === 0"
            >No tens cap album pendent d'escoltar</span
          >

          <span v-show="remaining === 1"
            >{{ remaining }} album pendent d'escoltar</span
          >

          <span v-show="remaining > 1"
            >{{ remaining }} albums pendents d'escoltar</span
          >

          | listened: {{ listened }}
        </v-toolbar-title>
      </v-toolbar>
    </v-card>

    <ul v-show="toolbarCreateAlbum" class="filters">
      <li>
        <a
          href="#/all"
          :class="{ selected: visibility === 'all' }"
          qa="filter_all"
          >All</a
        >
      </li>
      <li>
        <a
          href="#/active"
          :class="{ selected: visibility === 'active' }"
          qa="filter_pending"
          >Active</a
        >
      </li>
      <li>
        <a
          href="#/listened"
          :class="{ selected: visibility === 'listened' }"
          qa="filter_finished"
          >Listened</a
        >
      </li>
    </ul>

    <v-snackbar v-model="showSnackbar">
      {{ snackBarMessage }}
    </v-snackbar>

    <v-dialog :value="showDeleteConfirmationDialog" max-width="290">
      <v-card>
        <v-card-title>Esteu segurs?</v-card-title>
        <v-card-text
          >Tingueu en compte que els albums esborrats no es poden
          recuperar.</v-card-text
        >
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            qa="cancel_button"
            @click="showDeleteConfirmationDialog = false"
            >Cancel·lar</v-btn
          >
          <v-btn color="error" qa="delete_button" @click="deleteAlbum(album)"
            >Eliminar</v-btn
          >
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { albumsStorage, toolbarStorageAlbums } from '@/repositori/albums'
const filters = {
  all(albums) {
    return albums
  },
  active(albums) {
    return albums.filter(function (album) {
      return !album.listened
    })
  },
  listened(albums) {
    console.log('albums escoltats fora')
    return albums.filter(function (album) {
      console.log('albums escoltats dins')
      return album.listened
    })
  },
}
export default {
  name: 'Albums',
  data() {
    return {
      snackBarMessage: '',
      editing: {},
      albums: [],
      newAlbum: '',
      showSnackbar: false,
      showDeleteConfirmationDialog: false,
      visibility: 'all',
      toolbarCreateAlbum: false,
      cardAlbums: true,
    }
  },
  computed: {
    filteredAlbums() {
      // return this.albums
      return filters[this.visibility](this.albums)
    },
    remaining() {
      return this.albums.filter((album) => !album.listened).length
    },
    listened() {
      return this.albums.filter((album) => album.listened).length
    },
  },
  watch: {
    albums: {
      handler(albums) {
        albumsStorage.save(albums)
      },
      deep: true,
    },
    toolbarCreateAlbum: {
      handler(toolbarCreAlb) {
        toolbarStorageAlbums.save(toolbarCreAlb)
      },
    },
  },
  mounted() {
    window.addEventListener('hashchange', this.onHashChange)
    this.onHashChange()
    this.albums = albumsStorage.fetch()
    const minimizedStateAlbums = toolbarStorageAlbums.fetch() === 'true'
    console.log(minimizedStateAlbums)
    this.toolbarCreateAlbum = minimizedStateAlbums
  },
  methods: {
    onHashChange() {
      const visibility = window.location.hash.replace(/#\/?/, '')
      if (filters[visibility]) {
        this.visibility = visibility
      } else {
        window.location.hash = ''
        this.visibility = 'all'
      }
    },
    addAlbum() {
      if (this.newAlbum.length !== 0) {
        this.albums.push({
          id: uuidv4(),
          title: this.newAlbum,
          listened: false,
        })
        this.newAlbum = ''
        this.snackBarMessage = 'Album afegit correctament!'
        this.showSnackbar = true
      } else {
        alert('Un album ha de tenir un titol!!')
      }
    },
    editAlbum() {
      const album = this.albums.find((t) => t.id === this.editing.id)
      album.title = this.editing.title
      this.editing = {}
      this.snackBarMessage = 'Album modificat correctament!'
      this.showSnackbar = true
    },
    initEditingProcess(album) {
      this.editing = album
    },
    initDeleteProcess(album) {
      this.showDeleteConfirmationDialog = true
      this.albumBeingDeleted = { ...album }
    },
    deleteAlbum() {
      this.albums.splice(
        this.albums.indexOf(
          this.albums.find((t) => t.id === this.albumBeingDeleted.id)
        ),
        1
      )
      this.showDeleteConfirmationDialog = false
      this.snackBarMessage = 'Album eliminat correctament!'
      this.showSnackbar = true
    },
    toggle() {
      this.toolbarCreateAlbum = !this.toolbarCreateAlbum
    },
    closeAlbums() {
      // eslint-disable-next-line no-constant-condition
      if ((this.toolbarCreateAlbum = true)) {
        this.toolbarCreateAlbum = !this.toolbarCreateAlbum
      }
      this.cardAlbums = !this.cardAlbums
    },
  },
}
</script>
