import {
  SplashScreen,
  router,
  useNavigation,
  useRootNavigation,
  useRootNavigationState,
  useSegments,
} from "expo-router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthenticated,
  selectAuthenticated,
  selectProfile,
  setProfile,
} from "../redux/slices/userSlice";

const AuthContext = React.createContext(null);
SplashScreen.preventAutoHideAsync();

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user, authenticated, rootNavigation, navigation) {
  const segments = useSegments();

  React.useEffect(() => {
    // hacky fix ...
    if (rootNavigation?.key) {
      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !authenticated
      ) {
        // Redirect to the sign-in page.
        router.replace("/(auth)/landing");
      } else if (user && authenticated) {
        // Redirect away from the sign-in page.
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)");
      }
    }

    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1500);
  }, [user, segments, rootNavigation, authenticated]);
}

const Provider = (props) => {
  const profile = useSelector(selectProfile);
  const loggedIn = useSelector(selectAuthenticated);
  const rootNavigationState = useRootNavigationState();
  const navigation = useNavigation();

  const { Provider: Prov } = AuthContext;

  console.warn(profile);
  console.warn(loggedIn);

  useProtectedRoute(profile, loggedIn, rootNavigationState, navigation);

  return <Prov>{props.children}</Prov>;
};

export default Provider;
