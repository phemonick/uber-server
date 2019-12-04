import { withFilter } from "graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
    Subscription: {
        RideStatusSubscription: {
            subscribe: withFilter(
                (_, __, { pubSub }) => pubSub.asyncIterator("rideUpdate"),
                async (payload, _, { context }) => {
                    const user: User = context.currentUser;
                    const {
                        RideStatusSubscription: { pickUpLat, pickUpLng }
                    } = payload;
                    const { lastLat: userLastLat, lastLng: userLastLng } = user;
                    return (
                        pickUpLat >= userLastLat - 0.05 &&
                        pickUpLat <= userLastLat + 0.05 &&
                        pickUpLng >= userLastLng - 0.05 &&
                        pickUpLng <= userLastLng + 0.05
                    )
                }
            )
        }
    }
}

export default resolvers;
