package tv.codely.ecommerce.user;

import tv.codely.ecommerce.controller.CreateUserRequest;

public class UserCreator {
    private final UserRepository repository;
    private final PasswordHasher passwordHasher;

    public UserCreator(UserRepository repository, PasswordHasher passwordHasher) {
        this.repository = repository;
        this.passwordHasher = passwordHasher;
    }

    public User create(CreateUserRequest request) {
        ensureDoesNotExist(request);

        var user = new User(null, request.name(), request.surname(), request.email(), this.passwordHasher.hash(request.password()));

        var id = this.repository.save(user);
        user.setId(id);

        return user;
    }

    private void ensureDoesNotExist(CreateUserRequest request) {
        if (this.repository.byEmail(request.email()) != null) {
            throw new RuntimeException("User already exists");
        }
    }
}
