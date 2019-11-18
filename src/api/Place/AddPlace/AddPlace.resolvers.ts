import { Resolvers } from "src/types/resolvers";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import Place from "../../../entities/Place";

const resolvers: Resolvers = {
    Mutation: {
        AddPlace: authResolver(async(_, args, {req}) => {
            const user: User = req.user;
            try {
                await Place.create({ ...args, user }).save();
                return {
                    ok: true,
                    error: null
                }

            } catch(error) {
                return {
                    ok: false,
                    error: error.message
                }
            }

        })
    }
};

export default resolvers;