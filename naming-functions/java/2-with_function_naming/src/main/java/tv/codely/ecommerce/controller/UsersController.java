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
            if (userRequest.name() == null || userRequest.name().trim().isEmpty() || userRequest.surname() == null || userRequest.surname().trim().isEmpty()
                || userRequest.email() == null || !userRequest.email().contains("@") || userRequest.password() == null || userRequest.password().length() < 8
                || !userRequest.password().equals(userRequest.passwordConfirmation())) {
                throw new RuntimeException("Invalid Request");
            }

            if (this.userRepository.byEmail(userRequest.email()) != null) {
                throw new RuntimeException("User already exists");
            }

            User user = new User(null, userRequest.name(), userRequest.surname(), userRequest.email(), this.passwordHasher.hash(userRequest.password()));
            Integer userId = this.userRepository.save(user);
            user.setId(userId);

            return new Response(201, user.toJson());
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Invalid Request")) {
                return new Response(400, "Invalid Request");
            }

            if (e.getMessage().equals("User already exists")) {
                return new Response(409, "User already exists");
            }

            return new Response(500, "Internal Server Error");
        }
    }
}
