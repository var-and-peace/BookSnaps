const LIBRARY_SCHEMA = 'Library'
const USER_SCHEMA = 'User'

const LibrarySchema = {
  name: LIBRARY_SCHEMA,
  primaryKey: 'BookId',
  properties: {
    BookId: 'int',
    title: 'string',
    author: 'string',
    ISBN: 'string',
    coverImage: { type: 'string', default: 'img.jpg' },
    genre: 'string?',
    year: 'string',
    unread: { type: 'bool', default: false },
    isReading: { type: 'bool', default: false },
    rating: 'int?',
    isFavorite: { type: 'bool', default: false },
    numPages: 'int?',
    currentPage: 'int?',
    description: 'string?',
  },
}

class User {
  get fullName() {
    return this.firstName + ' ' + this.lastName
  }
}

User.schema = {
  name: USER_SCHEMA,
  properties: {
    firstName: 'string',
    lastName: 'string?',
    profilePic: 'string?',
    library: { type: 'list', objectType: LIBRARY_SCHEMA },
  },
}

module.exports = {
  LIBRARY_SCHEMA,
  USER_SCHEMA,
  User,
  LibrarySchema,
}
