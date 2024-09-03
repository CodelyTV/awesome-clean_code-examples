package tv.codely.ecommerce.user;

public final class User {
    private Integer userId;
    private String userName;
    private String userSurname;
    private String userEmail;
    private String userPassword;

    public User(
        Integer userId,
        String userName,
        String userSurname,
        String userEmail,
        String userPassword
    ) {
        this.userId = userId;
        this.userName = userName;
        this.userSurname = userSurname;
        this.userEmail = userEmail;
        this.userPassword = userPassword;
    }

    public Integer getUserId() {
        return userId;
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

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String toJson() {
        return """
            {"id": %d,"name": "%s","surname": "%s","email": "%s"}
            """.formatted(userId, userName, userSurname, userEmail);
    }
}
