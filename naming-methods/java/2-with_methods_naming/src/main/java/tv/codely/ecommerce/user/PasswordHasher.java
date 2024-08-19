package tv.codely.ecommerce.user;

public interface PasswordHasher {
    String hash(String password);
}
