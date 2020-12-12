<template>
  <div>
    <!--    // TODO ALERTs: En cas d'error i en cas de missatge: Tasca afegida correctament-->

    <v-card>
      <v-toolbar v-show="cardTasques">
        <v-toolbar-title>Tasques</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="toggle">
          <span v-if="toolbarCreateTask"><v-icon>mdi-minus</v-icon></span>
          <span v-if="!toolbarCreateTask"
            ><v-icon>mdi-application</v-icon></span
          >
        </v-btn>
        <v-toolbar-title />
        <v-btn icon color="error" @click="closeTasks">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-toolbar v-show="toolbarCreateTask">
        <v-form class="d-flex align-baseline" @submit.prevent="">
          <v-text-field
            v-model="newTask"
            autofocus
            autocomplete="off"
            placeholder="QUE VOLS FER EH?"
            @keyup.enter="addTask"
          ></v-text-field>
          <v-btn class="ml-2" color="primary" @click="addTask">Afegir</v-btn>
        </v-form>
      </v-toolbar>
      <v-list v-show="toolbarCreateTask">
        <div v-for="task in filteredTasks" :key="task.id">
          <v-list-item>
            <v-list-item-action>
              <v-switch v-model="task.completed"></v-switch>
            </v-list-item-action>
            <v-list-item-title>
              <v-text-field
                v-if="editing.id === task.id"
                v-model="editing.title"
                autofocus
                @keydown.enter="editTask"
              ></v-text-field>
              <span v-else @dblclick="initEditingProcess(task)">{{
                task.title
              }}</span>
            </v-list-item-title>
            <v-list-item-action>
              <v-btn color="success" icon @click="initEditingProcess(task)">
                <v-icon>mdi-account</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn color="error" icon @click="initDeleteProcess(task)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
        </div>
      </v-list>
      <v-toolbar v-show="toolbarCreateTask">
        <v-toolbar-title qa="footer_title">
          <span v-show="remaining === 0"
            >Enhorabona! No tens cap tasca pendent de fer</span
          >

          <span v-show="remaining === 1"
            >{{ remaining }} Tasca pendent de fer</span
          >

          <span v-show="remaining > 1"
            >{{ remaining }} Tasques pendents de fer</span
          >

          | Completed: {{ completed }}
        </v-toolbar-title>
      </v-toolbar>
    </v-card>

    <ul v-show="toolbarCreateTask" class="filters">
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
          href="#/completed"
          :class="{ selected: visibility === 'completed' }"
          qa="filter_finished"
          >Completed</a
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
          >Tingueu en compte que les tasques esborrades no es poden
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
          <v-btn color="error" qa="delete_button" @click="deleteTask(task)"
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

import { tasksStorage, toolbarStorageTasks } from '~/repositori/tasks.js'

const filters = {
  all(tasks) {
    return tasks
  },
  active(tasks) {
    console.log('tasques actives')
    return tasks.filter(function (task) {
      return !task.completed
    })
  },
  completed(tasks) {
    console.log('tasques completades fora')
    return tasks.filter(function (task) {
      console.log('tasques completades dins')
      return task.completed
    })
  },
}

export default {
  name: 'Tasks',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    // tasksStorage
  },
  data() {
    return {
      snackBarMessage: '',
      editing: {},
      tasks: [],
      newTask: '',
      showSnackbar: false,
      showDeleteConfirmationDialog: false,
      visibility: 'all',
      toolbarCreateTask: false,
      cardTasques: true,
    }
  },
  computed: {
    filteredTasks() {
      // return this.tasks
      return filters[this.visibility](this.tasks)
    },
    remaining() {
      // return this.tasks.length
      return this.tasks.filter((task) => !task.completed).length
      // return this.tasks.filter(function (task) {
      //   return task.completed === false
      // })
    },
    completed() {
      return this.tasks.filter((task) => task.completed).length
    },
  },
  watch: {
    tasks: {
      handler(tasks) {
        // tasksStorage.tasksStorage.save(tasks)
        tasksStorage.save(tasks)
      },
      deep: true,
    },
    toolbarCreateTask: {
      handler(toolbarCreTas) {
        toolbarStorageTasks.save(toolbarCreTas)
      },
    },
  },
  mounted() {
    window.addEventListener('hashchange', this.onHashChange)
    this.onHashChange()
    this.tasks = tasksStorage.fetch()
    // this.toolbarCreateTask = toolbarStorageTasks.fetch()
    const minimizedState = toolbarStorageTasks.fetch() === 'true'
    this.toolbarCreateTask = minimizedState
    // this.toolbarCreateTask = Boolean(
    //   localStorage.getItem('minimitzed_state_tasks')
    // )
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
    addTask() {
      if (this.newTask.length !== 0) {
        this.tasks.push({
          id: uuidv4(),
          title: this.newTask,
          completed: false,
        })
        this.newTask = ''
        this.snackBarMessage = 'Tasca afegida correctament!'
        this.showSnackbar = true
      } else {
        alert('El nom de la tasca no pot estar buit!')
      }
    },
    editTask() {
      const task = this.tasks.find((t) => t.id === this.editing.id)
      task.title = this.editing.title
      this.editing = {}
      this.snackBarMessage = 'Tasca modificada correctament!'
      this.showSnackbar = true
    },
    initEditingProcess(task) {
      // this.editing.id = task.id
      // this.editing.title = task.title
      this.editing = task
    },
    initDeleteProcess(task) {
      this.showDeleteConfirmationDialog = true
      this.taskBeinDeleted = { ...task }
    },
    deleteTask() {
      // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/splice
      this.tasks.splice(
        this.tasks.indexOf(
          this.tasks.find((t) => t.id === this.taskBeinDeleted.id)
        ),
        1
      )
      // this.tasks.splice(this.taskBeinDeleted, 1)
      this.showDeleteConfirmationDialog = false
      this.snackBarMessage = 'Tasca eliminada correctament!'
      this.showSnackbar = true
    },
    toggle() {
      this.toolbarCreateTask = !this.toolbarCreateTask
    },
    closeTasks() {
      // eslint-disable-next-line no-constant-condition
      if ((this.toolbarCreateTask = true)) {
        this.toolbarCreateTask = !this.toolbarCreateTask
      }
      this.cardTasques = !this.cardTasques
    },
  },
}
</script>
