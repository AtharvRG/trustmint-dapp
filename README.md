<div align="center">
  <img src="./public/logo.svg" alt="TrustMint Logo" width="200" />
</div>

<h1 align="center">TrustMint</h1>  
<p align="center">     
  The Foundation of Trust for the Freelance Economy     
  <br />     
  <a href="#"><strong>Explore the dApp »</strong>
  </a>   
</p> 

<div align="center">

![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue?logo=solidity)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6.11.1-blue?logo=ethereum)
![Vite](https://img.shields.io/badge/Vite-5.1.4-blue?logo=vite)

</div>

---

**TrustMint** is a decentralized application that redefines the freelance paradigm. By leveraging the immutability and transparency of the blockchain, we eliminate the need for costly intermediaries and inject cryptographic certainty into every agreement. Our platform provides a secure, on-chain escrow system where funds are locked until both parties are satisfied, ensuring that freelancers are paid for their work and clients receive what they've paid for.

This repository contains the complete frontend source code for the TrustMint dApp, a masterpiece of modern web architecture built with flawless execution in mind.

<br/>

## ✨ Core Features

| Feature                 | Description                                                                                                                                                             | Status      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 🤝 **Secure Escrow**      | Funds are held in an immutable smart contract, only releasable upon the successful completion and approval of project milestones. No chargebacks, no platform risk.         | ✅ Complete |
| 📝 **Milestone Management** | Break down complex projects into clear, manageable milestones. Freelancers submit work for each milestone, and clients approve payments on-chain.                      | ✅ Complete |
| 📢 **Job Marketplace**    | A fully decentralized marketplace where clients can post jobs and freelancers can submit proposals. All interactions are transparent and censorship-resistant.        | ✅ Complete |
| 🆔 **On-Chain Identity**    | Build a verifiable, portable reputation. Your work history, successful contracts, and skills are tied to your wallet, not a centralized platform.                  | ✅ Complete |
| 💼 **Direct Hire**        | Already have a freelancer in mind? Skip the marketplace and create a direct, secure escrow agreement with them in seconds using their wallet address.                   | ✅ Complete |
| 🎨 **Digital Artistry**   | A breathtaking UI/UX with fluid 60fps animations, a sophisticated design system, and an obsessive attention to micro-interactions.                                  | ✅ Complete |

## 🏛️ The Architectural Philosophy

TrustMint was built not just to be functional, but to be a benchmark for quality in the Web3 space. Our philosophy is **"flawless execution"** at every layer of the stack.

-   **Frontend as Art:** The user interface is crafted with an obsessive focus on aesthetics, usability, and performance. We use a premium typographic scale (`Inter` & `Clash Display`), a deliberate color palette, and fluid page transitions powered by `Framer Motion` to create an experience that feels intuitive, responsive, and trustworthy.
-   **Backend as Science:** Our smart contracts are engineered for security, gas efficiency, and clarity. The logic is robust, handling all edge cases and ensuring absolute data integrity. The separation of concerns between the `Factory`, `Escrow`, `UserProfile`, and `JobMarket` contracts creates a modular, scalable, and maintainable on-chain architecture.
-   **Environmental Advantage:** We chose **React** with **Vite** for a lightning-fast development experience and a highly optimized production build. **Ethers.js** provides a reliable and elegant interface to the Ethereum blockchain. All off-chain metadata is stored on **IPFS** via Pinata, ensuring data persistence and decentralization.

## 🛠️ Tech Stack

| Frontend                                                                                                                                           | Blockchain & Web3                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| • **[React](https://reactjs.org/)** (UI Library)                                                                                                     | • **[Solidity](https://soliditylang.org/)** (Smart Contract Language)                                                                                              |
| • **[TypeScript](https://www.typescriptlang.org/)** (Static Typing)                                                                                  | • **[Ethers.js](https://ethers.io/)** (Blockchain Interaction)                                                                                                   |
| • **[Vite](https://vitejs.dev/)** (Build Tool)                                                                                                       | • **[Web3Modal](https://web3modal.com/)** (Wallet Connectivity)                                                                                                   |
| • **[Tailwind CSS](https://tailwindcss.com/)** (Styling)                                                                                             | • **[IPFS / Pinata](https://www.pinata.cloud/)** (Decentralized Storage)                                                                                           |
| • **[Framer Motion](https://www.framer.com/motion/)** (Animation)                                                                                    | • **[Hardhat](https://hardhat.org/)** (Development Environment)                                                                                                      |

## 🚀 Getting Started

Follow these instructions to set up and run the project locally for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
-   A browser wallet like [MetaMask](https://metamask.io/) configured for the **Sepolia Testnet**.

### Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/your-username/trustmint-dapp.git
    cd trustmint-dapp
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a `.env.local` file in the root of the project by copying the example file:
    ```sh
    cp .env.example .env.local
    ```
    Now, open `.env.local` and fill in the required values:
    ```env
    # Get a Project ID from https://cloud.walletconnect.com/
    VITE_WALLETCONNECT_PROJECT_ID="YOUR_WALLETCONNECT_PROJECT_ID"

    # Get API keys from https://www.pinata.cloud/
    VITE_PINATA_API_KEY="YOUR_PINATA_API_KEY"
    VITE_PINATA_API_SECRET="YOUR_PINATA_API_SECRET"

    # Get an RPC URL from a provider like Infura or Alchemy
    VITE_SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"
    ```

4.  **Run the Development Server**
    ```sh
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser to see the application running.

## 📝 Smart Contract Addresses (Sepolia Testnet)

The core logic of TrustMint is governed by a suite of smart contracts deployed on the Sepolia testnet.

-   **TrustMintFactory:** `0xe89bcf0146f35ea3d3660afcdfd5fa6e213189f7`
-   **UserProfile:** `0x906172b059561602b73ca47e1f638a117137b4cc`
-   **JobMarket:** `0x9dccef36e84a8077cec5cc7bc14e1d82f3859ea6`

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
