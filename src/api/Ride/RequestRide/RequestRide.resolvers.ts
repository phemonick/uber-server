import { Resolvers } from "../../../types/resolvers";
import authResolver from "../../../utils/authResolver";
import { RequestRideMutationArgs, RequestRideResponse } from "../../../types/graph";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Mutation: {
        RequestRide: authResolver(async (_, args: RequestRideMutationArgs, {req}): Promise<RequestRideResponse> => {
            const user: User = req.user;
            try {
                const ride = await Ride.create({ ...args, passenger: user }).save();
                return {
                    ok: true,
                    error: null,
                    ride
                }
            } catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    ride: null
                }
            }
        })
    }
}

export default resolvers;