import { Transfer as ChapterOneTransfer } from "../generated/ChapterOne/ChapterOne";
import { Transfer as ChapterTwoTransfer } from "../generated/ChapterTwo/ChapterTwo";
import {
  ListingCreated,
  ListingPurchased,
  ListingUpdated,
} from "../generated/ERC721Listings/ERC721Listings";
import { ChapterOneToken, Listing, Wallet } from "../generated/schema";

function resolveListingStatus(status: i32): string {
  switch (status) {
    case 0:
      return "Active";
    case 1:
      return "Inactive";
    case 2:
      return "Executed";
    default:
      return "Inactive";
  }
}

export function handleListingCreated(event: ListingCreated): void {
  const tokenId = event.params.tokenId;
  const price = event.params.price;
  const status = event.params.status;

  const listing = new Listing(tokenId.toString());
  listing.tokenId = tokenId;
  listing.price = price;
  listing.status = resolveListingStatus(status);
  listing.save();

  const token = ChapterOneToken.load(tokenId.toString());
  if (token) {
    token.listing = listing.id;
    token.save();
  }
}

export function handleListingPurchased(event: ListingPurchased): void {
  const tokenId = event.params.tokenId;
  const price = event.params.price;

  let listing = Listing.load(tokenId.toString());
  if (listing === null) {
    listing = new Listing(tokenId.toString());
    listing.tokenId = tokenId;
  }

  listing.price = price;
  listing.status = resolveListingStatus(2);
  listing.save();
}

export function handleListingUpdated(event: ListingUpdated): void {
  const tokenId = event.params.tokenId;
  const price = event.params.price;
  const status = event.params.status;

  let listing = Listing.load(tokenId.toString());
  if (listing === null) {
    listing = new Listing(tokenId.toString());
    listing.tokenId = tokenId;
  }

  listing.price = price;
  listing.status = resolveListingStatus(status);
  listing.save();
}

export function handleChapterOneTransfer(event: ChapterOneTransfer): void {
  const tokenId = event.params.tokenId;
  const fromAddress = event.params.from;
  const toAddress = event.params.to;

  let fromWallet = Wallet.load(fromAddress.toHexString());
  if (!fromWallet) {
    fromWallet = new Wallet(fromAddress.toHexString());
    fromWallet.address = fromAddress;
    fromWallet.save();
  }

  let toWallet = Wallet.load(toAddress.toHexString());
  if (!toWallet) {
    toWallet = new Wallet(toAddress.toHexString());
    toWallet.address = toAddress;
    toWallet.save();
  }

  let token = ChapterOneToken.load(tokenId.toString());
  if (!token) {
    token = new ChapterOneToken(tokenId.toString());
    token.tokenId = tokenId;
    token.mintedAt = event.block.timestamp;
    token.ownerHistory.push(fromWallet.id);
  }

  token.owner = toWallet.id;
  token.ownerHistory.push(toWallet.id);
  token.save();
}

export function handleChapterTwoTransfer(event: ChapterTwoTransfer): void {
  const tokenId = event.params.tokenId;
  const fromAddress = event.params.from;
  const toAddress = event.params.to;

  let fromWallet = Wallet.load(fromAddress.toHexString());
  if (!fromWallet) {
    fromWallet = new Wallet(fromAddress.toHexString());
    fromWallet.address = fromAddress;
    fromWallet.save();
  }

  let toWallet = Wallet.load(toAddress.toHexString());
  if (!toWallet) {
    toWallet = new Wallet(toAddress.toHexString());
    toWallet.address = toAddress;
    toWallet.save();
  }

  let token = ChapterOneToken.load(tokenId.toString());
  if (!token) {
    token = new ChapterOneToken(tokenId.toString());
    token.tokenId = tokenId;
    token.mintedAt = event.block.timestamp;
    token.ownerHistory.push(fromWallet.id);
  }

  token.owner = toWallet.id;
  token.ownerHistory.push(toWallet.id);
  token.save();
}
