

function validate(schema , source){
      return (req, res, next) => {
        const data = req[source];

        const error = ValidateFields(data, schema);
        if (error) {
          return res.status(400).json({
            status: false,
            message: error,
          });
        }

        next();
      };

}


function ValidateFields(obj, schema) {
  for (const key in schema) {
    const expectedType = schema[key];
    const value = obj[key];

    if (value === undefined || value === null || value === "") {
      return `${key} is required`;
    }

    if (expectedType === "number" && isNaN(Number(value))) {
      return `${key} must be a number`;
    }

    if (
      expectedType === "boolean" &&
      value !== "true" &&
      value !== "false" &&
      typeof value !== "boolean"
    ) {
      return `${key} must be a boolean`;
    }

    if (expectedType === "string" && typeof value !== "string") {
      return `${key} must be a string`;
    }
  }

  return null;
}

module.exports = {validate}
