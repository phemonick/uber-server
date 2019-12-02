import { Resolvers } from "../../../types/resolvers";
import authResolver from "../../../utils/authResolver";
import User from "../../../entities/User";
import { GetNearbyRidesResponse } from "../../../types/graph";
import { getRepository, Between } from "typeorm";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
    Query: {
        GetNearbyRides: authResolver((async(_, __, { req }): Promise<GetNearbyRidesResponse> => {
            const user: User = req.user;
            if(user.isDriving) {
                const { lastLat, lastLng } = user;
                try {
                    const ride = await getRepository(Ride).findOne({
                        status: "REQUESTING",
                        pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
                        pickUpLng: Between(lastLng - 0.05, lastLng + 0.05)
                    });
                    if(ride) {
                        return {
                            ok: true,
                            error: null,
                            ride
                        }
                    } else {
                            return {
                                ok: false,
                                error: "No ride present",
                                ride: null
                            }
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
                    error: "You are no a driver",
                    ride: null
                }
            }
        }))
    }
}

export default resolvers;