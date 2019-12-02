import { Resolvers } from "../../../types/resolvers";
import authResolver from "../../../utils/authResolver";
import { RequestRideMutationArgs, RequestRideResponse } from "../../../types/graph";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Mutation: {
        RequestRide: authResolver(async (_, args: RequestRideMutationArgs, {req, pubSub }): Promise<RequestRideResponse> => {
            const user: User = req.user;
            if(!user.isRiding) {
                try {
                    const ride = await Ride.create({ ...args, passenger: user }).save();
                    pubSub.publish("rideRequest", { NearByRideSubscription: ride })
                    user.isRiding = true;
                    user.save();
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
            } else {
                return {
                    ok: false,
                    error: "You cant request two rides",
                    ride: null
                }
            }
        })
    }
}

export default resolvers;