import { Resolvers } from "src/types/resolvers";
import authResolver from "../../../utils/authResolver";
import User from "src/entities/User";
import Verification from "../../../entities/Verification";
import { sendVerificationEmail } from "../../../utils/sendEmail";
import { RequestEmailVerificationResponse } from "../../../types/graph";

const resolvers: Resolvers = {
    Mutation: {
        RequestEmailVerification: authResolver(async(_, __, { req }): Promise<RequestEmailVerificationResponse> => {
            const user: User = req.user;
            if(user.email && !user.verifiedEmail) {
                try{
                    const oldVerification = await Verification.findOne({payload: user.email});
                    if(oldVerification) {
                        oldVerification.remove();
                    }
                    const newVerification = await Verification.create({ payload: user.email, target: "EMAIL"}).save();
                    await sendVerificationEmail(user.fullName, newVerification.key);
                    return {
                        ok: true,
                        error: null,
                    }
                } catch(error) {
                    return {
                        ok: false,
                        error: error.message
                    }
                }
            } else {
                return {
                    ok: false,
                    error: "User has no email to verify"
                }
            }
        })
    }
}

export default resolvers;