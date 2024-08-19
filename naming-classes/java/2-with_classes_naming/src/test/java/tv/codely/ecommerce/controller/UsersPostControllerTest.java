package tv.codely.ecommerce.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import tv.codely.ecommerce.user.PasswordHasher;
import tv.codely.ecommerce.user.User;
import tv.codely.ecommerce.user.UserRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class UsersPostControllerTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordHasher passwordHasher;
    private UsersPostController usersPostController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        usersPostController = new UsersPostController(userRepository, passwordHasher);
    }

    @Test
    void should_return_400_with_an_invalid_request() {
        CreateUserRequest invalidRequest = new CreateUserRequest("", "Ferrer", "javier@example.com", "password", "password");

        Response response = usersPostController.post(invalidRequest);

        assertEquals(400, response.code());
        assertEquals("Invalid Request", response.message());
    }

    @Test
    void should_return_409_if_the_user_already_exists() {
        CreateUserRequest existingUserRequest = new CreateUserRequest("Javier", "Ferrer", "javier@example.com", "password123", "password123");

        when(userRepository.byEmail("javier@example.com")).thenReturn(new User(1, "Javier", "Ferrer", "javier@example.com", "hashedPassword"));

        Response response = usersPostController.post(existingUserRequest);

        assertEquals(409, response.code());
        assertEquals("User already exists", response.message());
    }

    @Test
    void should_create_a_valid_user() {
        CreateUserRequest validRequest = new CreateUserRequest("Javier", "Ferrer", "javier@example.com", "password123", "password123");

        when(userRepository.byEmail("javier@example.com")).thenReturn(null);
        when(passwordHasher.hash("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(1);

        Response response = usersPostController.post(validRequest);

        assertEquals(201, response.code());
        assertEquals("""
            {"id": %d,"name": "%s","surname": "%s","email": "%s"}
            """.formatted(1, "Javier", "Ferrer", "javier@example.com"), response.message());

        verify(userRepository).save(argThat(user ->
            user.getName().equals("Javier") &&
                user.getSurname().equals("Ferrer") &&
                user.getEmail().equals("javier@example.com") &&
                user.getPassword().equals("hashedPassword")
        ));
    }
}
