package tv.codely.ecommerce.controller;

import tv.codely.ecommerce.user.PasswordHasher;
import tv.codely.ecommerce.user.User;
import tv.codely.ecommerce.user.UserRepository;

public class UsersController {
    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    public UsersController(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    public Response post(UserRequest userRequest) {
        try {
            ensureRequestIsValid(userRequest);

            User user = createUser(userRequest);

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

    private User createUser(UserRequest userRequest) {
        ensureUserDoesNotExist(userRequest);

        User user = new User(null, userRequest.name(), userRequest.surname(), userRequest.email(), this.passwordHasher.hash(userRequest.password()));

        Integer userId = this.userRepository.save(user);
        user.setUserId(userId);

        return user;
    }

    private void ensureUserDoesNotExist(UserRequest userRequest) {
        if (this.userRepository.byEmail(userRequest.email()) != null) {
            throw new RuntimeException("User already exists");
        }
    }

    private void ensureRequestIsValid(UserRequest userRequest) {
        if (!isValidRequest(userRequest)) {
            throw new RuntimeException("Invalid Request");
        }
    }

    private boolean isValidRequest(UserRequest userRequest) {
        return isValidName(userRequest) &&
            isValidSurname(userRequest) &&
            isValidEmail(userRequest) &&
            isValidPassword(userRequest);
    }

    private boolean isValidName(UserRequest userRequest) {
        return userRequest.name() != null && !userRequest.name().trim().isEmpty();
    }

    private boolean isValidSurname(UserRequest userRequest) {
        return userRequest.surname() != null && !userRequest.surname().trim().isEmpty();
    }

    private boolean isValidEmail(UserRequest userRequest) {
        return userRequest.email() != null && userRequest.email().contains("@");
    }

    private boolean isValidPassword(UserRequest userRequest) {
        return userRequest.password() != null &&
            userRequest.password().length() >= 8 &&
            userRequest.password().equals(userRequest.passwordConfirmation());
    }
}
