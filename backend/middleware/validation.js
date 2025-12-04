const Joi = require('joi');

const enquiryValidation = (data) => {
  const schema = Joi.object({
    product_id: Joi.number().integer().required(),
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    message: Joi.string().min(10).max(1000).required()
  });
  return schema.validate(data);
};

module.exports = { enquiryValidation };
