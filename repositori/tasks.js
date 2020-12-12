const ALGO = 'minimitzed_state_tasks'
const STORAGE_KEY = 'todos-vuejs-2.0'

const tasksStorage = {
  fetch() {
    // console.log(localStorage.getItem(STORAGE_KEY) || '[]')
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return todos
  },
  save(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  },
}
const toolbarStorageTasks = {
  fetch() {
    const state = localStorage.getItem(ALGO)
    return state
  },
  save(state) {
    localStorage.setItem(ALGO, state)
  },
}

export { tasksStorage, toolbarStorageTasks }
