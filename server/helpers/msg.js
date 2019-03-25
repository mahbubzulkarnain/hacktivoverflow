module.exports = {
  success: {},
  error: {
    isRequired: (param) => {
      return `${param} is required`;
    },
    parser: (err) => {
      // err.forEach((item) => {
      //   let param = item.param;
      //   item[param] = item.msg;
      //   for (let key in item) {
      //     if (item.hasOwnProperty(key) && key !== param) {
      //       delete item[key];
      //     }
      //   }
      // });
      let result = {};
      err.map((item) => {
        result[item.param] = {
          message: item.msg
        }
      });

      return {
        message: {
          errors: result
        }
      }
    }
  },
};