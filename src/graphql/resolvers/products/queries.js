
const { getAllProductsDto, getProductByIdDto } = require("../../../DTO/productDto");

module.exports.productQueries = {
    products: async () => await getAllProductsDto(),
    product: async (_, { productId }, context ) => {
      const resp = await getProductByIdDto ( productId )
      return resp[0]
    },
}