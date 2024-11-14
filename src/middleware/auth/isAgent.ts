import AuthService from "@/service/auth/auth.service";

 export const isAgency = async (req, res, next) => {

    try {
        const {c_c_date, time_c} = req.cookies;
        const user = await AuthService.agentCookieValidator(c_c_date, time_c)
        const jsonUser  = user.toJSON();
        delete jsonUser.session;
        req.agent = jsonUser;
        next()
    } catch (error) {
        console.log("error", error)
        res.status(401).send(error)
    }
}