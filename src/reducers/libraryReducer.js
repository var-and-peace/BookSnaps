import axios from 'axios'
const Realm = require('realm')
import { LIBRARY_SCHEMA, LibrarySchema } from '../db/schemas'

// INITIAL LIBRARY STATE
initialLibrary = []

// ACTION CONSTANTS
const GOT_BOOKS = 'GOT_BOOKS'
const ADDED_BOOK = 'ADDED_BOOK'

// ACTION CREATORS
export const gotBooks = (books) => ({
    type: GOT_BOOKS,
    books,
})
export const addedBook = book => ({
    type: ADDED_BOOK,
    book
})

// THUNK CREATORS
export const getBooks = () => async (dispatch) => {
    try {
    const library = await Realm.open({
        schema: [LibrarySchema]
    })
    let books = await [...library.objects(LIBRARY_SCHEMA)]
    console.log(books)
    dispatch(gotBooks(books))
  } catch (err) {
    console.error(err)
  }
}
export const addBook = book => async dispatch => {
    try {
        const library = await Realm.open({
            schema: [LibrarySchema]
        })
        library.write(() => {
            library.create('Library', book)
        })
        dispatch(addedBook(book))
    } catch (err) {
        console.error(err)
    }
}

// LIBRARY REDUCER
const libraryReducer = (state = initialLibrary, action) => {
  switch (action.type) {
    case GOT_BOOKS:
      return action.books
    case ADDED_BOOK:
        return [...state, action.book]
    default:
      return state
  }
}

export default libraryReducer
