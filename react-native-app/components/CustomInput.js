import React, { useState, useCallback, useMemo } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  style,
  inputStyle,
  labelStyle,
  error,
  isPassword = false,
  isDate = false,
}) => {
  const currentYear = new Date().getFullYear();
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = useCallback(
    (day) => {
      onChangeText(day.dateString);
      setShowCalendar(false);
    },
    [onChangeText]
  );

  const closeCalendar = useCallback(() => {
    setShowCalendar(false);
  }, []);

  const openCalendar = useCallback(() => {
    if (isDate) {
      setShowCalendar(true);
    }
  }, [isDate]);

  const markedDates = useMemo(
    () => ({
      [value]: { selected: true, selectedColor: '#87CEFA' },
    }),
    [value]
  );

  const calendarTheme = useMemo(
    () => ({
      backgroundColor: '#ffffff',
      calendarBackground: '#ffffff',
      textSectionTitleColor: '#b6c1cd',
      selectedDayBackgroundColor: '#87CEFA',
      selectedDayTextColor: '#ffffff',
      todayTextColor: '#87CEFA',
      dayTextColor: '#2d4150',
      textDisabledColor: '#d9e1e8',
      dotColor: '#87CEFA',
      selectedDotColor: '#ffffff',
      arrowColor: '#87CEFA',
      monthTextColor: '#87CEFA',
      indicatorColor: '#87CEFA',
      textDayFontWeight: '300',
      textMonthFontWeight: 'bold',
      textDayHeaderFontWeight: '300',
      textDayFontSize: 16,
      textMonthFontSize: 16,
      textDayHeaderFontSize: 16,
    }),
    []
  );
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={openCalendar}
        activeOpacity={isDate ? 0.7 : 1}
      >
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          editable={!isDate}
          secureTextEntry={isPassword}
          pointerEvents={isDate ? 'none' : 'auto'}
        />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={closeCalendar}
      >
        <TouchableWithoutFeedback onPress={closeCalendar}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={handleDateSelect}
                  markedDates={markedDates}
                  theme={calendarTheme}
                  maxDate={new Date().toISOString().split('T')[0]}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    backgroundColor: '#fff',
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
});
export default CustomInput;