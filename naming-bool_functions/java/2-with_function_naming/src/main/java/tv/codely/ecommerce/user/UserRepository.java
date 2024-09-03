package tv.codely.ecommerce.user;

public interface UserRepository {
    Integer save(User user);

    User byEmail(String email);
}
