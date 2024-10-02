import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TransportationModes = ({activeIndex, setActiveIndex}) => {

  const modes = [
    { icon: 'walk', text: 'Walking', color: '#4CAF50', activeColor: '#fff' },
    { icon: 'bicycle', text: 'Bicycle', color: '#2196F3', activeColor: '#fff' },
    { icon: 'car', text: 'Driving', color: '#FF9800', activeColor: '#333' },
    { icon: 'bus', text: 'Transit', color: '#9C27B0', activeColor: '#fff' },
  ];

  return (
    <View style={{ flexDirection: 'row', paddingVertical:10 }}>
      {modes.map((mode, index) => (
        <TouchableOpacity
          key={index}
          style={{
            padding: 7,
            borderRadius: 10,
            backgroundColor: activeIndex === index ? mode.color : '#fff',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => setActiveIndex(index)}
        >
          <Ionicons
            name={mode.icon}
            size={24}
            color={activeIndex === index ? mode.activeColor : mode.color}
          />
          <Text
            style={{
              marginLeft: 5,
              color: activeIndex === index ? mode.activeColor : '#333',
            }}
          >
            {mode.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TransportationModes;