import { Resolvers } from "src/types/resolvers";
import { EmailSignUpMutationArgs, EmailSignUpResponse } from "src/types/graph";
import User from "../../../entities/User";

const resolvers: Resolvers = {
    Mutation: {
        EmailSignUp: async(_, args: EmailSignUpMutationArgs): Promise<EmailSignUpResponse> => {

            const { email } = args;
            try {
                const existingUser = await User.findOne({ email });
                if(existingUser) {
                    return {
                        ok: false,
                        error: " User exist, You should login instead",
                        token: null
                    }
                    
                } else {
                    const newUser = await User.create({ ...args }).save();
                    return {
                        ok: true,
                        error: null,
                        token: "Coming Soon"
                    }
                }
            } catch(error) {
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
