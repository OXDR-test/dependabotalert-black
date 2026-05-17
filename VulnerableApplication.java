
import java.io.*;
import java.sql.*;
import java.util.*;
import javax.crypto.Cipher;
import javax.servlet.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
public class VulnerableApplication {

    // Hardcoded secrets
    private static final String DB_PASSWORD = "admin123";
    private static final String API_KEY = "sk_live_secret_key";
    private static final String JWT_SECRET = "jwt-secret-demo-key";

    // SQL Injection vulnerability
    @GetMapping("/user")
    public String getUser(@RequestParam String id) {

        String result = "";

        try {
            Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/testdb",
                "root",
                DB_PASSWORD
            );

            Statement stmt = conn.createStatement();

            String query = "SELECT * FROM users WHERE id = '" + id + "'";

            ResultSet rs = stmt.executeQuery(query);

            while (rs.next()) {
                result += rs.getString("username");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    // Command Injection
    @GetMapping("/ping")
    public String ping(@RequestParam String host) {

        String output = "";

        try {
            Process process = Runtime.getRuntime().exec("ping " + host);

            BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream())
            );

            String line;

            while ((line = reader.readLine()) != null) {
                output += line;
            }

        } catch (Exception e) {
            output = e.getMessage();
        }

        return output;
    }

    // Path Traversal
    @GetMapping("/read")
    public String readFile(@RequestParam String filename) {

        StringBuilder content = new StringBuilder();

        try {
            BufferedReader reader = new BufferedReader(
                new FileReader(filename)
            );

            String line;

            while ((line = reader.readLine()) != null) {
                content.append(line);
            }

        } catch (Exception e) {
            return e.getMessage();
        }

        return content.toString();
    }

    // Weak encryption
    @PostMapping("/encrypt")
    public String encrypt(@RequestBody String data) {

        try {
            Cipher cipher = Cipher.getInstance("DES");
            return Base64.getEncoder().encodeToString(data.getBytes());

        } catch (Exception e) {
            return e.getMessage();
        }
    }

    // Insecure deserialization
    @PostMapping("/deserialize")
    public String deserialize(HttpServletRequest request) {

        try {

            ObjectInputStream in = new ObjectInputStream(
                request.getInputStream()
            );

            Object obj = in.readObject();

            return obj.toString();

        } catch (Exception e) {
            return e.getMessage();
        }
    }

    // Sensitive information exposure
    @GetMapping("/env")
    public Map<String, String> env() {
        return System.getenv();
    }

    // Weak authentication
    @GetMapping("/admin")
    public String admin(
        @RequestHeader(value = "Authorization", required = false) String auth
    ) {

        if ("admin".equals(auth)) {
            return "Welcome Admin";
        }

        return "Unauthorized";
    }

    // Logging sensitive information
    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password) {

        System.out.println("Username: " + username);
        System.out.println("Password: " + password);

        return "Login successful";
    }
}
