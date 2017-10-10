'use strict'

const R = require('ramda')

/**
 * @function createServiceRegistry
 * Creates a new service registry
 * @param {Object} [options]
 * @param {Object} [options.logger=console]
 * @param {Function} [options.logger.info=console.info]
 * @param {Function} [options.logger.warn=console.warn]
 * @param {boolean} [options.debug=false]
 */
const createServiceRegistry = ({ logger = console, debug = false } = {}) => {
  const registry = {
    /**
     * @function setService
     * @param {string} serviceName - The service to register
     * @param {*} service - The service to register
     */
    setService (serviceName, service) {
      this.services = R.assoc(serviceName, service, this.services)
      return registry
    },
    /**
     * @function registerModuleServices
     * @param {string} modulePath - An absolute path, or a node_module. If the
     *   module exists, and has a method `registerServices`, it will call the
     *   module with the serviceRegistry, so the module can register or extend
     *   the given services.
     */
    registerModuleServices (modulePath, parentModule) {
      try {
        const { registerServices } = parentModule.require(modulePath)
        registerServices(registry)
      } catch (exception) {
        logger.warn(
          `service-registry cannot register services from module ${modulePath}: ${exception.message}`
        )
        if (debug) {
          logger.info(exception.stack)
        }
      }
      return registry
    },
    /**
     * @function removeService
     * @param {string} serviceName - The service to remove
     */
    removeService (serviceName) {
      this.services = R.dissoc(serviceName, this.services)
      return registry
    },
    /**
     * @name services
     * @type {Object}
     */
    services: {}
  }
  return registry
}

exports.createServiceRegistry = createServiceRegistry
