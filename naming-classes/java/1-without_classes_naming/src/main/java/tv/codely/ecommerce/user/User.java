package tv.codely.ecommerce.user;

public final class User {
    private Integer id;
    private String name;
    private String surname;
    private String email;
    private String password;

    public User(
        Integer id,
        String name,
        String surname,
        String email,
        String password
    ) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setId(Integer userId) {
        this.id = userId;
    }

    public String toJson() {
        return """
            {"id": %d,"name": "%s","surname": "%s","email": "%s"}
            """.formatted(id, name, surname, email);
    }
}
