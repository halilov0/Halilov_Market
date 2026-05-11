System Architecture & Requirements Overview
1. System Architecture

Paradigm: Decoupled Client-Server architecture utilizing a RESTful API.

Backend Application: A Java-based backend framework. The server must remain strictly stateless, utilizing token-based authentication (e.g., JWT) for session management.

Data Tier: A Relational Database (RDBMS) is mandatory to ensure ACID compliance for handling financial transactions and inventory consistency.

Media Storage: Cloud Object Storage for media assets. The backend will process uploads by applying necessary image improvements on single images (no image merging functionality is required). The relational database will store only the asset URIs.

Edge/Network: A Reverse Proxy service providing a Web Application Firewall (WAF) and Content Delivery Network (CDN) capabilities.

2. Core Use Cases

Catalog Management: Admin-level CRUD operations for products, categories, and inventory tracking.

Cart Management: Client-side state management for the shopping cart to reduce server load, with optional database persistence for authenticated users.

Checkout Flow: Redirection-based or iframe-based checkout. Orders are initialized in a "Pending" state and transition to "Paid" strictly via a cryptographically verified webhook callback from the payment provider.

Order Fulfillment: Admin interface to dispatch order payloads to a shipping aggregator, retrieve tracking data, and update fulfillment statuses.

3. External Integrations (APIs)

Payment Gateway: Integration for generating secure payment tokens and an exposed, secured endpoint for handling asynchronous payment webhooks.

Shipping Aggregator: Integration for transmitting fulfillment requests (customer details, package specs) and receiving delivery status webhooks.

4. Non-Functional Requirements (NFRs)

Performance: The system must reliably support peak traffic of up to 50 concurrent users. Internal API latency (excluding third-party dependencies) must not exceed 500ms (p95).

Security: Zero PCI Scope architecture—raw payment credentials must never be processed or stored by the backend. Standard web security practices (ORM utilization for SQLi prevention, strict CORS policies) must be implemented.

Reliability: Strict database transaction management (Commit/Rollback mechanisms) to ensure data consistency between payment confirmations, inventory reductions, and third-party API failures.