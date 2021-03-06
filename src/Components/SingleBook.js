import React from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  Button,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import {
  getBook,
  setBook,
  setFavorite,
  setRead,
} from '../reducers/singleBookReducer'
import { removeBook } from '../reducers/libraryReducer'

const WIDTH = Dimensions.get('window').width / 2.3
const HEIGHT = 1.5555555555555556 * WIDTH

class SingleBook extends React.Component {
  componentDidMount() {
    this.props.getBook()
  }

  render() {
    const { isFavorite, unread: isRead } = this.props.book
    let title = this.props.book.title
    return (
      <View style={{ backgroundColor: '#ddbea9', flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text style={{ marginBottom: 15, marginLeft: 15, fontSize: 20 }}>
              Back
            </Text>
          </TouchableOpacity>
          <Text style={styles.text}>
            {title && title.length > 20 ? title.slice(0, 20) + '...' : title}
          </Text>
          <Text style={styles.invisibleButton}>Back</Text>
        </View>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#fff1e6',
            padding: 20,
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {this.props.book.coverImage === null ? (
            <View style={styles.item}>
              <Text style={styles.itemText}>{this.props.book.title}</Text>
              <Text style={styles.itemText}>{this.props.book.author}</Text>
            </View>
          ) : (
            <Image
              style={{
                width: WIDTH,
                height: HEIGHT,
                borderRadius: 10,
                marginBottom: 25,
              }}
              source={{ uri: this.props.book.coverImage }}
            />
          )}
          <Text style={{ textAlign: 'center' }}>
            By{' '}
            {this.props.book.author
              ? this.props.book.author.join(', ') + '\n' + this.props.book.year
              : ''}
          </Text>
          <Text style={{ padding: 20 }}>{this.props.book.description}</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.removeBook(this.props.book.BookId)
              this.props.setBook('EMPTY')
              this.props.navigation.goBack()
            }}
            style={{
              margin: 5,
              borderRadius: 9,
              backgroundColor: '#ddbea9',
              borderColor: '#ddbea9',
              width: 180,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                padding: 5,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Remove from Library
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.setFavorite(this.props.book.BookId, !isFavorite)
            }}
            style={{
              margin: 5,
              borderRadius: 9,
              backgroundColor: '#ddbea9',
              borderColor: '#ddbea9',
              width: 180,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                padding: 5,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {!isFavorite ? 'Add to favorites' : 'Remove from favorites'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.setRead(this.props.book.BookId, !isRead)
            }}
            style={{
              margin: 5,
              marginBottom: 50,
              borderRadius: 9,
              backgroundColor: '#ddbea9',
              borderColor: '#ddbea9',
              width: 180,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                padding: 5,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {isRead ? 'Mark as finished' : 'Mark as unfinished'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}

const mapState = (state) => ({
  book: state.selectedBook,
})

const mapDispatch = (dispatch) => ({
  getBook: () => dispatch(getBook()),
  removeBook: (bookId) => dispatch(removeBook(bookId)),
  setBook: (bookId) => dispatch(setBook(bookId)),
  setFavorite: (bookId, isFavorite) =>
    dispatch(setFavorite(bookId, isFavorite)),
  setRead: (bookId, isRead) => dispatch(setRead(bookId, isRead)),
})

export default connect(mapState, mapDispatch)(SingleBook)

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 15,
    marginTop: 50,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#FFC771',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: HEIGHT,
    width: 177,
    margin: 10,
    padding: 2,
    borderRadius: 10,
  },
  itemText: {
    color: '#fff',
    fontSize: 22,
  },
  invisibleButton: {
    color: '#ddbea9',
    marginBottom: 15,
    marginLeft: 15,
    fontSize: 20,
  },
})
