export const useGetTotalStaked = async (stakingContract: any) => {
  const totalStaked = await stakingContract?.read.totalStaked();

  return totalStaked || "0";
};
