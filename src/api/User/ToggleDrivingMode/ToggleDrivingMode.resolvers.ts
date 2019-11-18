import { Resolvers } from "../../../types/resolvers";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";

const resolvers: Resolvers = {
    Mutation: {
        ToggleDrivingMode: authResolver(async(_, args, { req }) => {
            const user: User = req.user;
            try {
                user.isDriving = !user.isDriving;
                user.save();
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