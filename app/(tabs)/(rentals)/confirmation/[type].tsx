import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  useColorScheme,
  Dimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Bicycle from "../../../../assets/images/bicycle.png";
import Skateboard from "../../../../assets/images/skateboard.png";
import ScooterImage from "../../../../assets/images/scooter.png";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Paystack } from "react-native-paystack-webview";
import { TouchableOpacity } from "react-native-gesture-handler";
import ActionSheet from "react-native-actions-sheet";
import { useSelector } from "react-redux";
import { selectProfile } from "@/redux/slices/userSlice";
import API from "@/api";
import { Colors } from "@/constants/Colors";
import QRCode from "react-native-qrcode-svg";
import SelectDropdown from "react-native-select-dropdown";

const BicycleRentalScreen = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();
  const ref = React.useRef();
  const modalRef = React.useRef();
  const qrCodeModalRef = React.useRef();
  const profile = useSelector(selectProfile);
  const { type } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [vehicle, setVehicle] = useState({
    name: "Bicycle",
    image: Bicycle,
    available: true,
    units: 25,
    route: "/(rentals)/confirmation",
    price: 10,
  });
  const [count, setCount] = React.useState(0);
  const [rentalStations, setRentalStations] = React.useState([
    "Bozolli",
    "Matrix",
  ]);
  const [qrCode, setQRCode] = React.useState(null);
  const [selectedRentalStation, setSelectedRentalStation] = React.useState(
    rentalStations[0]
  );
  const colorScheme = useColorScheme();
  const pay = () => {
    ref.current.startTransaction();
  };

  const _getRentalStations = async () => {
    const config = {
      headers: {
        Authorization: "Bearer " + profile.token,
      },
    };
    const _ = await API.V1.Rental.GetRentalStations(config);
    const stations = _.map((item) => item.name)
    setRentalStations(stations);
    setSelectedRentalStation(stations[0]);
  };

  const _createTempRentalObject = async () => {
    const config = {
      headers: {
        Authorization: "Bearer " + profile.token,
      },
    };
    const payload = {
      type,
      station: selectedRentalStation,
    };
    const response = await API.V1.Rental.CreateRentalObject(payload, config);
    setQRCode(response);
    qrCodeModalRef.current.show();
    modalRef.current.hide();
  };

  const getVehicle = async () => {
    const config = {
      headers: {
        Authorization: "Bearer " + profile.token,
      },
    };
    const vehicle = await API.V1.Rental.GetVehicleByType(type, config);
    setVehicle(vehicle);
  };

  const getStationVehicles = async (station) => {
    const config = {
      headers: {
        Authorization: "Bearer " + profile.token,
      },
    };
    const vehicle = await API.V1.Rental.GetStationVehicles(station, config);
    const filteredVehicles = vehicle.filter((_) => type == _.type);
    setCount(filteredVehicles.length);
  };

  React.useEffect(() => {
    getStationVehicles(selectedRentalStation);
  }, [selectedRentalStation]);

  React.useEffect(() => {
    modalRef.current.show();
    getVehicle();
    _getRentalStations();
    
  }, []);

  const imageToRender = (type: string) => {
    if (type == "Scooter") {
      return ScooterImage;
    } else if (type == "Bicycle") {
      return Bicycle;
    } else if ("Skateboard") {
      return Skateboard;
    }
  };

  const image = imageToRender(type);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <View style={[styles.header]}>
        <TouchableOpacity onPress={router.back}>
          <Text
            style={[
              styles.backButton,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            ←
          </Text>
        </TouchableOpacity>
        <Text
          style={[styles.title, { color: Colors[colorScheme ?? "light"].text }]}
        >
          {type}
        </Text>
      </View>
      <Image source={image} style={styles.bicycleImage} resizeMode="contain" />
      <ActionSheet
        ref={qrCodeModalRef}
        containerStyle={{ height: "60%", backgroundColor: "#1a237e" }}
      >
        <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 20,
              color: "white",
              fontWeight: "bold",
              marginVertical: 20,
              paddingHorizontal: 20,
            }}
          >
            Show this QR Code to scanner to unlock a {type}
          </Text>
          <QRCode
            value="http://awesome.link.qr"
            size={Dimensions.get("window").width * 0.8}
          />
        </View>
      </ActionSheet>
      <ActionSheet
        ref={modalRef}
        containerStyle={{ height: "10%", backgroundColor: "#1a237e" }}
        backgroundInteractionEnabled
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SelectDropdown
              data={rentalStations}
              onSelect={(selectedItem, index) => {
                setSelectedRentalStation(selectedItem);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <TouchableOpacity style={styles.locationContainer}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.locationText}>
                      {selectedRentalStation}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View style={styles.locationContainer}>
                    <Text style={styles.locationText}>{item}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{
                backgroundColor: Colors[colorScheme].background,
                padding: 10,
                borderRadius: 10,
              }}
            />
            <View style={styles.availabilityContainer}>
              <Text style={styles.availabilityLabel}>Availability:</Text>
              <Text style={styles.availabilityValue}>
                {count} units available
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Rental Price:</Text>
              <Text style={styles.priceValue}>R{vehicle.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.rentButton}
              onPress={pay}
              disabled={!count}
            >
              <Text style={styles.rentButtonText}>Rent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ActionSheet>
      <Paystack
        ref={ref}
        paystackKey="pk_test_4cc7003e0c4e33e880efd904f53bb4963cca5441"
        amount={vehicle.price}
        currency="ZAR"
        billingEmail={profile.email}
        activityIndicatorColor="#093574"
        onCancel={(e) => {
          // handle response here
        }}
        onSuccess={(res) => {
          // handle response here
          _createTempRentalObject();
        }}
      />
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    fontSize: 24,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bicycleImage: {
    width: "100%",
    height: "50%",
  },
  modalContainer: {
    justifyContent: "flex-end",
    height: "100%",
  },
  modalContent: {
    backgroundColor: "#1a237e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  locationText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  availabilityContainer: {
    marginBottom: 16,
  },
  availabilityLabel: {
    color: "white",
    fontSize: 16,
  },
  availabilityValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    // justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
  },
  priceLabel: {
    color: "white",
    fontSize: 16,
  },
  priceValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  rentButton: {
    backgroundColor: "#ffa000",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  rentButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BicycleRentalScreen;
