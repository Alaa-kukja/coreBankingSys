
define(['utils/Service'], function (serviceUtils) {
    class userService {
      /**
       * @function userService
       * @description get Users data from database
       * @param {any} users
       * @returns {promise Any}
       */
  
      constructor() {}
  
      async getLookupData(command) {
      return await serviceUtils.posFetchData('getLookup', command);
      }
    }
    return new userService();
  });