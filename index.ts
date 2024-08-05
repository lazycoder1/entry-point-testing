import { createPublicClient, createWalletClient, defineChain, http, type Account, type PublicClient, type WalletCapabilitiesRecord, type WalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sendUserOp, validateUserOp } from "./validateUserOp";
import { SAAbi } from "./abis/SA";
import { sendUserOperation } from "viem/account-abstraction";

const safAddr = "0xAe935f0dd79eAf68d516E7aBBa88a58eE69313a1";
const salt = 1n;
const saAddr = "0x4F18760D6F32333C5cEF7b933A3379E92159f02d"
export const moveTest = defineChain({
    id: 30732,
    name: "MOVE_TESTNET",
    nativeCurrency: {
        decimals: 18,
        name: "MOVE",
        symbol: "MOVE",
    },
    rpcUrls: {
        default: {
            http: ["https://mevm.devnet.imola.movementlabs.xyz"],
        },
    },
    blockExplorers: {
        default: {
            name: "Explorer",
            url: "https://explorer.devnet.imola.movementlabs.xyz",
        },
    },
});

const pvt_key = process.env.PVT_KEY as `0x${string}`;

const account = privateKeyToAccount(pvt_key);

const publicClient = createPublicClient({
    chain: moveTest,
    transport: http('https://mevm.devnet.imola.movementlabs.xyz'),
});
const walletClient = createWalletClient({
    chain: moveTest,
    account: account,
    transport: http('https://mevm.devnet.imola.movementlabs.xyz'),
});

const getOwner = async (publicClient: PublicClient) => {
    const owner = await publicClient.readContract({
        address: saAddr,
        abi: SAAbi,
        functionName: "owner",
        args: [],
    })
    console.log('Owner of the smart account - ', owner);

}


// deployAccountAndGetAddress(publicClient, walletClient, account);
// await getEntryPointOfFactory(publicClient);

// gets the owner of the smart account
await getOwner(publicClient);

// sends a user operation to the smart account, which should check the validity of the signature. This passes
await validateUserOp(publicClient, saAddr);

// sends a user operation to the entrypoint, which inturn calls the smart account to validate the signature. This fails
await sendUserOp(publicClient, walletClient);