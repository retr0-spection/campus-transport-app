import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"



export const setNotificationType = (setType,data, dispatcher) => {
    const types = {
        info: {
          timer : 5000,
          backgroundColor: 'white',
          text: 'black',
          icon: <FontAwesome5Icon name="bell" size={18} color={'black'} />
        },
        success:  {
          timer : 5000,
          backgroundColor: 'white',
          text: 'black',
          icon: <FontAwesome5Icon name="bell" size={18} color={'black'} />
        },
        warning: {
          timer : 5000,
          backgroundColor: '#f08605',
          text: 'white',
          icon: <FontAwesome5Icon name="bell" size={18} color={'white'} />
        },
        danger: {
          timer : 5000,
          backgroundColor: 'crimson',
          text: 'white',
          icon: <FontAwesome5Icon name="bell" size={18} color={'white'} />
        },
      }

      const _type = types[data.type]

      if (_type){
          setType(types[data.type]);
          console.warn(data, 'founfd')
      }else{
        // no type found default to info
        setType(types.info)
        console.warn('No type found')
      }

}