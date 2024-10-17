import { user } from "@/interfaces/User";
import AuthService from "@/service/auth/auth.service";

const IsUser = async (req, res, next) => {
  try {
    const { sort } = req.cookies;
    const User = await AuthService.CookieValidator(sort);
    const UserJson = User.toJSON();
    req.user = UserJson;
    next();
  } catch (error) {
    res.status(401).send(error);
  }
};

export default IsUser;
