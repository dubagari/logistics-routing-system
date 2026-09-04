import { useEffect, useState } from "react";
import {
  Edit,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/hooks";

import {
  createDriverThunk,
  fetchAllDrivers,
  updateDriverThunk,
} from "../../redux/slices/driverSlice";

const Drivers = () => {
  const dispatch = useAppDispatch();

  const { token } = useAppSelector(
    (state) => state.auth
  );

  const [showAddDriver, setShowAddDriver] =
    useState(false);

  const {
    drivers,
    loading,
    error,
  } = useAppSelector(
    (state) => state.drivers
  );

  const [search, setSearch] = useState("");

  const [selectedDriver, setSelectedDriver] =
    useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    licenseNumber: "",
    vehicleType: "",
    vehicleNumber: "",
    vehicleModel: "",
    isActive: true,
  });

  // ========================================
  // Fetch Drivers
  // ========================================

  const loadDrivers = () => {
    if (!token) return;

    dispatch(fetchAllDrivers(token));
  };

  useEffect(() => {
    loadDrivers();
  }, [token]);

  // ========================================
  // Form Change
  // ========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // Create Driver
  // ========================================

  const handleCreateDriver = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!token) return;

    const result = await dispatch(
      createDriverThunk({
        token,
        driverData: form,
      })
    );

    if (
      createDriverThunk.fulfilled.match(result)
    ) {
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        licenseNumber: "",
        vehicleType: "",
        vehicleNumber: "",
        vehicleModel: "",
        isActive: true,
      });

      setShowAddDriver(false);
    }
  };

  // ========================================
  // Edit Driver
  // ========================================

  const handleEditDriver = (driver: any) => {
    setSelectedDriver(driver);

    setForm({
      name: driver.user?.name || "",
      email: driver.user?.email || "",
      phone: driver.user?.phone || "",
      password: "",
      licenseNumber:
        driver.licenseNumber || "",
      vehicleType:
        driver.vehicleType || "",
      vehicleNumber:
        driver.vehicleNumber || "",
      vehicleModel:
        driver.vehicleModel || "",
      isActive:
        driver.user?.isActive ?? true,
    });
  };

  // ========================================
  // Update Driver
  // ========================================

  const handleUpdateDriver = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!token || !selectedDriver) return;

    const driverData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      licenseNumber: form.licenseNumber,
      vehicleType: form.vehicleType,
      vehicleNumber: form.vehicleNumber,
      vehicleModel: form.vehicleModel,
      isActive: form.isActive,
    };

    const result = await dispatch(
      updateDriverThunk({
        token,
        driverId: selectedDriver._id,
        driverData,
      })
    );

    console.log(
      "UPDATE RESULT:",
      JSON.stringify(result, null, 2)
    );

    if (
      updateDriverThunk.fulfilled.match(result)
    ) {
      setSelectedDriver(null);

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        licenseNumber: "",
        vehicleType: "",
        vehicleNumber: "",
        vehicleModel: "",
        isActive: true,
      });
    }
  };

  // ========================================
  // Search
  // ========================================

  const filteredDrivers = drivers.filter(
    (driver) => {
      const name =
        driver.user?.name?.toLowerCase() || "";

      const email =
        driver.user?.email?.toLowerCase() || "";

      const phone =
        driver.user?.phone?.toLowerCase() || "";

      const searchText =
        search.toLowerCase();

      return (
        name.includes(searchText) ||
        email.includes(searchText) ||
        phone.includes(searchText)
      );
    }
  );

  // ========================================
  // Status Style
  // ========================================

  const getStatusStyle = (
    status?: string
  ) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700";

      case "inactive":
        return "bg-slate-100 text-slate-600";

      case "suspended":
        return "bg-red-50 text-red-700";

      case "available":
        return "bg-emerald-50 text-emerald-700";

      case "on_delivery":
        return "bg-blue-50 text-blue-700";

      case "offline":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">

      {/* ========================================
        Header
      ======================================== */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>
          <p className="text-sm font-medium text-blue-600">
            Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Drivers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your delivery drivers and
            their availability.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={loadDrivers}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
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

          <button
            onClick={() =>
              setShowAddDriver(true)
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />

            Add Driver
          </button>

        </div>
      </div>

      {/* ========================================
        Search
      ======================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative max-w-md">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500"
          />

        </div>

      </div>

      {/* ========================================
        Error
      ======================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ========================================
        Drivers Table
      ======================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <div>
            <h2 className="font-bold text-slate-900">
              All Drivers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredDrivers.length}{" "}
              {filteredDrivers.length === 1
                ? "driver"
                : "drivers"}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserRound size={20} />
          </div>

        </div>

        {/* Loading */}

        {loading && (
          <div className="flex justify-center p-12">
            <RefreshCw
              size={28}
              className="animate-spin text-blue-600"
            />
          </div>
        )}

        {/* Empty */}

        {!loading &&
          filteredDrivers.length === 0 && (
            <div className="flex flex-col items-center justify-center p-16 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <UserRound size={30} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-700">
                No drivers found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Add a driver to get started.
              </p>

            </div>
          )}

        {/* Table */}

        {!loading &&
          filteredDrivers.length > 0 && (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Driver
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Vehicle
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Availability
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

                  {filteredDrivers.map(
                    (driver) => (
                      <tr
                        key={driver._id}
                        className="border-b border-slate-50 transition hover:bg-slate-50"
                      >

                        {/* Driver */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                              {driver.user?.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "D"}
                            </div>

                            <div>

                              <p className="font-semibold text-slate-800">
                                {driver.user?.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                Driver
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Contact */}

                        <td className="px-6 py-5">

                          <div className="space-y-1">

                            <div className="flex items-center gap-2 text-sm text-slate-600">

                              <Mail
                                size={14}
                                className="text-slate-400"
                              />

                              {driver.user?.email}

                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-400">

                              <Phone size={14} />

                              {driver.user?.phone ||
                                "No phone"}

                            </div>

                          </div>

                        </td>

                        {/* Vehicle */}

                        <td className="px-6 py-5">

                          <div>

                            <p className="text-sm font-medium text-slate-700">
                              {driver.vehicleModel ||
                                driver.vehicleType ||
                                "Vehicle"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {driver.vehicleNumber ||
                                "No vehicle number"}
                            </p>

                          </div>

                        </td>

                        {/* Availability */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                              driver.isAvailable
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {driver.isAvailable
                              ? "Available"
                              : "Unavailable"}
                          </span>

                        </td>

                        {/* Account Status */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                              driver.user?.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {driver.user?.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </td>

                        {/* Actions */}

                        <td className="px-6 py-5">

                          <button
                            onClick={() =>
                              handleEditDriver(
                                driver
                              )
                            }
                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:cursor-pointer hover:bg-slate-100"
                          >
                            <Edit size={15} />

                            Edit
                          </button>

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
        Add Driver Modal
      ======================================== */}

      {showAddDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Add Driver
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new driver account and
                  profile.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowAddDriver(false)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleCreateDriver}
              className="space-y-6 p-6"
            >

              {/* Personal Information */}

              <div>

                <h3 className="mb-4 text-sm font-bold text-slate-800">
                  Personal Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Temporary password"
                    required
                    minLength={6}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                </div>

              </div>

              {/* Driver Information */}

              <div>

                <h3 className="mb-4 text-sm font-bold text-slate-800">
                  Driver Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                  <input
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    placeholder="License number"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <input
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    placeholder="Vehicle type (e.g. Van)"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <input
                    name="vehicleNumber"
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    placeholder="Vehicle number"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <input
                    name="vehicleModel"
                    value={form.vehicleModel}
                    onChange={handleChange}
                    placeholder="Vehicle model"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                </div>

              </div>

              {/* Actions */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddDriver(false)
                  }
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading && (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  Create Driver

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================================
        Edit Driver Modal
      ======================================== */}

      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Edit Driver
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update driver information.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedDriver(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleUpdateDriver}
              className="space-y-6 p-6"
            >

              {/* Personal Information */}

              <div>

                <h3 className="mb-4 text-sm font-bold text-slate-800">
                  Personal Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  {/* Account Status */}

                  <select
                    value={String(form.isActive)}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isActive:
                          e.target.value ===
                          "true",
                      }))
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="true">
                      Active
                    </option>

                    <option value="false">
                      Inactive
                    </option>
                  </select>

                </div>

              </div>

              {/* Driver Information */}

              <div>

                <h3 className="mb-4 text-sm font-bold text-slate-800">
                  Driver Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">

                  <input
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    placeholder="License number"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <input
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    placeholder="Vehicle type"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <input
                    name="vehicleNumber"
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    placeholder="Vehicle number"
                    required
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <input
                    name="vehicleModel"
                    value={form.vehicleModel}
                    onChange={handleChange}
                    placeholder="Vehicle model"
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                </div>

              </div>

              {/* Actions */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedDriver(null)
                  }
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Drivers;