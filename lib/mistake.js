class Definer {
  /** general error */
  static general_err1 = "att: something went wrong!";
  static general_err2 = "att: there is no data with that params!";
  static general_err3 = "att: file upload error!";
  /** member  auth related err */
  static auth_err2 = "jwt token creation error";
  static auth_err3 = "att: no member with that mb_nick!";
  static auth_err4 = "att: your creadentials do not match!";
  static auth_err5 = "att: you are not authenticated!";
}
module.exports = Definer;
