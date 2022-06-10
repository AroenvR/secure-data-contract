import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("FenService", {
    from: deployer,
    args: [],
    waitConfirmations: 1,
    log: true,
  });
};

func.tags = ["FenService"];

export default func;
