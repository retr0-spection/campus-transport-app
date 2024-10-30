import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectSystemMessage, setSystemMessage } from "@/redux/slices/notificationSlice";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import {  setNotificationType } from "./utils";

export const SYSMESSAGE = (props) => {
  const data =  useSelector(selectSystemMessage);
  const [selectedType, setSelectedType] = useState(null)
  
  const panY = useSharedValue(0);
  const [countDown, setCountDown] = useState(null)
  const dispatch = useDispatch()




  const NotificationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: panY.value,
        },
      ],
    };
  });



  const onPanEnd = () => {
    if (panY.value < -20){
        panY.value = withTiming(-100, {duration: 300})
    }else{
        panY.value = withTiming(0,{duration: 300})
        setTimer(3000)

    }
  }



  const setTimer = (time) => {
    const timeout = setTimeout(() => {
        panY.value = withTiming(-100,{duration: 300});
        setTimeout(() => {
          dispatch(setSystemMessage(null))
        },( time ? time : selectedType?.timer) + 400)
      }, time ? time : selectedType?.timer);
      setCountDown(timeout)
    
  }

  const onGestureEvent = (e) => {
    const translateY = e.nativeEvent.translationY
    if (translateY > 0){
        panY.value = Math.log2(translateY)
    }else{
        panY.value = translateY
    }
  }


 



  useEffect(() => {
    if (data) {
      setNotificationType(setSelectedType, data, dispatch)
      panY.value = withTiming(0, {duration: 300});
      setTimer()
    }
  }, [data]);


 const onGestureBegin = () => {
    clearTimeout(countDown)
  }

  return (
    <>
      {data ? (
        <Animated.View
          style={[
            {
              width: "90%",
              backgroundColor: selectedType?.backgroundColor,
              alignSelf: "center",
              borderRadius: 10,
              position: "absolute",
              justifyContent:'center',
              paddingVertical:10,
              top: 50,
              zIndex: 1,
            },
            NotificationStyle,
          ]}
        >
          <GestureHandlerRootView>
            <PanGestureHandler
                onActivated={onGestureBegin}
                onEnded={onPanEnd}
                onGestureEvent={onGestureEvent}
            >
                <Pressable
                    style={{ flexDirection: "row",paddingHorizontal: 10, alignItems: "center", justifyContent:'space-between'}}
                >
                  <View style={{flexDirection: "row",alignItems:'center'}}>
                   <View style={{paddingRight:10}}>
                      {selectedType?.icon}
                    </View>
                    <View>
                      <Text
                          style={{
                          color:selectedType?.text,
                          fontWeight: "bold",
                          }}
                      >
                          {data.message}
                      </Text>
                    </View>

                  </View>
                    {/* <View style={{paddingRight:10}}>
                      {selectedType?.action}
                    </View> */}
                </Pressable>
            </PanGestureHandler>
          </GestureHandlerRootView>
        </Animated.View>
      ) : null}
    </>
  );
};
