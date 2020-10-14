import React from 'react';
import { Text, View } from 'react-native';
import { VictoryBar, VictoryChart } from 'victory-native';
import { connect } from 'react-redux'
import { getBooks } from '../reducers/libraryReducer'

const data = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000}
];

class Graph extends React.Component {
    render(){
        return (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Text>Welcome to Graphs!</Text>
            <VictoryChart >
              <VictoryBar data={data}
                x="quarter"
                y="earnings"
              />
            </VictoryChart>
          </View>
        )
    }

}

const mapState = (state) => ({
  library: state.library
})

const mapDispatch = (dispatch) => ({
  getBooks: () => dispatch(getBooks())
})

export default connect(mapState, mapDispatch)(Graph)
