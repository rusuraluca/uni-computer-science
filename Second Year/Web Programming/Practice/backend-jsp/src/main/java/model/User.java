package model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Entity
public class User {
    @Getter
    @Setter
    @Id
    String username;
    @Getter
    @Setter
    String password;
}
