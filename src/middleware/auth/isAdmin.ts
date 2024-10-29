import { user } from "@/interfaces/User";
import AuthService from "@/service/auth/auth.service";

const IsAdmin = async (req, res, next) => {
  try {
    // DATE For Token Authentication and hi for validation sessions
    const { date, hi } = req.cookies;
    const User = await AuthService.CookieValidator(date, hi);
    const UserJson = User.toJSON();
    req.user = UserJson;
    next();
  } catch (error) {
    res.status(401).send(error);
  }
};

export default IsAdmin;
