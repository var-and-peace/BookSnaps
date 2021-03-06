import React from 'react'
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { RNCamera } from 'react-native-camera'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import ip_address from '../../ip_address'
import { getScanResults, getBarcodeResult } from '../reducers/scanReducer'
import { connect } from 'react-redux'

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  '../../edge_detection_server/booksnap-service_account.json'


class PhotoCamera extends React.PureComponent {
  state = {
    type: RNCamera.Constants.Type.back,
    wordList: [],
    base64: '',
    barcode: [''],
    alert: false
  }

  flipCamera = () =>
    this.setState({
      type:
        this.state.type === RNCamera.Constants.Type.back
          ? RNCamera.Constants.Type.front
          : RNCamera.Constants.Type.back,
    })

  takePhoto = async () => {
    const options = {
      quality: 0.5,
      base64: true,
    }
    const picture = await this.camera.takePictureAsync(options)
    this.setState({ base64: picture.base64 })
    try {
      this.props.startLoading()
      const res = await axios.post(`http://${ip_address}:3000/sd_api`, {
        base64: picture.base64,
      })
      this.props.getScanResults(res.data.message)
      this.props.finishLoading()
    } catch (error) {
      console.error(error)
    }
  }

  onTextFound = (data) => {
    let foundWords = []
    if (data && data.textBlocks && data.textBlocks.length > 0) {
      for (let i = 0; i < data.textBlocks.length; i++) {
        let text = data.textBlocks[i].value
        if (text && text.trim().length > 0) {
          let words = text.split(/[\s,.?]+/)
          if (words && words.length > 0) {
            for (let j = 0; j < words.length; j++) {
              if (words[j].trim().length > 0) {
                foundWords.push(words[j])
              }
            }
          }
        }
      }
      this.setState({ wordList: foundWords })
    }
  }
  barcodeAlert = (title, message) => {
      Alert.alert(
        title,
        message,
        [
          {
            text: 'Okay',
          },
        ],
        { cancelable: false }
      )
  }

  alertTimeout = (time) => {
    this.setState({ alert: true })
    setTimeout(() => this.setState({ alert: false }), time)
  }

  onBarCodeRead = (e) => {
    const { barcode } = this.state
    if (!barcode.includes(e.data)) {
      this.props.getBarcodeResult(e.data)
      this.setState({ barcode: [...barcode, e.data] })
      this.barcodeAlert(
        'Barcode found!',
        'Book has been added to the results page'
      )
      this.alertTimeout(4000)
    } else if (!this.state.alert && barcode.includes(e.data)) {
      // alert user that they have already scanned this.
      this.barcodeAlert(
        'Already scanned',
        'This barcode has already been scanned!' +
          '\nCheck the results page to see it.'
      )
      this.alertTimeout(2000)
    }
  }

  render() {
    const { type } = this.state
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(cam) => {
            this.camera = cam
          }}
          type={type}
          style={styles.preview}
          captureAudio={false}
          onBarCodeRead={this.onBarCodeRead}
        />
        <View style={styles.cameraButton}>
          <TouchableOpacity onPress={this.takePhoto}>
            <Icon name='circle' size={50} color='orange' />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapState = (state) => ({
  scanResults: state.scanResults,
})

const mapDispatch = (dispatch) => ({
  getScanResults: (data) => dispatch(getScanResults(data)),
  getBarcodeResult: (barcode) => dispatch(getBarcodeResult(barcode)),
})

export default connect(mapState, mapDispatch)(PhotoCamera)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  cameraButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  topButtons: {
    flex: 1,
    alignItems: 'flex-start',
  },
  bottomButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flipButton: {
    alignSelf: 'flex-end',
  },
  recordingButton: {
    width: 10,
    height: 10,
  },
})
