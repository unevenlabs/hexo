import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers, network } from "hardhat";

import { deployContract } from "../src/deployment";
import { namehash } from "../src/utils";

const { id, parseEther } = ethers.utils;

describe("Hexo", () => {
  let deployer: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;
  let peter: SignerWithAddress;

  let ens: Contract;
  let hexo: Contract;

  let price: BigNumber;
  let baseURI: string;

  beforeEach(async () => {
    // Initialize accounts
    [deployer, alice, bob, carol] = await ethers.getSigners();

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

    price = parseEther("0.08");
    baseURI = "https://hexo.eth/token";

    // Deploy Hexo contract
    hexo = await deployContract({
      name: "Hexo",
      from: deployer,
      args: [price, baseURI],
    });

    // Transfer "hexo.eth" ownership from Peter to Hexo contract
    await ens.connect(peter).setOwner(namehash(["hexo", "eth"]), hexo.address);
  });

  afterEach(async () => {
    // Reset the state
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: (network.config as any).forking.url,
            blockNumber: (network.config as any).forking.blockNumber,
          },
        },
      ],
    });
  });

  it("buy", async () => {
    await hexo.connect(alice).buy(["red"], ["dragon"], { value: price });

    const tokenId = BigNumber.from(id("reddragon"));
    expect(await hexo.ownerOf(tokenId)).to.be.equal(alice.address);

    const node = namehash(["reddragon", "hexo", "eth"]);
    expect(await ens.owner(node)).to.be.equal(alice.address);
  });

  it("buy multiple items in a single transaction", async () => {
    await hexo
      .connect(alice)
      .buy(["red", "green"], ["dragon", "turtle"], { value: price.mul(2) });

    expect(await hexo.ownerOf(BigNumber.from(id("reddragon")))).to.be.equal(
      alice.address
    );
    expect(await hexo.ownerOf(BigNumber.from(id("greenturtle")))).to.be.equal(
      alice.address
    );
  });

  it("cannot buy for lower price", async () => {
    await expect(
      hexo
        .connect(alice)
        .buy(["red", "green"], ["dragon", "turtle"], {
          value: price.mul(2).sub(1),
        })
    ).to.be.revertedWith("Insufficient amount");
  });

  it("cannot buy the same item twice", async () => {
    await hexo.connect(alice).buy(["red"], ["dragon"], { value: price });

    await expect(
      hexo.connect(alice).buy(["red"], ["dragon"], { value: price })
    ).to.be.revertedWith("ERC721: token already minted");
  });

  it("cannot buy items that were not added", async () => {
    await expect(
      hexo.connect(alice).buy(["color"], ["dragon"], { value: price })
    ).to.be.revertedWith("Color not added");

    await expect(
      hexo.connect(alice).buy(["red"], ["object"], { value: price })
    ).to.be.revertedWith("Object not added");
  });

  it("transferring changes ENS subdomain ownership", async () => {
    await hexo.connect(alice).buy(["red"], ["dragon"], { value: price });

    const node = namehash(["reddragon", "hexo", "eth"]);
    await ens.connect(alice).setOwner(node, bob.address);
    expect(await ens.owner(node)).to.be.equal(bob.address);

    const tokenId = BigNumber.from(id("reddragon"));
    await hexo
      .connect(alice)
      .transferFrom(alice.address, carol.address, tokenId);
    expect(await ens.owner(node)).to.be.equal(carol.address);
  });

  it("owner of an item can set the token URI", async () => {
    await hexo.connect(alice).buy(["red"], ["dragon"], { value: price });
    await hexo.connect(bob).buy(["green"], ["turtle"], { value: price });

    const tokenIdAlice = BigNumber.from(id("reddragon"));
    expect(await hexo.tokenURI(tokenIdAlice)).to.be.equal(
      baseURI + tokenIdAlice.toString()
    );

    const tokenURIAlice = "https://alice.eth/my-token";
    await hexo.connect(alice).setTokenURI(tokenIdAlice, tokenURIAlice);
    expect(await hexo.tokenURI(tokenIdAlice)).to.be.equal(tokenURIAlice);

    const tokenIdBob = BigNumber.from(id("greenturtle"));
    expect(await hexo.tokenURI(tokenIdBob)).to.be.equal(
      baseURI + tokenIdBob.toString()
    );
  });

  it("contract admin can claim earnings", async () => {
    await hexo.connect(alice).buy(["red"], ["dragon"], { value: price });
    await hexo.connect(bob).buy(["green"], ["turtle"], { value: price });

    const balanceBefore = await carol.getBalance();
    await hexo.connect(deployer).claim(carol.address, price.mul(2));
    const balanceAfter = await carol.getBalance();

    expect(balanceAfter.sub(balanceBefore)).to.be.equal(price.mul(2));
  });
});
