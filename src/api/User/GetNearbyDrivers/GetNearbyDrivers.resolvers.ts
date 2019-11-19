import { Resolvers } from "../../../types/resolvers";
import authResolver from "../../../utils/authResolver";
import { GetNearbyDriversResponse } from "../../../types/graph";
import User from "../../../entities/User";
import { getRepository, Between } from "typeorm";

const resolvers: Resolvers = {
    Query: {
        GetNearbyDrivers: authResolver(async(_, __, { req }): Promise<GetNearbyDriversResponse> => {
            const user : User = req.user;
            const {lastLng, lastLat } =user;
            try {
                const drivers: User[] = await getRepository(User).find({
                    isDriving: true,
                    lastLat: Between(lastLat - 0.05, lastLat + 0.05),
                    lastLng: Between(lastLng - 0.05, lastLng + 0.05)
                });
                return {
                    ok: true,
                    error: null,
                    drivers
                }

            } catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    drivers: null
                }
            }
        })
    }
}

export default resolvers;
