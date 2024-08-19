package tv.codely.ecommerce.controller;

import tv.codely.ecommerce.user.PasswordHasher;
import tv.codely.ecommerce.user.User;
import tv.codely.ecommerce.user.UserRepository;

public class UsersController {
    private final UserRepository repository;
    private final PasswordHasher passwordHasher;

    public UsersController(UserRepository repository, PasswordHasher passwordHasher) {
        this.repository = repository;
        this.passwordHasher = passwordHasher;
    }

    public Response post(UserRequest request) {
        try {
            ensureRequestIsValid(request);

            var user = createUser(request);

            return new Response(201, user.toJson());
        } catch (RuntimeException exception) {
            if (exception.getMessage().equals("Invalid Request")) {
                return new Response(400, "Invalid Request");
            }

            if (exception.getMessage().equals("User already exists")) {
                return new Response(409, "User already exists");
            }

            return new Response(500, "Internal Server Error");
        }
    }

    private User createUser(UserRequest request) {
        ensureUserDoesNotExist(request);

        var user = new User(null, request.name(), request.surname(), request.email(), this.passwordHasher.hash(request.password()));

        var id = this.repository.save(user);
        user.setId(id);

        return user;
    }

    private void ensureUserDoesNotExist(UserRequest request) {
        if (this.repository.byEmail(request.email()) != null) {
            throw new RuntimeException("User already exists");
        }
    }

    private void ensureRequestIsValid(UserRequest request) {
        if (!isValidRequest(request)) {
            throw new RuntimeException("Invalid Request");
        }
    }

    private boolean isValidRequest(UserRequest request) {
        return isValidName(request) &&
            isValidSurname(request) &&
            isValidEmail(request) &&
            isValidPassword(request);
    }

    private boolean isValidName(UserRequest request) {
        return request.name() != null && !request.name().trim().isEmpty();
    }

    private boolean isValidSurname(UserRequest request) {
        return request.surname() != null && !request.surname().trim().isEmpty();
    }

    private boolean isValidEmail(UserRequest request) {
        return request.email() != null && request.email().contains("@");
    }

    private boolean isValidPassword(UserRequest request) {
        return request.password() != null &&
            request.password().length() >= 8 &&
            request.password().equals(request.passwordConfirmation());
    }
}
