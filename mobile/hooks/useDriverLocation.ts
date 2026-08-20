import { useEffect, useRef } from "react";
import * as Location from "expo-location";

interface UseDriverLocationProps {
  enabled: boolean;
  deliveryId: string | null;
  token: string | null;
  onLocationUpdate: (
    deliveryId: string,
    latitude: number,
    longitude: number
  ) => void;
}

export const useDriverLocation = ({
  enabled,
  deliveryId,
  token,
  onLocationUpdate,
}: UseDriverLocationProps) => {
  const subscriptionRef =
    useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let mounted = true;

    const startTracking = async () => {
      if (!enabled || !deliveryId || !token) {
        return;
      }

      console.log(
        "📍 Starting driver location tracking..."
      );

      // Request foreground permission
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        console.log(
          "❌ Location permission denied"
        );

        return;
      }

      console.log(
        "✅ Location permission granted"
      );

      // Get initial location
      const initialLocation =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.High,
        });

      if (mounted) {
        const {
          latitude,
          longitude,
        } = initialLocation.coords;

        console.log(
          "📍 Initial location:",
          latitude,
          longitude
        );

        onLocationUpdate(
          deliveryId,
          latitude,
          longitude
        );
      }

      // Watch location changes
      subscriptionRef.current =
        await Location.watchPositionAsync(
          {
            accuracy:
              Location.Accuracy.High,

            timeInterval: 10000,

            distanceInterval: 20,
          },

          (location) => {
            if (!mounted) {
              return;
            }

            const {
              latitude,
              longitude,
            } = location.coords;

            console.log(
              "📍 Driver location:",
              latitude,
              longitude
            );

            onLocationUpdate(
              deliveryId,
              latitude,
              longitude
            );
          }
        );
    };

    startTracking();

    return () => {
      mounted = false;

      if (subscriptionRef.current) {
        console.log(
          "🛑 Stopping driver location tracking"
        );

        subscriptionRef.current.remove();

        subscriptionRef.current = null;
      }
    };
  }, [
    enabled,
    deliveryId,
    token,
    onLocationUpdate,
  ]);
};