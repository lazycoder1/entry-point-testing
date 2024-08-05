import { createPublicClient, createWalletClient, encodeAbiParameters, hashMessage, http, recoverAddress, recoverMessageAddress, recoverPublicKey, verifyMessage, type Account, type PublicClient, type WalletClient } from "viem"
import { getUserOperationHash, toPackedUserOperation, type UserOperation } from "viem/account-abstraction"
import { moveTest } from ".";
import { privateKeyToAccount } from "viem/accounts";
import { EPAbi } from "./abis/EP";
import { SAAbi } from "./abis/SA";

const userOp = {
    "sender": "0x4F18760D6F32333C5cEF7b933A3379E92159f02d",
    "nonce": BigInt("0x0"),
    "callData": "0xb61d27f60000000000000000000000008d582d98980248f1f0849710bd0626ade4c44e3d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
    "callGasLimit": BigInt("0x13880"),
    "verificationGasLimit": BigInt("0x19ecf"),
    "preVerificationGas": BigInt("0xc6bd"),
    "maxFeePerGas": BigInt("0x165a0bc02"),
    "maxPriorityFeePerGas": BigInt("0x2"),
    "signature": "0xf6a03ac3811f09e0cbbce8e932ea6a2637c0b021aca948d26b389df8632e94ea33df695616accf2e9026149ffbdd20ac0e6a0491c812d36d4784f44568d8e80a1c",
    "paymasterPostOpGasLimit": BigInt("0x0"),
} as UserOperation<"0.7">;

const userOpHash = getUserOperationHash({
    userOperation: userOp,
    entryPointVersion: "0.7",
    chainId: 30732,
    entryPointAddress: "0x0000000071727De22E5E9d8BAf0edAc6f37da032"
});

const packedUserOp = toPackedUserOperation(userOp);


// send user op hash
export const sendUserOp = async (publicClient: PublicClient, walletClient: WalletClient) => {
    try {
        if (walletClient.account == undefined) {
            return;
        }
        const { request } = await publicClient.simulateContract({
            account: walletClient.account,
            chain: moveTest,
            address: "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
            abi: EPAbi,
            functionName: "handleOps",
            args: [[[packedUserOp.sender, packedUserOp.nonce, packedUserOp.initCode, packedUserOp.callData, packedUserOp.accountGasLimits, packedUserOp.preVerificationGas, packedUserOp.gasFees, packedUserOp.paymasterAndData, packedUserOp.signature]], "0x7821A095bae49fcf8a3dAF918026949De837FCd7"]
        })
        const txHash = await walletClient.writeContract(request)
        console.log(txHash);
    } catch (e) {
        console.log(e);
    }
}


// validate the signature is correct based on the user op that is being sent.
export const validateUserOp = async (publicClient: PublicClient, smartAccountAddress: `0x${string}`) => {
    try {
        const res = await publicClient.readContract({
            address: smartAccountAddress,
            abi: SAAbi,
            functionName: "validateUserOp",
            args: [[packedUserOp.sender, packedUserOp.nonce, packedUserOp.initCode, packedUserOp.callData, packedUserOp.accountGasLimits, packedUserOp.preVerificationGas, packedUserOp.gasFees, packedUserOp.paymasterAndData, packedUserOp.signature], userOpHash, 0n],
        })
        if (res == 0n) {
            console.log("Signature validation is working perfectly. Res from validation -", res);
        }
    } catch (e) {
        console.log(e);
    }
}


// const address = await recoverMessageAddress({
//     message: { raw: userOpHash },
//     signature: userOp.signature,
// })

console.log('userOpHash - ', userOpHash, 'signature -', userOp.signature);
// console.log('address', address)
