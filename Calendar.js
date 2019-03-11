import React, {Component} from 'react';
import {
  Button,
  Text,
  StyleSheet,
  ScrollView,
  View
} from 'react-native';
import TimePicker from 'react-native-simple-time-picker';

/*
TODO: MAKE A FUNCTION THAT WITH ONE CLICK WOULD ENABLE SATURDAY / SUNDAY OR REMOVE A DAY IF HOURS CHANGE

CURRENT BUGS:
  refresh is late .. possibly because of funtions
*/

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
var dateTime = {
  "Blank": new time(), //used for rendering puroses on schedule screen ... ignore.
  "Monday": new time(),
  "Tuesday": new time(),
  "Wednesday": new time(),
  "Thursday": new time(),
  "Friday": new time()
}

export {time, dateTime};

export default class CalendarsScreen extends Component 
{
  constructor(props) {
    super(props);
    this.onDayPress = this.onDayPress.bind(this);
    dateTime["Monday"].start = "9:00";
    dateTime["Monday"].end = "14:00";
    dateTime["Tuesday"].start = "8:00";
    dateTime["Tuesday"].end = "14:00";
  }
 
  state = 
  {
    isDateTimePickerVisible: true,
    selectedDate: "",
    //for error logging
    cachedDate: "",
    selectedHours: 0,
    selectedMinutes: 0,
    //used for deciding which time wheel to show
    isStart: false,
    isEnd: false,
    showWarning: false
  };
  
  
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    this.setState({ selectedDate: date.toString() });
    this._hideDateTimePicker();
  };
  //on calendar click -> dateTimeList[day.datestring] -> show timeSelector -> display(dateTimeList[day.datestring].time)
  render() {
    const { selectedHours, selectedMinutes } = this.state;
    return (

    <View>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button 
          title="Monday"
          onPress = {() => this.onDayPress('Monday')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
           title="Tuesday"
           onPress = {() => this.onDayPress('Tuesday')}
           />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
           title="Wednesday"
           onPress = {() => this.onDayPress('Wednesday')}
           />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
           title="Thursday"
           onPress = {() => this.onDayPress('Thursday')}
           />
        </View>
        <View style={styles.buttonContainer}>
          <Button 
           title="Friday"
           onPress = {() => this.onDayPress('Friday')}
           />
        </View>
      </View>
    
      {this.displayPicker(this.state.selectedDate)}
      {this.renderEndPicker()}
      {this.renderStartPicker()}
      {this.showWarningIfApplicable()}
     
     
      </View>
    );
  }

  showWarningIfApplicable()
  {
    //allow both to be null ... since this function runs all the time, but still show error if needed
    if (!this.state.selectedDate ||
        (!dateTime[this.state.selectedDate].start && 
        !dateTime[this.state.selectedDate].end)
        )
        {
          if (this.state.showWarning)
            {
              return(
                <View>
                  <Text>Your shift must start before it ends :) Double Check Your Time Entries For {this.state.cachedDate}</Text>
                </View>
              )
            }
          else
            return;
        }
    //check for mismatch in times -> start set but end not ... etc
    else if 
    (
      (dateTime[this.state.selectedDate].start && !dateTime[this.state.selectedDate].end) ||
      (!dateTime[this.state.selectedDate].start && dateTime[this.state.selectedDate].end)
    )
    {
        this.state.showWarning = true;
        //save the date so that even if you change days, the error message says what day your error is in
        this.state.cachedDate = this.state.selectedDate;
    }
     ///TODO: USE MODAL TO MAKE THIS A POPUP WINDOW
     if (this.state.showWarning)
     {
      return(
        <View>
          <Text>Your shift must start before it ends :) Double Check Your Time Entries For {this.state.cachedDate}</Text>
        </View>
      )
     }
  }

  /*Also does bounds checking -> start is never >= end*/
  ///NEED TO FIND A WAY TO REFRESH COMPONENT AFTER SUCCESSFUL CHANGE
  setTime(slot, day, time)
  {
    if (slot == "start")
    {
      //if other field is empty -> allow the input
      if (!dateTime[day].end)
      {
        dateTime[day].start = time;
        this.state.showWarning = false;
      }
      //else, test to make sure it's valid input
      else
      {
        tempStart = time;
        tempEnd = dateTime[day].end;

        tempStart.replace(':', ''); //remove non number character
        tempEnd.replace(':', '');
        if (parseInt(tempStart) >= parseInt(tempEnd))
        {
          this.state.showWarning = true;
          //save the date so that even if you change days, the error message says what day your error is in
          this.state.cachedDate = this.state.selectedDate;
        }
        else
        {  
          dateTime[day].start = time;
          this.state.showWarning = false;
        }
      }
    }
    if (slot == "end")
    {
      //if other field is empty -> allow the input
      if (!dateTime[day].start)
      {
        dateTime[day].end = time;
        this.state.showWarning = false;
      }
      //else, test to make sure it's valid input
      else
      {
        tempStart = dateTime[day].start;
        tempEnd = time;

        tempStart.replace(':', ''); //remove non number character
        tempEnd.replace(':', '');
        if (parseInt(tempStart) >= parseInt(tempEnd))
        {
          this.state.showWarning = true;
          //save the date so that even if you change days, the error message says what day your error is in
          this.state.cachedDate = this.state.selectedDate;
        }
        else
        {  
          dateTime[day].end = time;
          this.state.showWarning = false;
        }
      }
    }  
  }

  //change decision variable -> used to change between start and end time pickers
  flipStartOrEnd(_state)
  {
    if (_state == "start")
    {
      this.setState({isStart : true});
      this.setState({isEnd   : false});
    } 
    if (_state == "end")
    {
      this.setState({isStart : false});
      this.setState({isEnd   : true});
    }
  }

  renderStartPicker()
  {
    if (this.state.isStart == true)
    {
      return(
        <View>
        <Text>Editing Start Time for {this.state.selectedDate}</Text>
        <Text>Selected Time: {this.state.selectedHours}hr:{this.state.selectedMinutes}min</Text>
            <TimePicker
              selectedHours={this.state.selectedHours}
              //initial Hourse value
              selectedMinutes={this.state.selectedMinutes}
              //initial Minutes value
              onChange={(hours, minutes) => this.setState({ 
                  selectedHours: hours, selectedMinutes: minutes 
            })}
          />

          <Button 
           title="Set As New Shift Start Time"
           onPress = {() => this.setTime("start", 
                                         this.state.selectedDate, 
                                         this.state.selectedHours + ":" + this.state.selectedMinutes     
                                         )}
           />
          </View>
      );
    }
  }

  renderEndPicker()
  {
    if (this.state.isEnd == true)
    {
      return(
        <View>
        <Text>Editing End Time for {this.state.selectedDate}</Text>
        <Text>Selected Time: {this.state.selectedHours}hr:{this.state.selectedMinutes}min</Text>
            <TimePicker
              selectedHours={this.state.selectedHours}
              //initial Hourse value
              selectedMinutes={this.state.selectedMinutes}
              //initial Minutes value
              onChange={(hours, minutes) => this.setState({ 
                  selectedHours: hours, selectedMinutes: minutes 
            })}
          />

          <Button 
           title="Set As New Shift End Time"
           onPress = {() => this.setTime("end", 
                                         this.state.selectedDate, 
                                         this.state.selectedHours + ":" + this.state.selectedMinutes     
                                         )}
           />
          </View>
      );
    }
  }

  displayPicker(day)
  {
    if (day == '') return;
    return(
      <View>
        <Text>
          This is the current time block for {this.state.selectedDate} : 
          {dateTime[this.state.selectedDate].start} : 
          {dateTime[this.state.selectedDate].end}
        </Text>
        <View style={styles.buttonContainer}>
            <Button 
            title="Edit Start Time"
            onPress = {() => this.flipStartOrEnd("start")}
            />
        </View>
        <View style={styles.buttonContainer}>
            <Button 
            title="Edit End Time"
            onPress = {() => this.flipStartOrEnd("end")}
                      
            />
        </View>
      </View>
    );
  }

  onDayPress(day) {
    this.setState({
      selectedDate: day
    });
    console.log(this.state.selectedDate)
    this.displayPicker(this.state.selectedDate)
  }
}

const styles = StyleSheet.create({
    container: {
      //flex: 1,
      alignItems: 'center', //bryan wants these left justified
      justifyContent: 'center',
    }
    
});





