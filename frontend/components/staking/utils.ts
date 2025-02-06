export const formatNumber = (value: string) => {
  if (value.endsWith("%")) return value;

  const num = parseFloat(value);
  const suffix = value.includes("veSONYA") ? "veSONYA" : "SONYA";

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}m ${suffix}`;
  }

  return `${new Intl.NumberFormat("en-US").format(num)} ${suffix}`;
};
