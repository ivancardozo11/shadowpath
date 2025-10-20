# ShadowPath v1.0.0

<div style="max-width: 600px; margin: 0 auto;">
 <p align="center"> 
 <img src="shadowpathlogo.png" width="500" height="400" alt="Image">
</p>
</div>
</div>

## 🧭 About
> Ultra-fast backend for Ethereum gas and swap estimation — off-chain math, on-chain accuracy.

---

## 📖 Documentation

**[→ Full Technical Documentation (Google Docs)](https://docs.google.com/document/d/1aXPTcPZc_cNP8XvbJcoP4pjtd-_6WFXVt55XNosJDnE/edit?usp=sharing)**

Complete guide including:
- Architecture details (Hexagonal Architecture)
- How the technical requirements are accomplished
- Step-by-step endpoint usage
- Testing strategies

---

## 🚀 Quick Start

### **1. Installation**

```bash
# Navigate to project directory
cd uniswap-gas-api

# Install dependencies
npm install
```

### **2. Environment Setup**

Create a `.env` file in the root:

```bash
RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY
PORT=3000
CACHE_TTL=10
```

**Get your API key:**
- Go to [Infura](https://infura.io), create an account
- Create a new Ethereum Mainnet project
- Copy your API key and replace `YOUR_INFURA_API_KEY`

### **3. Run the Application**

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

**Expected output:**
```
Application is running on: http://localhost:3000
```

---

## 🔌 API Endpoints

### **GET /gasPrice**

Returns current Ethereum gas price (response time <50ms with caching).

**PowerShell:**
```powershell
Invoke-WebRequest http://localhost:3000/gasPrice
```

**Bash/cURL:**
```bash
curl http://localhost:3000/gasPrice
```

**Response:**
```json
{
  "wei": "191998275",
  "gwei": "0.19",
  "timestamp": "2025-10-18T18:56:15.267Z"
}
```

---

### **GET /return/:from/:to/:amount**

Calculates Uniswap V2 swap output using off-chain math.

**Example: WETH → USDC (1 WETH)**

**PowerShell:**
```powershell
Invoke-WebRequest "http://localhost:3000/return/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/1000000000000000000"
```

**Bash/cURL:**
```bash
curl "http://localhost:3000/return/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/1000000000000000000"
```

**Response:**
```json
{
  "fromToken": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "toToken": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "amountIn": "1000000000000000000",
  "amountOut": "3245678912",
  "pairAddress": "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc"
}
```

**Token addresses:**
- WETH: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- USDC: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- DAI: `0x6B175474E89094C44Da98b954EedeAC495271d0F`

---

## 🧪 Testing

### **Unit Tests**
```bash
npm test
```

Tests domain entities and use cases with mocked dependencies.

### **E2E Tests**
```bash
npm run test:e2e
```

Tests the complete API with real dependencies:
- ✅ `/gasPrice` returns valid gas price
- ✅ `/gasPrice` responds in <50ms on cached request
- ✅ `/return` calculates swap output correctly
- ✅ `/return` rejects invalid token addresses

### **Manual Performance Test**

```powershell
# Test cache performance
Write-Host "Primera llamada (llenando cache)..." -ForegroundColor Yellow
Invoke-WebRequest http://localhost:3000/gasPrice | Out-Null

Write-Host "Segunda llamada (desde cache)..." -ForegroundColor Yellow
$tiempo = Measure-Command { Invoke-WebRequest http://localhost:3000/gasPrice | Out-Null }

Write-Host "`nTiempo: $($tiempo.TotalMilliseconds)ms" -ForegroundColor Green
if ($tiempo.TotalMilliseconds -lt 50) {
    Write-Host "✅ <50ms requirement met" -ForegroundColor Green
}
```

---

## 🏷️ Project Overview

**ShadowPath** is a lightweight **Nest.js backend service** designed to deliver critical Ethereum network data with **ultra-low latency** and **off-chain precision**.  
It exposes two main endpoints:

- **`/gasPrice`** — Returns the latest Ethereum gas price with response times under **50 ms**, optimized through smart caching and parallel queries.  
- **`/return/:fromTokenAddress/:toTokenAddress/:amountIn`** — Estimates token swap outputs on **Uniswap V2**, implementing the AMM math entirely off-chain using liquidity data from Ethereum nodes.

---

## 💡 The Problem It Solves

Accessing accurate and fast blockchain data is often **expensive, slow, or limited** by on-chain execution times.  
Developers and DeFi services face:

- Delays caused by RPC congestion or contract calls.  
- High gas costs for simple read operations.  
- Inconsistent performance from public APIs.  

**ShadowPath** solves this by:

- Performing **mathematical swap calculations off-chain**.  
- Fetching **state metadata (balances)** from trusted node providers like **Infura**, **Alchemy**, or **QuickNode**.  
- Delivering **real-time, precise results** in milliseconds — without touching on-chain functions.

---

## ⚙️ Tech Stack

- **Nest.js** – modular, scalable backend framework  
- **Web3.js** – blockchain communication  
- **Uniswap V2 Factory** – core liquidity reference  
- **RPC Providers:** Infura, Alchemy, QuickNode  

---

## 🚀 Philosophy

ShadowPath embodies **silent efficiency** — complex DeFi data resolved with clarity, speed, and precision.  
It’s built for developers who value **technical elegance**, **low latency**, and **open infrastructure design**.

---

## 📄 License

This project is licensed under the **Apache license 2.0**.  
No commercial or private use is allowed without explicit permission.
