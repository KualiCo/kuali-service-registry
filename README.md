# kuali-service-registry

TODO: Description

# Installation

```
npm install kuali-service-registry
```

# Usage

```js
const { createServiceRegistry } = require('kuali-service-registry')

const serviceRegistry = createServiceRegistry()
  .setService('userMiddleware', (req, res, next) => {
    req.user = getUser()
  })
  .setService('myConfig', {
    port: '3000'
  })
  .registerModuleServices('some-node-module')

const { userMiddleware, myConfig } = serviceRegistry.services
```

I know what you're probably thinking. Why don't you just use your own object to
keep track of these services. Admittedly, this is probably too silly to use this
module. The use case this fits if you have an optional dependency you want to
extend or replace functionality in your application, but only if the dependency
is installed.

# API

## `createServiceRegistry(options)`

Creates a service registry, which keeps track of the registered services.
returns a `registry`

- `options.logger` {Object} - A logger to use when errors occur. It must have
  two properties that are both functions: `info` and `warn`.
- `options.debug` {Boolean} - Set to true to output additional error information
  when an error loading a registry module occurs.

## `registry.setService(serviceName, service)`

Registers a service with the service registry. Returns the registry (for
chaining).

- `serviceName` {string} - The name to register the service under
- `service` {*} - Anything you want to register to that service key. It can be
  literally anything, or nothing.

## `registry.registerModuleServices(modulePath)`

Gives registry control over to a give module. Returns the registry (for
chaining).

- `modulePath` {string} - Should be an absolute path to a module, or just the
module name if it's a module that is located in your project's `node_modules`.

The module should export a function `registerServices` that takes one argument,
which is this registry. The idea is that this other module will register it's
own or override or extend the existing services. If the module does not exist,
it will print out a warning.

## `registry.removeService(serviceName)`

Removes a give service. Returns the registry (for chaining).

- `serviceName` {string} - The service to remove.

## `registry.services`

The object who's keys are the service names that are currently registered.
