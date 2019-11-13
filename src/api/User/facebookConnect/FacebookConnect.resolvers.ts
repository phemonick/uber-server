import { Resolvers } from "src/types/resolvers";
import { FacebookConnectMutationArgs, FacebookConnectResponse } from "src/types/graph";
import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
    Mutation: {
        FacebookConnect: async (_, args: FacebookConnectMutationArgs): Promise<FacebookConnectResponse>  => {
            const { fbId } = args;
            try {
                const existingUser = await User.findOne({ fbId });
                if (existingUser) {
                    const token = await createJWT(existingUser.id);
                    return {
                        ok: true,
                        error: null,
                        token
                    }
                }
            } catch(error){
                return {
                    ok: false,
                    error: error.message,
                    token: null
                }
            }

            try {
                const newUser = await User.create({...args,
                     profilePhoto: `278

                     http://graph.facebook.com/${fbId}/picture?type=square`
                    }).save();
                    const token = await createJWT(newUser.id);
                return {
                    ok: true,
                    error: null,
                    token
                }

            } catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                }
            }
        }
    }
}

export default resolvers;