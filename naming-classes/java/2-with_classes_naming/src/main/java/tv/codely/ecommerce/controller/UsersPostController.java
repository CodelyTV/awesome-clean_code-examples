package tv.codely.ecommerce.controller;

import tv.codely.ecommerce.user.PasswordHasher;
import tv.codely.ecommerce.user.UserCreator;
import tv.codely.ecommerce.user.UserRepository;

public class UsersPostController {
    private final UserCreator creator;

    public UsersPostController(UserRepository repository, PasswordHasher passwordHasher) {
        this.creator = new UserCreator(repository, passwordHasher);
    }

    public Response post(CreateUserRequest request) {
        try {
            CreateUserRequestIsValidEnsurer.ensure(request);

            var user = creator.create(request);

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
}
