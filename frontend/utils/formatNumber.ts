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

export const formatNumberWithSuffix = (value: string) => {
  if (value.endsWith("%")) return value;

  const num = parseFloat(value);
  const suffix = value.includes("veSONYA") ? "veSONYA" : "SONYA";

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}m ${suffix}`;
  }

  return `${new Intl.NumberFormat("en-US").format(num)} ${suffix}`;
};
