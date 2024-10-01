import axios from "axios";
import React from "react";
import { Dimensions, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";





async function textSearchPlace(query) {
    const apiKey = 'AIzaSyBepa0FXkdVrf36i_0cgj1C4oJV-uf7qrs';  // Replace with your actual Google API key
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
  
    try {
      const response = await axios.get(url, {
        params: {
          query: query,  // The text to search for (e.g., "restaurants in New York")
          key: apiKey
        }
      });
  
      // Log the entire response
  
      // Process and log the place details
      const results = response.data.results;
      
  
      return results;  // Return the results in case you need them elsewhere
    } catch (error) {
      console.error('Error fetching text search data:', error);
    }
  }

const SearchComponent = () => {
    const insets = useSafeAreaInsets()
    const [query, setQuery] = React.useState('')
    const [locations, setLocations] = React.useState([])

    const queryLocation = async (text: string) => {
        const _ = await textSearchPlace(text)
        setLocations(_)
    }

    React.useEffect(() => {
        if (query.length){
            queryLocation(query)
        }
    },[query])

    return  <View style={{position:'absolute', height:'100%', width:'100%', backgroundColor:'white',}}>
    <TextInput placeholder="Search places"  onChangeText={setQuery} style={{backgroundColor:'white', width:Dimensions.get('window').width * 0.7, padding:10, borderRadius:10, marginTop:insets.top}}/>
    <ScrollView>
        {locations.map((location) => {
            return <View style={{padding:10}}>
                <Text >{location.name}</Text>
                <Text >{location.formatted_address}</Text>
            </View>
        })}
    </ScrollView>
  </View>
}

export default SearchComponent