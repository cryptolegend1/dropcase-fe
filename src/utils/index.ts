export const formatAddress = (addr: string) => {
  if (addr) {
    return `${addr.slice(0, 6)}...${addr.slice(addr.length - 4, addr.length)}`;
  }
  return "";
};

export const classNames = (...classes: string[]) =>
  classes.filter(Boolean).join(" ");

export const toHex = (num: Number) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

export const callAndReturn = async ({
  contractInstance,
  contractMethod,
  contractCaller,
  contractParams = [],
  callValue = "0",
}: {
  contractInstance: any;
  contractMethod: any;
  contractCaller: any;
  contractParams: any[];
  callValue?: string;
}) => {
  const returnValue = await contractInstance
    .connect(contractCaller)
    .callStatic[contractMethod](...contractParams, { value: callValue });
  const tx = await contractInstance
    .connect(contractCaller)
    [contractMethod](...contractParams, { value: callValue });
  const receipt = await tx.wait();
  console.log(contractMethod, receipt.gasUsed);
  return returnValue;
};

export default { formatAddress };
