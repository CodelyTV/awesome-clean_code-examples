package tv.codely.ecommerce.controller;

public class CreateUserRequestIsValidEnsurer {
    public static void ensure(CreateUserRequest request) {
        if (!isValidRequest(request)) {
            throw new RuntimeException("Invalid Request");
        }
    }

    private static boolean isValidRequest(CreateUserRequest request) {
        return isValidName(request) &&
            isValidSurname(request) &&
            isValidEmail(request) &&
            isValidPassword(request);
    }

    private static boolean isValidName(CreateUserRequest request) {
        return request.name() != null && !request.name().trim().isEmpty();
    }

    private static boolean isValidSurname(CreateUserRequest request) {
        return request.surname() != null && !request.surname().trim().isEmpty();
    }

    private static boolean isValidEmail(CreateUserRequest request) {
        return request.email() != null && request.email().contains("@");
    }

    private static boolean isValidPassword(CreateUserRequest request) {
        return request.password() != null &&
            request.password().length() >= 8 &&
            request.password().equals(request.passwordConfirmation());
    }
}
