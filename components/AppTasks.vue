<!--<template>-->
<!--  <div>-->
<!--    &lt;!&ndash;    // TODO ALERTs: En cas d'error i en cas de missatge: Tasca afegida correctament&ndash;&gt;-->
<!--    <v-card>-->
<!--      <v-toolbar>-->
<!--        <v-toolbar-title>Tasques</v-toolbar-title>-->
<!--        <v-spacer></v-spacer>-->
<!--        <v-list-item-action>-->
<!--          <v-btn icon>-->
<!--            <v-icon>mdi-minus</v-icon>-->
<!--          </v-btn>-->
<!--        </v-list-item-action>-->
<!--        <v-list-item-action>-->
<!--          <v-btn icon>-->
<!--            <v-icon>mdi-application</v-icon>-->
<!--          </v-btn>-->
<!--        </v-list-item-action>-->
<!--        <v-list-item-action>-->
<!--          <v-btn icon>-->
<!--            <v-icon>mdi-close</v-icon>-->
<!--          </v-btn>-->
<!--        </v-list-item-action>-->
<!--      </v-toolbar>-->
<!--      &lt;!&ndash;    TODO Toolbar tingui botons accions per: tancar(no mostrar), maximitzar, minimitzar &ndash;&gt;-->
<!--      <v-toolbar>-->
<!--        <v-form class="d-flex align-baseline" @submit.prevent="addTask">-->
<!--          <v-text-field-->
<!--            v-model="newTask"-->
<!--            autofocus-->
<!--            required-->
<!--            autocomplete="off"-->
<!--            placeholder="QUE TENS QUE FER EH?"-->
<!--          ></v-text-field>-->
<!--          <v-btn class="ml-2" color="primary" @click="addTask">Afegir</v-btn>-->
<!--          &lt;!&ndash;          <v-alert :value="alert" type="success"> Ha funcionat! </v-alert>&ndash;&gt;-->
<!--        </v-form>-->
<!--      </v-toolbar>-->
<!--      <v-divider></v-divider>-->
<!--      <v-list>-->
<!--        <v-list-item v-for="task in filteredTasks" :key="task.id">-->
<!--          <v-list-item-action-->
<!--            ><v-switch v-model="task.completed"></v-switch-->
<!--          ></v-list-item-action>-->
<!--          <v-list-item-title>-->
<!--            <v-text-field-->
<!--              v-if="editing.id === task.id"-->
<!--              v-model="editing.title"-->
<!--              autofocus-->
<!--              @keydown.enter="editTask"-->
<!--            ></v-text-field>-->
<!--            <span v-else @dblclick="initEditingProcess(task)">{{-->
<!--              task.title-->
<!--            }}</span>-->
<!--          </v-list-item-title>-->
<!--          <v-list-item-action>-->
<!--            <v-btn color="success" icon @click="initEditingProcess(task)">-->
<!--              <v-icon>mdi-account</v-icon>-->
<!--            </v-btn>-->
<!--          </v-list-item-action>-->
<!--          <v-list-item-action>-->
<!--            <v-btn color="error" icon @click="initDeleteProcess(task)">-->
<!--              <v-icon>mdi-close</v-icon>-->
<!--            </v-btn>-->
<!--          </v-list-item-action>-->
<!--        </v-list-item>-->
<!--      </v-list>-->
<!--      <v-toolbar>-->
<!--        <v-toolbar-title qa="footer_title">-->
<!--          <span v-show="remaining === 0"-->
<!--            >Enhorabona! No tens cap tasca pendent de fer</span-->
<!--          >-->

<!--          <span v-show="remaining === 1"-->
<!--            >{{ remaining }} Tasca pendent de fer</span-->
<!--          >-->

<!--          <span v-show="remaining > 1">{{ remaining }} Tasques pendents</span>-->
<!--        </v-toolbar-title>-->
<!--      </v-toolbar>-->
<!--      &lt;!&ndash;      <v-toolbar>&ndash;&gt;-->
<!--      &lt;!&ndash;        <v-toolbar-title>Filtrar....</v-toolbar-title>&ndash;&gt;-->
<!--      &lt;!&ndash;        <v-btn> All </v-btn>&ndash;&gt;-->
<!--      &lt;!&ndash;        <v-btn> Active </v-btn>&ndash;&gt;-->
<!--      &lt;!&ndash;        <v-btn> Completed </v-btn>&ndash;&gt;-->
<!--      <v-tabs class="filters" align-with-title>-->
<!--        <v-tab-->
<!--          href="#/all"-->
<!--          :class="{ selected: visibility === 'all' }"-->
<!--          qa="filter_all"-->
<!--        >-->
<!--          All-->
<!--        </v-tab>-->
<!--        <v-tab-->
<!--          href="#/active"-->
<!--          :class="{ selected: visibility === 'active' }"-->
<!--          qa="filter_pending"-->
<!--        >-->
<!--          Active-->
<!--        </v-tab>-->
<!--        <v-tab-->
<!--          href="#/completed"-->
<!--          :class="{ selected: visibility === 'completed' }"-->
<!--          qa="filter_completed"-->
<!--        >-->
<!--          Completed-->
<!--        </v-tab>-->
<!--        <v-tabs-slider color="blue"></v-tabs-slider>-->
<!--      </v-tabs>-->
<!--      &lt;!&ndash;      </v-toolbar>&ndash;&gt;-->
<!--    </v-card>-->
<!--    <v-snackbar v-model="showSnackbar"> {{ snackBarMessage }}</v-snackbar>-->
<!--    <v-dialog :value="showDeleteConfirmationDialog" max-width="400"-->
<!--      ><v-card-->
<!--        ><v-card-title>Esteu segurs?</v-card-title-->
<!--        ><v-card-text-->
<!--          >Tingueu en compte que les tasques esborrades no es poden-->
<!--          recuperar.</v-card-text-->
<!--        >-->
<!--        <v-card-actions>-->
<!--          <v-spacer />-->
<!--          <v-btn-->
<!--            text-->
<!--            qa="cancel_button"-->
<!--            @click="showDeleteConfirmationDialog = false"-->
<!--            >Cancel·lar</v-btn-->
<!--          >-->
<!--          <v-btn color="error" qa="delete_button" @click="deleteTask"-->
<!--            >Eliminar</v-btn-->
<!--          >-->
<!--          <v-spacer />-->
<!--        </v-card-actions> </v-card-->
<!--    ></v-dialog>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--const filters = {-->
<!--  all(tasks) {-->
<!--    return tasks-->
<!--  },-->
<!--  active(tasks) {-->
<!--    return tasks.filter(function (task) {-->
<!--      return !task.completed-->
<!--    })-->
<!--  },-->
<!--  completed(tasks) {-->
<!--    return tasks.filter(function (task) {-->
<!--      return task.completed-->
<!--    })-->
<!--  },-->
<!--}-->
<!--export default {-->
<!--  props: {-->
<!--    tasks: {-->
<!--      type: Array,-->
<!--      required: true,-->
<!--    },-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      editing: null,-->
<!--      newTask: '',-->
<!--      editedTask: null,-->
<!--      visibility: 'all',-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    footerTitle() {-->
<!--      if (this.remaining === 0)-->
<!--        return 'Enhorabona! No tens cap tasca pendent de fer'-->
<!--      if (this.remaining === 1) return '1 Tasca pendent de fer'-->
<!--      return this.remaining + ' Tasques pendents de fer'-->
<!--    },-->
<!--    filteredTasks() {-->
<!--      return filters[this.visibility](this.tasks)-->
<!--    },-->
<!--    remaining() {-->
<!--      return filters.active(this.tasks).length-->
<!--    },-->
<!--  },-->
<!--  mounted() {-->
<!--    window.addEventListener('hashchange', this.onHashChange)-->
<!--    this.onHashChange()-->
<!--  },-->
<!--  methods: {-->
<!--    onHashChange() {-->
<!--      const visibility = window.location.hash.replace(/#\/?/, '')-->
<!--      if (filters[visibility]) {-->
<!--        this.visibility = visibility-->
<!--      } else {-->
<!--        window.location.hash = ''-->
<!--        this.visibility = 'all'-->
<!--      }-->
<!--    },-->
<!--    addTask() {-->
<!--      const value = this.newTask && this.newTask.trim()-->
<!--      if (!value) {-->
<!--        return-->
<!--      }-->
<!--      this.$store.commit('tasks/add', this.newTask)-->
<!--      this.newTask = ''-->
<!--    },-->
<!--    removeTask(task) {-->
<!--      this.$store.commit('tasks/remove', task)-->
<!--    },-->
<!--    editTask(task) {-->
<!--      this.editing = task.id-->
<!--      this.beforeEditCache = task.title-->
<!--      this.editedTask = { ...task }-->
<!--    },-->
<!--    doneEdit(task) {-->
<!--      if (!this.editedTask) {-->
<!--        return-->
<!--      }-->
<!--      this.$store.commit('tasks/edit', {-->
<!--        task: this.editedTask,-->
<!--        title: this.editedTask.title.trim(),-->
<!--      })-->
<!--      this.editedTask = null-->
<!--      this.editing = null-->
<!--    },-->
<!--    cancelEdit(task) {-->
<!--      this.editedTask = null-->
<!--      this.editing = null-->
<!--      this.$store.commit('tasks/edit', { task, title: this.beforeEditCache })-->
<!--    },-->
<!--    toggle(task) {-->
<!--      this.$store.commit('tasks/toggle', task)-->
<!--    },-->
<!--    removeCompleted() {-->
<!--      this.tasks = filters.active(this.tasks)-->
<!--    },-->
<!--  },-->
<!--}-->
<!--</script>-->

<!--<style>-->
<!--.completed {-->
<!--  text-decoration: line-through;-->
<!--}-->
<!--</style>-->
