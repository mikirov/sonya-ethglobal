export const formatNumber = (number: number) => {
  if (number >= 1000000) {
    return (
      (number / 1000000).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + "m"
    );
  }
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
