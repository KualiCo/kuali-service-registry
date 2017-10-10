# kuali-service-registry

TODO: Description

# Installation

```
npm install kuali-service-registry
```

# Usage

```js
// Yes, this is a singleton with shared state, more on that later
const registry = require('kuali-service-registry')

registry
  .setService('userMiddleware', (req, res, next) => {
    req.user = getUser()
  })
  .setService('myConfig', {
    port: '3000'
  })
  .registerModuleServices('some-node-module', require)

const { userMiddleware, myConfig } = registry.services
```

Note: The default export is a singleton so that you can `require('kuali-service-registry')`
in any file in your application and have a shared registry. If you'd like to
configure your own, you can pull in the class and create your own
ServiceRegistry:

```js
const { ServiceRegistry } = require('kuali-service-registry')

const registry = new ServiceRegistry()
```

# API

## `new ServiceRegistry(options)`

Creates a service registry, which keeps track of the registered services.
returns a `registry`

- `options.logger` {Object} - A logger to use when errors occur. It must have
  two properties that are both functions: `info` and `warn`.
- `options.debug` {Boolean} - Set to true to output additional error information
  when an error loading a registry module occurs.

## `registry.configure(options)`

Configures the registry with the given options. Note that you should only call
this once as it will override the options with the defaults of the omitted
options. For example:

```js
const registry = require('kuali-service-registry')

registry.configure({ logger: console }) // Sets the logger to console, and debug to default
registry.configure({ debug: true }) // Sets the debug to true, and the logger to the default value
```

The options are the same options in the constructor.

## `registry.setService(serviceName, service)`

Registers a service with the service registry. Returns the registry (for
chaining).

- `serviceName` {string} - The name to register the service under
- `service` {*} - Anything you want to register to that service key. It can be
  literally anything, or nothing.

## `registry.registerModuleServices(modulePath, parentRequire)`

Gives registry control over to a give module. Returns the registry (for
chaining).

- `modulePath` {string} - Should be an absolute path to a module, or just the
module name if it's a module that is located in your project's `node_modules`.
- `parentRequire` {Function} - You need to pass in the `require` function that
  you use in your context, so that it is able to include modules that you have
  access to, but this module does not.

The module should export a function `registerServices` that takes one argument,
which is this registry. The idea is that this other module will register it's
own or override or extend the existing services. If the module does not exist,
it will print out a warning.

## `registry.removeService(serviceName)`

Removes a give service. Returns the registry (for chaining).

- `serviceName` {string} - The service to remove.

## `registry.services`

The object who's keys are the service names that are currently registered.
