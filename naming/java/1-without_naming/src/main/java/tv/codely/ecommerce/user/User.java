package tv.codely.ecommerce.user;

public final class User {
    private Integer userid;
    private String userName;
    private String userSurname;
    private String userEmail;
    private String userPassword;

    public User(
        Integer userid,
        String userName,
        String userSurname,
        String userEmail,
        String userPassword
    ) {
        this.userid = userid;
        this.userName = userName;
        this.userSurname = userSurname;
        this.userEmail = userEmail;
        this.userPassword = userPassword;
    }

    public Integer getUserid() {
        return userid;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserSurname() {
        return userSurname;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setId(Integer userId) {
        this.userid = userId;
    }

    public String toJson() {
        return """
            {"id": %d,"name": "%s","surname": "%s","email": "%s"}
            """.formatted(userid, userName, userSurname, userEmail);
    }
}
