package tv.codely.ecommerce.controller;

public record UserRequest(
    String name,
    String surname,
    String email,
    String password,
    String passwordConfirmation
) {
}
