// ignore file, functions used for other testing

const deployAccountAndGetAddress = async (publicClient: PublicClient, walletClient: WalletClient, account: Account) => {
    const write = await walletClient.writeContract({
        account: account,
        functionName: "createAccount",
        address: safAddr,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "salt",
                    "type": "uint256"
                }
            ],
            "name": "createAccount",
            "outputs": [
                {
                    "internalType": "contract SimpleAccount",
                    "name": "ret",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        args: [account.address, salt],
        chain: moveTest
    })

    const read = await publicClient.readContract({
        address: safAddr,
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "salt",
                    "type": "uint256"
                }
            ],
            "name": "getAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }],
        functionName: "getAddress",
        args: [account.address, salt],
    })

    console.log(write, read);
}

const getEntryPointOfFactory = async (publicClient: PublicClient) => {
    const res = await publicClient.readContract({
        address: saAddr,
        abi: SAAbi,
        functionName: "entryPoint",
        args: [],
    })
    console.log(res);
}