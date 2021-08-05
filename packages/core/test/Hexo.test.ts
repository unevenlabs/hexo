import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, network } from "hardhat";

import { deployContract } from "../src/deployment";
import { namehash } from "../src/utils";

const { BigNumber } = ethers;
const { id, parseEther } = ethers.utils;

describe("Hexo", () => {
  let deployer: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;
  let peter: SignerWithAddress;

  let ens: Contract;
  let hexo: Contract;

  beforeEach(async () => {
    // Initialize accounts
    [deployer, alice, bob] = await ethers.getSigners();

    // Impersonate Peter
    const peterAddress = "0xD5c0D17cCb9071D27a4F7eD8255F59989b9aee0d";
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [peterAddress],
    });
    peter = await ethers.getSigner(peterAddress);

    // Send some ETH to Peter
    await deployer.sendTransaction({
      to: peterAddress,
      value: parseEther("1"),
    });

    // Initialize ENS registry
    const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
    ens = await ethers.getContractAt("ENS", ensAddress);

    // Deploy Hexo contract
    hexo = await deployContract({
      name: "Hexo",
      from: deployer,
    });

    // Transfer "hexo.eth" ownership from Peter to Hexo contract
    await ens.connect(peter).setOwner(namehash(["hexo", "eth"]), hexo.address);
  });

  afterEach(async () => {
    // Reset the state
    await network.provider.request({
      method: "hardhat_reset",
      params: [],
    });
  });

  it("buy", async () => {
    await hexo
      .connect(alice)
      .buy("red", "dragon", { value: parseEther("0.08") });

    const tokenId = BigNumber.from(id("reddragon"));
    expect(await hexo.ownerOf(tokenId)).to.be.equal(alice.address);

    const node = namehash(["reddragon", "hexo", "eth"]);
    expect(await ens.owner(node)).to.be.equal(alice.address);
  });

  it("transferring changes ENS subdomain ownership", async () => {
    await hexo
      .connect(alice)
      .buy("red", "dragon", { value: parseEther("0.08") });

    const node = namehash(["reddragon", "hexo", "eth"]);
    await ens.setOwner(node, bob.address);
    expect(await ens.owner(node)).to.be.equal(bob.address);

    const tokenId = BigNumber.from(id("reddragon"));
    await hexo
      .connect(alice)
      .transferFrom(alice.address, carol.address, tokenId);
    expect(await ens.owner(node)).to.be.equal(carol.address);
  });
});
