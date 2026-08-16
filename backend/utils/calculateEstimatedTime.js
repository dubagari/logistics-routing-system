// ========================================
// Calculate Estimated Delivery Time
// ========================================

export const calculateEstimatedTime = (  distance, averageSpeed = 30 ) => {
  if (!Number.isFinite(distance) || distance < 0 || !Number.isFinite(averageSpeed) || averageSpeed <= 0) {
    return 0;
  }

  // Convert hours to minutes
  const timeInMinutes = (distance / averageSpeed) * 60;

  return Math.ceil(timeInMinutes);
};