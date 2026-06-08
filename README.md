# ⚡ Quantum Spark: High-Velocity HFT Telemetry & Benchmarking Engine

![HFT-Badge](https://img.shields.io/badge/Architecture-HFT%20Benchmarking-FF4500?style=for-the-badge&logo=fastapi)
![Redis-Badge](https://img.shields.io/badge/Data%20Pipeline-Redis%20In--Memory-DC382D?style=for-the-badge&logo=redis)
![Node-Badge](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js)
![License-Badge](https://img.shields.io/badge/Contest-IICPC%20Eval-007ACC?style=for-the-badge&logo=github)

An ultra-low latency testing harness and live telemetry engine designed to benchmark concurrent order-matching engines under extreme simulated load. Built specifically to evaluate execution efficiency, packet drops, and microsecond-level telemetry reporting during high-frequency trading simulations.

---

## 🚀 Key Architectural Strengths

* **Extreme Load Simulation:** Generates up to 12,500+ Transactions Per Second (TPS) using optimized asynchronous worker nodes.
* **In-Memory Pipeline:** Leverages Redis for transient state management and rapid data ingestion without disk I/O bottlenecks.
* **Real-Time Telemetry:** Computes critical percentile latencies (`p50`, `p90`, `p99`) dynamically and streams them directly to an executive analytical dashboard.
* **Isolative Testing Harness:** Spawns contestant matching engines inside secure, sandboxed child processes to prevent cascading runtime failures.

---

## 🛠️ System Components & Directory Map

```text
├── index.js          # Core Express engine & latency calculators
├── index.html        # Low-overhead HTML5/Tailwind analytical dashboard
├── package.json      # Dependencies config
└── docker-compose.yml # Instant environment orchestrator (Redis stack)


//Made by Shikhar maurya @hbti kanpur....