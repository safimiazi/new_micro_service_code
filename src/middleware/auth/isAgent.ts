import AuthService from "@/service/auth/auth.service";

 export const isAgent = async (req, res, next) => {

    try {
        const {login, session} = req.cookies;
        const user = await AuthService.agentCookieValidator(login, session)

        const jsonUser  = user.toJSON();
        console.log("session", jsonUser)

        delete jsonUser.session;
        req.agent = jsonUser;
        next()
    } catch (error) {
        console.log("error", error)
        res.status(401).send(error)
    }
}