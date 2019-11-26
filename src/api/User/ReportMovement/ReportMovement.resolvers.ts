import { Resolvers } from "../../../types/resolvers";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import { ReportMovementResponse, ReportMovementMutationArgs } from "src/types/graph";
import { cleanNullArgs } from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
    Mutation: {
        ReportMovement: authResolver(async(_, args: ReportMovementMutationArgs, { req, pubSub }): Promise<ReportMovementResponse> => {
            const user: User = req.user;
            const notNull = cleanNullArgs(args)
            try {
                await User.update({ id: user.id }, {...notNull});
                pubSub.publish("driverUpdate", { DriversSubscriptions: user })
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