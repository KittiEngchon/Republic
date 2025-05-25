// libs/wallet.js

let userAddress = null;
let currentChain = null;

export async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("กรุณาติดตั้ง MetaMask ก่อน");
    return;
  }

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    userAddress = accounts[0];
    currentChain = await ethereum.request({ method: "eth_chainId" });

    localStorage.setItem("wallet", userAddress);
    document.dispatchEvent(new CustomEvent("wallet-connected", { detail: { userAddress } }));
    return userAddress;
  } catch (error) {
    console.error("เชื่อมต่อ Wallet ล้มเหลว:", error);
  }
}

export async function checkWalletConnection() {
  if (typeof window.ethereum === "undefined") return null;

  const accounts = await ethereum.request({ method: "eth_accounts" });
  if (accounts.length > 0) {
    userAddress = accounts[0];
    currentChain = await ethereum.request({ method: "eth_chainId" });
    return userAddress;
  }
  return null;
}

export async function switchChain(chainId) {
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }],
    });
    currentChain = chainId;
    document.dispatchEvent(new CustomEvent("chain-changed", { detail: { chainId } }));
  } catch (switchError) {
    console.warn("เปลี่ยน Chain ไม่สำเร็จ:", switchError);
  }
}

export function getCurrentAddress() {
  return userAddress;
}

export function getCurrentChain() {
  return currentChain;
}

// Listen การเปลี่ยน wallet / chain
if (typeof window.ethereum !== "undefined") {
  ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
      userAddress = accounts[0];
      location.reload();
    }
  });

  ethereum.on("chainChanged", (chainId) => {
    currentChain = chainId;
    location.reload();
  });
}
