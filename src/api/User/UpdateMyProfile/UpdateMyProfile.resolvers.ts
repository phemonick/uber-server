import { Resolvers } from "../../../types/resolvers";
import authResolver from "../../../utils/authResolver";
import { UpdateMyProfileMutationArgs, UpdateMyProfileResponse } from "src/types/graph";
import User from "../../../entities/User";

const resolvers: Resolvers = {
    Mutation: {
        UpdateMyProfile: authResolver(async(_, args: UpdateMyProfileMutationArgs, { req }): Promise<UpdateMyProfileResponse> => {
            const user: User = req.user;
            const notNull = {};
            Object.keys(args).forEach(key => {
                if (args[key] !== null) {
                    notNull[key] = args[key];
                }
            })
            try {
                await User.update({id: user.id}, { ...notNull });
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
}

export default resolvers;