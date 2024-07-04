package com.example.serversidejsp.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class User {
    @Id
    @Getter
    @Setter
    String username;
    @Getter
    @Setter
    String password;
}
