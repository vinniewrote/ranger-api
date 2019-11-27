const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList} = graphql;
const axios = require('axios');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields:()=> ({
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type:GraphQLInt},
        park:{
            type:ParkType,
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/parks/${parentValue.parkId}`)
                .then(res => res.data);
            }
        }
    })
});

const ParkType = new GraphQLObjectType({
    name: 'Park',
    fields:()=> ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type:GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                console.log(parentValue, args);
                return axios.get(`http://localhost:3000/parks/${parentValue.id}/users`)
                .then(response => response.data)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: {type: GraphQLString}},
            resolve(root, args){
                console.log(root, args);
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(response => response.data);
            }
        }, 
        park: {
            type: ParkType,
            args:{id:{type:GraphQLString}},
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/parks/${args.id}`)
                .then(resp => resp.data);
            }
        }
    }
});

module.exports = new GraphQLSchema ({
    query: RootQuery
});