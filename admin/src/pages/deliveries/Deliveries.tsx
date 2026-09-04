import { useEffect, useState } from "react";
import {
  Eye,
  MapPin,
  Package,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/hooks";

import {
  fetchAllDeliveries,
  assignDriverThunk,
} from "../../redux/slices/deliverySlice";

import {
  getAllDrivers,
} from "../../services/driverService";

import type {
  DeliveryStatus,
} from "../../types/Delivery";

import type {
  Driver,
} from "../../services/driverService";
import { useNavigate } from "react-router-dom";

const Deliveries = () => {

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { token } = useAppSelector(
    (state) => state.auth
  );

  const {
    deliveries,
    loading,
    error,
  } = useAppSelector(
    (state) => state.deliveries
  );

  // ========================================
  // Filters
  // ========================================

  const [status, setStatus] =
    useState<DeliveryStatus | "all">("all");

  const [search, setSearch] =
    useState("");

  // ========================================
  // Assignment State
  // ========================================

  const [showAssignModal, setShowAssignModal] =
    useState(false);

  const [selectedDeliveryId, setSelectedDeliveryId] =
    useState<string | null>(null);

  const [drivers, setDrivers] =
    useState<Driver[]>([]);

  const [selectedDriverId, setSelectedDriverId] =
    useState("");

  const [driversLoading, setDriversLoading] =
    useState(false);

  const [assigning, setAssigning] =
    useState(false);

  const [assignError, setAssignError] =
    useState<string | null>(null);

  // ========================================
  // Fetch Deliveries
  // ========================================

  const loadDeliveries = () => {
    if (!token) return;

    dispatch(
      fetchAllDeliveries({
        token,
        status:
          status === "all"
            ? undefined
            : status,
      })
    );
  };

  useEffect(() => {
    loadDeliveries();
  }, [status, token]);

  // ========================================
  // Search Filter
  // ========================================

  const filteredDeliveries =
    deliveries.filter((delivery) => {
      const searchText =
        search.toLowerCase();

      return (
        delivery.customer?.name
          ?.toLowerCase()
          .includes(searchText) ||
        delivery.customer?.email
          ?.toLowerCase()
          .includes(searchText) ||
        delivery.pickupLocation?.address
          ?.toLowerCase()
          .includes(searchText) ||
        delivery.deliveryLocation?.address
          ?.toLowerCase()
          .includes(searchText)
      );
    });

  // ========================================
  // Status Style
  // ========================================

  const getStatusStyle = (
    deliveryStatus: DeliveryStatus
  ) => {
    switch (deliveryStatus) {
      case "pending":
        return "bg-amber-50 text-amber-700";

      case "assigned":
        return "bg-purple-50 text-purple-700";

      case "accepted":
        return "bg-blue-50 text-blue-700";

      case "in_transit":
        return "bg-cyan-50 text-cyan-700";

      case "delivered":
        return "bg-emerald-50 text-emerald-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // ========================================
  // Open Assign Modal
  // ========================================

  const handleOpenAssignModal = async (
    deliveryId: string
  ) => {
    if (!token) return;

    setSelectedDeliveryId(deliveryId);
    setSelectedDriverId("");
    setAssignError(null);
    setShowAssignModal(true);
    setDriversLoading(true);

    try {
      const data =
        await getAllDrivers(token);

      const availableDrivers =
        data.drivers.filter(
          (driver) =>
            driver.user?.isActive &&
            driver.isAvailable &&
            driver.status === "available"
        );

      setDrivers(availableDrivers);
    } catch (error) {
      setAssignError(
        error instanceof Error
          ? error.message
          : "Failed to load available drivers"
      );
    } finally {
      setDriversLoading(false);
    }
  };

  // ========================================
  // Close Assign Modal
  // ========================================

  const handleCloseAssignModal = () => {
    if (assigning) return;

    setShowAssignModal(false);
    setSelectedDeliveryId(null);
    setSelectedDriverId("");
    setAssignError(null);
  };

  // ========================================
  // Assign Driver
  // ========================================

  const handleAssignDriver = async () => {
    if (
      !token ||
      !selectedDeliveryId ||
      !selectedDriverId
    ) {
      return;
    }

    setAssigning(true);
    setAssignError(null);

    try {
      await dispatch(
        assignDriverThunk({
          token,
          deliveryId: selectedDeliveryId,
          driverId: selectedDriverId,
        })
      ).unwrap();

      handleCloseAssignModal();
    } catch (error) {
      setAssignError(
        typeof error === "string"
          ? error
          : "Failed to assign driver"
      );
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Operations
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Deliveries
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and monitor all delivery requests.
          </p>
        </div>

        <button
          onClick={loadDeliveries}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">

        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search customer or location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as
                | DeliveryStatus
                | "all"
            )
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="all">
            All Statuses
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="assigned">
            Assigned
          </option>

          <option value="accepted">
            Accepted
          </option>

          <option value="in_transit">
            In Transit
          </option>

          <option value="delivered">
            Delivered
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Deliveries Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="font-bold text-slate-900">
              All Deliveries
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredDeliveries.length}{" "}
              {filteredDeliveries.length === 1
                ? "delivery"
                : "deliveries"}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Package size={20} />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center p-10">
            <RefreshCw
              className="animate-spin text-blue-600"
              size={28}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          filteredDeliveries.length === 0 && (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Package size={30} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-700">
                No deliveries found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Delivery requests will appear here.
              </p>
            </div>
          )}

        {/* Table */}
        {!loading &&
          filteredDeliveries.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Pickup
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Destination
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Driver
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {filteredDeliveries.map(
                    (delivery) => (
                      <tr
                        key={delivery._id}
                        className="border-b border-slate-50 transition hover:bg-slate-50"
                      >

                        {/* Customer */}
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-800">
                            {delivery.customer?.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {delivery.customer?.email}
                          </p>
                        </td>

                        {/* Pickup */}
                        <td className="px-6 py-5">
                          <div className="flex max-w-[220px] items-start gap-2">
                            <MapPin
                              size={16}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />

                            <span className="text-sm text-slate-600">
                              {
                                delivery
                                  .pickupLocation
                                  ?.address
                              }
                            </span>
                          </div>
                        </td>

                        {/* Destination */}
                        <td className="px-6 py-5">
                          <div className="flex max-w-[220px] items-start gap-2">
                            <MapPin
                              size={16}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />

                            <span className="text-sm text-slate-600">
                              {
                                delivery
                                  .deliveryLocation
                                  ?.address
                              }
                            </span>
                          </div>
                        </td>

                        {/* Driver */}
                        <td className="px-6 py-5">
                          {delivery.driver ? (
                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                {delivery.driver.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {delivery.driver.phone ||
                                  "No phone"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              Not assigned
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                              delivery.status
                            )}`}
                          >
                            {delivery.status.replace(
                              "_",
                              " "
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">

                            {/* Assign */}
                            {delivery.status ===
                              "pending" && (
                              <button
                                onClick={() =>
                                  handleOpenAssignModal(
                                    delivery._id
                                  )
                                }
                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                              >
                                Assign
                              </button>
                            )}

                            {/* View */}
                          <button
  onClick={() =>
    navigate(
      `/deliveries/${delivery._id}`
    )
  }
  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
>
                              <Eye size={16} />

                              View
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}

      </div>

      {/* ========================================
          ASSIGN DRIVER MODAL
      ======================================== */}

      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Assign Driver
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select an available driver.
                </p>
              </div>

              <button
                onClick={handleCloseAssignModal}
                disabled={assigning}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>

            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-6">

              {assignError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {assignError}
                </div>
              )}

              {driversLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw
                    size={26}
                    className="animate-spin text-blue-600"
                  />
                </div>
              ) : drivers.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-5 text-center">
                  <p className="font-semibold text-slate-700">
                    No available drivers
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    There are currently no active
                    available drivers.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Available Driver
                  </label>

                  <select
                    value={selectedDriverId}
                    onChange={(e) =>
                      setSelectedDriverId(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                  >
                    <option value="">
                      Select a driver
                    </option>

                    {drivers.map((driver) => (
                      <option
                        key={driver._id}
                        value={driver._id}
                      >
                        {driver.user.name} —{" "}
                        {driver.vehicleType}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  onClick={handleCloseAssignModal}
                  disabled={assigning}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAssignDriver}
                  disabled={
                    assigning ||
                    !selectedDriverId ||
                    driversLoading ||
                    drivers.length === 0
                  }
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {assigning && (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {assigning
                    ? "Assigning..."
                    : "Assign Driver"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Deliveries;