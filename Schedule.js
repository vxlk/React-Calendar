
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { time, dateTime }         from './Calendar'

/*
//time object
class time 
{
  constructor()
  {
    this.state.start = "";
    this.state.end = "";
  }
  state={
    start:"",
    end:""
  }
}

//map of days and times
let dateTime = {
  "Blank": new time(),
  "Monday": new time(),
  "Tuesday": new time(),
  "Wednesday": new time(),
  "Thursday": new time(),
  "Friday": new time()
}
 */
export default class Schedule extends Component {
  constructor(props) {
    super(props);

    dateTime["Monday"].start = "9";
    dateTime["Monday"].end = "14";

    //dateTime["Tuesday"].start = "10";
    //dateTime["Tuesday"].end = "14";
    this.state = {
      tableHead: ['', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri'],
      tableData: [
        ['9', '', '', '', '', ''],
        ['10', '', '', '', '', ''],
        ['11', '', '', '', '', ''],
        ['12', '', '', '', '', ''],
        ['1', '', '', '', '', ''],
        ['2', '', '', '', '', ''],
        ['3', '', '', '', '', ''],
        ['4', '', '', '', '', ''],
        ['5', '', '', '', '', ''],
        ['6', '', '', '', '', ''],
        ['7', '', '', '', '', '']

        
      ],
      militaryTime: [9,10,11,12,13,14,15,16,17,18,19]
    }
  }
 
  _alertIndex(index) {
    Alert.alert(`This is ${this.mapIndexToDay(index)}`);
  }
  
  mapIndexToDay(index)
  {
      if (index == 0) return "Blank";
      if (index == 1) return "Monday";
      if (index == 2) return "Tuesday";
      if (index == 3) return "Wednesday";
      if (index == 4) return "Thursday";
      if (index == 5) return "Friday";
  }

  fillDateTime()
  {
    
  }

  render() {
    const state = this.state;
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._alertIndex(index)}>
        <View style={styles.btn}>
        </View>
      </TouchableOpacity>
    );
 
    return (
      <View style={styles.container}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
          {
            state.tableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} data={ this.state.militaryTime[index] >= dateTime[this.mapIndexToDay(cellIndex)].start && //cellIndex
                                                              this.state.militaryTime[index] < dateTime[this.mapIndexToDay(cellIndex)].end ? 
                                                              element(cellData, cellIndex) : cellData} textStyle={styles.text}/>
                  ))
                }
              </TableWrapper>
            ))
          }
        </Table>
      </View>
    )
  }
}
 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
  btn: { width: 40, height: 40, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#ffe' }
}); 