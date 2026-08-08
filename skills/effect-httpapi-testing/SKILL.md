---
name: effect-httpapi-testing
description: Test Effect HttpApi applications end to end with real layer composition and Web Request/Response handling. Use when writing tests for HttpApi groups, middleware, schemas, errors, or server routes.
---

# Effect HttpApi Testing

Build tests from the same `HttpApi` specification, handlers, middleware, and
service layers used by production. Replace repositories and external clients
with test layers, not handler logic.

For Effect v4 HTTP APIs, `HttpRouter.toWebHandler` provides an in-process Web
`Request`/`Response` boundary without opening a port:

```ts
const apiLayer = HttpApiBuilder.layer(ApiSpec).pipe(
  Layer.provide(UserLive),
  HttpRouter.provideRequest(Layer.succeed(UserRepository, fakeRepository)),
);

const webHandler = HttpRouter.toWebHandler(apiLayer.pipe(Layer.provide(HttpServer.layerServices)), {
  disableLogger: true,
});

const response =
  yield * Effect.promise(() => webHandler.handler(new Request("http://effect.test/user/")));
```

Dispose every web handler after the test so scoped finalizers run. Use an
`afterEach` registry or an Effect scoped test layer when several tests share
the setup.

Use `@effect/vitest`, decode response bodies with the public response Schema,
and assert status plus wire shape. Cover middleware failures, schema failures,
typed domain failures, and unexpected defects separately.

Keep layer direction explicit: handlers consume test services, the API layer
consumes handlers, and the web handler consumes the complete router layer.
Avoid patching globals or calling handler functions directly because both skip
the HTTP contract.
