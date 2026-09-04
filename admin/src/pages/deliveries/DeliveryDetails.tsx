import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Package, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppSelector } from "../../redux/hooks";
import { getAdminDeliveryById } from "../../services/deliveryService";

import type { Delivery } from "../../types/Delivery";

const DeliveryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { token } = useAppSelector(
    (state) => state.auth
  );

  const [delivery, setDelivery] =
    useState<Delivery | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ========================================
  // Fetch Delivery
  // ========================================

  const loadDelivery = async () => {
    if (!token || !id) return;

    setLoading(true);
    setError(null);

    try {
      const data =
        await getAdminDeliveryById(
          token,
          id
        );

      setDelivery(data.delivery);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load delivery"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDelivery();
  }, [token, id]);

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <RefreshCw
          size={30}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  // ========================================
  // Error
  // ========================================

  if (error) {
    return (
      <div className="space-y-4">

        <button
          onClick={() => navigate("/deliveries")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Deliveries
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>

      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="space-y-4">

        <button
          onClick={() => navigate("/deliveries")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Deliveries
        </button>

        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          Delivery not found.
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <button
            onClick={() => navigate("/deliveries")}
            className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Deliveries
          </button>

          <p className="text-sm font-medium text-blue-600">
            Delivery
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Delivery Details
          </h1>
        </div>

        <button
          onClick={loadDelivery}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>

      {/* Customer */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Package size={20} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Customer
            </h2>

            <p className="text-sm text-slate-500">
              Delivery requester
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Name
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {delivery.customer?.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Email
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {delivery.customer?.email}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Phone
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {delivery.customer?.phone ||
                "No phone"}
            </p>
          </div>

        </div>

      </div>

      {/* Driver */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 font-bold text-slate-900">
          Driver
        </h2>

        {delivery.driver ? (
          <div className="grid gap-5 md:grid-cols-3">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Name
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {delivery.driver.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {delivery.driver.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Phone
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {delivery.driver.phone ||
                  "No phone"}
              </p>
            </div>

          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No driver assigned.
          </p>
        )}

      </div>

      {/* Locations */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Pickup */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MapPin size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Pickup Location
              </h2>

              <p className="text-sm text-slate-500">
                Where the package is collected
              </p>
            </div>

          </div>

          <p className="mt-5 text-sm leading-6 text-slate-700">
            {delivery.pickupLocation.address}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-slate-400">
                Latitude
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {delivery.pickupLocation.latitude}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Longitude
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {delivery.pickupLocation.longitude}
              </p>
            </div>

          </div>

        </div>

        {/* Destination */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <MapPin size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Destination
              </h2>

              <p className="text-sm text-slate-500">
                Where the package is delivered
              </p>
            </div>

          </div>

          <p className="mt-5 text-sm leading-6 text-slate-700">
            {delivery.deliveryLocation.address}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-slate-400">
                Latitude
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {delivery.deliveryLocation.latitude}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Longitude
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {delivery.deliveryLocation.longitude}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Delivery Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 font-bold text-slate-900">
          Delivery Information
        </h2>

        <div className="grid gap-5 md:grid-cols-4">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>

            <p className="mt-1 font-semibold capitalize text-slate-800">
              {delivery.status.replace(
                "_",
                " "
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Distance
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {delivery.distance
                ? `${delivery.distance} km`
                : "Not selected"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Estimated Time
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {delivery.estimatedTime
                ? `${delivery.estimatedTime} min`
                : "Not selected"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Created
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {new Date(
                delivery.createdAt
              ).toLocaleString()}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DeliveryDetails;