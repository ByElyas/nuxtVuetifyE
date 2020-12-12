const ALGO_ALBUMS = 'minimitzed_state_albums'
const STORAGE_KEY = 'albums-vuejs-2.0'

const albumsStorage = {
  fetch() {
    // console.log(localStorage.getItem(STORAGE_KEY) || '[]')
    const album = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return album
  },
  save(album) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(album))
  },
}

const toolbarStorageAlbums = {
  fetch() {
    const state = localStorage.getItem(ALGO_ALBUMS)
    return state
  },
  save(state) {
    localStorage.setItem(ALGO_ALBUMS, state)
  },
}

export { albumsStorage, toolbarStorageAlbums }
