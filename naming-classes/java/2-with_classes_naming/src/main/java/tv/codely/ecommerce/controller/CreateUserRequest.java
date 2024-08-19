package tv.codely.ecommerce.controller;

public record CreateUserRequest(
    String name,
    String surname,
    String email,
    String password,
    String passwordConfirmation
) {
}
