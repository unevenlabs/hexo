import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { BigNumber, BigNumberish, Contract } from "ethers";
import { ethers, network } from "hardhat";
import MerkleTree from "merkletreejs";

import { deployContract } from "../src/deployment";
import { constructMerkleTree } from "../src/merkletree";
import { namehash } from "../src/utils";

import colors from "../data/colors.json";
import objects from "../data/objects.json";

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

  let colorsMerkleTree: MerkleTree;
  let objectsMerkleTree: MerkleTree;

  const buy = async (
    buyer: SignerWithAddress,
    colors: string[],
    objects: string[],
    options?: any
  ) => {
    return hexo.connect(buyer).buy(
      colors,
      colors.map((color) =>
        (options?.colorsMerkleTree || colorsMerkleTree).getHexProof(
          ethers.utils.id(color)
        )
      ),
      objects,
      objects.map((object) =>
        (options?.objectsMerkleTree || objectsMerkleTree).getHexProof(
          ethers.utils.id(object)
        )
      ),
      {
        value:
          options?.value || price.mul(Math.max(colors.length, objects.length)),
      }
    );
  };

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

    colorsMerkleTree = constructMerkleTree(colors);
    objectsMerkleTree = constructMerkleTree(objects);

    // Deploy Hexo contract
    hexo = await deployContract({
      name: "Hexo",
      from: deployer,
      args: [
        colorsMerkleTree.getHexRoot(),
        objectsMerkleTree.getHexRoot(),
        price,
        baseURI,
      ],
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
    await buy(alice, ["red"], ["dragon"]);

    const tokenId = BigNumber.from(id("reddragon"));
    expect(await hexo.ownerOf(tokenId)).to.be.equal(alice.address);

    const node = namehash(["reddragon", "hexo", "eth"]);
    expect(await ens.owner(node)).to.be.equal(alice.address);
  });

  it("buy multiple items in a single transaction", async () => {
    await buy(alice, ["red", "green"], ["dragon", "turtle"]);

    expect(await hexo.ownerOf(BigNumber.from(id("reddragon")))).to.be.equal(
      alice.address
    );
    expect(await ens.owner(namehash(["reddragon", "hexo", "eth"]))).to.be.equal(
      alice.address
    );
    expect(await hexo.ownerOf(BigNumber.from(id("greenturtle")))).to.be.equal(
      alice.address
    );
    expect(
      await ens.owner(namehash(["greenturtle", "hexo", "eth"]))
    ).to.be.equal(alice.address);
  });

  it("cannot buy for lower price", async () => {
    await expect(
      buy(alice, ["red", "green"], ["dragon", "turtle"], {
        value: price.mul(2).sub(1),
      })
    ).to.be.revertedWith("Insufficient amount");
  });

  it("cannot buy the same item twice", async () => {
    await buy(alice, ["red"], ["dragon"]);

    await expect(buy(alice, ["red"], ["dragon"])).to.be.revertedWith(
      "ERC721: token already minted"
    );

    await expect(
      buy(alice, ["green", "green"], ["turtle", "turtle"])
    ).to.be.revertedWith("ERC721: token already minted");
  });

  it("cannot buy items that were not added", async () => {
    await expect(buy(alice, ["color"], ["dragon"])).to.be.revertedWith(
      "Invalid color proof"
    );

    await expect(buy(alice, ["red"], ["object"])).to.be.revertedWith(
      "Invalid object proof"
    );

    await expect(buy(alice, ["dragon"], ["red"])).to.be.revertedWith(
      "Invalid color proof"
    );
  });

  it("invalid buy", async () => {
    await expect(buy(alice, ["red"], [])).to.be.revertedWith("Invalid input");
    await expect(buy(alice, [], ["dragon", "turtle"])).to.be.revertedWith(
      "Invalid input"
    );
  });

  it("transferring changes ENS subdomain ownership", async () => {
    await buy(alice, ["red"], ["dragon"]);

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
    await buy(alice, ["red"], ["dragon"]);
    await buy(bob, ["green"], ["turtle"]);

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

  it("admin can claim earnings", async () => {
    await buy(alice, ["red"], ["dragon"]);
    await buy(bob, ["green"], ["turtle"]);

    await expect(
      hexo.connect(alice).claim(alice.address, price.mul(2))
    ).to.be.revertedWith("Ownable: caller is not the owner");

    const balanceBefore = await carol.getBalance();
    await hexo.connect(deployer).claim(carol.address, price.mul(2));
    const balanceAfter = await carol.getBalance();

    expect(balanceAfter.sub(balanceBefore)).to.be.equal(price.mul(2));
  });

  it("admin can set new merkle roots for colors and objects", async () => {
    await expect(
      hexo.connect(alice).changeColorsMerkleRoot(ethers.utils.randomBytes(32))
    ).to.be.revertedWith("Ownable: caller is not the owner");
    await expect(
      hexo.connect(alice).changeObjectsMerkleRoot(ethers.utils.randomBytes(32))
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await expect(buy(alice, ["color"], ["object"])).to.be.revertedWith(
      "Invalid color proof"
    );

    console.log("1");

    const colorsMerkleTree = constructMerkleTree(["color"]);
    await hexo
      .connect(deployer)
      .changeColorsMerkleRoot(colorsMerkleTree.getHexRoot());

    console.log("2");

    await expect(
      buy(alice, ["color"], ["object"], { colorsMerkleTree })
    ).to.be.revertedWith("Invalid object proof");

    const objectsMerkleTree = constructMerkleTree(["object"]);
    await hexo
      .connect(deployer)
      .changeObjectsMerkleRoot(objectsMerkleTree.getHexRoot());

    await expect(
      buy(alice, ["red"], ["dragon"], { colorsMerkleTree })
    ).to.be.revertedWith("Invalid color proof");

    await buy(alice, ["color"], ["object"], {
      colorsMerkleTree,
      objectsMerkleTree,
    });
    expect(await hexo.ownerOf(BigNumber.from(id("colorobject")))).to.be.equal(
      alice.address
    );
  });
});
