import { Resolvers } from "../../../types/resolvers";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import { UpdateRideStatusMutationArgs, UpdateRideStatusResponse } from "../../../types/graph";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Mutation: {
        UpdateRideStatus: authResolver(async(_, args: UpdateRideStatusMutationArgs, { req, pubSub }): Promise<UpdateRideStatusResponse> => {
            const user: User = req.user;
            if(user.isDriving) {
                try {
                    let ride: Ride | undefined;
                    if(args.status === "ACCEPTED") {
                        ride = await Ride.findOne({ id: args.rideId, status: "REQUESTING"})
                        if(ride) {
                            ride.driver = user;
                            user.isTaken = true;
                            user.save();
                        }
                    } else {
                        ride = await Ride.findOne({
                            id: args.rideId,
                            driver: user
                        })
                    }
                    if(ride) {
                        ride.status = args.status;
                        ride.save();
                        pubSub.publish("rideUpdate", { RideStatusSubscription: ride })
                        return {
                            ok: true,
                            error: null
                        }
                    } else {
                        return {
                            ok: false,
                            error: "can't update ride"
                        }
                    }
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message
                    }
                }                
            } else {
                return {
                    ok: false,
                    error: "You are not a driver"
                }
            }
        })
    }
}

export default resolvers;