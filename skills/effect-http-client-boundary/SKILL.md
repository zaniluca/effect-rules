---
name: effect-http-client-boundary
description: Route HTTP through Effect HttpClient instead of ambient fetch. Use when lint flags fetch or when building network clients, provider integrations, webhooks, or protocol adapters.
---

# Effect HTTP Client Boundary

Use the `HttpClient` service from Effect so network behavior is injectable,
traceable, scoped, and testable.

```ts
const client = yield * HttpClient.HttpClient;
const response = yield * client.execute(HttpClientRequest.get(url));
```

Expose named Effect operations from service interfaces. Do not expose
`typeof fetch`, Promise-returning client methods, or a raw third-party client as
the domain API.

When a library requires a Fetch-compatible callback, keep a small adapter in
the package that owns the library and delegate internally to `HttpClient`.
Document that file as a boundary and disable the raw-fetch rule only there.

Tests should inject an `HttpClient` layer or use a local test server. Do not
patch `globalThis.fetch`.
