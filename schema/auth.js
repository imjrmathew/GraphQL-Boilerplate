const { GraphQLObjectType, GraphQLID, GraphQLString , GraphQLSchema, GraphQLList} = require('graphql');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Login, Register} = require('../models/auth');

// Schemas
const Logintype = new GraphQLObjectType({
    name: 'Login',
    fields: () => ({
        id: {type: GraphQLID},
        username: {type: GraphQLString},
        password: {type: GraphQLString}
    })
})

const Registrationtype = new GraphQLObjectType ({
    name: 'Registration',
    fields: () =>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        loginID: {
            type: Logintype,
            resolve: (parent, args) => {
                return Login.findById({_id: parent.loginID})
            }
        }
    })
})

// Root Queries
const RootQuery = new GraphQLObjectType ({
    name: 'RootQuery',
    fields: {
        getUsers: {
            type: new GraphQLList(Registrationtype),
            resolve: () => {
                const regDetails = Register.find({});
                return regDetails;
            }
        }
    }
})

// Mutation
const Mutation = new GraphQLObjectType ({
    name: 'Mutation',
    fields: {
        // Register Mutation
        addUser: {
            type: GraphQLString,
            args: {
                username: { type: GraphQLString},
                password: {type: GraphQLString},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
            },
            resolve: async (parent,args) => {
                const salt = await bcryptjs.genSalt(10);
                const hashPassword = await bcryptjs.hash(args.password, salt);
                const usernameExists = await Login.findOne({ username: args.username });
                const emailExists = await Register.findOne({ email: args.email });
                if (usernameExists) {
                    throw new Error("Username already exists!");
                }
                if (emailExists) {
                    throw new Error("Email already registered!")
                }
                const loginDetails = await new Login ({
                    username: args.username,
                    password: hashPassword
                })
                const registerDetails = await new Register({
                    name: args.name,
                    email: args.email,
                    loginID: loginDetails._id
                })
                const token = jwt.sign({ id: loginDetails._id }, process.env.TOKEN_SECRET);
                loginDetails.save();
                registerDetails.save();
                return token;
            }
        },
        // Login Mutation
        performLogin: {
            type: GraphQLString,
            args: {
                username: {type: GraphQLString},
                password: {type: GraphQLString}
            },
            resolve: async (parent, args) => {
                const loguser = await Login.findOne({username: args.username});
                if(loguser) {
                    const logpassword = await bcryptjs.compare(args.password, loguser.password);
                    if(logpassword) {
                        const token = jwt.sign({ id: loguser._id }, process.env.TOKEN_SECRET);
                        return token;
                    } else {
                       throw new Error("Incorrect Password!"); 
                    }
                } else {
                    throw new Error("Incorrect User!");  
                }
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
