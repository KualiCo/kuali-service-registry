'use strict'

class ServiceRegistry {
  constructor (options) {
    this.services = {}
    this.configure(options)
  }

  configure ({ logger = console, debug = false } = {}) {
    this.logger = logger
    this.debug = debug
    return this
  }

  setService (serviceName, service) {
    this.services[serviceName] = service
    return this
  }

  getService (serviceName) {
    return this.services[serviceName]
  }

  registerModuleServices (modulePath, parentRequire) {
    try {
      const { registerServices } = parentRequire(modulePath)
      registerServices(this)
    } catch (exception) {
      this.logger.warn(
        `service-registry cannot register services from module ${modulePath}: ${exception.message}`
      )
      if (this.debug) {
        this.logger.info(exception.stack)
      }
    }
    return this
  }

  removeService (serviceName) {
    delete this.services[serviceName]
    return this
  }
}

module.exports = exports = new ServiceRegistry()
exports.ServiceRegistry = ServiceRegistry
