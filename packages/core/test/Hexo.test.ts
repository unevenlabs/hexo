import { AddressZero } from "@ethersproject/constants";
import { id, namehash } from "@ethersproject/hash";
import { parseEther } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers, network } from "hardhat";

import { deployContract } from "../src/deployment";

import colors from "../data/colors.json";
import objects from "../data/objects.json";

describe("Hexo", () => {
  let deployer: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;
  let peter: SignerWithAddress;

  let ensRegistry: Contract;
  let ensPublicResolver: Contract;
  let hexo: Contract;

  let baseImageURI: string;
  let price: BigNumber;

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
    const ensRegistryAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
    ensRegistry = await ethers.getContractAt("IENS", ensRegistryAddress);

    // Initialize ENS public resolver
    const ensPublicResolverAddress =
      "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41";
    ensPublicResolver = await ethers.getContractAt(
      "IAddrResolver",
      ensPublicResolverAddress
    );

    price = parseEther("0.01");
    baseImageURI = "https://hexo.codes/image/";

    // Deploy Hexo contract
    hexo = await deployContract({
      name: "Hexo",
      from: deployer,
      args: [price, baseImageURI],
    });

    // Add initial colors and objects
    await hexo.connect(deployer).addColors(colors.map(id));
    await hexo.connect(deployer).addObjects(objects.map(id));

    // Transfer "hexo.eth" control from Peter to Hexo contract
    await ensRegistry
      .connect(peter)
      .setOwner(namehash("hexo.eth"), hexo.address);
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

  describe("mint", () => {
    it("mint single item", async () => {
      await hexo
        .connect(alice)
        .mintItems(["red"], ["dragon"], { value: price });

      const reddragonId = BigNumber.from(id("reddragon"));
      expect(await hexo.ownerOf(reddragonId)).to.be.equal(alice.address);
    });

    it("mint multiple items", async () => {
      await hexo
        .connect(alice)
        .mintItems(["red", "green"], ["dragon", "turtle"], {
          value: price.mul(2),
        });

      const reddragonId = BigNumber.from(id("reddragon"));
      expect(await hexo.ownerOf(reddragonId)).to.be.equal(alice.address);

      const greenturtleId = BigNumber.from(id("greenturtle"));
      expect(await hexo.ownerOf(greenturtleId)).to.be.equal(alice.address);
    });

    it("cannot mint for lower price", async () => {
      await expect(
        hexo
          .connect(alice)
          .mintItems(["red"], ["dragon"], { value: price.sub(1) })
      ).to.be.revertedWith("Insufficient amount");

      await expect(
        hexo.connect(alice).mintItems(["red", "green"], ["dragon", "turtle"], {
          value: price.mul(2).sub(1),
        })
      ).to.be.revertedWith("Insufficient amount");
    });

    it("cannot mint the same item twice", async () => {
      await hexo
        .connect(alice)
        .mintItems(["red"], ["dragon"], { value: price });

      await expect(
        hexo.connect(alice).mintItems(["red"], ["dragon"], { value: price })
      ).to.be.revertedWith("ERC721: token already minted");
    });

    it("cannot mint items that are not available", async () => {
      await expect(
        hexo.connect(alice).mintItems(["color"], ["dragon"], { value: price })
      ).to.be.revertedWith("Color not added");

      await expect(
        hexo.connect(alice).mintItems(["red"], ["object"], { value: price })
      ).to.be.revertedWith("Object not added");

      await expect(
        hexo.connect(alice).mintItems(["dragon"], ["red"], { value: price })
      ).to.be.revertedWith("Color not added");
    });

    it("properly handles invalid inputs", async () => {
      await expect(
        hexo.connect(alice).mintItems(["red"], [])
      ).to.be.revertedWith("Invalid input");
      await expect(
        hexo.connect(alice).mintItems([], ["dragon", "turtle"])
      ).to.be.revertedWith("Invalid input");
    });
  });

  describe("claim", () => {
    it("claim single item", async () => {
      await hexo
        .connect(alice)
        .mintItems(["red"], ["dragon"], { value: price });

      const reddragonId = BigNumber.from(id("reddragon"));
      await hexo.connect(alice).claimSubdomains([reddragonId]);

      const reddragonNamehash = namehash("reddragon.hexo.eth");
      expect(await ensRegistry.owner(reddragonNamehash)).to.be.equal(
        alice.address
      );
      expect(await ensRegistry.resolver(reddragonNamehash)).to.be.equal(
        ensPublicResolver.address
      );
      expect(await ensPublicResolver.addr(reddragonNamehash)).to.be.equal(
        alice.address
      );
    });

    it("claim multiple items", async () => {
      await hexo
        .connect(alice)
        .mintItems(["red", "green"], ["dragon", "turtle"], {
          value: price.mul(2),
        });

      const reddragonId = BigNumber.from(id("reddragon"));
      const greenturtleId = BigNumber.from(id("greenturtle"));
      await hexo.connect(alice).claimSubdomains([reddragonId, greenturtleId]);

      const reddragonNamehash = namehash("reddragon.hexo.eth");
      expect(await ensRegistry.owner(reddragonNamehash)).to.be.equal(
        alice.address
      );
      expect(await ensRegistry.resolver(reddragonNamehash)).to.be.equal(
        ensPublicResolver.address
      );
      expect(await ensPublicResolver.addr(reddragonNamehash)).to.be.equal(
        alice.address
      );

      const greenturtleNamehash = namehash("greenturtle.hexo.eth");
      expect(await ensRegistry.owner(greenturtleNamehash)).to.be.equal(
        alice.address
      );
      expect(await ensRegistry.resolver(greenturtleNamehash)).to.be.equal(
        ensPublicResolver.address
      );
      expect(await ensPublicResolver.addr(greenturtleNamehash)).to.be.equal(
        alice.address
      );
    });

    it("owner can reset subdomain ownership and forward resolution", async () => {
      await hexo
        .connect(alice)
        .mintItems(["red"], ["dragon"], { value: price });

      const reddragonId = BigNumber.from(id("reddragon"));
      await hexo.connect(alice).claimSubdomains([reddragonId]);

      const reddragonNamehash = namehash("reddragon.hexo.eth");

      await ensRegistry
        .connect(alice)
        .setOwner(reddragonNamehash, carol.address);
      await ensRegistry
        .connect(carol)
        .setResolver(reddragonNamehash, AddressZero);

      await hexo
        .connect(alice)
        .transferFrom(alice.address, bob.address, reddragonId);
      await hexo.connect(bob).claimSubdomains([reddragonId]);

      expect(await ensRegistry.owner(reddragonNamehash)).to.be.equal(
        bob.address
      );
      expect(await ensPublicResolver.addr(reddragonNamehash)).to.be.equal(
        bob.address
      );
    });

    it("properly handles unauthorized attempts", async () => {
      await hexo
        .connect(alice)
        .mintItems(["red"], ["dragon"], { value: price });

      const reddragonId = BigNumber.from(id("reddragon"));
      await expect(
        hexo.connect(bob).claimSubdomains([reddragonId])
      ).to.be.revertedWith("Unauthorized");
    });

    it("properly handles inexistent items", async () => {
      await expect(hexo.connect(bob).claimSubdomains([0])).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });
  });

  describe("admin", () => {
    it("profits are always relayed to the contract admin", async () => {
      const beforeBalance = await deployer.getBalance();
      await hexo
        .connect(alice)
        .mintItems(["red"], ["dragon"], { value: price });
      await hexo
        .connect(alice)
        .mintItems(["green"], ["turtle"], { value: price });
      const afterBalance = await deployer.getBalance();

      expect(await ethers.provider.getBalance(hexo.address)).to.be.equal(0);
      expect(afterBalance.sub(beforeBalance)).to.be.equal(price.mul(2));
    });

    it("add new colors and objects", async () => {
      const colorHash = id("color");
      const objectHash = id("object");

      await expect(
        hexo.connect(alice).addColors([colorHash])
      ).to.be.revertedWith("Ownable: caller is not the owner");
      await expect(
        hexo.connect(alice).addObjects([objectHash])
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await hexo.connect(deployer).addColors([colorHash]);
      await hexo.connect(deployer).addObjects([objectHash]);

      await hexo
        .connect(alice)
        .mintItems(["color"], ["object"], { value: price });
    });

    it("change base image URI", async () => {
      await hexo
        .connect(alice)
        .mintItems(["red"], ["dragon"], { value: price });

      const reddragonId = BigNumber.from(id("reddragon"));
      const newBaseImageURI = "https://new-base-image-uri/image/";

      await expect(
        hexo.connect(alice).changeBaseImageURI(newBaseImageURI)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await hexo.connect(deployer).changeBaseImageURI(newBaseImageURI);
      expect(await hexo.imageURI(reddragonId)).to.be.equal(
        newBaseImageURI + reddragonId.toString()
      );
    });

    it("change price", async () => {
      const oldPrice = price;
      const newPrice = price.mul(2);

      await expect(
        hexo.connect(alice).changePrice(newPrice)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await hexo.connect(deployer).changePrice(newPrice);
      expect(await hexo.price()).to.be.equal(newPrice);

      await expect(
        hexo.connect(alice).mintItems(["red"], ["dragon"], { value: oldPrice })
      ).to.be.revertedWith("Insufficient amount");
      await hexo
        .connect(alice)
        .mintItems(["red"], ["dragon"], { value: newPrice });
    });
  });

  describe("misc", () => {
    it("on-chain metadata", async () => {
      await hexo
        .connect(alice)
        .mintItems(["red"], ["dragon"], { value: price });

      const reddragonId = BigNumber.from(id("reddragon"));

      const reddragonMetadata = JSON.parse(
        await hexo
          .tokenURI(reddragonId)
          .then((encoded: string) =>
            Buffer.from(encoded.split(",")[1], "base64").toString()
          )
      );
      expect(reddragonMetadata.name).to.be.equal("Red Dragon");
      expect(reddragonMetadata.description).to.be.equal(
        "Unique combos of basic colors and objects that form universally recognizable NFT identities. Visit hexo.codes to learn more."
      );
      expect(reddragonMetadata.image).to.be.equal(baseImageURI + reddragonId);
      expect(reddragonMetadata.attributes[0].trait_type).to.be.equal("Color");
      expect(reddragonMetadata.attributes[0].value).to.be.equal("Red");
      expect(reddragonMetadata.attributes[1].trait_type).to.be.equal("Object");
      expect(reddragonMetadata.attributes[1].value).to.be.equal("Dragon");
      expect(reddragonMetadata.attributes[2].display_type).to.be.equal(
        "number"
      );
      expect(reddragonMetadata.attributes[2].trait_type).to.be.equal(
        "Generation"
      );
      expect(reddragonMetadata.attributes[2].value).to.be.equal(1);
    });

    it("owner can set custom image URI", async () => {
      await hexo
        .connect(alice)
        .mintItems(["red", "green"], ["dragon", "turtle"], {
          value: price.mul(2),
        });

      const reddragonId = BigNumber.from(id("reddragon"));
      const greenturtleId = BigNumber.from(id("greenturtle"));

      const customImageURI = "https://my-custom-image-uri";
      await expect(
        hexo.connect(bob).setCustomImageURI(reddragonId, customImageURI)
      ).to.be.revertedWith("Unauthorized");
      await hexo.connect(alice).setCustomImageURI(reddragonId, customImageURI);

      const reddragonMetadata = JSON.parse(
        await hexo
          .tokenURI(reddragonId)
          .then((encoded: string) =>
            Buffer.from(encoded.split(",")[1], "base64").toString()
          )
      );
      expect(reddragonMetadata.image).to.be.equal(customImageURI);

      const greenturtleMetadata = JSON.parse(
        await hexo
          .tokenURI(greenturtleId)
          .then((encoded: string) =>
            Buffer.from(encoded.split(",")[1], "base64").toString()
          )
      );
      expect(greenturtleMetadata.image).to.be.equal(
        baseImageURI + greenturtleId
      );
    });

    it("contract-level metadata", async () => {
      const contractMetadata = JSON.parse(
        await hexo
          .contractURI()
          .then((encoded: string) =>
            Buffer.from(encoded.split(",")[1], "base64").toString()
          )
      );
      expect(contractMetadata.name).to.be.equal("Hexo Codes");
      expect(contractMetadata.description).to.be.equal(
        "Unique combos of basic colors and objects that form universally recognizable NFT identities. Visit hexo.codes to learn more."
      );
      expect(contractMetadata.image).to.be.equal(
        "https://hexo.codes/images/logo.svg"
      );
      expect(contractMetadata.seller_fee_basis_points).to.be.equal(333);
      expect(contractMetadata.fee_recipient).to.be.equal(
        await hexo.owner().then((address: string) => address.toLowerCase())
      );
    });
  });
});
