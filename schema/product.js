const { GraphQLObjectType, GraphQLID, GraphQLString , GraphQLSchema, GraphQLList, GraphQLInt} = require('graphql');
const product = require('../models/product');
const {Product} = require('../models/product');


// Schemas
const Producttype = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: {type: GraphQLID},
        productName: {type: GraphQLString},
        price: {type: GraphQLInt}
    })
});

// Root Queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getProducts: {
            type: new GraphQLList(Producttype),
            resolve: async () => {
                const productDetails = await Product.find({});
                return productDetails;
            }
        },
        getProduct: {
            type: new GraphQLList(Producttype),
            args: {id: {type: GraphQLID}},
            resolve: async (parent,args) => {
                const productDetails = await Product.find({_id: args.id});
                return productDetails;
            }
        }
    }
})


// Mutation
const Mutation = new GraphQLObjectType ({
    name: 'Mutation',
    fields: {
        // Add Product
        addProduct: {
            type: Producttype,
            args: {
                productName: {type: GraphQLString},
                price: {type: GraphQLInt}
            },
            resolve: async (parent,args) => {
                const productExist = await Product.findOne({productName: args.productName});
                if(productExist) {
                    throw new Error("Product already exists!");
                }
                const prodDetails = await new Product ({
                    productName: args.productName,
                    price: args.price
                });
                prodDetails.save();
                return prodDetails;
            }
        },
        // Update Product
        updateProduct: {
            type: Producttype,
            args: {
                id: {type: GraphQLID},
                productName: {type: GraphQLString},
                price: {type: GraphQLInt}
            },
            resolve: async (parent, args) => {
                const productExist = await Product.findById({_id: args.id});
                if(productExist) {
                    const prodDetails = await Product.findByIdAndUpdate({_id: args.id}, {productName: args.productName, price: args.price});
                    return await Product.findById({_id: args.id});
                } else {
                    throw new Error("There is no product exists!");
                }
            }
        },
        // Delete Product
        deleteProduct: {
            type: GraphQLString,
            args: {
                id: {type: GraphQLID}
            },
            resolve: async (parent,args) => {
                const productExist = await Product.findById({_id: args.id});
                if(productExist) {
                    const prodDetails = await Product.findByIdAndDelete({_id: args.id});
                    return `Deleted Succesfully ${prodDetails._id}`
                } else {
                    throw new Error("There is no product exists!");
                }
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})